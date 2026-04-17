import { PostHog } from 'posthog-node';
import { env } from '$env/dynamic/private';
import { fileLogger, scopedLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/posthog.js');

const log = scopedLogger('server-posthog');

let client;
let warnedMissingConfig = false;

export function getServerPostHog() {
	if (client) return client;

	const apiKey = env.POSTHOG_API_KEY;
	const host = env.POSTHOG_HOST || 'https://us.i.posthog.com';

	if (!apiKey) {
		if (!warnedMissingConfig) {
			log.warn({
				phase: 'disabled',
				reason: 'missing_posthog_api_key'
			});
			warnedMissingConfig = true;
		}

		return null;
	}

	client = new PostHog(apiKey, {
		host,
		flushAt: 20,
		flushInterval: 10000
	});

	return client;
}

export function captureServerEvent({
	distinctId,
	event,
	properties = {},
	groups,
	sendFeatureFlags
}) {
	const posthog = getServerPostHog();
	if (!posthog) return false;

	posthog.capture({
		distinctId,
		event,
		properties,
		groups,
		sendFeatureFlags
	});

	return true;
}

export async function flushServerPostHog() {
	const posthog = getServerPostHog();
	if (!posthog) return;

	await posthog.flush();
}

export async function shutdownServerPostHog() {
	if (!client) return;

	await client.shutdown();
	client = null;
}
