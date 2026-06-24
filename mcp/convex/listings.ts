import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';
import { requireAdminAuth } from './_auth';

const category = v.optional(v.string());
const targetAudience = v.optional(v.union(v.literal('LOCAL'), v.literal('DIASPORA'), v.literal('BOTH')));
const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);

export const search = query({
	args: {
		query: v.optional(v.string()),
		category,
		location: v.optional(v.string()),
		city: v.optional(v.string()),
		region: v.optional(v.string()),
		country: v.optional(v.string()),
		targetAudience,
		verifiedOnly: v.optional(v.boolean()),
		remoteAvailable: v.optional(v.boolean()),
		inPersonAvailable: v.optional(v.boolean()),
		keywords: v.optional(v.array(v.string())),
		limit: v.optional(v.number())
	},
	handler: async (ctx, args) => {
		const limit = Math.min(args.limit ?? 20, 50);
		const rows = await ctx.db
			.query('directoryListings')
			.withIndex('by_active', (q) => q.eq('isActive', true))
			.collect();
		const listings = rows
			.filter((listing) => listingMatches(listing, args))
			.sort(featuredFirst)
			.slice(0, limit);
		return await Promise.all(listings.map((listing) => publicListing(ctx, listing)));
	}
});

export const getById = query({
	args: { listingId: v.id('directoryListings') },
	handler: async (ctx, { listingId }) => {
		const listing = await ctx.db.get(listingId);
		return listing?.isActive ? await publicListing(ctx, listing) : null;
	}
});

export const getBySlug = query({
	args: { slug: v.string() },
	handler: async (ctx, { slug }) => {
		const listing = await ctx.db.query('directoryListings').withIndex('by_slug', (q) => q.eq('slug', slug)).unique();
		return listing?.isActive ? await publicListing(ctx, listing) : null;
	}
});

export const adminGetById = query({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.get(listingId);
	}
});

export const listMissingMedia = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		const listings = await ctx.db.query('directoryListings').withIndex('by_active', (q) => q.eq('isActive', true)).collect();
		const missing = [];
		for (const listing of listings) {
			const media = await ctx.db.query('listingMedia').withIndex('by_listing', (q) => q.eq('listingId', listing._id)).collect();
			const hasLogo = media.some((item) => item.type === 'LOGO');
			const hasCover = media.some((item) => item.type === 'COVER');
			const hasGallery = media.some((item) => ['GALLERY', 'PORTFOLIO'].includes(item.type));
			if (!hasLogo || !hasCover || !hasGallery) missing.push({ ...listing, missingMedia: { logo: !hasLogo, cover: !hasCover, gallery: !hasGallery } });
			if (missing.length >= limit) break;
		}
		return missing;
	}
});

export const listMissingContactInfo = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return (await ctx.db.query('directoryListings').collect())
			.filter((listing) => !listing.phone && !listing.whatsapp && !listing.email && !listing.website)
			.slice(0, limit);
	}
});

export const listFeatured = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('directoryListings').withIndex('by_featured', (q) => q.eq('isFeatured', true)).take(limit);
	}
});

export const listInactive = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('directoryListings').withIndex('by_active', (q) => q.eq('isActive', false)).take(limit);
	}
});

export const setFeaturedListing = mutation({
	args: {
		listingId: v.id('directoryListings'),
		isFeatured: v.boolean(),
		featuredUntil: v.optional(v.number()),
		actorUserId: v.optional(v.id('users')),
		auth: authArg
	},
	handler: async (ctx, args) => {
		requireAdminAuth(args.auth);
		await ctx.db.patch(args.listingId, {
			isFeatured: args.isFeatured,
			featuredUntil: args.featuredUntil,
			updatedAt: now()
		});
		await ctx.db.insert('activityEvents', {
			actorUserId: args.actorUserId,
			listingId: args.listingId,
			eventType: 'listing.featured_status_updated',
			metadata: { isFeatured: args.isFeatured },
			createdAt: now()
		});
	}
});

