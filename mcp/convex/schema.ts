import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const userRole = v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'));
const targetAudience = v.union(v.literal('LOCAL'), v.literal('DIASPORA'), v.literal('BOTH'));
const category = v.union(
	v.literal('FOOD_CATERING'),
	v.literal('ACCOMMODATION'),
	v.literal('TRANSPORT'),
	v.literal('REAL_ESTATE'),
	v.literal('LEGAL_IMMIGRATION'),
	v.literal('FINANCE_MONEY'),
	v.literal('HEALTH_WELLNESS'),
	v.literal('EDUCATION'),
	v.literal('EVENTS_ENTERTAINMENT'),
	v.literal('TOURISM_TRAVEL'),
	v.literal('CREATIVE_MEDIA'),
	v.literal('BEAUTY_FASHION'),
	v.literal('HOME_SERVICES'),
	v.literal('BUSINESS_SERVICES'),
	v.literal('TECH_DIGITAL'),
	v.literal('COMMUNITY_ORGANIZATION'),
	v.literal('OTHER')
);
const applicationStatus = v.union(
	v.literal('DRAFT'),
	v.literal('SUBMITTED'),
	v.literal('AWAITING_PAYMENT'),
	v.literal('PAYMENT_INITIATED'),
	v.literal('PAID'),
	v.literal('UNDER_REVIEW'),
	v.literal('NEEDS_RESUBMISSION'),
	v.literal('REJECTED'),
	v.literal('ACCEPTED'),
	v.literal('CONVERTED')
);
const applicationPaymentStatus = v.union(
	v.literal('NOT_REQUIRED'),
	v.literal('PENDING'),
	v.literal('INITIATED'),
	v.literal('PAID'),
	v.literal('FAILED'),
	v.literal('ABANDONED'),
	v.literal('REFUNDED')
);
const verificationStatus = v.union(
	v.literal('UNVERIFIED'),
	v.literal('SUBMITTED'),
	v.literal('UNDER_REVIEW'),
	v.literal('VERIFIED'),
	v.literal('REJECTED'),
	v.literal('NEEDS_RESUBMISSION')
);
const paymentPurpose = v.union(
	v.literal('LISTING_APPLICATION_FEE'),
	v.literal('VERIFICATION_FEE'),
	v.literal('FEATURED_LISTING'),
	v.literal('SUBSCRIPTION'),
	v.literal('MANUAL_ADJUSTMENT')
);
const paymentProvider = v.union(
	v.literal('STRIPE'),
	v.literal('PAYSTACK'),
	v.literal('MANUAL_MOMO'),
	v.literal('CASH')
);
const paymentStatus = v.union(
	v.literal('PENDING'),
	v.literal('INITIATED'),
	v.literal('SUCCESS'),
	v.literal('FAILED'),
	v.literal('ABANDONED'),
	v.literal('REFUNDED')
);
const interactionType = v.union(
	v.literal('SEARCH_RESULT_SHOWN'),
	v.literal('LISTING_PROFILE_VIEWED'),
	v.literal('VIEW'),
	v.literal('WHATSAPP_CLICK'),
	v.literal('PHONE_CLICK'),
	v.literal('EMAIL_CLICK'),
	v.literal('WEBSITE_CLICK'),
	v.literal('QUOTE_REQUEST'),
	v.literal('SAVE'),
	v.literal('SHARE')
);

