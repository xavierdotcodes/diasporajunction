import { convexQuery } from '$lib/server/convex.js';
import { adminAuthContextForConvex } from '$lib/server/auth.js';
import { withAuth } from '$lib/server/convex.js';

export async function load(event) {
	const auth = adminAuthContextForConvex(event);
	return {
		listing: await convexQuery('listings:adminGetById', withAuth({ listingId: event.params.id }, auth)),
		media: await convexQuery('media:listListingMedia', withAuth({ listingId: event.params.id }, auth)),
		profileCompleteness: await convexQuery(
			'ownerDashboard:getListingProfileCompleteness',
			withAuth({ listingId: event.params.id }, auth)
		)
	};
}
