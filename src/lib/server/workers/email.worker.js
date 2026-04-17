import { Worker } from 'bullmq';
import prisma from '$lib/server/prisma';
import {
	LEAD_SEQUENCE_JOB_NAME,
	renderLeadSequenceEmail
} from '$lib/server/email/lead-sequence';
import { sendResendEmail } from '$lib/server/email/resend';
import { EMAIL_QUEUE_NAME } from '$lib/server/queues/email.queue';
import { getBullRedis } from '$lib/server/redis';
import { fileLogger, scopedLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/workers/email.worker.js');

const log = scopedLogger('email-worker');

let worker;

async function processLeadNurtureEmail(job) {
	const { leadId, stepKey } = job.data;

	const lead = await prisma.lead.findUnique({
		where: { id: leadId }
	});

	if (!lead) {
		log.warn({ phase: 'skip_missing_lead', leadId, stepKey });
		return;
	}

	if (lead.status === 'UNSUBSCRIBED') {
		log.info({ phase: 'skip_unsubscribed', leadId, stepKey });
		return;
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
}

export function startEmailWorker() {
	if (worker) return worker;

	worker = new Worker(
		EMAIL_QUEUE_NAME,
		async (job) => {
			if (job.name === LEAD_SEQUENCE_JOB_NAME) {
				return processLeadNurtureEmail(job);
			}

			log.warn({ phase: 'unknown_job', jobName: job.name });
		},
		{
			connection: getBullRedis(),
			concurrency: 2
		}
	);

	worker.on('failed', (job, error) => {
		log.error({
			phase: 'job_failed',
			jobId: job?.id,
			jobName: job?.name,
			error: error.message
		});
	});

	worker.on('error', (error) => {
		log.error({ phase: 'worker_error', error: error.message });
	});

	log.info({ phase: 'started', queue: EMAIL_QUEUE_NAME });

	return worker;
}
