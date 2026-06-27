// @ts-nocheck
import { json } from '@sveltejs/kit';
import { getCurrentUser } from '$lib/server/auth.js';
import { sendEmailVerificationForUser } from '$lib/server/email/authEmails.js';

export async function POST(event) {
	const user = getCurrentUser(event);
	if (!user) return json({ ok: false, error: 'Authentication required.' }, { status: 401 });
	const emailVerification = await sendEmailVerificationForUser(user);
	return json({ ok: true, emailVerification });
}
