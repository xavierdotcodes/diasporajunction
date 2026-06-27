// @ts-nocheck
import { json } from '@sveltejs/kit';
import { requestPasswordResetForEmail } from '$lib/server/email/authEmails.js';

export async function POST(event) {
	const input = await event.request.json().catch(() => ({}));
	await requestPasswordResetForEmail(input.email);
	return json({
		ok: true,
		message: 'If an account exists for that email, a password reset link will be sent.'
	});
}
