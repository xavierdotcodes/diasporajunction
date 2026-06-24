import Stripe from 'stripe';

export const STRIPE_API_VERSION = '2026-03-25.dahlia';

const priceEnvByPurpose = {
	LISTING_APPLICATION_FEE: 'STRIPE_APPLICATION_FEE_PRICE_ID',
	VERIFICATION_FEE: 'STRIPE_VERIFICATION_FEE_PRICE_ID',
	FEATURED_LISTING: 'STRIPE_FEATURED_LISTING_PRICE_ID'
};

export function getStripeConfig(env = process.env) {
	return {
		secretKey: env.STRIPE_SECRET_KEY || '',
		webhookSecret: env.STRIPE_WEBHOOK_SECRET || '',
		appBaseUrl: env.APP_BASE_URL || env.PUBLIC_APP_URL || 'http://localhost:5173',
		priceIds: {
			LISTING_APPLICATION_FEE: env.STRIPE_APPLICATION_FEE_PRICE_ID || '',
			VERIFICATION_FEE: env.STRIPE_VERIFICATION_FEE_PRICE_ID || '',
			FEATURED_LISTING: env.STRIPE_FEATURED_LISTING_PRICE_ID || ''
		}
	};
}

export function assertStripeReadyForCheckout(purpose, env = process.env) {
	const config = getStripeConfig(env);
	const missing = [];
	if (!config.secretKey) missing.push('STRIPE_SECRET_KEY');
	const priceEnv = priceEnvByPurpose[purpose];
	if (!priceEnv) throw new Error(`Stripe checkout is not configured for purpose ${purpose}.`);
	if (!env[priceEnv]) missing.push(priceEnv);
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
		input.successUrl ?? `${config.appBaseUrl}/apply/${input.applicationId ?? 'payment'}/success?session_id={CHECKOUT_SESSION_ID}`;
	const cancelUrl = input.cancelUrl ?? `${config.appBaseUrl}/apply/${input.applicationId ?? 'payment'}/cancel`;

	return await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [{ price, quantity: 1 }],
		success_url: successUrl,
		cancel_url: cancelUrl,
		customer_email: input.customerEmail,
		metadata: {
			reference: input.reference,
			purpose: input.purpose,
			applicationId: input.applicationId ?? '',
			listingId: input.listingId ?? '',
			userId: input.userId ?? ''
		},
		payment_intent_data: {
			metadata: {
				reference: input.reference,
				purpose: input.purpose,
				applicationId: input.applicationId ?? '',
				listingId: input.listingId ?? ''
			}
		}
	});
}

export function verifyStripeWebhook({ body, signature, env = process.env, stripe }) {
	const config = getStripeConfig(env);
	if (!config.webhookSecret) {
		const error = new Error('STRIPE_WEBHOOK_SECRET is required.');
		error.missingConfig = ['STRIPE_WEBHOOK_SECRET'];
		throw error;
	}
	return (stripe ?? createStripeClient(config.secretKey)).webhooks.constructEvent(
		body,
		signature,
		config.webhookSecret
	);
}

export function normalizeStripeEvent(event) {
	const object = event.data?.object ?? {};
	const metadata = object.metadata ?? {};
	const reference = metadata.reference;
	const providerSessionId = object.object === 'checkout.session' ? object.id : undefined;
	const providerPaymentId =
		typeof object.payment_intent === 'string'
			? object.payment_intent
			: object.payment_intent?.id ?? (object.object === 'payment_intent' ? object.id : undefined);

	return {
		stripeEventId: event.id,
		type: event.type,
		reference,
		applicationId: metadata.applicationId || undefined,
		listingId: metadata.listingId || undefined,
		providerSessionId,
		providerPaymentId,
		providerCustomerId: typeof object.customer === 'string' ? object.customer : object.customer?.id,
		providerMetadata: {
			stripeEventType: event.type,
			stripeObjectId: object.id,
			paymentStatus: object.payment_status ?? object.status,
			metadata
		}
	};
}

export function stripeEventToConvexMutation(event) {
	if (['checkout.session.completed', 'payment_intent.succeeded'].includes(event.type)) {
		return 'payments:markSucceededFromWebhook';
	}
	if (event.type === 'payment_intent.payment_failed') return 'payments:markFailedFromWebhook';
	if (event.type === 'checkout.session.expired') return 'payments:markAbandoned';
	return null;
}
