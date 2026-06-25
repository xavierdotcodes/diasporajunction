// @ts-nocheck
import { authContextForConvex, requireUser } from '$lib/server/auth.js';
import { convexQuery, withAuth } from '$lib/server/convex.js';

export async function load(event) {
	requireUser(event);
	const auth = authContextForConvex(event);
	return {
		listings: await convexQuery('ownerDashboard:getMyListings', withAuth({}, auth))
	};
}