export default defineSchema({
	users: defineTable({
		name: v.optional(v.string()),
		email: v.string(),
		role: userRole,
		phone: v.optional(v.string()),
		image: v.optional(v.string()),
		isDeleted: v.boolean(),
		emailVerifiedAt: v.optional(v.number()),
		createdAt: v.number(),
		updatedAt: v.number()
	}).index('by_email', ['email']),
	directoryApplications: defineTable({
		applicantUserId: v.optional(v.id('users')),
		businessName: v.string(),
		contactName: v.string(),
		email: v.string(),
		phone: v.string(),
		whatsapp: v.optional(v.string()),
		website: v.optional(v.string()),
		category,
		customCategory: v.optional(v.string()),
		description: v.string(),
		shortDescription: v.optional(v.string()),
		servicesOffered: v.array(v.string()),
		keywords: v.array(v.string()),
		city: v.string(),
		region: v.string(),
		country: v.string(),
		serviceArea: v.string(),
		targetAudience,
		languages: v.optional(v.array(v.string())),
		priceRange: v.optional(v.string()),
		remoteAvailable: v.boolean(),
		inPersonAvailable: v.boolean(),
		whatsappAvailable: v.boolean(),
		referralCode: v.optional(v.string()),
		status: applicationStatus,
		paymentStatus: applicationPaymentStatus,
		paymentReference: v.optional(v.string()),
		applicationFeeAmount: v.optional(v.number()),
		adminNotes: v.optional(v.string()),
		applicantNotes: v.optional(v.string()),
		reviewedBy: v.optional(v.id('users')),
		reviewedAt: v.optional(v.number()),
		convertedListingId: v.optional(v.id('directoryListings')),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index('by_applicant', ['applicantUserId'])
		.index('by_status', ['status'])
		.index('by_payment_status', ['paymentStatus'])
		.index('by_created_at', ['createdAt']),
	directoryListings: defineTable({
		ownerUserId: v.optional(v.id('users')),
		sourceApplicationId: v.optional(v.id('directoryApplications')),
		businessName: v.string(),
		slug: v.string(),
		category,
		customCategory: v.optional(v.string()),
		description: v.string(),
		shortDescription: v.string(),
		servicesOffered: v.array(v.string()),
		keywords: v.array(v.string()),
		phone: v.string(),
		whatsapp: v.string(),
		email: v.string(),
		website: v.optional(v.string()),
		city: v.string(),
		region: v.string(),
		country: v.string(),
		serviceArea: v.string(),
		targetAudience,
		languages: v.optional(v.array(v.string())),
		priceRange: v.optional(v.string()),
		remoteAvailable: v.boolean(),
		inPersonAvailable: v.boolean(),
		whatsappAvailable: v.boolean(),
		trustSignals: v.array(v.string()),
		lastVerifiedAt: v.optional(v.number()),
		verificationLevel: v.optional(v.string()),
		logoFileId: v.optional(v.id('listingMedia')),
		coverFileId: v.optional(v.id('listingMedia')),
		verificationStatus,
		isActive: v.boolean(),
		isFeatured: v.boolean(),
		featuredUntil: v.optional(v.number()),
		referralCode: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index('by_slug', ['slug'])
		.index('by_category', ['category'])
		.index('by_city', ['city'])
		.index('by_region', ['region'])
		.index('by_country', ['country'])
		.index('by_active', ['isActive'])
		.index('by_featured', ['isFeatured'])
		.index('by_verification_status', ['verificationStatus'])
		.index('by_target_audience', ['targetAudience'])
		.index('by_owner', ['ownerUserId']),
	listingMedia: defineTable({
		applicationId: v.optional(v.id('directoryApplications')),
		listingId: v.optional(v.id('directoryListings')),
		fileId: v.optional(v.string()),
		storageId: v.id('_storage'),
		type: v.union(
			v.literal('LOGO'),
			v.literal('COVER'),
			v.literal('GALLERY'),
			v.literal('PORTFOLIO'),
			v.literal('BUSINESS_PROOF')
		),
		caption: v.optional(v.string()),
		sortOrder: v.number(),
		createdAt: v.number()
	})
		.index('by_application', ['applicationId'])
		.index('by_listing', ['listingId']),
	verificationDocuments: defineTable({
		applicationId: v.optional(v.id('directoryApplications')),
		listingId: v.optional(v.id('directoryListings')),
		userId: v.optional(v.id('users')),
		storageId: v.id('_storage'),
		type: v.union(
			v.literal('ID_FRONT'),
			v.literal('ID_BACK'),
			v.literal('SELFIE_WITH_ID'),
			v.literal('BUSINESS_REGISTRATION'),
			v.literal('OTHER')
		),
		status: v.union(
			v.literal('SUBMITTED'),
			v.literal('UNDER_REVIEW'),
			v.literal('ACCEPTED'),
			v.literal('REJECTED'),
			v.literal('NEEDS_RESUBMISSION')
		),
		notes: v.optional(v.string()),
		reviewedBy: v.optional(v.id('users')),
		reviewedAt: v.optional(v.number()),
		createdAt: v.number()
	})
		.index('by_application', ['applicationId'])
		.index('by_listing', ['listingId']),
	payments: defineTable({
		userId: v.optional(v.id('users')),
		applicationId: v.optional(v.id('directoryApplications')),
		listingId: v.optional(v.id('directoryListings')),
		purpose: paymentPurpose,
		provider: paymentProvider,
		amount: v.number(),
		currency: v.string(),
		status: paymentStatus,
		reference: v.string(),
		providerPaymentId: v.optional(v.string()),
		providerSessionId: v.optional(v.string()),
		providerCustomerId: v.optional(v.string()),
		providerSubscriptionId: v.optional(v.string()),
		providerMetadata: v.optional(v.any()),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index('by_reference', ['reference'])
		.index('by_provider_session', ['providerSessionId'])
		.index('by_application', ['applicationId'])
		.index('by_listing', ['listingId'])
		.index('by_user', ['userId'])
		.index('by_purpose', ['purpose'])
		.index('by_status', ['status']),
	paymentWebhookEvents: defineTable({
		provider: paymentProvider,
		eventId: v.string(),
		eventType: v.string(),
		reference: v.optional(v.string()),
		providerSessionId: v.optional(v.string()),
		providerPaymentId: v.optional(v.string()),
		status: v.union(v.literal('PROCESSED'), v.literal('IGNORED')),
		metadata: v.optional(v.any()),
		createdAt: v.number()
	})
		.index('by_provider_event', ['provider', 'eventId'])
		.index('by_reference', ['reference']),
	listingInteractions: defineTable({
		listingId: v.id('directoryListings'),
		userId: v.optional(v.id('users')),
		type: interactionType,
		ip: v.optional(v.string()),
		userAgent: v.optional(v.string()),
		referrer: v.optional(v.string()),
		metadata: v.optional(v.any()),
		createdAt: v.number()
	})
		.index('by_listing', ['listingId'])
		.index('by_type', ['type'])
		.index('by_listing_created', ['listingId', 'createdAt']),
	activityEvents: defineTable({
		actorUserId: v.optional(v.id('users')),
		subjectUserId: v.optional(v.id('users')),
		applicationId: v.optional(v.id('directoryApplications')),
		listingId: v.optional(v.id('directoryListings')),
		eventType: v.string(),
		path: v.optional(v.string()),
		method: v.optional(v.string()),
		ip: v.optional(v.string()),
		userAgent: v.optional(v.string()),
		device: v.optional(v.string()),
		browser: v.optional(v.string()),
		os: v.optional(v.string()),
		metadata: v.optional(v.any()),
		createdAt: v.number()
	})
		.index('by_application', ['applicationId'])
		.index('by_listing', ['listingId'])
		.index('by_subject_user', ['subjectUserId'])
		.index('by_event_type', ['eventType']),
	referralSources: defineTable({
		code: v.string(),
		name: v.string(),
		type: v.union(v.literal('PERSON'), v.literal('CAMPAIGN'), v.literal('PARTNER'), v.literal('ADMIN')),
		isActive: v.boolean(),
		metadata: v.optional(v.any()),
		createdAt: v.number(),
		updatedAt: v.number()
	}).index('by_code', ['code']),
	aiJobs: defineTable({
		type: v.union(
			v.literal('LISTING_SUMMARY'),
			v.literal('CATEGORY_CLASSIFICATION'),
			v.literal('SEARCH_QUERY_REWRITE'),
			v.literal('ADMIN_TRIAGE_SUMMARY'),
			v.literal('APPLICATION_REVIEW_ASSIST'),
			v.literal('LEAD_DIGEST')
		),
		status: v.union(
			v.literal('QUEUED'),
			v.literal('RUNNING'),
			v.literal('COMPLETED'),
			v.literal('FAILED')
		),
		input: v.optional(v.any()),
		output: v.optional(v.any()),
		error: v.optional(v.string()),
		relatedApplicationId: v.optional(v.id('directoryApplications')),
		relatedListingId: v.optional(v.id('directoryListings')),
		createdBy: v.optional(v.id('users')),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index('by_status', ['status'])
		.index('by_type', ['type'])
		.index('by_status_type', ['status', 'type']),
	searchSessions: defineTable({
		userId: v.optional(v.id('users')),
		query: v.string(),
		filters: v.any(),
		aiRewrite: v.optional(v.any()),
		recommendedListingIds: v.optional(v.array(v.id('directoryListings'))),
		createdAt: v.number()
	}).index('by_user', ['userId'])
});
