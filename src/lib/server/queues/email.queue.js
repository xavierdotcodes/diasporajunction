import { Queue } from 'bullmq';
import { LEAD_NURTURE_SEQUENCE, LEAD_SEQUENCE_JOB_NAME } from '$lib/server/email/lead-sequence';
import { getBullRedis } from '$lib/server/redis';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/queues/email.queue.js');

export const EMAIL_QUEUE_NAME = 'diasporajunxion-email';

let emailQueue;

export function getEmailQueue() {
	if (!emailQueue) {
		emailQueue = new Queue(EMAIL_QUEUE_NAME, {
			connection: getBullRedis(),
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: 'exponential',
					delay: 60_000
				},
				removeOnComplete: 250,
				removeOnFail: 1000
			}
		});
	}

	return emailQueue;
}

export async function enqueueLeadNurtureSequence({ leadId, email, firstName, leadMagnet }) {
	const queue = getEmailQueue();

	await Promise.all(
		LEAD_NURTURE_SEQUENCE.map((step) =>
			queue.add(
				LEAD_SEQUENCE_JOB_NAME,
				{
					leadId,
					email,
					firstName,
					leadMagnet,
					stepKey: step.key
				},
				{
					jobId: `lead-sequence:${leadId}:${step.key}`,
					delay: step.delayMs
				}
			)
		)
	);
}
