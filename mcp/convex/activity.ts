import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';
import { requireAdminAuth } from './_auth';

const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);

export const log = mutation({
	args: {
		actorUserId: v.optional(v.id('users')),
		subjectUserId: v.optional(v.id('users')),
		applicationId: v.optional(v.id('directoryApplications')),
		listingId: v.optional(v.id('directoryListings')),
		eventType: v.string(),
		path: v.optional(v.string()),
		method: v.optional(v.string()),
		userAgent: v.optional(v.string()),
		metadata: v.optional(v.any())
	},
	handler: async (ctx, args) => await ctx.db.insert('activityEvents', { ...args, createdAt: now() })
});

export const listRecent = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('activityEvents').order('desc').take(limit);
	}
});

export const getApplicationActivity = query({
	args: { applicationId: v.id('directoryApplications'), limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { applicationId, limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('activityEvents').withIndex('by_application', (q) => q.eq('applicationId', applicationId)).take(limit);
	}
});

export const getListingActivity = query({
	args: { listingId: v.id('directoryListings'), limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { listingId, limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('activityEvents').withIndex('by_listing', (q) => q.eq('listingId', listingId)).take(limit);
	}
});

export const getUserSupportContext = query({
	args: { userId: v.id('users'), limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { userId, limit = 50, auth }) => {
		requireAdminAuth(auth);
		const user = await ctx.db.get(userId);
		const events = await ctx.db
			.query('activityEvents')
			.withIndex('by_subject_user', (q) => q.eq('subjectUserId', userId))
			.take(limit);
		return {
			user: user && {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isDeleted: user.isDeleted,
				emailVerifiedAt: user.emailVerifiedAt,
				createdAt: user.createdAt
			},
			recentEvents: events
		};
	}
});

export const getRecentErrors = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return (await ctx.db.query('activityEvents').order('desc').take(200))
			.filter((event) => event.eventType.toLowerCase().includes('error') || event.metadata?.error)
			.slice(0, limit);
	}
});
