import { convexQuery } from '$lib/server/convex.js';
import { adminAuthContextForConvex } from '$lib/server/auth.js';
import { withAuth } from '$lib/server/convex.js';

export async function load(event) {
	const auth = adminAuthContextForConvex(event);
	return {
		featured: await convexQuery('listings:listFeatured', withAuth({ limit: 50 }, auth)),
		inactive: await convexQuery('listings:listInactive', withAuth({ limit: 50 }, auth)),
		missingMedia: await convexQuery('listings:listMissingMedia', withAuth({ limit: 50 }, auth))
	};
}
