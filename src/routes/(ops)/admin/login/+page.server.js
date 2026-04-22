import { fail, redirect } from '@sveltejs/kit';
import { authenticateAdminAccount, hasAdminRole, resolveAdminNext } from '$lib/server/admin-auth';
import { createSession } from '$lib/server/session';
import { requestLogger, serializeError } from '$lib/utils/logger';

function getValue(formData, key) {
	return String(formData.get(key) || '').trim();
}

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const next = resolveAdminNext(event.url.searchParams.get('next'));

	if (hasAdminRole(event.locals)) {
		throw redirect(303, next);
	}

	return { next };
}

export const actions = {
	login: async (event) => {
		const log = requestLogger('admin.login', event);
		const formData = await event.request.formData();
		const email = getValue(formData, 'email').toLowerCase();
		const password = String(formData.get('password') || '');
		const next = resolveAdminNext(getValue(formData, 'next'));

		try {
			const result = await authenticateAdminAccount({ email, password });

			if (!result.ok || !result.adminAccount) {
				return fail(401, {
					error: 'Incorrect email or password.',
					email,
					next
				});
			}

			const sessionId = await createSession({
				id: result.adminAccount.id,
				adminAccountId: result.adminAccount.id,
				accountType: 'admin',
				email: result.adminAccount.email,
				name: result.adminAccount.name,
				roles: [{ role: 'ADMIN' }]
			});

			event.cookies.set('session', sessionId, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60
			});
		} catch (error) {
			log.error({
				op: 'login',
				phase: 'error',
				error: serializeError(error)
			});

			return fail(500, { error: 'Could not sign you in.' });
		}

		throw redirect(303, next);
	}
};
