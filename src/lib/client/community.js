import { fileLogger, serializeError } from '$lib/utils/logger';
import { captureAnalyticsEvent } from '$lib/client/analytics';

const log = fileLogger('src/lib/client/community.js');

export async function requestCommunityAccess(payload) {
	try {
		captureAnalyticsEvent('community_access_request_started', {
			source: payload?.source,
			email_domain: payload?.email?.split('@')[1]
		});

		log.info({
			op: 'requestCommunityAccess',
			phase: 'start',
			emailDomain: payload?.email?.split('@')[1]
		});

		const res = await fetch('/api/community/access-request', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to request community access');

		log.info({
			op: 'requestCommunityAccess',
			phase: 'success',
			status: data?.status
		});
		captureAnalyticsEvent('community_access_request_completed', {
			source: payload?.source,
			status: data?.status
		});

		return data;
	} catch (error) {
		log.error({
			op: 'requestCommunityAccess',
			phase: 'error',
			error: serializeError(error)
		});
		captureAnalyticsEvent('community_access_request_failed', {
			source: payload?.source,
			error: error.message
		});
		throw error;
	}
}

export async function updateCommunityAccess({ email, firstName, action }) {
	try {
		log.info({
			op: 'updateCommunityAccess',
			phase: 'start',
			action,
			emailDomain: email?.split('@')[1]
		});

		const res = await fetch('/admin/community/access', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, firstName, action })
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to update community access');

		log.info({
			op: 'updateCommunityAccess',
			phase: 'success',
			action,
			status: data?.grant?.status
		});

		return data;
	} catch (error) {
		log.error({
			op: 'updateCommunityAccess',
			phase: 'error',
			action,
			error: serializeError(error)
		});
		throw error;
	}
}
