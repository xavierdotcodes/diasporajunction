import { error } from '@sveltejs/kit';
import { getGuideDetail, getRelatedGuides } from '$lib/components/guides/content.js';
import { fileLogger } from '$lib/utils/logger';

fileLogger('free.guides.detail.load');

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const guide = getGuideDetail(params.slug);

	if (!guide) {
		throw error(404, 'Guide not found');
	}

	return {
		guide,
		relatedGuides: getRelatedGuides(params.slug)
	};
}
