import { unsubscribeLead } from '$lib/server/leads';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/(site)/unsubscribe/+page.server.js');

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const leadId = url.searchParams.get('lead');

	if (!leadId) {
		return {
			success: false,
			message: 'This unsubscribe link is missing the lead reference.'
		};
	}

	const result = await unsubscribeLead(leadId);

	if (!result.ok) {
		return {
			success: false,
			message: 'We could not process that unsubscribe request.'
		};
	}

	return {
		success: true,
		message: 'You have been unsubscribed from DiasporaJunxion emails.'
	};
}
