import { redirect } from '@sveltejs/kit';
import { requestLogger } from '$lib/utils/logger';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	const to = `/blog/${event.params.slug}`;
	const log = requestLogger('free.guides.detail.redirect', event, { slug: event.params.slug });

	log.info({
		op: 'load',
		phase: 'redirect',
		to
	});

	throw redirect(308, to);
}
