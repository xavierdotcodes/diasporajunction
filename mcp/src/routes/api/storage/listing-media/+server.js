import { json } from '@sveltejs/kit';
import { authContextForConvex, requireUser } from '$lib/server/auth.js';
import { convexMutation, withAuth } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function POST(event) {
	requireUser(event);
	const body = await event.request.json().catch(() => ({}));
	const auth = authContextForConvex(event);
	try {
		const mediaId = await convexMutation(
			'media:ownerSaveListingMedia',
			withAuth(
				{
					listingId: body.listingId,
					storageId: body.storageId,
					type: body.type,
					caption: body.caption,
					sortOrder: Number(body.sortOrder ?? 0)
				},
				auth
			)
		);
		await trySendInngestEvent(INNGEST_EVENTS.MEDIA_UPLOADED, {
			listingId: body.listingId,
			mediaId,
			type: body.type
		});
		return json({ ok: true, mediaId });
	} catch (error) {
		return json({ ok: false, message: error instanceof Error ? error.message : 'Listing media save failed.' }, { status: 400 });
	}
}

export async function PATCH(event) {
	requireUser(event);
	const body = await event.request.json().catch(() => ({}));
	try {
		if (Array.isArray(body.items)) {
			const count = await convexMutation(
				'media:ownerReorderListingMedia',
				withAuth({ listingId: body.listingId, items: body.items }, authContextForConvex(event))
			);
			return json({ ok: true, count });
		}
		const mediaId = await convexMutation(
			'media:ownerUpdateListingMedia',
			withAuth(
				{
					mediaId: body.mediaId,
					type: body.type || undefined,
					caption: body.caption,
					sortOrder: body.sortOrder === undefined ? undefined : Number(body.sortOrder)
				},
				authContextForConvex(event)
			)
		);
		return json({ ok: true, mediaId });
	} catch (error) {
		return json({ ok: false, message: error instanceof Error ? error.message : 'Listing media update failed.' }, { status: 400 });
	}
}

export async function DELETE(event) {
	requireUser(event);
	const body = await event.request.json().catch(() => ({}));
	try {
		const result = await convexMutation(
			'media:ownerDeleteListingMedia',
			withAuth({ mediaId: body.mediaId }, authContextForConvex(event))
		);
		return json({ ok: true, ...result });
	} catch (error) {
		return json({ ok: false, message: error instanceof Error ? error.message : 'Listing media delete failed.' }, { status: 400 });
	}
}
