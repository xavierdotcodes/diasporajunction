import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { fileLogger } from '$lib/utils/logger';

const log = fileLogger('src/lib/client/analytics.js');

let isInitialized = false;

function getPageviewPath(url) {
	if (!url) return undefined;

	if (typeof url === 'string') {
		return url;
	}

	return `${url.pathname}${url.search}${url.hash}`;
}

export function initPostHog() {
	if (!browser || isInitialized) return false;

	const publicPostHogKey = env.PUBLIC_POSTHOG_KEY;
	const publicPostHogHost = env.PUBLIC_POSTHOG_HOST;

	if (!publicPostHogKey || !publicPostHogHost) {
		if (dev) {
			log.warn({
				phase: 'posthog_init_skipped',
				reason: 'missing_public_config'
			});
		}

		return false;
	}

	posthog.init(publicPostHogKey, {
		api_host: publicPostHogHost,
		autocapture: false,
		capture_pageview: false,
		capture_pageleave: false,
		disable_session_recording: true,
		disable_surveys: true,
		disable_product_tours: true
	});

	isInitialized = true;
	log.info({ phase: 'posthog_initialized' });
	return true;
}

export function capturePageview(url = window.location) {
	if (!browser || !isInitialized) return;

	log.debug({
		phase: 'posthog_pageview_captured',
		path: getPageviewPath(url)
	});
	posthog.capture('$pageview', {
		$current_url: url.toString(),
		$pathname: getPageviewPath(url)
	});
}

export function captureAnalyticsEvent(eventName, properties = {}) {
	if (!browser || !isInitialized) return;

	log.debug({
		phase: 'posthog_event_captured',
		eventName
	});
	posthog.capture(eventName, properties);
}

export function captureExampleButtonClick(buttonName) {
	// Example custom event helper. Reuse this pattern for button clicks and CTAs later.
	captureAnalyticsEvent('example_button_clicked', { button_name: buttonName });
}

export function identifyPostHogUser(distinctId, properties = {}) {
	// Extend here later when you have authenticated users and want person-level analytics.
	if (!browser || !isInitialized) return;

	log.info({
		phase: 'posthog_user_identified',
		distinctId
	});
	posthog.identify(distinctId, properties);
}

export function resetPostHogUser() {
	if (!browser || !isInitialized) return;

	log.info({ phase: 'posthog_user_reset' });
	posthog.reset();
}
