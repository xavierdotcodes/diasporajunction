import { unsubscribeLead } from '$lib/server/leads';
import { requestLogger } from '$lib/utils/logger';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const { url } = event;
	const log = requestLogger('free.unsubscribe.page.server', event);
	const leadId = url.searchParams.get('lead');

	log.info({
		op: 'load',
		phase: 'start',
		hasLeadId: Boolean(leadId)
	});

	if (!leadId) {
		log.warn({
			op: 'guard',
			phase: 'error',
			reason: 'missing_lead'
		});
		return {
			success: false,
			message: 'This unsubscribe link is missing the lead reference.'
		};
	}

	const result = await unsubscribeLead(leadId);

	if (!result.ok) {
		log.warn({
			op: 'mutation',
			phase: 'error',
			reason: 'unsubscribe_failed'
		});
		return {
			success: false,
			message: 'We could not process that unsubscribe request.'
		};
	}

	log.info({
		op: 'mutation',
		phase: 'success'
	});

	return {
		success: true,
		message: 'You have been unsubscribed from DiasporaJunxion emails.'
	};
}
