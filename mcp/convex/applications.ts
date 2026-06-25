import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { normalizeReferralCode, now, requireCustomCategoryWhenOther, slugify } from './_shared';
import { requireAdminAuth, requireOwnedRecord } from './_auth';

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
const targetAudience = v.union(v.literal('LOCAL'), v.literal('DIASPORA'), v.literal('BOTH'));
const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);

function validateApplicationInput(input: any) {
	const required = [
		'businessName',
		'contactName',
		'email',
		'phone',
		'category',
		'description',
		'city',
		'region',
		'country',
		'serviceArea',
		'targetAudience'
	];
	const missing = required.filter((field) => !String(input[field] ?? '').trim());
	if (missing.length) throw new Error(`Missing required application fields: ${missing.join(', ')}.`);
	requireCustomCategoryWhenOther(input);
}

const patchValidator = v.object({
	businessName: v.optional(v.string()),
	contactName: v.optional(v.string()),
	email: v.optional(v.string()),
	phone: v.optional(v.string()),
	whatsapp: v.optional(v.string()),
	website: v.optional(v.string()),
	category: v.optional(category),
	customCategory: v.optional(v.string()),
	description: v.optional(v.string()),
	shortDescription: v.optional(v.string()),
	servicesOffered: v.optional(v.array(v.string())),
	keywords: v.optional(v.array(v.string())),
	city: v.optional(v.string()),
	region: v.optional(v.string()),
	country: v.optional(v.string()),
	serviceArea: v.optional(v.string()),
	targetAudience: v.optional(targetAudience),
	languages: v.optional(v.array(v.string())),
	priceRange: v.optional(v.string()),
	remoteAvailable: v.optional(v.boolean()),
	inPersonAvailable: v.optional(v.boolean()),
	whatsappAvailable: v.optional(v.boolean()),
	referralCode: v.optional(v.string()),
	applicantNotes: v.optional(v.string())
});

export const createDraftApplication = mutation({
	args: {
		applicantUserId: v.optional(v.id('users')),
		patch: patchValidator
	},
	handler: async (ctx, { applicantUserId, patch }) => {
		const timestamp = now();
		if (patch.category) requireCustomCategoryWhenOther(patch);
		return await ctx.db.insert('directoryApplications', {
			applicantUserId,
			businessName: patch.businessName ?? '',
			contactName: patch.contactName ?? '',
			email: patch.email ?? '',
			phone: patch.phone ?? '',
			whatsapp: patch.whatsapp,
			website: patch.website,
			category: patch.category ?? 'OTHER',
			customCategory: patch.customCategory,
			description: patch.description ?? '',
			shortDescription: patch.shortDescription,
			servicesOffered: patch.servicesOffered ?? [],
			keywords: patch.keywords ?? [],
			city: patch.city ?? '',
			region: patch.region ?? '',
			country: patch.country ?? 'Ghana',
			serviceArea: patch.serviceArea ?? '',
			targetAudience: patch.targetAudience ?? 'BOTH',
			languages: patch.languages,
			priceRange: patch.priceRange,
			remoteAvailable: patch.remoteAvailable ?? false,
			inPersonAvailable: patch.inPersonAvailable ?? true,
			whatsappAvailable: patch.whatsappAvailable ?? Boolean(patch.whatsapp),
			referralCode: normalizeReferralCode(patch.referralCode),
			status: 'DRAFT',
			paymentStatus: 'PENDING',
			createdAt: timestamp,
			updatedAt: timestamp
		});
	}
});

export const createDraft = createDraftApplication;

