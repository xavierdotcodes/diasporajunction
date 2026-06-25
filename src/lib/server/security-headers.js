import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/security-headers.js');

const SECURITY_HEADERS = {
	'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
	'x-content-type-options': 'nosniff',
	'x-frame-options': 'DENY',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'permissions-policy':
		'accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(self), picture-in-picture=(self), publickey-credentials-get=(self), screen-wake-lock=(), usb=(), web-share=(self), xr-spatial-tracking=()'
};

const BASE_SCRIPT_SRC = [
	"'self'",
	"'unsafe-inline'",
	'https://js.stripe.com',
	'https://*.sentry.io',
	'https://*.ingest.sentry.io',
	'https://*.ingest.de.sentry.io',
	'https://us.i.posthog.com',
	'https://eu.i.posthog.com'
];

const CONNECT_SRC = [
	"'self'",
	'https://*.supabase.co',
	'wss://*.supabase.co',
	'https://api.stripe.com',
	'https://js.stripe.com',
	'https://*.sentry.io',
	'https://*.ingest.sentry.io',
	'https://*.ingest.de.sentry.io',
	'https://us.i.posthog.com',
	'https://eu.i.posthog.com',
	'https://*.posthog.com',
	'https://*.i.posthog.com'
];

const CONTENT_SECURITY_POLICY = [
	"default-src 'self'",
	`script-src ${BASE_SCRIPT_SRC.join(' ')}`,
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: blob: https:",
	"font-src 'self' data:",
	`connect-src ${CONNECT_SRC.join(' ')}`,
	"media-src 'self' blob: https:",
	"frame-src https://js.stripe.com https://hooks.stripe.com https://calendly.com https://*.calendly.com",
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"object-src 'none'",
	"upgrade-insecure-requests"
].join('; ');

export function applySecurityHeaders(response) {
	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(name, value);
	}

	response.headers.set('content-security-policy', CONTENT_SECURITY_POLICY);
	return response;
}
