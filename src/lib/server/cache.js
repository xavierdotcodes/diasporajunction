import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/cache.js');

const PUBLIC_MARKETING_PATHS = new Set([
	'/',
	'/FAQ',
	'/about',
	'/blog',
	'/community',
	'/contact',
	'/founder',
	'/guides',
	'/invest',
	'/privacy-policy',
	'/relocate',
	'/start-here',
	'/support',
	'/team',
	'/terms-of-service'
]);

const SEMI_CACHEABLE_PREFIXES = ['/blog/', '/tours'];
const NEVER_CACHE_PREFIXES = ['/api/', '/admin', '/ndgo/portal', '/unsubscribe', '/thank-you'];
const REDIRECT_PREFIXES = ['/go/'];
const IMMUTABLE_ASSET_PREFIXES = ['/_app/immutable/'];
const STATIC_ASSET_PREFIXES = ['/images/', '/videos/', '/fonts/'];
const STATIC_ASSET_PATHS = new Set([
	'/favicon.ico',
	'/favicon.svg',
	'/favicon-96x96.png',
	'/apple-touch-icon.png',
	'/site.webmanifest'
]);

function hasPrefix(pathname, prefixes) {
	return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

export function getOriginCachePolicy({ pathname, method, contentType }) {
	if (method !== 'GET' && method !== 'HEAD') {
		return 'no-store';
	}

	if (hasPrefix(pathname, NEVER_CACHE_PREFIXES)) {
		return 'no-store';
	}

	if (hasPrefix(pathname, IMMUTABLE_ASSET_PREFIXES)) {
		return 'public, max-age=31536000, immutable';
	}

	if (
		hasPrefix(pathname, STATIC_ASSET_PREFIXES) ||
		STATIC_ASSET_PATHS.has(pathname) ||
		pathname.startsWith('/web-app-manifest-')
	) {
		return 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800';
	}

	if (
		contentType.startsWith('image/') ||
		contentType.startsWith('video/') ||
		contentType.startsWith('font/')
	) {
		return 'public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800';
	}

	if (hasPrefix(pathname, REDIRECT_PREFIXES)) {
		return 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800';
	}

	if (!contentType?.includes('text/html')) {
		return null;
	}

	if (PUBLIC_MARKETING_PATHS.has(pathname)) {
		return 'public, max-age=0, s-maxage=600, stale-while-revalidate=86400';
	}

	if (hasPrefix(pathname, SEMI_CACHEABLE_PREFIXES)) {
		return 'public, max-age=0, s-maxage=120, stale-while-revalidate=600';
	}

	return null;
}

export function applyOriginCacheHeaders(response, request) {
	const requestUrl = typeof request.url === 'string' ? new URL(request.url) : request.url;
	const pathname = requestUrl.pathname;
	const method = request.method;
	const contentType = response.headers.get('content-type') || '';
	const cacheControl = getOriginCachePolicy({ pathname, method, contentType });

	if (!cacheControl) return response;

	response.headers.set('cache-control', cacheControl);

	if (cacheControl === 'no-store') {
		response.headers.set('pragma', 'no-cache');
		response.headers.set('expires', '0');
	}

	return response;
}
