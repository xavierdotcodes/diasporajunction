import { json } from '@sveltejs/kit';
import { authContextForConvex } from '$lib/server/auth.js';
import { convexMutation, withAuth } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function POST(event) {
	const body = await event.request.json();
	const documentId = await convexMutation(
		'verificationDocuments:saveDocument',
		withAuth(
			{
				applicationId: body.applicationId,
				listingId: body.listingId,
				storageId: body.storageId,
				type: body.type
			},
			authContextForConvex(event)
		)
	);
	await trySendInngestEvent(INNGEST_EVENTS.VERIFICATION_DOCUMENT_UPLOADED, {
		applicationId: body.applicationId,
		listingId: body.listingId,
		documentId,
		type: body.type
	});
	return json({ ok: true, documentId });
}
