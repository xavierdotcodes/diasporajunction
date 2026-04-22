import { destroySession } from '$lib/server/session';
import { json } from '@sveltejs/kit';

export async function POST(event) {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		await destroySession(sessionId);
		event.cookies.delete('session', { path: '/' });
	}

	if (event.locals.supabase) {
		await event.locals.supabase.auth.signOut();
	}

	return json({ success: true });
}
