import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export function load({ locals, url }) {
	if (locals.supabaseUser?.id) {
		throw redirect(303, url.searchParams.get('next') || '/housing/owners');
	}

	return {
		next: url.searchParams.get('next') || '/housing/owners',
		supabaseConfigured: Boolean(locals.supabaseConfigured)
	};
}
