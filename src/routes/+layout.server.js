import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/+layout.server.js');

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	const user = locals.user
		? {
				id: locals.user.id,
				email: locals.user.email ?? null,
				name: locals.user.name ?? null,
				roles: Array.isArray(locals.user.roles)
					? locals.user.roles.map((role) => role.role ?? role)
					: []
			}
		: null;

	return { user };
}
