// @ts-nocheck
import { convexQuery } from '$lib/server/convex.js';
import { authContextForConvex, requireApplicationAccess, requireUser } from '$lib/server/auth.js';
import { withAuth } from '$lib/server/convex.js';

export async function load(event) {
	requireUser(event);
	const auth = authContextForConvex(event);
	const application = await convexQuery(
		'applications:getById',
		withAuth({ applicationId: event.params.applicationId }, auth)
	);
	requireApplicationAccess(event, application);
	return {
		application,
		media: await convexQuery('media:listApplicationMedia', withAuth({ applicationId: event.params.applicationId }, auth)),
		documents: await convexQuery(
			'verificationDocuments:listForApplication',
			withAuth({ applicationId: event.params.applicationId }, auth)
		)
	};
}
