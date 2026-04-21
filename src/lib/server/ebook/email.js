import { env } from '$env/dynamic/private';
import { sendResendEmail } from '$lib/server/email/resend';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/email/ebook-delivery.js');

function getBaseUrl() {
	return env.APP_URL || env.PUBLIC_SITE_URL || 'http://localhost:5173';
}

function getEbookAccessUrl() {
	return env.EBOOK_DELIVERY_URL || env.EBOOK_URL || `${getBaseUrl()}/ebook`;
}

function getCommunityUrl() {
	return `${getBaseUrl()}/community`;
}

function getGreeting(firstName) {
	return firstName ? `Hi ${firstName},` : 'Hi,';
}

export function renderEbookDeliveryEmail({ firstName }) {
	const ebookUrl = getEbookAccessUrl();
	const communityUrl = getCommunityUrl();
	const greeting = getGreeting(firstName);

	const subject = 'Your ebook purchase is confirmed';
	const html = `
		<div style="background:#fff8e1;padding:32px 16px;font-family:Arial,sans-serif;color:#111827;">
			<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(0,0,0,0.08);">
				<div style="padding:32px;background:#d9042b;color:#ffffff;">
					<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">DiasporaJunxion</p>
					<h1 style="margin:0;font-size:28px;line-height:1.2;">Thriving in Ghana (With Children)</h1>
				</div>
				<div style="padding:32px;font-size:16px;line-height:1.7;color:#1f2937;">
					<p>${greeting}</p>
					<p>Thanks for purchasing <strong>Thriving in Ghana (With Children)</strong>.</p>
					<p>Your ebook access is now active. Use the link below as your buyer entry point into the ebook layer.</p>
					<p style="margin:32px 0 0;">
						<a href="${ebookUrl}" style="display:inline-block;background:#d9042b;color:#ffffff;text-decoration:none;padding:14px 22px;font-weight:700;">
							Open the Ebook
						</a>
					</p>
					<p style="margin:24px 0 0;">
						If you also want the broader live layer beyond the ebook, Community is where DiasporaJunxion holds premium tools, current signals, and deeper member support.
					</p>
					<p style="margin:20px 0 0;">
						<a href="${communityUrl}" style="color:#038C25;font-weight:700;text-decoration:none;">
							Explore Community
						</a>
					</p>
				</div>
				<div style="padding:24px 32px;background:#faf5e5;font-size:13px;line-height:1.6;color:#4b5563;">
					<p style="margin:0;">
						This email was sent because you completed an ebook purchase on DiasporaJunxion.
					</p>
				</div>
			</div>
		</div>
	`;

	const text = `${subject}

${greeting}

Thanks for purchasing Thriving in Ghana (With Children).

Your ebook access is now active. Use this link as your buyer entry point:
${ebookUrl}

Community: ${communityUrl}`;

	return { subject, html, text };
}

export async function sendEbookDeliveryEmail({ email, firstName = null }) {
	const { subject, html, text } = renderEbookDeliveryEmail({ firstName });

	return sendResendEmail({
		to: email,
		subject,
		html,
		text,
		tags: [
			{ name: 'flow', value: 'ebook_purchase' },
			{ name: 'product', value: 'thriving_in_ghana_with_children' }
		]
	});
}
