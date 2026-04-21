import prisma from '$lib/server/prisma';
import { applyOriginCacheHeaders } from '$lib/server/cache';
import { getRedis } from '$lib/server/redis';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/hooks.server.js');

export async function handle({ event, resolve }) {
	const startedAt = Date.now();
	const url = new URL(event.request.url);
	event.locals.requestId = crypto.randomUUID();

	log.info({
		phase: 'request_started',
		requestId: event.locals.requestId,
		method: event.request.method,
		path: url.pathname,
		search: url.search || undefined
	});

	try {
		const sessionId = event.cookies.get('session');

		if (sessionId) {
			log.debug({
				phase: 'session_lookup_started',
				requestId: event.locals.requestId
			});

			const redis = getRedis();
			const rawSession = await redis.get(`session:${sessionId}`);
			if (rawSession) {
				const session = JSON.parse(rawSession);
				if (session?.id) {
					const user = await prisma.user.findUnique({
						where: { id: session.id },
						include: { roles: true }
					});
					if (user) {
						event.locals.user = user;
						log.info({
							phase: 'session_restored',
							requestId: event.locals.requestId,
							userId: user.id,
							roleCount: user.roles?.length ?? 0
						});
					} else {
						log.warn({
							phase: 'session_user_missing',
							requestId: event.locals.requestId,
							sessionUserId: session.id
						});
					}
				}
			}
		}

		const response = await resolve(event);
		const finalResponse = applyOriginCacheHeaders(response, event.request);

		log.info({
			phase: 'request_completed',
			requestId: event.locals.requestId,
			method: event.request.method,
			path: url.pathname,
			status: finalResponse.status,
			durationMs: Date.now() - startedAt,
			authenticated: Boolean(event.locals.user)
		});

		return finalResponse;
	} catch (error) {
		log.error({
			phase: 'request_failed',
			requestId: event.locals.requestId,
			method: event.request.method,
			path: url.pathname,
			durationMs: Date.now() - startedAt,
			error: serializeError(error)
		});
		throw error;
	}
}
