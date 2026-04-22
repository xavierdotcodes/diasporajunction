import { loadHousingListingsPage } from '$lib/server/housing/page';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	return loadHousingListingsPage(event);
}
