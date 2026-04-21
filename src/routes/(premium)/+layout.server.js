import { redirect } from '@sveltejs/kit';
import { requestLogger } from '$lib/utils/logger';

/** @type {import('./$types').LayoutServerLoad} */
export function load(event) {
	const log = requestLogger('premium.layout.server', event);

	log.info({
		op: 'load',
		phase: 'start',
		path: event.url.pathname,
		authenticated: Boolean(event.locals.user)
	});

	if (!event.locals.user) {
		log.warn({
			op: 'guard',
			phase: 'redirect',
			path: event.url.pathname,
			reason: 'unauthenticated'
		});
		throw redirect(303, '/community');
	}

	log.info({
		op: 'load',
		phase: 'success',
		path: event.url.pathname,
		userId: event.locals.user.id
	});

	return {};
}
