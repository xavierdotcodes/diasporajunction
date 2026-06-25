import { sequence } from '@sveltejs/kit/hooks';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import prisma from '$lib/server/prisma';
import { applyOriginCacheHeaders } from '$lib/server/cache';
import { safeEnforceRateLimit } from '$lib/server/rate-limit';
import { getRedis } from '$lib/server/redis';
import { applySecurityHeaders } from '$lib/server/security-headers';
import { createSupabaseServerClient, hasSupabaseConfig } from '$lib/supabase/server';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/hooks.server.js');

async function appHandle({ event, resolve }) {
	const startedAt = Date.now();
	const url = new URL(event.request.url);
	event.locals.requestId = crypto.randomUUID();
	event.locals.supabase = createSupabaseServerClient(event);
	event.locals.supabaseConfigured = hasSupabaseConfig();
	event.locals.user = null;
	event.locals.adminAccount = null;
	event.locals.supabaseUser = null;
	event.locals.supabaseSession = null;

	log.info({
		phase: 'request_started',
		requestId: event.locals.requestId,
		method: event.request.method,
		path: url.pathname,
		search: url.search || undefined
	});

	try {
		const rateLimitResponse = await safeEnforceRateLimit(event);
		if (rateLimitResponse) {
			return applySecurityHeaders(rateLimitResponse);
		}

		if (event.locals.supabase) {
			try {
				const {
					data: { user },
					error: userError
				} = await event.locals.supabase.auth.getUser();

				if (!userError && user) {
					const {
						data: { session }
					} = await event.locals.supabase.auth.getSession();

					event.locals.supabaseUser = user;
					event.locals.supabaseSession = session ?? null;

					log.info({
						phase: 'supabase_session_restored',
						requestId: event.locals.requestId,
						supabaseUserId: user.id
					});
				}
			} catch (error) {
				log.error({
					phase: 'supabase_session_failed',
					requestId: event.locals.requestId,
					error: serializeError(error)
				});
			}
		}

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
				const sessionUserId = session?.userId ?? session?.id;
				const sessionAdminAccountId = session?.adminAccountId;

				if (sessionAdminAccountId && typeof prisma.adminAccount?.findUnique === 'function') {
					const adminAccount = await prisma.adminAccount.findUnique({
						where: { id: sessionAdminAccountId }
					});

					if (adminAccount?.active) {
						event.locals.adminAccount = adminAccount;
						event.locals.user = {
							id: adminAccount.id,
							email: adminAccount.email,
							name: adminAccount.name,
							subscribed: false,
							roles: [{ role: 'ADMIN' }]
						};

						log.info({
							phase: 'admin_session_restored',
							requestId: event.locals.requestId,
							adminAccountId: adminAccount.id
						});
					}
				} else if (sessionUserId && typeof prisma.user?.findUnique === 'function') {
					const user = await prisma.user.findUnique({
						where: { id: sessionUserId },
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
							sessionUserId
						});
					}
				}
			}
		}

		const response = await resolve(event, {
			filterSerializedResponseHeaders(name) {
				return name === 'content-range' || name === 'x-supabase-api-version';
			}
		});
		const finalResponse = applyOriginCacheHeaders(response, event.request);

		log.info({
			phase: 'request_completed',
			requestId: event.locals.requestId,
			method: event.request.method,
			path: url.pathname,
			status: finalResponse.status,
			durationMs: Date.now() - startedAt,
			authenticated: Boolean(event.locals.user),
			supabaseAuthenticated: Boolean(event.locals.supabaseUser)
		});

		return applySecurityHeaders(finalResponse);
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

export const handle = sequence(sentryHandle(), appHandle);
export const handleError = handleErrorWithSentry();
