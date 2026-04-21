import prisma from '$lib/server/prisma';
import { LEAD_NURTURE_SEQUENCE, renderLeadSequenceEmail } from '$lib/server/email/lead-sequence';
import { sendResendEmail } from '$lib/server/email/resend';
import { fileLogger, scopedLogger, serializeError } from '$lib/utils/logger';

fileLogger('src/lib/server/inngest/functions/lead-nurture.js');

const log = scopedLogger('inngest-lead-nurture');
const LEAD_CAPTURED_EVENT = 'app/lead.captured';

function hasStepBeenSent(leadEvents, stepKey) {
	return leadEvents.some(
		(leadEvent) =>
			leadEvent?.metadata &&
			typeof leadEvent.metadata === 'object' &&
			leadEvent.metadata.stepKey === stepKey
	);
}

async function deliverLeadNurtureStep({ leadId, stepKey }) {
	log.info({
		op: 'deliver_lead_nurture_step',
		phase: 'start',
		leadId,
		stepKey
	});

	log.debug({
		op: 'deliver_lead_nurture_step',
		phase: 'query',
		query: 'lead.findUnique',
		leadId,
		stepKey
	});
	const lead = await prisma.lead.findUnique({
		where: { id: leadId }
	});

	if (!lead) {
		log.warn({ phase: 'skip_missing_lead', leadId, stepKey });
		return { skipped: 'missing_lead' };
	}

	if (lead.status === 'UNSUBSCRIBED') {
		log.info({ phase: 'skip_unsubscribed', leadId, stepKey });
		return { skipped: 'unsubscribed' };
	}

	log.debug({
		op: 'deliver_lead_nurture_step',
		phase: 'query',
		query: 'leadEvent.findMany',
		leadId,
		stepKey
	});
	const sentLeadEvents = await prisma.leadEvent.findMany({
		where: {
			leadId,
			type: 'lead_nurture_email_sent'
		},
		select: {
			metadata: true
		}
	});

	if (hasStepBeenSent(sentLeadEvents, stepKey)) {
		log.info({ phase: 'skip_already_sent', leadId, stepKey });
		return { skipped: 'already_sent' };
	}

	const emailPayload = renderLeadSequenceEmail({ lead, stepKey });
	log.info({
		op: 'deliver_lead_nurture_step',
		phase: 'send_email',
		leadId,
		stepKey,
		email: lead.email,
		subject: emailPayload.subject
	});

	await sendResendEmail({
		to: lead.email,
		subject: emailPayload.subject,
		html: emailPayload.html,
		text: emailPayload.text,
		tags: [
			{ name: 'sequence', value: 'lead_nurture' },
			{ name: 'step', value: stepKey }
		]
	});

	log.debug({
		op: 'deliver_lead_nurture_step',
		phase: 'mutation',
		mutation: 'leadEvent.create',
		leadId,
		stepKey
	});
	await prisma.leadEvent.create({
		data: {
			leadId: lead.id,
			type: 'lead_nurture_email_sent',
			page: null,
			metadata: {
				stepKey,
				email: lead.email
			}
		}
	});

	log.info({
		op: 'deliver_lead_nurture_step',
		phase: 'success',
		leadId,
		stepKey,
		email: lead.email
	});

	return { sent: true };
}

export function createLeadNurtureSequence(inngest) {
	return inngest.createFunction(
		{
			id: 'lead-nurture-sequence',
			// Mirrors the old BullMQ worker: 3 total attempts and up to 2 active steps at once.
			retries: 2,
			concurrency: {
				limit: 2
			}
		},
		{ event: LEAD_CAPTURED_EVENT },
		async ({ event, step }) => {
			const { leadId } = event.data;
			const eventId = event.id;
			const eventName = event.name;

			log.info({
				op: 'lead_nurture_sequence',
				phase: 'start',
				eventId,
				eventName,
				leadId,
				email: event.data?.email
			});

			for (let index = 0; index < LEAD_NURTURE_SEQUENCE.length; index += 1) {
				const sequenceStep = LEAD_NURTURE_SEQUENCE[index];
				const previousDelayMs = index === 0 ? 0 : LEAD_NURTURE_SEQUENCE[index - 1].delayMs;
				const waitMs = sequenceStep.delayMs - previousDelayMs;

				log.debug({
					op: 'lead_nurture_sequence',
					phase: 'step_prepare',
					eventId,
					leadId,
					stepKey: sequenceStep.key,
					index,
					waitMs
				});

				if (waitMs > 0) {
					log.info({
						op: 'lead_nurture_sequence',
						phase: 'sleep_start',
						eventId,
						leadId,
						stepKey: sequenceStep.key,
						waitMs
					});
					await step.sleep(`wait-for-${sequenceStep.key}`, waitMs);
					log.info({
						op: 'lead_nurture_sequence',
						phase: 'sleep_complete',
						eventId,
						leadId,
						stepKey: sequenceStep.key,
						waitMs
					});
				}

				try {
					const stepResult = await step.run(`deliver-${sequenceStep.key}`, async () =>
						deliverLeadNurtureStep({
							leadId,
							stepKey: sequenceStep.key
						})
					);

					log.info({
						op: 'lead_nurture_sequence',
						phase: 'step_complete',
						eventId,
						leadId,
						stepKey: sequenceStep.key,
						result: stepResult
					});
				} catch (error) {
					log.error({
						op: 'lead_nurture_sequence',
						phase: 'step_error',
						eventId,
						leadId,
						stepKey: sequenceStep.key,
						error: serializeError(error)
					});
					throw error;
				}
			}

			log.info({
				op: 'lead_nurture_sequence',
				phase: 'success',
				eventId,
				eventName,
				leadId
			});
		}
	);
}
