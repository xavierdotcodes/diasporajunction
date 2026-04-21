import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { captureLeadSignup } from '$lib/server/leads';
import { DEFAULT_LEAD_MAGNET_NAME } from '$lib/lead/constants';
import { requestLogger, serializeError } from '$lib/utils/logger';

/**
 * Public newsletter opt-in.
 * Keeps the legacy `user.subscribed` flag in sync, but now also
 * feeds the lead capture + nurture sequence used by the marketing funnel.
 */
export async function POST({ request }) {
	const log = requestLogger('src/routes/api/subscribe/+server.js', {
		request,
		locals: {}
	});

	try {
		const { email, name, source, leadMagnet, entryPage, referrer, utmSource, utmMedium, utmCampaign, utmContent } =
			await request.json();
		const normalizedEmail = email?.trim().toLowerCase();

		log.info({
			phase: 'subscribe_request_received',
			emailDomain: normalizedEmail?.split('@')[1],
			source: source || 'newsletter_modal'
		});

		if (!normalizedEmail) {
			log.warn({
				phase: 'subscribe_request_invalid',
				reason: 'missing_email'
			});
			return json({ error: 'Email is required' }, { status: 400 });
		}

		const leadResult = await captureLeadSignup({
			email: normalizedEmail,
			firstName: name || null,
			source: source || 'newsletter_modal',
			leadMagnet: leadMagnet || DEFAULT_LEAD_MAGNET_NAME,
			entryPage: entryPage || null,
			referrer: referrer || null,
			utmSource: utmSource || null,
			utmMedium: utmMedium || null,
			utmCampaign: utmCampaign || null,
			utmContent: utmContent || null
		});

		if (!leadResult.ok) {
			log.warn({
				phase: 'subscribe_request_rejected',
				error: leadResult.error,
				status: leadResult.status
			});
			return json({ error: leadResult.error }, { status: leadResult.status || 400 });
		}

		let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
		const existed = Boolean(user);

		if (user) {
			user = await prisma.user.update({
				where: { email: normalizedEmail },
				data: { subscribed: true }
			});
		} else {
			user = await prisma.user.create({
				data: {
					email: normalizedEmail,
					name: name || null,
					subscribed: true
				}
			});
		}

		log.info({
			phase: 'subscribe_request_completed',
			userId: user.id,
			leadId: leadResult.lead.id,
			existed,
			leadCreated: leadResult.created
		});

		return json({
			success: true,
			user,
			leadId: leadResult.lead.id,
			created: leadResult.created
		});
	} catch (error) {
		log.error({
			phase: 'subscribe_request_failed',
			error: serializeError(error)
		});
		return json({ error: 'Failed to subscribe user' }, { status: 500 });
	}
}
