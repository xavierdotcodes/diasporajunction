import { createStripeCheckoutSession } from './stripe.js';
import { assertPaymentPurpose } from './types.js';

export async function createCheckoutSession(input) {
	assertPaymentPurpose(input.purpose);
	if ((input.provider ?? 'STRIPE') !== 'STRIPE') {
		throw new Error('Only Stripe Checkout is implemented in v1.');
	}
	return await createStripeCheckoutSession(input);
}
