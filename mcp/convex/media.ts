import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';
import { requireAdminAuth, requireOwnedRecord, requireSignedInAuth } from './_auth';

const mediaType = v.union(
	v.literal('LOGO'),
	v.literal('COVER'),
	v.literal('GALLERY'),
	v.literal('PORTFOLIO'),
	v.literal('BUSINESS_PROOF')
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
	handler: async (ctx, { auth }) => {
		requireSignedInAuth(auth);
		return await ctx.storage.generateUploadUrl();
	}
});

export const saveApplicationMedia = mutation({
	args: {
		applicationId: v.id('directoryApplications'),
		storageId: v.id('_storage'),
		fileId: v.optional(v.string()),
		type: mediaType,
		caption: v.optional(v.string()),
		sortOrder: v.optional(v.number()),
		auth: authArg
	},
	handler: async (ctx, args) => {
		const application = await ctx.db.get(args.applicationId);
		if (!application) throw new Error('Application not found.');
		requireOwnedRecord(args.auth, application.applicantUserId);
		if (!['DRAFT', 'NEEDS_RESUBMISSION', 'AWAITING_PAYMENT', 'PAYMENT_INITIATED', 'PAID', 'UNDER_REVIEW'].includes(application.status)) {
			throw new Error('Application media cannot be changed in this status.');
		}
		const mediaId = await ctx.db.insert('listingMedia', {
			applicationId: args.applicationId,
			fileId: args.fileId,
			storageId: args.storageId,
			type: args.type,
			caption: args.caption,
			sortOrder: args.sortOrder ?? 0,
			createdAt: now()
		});
		await ctx.db.insert('activityEvents', {
			applicationId: args.applicationId,
			eventType: 'media.application_uploaded',
			metadata: { mediaId, type: args.type },
			createdAt: now()
		});
		return mediaId;
	}
});

export const saveListingMedia = mutation({
	args: {
		listingId: v.id('directoryListings'),
		storageId: v.id('_storage'),
		fileId: v.optional(v.string()),
		type: mediaType,
		caption: v.optional(v.string()),
		sortOrder: v.optional(v.number()),
		auth: authArg
	},
	handler: async (ctx, args) => {
		const listing = await ctx.db.get(args.listingId);
		if (!listing) throw new Error('Listing not found.');
		if (args.auth?.role !== 'ADMIN') requireOwnedRecord(args.auth, listing.ownerUserId);
		const mediaId = await ctx.db.insert('listingMedia', {
			listingId: args.listingId,
			fileId: args.fileId,
			storageId: args.storageId,
			type: args.type,
			caption: args.caption,
			sortOrder: args.sortOrder ?? 0,
			createdAt: now()
		});
		if (args.type === 'LOGO') await ctx.db.patch(args.listingId, { logoFileId: mediaId, updatedAt: now() });
		if (args.type === 'COVER') await ctx.db.patch(args.listingId, { coverFileId: mediaId, updatedAt: now() });
		await ctx.db.insert('activityEvents', {
			listingId: args.listingId,
			eventType: 'media.listing_uploaded',
			metadata: { mediaId, type: args.type },
			createdAt: now()
		});
		return mediaId;
	}
});

export const listApplicationMedia = query({
	args: { applicationId: v.id('directoryApplications'), auth: authArg },
	handler: async (ctx, { applicationId, auth }) => {
		const application = await ctx.db.get(applicationId);
		if (!application) throw new Error('Application not found.');
		requireOwnedRecord(auth, application.applicantUserId);
		return await mediaWithUrls(
			ctx,
			await ctx.db.query('listingMedia').withIndex('by_application', (q) => q.eq('applicationId', applicationId)).collect(),
			true
		);
	}
});

export const listListingMedia = query({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		const listing = await ctx.db.get(listingId);
		if (!listing) throw new Error('Listing not found.');
		if (auth?.role !== 'ADMIN') requireOwnedRecord(auth, listing.ownerUserId);
		return await mediaWithUrls(
			ctx,
			await ctx.db.query('listingMedia').withIndex('by_listing', (q) => q.eq('listingId', listingId)).collect(),
			true
		);
	}
});

export const getPublicListingMedia = query({
	args: { listingId: v.id('directoryListings') },
	handler: async (ctx, { listingId }) => {
		const listing = await ctx.db.get(listingId);
		if (!listing?.isActive) return [];
		return await mediaWithUrls(
			ctx,
			await ctx.db.query('listingMedia').withIndex('by_listing', (q) => q.eq('listingId', listingId)).collect(),
			false
		);
	}
});

export const deleteMedia = mutation({
	args: { mediaId: v.id('listingMedia'), auth: authArg },
	handler: async (ctx, { mediaId, auth }) => {
		requireAdminAuth(auth);
		const media = await ctx.db.get(mediaId);
		if (!media) return null;
		await ctx.db.delete(mediaId);
		await ctx.db.insert('activityEvents', {
			applicationId: media.applicationId,
			listingId: media.listingId,
			eventType: 'media.deleted',
			metadata: { mediaId, type: media.type },
			createdAt: now()
		});
		return mediaId;
	}
});

async function mediaWithUrls(ctx: any, rows: any[], includeIds: boolean) {
	const sorted = rows.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
	return await Promise.all(
		sorted.map(async (row) => ({
			id: includeIds ? row._id : undefined,
			type: row.type,
			caption: row.caption,
			sortOrder: row.sortOrder,
			url: await ctx.storage.getUrl(row.storageId),
			createdAt: row.createdAt
		}))
	);
}
