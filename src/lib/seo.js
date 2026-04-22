import { allGuides } from '$lib/components/guides/data.js';

export const SITE_NAME = 'DiasporaJunxion';
export const SITE_URL = 'https://diasporajunxion.com';
export const DEFAULT_IMAGE_PATH = '/logo2.png';
export const DEFAULT_TITLE = 'DiasporaJunxion – Connecting the Diaspora';
export const DEFAULT_DESCRIPTION =
	'Discover opportunities, events, and networks tailored for the African diaspora. Build connections, grow, and thrive globally.';
export const DEFAULT_IMAGE_URL = new URL(DEFAULT_IMAGE_PATH, SITE_URL).toString();

export const INDEXABLE_PATHS = [
	'/',
	'/about',
	'/approach',
	'/blog',
	'/checklist',
	'/community',
	'/contact',
	'/diasporaU',
	'/ebook',
	'/FAQ',
	'/founder',
	'/housing',
	'/housing/list-your-property',
	'/invest',
	'/ndgo',
	'/ndgo/learn',
	'/privacy-policy',
	'/relocate',
	'/start-here',
	'/support',
	'/team',
	'/terms-of-service',
	'/tours'
];

export const ROBOTS_DISALLOWS = [
	'/admin',
	'/api',
	'/community/portal',
	'/go',
	'/guides',
	'/ndgo/portal',
	'/thank-you',
	'/unsubscribe'
];