export const updateApplication = mutation({
	args: { applicationId: v.id('directoryApplications'), patch: patchValidator, auth: authArg },
	handler: async (ctx, { applicationId, patch, auth }) => {
		const application = await ctx.db.get(applicationId);
		if (!application) throw new Error('Application not found.');
		requireOwnedRecord(auth, application.applicantUserId);
		if (!['DRAFT', 'NEEDS_RESUBMISSION'].includes(application.status)) {
			throw new Error('Application can only be edited while draft or awaiting resubmission.');
		}
		const locked = ['PAYMENT_INITIATED', 'PAID', 'UNDER_REVIEW', 'ACCEPTED', 'CONVERTED'].includes(application.status);
		if (locked) {
			const coreFields = [
				'businessName',
				'category',
				'customCategory',
				'description',
				'servicesOffered',
				'keywords',
				'city',
				'region',
				'country',
				'serviceArea',
				'targetAudience',
				'languages',
				'priceRange',
				'remoteAvailable',
				'inPersonAvailable',
				'whatsappAvailable'
			];
			if (coreFields.some((field) => Object.hasOwn(patch, field))) {
				throw new Error('Core application fields are locked after payment or review starts.');
			}
		}
		const next = { ...application, ...patch };
		requireCustomCategoryWhenOther(next);
		await ctx.db.patch(applicationId, {
			...patch,
			referralCode: patch.referralCode ? normalizeReferralCode(patch.referralCode) : application.referralCode,
			updatedAt: now()
		});
	}
});

export const updateDraft = updateApplication;

export const submitApplication = mutation({
	args: { applicationId: v.id('directoryApplications'), auth: authArg },
	handler: async (ctx, { applicationId, auth }) => {
		const application = await ctx.db.get(applicationId);
		if (!application) throw new Error('Application not found.');
		requireOwnedRecord(auth, application.applicantUserId);
		validateApplicationInput(application);
		await ctx.db.patch(applicationId, {
			status: 'AWAITING_PAYMENT',
			paymentStatus: 'PENDING',
			updatedAt: now()
		});
		await ctx.db.insert('activityEvents', {
			applicationId,
			eventType: 'directory/application.submitted',
			metadata: { status: 'AWAITING_PAYMENT' },
			createdAt: now()
		});
	}
});

export const submit = submitApplication;

export const getApplication = query({
	args: { applicationId: v.id('directoryApplications'), auth: authArg },
	handler: async (ctx, { applicationId, auth }) => {
		const application = await ctx.db.get(applicationId);
		if (!application) return null;
		requireOwnedRecord(auth, application.applicantUserId);
		return application;
	}
});

export const listMyApplications = query({
	args: { applicantUserId: v.id('users') },
	handler: async (ctx, { applicantUserId }) =>
		await ctx.db
			.query('directoryApplications')
			.withIndex('by_applicant', (q) => q.eq('applicantUserId', applicantUserId))
			.collect()
});

export const adminListApplications = query({
	args: { status: v.optional(v.string()), limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { status, limit = 50, auth }) => {
		requireAdminAuth(auth);
		return status
			? await ctx.db
					.query('directoryApplications')
					.withIndex('by_status', (q) => q.eq('status', status as any))
					.take(limit)
			: await ctx.db.query('directoryApplications').order('desc').take(limit);
	}
});

export const adminGetApplication = getApplication;

export const listForAdmin = adminListApplications;

export const listPending = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('directoryApplications').withIndex('by_status', (q) => q.eq('status', 'SUBMITTED')).take(limit);
	}
});

export const listPaidWaitingReview = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('directoryApplications').withIndex('by_status', (q) => q.eq('status', 'PAID')).take(limit);
	}
});

export const listNeedingResubmission = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db
			.query('directoryApplications')
			.withIndex('by_status', (q) => q.eq('status', 'NEEDS_RESUBMISSION'))
			.take(limit);
	}
});

export const listAbandonedPayments = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db
			.query('directoryApplications')
			.withIndex('by_payment_status', (q) => q.eq('paymentStatus', 'ABANDONED'))
			.take(limit);
	}
});

export const getById = getApplication;

