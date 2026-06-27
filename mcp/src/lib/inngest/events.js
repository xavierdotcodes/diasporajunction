export const INNGEST_EVENTS = {
	APPLICATION_SUBMITTED: 'directory/application.submitted',
	APPLICATION_PAYMENT_INITIATED: 'directory/application.payment_initiated',
	PAYMENT_SUCCEEDED: 'directory/payment.succeeded',
	PAYMENT_FAILED: 'directory/payment.failed',
	APPLICATION_RESUBMISSION_REQUESTED: 'directory/application.resubmission_requested',
	PAYMENT_ABANDONED: 'directory/payment.abandoned',
	APPLICATION_UNDER_REVIEW: 'directory/application.under_review',
	APPLICATION_NEEDS_RESUBMISSION: 'directory/application.needs_resubmission',
	APPLICATION_APPROVED: 'directory/application.approved',
	LISTING_PUBLISHED: 'directory/listing.published',
	FEATURED_UPGRADE_ACTIVE: 'directory/listing.featured_upgrade_active',
	MEDIA_UPLOADED: 'directory/media.uploaded',
	VERIFICATION_DOCUMENT_UPLOADED: 'directory/verification_document.uploaded',
	VERIFICATION_DOCUMENT_STATUS_CHANGED: 'directory/verification_document.status_changed',
	LISTING_VIEWED: 'directory/listing.viewed',
	CONTACT_CLICKED: 'directory/contact.clicked',
	AI_LISTING_SUMMARY_REQUESTED: 'ai/listing.summary.requested',
	AI_APPLICATION_SUMMARY_REQUESTED: 'ai/application.summary.requested',
	AI_ADMIN_TRIAGE_REQUESTED: 'ai/admin.triage.requested',
	AI_LEAD_DIGEST_REQUESTED: 'ai/lead.digest.requested',
	APPLICATION_EMAIL_REQUESTED: 'directory/email.application.requested',
	PAYMENT_EMAIL_REQUESTED: 'directory/email.payment.requested',
	LISTING_EMAIL_REQUESTED: 'directory/email.listing.requested',
	LEAD_DIGEST_EMAIL_REQUESTED: 'directory/email.lead_digest.requested',
	FEATURED_EXPIRY_REMINDER_REQUESTED: 'directory/email.featured_expiry.requested'
};

const allowedKeys = new Set([
	'applicationId',
	'listingId',
	'paymentId',
	'reference',
	'provider',
	'providerSessionId',
	'documentId',
	'mediaId',
	'type',
	'status',
	'actorUserId',
	'userId',
	'eventType',
	'interactionType',
	'createdAt',
	'source'
]);

export function safeEventPayload(payload = {}) {
	return Object.fromEntries(
		Object.entries(payload)
			.filter(([key]) => allowedKeys.has(key))
			.map(([key, value]) => [key, safeValue(value)])
			.filter(([, value]) => value !== undefined && value !== '')
	);
}

export function assertSafeEventPayload(payload = {}) {
	const serialized = JSON.stringify(payload);
	if (/secret|whsec_|sk_live|sk_test|storageId|documentUrl|adminNotes|providerMetadata/i.test(serialized)) {
		throw new Error('Unsafe Inngest event payload contains private data.');
	}
	return true;
}

function safeValue(value) {
	if (typeof value === 'string') return value.slice(0, 240);
	if (typeof value === 'number' || typeof value === 'boolean') return value;
	if (value == null) return undefined;
	return undefined;
}
