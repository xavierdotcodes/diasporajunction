import { prisma } from '$lib/server/prisma';
import { redis } from '$lib/server/redis';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		const rawSession = await redis.get(`session:${sessionId}`);
		if (rawSession) {
			const session = JSON.parse(rawSession);
			if (session?.id) {
				const user = await prisma.user.findUnique({ where: { id: session.id } });
				if (user) event.locals.user = user;
			}
		}
	}

	return resolve(event);
}
