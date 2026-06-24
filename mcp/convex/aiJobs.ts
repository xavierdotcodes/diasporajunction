import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';
import { requireAdminAuth } from './_auth';

const aiJobType = v.union(
	v.literal('LISTING_SUMMARY'),
	v.literal('CATEGORY_CLASSIFICATION'),
	v.literal('SEARCH_QUERY_REWRITE'),
	v.literal('ADMIN_TRIAGE_SUMMARY'),
	v.literal('APPLICATION_REVIEW_ASSIST'),
	v.literal('LEAD_DIGEST')
);
const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);

export const createQueued = mutation({
	args: {
		type: aiJobType,
		input: v.optional(v.any()),
		relatedApplicationId: v.optional(v.id('directoryApplications')),
		relatedListingId: v.optional(v.id('directoryListings')),
		createdBy: v.optional(v.id('users')),
		auth: authArg
	},
	handler: async (ctx, args) => {
		requireAdminAuth(args.auth);
		const timestamp = now();
		return await ctx.db.insert('aiJobs', {
			type: args.type,
			status: 'QUEUED',
			input: args.input,
			relatedApplicationId: args.relatedApplicationId,
			relatedListingId: args.relatedListingId,
			createdBy: args.createdBy,
			createdAt: timestamp,
			updatedAt: timestamp
		});
	}
});

export const markRunning = mutation({
	args: { aiJobId: v.id('aiJobs'), auth: authArg },
	handler: async (ctx, { aiJobId, auth }) => {
		requireAdminAuth(auth);
		await ctx.db.patch(aiJobId, { status: 'RUNNING', updatedAt: now() });
	}
});

export const markCompleted = mutation({
	args: { aiJobId: v.id('aiJobs'), output: v.optional(v.any()), auth: authArg },
	handler: async (ctx, { aiJobId, output, auth }) => {
		requireAdminAuth(auth);
		await ctx.db.patch(aiJobId, { status: 'COMPLETED', output, updatedAt: now() });
	}
});

export const markFailed = mutation({
	args: { aiJobId: v.id('aiJobs'), error: v.string(), auth: authArg },
	handler: async (ctx, { aiJobId, error, auth }) => {
		requireAdminAuth(auth);
		await ctx.db.patch(aiJobId, { status: 'FAILED', error, updatedAt: now() });
	}
});