export const setListingActiveStatus = mutation({
	args: { listingId: v.id('directoryListings'), isActive: v.boolean(), actorUserId: v.optional(v.id('users')), auth: authArg },
	handler: async (ctx, args) => {
		requireAdminAuth(args.auth);
		await ctx.db.patch(args.listingId, { isActive: args.isActive, updatedAt: now() });
		await ctx.db.insert('activityEvents', {
			actorUserId: args.actorUserId,
			listingId: args.listingId,
			eventType: 'listing.active_status_updated',
			metadata: { isActive: args.isActive },
			createdAt: now()
		});
	}
});

function listingMatches(listing: any, args: any) {
	if (args.category && listing.category !== args.category) return false;
	if (args.verifiedOnly && listing.verificationStatus !== 'VERIFIED') return false;
	if (args.remoteAvailable !== undefined && listing.remoteAvailable !== args.remoteAvailable) return false;
	if (args.inPersonAvailable !== undefined && listing.inPersonAvailable !== args.inPersonAvailable) return false;
	if (args.targetAudience && listing.targetAudience !== args.targetAudience && listing.targetAudience !== 'BOTH') return false;
	const location = String(args.location ?? args.city ?? args.region ?? args.country ?? '').toLowerCase();
	if (location) {
		const haystack = `${listing.city} ${listing.region} ${listing.country} ${listing.serviceArea}`.toLowerCase();
		if (!haystack.includes(location)) return false;
	}
	const keywords = [...(args.keywords ?? []), args.query].filter(Boolean).map((item) => String(item).toLowerCase());
	if (keywords.length) {
		const haystack = [
			listing.businessName,
			listing.category,
			listing.customCategory,
			listing.description,
			listing.shortDescription,
			...(listing.servicesOffered ?? []),
			...(listing.keywords ?? [])
		]
			.join(' ')
			.toLowerCase();
		if (!keywords.some((keyword) => haystack.includes(keyword))) return false;
	}
	return true;
}

function featuredFirst(a: any, b: any) {
	if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
	if (a.verificationStatus !== b.verificationStatus) return a.verificationStatus === 'VERIFIED' ? -1 : 1;
	return (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0);
}

async function publicListing(ctx: any, listing: any) {
	const media = await getPublicMedia(ctx, listing._id);
	return {
		id: listing._id,
		businessName: listing.businessName,
		slug: listing.slug,
		category: listing.category,
		customCategory: listing.customCategory,
		description: listing.description,
		shortDescription: listing.shortDescription,
		servicesOffered: listing.servicesOffered ?? [],
		keywords: listing.keywords ?? [],
		city: listing.city,
		region: listing.region,
		country: listing.country,
		serviceArea: listing.serviceArea,
		targetAudience: listing.targetAudience,
		languages: listing.languages ?? [],
		priceRange: listing.priceRange,
		remoteAvailable: listing.remoteAvailable,
		inPersonAvailable: listing.inPersonAvailable,
		whatsappAvailable: listing.whatsappAvailable,
		trustSignals: listing.trustSignals ?? [],
		lastVerifiedAt: listing.lastVerifiedAt,
		verificationLevel: listing.verificationLevel,
		verificationStatus: listing.verificationStatus,
		isFeatured: listing.isFeatured,
		featuredUntil: listing.featuredUntil,
		contactOptions: {
			phone: listing.phone ? { available: true, value: listing.phone } : { available: false },
			whatsapp: listing.whatsapp ? { available: true, value: listing.whatsapp } : { available: false },
			email: listing.email ? { available: true, value: listing.email } : { available: false },
			website: listing.website ? { available: true, value: listing.website } : { available: false }
		},
		profileUrl: `/directory/profile/${listing.slug}`,
		media,
		logoUrl: media.find((item: any) => item.type === 'LOGO')?.url,
		coverUrl: media.find((item: any) => item.type === 'COVER')?.url,
		gallery: media.filter((item: any) => ['GALLERY', 'PORTFOLIO', 'BUSINESS_PROOF'].includes(item.type))
	};
}

async function getPublicMedia(ctx: any, listingId: any) {
	const rows = await ctx.db.query('listingMedia').withIndex('by_listing', (q: any) => q.eq('listingId', listingId)).collect();
	return await Promise.all(
		rows
			.sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
			.map(async (row: any) => ({
				type: row.type,
				caption: row.caption,
				sortOrder: row.sortOrder,
				url: await ctx.storage.getUrl(row.storageId),
				createdAt: row.createdAt
			}))
	);
}
