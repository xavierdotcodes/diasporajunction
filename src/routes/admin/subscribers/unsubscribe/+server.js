import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function POST({ request }) {
	try {
		const { id } = await request.json();

		if (!id) {
			return json({ error: 'Missing user id' }, { status: 400 });
		}

		const user = await prisma.user.update({
			where: { id: Number(id) },
			data: { subscribed: false } // explicitly set to false
		});

		return json({ success: true, user });
	} catch (err) {
		console.error('Failed to unsubscribe user:', err);
		return json({ error: 'Failed to unsubscribe user' }, { status: 500 });
	}
}
