// @ts-nocheck
import { describe, expect, it } from 'vitest';
import {
	assertStripeReadyForCheckout,
	createStripeCheckoutSession,
	normalizeStripeEvent,
	stripeEventToConvexMutation,
	verifyStripeWebhook
} from '../src/lib/payments/stripe.js';

describe('stripe provider adapter', () => {
	it('detects missing checkout configuration', () => {
		expect(() => assertStripeReadyForCheckout('LISTING_APPLICATION_FEE', {})).toThrow(/STRIPE_SECRET_KEY/);
	});

	it('creates an application checkout session with metadata and configured price', async () => {
		const calls = [];
		const stripe = fakeStripe(calls, 'cs_application', 'https://checkout.stripe.test');
		const session = await createStripeCheckoutSession(
			{
				stripe,
				purpose: 'LISTING_APPLICATION_FEE',
				reference: 'dj-ref',
				applicationId: 'app123',
				userId: 'user123',
				customerEmail: 'owner@example.test'
			},
			{
				STRIPE_SECRET_KEY: 'sk_test_secret',
				STRIPE_APPLICATION_FEE_PRICE_ID: 'price_application',
				APP_BASE_URL: 'https://diasporajunxion.test'
			}
		);
		expect(session).toEqual({ providerSessionId: 'cs_application', url: 'https://checkout.stripe.test' });
		expect(calls[0]).toMatchObject({
			mode: 'payment',
			line_items: [{ price: 'price_application', quantity: 1 }],
			client_reference_id: 'dj-ref',
			metadata: { reference: 'dj-ref', purpose: 'LISTING_APPLICATION_FEE', applicationId: 'app123', userId: 'user123' }
		});
		expect(calls[0].success_url).toContain('/apply/app123/success');
	});

	it('creates a featured listing checkout session with listing metadata', async () => {
		const calls = [];
		const stripe = fakeStripe(calls, 'cs_featured', 'https://checkout.stripe.test/featured');
		const session = await createStripeCheckoutSession(
			{
				stripe,
				purpose: 'FEATURED_LISTING',
				reference: 'dj-featured-ref',
				listingId: 'listing123',
				userId: 'owner123',
				customerEmail: 'owner@example.test'
			},
			{
				STRIPE_SECRET_KEY: 'sk_test_secret',
				STRIPE_FEATURED_LISTING_PRICE_ID: 'price_featured',
				APP_BASE_URL: 'https://diasporajunxion.test'
			}
		);
		expect(session.url).toBe('https://checkout.stripe.test/featured');
		expect(calls[0]).toMatchObject({
			mode: 'payment',
			line_items: [{ price: 'price_featured', quantity: 1 }],
			client_reference_id: 'dj-featured-ref',
			metadata: { reference: 'dj-featured-ref', purpose: 'FEATURED_LISTING', listingId: 'listing123', userId: 'owner123' }
		});
		expect(calls[0].success_url).toContain('/dashboard/listings/listing123/upgrade?checkout=success');
		expect(calls[0].cancel_url).toContain('/dashboard/listings/listing123/upgrade?checkout=cancel');
	});

	it('normalizes Stripe events into internal payment events', () => {
		const normalized = normalizeStripeEvent({
			id: 'evt_123',
			type: 'checkout.session.completed',
			data: {
				object: {
					id: 'cs_123',
					payment_intent: 'pi_123',
					customer: 'cus_123',
					payment_status: 'paid',
					metadata: { reference: 'dj-ref', applicationId: 'app123', listingId: 'listing123', purpose: 'FEATURED_LISTING' }
				}
			}
		});
		expect(normalized).toMatchObject({
			eventId: 'evt_123',
			type: 'checkout.session.completed',
			reference: 'dj-ref',
			applicationId: 'app123',
			listingId: 'listing123',
			providerSessionId: 'cs_123',
			providerPaymentId: 'cs_123',
			providerCustomerId: 'cus_123',
			paymentStatus: 'paid',
			providerMetadata: {
				eventType: 'checkout.session.completed',
				reference: 'dj-ref',
				stripeObjectId: 'cs_123',
				paymentIntentId: 'pi_123',
				applicationId: 'app123',
				listingId: 'listing123',
				purpose: 'FEATURED_LISTING'
			}
		});
		expect(stripeEventToConvexMutation({ type: 'checkout.session.completed' })).toBe('payments:markSucceededFromWebhook');
	});

	it('maps failed and expired Stripe events to safe webhook mutations', () => {
		expect(stripeEventToConvexMutation({ type: 'payment_intent.payment_failed' })).toBe('payments:markFailedFromWebhook');
		expect(stripeEventToConvexMutation({ type: 'checkout.session.expired' })).toBe('payments:markAbandoned');
		expect(stripeEventToConvexMutation({ type: 'customer.created' })).toBeNull();
	});

	it('fails webhook verification when secret is missing', () => {
		expect(() => verifyStripeWebhook({ body: '{}', signature: 'sig', env: { STRIPE_SECRET_KEY: 'sk' } })).toThrow(
			/STRIPE_WEBHOOK_SECRET/
		);
	});
});

function fakeStripe(calls, id, url) {
	return {
		checkout: {
			sessions: {
				create: async (payload) => {
					calls.push(payload);
					return { id, url };
				}
			}
		}
	};
}