const PATH_METADATA = {
	'/': {
		title: 'DiasporaJunxion | Relocate, Connect, and Build in Ghana',
		description:
			'DiasporaJunxion helps diaspora travelers, returners, and families move toward Ghana with more clarity, connection, and opportunity.'
	},
	'/about': {
		title: 'About | DiasporaJunxion',
		description:
			'Learn what DiasporaJunxion is building at the intersection of diaspora relocation, belonging, and African opportunity.'
	},
	'/approach': {
		title: 'Our Approach | DiasporaJunxion',
		description:
			'Learn how DiasporaJunxion empowers Ghanaian artists, makers, and entrepreneurs to reach global markets through mentorship, structure, and exposure.'
	},
	'/blog': {
		title: 'Blog | DiasporaJunxion',
		description:
			'Read grounded articles for diaspora people thinking about visiting, relocating, belonging, and building a life in Ghana with more clarity.'
	},
	'/checklist': {
		title: 'Free Ghana Checklist | DiasporaJunxion',
		description:
			'Get the free Ghana reality guide and use it as your first practical checklist for thinking through a visit, relocation, or deeper move.'
	},
	'/community': {
		title: 'Community | DiasporaJunxion',
		description:
			'Book a 45-minute DiasporaJunxion consult for grounded guidance on Ghana, relocation, family transition, belonging, and your clearest next step.'
	},
	'/community/portal': {
		title: 'Community Portal | DiasporaJunxion',
		description:
			'The member-only DiasporaJunxion workspace for premium content, tools, resources, and deeper support.'
	},
	'/housing': {
		title: 'Housing in Ghana | DiasporaJunxion',
		description:
			'Explore a cleaner, diaspora-focused housing layer for Ghana with more relocation context, less listing noise, and a more grounded inquiry path.'
	},
	'/housing/list-your-property': {
		title: 'List Your Property | DiasporaJunxion',
		description:
			'Submit a Ghana property listing to DiasporaJunxion for diaspora-facing review and publication through a simple owner portal.'
	},
	'/contact': {
		title: 'Contact | DiasporaJunxion',
		description:
			'Contact DiasporaJunxion with questions about relocation, community, programs, partnerships, or your next step toward Ghana.'
	},
	'/diasporaU': {
		title: 'Diaspora United | DiasporaJunxion',
		description:
			'Explore Diaspora United, the first diaspora-owned football club in Ghana, where culture meets competition.'
	},
	'/ebook': {
		title: 'Thriving in Ghana (With Children) | DiasporaJunxion',
		description:
			'A paid digital guide for diaspora families and long-term thinkers who want a more grounded path into life in Ghana.'
	},
	'/FAQ': {
		title: 'FAQ | DiasporaJunxion',
		description:
			'Get answers about tours, visas, travel preparation, booking, family tours, and Ghana trip logistics through DiasporaJunxion.'
	},
	'/founder': {
		title: 'Founder | DiasporaJunxion',
		description:
			'Meet Xavi, founder of DiasporaJunxion — a platform helping diaspora people move toward Ghana with more clarity, connection, and context.'
	},
	'/invest': {
		title: 'Invest in Ghana | DiasporaJunxion',
		description:
			'Explore diaspora investment context, opportunity, and grounded guidance around Ghana through DiasporaJunxion.'
	},
	'/ndgo': {
		title: 'N.D.G.O. Program | DiasporaJunxion',
		description:
			'N.D.G.O. teaches art through computers and computers through art — empowering Ghanaian students with creativity, expression, and technical skills.'
	},
	'/ndgo/learn': {
		title: 'NDGO Learn | DiasporaJunxion',
		description:
			'Learn about the NDGO program, how it works, and how participants build practical skills, confidence, and creative growth.'
	},
	'/ndgo/portal': {
		title: 'NDGO Portal | DiasporaJunxion',
		description:
			'Access the NDGO portal for student and teacher resources, sign-in, and program participation tools.'
	},
	'/privacy-policy': {
		title: 'Privacy Policy | DiasporaJunxion',
		description:
			'Read the DiasporaJunxion privacy policy to understand how personal information is collected, used, and protected.'
	},
	'/relocate': {
		title: 'Relocate to Ghana | DiasporaJunxion',
		description:
			'DiasporaJunxion helps diaspora travelers and returners relocate to Ghana with more clarity, context, and connection.'
	},
	'/start-here': {
		title: 'Start Here | DiasporaJunxion',
		description:
			'Use Start Here to figure out whether you are exploring, planning a move, thinking about Ghana with children, or trying to find the clearest next step.'
	},
	'/support': {
		title: 'Support DiasporaJunxion | DiasporaJunxion',
		description:
			'Support DiasporaJunxion and help fund creative workshops, resources, and growth opportunities connected to Ghanaian artists, makers, and entrepreneurs.'
	},
	'/team': {
		title: 'Team | DiasporaJunxion',
		description:
			'Meet the DiasporaJunxion team of creators, builders, and cultural guides shaping the platform and its connection to Ghana.'
	},
	'/terms-of-service': {
		title: 'Terms of Service | DiasporaJunxion',
		description:
			'Read the DiasporaJunxion terms of service for the rules, conditions, and legal terms that apply to use of the site and services.'
	},
	'/thank-you': {
		title: 'Check Your Email | DiasporaJunxion',
		description:
			'Thanks for signing up. Check your email for the free DiasporaJunxion Ghana reality guide.'
	},
	'/tours': {
		title: 'Ghana Immersion Tours | DiasporaJunxion',
		description:
			'Explore DiasporaJunxion Ghana immersion tours designed for culture, connection, and a deeper experience of Accra, the Central Coast, and beyond.'
	},
	'/unsubscribe': {
		title: 'Unsubscribe | DiasporaJunxion',
		description:
			'Manage your DiasporaJunxion email subscription preferences and confirm whether you want to stop receiving emails.'
	}
};

const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_ROBOTS = 'noindex, nofollow';

export function getSitemapPaths() {
	const articlePaths = allGuides.map((guide) => guide.href);

	return [...new Set([...INDEXABLE_PATHS, ...articlePaths])];
}

export function toAbsoluteUrl(path) {
	return new URL(path, SITE_URL).toString();
}

export function serializeJsonLd(value) {
	return JSON.stringify(value).replace(/</g, '\\u003c');
}

function stripSiteName(title) {
	return title.split(' | ')[0];
}

