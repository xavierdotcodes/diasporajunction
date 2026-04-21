import { loadCommunityPortal } from '$lib/server/community/page';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	return loadCommunityPortal(event);
}
