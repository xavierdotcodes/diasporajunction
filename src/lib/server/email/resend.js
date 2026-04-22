import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { fileLogger, scopedLogger, serializeError } from '$lib/utils/logger';

fileLogger('src/lib/server/email/resend.js');
const log = scopedLogger('email.resend');

let resend;

function stripWrappingQuotes(value) {
	if (typeof value !== 'string') return value;

	const trimmed = value.trim();

	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1).trim();
	}

	return trimmed;
}

function extractEmailAddress(value) {
	if (typeof value !== 'string') return null;

	const normalized = stripWrappingQuotes(value);
	const match = normalized.match(/<([^>]+)>/);
	return (match ? match[1] : normalized).trim() || null;
}

function getEmailDomain(value) {
	const email = extractEmailAddress(value);
	return email?.split('@')[1] || null;
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
	const from = stripWrappingQuotes(env.RESEND_FROM_EMAIL);

	if (!from) {
		throw new Error(
			'Missing RESEND_FROM_EMAIL in environment. Set it to a verified sender, e.g. "DiasporaJunxion <hello@diasporajunxion.com>".'
		);
	}

	const emailAddress = extractEmailAddress(from);
	const hasNameFormat = /^[^<>]+<[^<>@]+@[^<>@]+>$/.test(from);
	const hasEmailOnlyFormat = /^[^<>\s@]+@[^<>\s@]+$/.test(from);

	if (!emailAddress?.includes('@') || (!hasNameFormat && !hasEmailOnlyFormat)) {
		throw new Error(`Invalid RESEND_FROM_EMAIL value: ${from}`);
	}

	return from;
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
		resendError.cause = result.error;
		log.error({
			op: 'send_email',
			phase: 'provider_error',
			fromDomain: getEmailDomain(from),
			toDomains: getRecipientDomains(to),
			subject,
			error: serializeError(result.error),
			providerResponse: result
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
