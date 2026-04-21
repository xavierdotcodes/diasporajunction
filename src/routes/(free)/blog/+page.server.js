import { featuredGuides, allGuides, guideCategories } from '$lib/components/guides/data.js';
import { requestLogger, serializeError } from '$lib/utils/logger';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	const log = requestLogger('free.blog.page.server', event);

	log.info({ op: 'load', phase: 'start' });

	try {
		const featuredPost =
			featuredGuides.find((post) => post.href === '/blog/visiting-vs-living-in-ghana') ??
			featuredGuides[0] ??
			null;

		const starterPosts = featuredGuides;
		const latestPosts = allGuides.filter((post) => post.href !== featuredPost?.href);

		log.info({
			op: 'load',
			phase: 'success',
			featured: featuredPost?.href,
			starterCount: starterPosts.length,
			latestCount: latestPosts.length
		});

		return {
			featuredPost,
			starterPosts,
			latestPosts,
			categories: guideCategories
		};
	} catch (error) {
		log.error({
			op: 'load',
			phase: 'error',
			error: serializeError(error)
		});

		return {
			featuredPost: null,
			starterPosts: [],
			latestPosts: [],
			categories: [],
			error: 'The blog could not load right now.'
		};
	}
}
