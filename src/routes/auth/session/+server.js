import { json } from '@sveltejs/kit';

export function GET(event) {
	const response = json({
		authenticated: Boolean(event.locals.supabaseUser?.id)
	});

	response.headers.set('cache-control', 'no-store, max-age=0');
	return response;
}
