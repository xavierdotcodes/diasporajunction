import Stripe from 'stripe';

export const STRIPE_API_VERSION = '2026-03-25.dahlia';

const priceEnvByPurpose = {
	LISTING_APPLICATION_FEE: 'STRIPE_APPLICATION_FEE_PRICE_ID',
	VERIFICATION_FEE: 'STRIPE_VERIFICATION_FEE_PRICE_ID',
	FEATURED_LISTING: 'STRIPE_FEATURED_LISTING_PRICE_ID',
	SUBSCRIPTION: 'STRIPE_SUBSCRIPTION_PRICE_ID'
};

export function getStripeConfig(env = process.env) {
	return {
		secretKey: env.STRIPE_SECRET_KEY,
		appBaseUrl: env.APP_BASE_URL ?? env.PUBLIC_APP_URL ?? 'http://localhost:5173',
		priceIds: {
			LISTING_APPLICATION_FEE: env.STRIPE_APPLICATION_FEE_PRICE_ID,
			VERIFICATION_FEE: env.STRIPE_VERIFICATION_FEE_PRICE_ID,
			FEATURED_LISTING: env.STRIPE_FEATURED_LISTING_PRICE_ID,
			SUBSCRIPTION: env.STRIPE_SUBSCRIPTION_PRICE_ID
		},
		webhookSecret: env.STRIPE_WEBHOOK_SECRET
	};
}

export function assertStripeReadyForCheckout(purpose, env = process.env) {
	const config = getStripeConfig(env);
	const missing = [];
	if (!config.secretKey) missing.push('STRIPE_SECRET_KEY');
	const priceEnv = priceEnvByPurpose[purpose];
	if (!priceEnv) throw new Error(`Stripe checkout is not configured for purpose ${purpose}.`);
	if (!config.priceIds[purpose]) missing.push(priceEnv);
	if (missing.length) {
		const error = new Error(`Missing Stripe checkout config: ${missing.join(', ')}`);
		error.missingConfig = missing;
		throw error;
	}
	return config;
}

export function createStripeClient(secretKey = process.env.STRIPE_SECRET_KEY) {
	if (!secretKey) throw new Error('STRIPE_SECRET_KEY is required.');
	return new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
}

export async function createStripeCheckoutSession(input, env = process.env) {
	const config = assertStripeReadyForCheckout(input.purpose, env);
	const stripe = input.stripe ?? createStripeClient(config.secretKey);
	const price = config.priceIds[input.purpose];
	const successUrl =
		input.successUrl ??
		(input.applicationId
			? `${config.appBaseUrl}/apply/${input.applicationId}/success?session_id={CHECKOUT_SESSION_ID}`
			: `${config.appBaseUrl}/dashboard/listings/${input.listingId}/upgrade?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
	const cancelUrl =
		input.cancelUrl ??
		(input.applicationId
			? `${config.appBaseUrl}/apply/${input.applicationId}/cancel`
			: `${config.appBaseUrl}/dashboard/listings/${input.listingId}/upgrade?checkout=cancel`);
	const session = await stripe.checkout.sessions.create({
		mode: input.purpose === 'SUBSCRIPTION' ? 'subscription' : 'payment',
		line_items: [{ price, quantity: 1 }],
		success_url: successUrl,
		cancel_url: cancelUrl,
		client_reference_id: input.reference,
		customer_email: input.customerEmail,
		metadata: compact({
			reference: input.reference,
			purpose: input.purpose,
			applicationId: input.applicationId,
			listingId: input.listingId,
			userId: input.userId
		})
	});
	return {
		url: session.url,
		providerSessionId: session.id
	};
}

export function verifyStripeWebhook({ body, signature, env = process.env, stripe }) {
	const config = getStripeConfig(env);
	if (!config.webhookSecret) {
		const error = new Error('STRIPE_WEBHOOK_SECRET is required.');
		error.missingConfig = ['STRIPE_WEBHOOK_SECRET'];
		throw error;
	}
	const client = stripe ?? createStripeClient(config.secretKey);
	return client.webhooks.constructEvent(body, signature, config.webhookSecret);
}

export function normalizeStripeEvent(event) {
	const object = event.data?.object ?? {};
	return {
		eventId: event.id,
		type: event.type,
		reference: object.metadata?.reference ?? object.client_reference_id,
		applicationId: object.metadata?.applicationId,
		listingId: object.metadata?.listingId,
		providerSessionId: object.id,
		providerPaymentId: object.id,
		providerCustomerId: object.customer,
		paymentStatus: object.payment_status ?? object.status,
		providerMetadata: compact({
			eventType: event.type,
			stripeObjectId: object.id,
			paymentIntentId: object.payment_intent,
			reference: object.metadata?.reference ?? object.client_reference_id,
			paymentStatus: object.payment_status ?? object.status,
			applicationId: object.metadata?.applicationId,
			listingId: object.metadata?.listingId,
			purpose: object.metadata?.purpose
		})
	};
}

export function stripeEventToConvexMutation(event) {
	if (['checkout.session.completed', 'payment_intent.succeeded', 'invoice.paid'].includes(event.type)) {
		return 'payments:markSucceededFromWebhook';
	}
	if (event.type === 'payment_intent.payment_failed') return 'payments:markFailedFromWebhook';
	if (event.type === 'checkout.session.expired') return 'payments:markAbandoned';
	return null;
}

function compact(value) {
	return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));
}
