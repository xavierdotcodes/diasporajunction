// @ts-nocheck
import { authContextForConvex, requireApplicationAccess, requireUser } from '$lib/server/auth.js';
import { convexQuery, withAuth } from '$lib/server/convex.js';

export async function load(event) {
	requireUser(event);
	const auth = authContextForConvex(event);
	const application = await convexQuery(
		'applications:getById',
		withAuth({ applicationId: event.params.applicationId }, auth)
	);
	requireApplicationAccess(event, application);
	return { application };
}
