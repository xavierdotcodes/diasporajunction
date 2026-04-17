import {
	LEAD_ATTRIBUTION_STORAGE_KEY,
	LEAD_CAPTURE_STORAGE_KEY,
	LEAD_MODAL_DISMISSED_AT_KEY,
	LEAD_MODAL_DISMISS_DAYS
} from '$lib/lead/constants';

function isBrowser() {
	return typeof window !== 'undefined';
}

function getStorageItem(key) {
	if (!isBrowser()) return null;
	return window.localStorage.getItem(key);
}

function setStorageItem(key, value) {
	if (!isBrowser()) return;
	window.localStorage.setItem(key, value);
}

export function getStoredLeadAttribution() {
	const raw = getStorageItem(LEAD_ATTRIBUTION_STORAGE_KEY);
	if (!raw) return {};

	try {
		return JSON.parse(raw);
	} catch {
		return {};
	}
}

export function persistLeadAttribution(url = window.location) {
	if (!isBrowser()) return {};

	const nextUrl =
		typeof url === 'string'
			? new URL(url, window.location.origin)
			: url instanceof URL
				? url
				: new URL(url.href, window.location.origin);
	const existing = getStoredLeadAttribution();
	const params = nextUrl.searchParams;

	const next = {
		utmSource: params.get('utm_source') || existing.utmSource || null,
		utmMedium: params.get('utm_medium') || existing.utmMedium || null,
		utmCampaign: params.get('utm_campaign') || existing.utmCampaign || null,
		utmContent: params.get('utm_content') || existing.utmContent || null,
		referrer: existing.referrer || document.referrer || null,
		firstLandingPage:
			existing.firstLandingPage || `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}` || null
	};

	setStorageItem(LEAD_ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
	return next;
}

export function markLeadCaptured() {
	setStorageItem(LEAD_CAPTURE_STORAGE_KEY, new Date().toISOString());
}

export function hasCapturedLead() {
	return Boolean(getStorageItem(LEAD_CAPTURE_STORAGE_KEY));
}

export function dismissLeadModal() {
	setStorageItem(LEAD_MODAL_DISMISSED_AT_KEY, new Date().toISOString());
}

export function isLeadModalDismissed() {
	const raw = getStorageItem(LEAD_MODAL_DISMISSED_AT_KEY);
	if (!raw) return false;

	const dismissedAt = new Date(raw).getTime();
	if (Number.isNaN(dismissedAt)) return false;

	return Date.now() - dismissedAt < LEAD_MODAL_DISMISS_DAYS * 24 * 60 * 60 * 1000;
}
