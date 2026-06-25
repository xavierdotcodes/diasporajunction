// @ts-nocheck
import { json } from '@sveltejs/kit';
import { convexQuery } from '$lib/server/convex.js';
import {
	createUserSession,
	internalAuthSecret,
	normalizeEmail,
	SESSION_COOKIE_NAME,
	sessionCookieOptions,
	verifyPassword
} from '$lib/server/sessionAuth.js';

export async function POST(event) {
	const input = await readAuthInput(event.request);
	const email = normalizeEmail(input.email);
	const password = String(input.password ?? '');
	if (!email || !password) return json({ ok: false, error: 'Email and password are required.' }, { status: 400 });

	const loginUser = await convexQuery('users:getByEmailForLogin', { email, internalAuthSecret: internalAuthSecret() });
	const valid = loginUser?.passwordHash ? await verifyPassword(password, loginUser.passwordHash) : false;
	if (!valid) return json({ ok: false, error: 'Invalid email or password.' }, { status: 401 });

	const session = await createUserSession({ userId: loginUser.id });
	event.cookies.set(SESSION_COOKIE_NAME, session.token, sessionCookieOptions());
	const { passwordHash: _passwordHash, ...user } = loginUser;
	return json({ ok: true, user });
}

async function readAuthInput(request) {
	const contentType = request.headers.get('content-type') ?? '';
	if (contentType.includes('application/json')) return await request.json();
	const form = await request.formData();
	return Object.fromEntries(form.entries());
}
