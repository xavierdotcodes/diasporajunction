import prisma from '$lib/server/prisma';
import { captureLeadSignup } from '$lib/server/leads';
import { scopedLogger, serializeError } from '$lib/utils/logger';

const log = scopedLogger('community.access.service');

function normalizeEmail(email) {
	return email?.trim().toLowerCase() ?? null;
}

export async function ensureCommunityUserRecord({ email, firstName }) {
	const normalizedEmail = normalizeEmail(email);
	if (!normalizedEmail) return null;

	const existingUser = await prisma.user.findUnique({
		where: { email: normalizedEmail }
	});

	if (existingUser) {
		if (!existingUser.name && firstName) {
			return prisma.user.update({
				where: { email: normalizedEmail },
				data: { name: firstName }
			});
		}

		return existingUser;
	}

	return prisma.user.create({
		data: {
			email: normalizedEmail,
			name: firstName || null,
			subscribed: true
		}
	});
}

export async function activateCommunityAccess({
	email,
	firstName = null,
	source = 'community_checkout',
	grantedByEmail = 'system',
	sessionId = null,
	amountTotal = null,
	currency = null
}) {
	const normalizedEmail = normalizeEmail(email);
	if (!normalizedEmail) {
		throw new Error('Missing email for community access activation');
	}

	const user = await ensureCommunityUserRecord({
		email: normalizedEmail,
		firstName
	});

	const grant = await prisma.communityAccessGrant.upsert({
		where: { email: normalizedEmail },
		update: {
			firstName: firstName || undefined,
			source,
			status: 'ACTIVE',
			grantedAt: new Date(),
			revokedAt: null,
			grantedByEmail
		},
		create: {
			email: normalizedEmail,
			firstName: firstName || null,
			source,
			status: 'ACTIVE',
			grantedAt: new Date(),
			grantedByEmail
		}
	});

	const leadResult = await captureLeadSignup({
		email: normalizedEmail,
		firstName,
		source,
		entryPage: '/community'
	});

	if (leadResult.ok && leadResult.lead?.id) {
		await prisma.leadEvent.create({
			data: {
				leadId: leadResult.lead.id,
				type: source === 'community_checkout_webhook'
					? 'community_access_activated_webhook'
					: 'community_access_purchased',
				page: '/community',
				metadata: {
					sessionId,
					amountTotal,
					currency,
					source
				}
			}
		});
	}

	log.info({
		op: 'mutation',
		phase: 'success',
		emailDomain: normalizedEmail?.split('@')[1],
		source,
		sessionId
	});

	return { grant, user };
}

export async function syncCommunityAccessFromCheckoutSession(session, source = 'community_checkout_return') {
	try {
		const metadata = session.metadata ?? {};
		const sessionEmail =
			normalizeEmail(session.customer_details?.email) ??
			normalizeEmail(metadata.email);

		if (
			session.payment_status !== 'paid' ||
			!sessionEmail ||
			metadata.kind !== 'community_access'
		) {
			return { ok: false, reason: 'not_eligible' };
		}

		const result = await activateCommunityAccess({
			email: sessionEmail,
			firstName: metadata.firstName || null,
			source,
			grantedByEmail: source,
			sessionId: session.id,
			amountTotal: session.amount_total ?? null,
			currency: session.currency ?? null
		});

		return {
			ok: true,
			email: sessionEmail,
			grant: result.grant
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
