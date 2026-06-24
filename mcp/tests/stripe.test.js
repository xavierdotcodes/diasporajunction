import { describe, expect, it } from 'vitest';
import {
	assertStripeReadyForCheckout,
	createStripeCheckoutSession,
	normalizeStripeEvent,
	stripeEventToConvexMutation,
	verifyStripeWebhook
} from '../src/lib/payments/stripe.js';

describe('stripe provider adapter', () => {
	it('reports missing checkout config without exposing secrets', () => {
		expect(() => assertStripeReadyForCheckout('LISTING_APPLICATION_FEE', {})).toThrow(
			/STRIPE_SECRET_KEY/
		);
		expect(() =>
			assertStripeReadyForCheckout('LISTING_APPLICATION_FEE', { STRIPE_SECRET_KEY: 'sk_test_secret' })
		).toThrow(/STRIPE_APPLICATION_FEE_PRICE_ID/);
	});

	it('creates a checkout session with metadata and configured price', async () => {
		const calls = [];
		const stripe = {
			checkout: {
				sessions: {
					create: async (payload) => {
						calls.push(payload);
						return { id: 'cs_test', url: 'https://checkout.stripe.test' };
					}
				}
			}
		};
		const session = await createStripeCheckoutSession(
			{
				stripe,
				purpose: 'LISTING_APPLICATION_FEE',
				reference: 'dj-ref',
				applicationId: 'app123',
				customerEmail: 'owner@example.test'
			},
			{
				STRIPE_SECRET_KEY: 'sk_test_secret',
				STRIPE_APPLICATION_FEE_PRICE_ID: 'price_application',
				APP_BASE_URL: 'https://diasporajunxion.test'
			}
		);
		expect(session.url).toBe('https://checkout.stripe.test');
		expect(calls[0]).toMatchObject({
			mode: 'payment',
			line_items: [{ price: 'price_application', quantity: 1 }],
			customer_email: 'owner@example.test',
			metadata: { reference: 'dj-ref', purpose: 'LISTING_APPLICATION_FEE', applicationId: 'app123' }
		});
	});

	it('fails webhook verification when secret is missing', () => {
		expect(() => verifyStripeWebhook({ body: '{}', signature: 'sig', env: { STRIPE_SECRET_KEY: 'sk' } })).toThrow(
			/STRIPE_WEBHOOK_SECRET/
		);
	});

	it('normalizes Stripe events into internal payment events', () => {
		const event = {
			id: 'evt_123',
			type: 'checkout.session.completed',
			data: {
				object: {
					object: 'checkout.session',
					id: 'cs_123',
					payment_intent: 'pi_123',
					customer: 'cus_123',
					payment_status: 'paid',
					metadata: { reference: 'dj-ref', applicationId: 'app123' }
				}
			}
		};
		expect(stripeEventToConvexMutation(event)).toBe('payments:markSucceededFromWebhook');
		expect(normalizeStripeEvent(event)).toMatchObject({
			stripeEventId: 'evt_123',
			reference: 'dj-ref',
			providerSessionId: 'cs_123',
			providerPaymentId: 'pi_123',
			providerCustomerId: 'cus_123'
		});
	});

	it('maps failed and expired Stripe events to safe webhook mutations', () => {
		expect(stripeEventToConvexMutation({ type: 'payment_intent.payment_failed' })).toBe(
			'payments:markFailedFromWebhook'
		);
		expect(stripeEventToConvexMutation({ type: 'checkout.session.expired' })).toBe('payments:markAbandoned');
		expect(stripeEventToConvexMutation({ type: 'customer.created' })).toBeNull();
	});
});
