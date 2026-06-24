import { inngest } from '../client.js';
import { INNGEST_EVENTS, safeEventPayload } from '../events.js';
import { workflowMutation, workflowQuery } from '../convex.js';

const paymentAbandonDelay = process.env.PAYMENT_ABANDON_DELAY || '30m';

export function shouldMarkPaymentAbandoned(payment) {
	return Boolean(payment && ['PENDING', 'INITIATED'].includes(payment.status));
}

export function paymentSucceededFollowUps(data = {}) {
	return data.applicationId
		? [{ name: INNGEST_EVENTS.AI_APPLICATION_SUMMARY_REQUESTED, data: safeEventPayload({ applicationId: data.applicationId }) }]
		: [];
}

export function applicationApprovedFollowUps(data = {}) {
	const events = [];
	if (data.listingId) {
		events.push({ name: INNGEST_EVENTS.LISTING_PUBLISHED, data: safeEventPayload({ applicationId: data.applicationId, listingId: data.listingId }) });
		events.push({ name: INNGEST_EVENTS.AI_LISTING_SUMMARY_REQUESTED, data: safeEventPayload({ listingId: data.listingId }) });
	}
	return events;
}

export function leadDigestEventsForTopListings(topListings = []) {
	return topListings.map((item) => ({
		name: INNGEST_EVENTS.AI_LEAD_DIGEST_REQUESTED,
		data: safeEventPayload({ listingId: item.listingId, interactionType: item.type })
	}));
}

export const onApplicationSubmitted = inngest.createFunction(
	{ id: 'directory-on-application-submitted' },
	{ event: INNGEST_EVENTS.APPLICATION_SUBMITTED },
	async ({ event, step }) => {
		await step.run('queue-application-summary-placeholder', async () => {
			await workflowMutation('aiJobs:createQueued', {
				type: 'APPLICATION_REVIEW_ASSIST',
				relatedApplicationId: event.data.applicationId,
				input: safeEventPayload(event.data)
			});
		});
		await step.run('emit-ai-application-summary-requested', async () => {
			await inngest.send({
				name: INNGEST_EVENTS.AI_APPLICATION_SUMMARY_REQUESTED,
				data: safeEventPayload({ applicationId: event.data.applicationId, source: 'application_submitted' })
			});
		});
	}
);

export const onPaymentInitiated = inngest.createFunction(
	{ id: 'directory-on-payment-initiated' },
	{ event: INNGEST_EVENTS.APPLICATION_PAYMENT_INITIATED },
	async ({ event, step }) => {
		await step.sleep('wait-for-payment-completion', paymentAbandonDelay);
		const payment = await step.run('check-payment-status', async () => {
			return await workflowQuery('payments:getByReference', { reference: event.data.reference });
		});
		if (!shouldMarkPaymentAbandoned(payment)) return;
		await step.run('mark-payment-abandoned', async () => {
			await workflowMutation('payments:markAbandonedFromWorkflow', { reference: event.data.reference });
		});
		await step.run('emit-payment-abandoned', async () => {
			await inngest.send({
				name: INNGEST_EVENTS.PAYMENT_ABANDONED,
				data: safeEventPayload({ reference: event.data.reference, applicationId: event.data.applicationId })
			});
		});
	}
);

export const onPaymentSucceeded = inngest.createFunction(
	{ id: 'directory-on-payment-succeeded' },
	{ event: INNGEST_EVENTS.PAYMENT_SUCCEEDED },
	async ({ event, step }) => {
		await step.run('queue-application-summary-placeholder', async () => {
			if (!event.data.applicationId) return;
			await workflowMutation('aiJobs:createQueued', {
				type: 'APPLICATION_REVIEW_ASSIST',
				relatedApplicationId: event.data.applicationId,
				input: safeEventPayload(event.data)
			});
		});
		await step.run('emit-ai-application-summary-requested', async () => {
			if (!event.data.applicationId) return;
			await inngest.send({
				name: INNGEST_EVENTS.AI_APPLICATION_SUMMARY_REQUESTED,
				data: safeEventPayload({ applicationId: event.data.applicationId, source: 'payment_succeeded' })
			});
		});
	}
);

export const onPaymentFailed = inngest.createFunction(
	{ id: 'directory-on-payment-failed' },
	{ event: INNGEST_EVENTS.PAYMENT_FAILED },
	async ({ event, step }) => {
		await step.run('log-payment-failed-placeholder', async () => {
			await workflowMutation('activity:log', {
				applicationId: event.data.applicationId,
				eventType: INNGEST_EVENTS.PAYMENT_FAILED,
				metadata: safeEventPayload(event.data)
			});
		});
	}
);

