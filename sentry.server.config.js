import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN, PUBLIC_SENTRY_ENVIRONMENT } from '$env/static/public';

const dsn =
	PUBLIC_SENTRY_DSN ||
	'https://61678911ebbcda1fab1ed5bcaca79509@o4511309487276032.ingest.de.sentry.io/4511621240848464';

if (dsn) {
	Sentry.init({
		dsn,
		environment: PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
		tracesSampleRate: 0.1
	});
}
