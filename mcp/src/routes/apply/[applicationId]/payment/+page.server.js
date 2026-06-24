import { fail, redirect } from '@sveltejs/kit';
import { convexMutation, convexQuery } from '$lib/server/convex.js';
import { createStripeCheckoutSession } from '$lib/payments/stripe.js';
import { authContextForConvex, requireApplicationAccess } from '$lib/server/auth.js';
import { withAuth } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function load(event) {
	const auth = authContextForConvex(event);
	const application = await convexQuery(
		'applications:getById',
		withAuth({ applicationId: event.params.applicationId }, auth)
	);
	requireApplicationAccess(event, application);
	return { application };
}

export const actions = {
	default: async (event) => {
		const auth = authContextForConvex(event);
		const application = await convexQuery(
			'applications:getById',
			withAuth({ applicationId: event.params.applicationId }, auth)
		);
		requireApplicationAccess(event, application);
		if (!application) return fail(404, { message: 'Application not found.' });
		const reference = application.paymentReference || `dj-${event.params.applicationId}-${Date.now()}`;
		try {
			await convexMutation('payments:createCheckoutRecord', {
				applicationId: event.params.applicationId,
				purpose: 'LISTING_APPLICATION_FEE',
				provider: 'STRIPE',
				amount: Number(process.env.STRIPE_APPLICATION_FEE_AMOUNT_CENTS || 0),
				currency: process.env.STRIPE_APPLICATION_FEE_CURRENCY || 'USD',
				reference
			});
			const session = await createStripeCheckoutSession({
				purpose: 'LISTING_APPLICATION_FEE',
				reference,
				applicationId: event.params.applicationId,
				customerEmail: application.email
			});
			await convexMutation('payments:markInitiated', {
				reference,
				providerSessionId: session.id,
				providerPaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
				providerCustomerId: typeof session.customer === 'string' ? session.customer : undefined,
				providerMetadata: { checkoutUrlCreated: true }
			});
			await trySendInngestEvent(INNGEST_EVENTS.APPLICATION_PAYMENT_INITIATED, {
				applicationId: event.params.applicationId,
				reference,
				provider: 'STRIPE',
				providerSessionId: session.id
			});
			throw redirect(303, session.url);
		} catch (error) {
			if (error?.status) throw error;
			return fail(400, {
				message: error instanceof Error ? error.message : 'Stripe checkout could not be started.',
				missingConfig: error?.missingConfig ?? []
			});
		}
	}
};
