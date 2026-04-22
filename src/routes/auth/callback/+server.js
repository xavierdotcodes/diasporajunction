import { redirect } from '@sveltejs/kit';
import { scopedLogger, serializeError } from '$lib/utils/logger';

const log = scopedLogger('auth.callback');

export async function GET(event) {
	const url = new URL(event.request.url);
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') || '/housing/owners';

	if (!event.locals.supabase || !code) {
		throw redirect(303, next);
	}

	const { error } = await event.locals.supabase.auth.exchangeCodeForSession(code);

	if (error) {
		log.error({
			op: 'exchange_code',
			phase: 'error',
			error: serializeError(error)
		});
		throw redirect(303, `/login?next=${encodeURIComponent(next)}`);
	}

	throw redirect(303, next);
}