function buildBreadcrumbTrail(pathname, data, status) {
	const items = [{ name: 'Home', item: SITE_URL }];

	if (status >= 400) {
		items.push({ name: `${status}`, item: toAbsoluteUrl(pathname) });
		return items;
	}

	if (data.article) {
		items.push({ name: 'Blog', item: toAbsoluteUrl('/blog') });
		items.push({ name: data.article.title, item: toAbsoluteUrl(pathname) });
		return items;
	}

	const segments = pathname.split('/').filter(Boolean);
	if (segments.length === 0) return items;

	let currentPath = '';

	for (const segment of segments) {
		currentPath += `/${segment}`;
		const meta = PATH_METADATA[currentPath];

		if (!meta) continue;

		items.push({
			name: stripSiteName(meta.title),
			item: toAbsoluteUrl(currentPath)
		});
	}

	return items;
}

function buildBreadcrumbJsonLd(trail) {
	if (trail.length < 2) return null;

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: trail.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.item
		}))
	};
}

function buildOrganizationJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: SITE_URL,
		logo: {
			'@type': 'ImageObject',
			url: DEFAULT_IMAGE_URL
		},
		description: DEFAULT_DESCRIPTION
	};
}

function buildWebSiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: SITE_URL,
		description: DEFAULT_DESCRIPTION,
		inLanguage: 'en-US'
	};
}

function buildArticleJsonLd(article, canonical) {
	if (!article) return null;

	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: article.title,
		description: article.description,
		url: canonical,
		mainEntityOfPage: canonical,
		articleSection: article.category,
		inLanguage: 'en-US',
		author: {
			'@type': 'Person',
			name: 'Xavi'
		},
		publisher: {
			'@type': 'Organization',
			name: SITE_NAME,
			logo: {
				'@type': 'ImageObject',
				url: DEFAULT_IMAGE_URL
			}
		},
		image: [DEFAULT_IMAGE_URL]
	};
}

function buildStructuredData({ pathname, data = {}, status = 200 }) {
	const trail = buildBreadcrumbTrail(pathname, data, status);
	const schemas = [buildOrganizationJsonLd(), buildWebSiteJsonLd()];
	const breadcrumb = buildBreadcrumbJsonLd(trail);
	const article = buildArticleJsonLd(data.article, toAbsoluteUrl(pathname));

	if (breadcrumb) schemas.push(breadcrumb);
	if (article) schemas.push(article);

	return schemas;
}

function shouldNoindex(pathname, status) {
	if (status >= 400) return true;
	return ROBOTS_DISALLOWS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function resolvePageSeo({ pathname, data = {}, status = 200 }) {
	const dynamicArticle = data.article
		? {
				title: `${data.article.title} | DiasporaJunxion Blog`,
				description: data.article.description,
				type: 'article'
			}
		: null;

	const dynamicGuide = data.guide
		? {
				title: `${data.guide.title} | DiasporaJunxion Guides`,
				description: data.guide.description,
				type: 'article'
			}
		: null;

	const statusFallback =
		status >= 400
			? {
					title: `${status || 404} | DiasporaJunxion`,
					description:
						'A branded error page for DiasporaJunxion that helps visitors find their way back.'
				}
			: null;

	const routeMeta = PATH_METADATA[pathname] ?? null;
	const meta = dynamicArticle ?? dynamicGuide ?? routeMeta ?? statusFallback ?? {};
	const title = meta.title ?? DEFAULT_TITLE;
	const description = meta.description ?? DEFAULT_DESCRIPTION;
	const canonical = toAbsoluteUrl(pathname);
	const image = toAbsoluteUrl(meta.image ?? DEFAULT_IMAGE_PATH);
	const noindex = shouldNoindex(pathname, status);

	return {
		title,
		description,
		canonical,
		image,
		robots: noindex ? NOINDEX_ROBOTS : INDEX_ROBOTS,
		type: meta.type ?? 'website',
		siteName: SITE_NAME,
		structuredData: buildStructuredData({ pathname, data, status })
	};
}
