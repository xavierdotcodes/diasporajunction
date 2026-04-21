import { json } from '@sveltejs/kit';
import { captureLeadSignup } from '$lib/server/leads';
import { requestLogger, serializeError } from '$lib/utils/logger';

export async function POST({ request }) {
	const log = requestLogger('src/routes/api/leads/+server.js', {
		request,
		locals: {}
	});

	try {
		const payload = await request.json();
		log.info({
			phase: 'lead_capture_received',
			source: payload?.source,
			leadMagnet: payload?.leadMagnet,
			entryPage: payload?.entryPage
		});

		const result = await captureLeadSignup(payload);

		if (!result.ok) {
			log.warn({
				phase: 'lead_capture_rejected',
				status: result.status || 400,
				error: result.error
			});
			return json({ error: result.error }, { status: result.status || 400 });
		}

		log.info({
			phase: 'lead_capture_completed',
			leadId: result.lead.id,
			created: result.created
		});

		return json({
			success: true,
			leadId: result.lead.id,
			created: result.created
		});
	} catch (error) {
		log.error({
			phase: 'lead_capture_failed',
			error: serializeError(error)
		});
		return json(
			{
				error: 'Something went wrong while saving your email. Please try again.'
			},
			{ status: 500 }
		);
	}
}
