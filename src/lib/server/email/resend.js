import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/email/resend.js');

let resend;

export function getResendClient() {
	if (!resend) {
		if (!env.RESEND_API_KEY) {
			throw new Error('Missing RESEND_API_KEY in environment');
		}

		resend = new Resend(env.RESEND_API_KEY);
	}

	return resend;
}

export function getResendFromAddress() {
	return env.RESEND_FROM_EMAIL || 'DiasporaJunxion <hello@diasporajunxion.com>';
}

export async function sendResendEmail({ to, subject, html, text, tags = [] }) {
	const client = getResendClient();

	return client.emails.send({
		from: getResendFromAddress(),
		to,
		subject,
		html,
		text,
		tags
	});
}
