import { adminAuthContextForConvex } from '$lib/server/auth.js';
import { convexQuery, withAuth } from '$lib/server/convex.js';

export async function load(event) {
	const auth = adminAuthContextForConvex(event);
	return {
		summary: await convexQuery('adminDashboard:getSummary', withAuth({}, auth))
	};
}
