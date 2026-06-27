// @ts-nocheck
import { authContextForConvex, requireUser } from '$lib/server/auth.js';
import { convexQuery, withAuth } from '$lib/server/convex.js';

export async function load(event) {
	requireUser(event);
	const auth = authContextForConvex(event);
	return {
		dashboard: await convexQuery('ownerDashboard:getListingDashboard', withAuth({ listingId: event.params.id }, auth)),
		media: await convexQuery('media:ownerListListingMedia', withAuth({ listingId: event.params.id }, auth))
	};
}
