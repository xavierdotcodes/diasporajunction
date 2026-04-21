import { redirect } from '@sveltejs/kit';
import { requestLogger } from '$lib/utils/logger';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	const log = requestLogger('free.guides.redirect', event);

	log.info({
		op: 'load',
		phase: 'redirect',
		to: '/blog'
	});

	throw redirect(308, '/blog');
}
