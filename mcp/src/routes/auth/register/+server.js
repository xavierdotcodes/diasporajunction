// @ts-nocheck
import { json } from '@sveltejs/kit';
import { convexMutation, convexQuery } from '$lib/server/convex.js';
import { sendEmailVerificationForUser } from '$lib/server/email/authEmails.js';
import {
	createUserSession,
	hashPassword,
	normalizeEmail,
	SESSION_COOKIE_NAME,
	internalAuthSecret,
	sessionCookieOptions,
	validateRegistrationInput
} from '$lib/server/sessionAuth.js';

export async function POST(event) {
	const input = await readAuthInput(event.request);
	const email = normalizeEmail(input.email);
	const error = validateRegistrationInput({ ...input, email });
	if (error) return json({ ok: false, error }, { status: 400 });

	const existing = await convexQuery('users:getByEmailForLogin', { email, internalAuthSecret: internalAuthSecret() });
	if (existing) return json({ ok: false, error: 'An account already exists for this email.' }, { status: 409 });

	const passwordHash = await hashPassword(input.password);
	const userId = await convexMutation('users:createOrUpdateFromAuth', {
		email,
		name: String(input.name ?? '').trim() || undefined,
		passwordHash,
		internalAuthSecret: internalAuthSecret()
	});
	const user = await convexQuery('users:getCurrentBySessionUser', { userId });
	const session = await createUserSession({ userId });
	event.cookies.set(SESSION_COOKIE_NAME, session.token, sessionCookieOptions());
	const emailVerification = await sendEmailVerificationForUser(user);
	return json({ ok: true, user, emailVerification });
}

async function readAuthInput(request) {
	const contentType = request.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) return await request.json();
	const form = await request.formData();
	return Object.fromEntries(form.entries());
}
