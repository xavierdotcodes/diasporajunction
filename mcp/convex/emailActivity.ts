import { mutation } from './_generated/server';
import { v } from 'convex/values';

function requireInternalAuth(secret?: string) {
	const expected = process.env.CONVEX_INTERNAL_AUTH_SECRET;
	if (!expected || secret !== expected) {
		throw new Error('Unauthorized internal auth request.');
	}
}

export const log = mutation({
	args: {
		eventType: v.union(
			v.literal('EMAIL_VERIFICATION_SENT'),
			v.literal('PASSWORD_RESET_SENT'),
			v.literal('APPLICATION_EMAIL_SENT'),
			v.literal('PAYMENT_EMAIL_SENT'),
			v.literal('LISTING_EMAIL_SENT'),
			v.literal('LEAD_DIGEST_EMAIL_SENT'),
			v.literal('EMAIL_SKIPPED_MISSING_CONFIG'),
			v.literal('EMAIL_FAILED')
		),
		actorUserId: v.optional(v.id('users')),
		entityType: v.optional(v.string()),
		entityId: v.optional(v.string()),
		metadata: v.optional(v.any()),
		internalAuthSecret: v.string()
	},
	handler: async (ctx, args) => {
		requireInternalAuth(args.internalAuthSecret);
		const { internalAuthSecret, ...event } = args;
		return await ctx.db.insert('activityEvents', {
			...event,
			createdAt: Date.now()
		});
	}
});
