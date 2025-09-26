import { prisma } from '$lib/server/prisma';

export async function handle({ event, resolve }) {
	const session = event.cookies.get('session');

	if (session) {
		const user = await prisma.user.findUnique({
			where: { id: parseInt(session) }
		});
		if (user) event.locals.user = user;
	}

	return resolve(event);
}
