import { convexQuery } from '$lib/server/convex.js';
import { adminAuthContextForConvex } from '$lib/server/auth.js';
import { withAuth } from '$lib/server/convex.js';

export async function load(event) {
	const auth = adminAuthContextForConvex(event);
	return {
		paid: await convexQuery('applications:listPaidWaitingReview', withAuth({ limit: 50 }, auth)),
		pending: await convexQuery('applications:listPending', withAuth({ limit: 50 }, auth)),
		resubmission: await convexQuery('applications:listNeedingResubmission', withAuth({ limit: 50 }, auth))
	};
}
