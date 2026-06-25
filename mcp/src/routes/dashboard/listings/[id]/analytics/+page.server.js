// @ts-nocheck
import { authContextForConvex, requireUser } from '$lib/server/auth.js';
import { convexQuery, withAuth } from '$lib/server/convex.js';

export async function load(event) {
	requireUser(event);
	const auth = authContextForConvex(event);
	const period = normalizePeriod(event.url.searchParams.get('period'));
	return {
		period,
		dashboard: await convexQuery('ownerDashboard:getListingDashboard', withAuth({ listingId: event.params.id }, auth)),
		summary: await convexQuery('ownerDashboard:getListingInteractionSummary', withAuth({ listingId: event.params.id, period }, auth)),
		recentInteractions: await convexQuery('ownerDashboard:getListingRecentInteractions', withAuth({ listingId: event.params.id, period, limit: 50 }, auth))
	};
}

function normalizePeriod(value) {
	return ['7d', '30d', 'all'].includes(value) ? value : '30d';
}
