import { inngest } from './client.js';
import { assertSafeEventPayload, safeEventPayload } from './events.js';

export async function sendInngestEvent(name, data = {}, options = {}) {
	const payload = safeEventPayload(data);
	assertSafeEventPayload(payload);

	if (!process.env.INNGEST_EVENT_KEY && !options.allowMissingConfig) {
		return {
			ok: false,
			missingConfig: ['INNGEST_EVENT_KEY'],
			message: 'Inngest is not configured.'
		};
	}

	if (!process.env.INNGEST_EVENT_KEY && options.allowMissingConfig) {
		console.warn(JSON.stringify({ level: 'warn', message: 'Skipping Inngest event; missing INNGEST_EVENT_KEY', name }));
		return { ok: true, skipped: true, missingConfig: ['INNGEST_EVENT_KEY'], name, data: payload };
	}

	await inngest.send({ name, data: payload });
	return { ok: true, name, data: payload };
}

export async function trySendInngestEvent(name, data = {}) {
	try {
		return await sendInngestEvent(name, data, { allowMissingConfig: true });
	} catch (error) {
		console.warn(
			JSON.stringify({
				level: 'warn',
				message: 'Inngest event send failed without blocking primary flow',
				name,
				error: error instanceof Error ? error.message : 'Unknown error'
			})
		);
		return { ok: false, name, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
