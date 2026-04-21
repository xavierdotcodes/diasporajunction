import prisma from '$lib/server/prisma';
import { LEAD_NURTURE_SEQUENCE, renderLeadSequenceEmail } from '$lib/server/email/lead-sequence';
import { sendResendEmail } from '$lib/server/email/resend';
import { inngest } from '../client.js';
import { fileLogger, scopedLogger } from '$lib/utils/logger';

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

	log.info({ phase: 'email_sent', leadId, stepKey });

	return { sent: true };
}

export const leadNurtureSequence = inngest.createFunction(
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

		for (let index = 0; index < LEAD_NURTURE_SEQUENCE.length; index += 1) {
			const sequenceStep = LEAD_NURTURE_SEQUENCE[index];
			const previousDelayMs = index === 0 ? 0 : LEAD_NURTURE_SEQUENCE[index - 1].delayMs;
			const waitMs = sequenceStep.delayMs - previousDelayMs;

			if (waitMs > 0) {
				await step.sleep(`wait-for-${sequenceStep.key}`, waitMs);
			}

			await step.run(`deliver-${sequenceStep.key}`, async () =>
				deliverLeadNurtureStep({
					leadId,
					stepKey: sequenceStep.key
				})
			);
		}
	}
);
