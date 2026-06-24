import Stripe from 'stripe';
import { paymentPurposePriceEnv } from './types.js';

const STRIPE_API_VERSION = '2026-03-25.dahlia';

export function createStripeClient(secretKey = process.env.STRIPE_SECRET_KEY) {
	if (!secretKey) throw new Error('STRIPE_SECRET_KEY is required.');
	return new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
}

export function getStripePriceIdForPurpose(purpose, env = process.env) {
	const envName = paymentPurposePriceEnv[purpose];
	if (!envName) throw new Error(`No Stripe price configured for purpose ${purpose}.`);
	const priceId = env[envName];
	if (!priceId) throw new Error(`${envName} is required for ${purpose}.`);
	return priceId;
}

export async function createStripeCheckoutSession({
	stripe = createStripeClient(),
	purpose,
	reference,
	applicationId,
	listingId,
	userId,
	successUrl,
	cancelUrl,
	customerEmail
}) {
	const mode = purpose === 'SUBSCRIPTION' ? 'subscription' : 'payment';
	const price = getStripePriceIdForPurpose(purpose);
	return await stripe.checkout.sessions.create({
		mode,
		line_items: [{ price, quantity: 1 }],
		success_url: successUrl,
		cancel_url: cancelUrl,
		customer_email: customerEmail,
		metadata: {
			reference,
			purpose,
			applicationId: applicationId ?? '',
			listingId: listingId ?? '',
			userId: userId ?? ''
		},
		subscription_data:
			mode === 'subscription'
				? { metadata: { reference, purpose, applicationId: applicationId ?? '', listingId: listingId ?? '' } }
				: undefined,
		payment_intent_data:
			mode === 'payment'
				? { metadata: { reference, purpose, applicationId: applicationId ?? '', listingId: listingId ?? '' } }
				: undefined
	});
}

export function constructStripeWebhookEvent({ stripe = createStripeClient(), body, signature, secret }) {
	if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is required.');
	return stripe.webhooks.constructEvent(body, signature, secret);
}
