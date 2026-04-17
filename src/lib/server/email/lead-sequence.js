import { env } from '$env/dynamic/private';
import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/email/lead-sequence.js');

export const LEAD_SEQUENCE_JOB_NAME = 'lead-nurture-email';

export const LEAD_NURTURE_SEQUENCE = [
	{ key: 'welcome_delivery', delayMs: 0 },
	{ key: 'visiting_vs_living', delayMs: 2 * 24 * 60 * 60 * 1000 },
	{ key: 'relocation_depth', delayMs: 5 * 24 * 60 * 60 * 1000 },
	{ key: 'ebook_intro', delayMs: 9 * 24 * 60 * 60 * 1000 }
];

function getBaseUrl() {
	return env.APP_URL || env.PUBLIC_SITE_URL || 'http://localhost:5173';
}

function getGuideUrl() {
	return env.LEAD_MAGNET_URL || `${getBaseUrl()}/guides`;
}

function getEbookUrl() {
	return env.EBOOK_URL || `${getBaseUrl()}/guides`;
}

function getUnsubscribeUrl(leadId) {
	return `${getBaseUrl()}/unsubscribe?lead=${encodeURIComponent(leadId)}`;
}

function getGreeting(firstName) {
	return firstName ? `Hi ${firstName},` : 'Hi,';
}

function renderEmailLayout({ title, body, ctaLabel, ctaUrl, leadId }) {
	const unsubscribeUrl = getUnsubscribeUrl(leadId);
	const html = `
		<div style="background:#fff8e1;padding:32px 16px;font-family:Arial,sans-serif;color:#111827;">
			<div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(0,0,0,0.08);">
				<div style="padding:32px;background:#f2b705;color:#111827;">
					<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">DiasporaJunxion</p>
					<h1 style="margin:0;font-size:28px;line-height:1.2;">${title}</h1>
				</div>
				<div style="padding:32px;font-size:16px;line-height:1.7;color:#1f2937;">
					${body}
					<p style="margin:32px 0 0;">
						<a href="${ctaUrl}" style="display:inline-block;background:#038C25;color:#ffffff;text-decoration:none;padding:14px 22px;font-weight:700;">
							${ctaLabel}
						</a>
					</p>
				</div>
				<div style="padding:24px 32px;background:#faf5e5;font-size:13px;line-height:1.6;color:#4b5563;">
					<p style="margin:0 0 10px;">
						You’re receiving this because you asked DiasporaJunxion for relocation guidance.
					</p>
					<p style="margin:0;">
						<a href="${unsubscribeUrl}" style="color:#D9042B;">Unsubscribe</a>
					</p>
				</div>
			</div>
		</div>
	`;

	const text = `${title}\n\n${body
		.replace(/<[^>]+>/g, '')
		.replace(/\s+\n/g, '\n')
		.trim()}\n\n${ctaLabel}: ${ctaUrl}\n\nUnsubscribe: ${unsubscribeUrl}`;

	return { html, text };
}

export function renderLeadSequenceEmail({ lead, stepKey }) {
	const greeting = getGreeting(lead.firstName);
	const guideUrl = getGuideUrl();
	const relocateUrl = `${getBaseUrl()}/relocate`;
	const startHereUrl = `${getBaseUrl()}/start-here`;
	const guidesUrl = `${getBaseUrl()}/guides`;
	const ebookUrl = getEbookUrl();

	switch (stepKey) {
		case 'welcome_delivery': {
			const subject = `Your free guide: ${DEFAULT_LEAD_MAGNET_NAME}`;
			const body = `
				<p>${greeting}</p>
				<p>Thanks for signing up for DiasporaJunxion.</p>
				<p>Here’s your free guide: <strong>${DEFAULT_LEAD_MAGNET_NAME}</strong>.</p>
				<p>Use it as a grounded first pass on the difference between visiting Ghana and actually trying to build a life here.</p>
				<p>Over the next few emails, I’ll send a few more practical notes on relocation, family life, and how to move with more clarity and less fantasy.</p>
			`;

			return {
				subject,
				...renderEmailLayout({
					title: 'Your free Ghana reality guide is here',
					body,
					ctaLabel: 'Read the Guide',
					ctaUrl: guideUrl,
					leadId: lead.id
				})
			};
		}
		case 'visiting_vs_living': {
			const subject = 'Visiting Ghana and living in Ghana are not the same thing';
			const body = `
				<p>${greeting}</p>
				<p>A lot of relocation confusion starts with treating a short stay like proof that a long-term move will feel the same.</p>
				<p>The rhythm changes when you add housing, schools, paperwork, healthcare, money flow, family expectations, and community.</p>
				<p>That doesn’t mean “don’t move.” It means test your assumptions early and give yourself room to learn what daily life actually asks of you.</p>
			`;

			return {
				subject,
				...renderEmailLayout({
					title: 'Start with reality, not momentum',
					body,
					ctaLabel: 'Explore Relocation Guidance',
					ctaUrl: relocateUrl,
					leadId: lead.id
				})
			};
		}
		case 'relocation_depth': {
			const subject = 'Relocation is emotional, not just logistical';
			const body = `
				<p>${greeting}</p>
				<p>Relocation decisions are not only about flights, rent, or business plans.</p>
				<p>They are also about identity, belonging, children, support systems, loneliness, pace, and whether your expectations can survive real daily life.</p>
				<p>That’s why DiasporaJunxion leads with grounded orientation first. Clarity is part of the move.</p>
			`;

			return {
				subject,
				...renderEmailLayout({
					title: 'Think beyond logistics',
					body,
					ctaLabel: 'Start Here',
					ctaUrl: startHereUrl,
					leadId: lead.id
				})
			};
		}
		case 'ebook_intro': {
			const subject = 'If you want the deeper version, the ebook is the next layer';
			const body = `
				<p>${greeting}</p>
				<p>By now you’ve seen the tone of DiasporaJunxion: practical, grounded, and not built on hype.</p>
				<p>The ebook goes deeper for people who want more structured relocation thinking around family life, decision-making, and what it really takes to move with less guesswork.</p>
				<p>If that sounds useful, keep an eye on the ebook page and the guides section. I’ll keep sharing helpful material either way.</p>
			`;

			return {
				subject,
				...renderEmailLayout({
					title: 'When you want the deeper layer',
					body,
					ctaLabel: 'Explore More Guides',
					ctaUrl: ebookUrl,
					leadId: lead.id
				})
			};
		}
		default:
			throw new Error(`Unknown lead sequence step: ${stepKey}`);
	}
}
