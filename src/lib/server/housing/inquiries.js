import prisma from '$lib/server/prisma';
import { normalizeEmail } from '$lib/server/housing/access';
import { scopedLogger } from '$lib/utils/logger';

const log = scopedLogger('housing.inquiries');

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

	return inquiry;
}
