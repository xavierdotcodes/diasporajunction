import { json } from '@sveltejs/kit';
import { authContextForConvex } from '$lib/server/auth.js';
import { convexMutation, withAuth } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function POST(event) {
	const body = await event.request.json();
	const mediaId = await convexMutation(
		'media:saveApplicationMedia',
		withAuth(
			{
				applicationId: body.applicationId,
				storageId: body.storageId,
				type: body.type,
				caption: body.caption,
				sortOrder: Number(body.sortOrder ?? 0)
			},
			authContextForConvex(event)
		)
	);
	await trySendInngestEvent(INNGEST_EVENTS.MEDIA_UPLOADED, {
		applicationId: body.applicationId,
		mediaId,
		type: body.type
	});
	return json({ ok: true, mediaId });
}
