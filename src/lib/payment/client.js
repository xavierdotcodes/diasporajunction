import { loadStripe } from '@stripe/stripe-js';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/lib/payment/client.js');

let stripePromise;

function getPublishableKey() {
	const isDev = import.meta.env.MODE === 'development';
	return isDev
		? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST
		: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_LIVE;
}

export function getStripe() {
	if (!stripePromise) {
		const key = getPublishableKey();
		log.info({
			phase: 'stripe_client_requested',
			mode: import.meta.env.MODE,
			keyConfigured: Boolean(key)
		});
		stripePromise = loadStripe(key);
	}
	return stripePromise;
}

export async function startPayment() {
	log.info({
		phase: 'payment_session_start_requested',
		amount: 19900,
		currency: 'usd'
	});

	const response = await fetch('/api/space/create-payment-intent', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ amount: 19900, currency: 'usd' })
	});
	const { clientSecret } = await response.json();
	log.info({
		phase: 'payment_session_start_completed',
		clientSecretReceived: Boolean(clientSecret)
	});
	return clientSecret;
}

export async function completePayment(clientSecret, cardElement, customer) {
	log.info({
		phase: 'payment_confirmation_started',
		emailDomain: customer?.email?.split('@')[1]
	});

	const stripe = await getStripe();
	const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
		payment_method: {
			card: cardElement,
			billing_details: {
				name: customer.name,
				email: customer.email,
				address: {
					line1: customer.street,
					line2: customer.apt,
					city: customer.city,
					state: customer.state,
					postal_code: customer.zip,
					country: customer.country
				}
			}
		}
	});

	if (error) {
		log.error({
			phase: 'payment_confirmation_failed',
			error: serializeError(error)
		});
		throw error;
	}

	if (paymentIntent.status == 'succeeded') {
		log.info({
			phase: 'payment_intent_succeeded',
			paymentIntentId: paymentIntent.id
		});

		const response = await fetch('/api/space/complete-order', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ paymentIntentId: paymentIntent.id, customer })
		});

		const order = await response.json();
		log.info({
			phase: 'payment_order_completed',
			orderId: order?.id,
			paymentIntentId: paymentIntent.id
		});
		return {
			status: 'succeeded',
			id: order?.id ?? paymentIntent.id,
			order
		};
	} else if (paymentIntent.status === 'requires_payment_method') {
		log.warn({
			phase: 'payment_requires_payment_method',
			paymentIntentId: paymentIntent.id
		});
		return {
			status: paymentIntent.status,
			error: 'Payment declined, please try another card.'
		};
	} else if (paymentIntent.status === 'requires_action') {
		log.info({
			phase: 'payment_requires_action',
			paymentIntentId: paymentIntent.id
		});
		return {
			status: paymentIntent.status,
			error: 'Payment requires additional authentication.',
			client_secret: paymentIntent.client_secret
		};
	} else {
		log.warn({
			phase: 'payment_unexpected_status',
			status: paymentIntent.status,
			paymentIntentId: paymentIntent.id
		});
		return {
			status: paymentIntent.status,
			error: 'Unexpected payment status.'
		};
	}
}

// ---- NEW ----
export async function cancelPaymentIntent(clientSecret) {
	// Extract PaymentIntent ID from clientSecret
	const paymentIntentId = clientSecret.split('_secret')[0];

	log.info({
		phase: 'payment_intent_cancel_requested',
		paymentIntentId
	});

	// Call your server endpoint to cancel
	const response = await fetch('/api/space/cancel-payment-intent', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ paymentIntentId })
	});

	if (!response.ok) {
		const text = await response.text();
		log.error({
			phase: 'payment_intent_cancel_failed',
			paymentIntentId,
			status: response.status
		});
		throw new Error(`Failed to cancel PaymentIntent: ${text}`);
	}

	const result = await response.json();
	log.info({
		phase: 'payment_intent_cancel_completed',
		paymentIntentId
	});
	return result;
}
