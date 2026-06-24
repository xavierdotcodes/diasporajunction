import { json } from '@sveltejs/kit';
import { authContextForConvex } from '$lib/server/auth.js';
import { convexMutation, withAuth } from '$lib/server/convex.js';

export async function POST(event) {
	const body = await event.request.json().catch(() => ({}));
	const kind = body.kind === 'document' ? 'verificationDocuments:generateUploadUrl' : 'media:generateUploadUrl';
	const uploadUrl = await convexMutation(kind, withAuth({}, authContextForConvex(event)));
	return json({ ok: true, uploadUrl });
}
