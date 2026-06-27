// @ts-nocheck
import { convexMutation, convexQuery } from '$lib/server/convex.js';
import { internalAuthSecret } from '$lib/server/sessionAuth.js';
import { sendEmail } from '$lib/email/provider.js';
import { featuredExpiryTemplate, leadDigestTemplate, lifecycleTemplate } from '$lib/email/templates.js';

function appBaseUrl(env = process.env) {
	return (env.APP_BASE_URL || env.PUBLIC_APP_URL || 'http://localhost:5173').replace(/\/$/, '');
}

async function logEmail(eventType, { userId, entityType, entityId, metadata = {} } = {}) {
	try {
		await convexMutation('emailActivity:log', {
			eventType,
			actorUserId: userId,
			entityType,
			entityId,
			metadata,
			internalAuthSecret: internalAuthSecret()
		});
	} catch {
		// Notification audit logging must not break workflows.
	}
}

async function sendLifecycle({ to, userId, entityType, entityId, eventType, template, purpose }) {
	if (!to) return { ok: false, skipped: true, reason: 'missing_recipient' };
	const result = await sendEmail({
		to,
		...template,
		tags: { type: purpose },
		metadata: { entityType, entityId }
	});
	if (result.skipped && result.reason === 'missing_config') {
		await logEmail('EMAIL_SKIPPED_MISSING_CONFIG', {
			userId,
			entityType,
			entityId,
			metadata: { purpose, missingConfig: result.missingConfig }
		});
		return result;
	}
	if (!result.ok) {
		await logEmail('EMAIL_FAILED', {
			userId,
			entityType,
			entityId,
			metadata: { purpose, provider: result.provider, status: result.status }
		});
		return result;
	}
	await logEmail(eventType, {
		userId,
		entityType,
		entityId,
		metadata: { purpose, provider: result.provider, providerMessageId: result.id }
	});
	return result;
}

export async function sendApplicationLifecycleEmail(data = {}) {
	const template = lifecycleTemplate({
		subject: data.subject || 'Diaspora Junxion application update',
		title: data.title || 'Application update',
		lines: data.lines || ['Your application status has been updated.'],
		actionUrl: data.actionUrl || `${appBaseUrl()}/dashboard`,
		actionLabel: data.actionLabel || 'Open dashboard'
	});
	return await sendLifecycle({
		to: data.to || data.email,
		userId: data.userId,
		entityType: 'application',
		entityId: data.applicationId,
		eventType: data.payment ? 'PAYMENT_EMAIL_SENT' : 'APPLICATION_EMAIL_SENT',
		template,
		purpose: data.payment ? 'payment_lifecycle' : 'application_lifecycle'
	});
}

export async function sendListingLifecycleEmail(data = {}) {
	const template = lifecycleTemplate({
		subject: data.subject || 'Diaspora Junxion listing update',
		title: data.title || 'Listing update',
		lines: data.lines || ['Your listing status has been updated.'],
		actionUrl: data.actionUrl || `${appBaseUrl()}/dashboard/listings`,
		actionLabel: data.actionLabel || 'Open listings'
	});
	return await sendLifecycle({
		to: data.to || data.email,
		userId: data.userId,
		entityType: 'listing',
		entityId: data.listingId,
		eventType: 'LISTING_EMAIL_SENT',
		template,
		purpose: data.purpose || 'listing_lifecycle'
	});
}

export async function sendLeadDigestEmail(data = {}) {
	const metrics = data.metrics || {};
	const suggestion = data.suggestion || data.topSuggestion || 'Keep your profile complete and current.';
	const template = leadDigestTemplate({
		listingName: data.listingName,
		period: data.period || 'Last 7 days',
		metrics,
		suggestion,
		dashboardUrl: data.dashboardUrl || `${appBaseUrl()}/dashboard`
	});
	return await sendLifecycle({
		to: data.to || data.email,
		userId: data.userId,
		entityType: 'listing',
		entityId: data.listingId,
		eventType: 'LEAD_DIGEST_EMAIL_SENT',
		template,
		purpose: 'lead_digest'
	});
}

export async function sendFeaturedExpiryReminderEmail(data = {}) {
	const template = featuredExpiryTemplate({
		listingName: data.listingName,
		expiresAt: data.featuredUntil || Date.now(),
		dashboardUrl: data.dashboardUrl || `${appBaseUrl()}/dashboard/listings/${data.listingId || ''}`
	});
	return await sendLifecycle({
		to: data.to || data.email,
		userId: data.userId,
		entityType: 'listing',
		entityId: data.listingId,
		eventType: 'LISTING_EMAIL_SENT',
		template,
		purpose: 'featured_expiry_reminder'
	});
}

export async function selectFeaturedExpiryReminderCandidates({ now = Date.now(), windowMs = 1000 * 60 * 60 * 24 * 3 } = {}) {
	return await convexQuery('authTokens:selectFeaturedExpiryCandidates', {
		now,
		windowMs,
		internalAuthSecret: internalAuthSecret()
	});
}
