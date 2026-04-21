import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { fileLogger, scopedLogger, serializeError } from '$lib/utils/logger';

fileLogger('src/lib/server/email/resend.js');
const log = scopedLogger('email.resend');

let resend;

function getEmailDomain(value) {
	if (typeof value !== 'string') return null;
	return value.split('@')[1] || null;
}

function getRecipientDomains(to) {
	if (Array.isArray(to)) {
		return to.map(getEmailDomain).filter(Boolean);
	}

	const domain = getEmailDomain(to);
	return domain ? [domain] : [];
}

export function getResendClient() {
    if (!resend) {
        if (!env.RESEND_API_KEY) {
            throw new Error('Missing RESEND_API_KEY in environment');
        }

        resend = new Resend(env.RESEND_API_KEY);

		log.info({
			op: 'init_client',
			phase: 'success'
		});
    }

    return resend;
}

export function getResendFromAddress() {
    return env.RESEND_FROM_EMAIL || 'DiasporaJunxion <hello@diasporajunxion.com>';
}

export async function sendResendEmail({ to, subject, html, text, tags = [] }) {
    const client = getResendClient();
	const from = getResendFromAddress();

	log.info({
		op: 'send_email',
		phase: 'start',
		fromDomain: getEmailDomain(from),
		toDomains: getRecipientDomains(to),
		subject,
		tagCount: tags.length,
		tags
	});

	let result;

	try {
		result = await client.emails.send({
			from,
			to,
			subject,
			html,
			text,
			tags
		});
	} catch (error) {
		log.error({
			op: 'send_email',
			phase: 'error',
			fromDomain: getEmailDomain(from),
			toDomains: getRecipientDomains(to),
			subject,
			error: serializeError(error)
		});
		throw error;
	}

	if (result?.error) {
		const resendError = new Error(result.error.message || 'Resend email send failed');
		log.error({
			op: 'send_email',
			phase: 'provider_error',
			fromDomain: getEmailDomain(from),
			toDomains: getRecipientDomains(to),
			subject,
			error: serializeError(result.error)
		});
		throw resendError;
	}

	log.info({
		op: 'send_email',
		phase: 'success',
		fromDomain: getEmailDomain(from),
		toDomains: getRecipientDomains(to),
		subject,
		providerMessageId: result?.data?.id ?? result?.id ?? null
	});

    return result;
}
