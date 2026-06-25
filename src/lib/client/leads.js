import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
import { captureAnalyticsEvent } from '$lib/client/analytics';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/lib/client/leads.js');

export async function captureLead(payload) {
	try {
		captureAnalyticsEvent('lead_capture_started', {
			source: payload?.source,
			leadMagnet: payload?.leadMagnet,
			entryPage: payload?.entryPage,
			has_first_name: Boolean(payload?.firstName),
			email_domain: payload?.email?.split('@')[1]
		});

		log.info({
			op: 'captureLead',
			phase: 'start',
			source: payload?.source,
			leadMagnet: payload?.leadMagnet,
			entryPage: payload?.entryPage
		});

		const res = await fetch('/api/leads', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to capture lead');

		log.info({
			op: 'captureLead',
			phase: 'success',
			leadId: data.leadId,
			created: data.created
		});
		captureAnalyticsEvent('lead_capture_completed', {
			source: payload?.source,
			leadMagnet: payload?.leadMagnet,
			entryPage: payload?.entryPage,
			created: Boolean(data.created),
			lead_id: data.leadId
		});

		return data;
	} catch (error) {
		log.error({
			op: 'captureLead',
			phase: 'error',
			error: serializeError(error)
		});
		captureAnalyticsEvent('lead_capture_failed', {
			source: payload?.source,
			leadMagnet: payload?.leadMagnet,
			entryPage: payload?.entryPage,
			error: error.message
		});
		throw error;
	}
}

export async function subscribe(email, name = '', metadata = {}) {
	if (!email) throw new Error('Email is required');

	log.info({
		op: 'subscribe',
		phase: 'start',
		emailDomain: email?.split('@')[1]
	});

	const data = await captureLead({
		email,
		firstName: name,
		source: metadata.source || 'newsletter_modal',
		leadMagnet: metadata.leadMagnet || DEFAULT_LEAD_MAGNET_NAME,
		entryPage: metadata.entryPage || globalThis.location?.pathname || null,
		referrer: metadata.referrer || globalThis.document?.referrer || null,
		utmSource: metadata.utmSource || null,
		utmMedium: metadata.utmMedium || null,
		utmCampaign: metadata.utmCampaign || null,
		utmContent: metadata.utmContent || null
	});

	log.info({
		op: 'subscribe',
		phase: 'success',
		leadId: data?.leadId,
		created: data?.created
	});

	return data;
}
