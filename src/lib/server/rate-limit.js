import { getRedis } from '$lib/server/redis';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/lib/server/rate-limit.js');

const LIMITS = [
	{ prefix: '/api/leads', points: 8, windowSeconds: 600 },
	{ prefix: '/api/contact', points: 5, windowSeconds: 600 },
	{ prefix: '/api/subscribe', points: 8, windowSeconds: 600 },
	{ prefix: '/api/community/access-request', points: 5, windowSeconds: 600 },
	{ prefix: '/api/community/checkout-session', points: 10, windowSeconds: 600 },
	{ prefix: '/api/ebook/checkout-session', points: 10, windowSeconds: 600 },
	{ prefix: '/api/space/create-payment-intent', points: 10, windowSeconds: 600 },
	{ prefix: '/api/space/complete-order', points: 10, windowSeconds: 600 },
	{ prefix: '/api/ndgo/create-payment-intent', points: 10, windowSeconds: 600 },
	{ prefix: '/api/ndgo/complete-enrollment', points: 10, windowSeconds: 600 },
	{ prefix: '/api/ndgo/enroll', points: 8, windowSeconds: 600 },
	{ prefix: '/api/tours/create-payment-intent', points: 10, windowSeconds: 600 },
	{ prefix: '/api/tours/complete-booking', points: 10, windowSeconds: 600 },
	{ prefix: '/api/tours/reserve', points: 8, windowSeconds: 600 },
	{ prefix: '/auth/session', points: 30, windowSeconds: 300 }
];

function getLimit(pathname) {
	return LIMITS.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getClientIp(event) {
	return (
		event.request.headers.get('cf-connecting-ip') ||
		event.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		event.getClientAddress()
	);
}

function sanitizeIp(ip) {
	return ip.replace(/[^a-zA-Z0-9:._-]/g, '_');
}

export async function enforceRateLimit(event) {
	if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.request.method)) {
		return null;
	}

	const limit = getLimit(event.url.pathname);
	if (!limit) return null;

	const ip = getClientIp(event);
	const redis = getRedis();
	const key = `rate:${event.url.pathname}:${sanitizeIp(ip)}`;
	const count = await redis.incr(key);

	if (count === 1) {
		await redis.expire(key, limit.windowSeconds);
	}

	if (count <= limit.points) return null;

	log.warn({
		phase: 'request_rate_limited',
		path: event.url.pathname,
		ip,
		count,
		limit: limit.points,
		windowSeconds: limit.windowSeconds
	});

	return new Response(JSON.stringify({ error: 'Too many requests. Please try again shortly.' }), {
		status: 429,
		headers: {
			'content-type': 'application/json',
			'cache-control': 'no-store',
			'retry-after': String(limit.windowSeconds)
		}
	});
}

export async function safeEnforceRateLimit(event) {
	try {
		return await enforceRateLimit(event);
	} catch (error) {
		log.error({
			phase: 'rate_limit_failed_open',
			path: event.url.pathname,
			error: serializeError(error)
		});
		return null;
	}
}
