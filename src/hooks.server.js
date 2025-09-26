// src/hooks.server.js (or wherever this handle lives)
import { prisma } from '$lib/server/prisma';
import { getRedis } from '$lib/server/redis';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		const redis = getRedis(); // ✅ lazy init
		const rawSession = await redis.get(`session:${sessionId}`);
		if (rawSession) {
			const session = JSON.parse(rawSession);
			if (session?.id) {
				const user = await prisma.user.findUnique({ where: { id: session.id } });
				if (user) {
					event.locals.user = user;
				}
			}
		}
	}

	return resolve(event);
}
