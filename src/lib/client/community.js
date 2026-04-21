import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/lib/client/community.js');

export async function requestCommunityAccess(payload) {
	try {
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

		return data;
	} catch (error) {
		log.error({
			op: 'requestCommunityAccess',
			phase: 'error',
			error: serializeError(error)
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

export async function startCommunityCheckout(payload) {
	try {
		log.info({
			op: 'startCommunityCheckout',
			phase: 'start',
			emailDomain: payload?.email?.split('@')[1]
		});

		const res = await fetch('/api/community/checkout-session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to start community checkout');

		log.info({
			op: 'startCommunityCheckout',
			phase: 'success',
			sessionId: data?.sessionId
		});

		return data;
	} catch (error) {
		log.error({
			op: 'startCommunityCheckout',
			phase: 'error',
			error: serializeError(error)
		});
		throw error;
	}
}
