import posthog from 'posthog-js';
import { browser, dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import { fileLogger } from '$lib/utils/logger';

const log = fileLogger('src/lib/client/analytics.js');

let isInitialized = false;
let hasInstalledEngagementTracking = false;
let trackedScrollMilestones = new Set();
let engagedSeconds = 0;
let engagementTimerId;

const ENGAGEMENT_SECONDS_MILESTONES = [15, 45, 120, 300];
const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 90];
const TRACKED_LINK_SELECTOR =
	'a[href], button, [role="button"], [data-analytics-event], [data-ph-capture-attribute]';
const EXCLUDED_PATH_PREFIXES = ['/admin'];

function getPageviewPath(url) {
	if (!url) return undefined;

	if (typeof url === 'string') {
		return url;
	}

	return `${url.pathname}${url.search}${url.hash}`;
}

function getPathGroup(pathname = '') {
	if (pathname === '/') return 'home';
	if (pathname.startsWith('/housing')) return 'housing';
	if (pathname.startsWith('/community')) return 'community';
	if (pathname.startsWith('/guides')) return 'guides';
	if (pathname.startsWith('/blog')) return 'blog';
	if (pathname.startsWith('/relocate')) return 'relocate';
	if (pathname.startsWith('/invest')) return 'invest';
	if (pathname.startsWith('/about')) return 'about';
	if (pathname.startsWith('/contact')) return 'contact';
	return pathname.split('/').filter(Boolean)[0] || 'other';
}

function shouldTrackCurrentPath() {
	if (!browser) return false;
	return !EXCLUDED_PATH_PREFIXES.some((prefix) => window.location.pathname.startsWith(prefix));
}

function getCommonProperties(url = window.location) {
	const path = getPageviewPath(url);

	return {
		path,
		path_group: getPathGroup(url?.pathname || window.location.pathname),
		title: browser ? document.title : undefined,
		referrer: browser ? document.referrer || undefined : undefined
	};
}

function getElementLabel(element) {
	const explicitLabel =
		element.getAttribute('data-analytics-label') ||
		element.getAttribute('aria-label') ||
		element.getAttribute('title');

	if (explicitLabel) return explicitLabel.trim().slice(0, 120);

	return (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120) || undefined;
}

function getLinkProperties(element) {
	const href = element.getAttribute('href');
	const url = href ? new URL(href, window.location.origin) : null;

	return {
		element: element.tagName.toLowerCase(),
		label: getElementLabel(element),
		href: href || undefined,
		destination_path: url?.origin === window.location.origin ? getPageviewPath(url) : undefined,
		destination_host: url && url.origin !== window.location.origin ? url.host : undefined,
		is_outbound: Boolean(url && url.origin !== window.location.origin),
		analytics_area: element.getAttribute('data-analytics-area') || undefined,
		analytics_id: element.getAttribute('data-analytics-id') || undefined
	};
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
		defaults: '2025-05-24',
		autocapture: true,
		capture_pageview: false,
		capture_pageleave: true,
		disable_session_recording: false,
		disable_surveys: true,
		disable_product_tours: true,
		mask_all_element_attributes: true,
		session_recording: {
			maskAllInputs: true
		},
		loaded(client) {
			if (dev) {
				client.opt_out_capturing();
			}
		}
	});

	isInitialized = true;
	log.info({ phase: 'posthog_initialized' });
	return true;
}

export function capturePageview(url = window.location) {
	if (!browser || !isInitialized || !shouldTrackCurrentPath()) return;

	log.debug({
		phase: 'posthog_pageview_captured',
		path: getPageviewPath(url)
	});
	posthog.capture('$pageview', {
		$current_url: url.toString(),
		$pathname: getPageviewPath(url),
		...getCommonProperties(url)
	});

	trackedScrollMilestones = new Set();
	engagedSeconds = 0;
}

export function captureAnalyticsEvent(eventName, properties = {}) {
	if (!browser || !isInitialized || !shouldTrackCurrentPath()) return;

	log.debug({
		phase: 'posthog_event_captured',
		eventName
	});
	posthog.capture(eventName, {
		...getCommonProperties(),
		...properties
	});
}

export function captureExampleButtonClick(buttonName) {
	// Example custom event helper. Reuse this pattern for button clicks and CTAs later.
	captureAnalyticsEvent('example_button_clicked', { button_name: buttonName });
}

export function identifyPostHogUser(distinctId, properties = {}) {
	if (!browser || !isInitialized) return;

	log.info({
		phase: 'posthog_user_identified',
		distinctId
	});
	posthog.identify(distinctId, {
		...properties,
		path_group: getPathGroup(window.location.pathname)
	});
}

export function resetPostHogUser() {
	if (!browser || !isInitialized) return;

	log.info({ phase: 'posthog_user_reset' });
	posthog.reset();
}

export function initializeEngagementTracking() {
	if (!browser || hasInstalledEngagementTracking) return;

	hasInstalledEngagementTracking = true;

	window.addEventListener(
		'scroll',
		() => {
			if (!isInitialized || !shouldTrackCurrentPath()) return;

			const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (scrollableHeight <= 0) return;

			const depth = Math.round((window.scrollY / scrollableHeight) * 100);
			for (const milestone of SCROLL_DEPTH_MILESTONES) {
				if (depth < milestone || trackedScrollMilestones.has(milestone)) continue;
				trackedScrollMilestones.add(milestone);
				captureAnalyticsEvent('scroll_depth_reached', {
					percent: milestone
				});
			}
		},
		{ passive: true }
	);

	document.addEventListener('click', (event) => {
		if (!isInitialized || !shouldTrackCurrentPath()) return;

		const target = event.target?.closest?.(TRACKED_LINK_SELECTOR);
		if (!target || target.closest('[data-analytics-ignore]')) return;

		const explicitEventName = target.getAttribute('data-analytics-event');
		const href = target.getAttribute('href');
		const eventName = explicitEventName || (href ? 'link_clicked' : 'button_clicked');

		captureAnalyticsEvent(eventName, getLinkProperties(target));
	});

	document.addEventListener('submit', (event) => {
		if (!isInitialized || !shouldTrackCurrentPath()) return;

		const form = event.target;
		if (!(form instanceof HTMLFormElement) || form.closest('[data-analytics-ignore]')) return;

		captureAnalyticsEvent(form.getAttribute('data-analytics-event') || 'form_submitted', {
			form_id: form.getAttribute('data-analytics-id') || form.id || undefined,
			form_name: form.getAttribute('name') || undefined,
			action_path: form.action ? getPageviewPath(new URL(form.action)) : undefined,
			method: form.method || 'get'
		});
	});

	engagementTimerId = window.setInterval(() => {
		if (!isInitialized || !shouldTrackCurrentPath() || document.hidden) return;

		engagedSeconds += 15;
		if (!ENGAGEMENT_SECONDS_MILESTONES.includes(engagedSeconds)) return;

		captureAnalyticsEvent('engaged_time_reached', {
			seconds: engagedSeconds
		});
	}, 15_000);
}

export function stopEngagementTracking() {
	if (!browser || !engagementTimerId) return;

	window.clearInterval(engagementTimerId);
	engagementTimerId = undefined;
}
