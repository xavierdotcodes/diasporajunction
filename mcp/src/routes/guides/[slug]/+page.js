import { guideTemplates } from '$lib/seo/directory.js';

export function load({ params }) {
	const guide = guideTemplates.find((item) => item.slug === params.slug);
	return { guide: guide ?? { slug: params.slug, title: 'DiasporaJunxion guide' } };
}
