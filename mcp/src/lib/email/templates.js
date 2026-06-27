// @ts-nocheck
function escapeHtml(value = '') {
	return String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function paragraph(lines = []) {
	return lines.filter(Boolean).map((line) => `<p>${escapeHtml(line)}</p>`).join('\n');
}

function actionLink(url, label) {
	return `<p><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></p>`;
}

export function emailVerificationTemplate({ name, verificationUrl, expiresHours = 24 }) {
	const greeting = name ? `Hi ${name},` : 'Hi,';
	return {
		subject: 'Verify your Diaspora Junxion email',
		text: `${greeting}\n\nVerify your email address: ${verificationUrl}\n\nThis link expires in ${expiresHours} hours. If you did not request this, you can ignore this email.`,
		html: [
			paragraph([greeting, 'Verify your email address to finish securing your Diaspora Junxion account.']),
			actionLink(verificationUrl, 'Verify email'),
			paragraph([`This link expires in ${expiresHours} hours. If you did not request this, you can ignore this email.`])
		].join('\n')
	};
}

export function passwordResetTemplate({ name, resetUrl, expiresMinutes = 60 }) {
	const greeting = name ? `Hi ${name},` : 'Hi,';
	return {
		subject: 'Reset your Diaspora Junxion password',
		text: `${greeting}\n\nReset your password: ${resetUrl}\n\nThis link expires in ${expiresMinutes} minutes. If you did not request this, you can ignore this email.`,
		html: [
			paragraph([greeting, 'Use this secure link to reset your Diaspora Junxion password.']),
			actionLink(resetUrl, 'Reset password'),
			paragraph([`This link expires in ${expiresMinutes} minutes. If you did not request this, you can ignore this email.`])
		].join('\n')
	};
}

export function lifecycleTemplate({ subject, title, lines = [], actionUrl, actionLabel = 'Open Diaspora Junxion' }) {
	return {
		subject,
		text: [title, ...lines, actionUrl ? `${actionLabel}: ${actionUrl}` : null].filter(Boolean).join('\n\n'),
		html: [
			`<h1>${escapeHtml(title)}</h1>`,
			paragraph(lines),
			actionUrl ? actionLink(actionUrl, actionLabel) : ''
		].join('\n')
	};
}

export function leadDigestTemplate({ listingName, period, metrics = {}, suggestion, dashboardUrl }) {
	const lines = [
		`Period: ${period}`,
		`Views: ${metrics.views ?? 0}`,
		`WhatsApp clicks: ${metrics.whatsappClicks ?? 0}`,
		`Phone clicks: ${metrics.phoneClicks ?? 0}`,
		`Email clicks: ${metrics.emailClicks ?? 0}`,
		`Website clicks: ${metrics.websiteClicks ?? 0}`,
		`Quote requests: ${metrics.quoteRequests ?? 0}`,
		suggestion ? `Top suggestion: ${suggestion}` : 'Top suggestion: Keep your profile complete and current.'
	];
	return lifecycleTemplate({
		subject: `Weekly lead digest for ${listingName || 'your listing'}`,
		title: `Lead digest for ${listingName || 'your listing'}`,
		lines,
		actionUrl: dashboardUrl,
		actionLabel: 'Open dashboard'
	});
}

export function featuredExpiryTemplate({ listingName, expiresAt, dashboardUrl }) {
	return lifecycleTemplate({
		subject: `Featured listing expiring soon: ${listingName || 'your listing'}`,
		title: 'Your featured listing is expiring soon',
		lines: [
			`${listingName || 'Your listing'} is scheduled to stop being featured on ${new Date(expiresAt).toLocaleDateString('en-US')}.`,
			'Renew from your dashboard if you want to keep the featured placement active.'
		],
		actionUrl: dashboardUrl,
		actionLabel: 'Manage listing'
	});
}
