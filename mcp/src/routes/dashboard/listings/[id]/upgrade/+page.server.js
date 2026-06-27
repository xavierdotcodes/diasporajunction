// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { createStripeCheckoutSession } from '$lib/payments/stripe.js';
import { authContextForConvex, requireUser } from '$lib/server/auth.js';
import { convexMutation, convexQuery, withAuth } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function load(event) {
	requireUser(event);
	const auth = authContextForConvex(event);
	return {
		checkout: event.url.searchParams.get('checkout'),
		reference: event.url.searchParams.get('reference') ?? '',
		dashboard: await convexQuery('ownerDashboard:getListingDashboard', withAuth({ listingId: event.params.id }, auth))
	};
}

export const actions = {
	feature: async (event) => {
		const user = requireUser(event);
		const auth = authContextForConvex(event);
		const dashboard = await convexQuery('ownerDashboard:getListingDashboard', withAuth({ listingId: event.params.id }, auth));
		const listing = dashboard?.listing;
		if (!listing?.id) return fail(404, { message: 'Listing not found.' });
		if (listing.isFeatured && (!listing.featuredUntil || listing.featuredUntil > Date.now())) {
			return fail(400, { message: 'This listing is already featured.' });
		}

		const reference = `dj-featured-${event.params.id}-${Date.now()}`;
		try {
			await convexMutation(
				'payments:createCheckoutRecord',
				{
					userId: user.id,
					listingId: event.params.id,
					purpose: 'FEATURED_LISTING',
					provider: 'STRIPE',
					amount: Number(process.env.STRIPE_FEATURED_LISTING_AMOUNT_CENTS ?? 0),
					currency: process.env.STRIPE_FEATURED_LISTING_CURRENCY ?? 'USD',
					reference
				}
			);
			const session = await createStripeCheckoutSession({
				purpose: 'FEATURED_LISTING',
				reference,
				listingId: event.params.id,
				userId: user.id,
				customerEmail: user.email
			});
			await convexMutation(
				'payments:markInitiated',
				{
					reference,
					providerSessionId: session.providerSessionId,
					providerMetadata: { source: 'owner_listing_upgrade', listingId: event.params.id }
				}
			);
			await trySendInngestEvent(INNGEST_EVENTS.APPLICATION_PAYMENT_INITIATED, {
				listingId: event.params.id,
				purpose: 'FEATURED_LISTING',
				reference
			});
			throw redirect(303, session.url);
		} catch (error) {
			if (error?.status) throw error;
			return fail(400, { message: error instanceof Error ? error.message : 'Could not start featured listing checkout.' });
		}
	}
};
