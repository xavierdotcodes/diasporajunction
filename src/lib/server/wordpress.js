import { PUBLIC_WP_URL } from '$env/static/public';

const WP_BASE = PUBLIC_WP_URL.replace(/\/+$/, '');

async function wpFetch(path, init = {}) {
	const res = await fetch(`${WP_BASE}${path}`, {
		...init,
		headers: {
			Accept: 'application/json',
			...(init.headers || {})
		}
	});

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`WordPress API error ${res.status}: ${text || res.statusText}`);
	}

	return res.json();
}

function stripHtml(html = '') {
	return html.replace(/<[^>]*>/g, '').trim();
}

export function normalizePost(post) {
	return {
		id: post.id,
		slug: post.slug,
		title: post.title?.rendered || '',
		excerpt: post.excerpt?.rendered || '',
		excerptText: stripHtml(post.excerpt?.rendered || ''),
		content: post.content?.rendered || '',
		date: post.date,
		modified: post.modified,
		link: post.link,
		featuredImage:
			post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
			null,
		featuredImageAlt:
			post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ||
			post.title?.rendered ||
			'',
		categories:
			post._embedded?.['wp:term']
				?.flat()
				?.filter((term) => term.taxonomy === 'category')
				?.map((term) => ({
					id: term.id,
					name: term.name,
					slug: term.slug
				})) || []
	};
}

export async function getPosts({ page = 1, perPage = 12 } = {}) {
	const posts = await wpFetch(
		`/wp-json/wp/v2/posts?_embed&orderby=date&order=desc&page=${page}&per_page=${perPage}`
	);

	return posts.map(normalizePost);
}

export async function getPostBySlug(slug) {
	const posts = await wpFetch(
		`/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`
	);

	if (!posts.length) return null;

	return normalizePost(posts[0]);
}
