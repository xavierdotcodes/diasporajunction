// @ts-nocheck
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export function createResendProvider(env = process.env, fetchImpl = globalThis.fetch) {
	const missing = [];
	if (!env.RESEND_API_KEY) missing.push('RESEND_API_KEY');
	if (!env.EMAIL_FROM) missing.push('EMAIL_FROM');

	return {
		isConfigured() {
			return missing.length === 0;
		},
		getMissingConfig() {
			return [...missing];
		},
		async sendEmail(message) {
			if (missing.length > 0) {
				return { ok: false, skipped: true, reason: 'missing_config', missingConfig: [...missing] };
			}
			if (typeof fetchImpl !== 'function') {
				return { ok: false, skipped: true, reason: 'missing_fetch', missingConfig: [] };
			}

			const payload = {
				from: env.EMAIL_FROM,
				to: Array.isArray(message.to) ? message.to : [message.to],
				subject: message.subject,
				html: message.html,
				text: message.text
			};
			if (env.EMAIL_REPLY_TO) payload.reply_to = env.EMAIL_REPLY_TO;
			if (message.tags) {
				payload.tags = Object.entries(message.tags).map(([name, value]) => ({
					name,
					value: String(value)
				}));
			}

			const response = await fetchImpl(RESEND_ENDPOINT, {
				method: 'POST',
				headers: {
					authorization: `Bearer ${env.RESEND_API_KEY}`,
					'content-type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				return { ok: false, provider: 'resend', status: response.status, error: 'provider_error' };
			}
			const data = await response.json().catch(() => ({}));
			return { ok: true, provider: 'resend', id: data.id ?? null };
		}
	};
}
