import { json } from '@sveltejs/kit';
import { authContextForConvex, requireUser } from '$lib/server/auth.js';
import { convexMutation, withAuth } from '$lib/server/convex.js';

export async function POST(event) {
	const body = await event.request.json().catch(() => ({}));
	requireUser(event);
	const auth = authContextForConvex(event);
	try {
		if (body.kind === 'listing-media') {
			const uploadUrl = await convexMutation(
				'media:ownerGenerateListingUploadUrl',
				withAuth({ listingId: body.listingId, type: body.type }, auth)
			);
			return json({ ok: true, uploadUrl });
		}
		const kind = body.kind === 'document' ? 'verificationDocuments:generateUploadUrl' : 'media:generateUploadUrl';
		const uploadUrl = await convexMutation(kind, withAuth({}, auth));
		return json({ ok: true, uploadUrl });
	} catch (error) {
		return json({ ok: false, message: error instanceof Error ? error.message : 'Could not create upload URL.' }, { status: 400 });
	}
}
