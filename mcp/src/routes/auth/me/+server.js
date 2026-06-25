// @ts-nocheck
import { json } from '@sveltejs/kit';
import { getCurrentUser } from '$lib/server/auth.js';

export async function GET(event) {
	const user = getCurrentUser(event);
	return json({ authenticated: Boolean(user), user });
}
