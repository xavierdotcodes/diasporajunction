// @ts-nocheck
import { inngest } from '../client.js';
import { INNGEST_EVENTS } from '../events.js';
import {
	selectFeaturedExpiryReminderCandidates,
	sendApplicationLifecycleEmail,
	sendFeaturedExpiryReminderEmail,
	sendLeadDigestEmail,
	sendListingLifecycleEmail
} from '$lib/server/email/lifecycleEmails.js';

export const notificationFunctions = [
	inngest.createFunction(
		{ id: 'directory-application-submitted-email-foundation' },
		{ event: INNGEST_EVENTS.APPLICATION_SUBMITTED },
		async ({ event, step }) => {
			return await step.run('send-application-submitted-email', () =>
				sendApplicationLifecycleEmail({
					...(event.data || {}),
					subject: 'Application received',
					title: 'Application received',
					lines: ['Your application has been received. We will notify you as review progresses.']
				})
			);
		}
	),
	inngest.createFunction(
		{ id: 'directory-payment-succeeded-email-foundation' },
		{ event: INNGEST_EVENTS.PAYMENT_SUCCEEDED },
		async ({ event, step }) => {
			return await step.run('send-payment-succeeded-email', () =>
				sendApplicationLifecycleEmail({
					...(event.data || {}),
					payment: true,
					subject: 'Payment received',
					title: 'Payment received',
					lines: ['Your payment was received and the related workflow can continue.']
				})
			);
		}
	),
	inngest.createFunction(
		{ id: 'directory-application-review-email-foundation' },
		{ event: INNGEST_EVENTS.APPLICATION_UNDER_REVIEW },
		async ({ event, step }) => {
			return await step.run('send-application-review-email', () =>
				sendApplicationLifecycleEmail({
					...(event.data || {}),
					subject: 'Application under review',
					title: 'Application under review',
					lines: ['Your application is now under admin review.']
				})
			);
		}
	),
	inngest.createFunction(
		{ id: 'directory-resubmission-requested-email-foundation' },
		{ event: INNGEST_EVENTS.APPLICATION_RESUBMISSION_REQUESTED },
		async ({ event, step }) => {
			return await step.run('send-resubmission-requested-email', () =>
				sendApplicationLifecycleEmail({
					...(event.data || {}),
					subject: 'Application update requested',
					title: 'Application update requested',
					lines: ['Please review your application and submit the requested updates.']
				})
			);
		}
	),
	inngest.createFunction(
		{ id: 'directory-application-approved-email-foundation' },
		{ event: INNGEST_EVENTS.APPLICATION_APPROVED },
		async ({ event, step }) => {
			return await step.run('send-application-approved-email', () =>
				sendApplicationLifecycleEmail({
					...(event.data || {}),
					subject: 'Listing approved',
					title: 'Your listing is approved',
					lines: ['Your application has been approved and your listing can be published.']
				})
			);
		}
	),
	inngest.createFunction(
		{ id: 'directory-listing-published-email-foundation' },
		{ event: INNGEST_EVENTS.LISTING_PUBLISHED },
		async ({ event, step }) => {
			return await step.run('send-listing-published-email', () =>
				sendListingLifecycleEmail({
					...(event.data || {}),
					subject: 'Listing published',
					title: 'Your listing is live',
					lines: ['Your public listing has been published.']
				})
			);
		}
	),
	inngest.createFunction(
		{ id: 'directory-featured-upgrade-active-email-foundation' },
		{ event: INNGEST_EVENTS.FEATURED_UPGRADE_ACTIVE },
		async ({ event, step }) => {
			return await step.run('send-featured-upgrade-active-email', () =>
				sendListingLifecycleEmail({
					...(event.data || {}),
					subject: 'Featured upgrade active',
					title: 'Your featured upgrade is active',
					lines: ['Your listing is now featured.'],
					purpose: 'featured_upgrade_active'
				})
			);
		}
	),
	inngest.createFunction(
		{ id: 'directory-send-application-email' },
		{ event: INNGEST_EVENTS.APPLICATION_EMAIL_REQUESTED },
		async ({ event, step }) => {
			return await step.run('send-application-email', () => sendApplicationLifecycleEmail(event.data || {}));
		}
	),
	inngest.createFunction(
		{ id: 'directory-send-payment-email' },
		{ event: INNGEST_EVENTS.PAYMENT_EMAIL_REQUESTED },
		async ({ event, step }) => {
			return await step.run('send-payment-email', () => sendApplicationLifecycleEmail({ ...(event.data || {}), payment: true }));
		}
	),
	inngest.createFunction(
		{ id: 'directory-send-listing-email' },
		{ event: INNGEST_EVENTS.LISTING_EMAIL_REQUESTED },
		async ({ event, step }) => {
			return await step.run('send-listing-email', () => sendListingLifecycleEmail(event.data || {}));
		}
	),
	inngest.createFunction(
		{ id: 'directory-send-lead-digest-email' },
		{ event: INNGEST_EVENTS.LEAD_DIGEST_EMAIL_REQUESTED },
		async ({ event, step }) => {
			return await step.run('send-lead-digest-email', () => sendLeadDigestEmail(event.data || {}));
		}
	),
	inngest.createFunction(
		{ id: 'directory-send-featured-expiry-reminder' },
		{ event: INNGEST_EVENTS.FEATURED_EXPIRY_REMINDER_REQUESTED },
		async ({ event, step }) => {
			return await step.run('send-featured-expiry-email', () => sendFeaturedExpiryReminderEmail(event.data || {}));
		}
	),
	inngest.createFunction(
		{ id: 'directory-daily-featured-expiry-scan' },
		{ cron: '0 9 * * *' },
		async ({ step }) => {
			const candidates = await step.run('select-featured-expiry-candidates', () => selectFeaturedExpiryReminderCandidates());
			await step.run('queue-featured-expiry-reminders', async () => {
				await Promise.all(
					(candidates || []).map((candidate) =>
						inngest.send({
							name: INNGEST_EVENTS.FEATURED_EXPIRY_REMINDER_REQUESTED,
							data: {
								listingId: candidate.listingId,
								userId: candidate.ownerUserId,
								listingName: candidate.name,
								featuredUntil: candidate.featuredUntil
							}
						})
					)
				);
				return { queued: candidates?.length || 0 };
			});
			return { candidates: candidates?.length || 0 };
		}
	)
];
