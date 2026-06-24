import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';
import { requireAdminAuth } from './_auth';

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
const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);

export const log = mutation({
	args: {
		listingId: v.id('directoryListings'),
		userId: v.optional(v.id('users')),
		type: interactionType,
		referrer: v.optional(v.string()),
		metadata: v.optional(v.any())
	},
	handler: async (ctx, args) =>
		await ctx.db.insert('listingInteractions', {
			listingId: args.listingId,
			userId: args.userId,
			type: args.type,
			referrer: args.referrer,
			metadata: sanitizeInteractionMetadata(args.metadata),
			createdAt: now()
		})
});

export const getListingInteractionSummary = query({
	args: { listingId: v.id('directoryListings'), days: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { listingId, days = 30, auth }) => {
		requireAdminAuth(auth);
		const since = now() - days * 24 * 60 * 60 * 1000;
		const rows = (
			await ctx.db
				.query('listingInteractions')
				.withIndex('by_listing_created', (q) => q.eq('listingId', listingId))
				.collect()
		).filter((row) => row.createdAt >= since);
		return summarize(rows);
	}
});

export const getTopListings = query({
	args: { type: v.optional(interactionType), days: v.optional(v.number()), limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { type, days = 7, limit = 10, auth }) => {
		requireAdminAuth(auth);
		const since = now() - days * 24 * 60 * 60 * 1000;
		const rows = type
			? await ctx.db.query('listingInteractions').withIndex('by_type', (q) => q.eq('type', type)).collect()
			: await ctx.db.query('listingInteractions').collect();
		const counts = new Map<string, number>();
		for (const row of rows) {
			if (row.createdAt < since) continue;
			counts.set(String(row.listingId), (counts.get(String(row.listingId)) ?? 0) + 1);
		}
		return [...counts.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([listingId, count]) => ({ listingId, count, type: type ?? 'ALL' }));
	}
});

function summarize(rows: any[]) {
	const counts: Record<string, number> = {
		searchResultShown: 0,
		profileViews: 0,
		views: 0,
		whatsappClicks: 0,
		phoneClicks: 0,
		emailClicks: 0,
		websiteClicks: 0,
		quoteRequests: 0,
		saves: 0,
		shares: 0
	};
	for (const row of rows) {
		if (row.type === 'SEARCH_RESULT_SHOWN') counts.searchResultShown += 1;
		if (row.type === 'LISTING_PROFILE_VIEWED') counts.profileViews += 1;
		if (row.type === 'VIEW') counts.views += 1;
		if (row.type === 'WHATSAPP_CLICK') counts.whatsappClicks += 1;
		if (row.type === 'PHONE_CLICK') counts.phoneClicks += 1;
		if (row.type === 'EMAIL_CLICK') counts.emailClicks += 1;
		if (row.type === 'WEBSITE_CLICK') counts.websiteClicks += 1;
		if (row.type === 'QUOTE_REQUEST') counts.quoteRequests += 1;
		if (row.type === 'SAVE') counts.saves += 1;
		if (row.type === 'SHARE') counts.shares += 1;
	}
	return { total: rows.length, counts };
}

function sanitizeInteractionMetadata(metadata: any) {
	if (!metadata || typeof metadata !== 'object') return undefined;
	return {
		source: typeof metadata.source === 'string' ? metadata.source.slice(0, 80) : undefined,
		searchQuery: typeof metadata.searchQuery === 'string' ? metadata.searchQuery.slice(0, 160) : undefined,
		contactType: typeof metadata.contactType === 'string' ? metadata.contactType.slice(0, 40) : undefined
	};
}
