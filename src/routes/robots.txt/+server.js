import { ROBOTS_DISALLOWS, SITE_URL } from '$lib/seo';

export function GET() {
	const sitemapUrl = new URL('/sitemap.xml', SITE_URL).toString();
	const lines = [
		'User-agent: *',
		'Allow: /',
		...ROBOTS_DISALLOWS.map((path) => `Disallow: ${path}`),
		`Sitemap: ${sitemapUrl}`,
		`Host: ${SITE_URL.replace(/\/$/, '')}`
	];

	return new Response(`${lines.join('\n')}\n`, {
		headers: {
			'content-type': 'text/plain; charset=utf-8',
			'cache-control': 'public, max-age=0, s-maxage=3600'
		}
	});
}
