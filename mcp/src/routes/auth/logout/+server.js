// @ts-nocheck
import { json } from '@sveltejs/kit';
import {
	clearSessionCookieOptions,
	revokeSessionToken,
	SESSION_COOKIE_NAME
} from '$lib/server/sessionAuth.js';

export async function POST(event) {
	const token = event.cookies.get(SESSION_COOKIE_NAME);
	await revokeSessionToken(token);
	event.cookies.delete(SESSION_COOKIE_NAME, clearSessionCookieOptions());
	return json({ ok: true });
}
