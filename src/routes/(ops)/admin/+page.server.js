import { redirect } from '@sveltejs/kit';
import { hasAdminRole } from '$lib/server/admin-auth';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/(ops)/admin/+page.server.js');

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (!hasAdminRole(locals)) {
		throw redirect(302, '/admin/login');
	}

	throw redirect(302, '/admin/housing');
}
