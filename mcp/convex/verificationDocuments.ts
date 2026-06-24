import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';
import { requireAdminAuth, requireOwnedRecord } from './_auth';

const documentType = v.union(
	v.literal('ID_FRONT'),
	v.literal('ID_BACK'),
	v.literal('SELFIE_WITH_ID'),
	v.literal('BUSINESS_REGISTRATION'),
	v.literal('OTHER')
);
const documentStatus = v.union(
	v.literal('SUBMITTED'),
	v.literal('UNDER_REVIEW'),
	v.literal('ACCEPTED'),
	v.literal('REJECTED'),
	v.literal('NEEDS_RESUBMISSION')
);
const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);

export const generateUploadUrl = mutation({
	args: { auth: authArg },
	handler: async (ctx) => await ctx.storage.generateUploadUrl()
});

export const saveDocument = mutation({
	args: {
		applicationId: v.optional(v.id('directoryApplications')),
		listingId: v.optional(v.id('directoryListings')),
		userId: v.optional(v.id('users')),
		storageId: v.id('_storage'),
		type: documentType,
		auth: authArg
	},
	handler: async (ctx, args) => {
		if (!args.applicationId && !args.listingId) throw new Error('Application or listing is required.');
		if (args.applicationId) {
			const application = await ctx.db.get(args.applicationId);
			if (!application) throw new Error('Application not found.');
			requireOwnedRecord(args.auth, application.applicantUserId);
		}
		if (args.listingId) {
			const listing = await ctx.db.get(args.listingId);
			if (!listing) throw new Error('Listing not found.');
			if (args.auth?.role !== 'ADMIN') requireOwnedRecord(args.auth, listing.ownerUserId);
		}
		const documentId = await ctx.db.insert('verificationDocuments', {
			applicationId: args.applicationId,
			listingId: args.listingId,
			userId: args.userId,
			storageId: args.storageId,
			type: args.type,
			status: 'SUBMITTED',
			createdAt: now()
		});
		await ctx.db.insert('activityEvents', {
			applicationId: args.applicationId,
			listingId: args.listingId,
			subjectUserId: args.userId,
			eventType: 'verification_document.uploaded',
			metadata: { documentId, type: args.type },
			createdAt: now()
		});
		return documentId;
	}
});

export const listForApplication = query({
	args: { applicationId: v.id('directoryApplications'), auth: authArg },
	handler: async (ctx, { applicationId, auth }) => {
		const application = await ctx.db.get(applicationId);
		if (!application) throw new Error('Application not found.');
		requireOwnedRecord(auth, application.applicantUserId);
		const isAdmin = auth?.role === 'ADMIN';
		const rows = await ctx.db
			.query('verificationDocuments')
			.withIndex('by_application', (q) => q.eq('applicationId', applicationId))
			.collect();
		return rows.map((row) => safeDocument(row, isAdmin));
	}
});

export const listForListing = query({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		requireAdminAuth(auth);
		const rows = await ctx.db
			.query('verificationDocuments')
			.withIndex('by_listing', (q) => q.eq('listingId', listingId))
			.collect();
		return rows.map((row) => safeDocument(row, true));
	}
});

export const adminGetDocumentUrl = query({
	args: { documentId: v.id('verificationDocuments'), auth: authArg },
	handler: async (ctx, { documentId, auth }) => {
		requireAdminAuth(auth);
		const document = await ctx.db.get(documentId);
		if (!document) return null;
		return {
			document: safeDocument(document, true),
			url: await ctx.storage.getUrl(document.storageId)
		};
	}
});

export const adminUpdateDocumentStatus = mutation({
	args: {
		documentId: v.id('verificationDocuments'),
		status: documentStatus,
		notes: v.optional(v.string()),
		reviewedBy: v.optional(v.id('users')),
		auth: authArg
	},
	handler: async (ctx, args) => {
		requireAdminAuth(args.auth);
		const document = await ctx.db.get(args.documentId);
		if (!document) throw new Error('Verification document not found.');
		await ctx.db.patch(args.documentId, {
			status: args.status,
			notes: args.notes,
			reviewedBy: args.reviewedBy,
			reviewedAt: now()
		});
		await ctx.db.insert('activityEvents', {
			actorUserId: args.reviewedBy,
			applicationId: document.applicationId,
			listingId: document.listingId,
			eventType: 'verification_document.status_changed',
			metadata: { documentId: args.documentId, status: args.status, hasNotes: Boolean(args.notes) },
			createdAt: now()
		});
		return args.documentId;
	}
});

function safeDocument(document: any, includeAdminFields: boolean) {
	return {
		id: document._id,
		applicationId: document.applicationId,
		listingId: document.listingId,
		userId: document.userId,
		type: document.type,
		status: document.status,
		notes: includeAdminFields ? document.notes : undefined,
		reviewedBy: includeAdminFields ? document.reviewedBy : undefined,
		reviewedAt: includeAdminFields ? document.reviewedAt : undefined,
		createdAt: document.createdAt
	};
}
