// @ts-nocheck
import { createResendProvider } from './resend.js';

export function createEmailProvider(env = process.env, options = {}) {
	const providerName = env.EMAIL_PROVIDER || 'resend';
	if (providerName !== 'resend') {
		return {
			isConfigured: () => false,
			getMissingConfig: () => ['EMAIL_PROVIDER'],
			sendEmail: async () => ({
				ok: false,
				skipped: true,
				reason: 'unsupported_provider',
				missingConfig: ['EMAIL_PROVIDER']
			})
		};
	}
	return createResendProvider(env, options.fetchImpl);
}

export async function sendEmail(message, options = {}) {
	const provider = options.provider || createEmailProvider(options.env, options);
	if (!provider.isConfigured()) {
		return {
			ok: false,
			skipped: true,
			reason: 'missing_config',
			missingConfig: provider.getMissingConfig()
		};
	}
	try {
		return await provider.sendEmail(message);
	} catch {
		return { ok: false, skipped: false, reason: 'send_failed' };
	}
}
