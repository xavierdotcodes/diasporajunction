import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import { sendResendEmail } from '$lib/server/email/resend';
import { requestLogger, serializeError } from '$lib/utils/logger';

function normalizeEmail(email) {
	return email?.trim().toLowerCase() ?? null;
}

function canSendTestEmail(locals) {
	return dev || Boolean(locals.user?.roles?.some((role) => (role.role ?? role) === 'ADMIN'));
}

export async function POST(event) {
	const log = requestLogger('ops.admin.email-test', event, {
		op: 'email_test'
	});

	try {
		if (!canSendTestEmail(event.locals)) {
			log.warn({
				phase: 'guard',
				reason: 'unauthorized'
			});
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { email } = await event.request.json();
		const normalizedEmail = normalizeEmail(email);

		if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			log.warn({
				phase: 'guard',
				reason: 'invalid_email'
			});
			return json({ error: 'Please enter a valid email address' }, { status: 400 });
		}

		await sendResendEmail({
			to: normalizedEmail,
			subject: 'DiasporaJunxion test email',
			html: `
				<div style="font-family:Arial,sans-serif;padding:24px;color:#111111;background:#fff8e1;">
					<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(0,0,0,0.08);padding:32px;">
						<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#D9042B;">DiasporaJunxion</p>
						<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Resend test successful</h1>
						<p style="margin:0 0 14px;line-height:1.7;">This is a direct test of the DiasporaJunxion email sending mechanism.</p>
						<p style="margin:0;line-height:1.7;">If you received this, Resend is configured correctly and the provider accepted the message.</p>
					</div>
				</div>
			`,
			text: 'DiasporaJunxion Resend test successful. If you received this, the provider accepted the message.',
			tags: [
				{ name: 'flow', value: 'diagnostic' },
				{ name: 'kind', value: 'admin_test' }
			]
		});

		log.info({
			phase: 'success',
			emailDomain: normalizedEmail.split('@')[1]
		});

		return json({ success: true });
	} catch (error) {
		log.error({
			phase: 'error',
			error: serializeError(error)
		});
		return json({ error: 'Failed to send test email' }, { status: 500 });
	}
}
