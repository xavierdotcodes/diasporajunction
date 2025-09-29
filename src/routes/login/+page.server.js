import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '$lib/server/prisma';
import { getRedis } from '$lib/server/redis';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const user = await prisma.user.findUnique({
			where: { email },
			include: { roles: true }
		});

		if (!user || !user.roles.some((r) => r.role === 'ADMIN')) {
			return fail(401, { error: 'Invalid credentials' });
		}

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return fail(401, { error: 'Invalid credentials' });
		}

		// Create Redis session
		const redis = getRedis();
		const sessionId = crypto.randomBytes(32).toString('hex');
		await redis.set(
			`session:${sessionId}`,
			JSON.stringify({ id: user.id, roles: user.roles.map((r) => r.role) }),
			'EX',
			60 * 60 * 2
		);

		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 2
		});

		// Redirect to admin dashboard
		throw redirect(303, '/admin');
	}
};
