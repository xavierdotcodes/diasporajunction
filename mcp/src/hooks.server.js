// @ts-nocheck
import { getSessionUserFromCookie } from '$lib/server/sessionAuth.js';

export async function handle({ event, resolve }) {
	try {
		event.locals.user = await getSessionUserFromCookie(event.cookies);
	} catch {
		event.locals.user = null;
	}
	return resolve(event);
}
