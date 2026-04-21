import { error } from '@sveltejs/kit';
import { getGuideDetail, getRelatedGuides } from '$lib/components/guides/content.js';
import { requestLogger } from '$lib/utils/logger';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	const log = requestLogger('free.blog.detail.page.server', event, { slug: event.params.slug });

	log.info({ op: 'load', phase: 'start' });

	const article = getGuideDetail(event.params.slug);

	if (!article) {
		log.warn({ op: 'load', phase: 'not_found' });
		throw error(404, 'Post not found');
	}

	log.info({
		op: 'load',
		phase: 'success',
		title: article.title
	});

	return {
		article,
		relatedArticles: getRelatedGuides(event.params.slug)
	};
}
