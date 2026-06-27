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
const ownerMediaType = v.union(
	v.literal('LOGO'),
	v.literal('COVER'),
	v.literal('GALLERY'),
	v.literal('PORTFOLIO')
);
const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);
const OWNER_PUBLIC_MEDIA_TYPES = ['LOGO', 'COVER', 'GALLERY', 'PORTFOLIO'] as const;

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

export const ownerGenerateListingUploadUrl = mutation({
	args: {
		listingId: v.id('directoryListings'),
		type: ownerMediaType,
		auth: authArg
	},
	handler: async (ctx, { listingId, type, auth }) => {
		await requireOwnerListingMediaAccess(ctx, listingId, auth);
		assertOwnerPublicMediaType(type);
		return await ctx.storage.generateUploadUrl();
	}
});

export const ownerSaveListingMedia = mutation({
	args: {
		listingId: v.id('directoryListings'),
		storageId: v.id('_storage'),
		fileId: v.optional(v.string()),
		type: ownerMediaType,
		caption: v.optional(v.string()),
		sortOrder: v.optional(v.number()),
		auth: authArg
	},
	handler: async (ctx, args) => {
		const listing = await requireOwnerListingMediaAccess(ctx, args.listingId, args.auth);
		assertOwnerPublicMediaType(args.type);
		const timestamp = now();
		const mediaId = await ctx.db.insert('listingMedia', {
			listingId: args.listingId,
			fileId: args.fileId,
			storageId: args.storageId,
			type: args.type,
			caption: cleanCaption(args.caption),
			sortOrder: args.sortOrder ?? 0,
			createdAt: timestamp
		});

		if (args.type === 'LOGO' || args.type === 'COVER') {
			const field = args.type === 'LOGO' ? 'logoFileId' : 'coverFileId';
			const previousId = (listing as any)[field];
			await ctx.db.patch(args.listingId, { [field]: mediaId, updatedAt: timestamp });
			if (previousId && String(previousId) !== String(mediaId)) {
				const previous = (await ctx.db.get(previousId as any)) as any;
				if (previous?.listingId === args.listingId && previous.type === args.type) {
					await deleteMediaRecord(ctx, previous, 'media.listing_replaced');
				}
			}
		} else {
			await ctx.db.patch(args.listingId, { updatedAt: timestamp });
		}

		await ctx.db.insert('activityEvents', {
			actorUserId: args.auth?.userId as any,
			subjectUserId: listing.ownerUserId,
			listingId: args.listingId,
			eventType: 'media.listing_uploaded',
			metadata: { mediaId, type: args.type },
			createdAt: timestamp
		});
		return mediaId;
	}
});

export const ownerListListingMedia = query({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		await requireOwnerListingMediaAccess(ctx, listingId, auth);
		return await mediaWithUrls(
			ctx,
			(
				await ctx.db.query('listingMedia').withIndex('by_listing', (q) => q.eq('listingId', listingId)).collect()
			).filter((item) => isOwnerPublicMediaType(item.type)),
			true
		);
	}
});

export const ownerUpdateListingMedia = mutation({
	args: {
		mediaId: v.id('listingMedia'),
		type: v.optional(ownerMediaType),
		caption: v.optional(v.string()),
		sortOrder: v.optional(v.number()),
		auth: authArg
	},
	handler: async (ctx, args) => {
		const media = await ctx.db.get(args.mediaId);
		if (!media?.listingId) throw new Error('Listing media not found.');
		const listing = await requireOwnerListingMediaAccess(ctx, media.listingId, args.auth);
		assertOwnerPublicMediaType(media.type);
		if (args.type) assertOwnerPublicMediaType(args.type);

		const patch: Record<string, unknown> = { updatedAt: now() };
		const mediaPatch: Record<string, unknown> = {};
		if (args.type) mediaPatch.type = args.type;
		if (args.caption !== undefined) mediaPatch.caption = cleanCaption(args.caption);
		if (args.sortOrder !== undefined) mediaPatch.sortOrder = args.sortOrder;
		await ctx.db.patch(args.mediaId, mediaPatch);

		const finalType = args.type ?? media.type;
		if (String(listing.logoFileId ?? '') === String(args.mediaId) && finalType !== 'LOGO') patch.logoFileId = undefined;
		if (String(listing.coverFileId ?? '') === String(args.mediaId) && finalType !== 'COVER') patch.coverFileId = undefined;
		if (finalType === 'LOGO') patch.logoFileId = args.mediaId;
		if (finalType === 'COVER') patch.coverFileId = args.mediaId;
		await ctx.db.patch(media.listingId, patch);
		await ctx.db.insert('activityEvents', {
			actorUserId: args.auth?.userId as any,
			subjectUserId: listing.ownerUserId,
			listingId: media.listingId,
			eventType: 'media.listing_updated',
			metadata: { mediaId: args.mediaId, type: finalType, fields: Object.keys(mediaPatch) },
			createdAt: now()
		});
		return args.mediaId;
	}
});

