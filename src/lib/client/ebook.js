import { fileLogger, serializeError } from '$lib/utils/logger';
import { captureAnalyticsEvent } from '$lib/client/analytics';

const log = fileLogger('src/lib/client/ebook.js');

export async function startEbookCheckout(payload) {
	try {
		captureAnalyticsEvent('checkout_started', {
			product: 'ebook',
			source: payload?.source,
			email_domain: payload?.email?.split('@')[1]
		});

		log.info({
			op: 'startEbookCheckout',
			phase: 'start',
			emailDomain: payload?.email?.split('@')[1]
		});

		const res = await fetch('/api/ebook/checkout-session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to start ebook checkout');

		log.info({
			op: 'startEbookCheckout',
			phase: 'success',
			sessionId: data?.sessionId
		});
		captureAnalyticsEvent('checkout_session_created', {
			product: 'ebook',
			source: payload?.source,
			session_id: data?.sessionId
		});

		return data;
	} catch (error) {
		log.error({
			op: 'startEbookCheckout',
			phase: 'error',
			error: serializeError(error)
		});
		captureAnalyticsEvent('checkout_failed', {
			product: 'ebook',
			source: payload?.source,
			error: error.message
		});
		throw error;
	}
}
