import { env } from '$env/dynamic/private';
import prisma from '$lib/server/prisma';
import { normalizeEmail } from '$lib/server/housing/access';
import { sendResendEmail } from '$lib/server/email/resend';
import { scopedLogger, serializeError } from '$lib/utils/logger';

const log = scopedLogger('housing.inquiries');

function parseEmailList(value) {
	return String(value || '')
		.split(',')
		.map((entry) => normalizeEmail(entry.replace(/^['"]|['"]$/g, '').trim()))
		.filter(Boolean);
}

async function getInquiryRecipients() {
	const configuredRecipients = parseEmailList(env.HOUSING_INQUIRY_NOTIFICATION_EMAILS);

	const adminAccounts = await prisma.adminAccount.findMany({
		where: { active: true },
		select: { email: true }
	});

	return [...new Set([...configuredRecipients, ...adminAccounts.map((admin) => normalizeEmail(admin.email))].filter(Boolean))];
}

async function notifyHousingInquiryTeam({ listing, inquiry }) {
	const recipients = await getInquiryRecipients();

	if (recipients.length === 0) {
		log.warn({
			op: 'notify',
			phase: 'skipped_no_recipients',
			listingId: listing.id,
			inquiryId: inquiry.id
		});
		return;
	}

	const subject = `New housing inquiry: ${listing.title}`;
	const text = [
		'A new housing inquiry was submitted to DiasporaJunxion.',
		`Listing: ${listing.title}`,
		`Location: ${listing.location}${listing.neighborhood ? `, ${listing.neighborhood}` : ''}`,
		`Inquiry email: ${inquiry.requesterEmail}`,
		`Inquiry name: ${inquiry.requesterName || 'Not provided'}`,
		`Phone / WhatsApp: ${inquiry.requesterPhone || 'Not provided'}`,
		`Move timeline: ${inquiry.moveTimeline || 'Not provided'}`,
		'',
		'Message:',
		inquiry.message,
		'',
		'Review this inquiry in /admin/housing before contacting the owner.'
	].join('\n');
	const html = `
		<p>A new housing inquiry was submitted to DiasporaJunxion.</p>
		<p><strong>Listing:</strong> ${listing.title}<br /><strong>Location:</strong> ${listing.location}${listing.neighborhood ? `, ${listing.neighborhood}` : ''}</p>
		<p><strong>Inquiry email:</strong> ${inquiry.requesterEmail}<br /><strong>Inquiry name:</strong> ${inquiry.requesterName || 'Not provided'}<br /><strong>Phone / WhatsApp:</strong> ${inquiry.requesterPhone || 'Not provided'}<br /><strong>Move timeline:</strong> ${inquiry.moveTimeline || 'Not provided'}</p>
		<p><strong>Message:</strong><br />${inquiry.message.replace(/\n/g, '<br />')}</p>
		<p>Review this inquiry in <code>/admin/housing</code> before contacting the owner.</p>
	`;

	await sendResendEmail({
		to: recipients,
		subject,
		html,
		text,
		tags: [
			{ name: 'category', value: 'housing_inquiry' },
			{ name: 'listing_slug', value: listing.slug }
		]
	});

	log.info({
		op: 'notify',
		phase: 'success',
		listingId: listing.id,
		inquiryId: inquiry.id,
		recipientCount: recipients.length
	});
}

export async function createHousingInquiry({
	listing,
	supabaseUser = null,
	requesterName,
	requesterEmail,
	requesterPhone,
	moveTimeline,
	message
}) {
	const inquiry = await prisma.housingInquiry.create({
		data: {
			listingId: listing.id,
			supabaseUserId: supabaseUser?.id ?? null,
			requesterEmail: normalizeEmail(requesterEmail),
			requesterName: requesterName || null,
			requesterPhone: requesterPhone || null,
			moveTimeline: moveTimeline || null,
			message
		}
	});

	log.info({
		op: 'create',
		phase: 'success',
		listingId: listing.id,
		inquiryId: inquiry.id,
		emailDomain: normalizeEmail(requesterEmail)?.split('@')[1]
	});

	try {
		await notifyHousingInquiryTeam({ listing, inquiry });
	} catch (error) {
		log.error({
			op: 'notify',
			phase: 'error',
			listingId: listing.id,
			inquiryId: inquiry.id,
			error: serializeError(error)
		});
	}

	return inquiry;
}
