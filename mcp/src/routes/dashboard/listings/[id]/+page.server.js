// @ts-nocheck
import { fail } from '@sveltejs/kit';
import { authContextForConvex, requireUser } from '$lib/server/auth.js';
import { convexMutation, convexQuery, withAuth } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function load(event) {
	requireUser(event);
	const auth = authContextForConvex(event);
	return {
		dashboard: await convexQuery('ownerDashboard:getListingDashboard', withAuth({ listingId: event.params.id }, auth))
	};
}

export const actions = {
	requestSuggestion: async (event) => {
		requireUser(event);
		const auth = authContextForConvex(event);
		try {
			await convexMutation('ownerDashboard:requestListingImprovementSuggestions', withAuth({ listingId: event.params.id }, auth));
			await trySendInngestEvent(INNGEST_EVENTS.AI_LISTING_SUMMARY_REQUESTED, {
				listingId: event.params.id,
				source: 'owner_dashboard'
			});
			return { ok: true, message: 'AI suggestion job queued.' };
		} catch (error) {
			return fail(400, { message: error instanceof Error ? error.message : 'Could not queue suggestion job.' });
		}
	},
	requestLeadDigest: async (event) => {
		requireUser(event);
		const auth = authContextForConvex(event);
		try {
			await convexMutation('ownerDashboard:requestListingLeadDigest', withAuth({ listingId: event.params.id }, auth));
			await trySendInngestEvent(INNGEST_EVENTS.AI_LEAD_DIGEST_REQUESTED, {
				listingId: event.params.id,
				source: 'owner_dashboard'
			});
			return { ok: true, message: 'Lead digest job queued.' };
		} catch (error) {
			return fail(400, { message: error instanceof Error ? error.message : 'Could not queue lead digest job.' });
		}
	}
};
