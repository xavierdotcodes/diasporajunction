import prisma from '$lib/server/prisma';
import { applyOriginCacheHeaders } from '$lib/server/cache';
import { getRedis } from '$lib/server/redis';
import { fileLogger } from '$lib/utils/logger';
import { startEmailWorker } from '$lib/server/workers/email.worker.js';

fileLogger('src/hooks.server.js');

let workerStarted = false;

export async function handle({ event, resolve }) {
	if (!workerStarted) {
		startEmailWorker();
		workerStarted = true;
	}

	const sessionId = event.cookies.get('session');

	if (sessionId) {
		const redis = getRedis();
		const rawSession = await redis.get(`session:${sessionId}`);
		if (rawSession) {
			const session = JSON.parse(rawSession);
			if (session?.id) {
				// Include roles when fetching user
				const user = await prisma.user.findUnique({
					where: { id: session.id },
					include: { roles: true } // ✅ add this
				});
				if (user) {
					event.locals.user = user;
				}
			}
		}
	}

	const response = await resolve(event);
	return applyOriginCacheHeaders(response, event.request);
}
