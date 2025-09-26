// src/routes/login/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '$lib/server/prisma';
import { redis } from '$lib/server/redis';

export const actions = {
	default: async ({ request, cookies }) => {
		// 1️⃣ Get form data
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		// 2️⃣ Find user in DB
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user || user.role !== 'ADMIN') {
			return fail(401, { error: 'Invalid credentials' });
		}

		// 3️⃣ Check password
		const valid = await bcrypt.compare(password, user.passwordHash);
		if (!valid) {
			return fail(401, { error: 'Invalid credentials' });
		}

		// 4️⃣ Create Redis session
		const sessionId = crypto.randomBytes(32).toString('hex');
		await redis.set(
			`session:${sessionId}`,
			JSON.stringify({ id: user.id, role: user.role }),
			'EX',
			60 * 60 * 2 // 2 hours
		);

		// 5️⃣ Set HttpOnly cookie
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 2
		});

		// 6️⃣ Redirect to admin page
		throw redirect(303, '/admin');
	}
};
