import { query } from './_generated/server';
import { v } from 'convex/values';
import { requireAdminAuth } from './_auth';

const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);

export const getSummary = query({
	args: { auth: authArg },
	handler: async (ctx, { auth }) => {
		requireAdminAuth(auth);
		const [needsAttention, directoryHealth, paymentSummary, recentActivity] = await Promise.all([
			buildNeedsAttention(ctx),
			buildDirectoryHealth(ctx),
			buildPaymentSummary(ctx),
			ctx.db.query('activityEvents').order('desc').take(20)
		]);
		return { needsAttention, directoryHealth, paymentSummary, recentActivity };
	}
});

export const getNeedsAttention = query({
	args: { auth: authArg },
	handler: async (ctx, { auth }) => {
		requireAdminAuth(auth);
		return await buildNeedsAttention(ctx);
	}
});

export const getDirectoryHealth = query({
	args: { auth: authArg },
	handler: async (ctx, { auth }) => {
		requireAdminAuth(auth);
		return await buildDirectoryHealth(ctx);
	}
});

export const getPaymentSummary = query({
	args: { auth: authArg },
	handler: async (ctx, { auth }) => {
		requireAdminAuth(auth);
		return await buildPaymentSummary(ctx);
	}
});

export const getRecentActivity = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('activityEvents').order('desc').take(limit);
	}
});

async function buildNeedsAttention(ctx: any) {
	const [applicationsNeedingReview, paidApplicationsAwaitingReview, applicationsNeedingResubmission, abandonedPaymentApplications, listings, failedPayments, recentErrors] =
		await Promise.all([
			ctx.db.query('directoryApplications').withIndex('by_status', (q: any) => q.eq('status', 'SUBMITTED')).take(25),
			ctx.db.query('directoryApplications').withIndex('by_status', (q: any) => q.eq('status', 'PAID')).take(25),
			ctx.db
				.query('directoryApplications')
				.withIndex('by_status', (q: any) => q.eq('status', 'NEEDS_RESUBMISSION'))
				.take(25),
			ctx.db
				.query('directoryApplications')
				.withIndex('by_payment_status', (q: any) => q.eq('paymentStatus', 'ABANDONED'))
				.take(25),
			ctx.db.query('directoryListings').collect(),
			ctx.db.query('payments').withIndex('by_status', (q: any) => q.eq('status', 'FAILED')).take(25),
			ctx.db.query('activityEvents').order('desc').take(100)
		]);
	const activeListings = listings.filter((listing: any) => listing.isActive);
	return {
		applicationsNeedingReview,
		paidApplicationsAwaitingReview,
		applicationsNeedingResubmission,
		abandonedPaymentApplications,
		listingsMissingMedia: activeListings.filter((listing: any) => !listing.logoFileId && !listing.coverFileId).slice(0, 25),
		listingsMissingContactInfo: activeListings
			.filter((listing: any) => !listing.phone && !listing.whatsapp && !listing.email && !listing.website)
			.slice(0, 25),
		failedPayments,
		recentErrorActivityEvents: recentErrors
			.filter((event: any) => event.eventType.toLowerCase().includes('error') || event.metadata?.error)
			.slice(0, 25)
	};
}

async function buildDirectoryHealth(ctx: any) {
	const listings = await ctx.db.query('directoryListings').collect();
	return {
		activeListings: listings.filter((listing: any) => listing.isActive).length,
		inactiveListings: listings.filter((listing: any) => !listing.isActive).length,
		verifiedListings: listings.filter((listing: any) => listing.verificationStatus === 'VERIFIED').length,
		unverifiedListings: listings.filter((listing: any) => listing.verificationStatus !== 'VERIFIED').length,
		featuredListings: listings.filter((listing: any) => listing.isFeatured).length,
		listingsByCategory: countBy(listings, 'category'),
		listingsByLocation: countBy(listings, 'city')
	};
}

async function buildPaymentSummary(ctx: any) {
	const payments = await ctx.db.query('payments').collect();
	const successful = payments.filter((payment: any) => payment.status === 'SUCCESS');
	const byStatus = countBy(payments, 'status');
	return {
		successfulPayments: byStatus.SUCCESS ?? 0,
		pendingPayments: (byStatus.PENDING ?? 0) + (byStatus.INITIATED ?? 0),
		failedPayments: byStatus.FAILED ?? 0,
		abandonedPayments: byStatus.ABANDONED ?? 0,
		totalsByPurpose: totalBy(successful, 'purpose'),
		totalsByCurrency: totalBy(successful, 'currency')
	};
}

function countBy(rows: any[], key: string) {
	return rows.reduce((acc, row) => ({ ...acc, [row[key] || 'UNKNOWN']: (acc[row[key] || 'UNKNOWN'] ?? 0) + 1 }), {} as Record<string, number>);
}

function totalBy(rows: any[], key: string) {
	return rows.reduce(
		(acc, row) => ({ ...acc, [row[key] || 'UNKNOWN']: (acc[row[key] || 'UNKNOWN'] ?? 0) + row.amount }),
		{} as Record<string, number>
	);
}
