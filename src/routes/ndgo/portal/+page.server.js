import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { prisma } from '$lib/server/prisma';
import { createSession, getSession } from '$lib/server/session';

const ALLOWED_ROLES = ['ADMIN', 'TEACHER', 'STUDENT'];

export const actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const user = await prisma.user.findUnique({
			where: { email },
			include: { roles: true }
		});

		if (!user || !user.password) return fail(401, { incorrect: true });

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) return fail(401, { incorrect: true });

		// Keep only allowed roles
		const allowedUserRoles = user.roles
			.map((r) => r.role)
			.filter((role) => ALLOWED_ROLES.includes(role));

		if (allowedUserRoles.length === 0) {
			return fail(403, { notAllowed: true });
		}

		const sessionId = await createSession({
			id: user.id,
			roles: allowedUserRoles
		});

		cookies.set('ndgo-portal', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60
		});

		// Redirect based on role priority
		if (allowedUserRoles.includes('ADMIN')) throw redirect(303, '/ndgo/portal/');
		if (allowedUserRoles.includes('TEACHER')) throw redirect(303, '/ndgo/portal/teachers');
		if (allowedUserRoles.includes('STUDENT')) throw redirect(303, '/ndgo/portal/students');

		throw redirect(303, '/ndgo/portal/');
	}
};

export async function load({ cookies }) {
	const sessionId = cookies.get('ndgo-portal');
	if (!sessionId) return { loggedIn: false, roles: [] };

	const session = await getSession(sessionId);
	if (!session) return { loggedIn: false, roles: [] };

	return { loggedIn: true, roles: session.roles };
}