export const markPaymentInitiated = mutation({
	args: { applicationId: v.id('directoryApplications'), paymentReference: v.string(), auth: authArg },
	handler: async (ctx, { applicationId, paymentReference, auth }) => {
		requireAdminAuth(auth);
		await ctx.db.patch(applicationId, {
			status: 'PAYMENT_INITIATED',
			paymentStatus: 'INITIATED',
			paymentReference,
			updatedAt: now()
		});
		await ctx.db.insert('activityEvents', {
			applicationId,
			eventType: 'directory/application.payment_initiated',
			metadata: { paymentReference },
			createdAt: now()
		});
	}
});

export const markPaidFromPayment = mutation({
	args: { applicationId: v.id('directoryApplications'), paymentReference: v.string(), auth: authArg },
	handler: async (ctx, { applicationId, paymentReference, auth }) => {
		requireAdminAuth(auth);
		await ctx.db.patch(applicationId, {
			status: 'PAID',
			paymentStatus: 'PAID',
			paymentReference,
			updatedAt: now()
		});
		await ctx.db.insert('activityEvents', {
			applicationId,
			eventType: 'directory/application.payment_succeeded',
			metadata: { paymentReference },
			createdAt: now()
		});
	}
});

export const lockCoreFieldsAfterPayment = mutation({
	args: { applicationId: v.id('directoryApplications'), auth: authArg },
	handler: async (ctx, { applicationId, auth }) => {
		const application = await ctx.db.get(applicationId);
		if (!application) throw new Error('Application not found.');
		requireOwnedRecord(auth, application.applicantUserId);
		if (!['PAYMENT_INITIATED', 'PAID', 'UNDER_REVIEW', 'ACCEPTED', 'CONVERTED'].includes(application.status)) {
			throw new Error('Application core fields are not locked until payment or review starts.');
		}
		return { locked: true, status: application.status };
	}
});

export const adminAddNote = mutation({
	args: {
		applicationId: v.id('directoryApplications'),
		adminNotes: v.string(),
		reviewedBy: v.optional(v.id('users')),
		auth: authArg
	},
	handler: async (ctx, { applicationId, adminNotes, reviewedBy, auth }) => {
		requireAdminAuth(auth);
		if (!adminNotes.trim()) throw new Error('Admin note is required.');
		await ctx.db.patch(applicationId, { adminNotes, updatedAt: now() });
		await ctx.db.insert('activityEvents', {
			actorUserId: reviewedBy,
			applicationId,
			eventType: 'directory/application.admin_note_added',
			metadata: { hasNote: true },
			createdAt: now()
		});
	}
});

export const adminMarkUnderReview = mutation({
	args: { applicationId: v.id('directoryApplications'), reviewedBy: v.optional(v.id('users')), auth: authArg },
	handler: async (ctx, { applicationId, reviewedBy, auth }) => {
		requireAdminAuth(auth);
		const application = await ctx.db.get(applicationId);
		if (!application) throw new Error('Application not found.');
		if (!['PAID', 'SUBMITTED', 'PAYMENT_INITIATED'].includes(application.status)) {
			throw new Error('Only submitted or paid applications can be marked under review.');
		}
		await ctx.db.patch(applicationId, {
			status: 'UNDER_REVIEW',
			reviewedBy,
			reviewedAt: now(),
			updatedAt: now()
		});
		await ctx.db.insert('activityEvents', {
			actorUserId: reviewedBy,
			applicationId,
			eventType: 'directory/application.under_review',
			createdAt: now()
		});
	}
});

export const adminRequestResubmission = mutation({
	args: {
		applicationId: v.id('directoryApplications'),
		adminNotes: v.string(),
		reviewedBy: v.optional(v.id('users')),
		auth: authArg
	},
	handler: async (ctx, { applicationId, adminNotes, reviewedBy, auth }) => {
		requireAdminAuth(auth);
		if (!adminNotes.trim()) throw new Error('Admin note is required for resubmission.');
		await ctx.db.patch(applicationId, {
			status: 'NEEDS_RESUBMISSION',
			adminNotes,
			reviewedBy,
			reviewedAt: now(),
			updatedAt: now()
		});
		await ctx.db.insert('activityEvents', {
			actorUserId: reviewedBy,
			applicationId,
			eventType: 'directory/application.needs_resubmission',
			metadata: { hasNote: true },
			createdAt: now()
		});
	}
});

