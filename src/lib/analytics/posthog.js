import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/analytics/posthog.js');

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
			console.warn(
				'PostHog not initialized. Set PUBLIC_POSTHOG_KEY and PUBLIC_POSTHOG_HOST in your environment.'
			);
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
	return true;
}

export function capturePageview(url = window.location) {
	if (!browser || !isInitialized) return;

	posthog.capture('$pageview', {
		$current_url: url.toString(),
		$pathname: getPageviewPath(url)
	});
}

export function captureAnalyticsEvent(eventName, properties = {}) {
	if (!browser || !isInitialized) return;

	posthog.capture(eventName, properties);
}

export function captureExampleButtonClick(buttonName) {
	// Example custom event helper. Reuse this pattern for button clicks and CTAs later.
	captureAnalyticsEvent('example_button_clicked', { button_name: buttonName });
}

export function identifyPostHogUser(distinctId, properties = {}) {
	// Extend here later when you have authenticated users and want person-level analytics.
	if (!browser || !isInitialized) return;

	posthog.identify(distinctId, properties);
}

export function resetPostHogUser() {
	if (!browser || !isInitialized) return;

	posthog.reset();
}