export const onApplicationApproved = inngest.createFunction(
	{ id: 'directory-on-application-approved' },
	{ event: INNGEST_EVENTS.APPLICATION_APPROVED },
	async ({ event, step }) => {
		await step.run('emit-listing-published', async () => {
			if (!event.data.listingId) return;
			await inngest.send({
				name: INNGEST_EVENTS.LISTING_PUBLISHED,
				data: safeEventPayload({ applicationId: event.data.applicationId, listingId: event.data.listingId })
			});
		});
		await step.run('queue-listing-summary-placeholder', async () => {
			if (!event.data.listingId) return;
			await workflowMutation('aiJobs:createQueued', {
				type: 'LISTING_SUMMARY',
				relatedListingId: event.data.listingId,
				input: safeEventPayload(event.data)
			});
		});
		await step.run('emit-ai-listing-summary-requested', async () => {
			if (!event.data.listingId) return;
			await inngest.send({
				name: INNGEST_EVENTS.AI_LISTING_SUMMARY_REQUESTED,
				data: safeEventPayload({ listingId: event.data.listingId, source: 'application_approved' })
			});
		});
	}
);

export const onVerificationDocumentUploaded = inngest.createFunction(
	{ id: 'directory-on-verification-document-uploaded' },
	{ event: INNGEST_EVENTS.VERIFICATION_DOCUMENT_UPLOADED },
	async ({ event, step }) => {
		await step.run('log-document-uploaded-placeholder', async () => {
			await workflowMutation('activity:log', {
				applicationId: event.data.applicationId,
				listingId: event.data.listingId,
				eventType: INNGEST_EVENTS.VERIFICATION_DOCUMENT_UPLOADED,
				metadata: safeEventPayload(event.data)
			});
		});
	}
);

export const onVerificationDocumentStatusChanged = inngest.createFunction(
	{ id: 'directory-on-verification-document-status-changed' },
	{ event: INNGEST_EVENTS.VERIFICATION_DOCUMENT_STATUS_CHANGED },
	async ({ event, step }) => {
		await step.run('log-document-status-changed-placeholder', async () => {
			await workflowMutation('activity:log', {
				applicationId: event.data.applicationId,
				listingId: event.data.listingId,
				eventType: INNGEST_EVENTS.VERIFICATION_DOCUMENT_STATUS_CHANGED,
				metadata: safeEventPayload(event.data)
			});
		});
	}
);

export const onListingViewed = inngest.createFunction(
	{ id: 'directory-on-listing-viewed' },
	{ event: INNGEST_EVENTS.LISTING_VIEWED },
	async () => undefined
);

export const onContactClicked = inngest.createFunction(
	{ id: 'directory-on-contact-clicked' },
	{ event: INNGEST_EVENTS.CONTACT_CLICKED },
	async () => undefined
);

export const weeklyLeadDigest = inngest.createFunction(
	{ id: 'directory-weekly-lead-digest' },
	{ cron: '0 9 * * 1' },
	async ({ step }) => {
		const topListings = await step.run('get-top-listings', async () => {
			return await workflowQuery('interactions:getTopListings', { type: 'WHATSAPP_CLICK', days: 7, limit: 20 });
		});
		await step.run('queue-lead-digest-placeholders', async () => {
			for (const item of topListings ?? []) {
				await workflowMutation('aiJobs:createQueued', {
					type: 'LEAD_DIGEST',
					relatedListingId: item.listingId,
					input: safeEventPayload({ listingId: item.listingId, interactionType: item.type })
				});
				await inngest.send({
					name: INNGEST_EVENTS.AI_LEAD_DIGEST_REQUESTED,
					data: safeEventPayload({ listingId: item.listingId, source: 'weekly_lead_digest' })
				});
			}
		});
	}
);

export const dailyAdminTriage = inngest.createFunction(
	{ id: 'directory-daily-admin-triage' },
	{ cron: '0 8 * * *' },
	async ({ step }) => {
		const needsAttention = await step.run('get-needs-attention', async () => {
			return await workflowQuery('adminDashboard:getNeedsAttention', {});
		});
		await step.run('queue-admin-triage-placeholder', async () => {
			await workflowMutation('aiJobs:createQueued', {
				type: 'ADMIN_TRIAGE_SUMMARY',
				input: { hasNeedsAttention: Boolean(needsAttention) }
			});
			await inngest.send({
				name: INNGEST_EVENTS.AI_ADMIN_TRIAGE_REQUESTED,
				data: safeEventPayload({ source: 'daily_admin_triage' })
			});
		});
	}
);

export const lifecycleFunctions = [
	onApplicationSubmitted,
	onPaymentInitiated,
	onPaymentSucceeded,
	onPaymentFailed,
	onApplicationApproved,
	onVerificationDocumentUploaded,
	onVerificationDocumentStatusChanged,
	onListingViewed,
	onContactClicked,
	weeklyLeadDigest,
	dailyAdminTriage
];