export const adminUpdateApplicationStatus = mutation({
	args: {
		applicationId: v.id('directoryApplications'),
		status: v.string(),
		adminNotes: v.optional(v.string()),
		reviewedBy: v.optional(v.id('users')),
		auth: authArg
	},
	handler: async (ctx, args) => {
		requireAdminAuth(args.auth);
		if (['REJECTED', 'NEEDS_RESUBMISSION'].includes(args.status) && !args.adminNotes?.trim()) {
			throw new Error('Admin note is required for rejection or resubmission.');
		}
		await ctx.db.patch(args.applicationId, {
			status: args.status as any,
			adminNotes: args.adminNotes,
			reviewedBy: args.reviewedBy,
			reviewedAt: now(),
			updatedAt: now()
		});
		await ctx.db.insert('activityEvents', {
			actorUserId: args.reviewedBy,
			applicationId: args.applicationId,
			eventType: 'directory/application.status_updated',
			metadata: { status: args.status, adminNotes: args.adminNotes },
			createdAt: now()
		});
	}
});

export const adminApproveAndConvertApplication = mutation({
	args: { applicationId: v.id('directoryApplications'), reviewedBy: v.optional(v.id('users')), auth: authArg },
	handler: async (ctx, { applicationId, reviewedBy, auth }) => {
		requireAdminAuth(auth);
		const application = await ctx.db.get(applicationId);
		if (!application) throw new Error('Application not found.');
		if (application.convertedListingId) return application.convertedListingId;
		if (!['PAID', 'UNDER_REVIEW', 'ACCEPTED'].includes(application.status)) {
			throw new Error('Application must be paid or under review before conversion.');
		}
		const timestamp = now();
		const slug = `${slugify(application.businessName)}-${String(applicationId).slice(-6)}`;
		const listingId = await ctx.db.insert('directoryListings', {
			ownerUserId: application.applicantUserId,
			sourceApplicationId: applicationId,
			businessName: application.businessName,
			slug,
			category: application.category,
			customCategory: application.customCategory,
			description: application.description,
			shortDescription: application.shortDescription ?? application.description.slice(0, 180),
			servicesOffered: application.servicesOffered ?? [],
			keywords: application.keywords ?? [],
			phone: application.phone,
			whatsapp: application.whatsapp ?? '',
			email: application.email,
			website: application.website,
			city: application.city,
			region: application.region,
			country: application.country,
			serviceArea: application.serviceArea,
			targetAudience: application.targetAudience,
			languages: application.languages,
			priceRange: application.priceRange,
			remoteAvailable: application.remoteAvailable ?? false,
			inPersonAvailable: application.inPersonAvailable ?? true,
			whatsappAvailable: application.whatsappAvailable ?? Boolean(application.whatsapp),
			trustSignals: [],
			verificationStatus: 'UNVERIFIED',
			isActive: true,
			isFeatured: false,
			referralCode: application.referralCode,
			createdAt: timestamp,
			updatedAt: timestamp
		});
		if (application.applicantUserId) {
			const owner = await ctx.db.get(application.applicantUserId);
			if (owner && owner.role === 'USER') {
				await ctx.db.patch(application.applicantUserId, { role: 'LISTING_OWNER', updatedAt: timestamp });
			}
		}
		await ctx.db.patch(applicationId, {
			status: 'CONVERTED',
			convertedListingId: listingId,
			reviewedBy,
			reviewedAt: timestamp,
			updatedAt: timestamp
		});
		await ctx.db.insert('activityEvents', {
			actorUserId: reviewedBy,
			applicationId,
			listingId,
			eventType: 'directory/application.approved',
			metadata: { suggestion: false },
			createdAt: timestamp
		});
		return listingId;
	}
});

export const adminApproveAndConvert = adminApproveAndConvertApplication;
