import { inngest } from '../client.js';
import { INNGEST_EVENTS, safeEventPayload } from '../events.js';
import { workflowMutation, workflowQuery } from '../convex.js';
import { createAiService } from '../../ai/service.js';

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

export const runListingSummaryJob = inngest.createFunction(
	{ id: 'directory-ai-listing-summary' },
	{ event: INNGEST_EVENTS.AI_LISTING_SUMMARY_REQUESTED },
	async ({ event, step }) => {
		await runAiJob({
			step,
			type: 'LISTING_SUMMARY',
			relatedListingId: event.data.listingId,
			input: safeEventPayload(event.data),
			loadSource: async () => {
				const listing = await workflowQuery('listings:adminGetById', { listingId: event.data.listingId });
				return { listing };
			},
			execute: async (service, source) => ({
				...(await service.generateListingSummary(source.listing)),
				improvementSuggestions: await service.generateListingImprovementSuggestions(source.listing)
			})
		});
	}
);

export const runApplicationSummaryJob = inngest.createFunction(
	{ id: 'directory-ai-application-summary' },
	{ event: INNGEST_EVENTS.AI_APPLICATION_SUMMARY_REQUESTED },
	async ({ event, step }) => {
		await runAiJob({
			step,
			type: 'APPLICATION_REVIEW_ASSIST',
			relatedApplicationId: event.data.applicationId,
			input: safeEventPayload(event.data),
			loadSource: async () => {
				const [application, documents] = await Promise.all([
					workflowQuery('applications:getById', { applicationId: event.data.applicationId }),
					workflowQuery('verificationDocuments:listForApplication', { applicationId: event.data.applicationId })
				]);
				return { ...application, documentStatusSummary: summarizeDocumentStatuses(documents) };
			},
			execute: async (service, source) => await service.summarizeApplicationForReview(source)
		});
	}
);

export const runAdminTriageJob = inngest.createFunction(
	{ id: 'directory-ai-admin-triage' },
	{ event: INNGEST_EVENTS.AI_ADMIN_TRIAGE_REQUESTED },
	async ({ event, step }) => {
		await runAiJob({
			step,
			type: 'ADMIN_TRIAGE_SUMMARY',
			input: safeEventPayload(event.data),
			loadSource: async () => {
				const [needsAttention, recentActivity, paymentSummary] = await Promise.all([
					workflowQuery('adminDashboard:getNeedsAttention', {}),
					workflowQuery('adminDashboard:getRecentActivity', { limit: 20 }),
					workflowQuery('adminDashboard:getPaymentSummary', {})
				]);
				return { needsAttentionSummary: needsAttention, recentActivitySummary: recentActivity, paymentSummary };
			},
			execute: async (service, source) => await service.generateAdminTriageSummary(source)
		});
	}
);

export const runLeadDigestJob = inngest.createFunction(
	{ id: 'directory-ai-lead-digest' },
	{ event: INNGEST_EVENTS.AI_LEAD_DIGEST_REQUESTED },
	async ({ event, step }) => {
		await runAiJob({
			step,
			type: 'LEAD_DIGEST',
			relatedListingId: event.data.listingId,
			input: safeEventPayload(event.data),
			loadSource: async () => {
				const [listing, interactionSummary] = await Promise.all([
					workflowQuery('listings:adminGetById', { listingId: event.data.listingId }),
					workflowQuery('interactions:getListingInteractionSummary', { listingId: event.data.listingId, days: 7 })
				]);
				return { listing, interactionSummary, period: 'last 7 days' };
			},
			execute: async (service, source) => await service.generateLeadDigest(source)
		});
	}
);

export function aiJobExecutionPlan(type, data = {}) {
	return [
		'create-or-load-ai-job',
		'mark-running',
		'load-safe-source-data',
		'call-ai-service',
		'mark-completed-or-failed'
	].map((stepName) => ({ type, step: stepName, relatedListingId: data.listingId, relatedApplicationId: data.applicationId }));
}

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
	dailyAdminTriage,
	runListingSummaryJob,
	runApplicationSummaryJob,
	runAdminTriageJob,
	runLeadDigestJob
];

async function runAiJob({ step, type, relatedApplicationId, relatedListingId, input, loadSource, execute }) {
	const aiJobId = await step.run('create-or-load-ai-job', async () => {
		const queued = await workflowQuery('aiJobs:getQueued', {
			type,
			relatedApplicationId,
			relatedListingId,
			limit: 1
		});
		if (queued?.[0]?._id) return queued[0]._id;
		return await workflowMutation('aiJobs:createQueued', {
			type,
			relatedApplicationId,
			relatedListingId,
			input
		});
	});

	try {
		await step.run('mark-running', async () => {
			await workflowMutation('aiJobs:markRunning', { aiJobId });
		});
		const source = await step.run('load-safe-source-data', loadSource);
		const output = await step.run('call-ai-service', async () => {
			const service = createAiService();
			if (!service.isConfigured()) {
				throw new Error(`AI provider missing config: ${service.getMissingConfig().join(', ')}`);
			}
			return await execute(service, source);
		});
		await step.run('mark-completed', async () => {
			await workflowMutation('aiJobs:markCompleted', { aiJobId, output });
		});
		return { aiJobId, output };
	} catch (error) {
		await step.run('mark-failed', async () => {
			await workflowMutation('aiJobs:markFailed', { aiJobId, error: safeAiJobError(error) });
		});
		return { aiJobId, failed: true };
	}
}

function summarizeDocumentStatuses(documents = []) {
	return documents.reduce(
		(acc, document) => ({
			...acc,
			total: acc.total + 1,
			byStatus: { ...acc.byStatus, [document.status]: (acc.byStatus[document.status] ?? 0) + 1 },
			byType: { ...acc.byType, [document.type]: (acc.byType[document.type] ?? 0) + 1 }
		}),
		{ total: 0, byStatus: {}, byType: {} }
	);
}

function safeAiJobError(error) {
	return error instanceof Error ? error.message.slice(0, 500) : 'AI job failed.';
}
