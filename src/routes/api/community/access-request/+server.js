import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { captureLeadSignup } from '$lib/server/leads';
import { ensureCommunityUserRecord } from '$lib/server/community/access';
import { requestLogger, serializeError } from '$lib/utils/logger';

function normalizeEmail(email) {
	return email?.trim().toLowerCase();
}

export async function POST(event) {
	const log = requestLogger('api.community.request', event);

	try {
		const { email, firstName, note, source } = await event.request.json();
		const normalizedEmail = normalizeEmail(email);

		log.info({
			op: 'mutation',
			phase: 'start',
			emailDomain: normalizedEmail?.split('@')[1]
		});

		if (!normalizedEmail) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(normalizedEmail)) {
			return json({ error: 'Please enter a valid email address' }, { status: 400 });
		}

		const leadResult = await captureLeadSignup({
			email: normalizedEmail,
			firstName: firstName || null,
			source: source || 'community_access_request',
			entryPage: '/community'
		});

		if (!leadResult.ok) {
			return json({ error: leadResult.error }, { status: leadResult.status || 400 });
		}

		await ensureCommunityUserRecord({
			email: normalizedEmail,
			firstName: firstName || null
		});

		const existingGrant = await prisma.communityAccessGrant.findUnique({
			where: { email: normalizedEmail }
		});

		if (existingGrant?.status === 'ACTIVE') {
			return json({
				success: true,
				status: 'ACTIVE',
				message: 'Community access is already active for this email.'
			});
		}

		const grant = existingGrant
			? await prisma.communityAccessGrant.update({
					where: { email: normalizedEmail },
					data: {
						firstName: firstName || existingGrant.firstName || null,
						note: note || existingGrant.note || null,
						source: source || existingGrant.source || 'community_access_request',
						status: 'REQUESTED',
						revokedAt: null
					}
				})
			: await prisma.communityAccessGrant.create({
					data: {
						email: normalizedEmail,
						firstName: firstName || null,
						note: note || null,
						source: source || 'community_access_request',
						status: 'REQUESTED'
					}
				});

		if (leadResult.lead?.id) {
			await prisma.leadEvent.create({
				data: {
					leadId: leadResult.lead.id,
					type: 'community_access_requested',
					page: '/community',
					metadata: {
						grantStatus: grant.status,
						source: source || 'community_access_request'
					}
				}
			});
		}

		log.info({
			op: 'mutation',
			phase: 'success',
			emailDomain: normalizedEmail?.split('@')[1],
			status: grant.status
		});

		return json({
			success: true,
			status: grant.status,
			message: 'Your request has been received. We will review access from there.'
		});
	} catch (error) {
		log.error({
			op: 'mutation',
			phase: 'error',
			error: serializeError(error)
		});
		return json({ error: 'We could not process your request right now.' }, { status: 500 });
	}
}
