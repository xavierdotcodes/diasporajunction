import { error, redirect } from '@sveltejs/kit';
import { buildTrackedRedirect } from '$lib/server/redirects';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/go/[slug]/[campaign]/+server.js');

/** @type {import('./$types').RequestHandler} */
export function GET({ params, url }) {
	const destination = buildTrackedRedirect(url.origin, params.slug, params.campaign);

	if (!destination) {
		throw error(404, 'Unknown redirect link');
	}

	throw redirect(302, destination.toString());
}