export const ownerDeleteListingMedia = mutation({
	args: { mediaId: v.id('listingMedia'), auth: authArg },
	handler: async (ctx, { mediaId, auth }) => {
		const media = await ctx.db.get(mediaId);
		if (!media?.listingId) return null;
		const listing = await requireOwnerListingMediaAccess(ctx, media.listingId, auth);
		assertOwnerPublicMediaType(media.type);
		const result = await deleteMediaRecord(ctx, media, 'media.listing_deleted');
		const listingPatch: Record<string, unknown> = { updatedAt: now() };
		if (String(listing.logoFileId ?? '') === String(mediaId)) listingPatch.logoFileId = undefined;
		if (String(listing.coverFileId ?? '') === String(mediaId)) listingPatch.coverFileId = undefined;
		await ctx.db.patch(media.listingId, listingPatch);
		await ctx.db.insert('activityEvents', {
			actorUserId: auth?.userId as any,
			subjectUserId: listing.ownerUserId,
			listingId: media.listingId,
			eventType: 'media.listing_deleted',
			metadata: { mediaId, type: media.type, storageDeleted: result.storageDeleted },
			createdAt: now()
		});
		return { mediaId, storageDeleted: result.storageDeleted };
	}
});

export const ownerReorderListingMedia = mutation({
	args: {
		listingId: v.id('directoryListings'),
		items: v.array(v.object({ mediaId: v.id('listingMedia'), sortOrder: v.number() })),
		auth: authArg
	},
	handler: async (ctx, { listingId, items, auth }) => {
		const listing = await requireOwnerListingMediaAccess(ctx, listingId, auth);
		for (const item of items) {
			const media = await ctx.db.get(item.mediaId);
			if (!media || String(media.listingId) !== String(listingId)) throw new Error('Listing media not found.');
			assertOwnerPublicMediaType(media.type);
			await ctx.db.patch(item.mediaId, { sortOrder: item.sortOrder });
		}
		await ctx.db.patch(listingId, { updatedAt: now() });
		await ctx.db.insert('activityEvents', {
			actorUserId: auth?.userId as any,
			subjectUserId: listing.ownerUserId,
			listingId,
			eventType: 'media.listing_reordered',
			metadata: { count: items.length },
			createdAt: now()
		});
		return items.length;
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
			(
				await ctx.db.query('listingMedia').withIndex('by_listing', (q) => q.eq('listingId', listingId)).collect()
			).filter((item) => isOwnerPublicMediaType(item.type)),
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

async function requireOwnerListingMediaAccess(ctx: any, listingId: any, auth: any) {
	requireSignedInAuth(auth);
	const listing = await ctx.db.get(listingId);
	if (!listing) throw new Error('Listing not found.');
	if (!canManageOwnerListingMedia(auth, listing)) {
		throw new Error('Listing owner or admin authorization is required.');
	}
	return listing;
}

function assertOwnerPublicMediaType(type: string) {
	if (!isOwnerPublicMediaType(type)) throw new Error('Only public listing media can be managed here.');
}

export function isOwnerPublicMediaType(type: unknown) {
	return OWNER_PUBLIC_MEDIA_TYPES.includes(type as any);
}

function cleanCaption(caption?: string) {
	const value = String(caption ?? '').trim();
	return value ? value.slice(0, 240) : undefined;
}

export function canManageOwnerListingMedia(auth: any, listing: any) {
	if (!auth) return false;
	if (auth.role === 'ADMIN') return true;
	return Boolean(auth.userId && listing?.ownerUserId && String(auth.userId) === String(listing.ownerUserId));
}

export function sanitizeOwnerMediaUpdate(input: any = {}) {
	if (input.type !== undefined) assertOwnerPublicMediaType(input.type);
	return {
		type: input.type,
		caption: cleanCaption(input.caption),
		sortOrder: input.sortOrder === undefined ? undefined : Number(input.sortOrder)
	};
}

async function deleteMediaRecord(ctx: any, media: any, eventType: string) {
	let storageDeleted = false;
	await ctx.db.delete(media._id);
	if (typeof ctx.storage?.delete === 'function') {
		try {
			await ctx.storage.delete(media.storageId);
			storageDeleted = true;
		} catch {
			storageDeleted = false;
		}
	}
	if (eventType === 'media.listing_replaced') {
		await ctx.db.insert('activityEvents', {
			listingId: media.listingId,
			eventType,
			metadata: { mediaId: media._id, type: media.type, storageDeleted },
			createdAt: now()
		});
	}
	return { storageDeleted };
}
