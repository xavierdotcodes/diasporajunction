import prisma from '$lib/server/prisma';
import { captureLeadSignup } from '$lib/server/leads';
import { ensureCommunityUserRecord } from '$lib/server/community/access';
import { sendEbookDeliveryEmail } from '$lib/server/ebook/email';
import { scopedLogger, serializeError } from '$lib/utils/logger';

const log = scopedLogger('ebook.purchase.service');

function normalizeEmail(email) {
	return email?.trim().toLowerCase() ?? null;
}

export async function markEbookPurchased({
	email,
	firstName = null,
	source = 'ebook_checkout',
	sessionId = null,
	amountTotal = null,
	currency = null
}) {
	const normalizedEmail = normalizeEmail(email);
	if (!normalizedEmail) {
		throw new Error('Missing email for ebook purchase activation');
	}

	await ensureCommunityUserRecord({
		email: normalizedEmail,
		firstName
	});

	const leadResult = await captureLeadSignup({
		email: normalizedEmail,
		firstName,
		source,
		entryPage: '/ebook',
		leadMagnet: 'Thriving in Ghana (With Children)'
	});

	if (!leadResult.ok || !leadResult.lead?.id) {
		throw new Error(leadResult.error || 'Failed to record ebook purchaser');
	}

	const lead = await prisma.lead.update({
		where: { id: leadResult.lead.id },
		data: {
			ebookPurchasedAt: leadResult.lead.ebookPurchasedAt || new Date()
		}
	});

	await prisma.leadEvent.create({
		data: {
			leadId: lead.id,
			type: source === 'ebook_checkout_webhook' ? 'ebook_purchased_webhook' : 'ebook_purchased',
			page: '/ebook',
			metadata: {
				sessionId,
				amountTotal,
				currency,
				source
			}
		}
	});

	const existingDeliveryEvent = await prisma.leadEvent.findFirst({
		where: {
			leadId: lead.id,
			type: 'ebook_delivery_email_sent'
		},
		select: { id: true }
	});

	if (!existingDeliveryEvent) {
		try {
			await sendEbookDeliveryEmail({
				email: normalizedEmail,
				firstName
			});

			await prisma.leadEvent.create({
				data: {
					leadId: lead.id,
					type: 'ebook_delivery_email_sent',
					page: '/ebook',
					metadata: {
						source,
						sessionId
					}
				}
			});

			log.info({
				op: 'email',
				phase: 'success',
				emailDomain: normalizedEmail?.split('@')[1],
				source
			});
		} catch (error) {
			await prisma.leadEvent.create({
				data: {
					leadId: lead.id,
					type: 'ebook_delivery_email_failed',
					page: '/ebook',
					metadata: {
						source,
						sessionId,
						error: serializeError(error)
					}
				}
			});

			log.error({
				op: 'email',
				phase: 'error',
				emailDomain: normalizedEmail?.split('@')[1],
				source,
				error: serializeError(error)
			});
		}
	}

	log.info({
		op: 'mutation',
		phase: 'success',
		emailDomain: normalizedEmail?.split('@')[1],
		source,
		sessionId
	});

	return { lead };
}

export async function syncEbookPurchaseFromCheckoutSession(session, source = 'ebook_checkout_return') {
	try {
		const metadata = session.metadata ?? {};
		const sessionEmail =
			normalizeEmail(session.customer_details?.email) ??
			normalizeEmail(metadata.email);

		if (
			session.payment_status !== 'paid' ||
			!sessionEmail ||
			metadata.kind !== 'ebook_purchase'
		) {
			return { ok: false, reason: 'not_eligible' };
		}

		const result = await markEbookPurchased({
			email: sessionEmail,
			firstName: metadata.firstName || null,
			source,
			sessionId: session.id,
			amountTotal: session.amount_total ?? null,
			currency: session.currency ?? null
		});

		return {
			ok: true,
			email: sessionEmail,
			lead: result.lead
		};
	} catch (error) {
		log.error({
			op: 'sync',
			phase: 'error',
			sessionId: session?.id,
			error: serializeError(error)
		});
		return { ok: false, reason: 'error', error };
	}
}
