import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

function now() {
	return Date.now();
}

function requireInternalAuth(secret?: string) {
	const expected = process.env.CONVEX_INTERNAL_AUTH_SECRET;
	if (!expected || secret !== expected) {
		throw new Error('Unauthorized internal auth request.');
	}
}

const tokenType = v.union(v.literal('EMAIL_VERIFICATION'), v.literal('PASSWORD_RESET'));

export const create = mutation({
	args: {
		userId: v.id('users'),
		type: tokenType,
		tokenHash: v.string(),
		expiresAt: v.number(),
		metadata: v.optional(v.any()),
		internalAuthSecret: v.string()
	},
	handler: async (ctx, args) => {
		requireInternalAuth(args.internalAuthSecret);
		return await ctx.db.insert('authTokens', {
			userId: args.userId,
			type: args.type,
			tokenHash: args.tokenHash,
			expiresAt: args.expiresAt,
			createdAt: now(),
			metadata: args.metadata
		});
	}
});

export const getByHashForInternal = query({
	args: {
		tokenHash: v.string(),
		type: tokenType,
		internalAuthSecret: v.string()
	},
	handler: async (ctx, args) => {
		requireInternalAuth(args.internalAuthSecret);
		const token = await ctx.db
			.query('authTokens')
			.withIndex('by_token_hash', (q) => q.eq('tokenHash', args.tokenHash))
			.first();
		if (!token || token.type !== args.type) return null;
		const user = await ctx.db.get(token.userId);
		if (!user) return null;
		return { ...token, user };
	}
});

export const consume = mutation({
	args: {
		tokenHash: v.string(),
		type: tokenType,
		internalAuthSecret: v.string()
	},
	handler: async (ctx, args) => {
		requireInternalAuth(args.internalAuthSecret);
		const token = await ctx.db
			.query('authTokens')
			.withIndex('by_token_hash', (q) => q.eq('tokenHash', args.tokenHash))
			.first();
		if (!token || token.type !== args.type) return { ok: false, reason: 'invalid' };
		if (token.usedAt) return { ok: false, reason: 'used' };
		if (token.expiresAt <= now()) return { ok: false, reason: 'expired' };
		await ctx.db.patch(token._id, { usedAt: now() });
		return { ok: true, userId: token.userId };
	}
});

export const selectFeaturedExpiryCandidates = query({
	args: {
		now: v.number(),
		windowMs: v.number(),
		internalAuthSecret: v.string()
	},
	handler: async (ctx, args) => {
		requireInternalAuth(args.internalAuthSecret);
		const upper = args.now + args.windowMs;
		const listings = await ctx.db.query('listings').collect();
		return listings
			.filter((listing: any) => listing.isFeatured && listing.featuredUntil && listing.featuredUntil > args.now && listing.featuredUntil <= upper)
			.map((listing: any) => ({
				listingId: listing._id,
				ownerUserId: listing.ownerUserId,
				name: listing.name,
				featuredUntil: listing.featuredUntil
			}));
	}
});
