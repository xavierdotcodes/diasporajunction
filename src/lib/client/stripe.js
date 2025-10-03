import { loadStripe } from '@stripe/stripe-js';

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
		console.log('Stripe publishable key in use:', key);
		stripePromise = loadStripe(key);
	}
	return stripePromise;
}

export async function startPayment() {
	const response = await fetch('/api/space/create-payment-intent', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ amount: 19900, currency: 'usd' })
	});
	const { clientSecret } = await response.json();
	return clientSecret;
}

export async function completePayment(clientSecret, cardElement, customer) {
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

	if (paymentIntent.status == 'succeeded') {
		const response = await fetch('/api/space/complete-order', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ paymentIntentId: paymentIntent.id, customer })
		});

		const order = await response.json();
		return order;
	} else if (paymentIntent.status === 'requires_payment_method') {
		// Declined → return error to front-end so user can retry
		return json(
			{ error: 'Payment declined, please try another card.', status: paymentIntent.status },
			{ status: 402 }
		);
	} else if (paymentIntent.status === 'requires_action') {
		// Needs 3D Secure / additional authentication
		return json(
			{
				error: 'Payment requires additional authentication.',
				status: paymentIntent.status,
				clientSecret: paymentIntent.client_secret
			},
			{ status: 200 }
		);
	} else {
		// Other unexpected statuses
		return json(
			{ error: 'Unexpected payment status.', status: paymentIntent.status },
			{ status: 400 }
		);
	}
	if (error) {
		console.error('Payment failed:', error.message);
		throw error;
	}
}

// ---- NEW ----
export async function cancelPaymentIntent(clientSecret) {
	// Extract PaymentIntent ID from clientSecret
	const paymentIntentId = clientSecret.split('_secret')[0];

	// Call your server endpoint to cancel
	const response = await fetch('/api/space/cancel-payment-intent', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ paymentIntentId })
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Failed to cancel PaymentIntent: ${text}`);
	}

	const result = await response.json();
	return result;
}
