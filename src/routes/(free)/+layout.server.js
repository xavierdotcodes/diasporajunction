import { requestLogger } from '$lib/utils/logger';

/** @type {import('./$types').LayoutServerLoad} */
export function load(event) {
	const log = requestLogger('free.layout.server', event);

	log.info({
		op: 'load',
		phase: 'start',
		path: event.url.pathname
	});

	log.info({
		op: 'load',
		phase: 'success',
		path: event.url.pathname,
		authenticated: Boolean(event.locals.user)
	});

	return {};
}
