import { mutation, query } from './_generated/server';
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
			input: sanitizeAiPayload(args.input),
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
		const job = await requireAiJob(ctx, aiJobId);
		assertTransition(job.status, 'RUNNING');
		await ctx.db.patch(aiJobId, { status: 'RUNNING', updatedAt: now() });
	}
});

export const markCompleted = mutation({
	args: { aiJobId: v.id('aiJobs'), output: v.optional(v.any()), auth: authArg },
	handler: async (ctx, { aiJobId, output, auth }) => {
		requireAdminAuth(auth);
		const job = await requireAiJob(ctx, aiJobId);
		assertTransition(job.status, 'COMPLETED');
		await ctx.db.patch(aiJobId, { status: 'COMPLETED', output: sanitizeAiPayload(output), updatedAt: now() });
	}
});

export const markFailed = mutation({
	args: { aiJobId: v.id('aiJobs'), error: v.string(), auth: authArg },
	handler: async (ctx, { aiJobId, error, auth }) => {
		requireAdminAuth(auth);
		const job = await requireAiJob(ctx, aiJobId);
		assertTransition(job.status, 'FAILED');
		await ctx.db.patch(aiJobId, { status: 'FAILED', error: sanitizeError(error), updatedAt: now() });
	}
});

export const getQueued = query({
	args: {
		type: v.optional(aiJobType),
		relatedApplicationId: v.optional(v.id('directoryApplications')),
		relatedListingId: v.optional(v.id('directoryListings')),
		limit: v.optional(v.number()),
		auth: authArg
	},
	handler: async (ctx, args) => {
		requireAdminAuth(args.auth);
		const rows = await ctx.db
			.query('aiJobs')
			.withIndex('by_status', (q) => q.eq('status', 'QUEUED'))
			.collect();
		return rows
			.filter((job) => !args.type || job.type === args.type)
			.filter((job) => !args.relatedApplicationId || job.relatedApplicationId === args.relatedApplicationId)
			.filter((job) => !args.relatedListingId || job.relatedListingId === args.relatedListingId)
			.sort((a, b) => a.createdAt - b.createdAt)
			.slice(0, Math.min(args.limit ?? 25, 100));
	}
});

export const getById = query({
	args: { aiJobId: v.id('aiJobs'), auth: authArg },
	handler: async (ctx, { aiJobId, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.get(aiJobId);
	}
});

export const listRecent = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('aiJobs').order('desc').take(Math.min(limit, 100));
	}
});

export const listFailed = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db
			.query('aiJobs')
			.withIndex('by_status', (q) => q.eq('status', 'FAILED'))
			.order('desc')
			.take(Math.min(limit, 100));
	}
});

function sanitizeAiPayload(value: any): any {
	if (Array.isArray(value)) return value.map(sanitizeAiPayload);
	if (!value || typeof value !== 'object') return value;
	const blocked = /documentUrl|storageId|providerMetadata|verificationDocuments|private/i;
	return Object.fromEntries(
		Object.entries(value)
			.filter(([key]) => !blocked.test(key))
			.map(([key, item]) => [key, sanitizeAiPayload(item)])
	);
}

function sanitizeError(error: string) {
	return String(error ?? 'AI job failed.').slice(0, 500);
}

async function requireAiJob(ctx: any, aiJobId: any) {
	const job = await ctx.db.get(aiJobId);
	if (!job) throw new Error('AI job not found.');
	return job;
}

function assertTransition(current: string, next: string) {
	const allowed: Record<string, string[]> = {
		QUEUED: ['RUNNING', 'FAILED'],
		RUNNING: ['COMPLETED', 'FAILED'],
		COMPLETED: [],
		FAILED: []
	};
	if (!allowed[current]?.includes(next)) {
		throw new Error(`Invalid AI job transition from ${current} to ${next}.`);
	}
}
