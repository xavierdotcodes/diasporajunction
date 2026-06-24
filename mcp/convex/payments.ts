import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';
import { requireAdminAuth, requireWebhookAuth } from './_auth';

const purpose = v.union(
	v.literal('LISTING_APPLICATION_FEE'),
	v.literal('VERIFICATION_FEE'),
	v.literal('FEATURED_LISTING'),
	v.literal('SUBSCRIPTION'),
	v.literal('MANUAL_ADJUSTMENT')
);
const provider = v.union(v.literal('STRIPE'), v.literal('PAYSTACK'), v.literal('MANUAL_MOMO'), v.literal('CASH'));
const status = v.union(
	v.literal('PENDING'),
	v.literal('INITIATED'),
	v.literal('SUCCESS'),
	v.literal('FAILED'),
	v.literal('ABANDONED'),
	v.literal('REFUNDED')
);
const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);
const webhookArg = v.optional(v.object({ webhookSecret: v.optional(v.string()) }));

export const createCheckoutRecord = mutation({
	args: {
		userId: v.optional(v.id('users')),
		applicationId: v.optional(v.id('directoryApplications')),
		listingId: v.optional(v.id('directoryListings')),
		purpose,
		provider,
		amount: v.number(),
		currency: v.string(),
		reference: v.string()
	},
	handler: async (ctx, args) => {
		if (args.provider !== 'STRIPE') throw new Error('Only Stripe checkout is implemented in v1.');
		const timestamp = now();
		const existing = await getPaymentByReferenceInternal(ctx, args.reference);
		if (existing) return existing._id;
		const paymentId = await ctx.db.insert('payments', {
			...args,
			status: 'PENDING',
			createdAt: timestamp,
			updatedAt: timestamp
		});
		if (args.applicationId) {
			await ctx.db.patch(args.applicationId, {
				paymentStatus: 'PENDING',
				paymentReference: args.reference,
				applicationFeeAmount: args.amount,
				updatedAt: timestamp
			});
		}
		return paymentId;
	}
});

export const createCheckoutSession = createCheckoutRecord;

export const markInitiated = mutation({
	args: {
		reference: v.string(),
		providerSessionId: v.optional(v.string()),
		providerPaymentId: v.optional(v.string()),
		providerCustomerId: v.optional(v.string()),
		providerSubscriptionId: v.optional(v.string()),
		providerMetadata: v.optional(v.any())
	},
	handler: async (ctx, args) => {
		const payment = await getPaymentByReferenceInternal(ctx, args.reference);
		if (!payment) throw new Error('Payment not found.');
		await ctx.db.patch(payment._id, {
			status: 'INITIATED',
			providerSessionId: args.providerSessionId,
			providerPaymentId: args.providerPaymentId,
			providerCustomerId: args.providerCustomerId,
			providerSubscriptionId: args.providerSubscriptionId,
			providerMetadata: args.providerMetadata,
			updatedAt: now()
		});
		if (payment.applicationId) {
			await ctx.db.patch(payment.applicationId, {
				status: 'PAYMENT_INITIATED',
				paymentStatus: 'INITIATED',
				updatedAt: now()
			});
		}
		await logPaymentEvent(ctx, payment, 'directory/payment.initiated');
	}
});

export const recordPaymentInitiated = markInitiated;

export const markSucceededFromWebhook = mutation({
	args: {
		stripeEventId: v.optional(v.string()),
		eventType: v.optional(v.string()),
		reference: v.string(),
		providerSessionId: v.optional(v.string()),
		providerPaymentId: v.optional(v.string()),
		providerCustomerId: v.optional(v.string()),
		providerSubscriptionId: v.optional(v.string()),
		providerMetadata: v.optional(v.any()),
		webhook: webhookArg
	},
	handler: async (ctx, args) => {
		requireWebhookAuth(args.webhook);
		return await markSuccessPayment(ctx, args);
	}
});

export const markPaymentSuccess = markSucceededFromWebhook;

export const markFailedFromWebhook = mutation({
	args: {
		stripeEventId: v.optional(v.string()),
		eventType: v.optional(v.string()),
		reference: v.string(),
		providerSessionId: v.optional(v.string()),
		providerPaymentId: v.optional(v.string()),
		providerMetadata: v.optional(v.any()),
		webhook: webhookArg
	},
	handler: async (ctx, args) => {
		requireWebhookAuth(args.webhook);
		return await markTerminalPayment(ctx, args, 'FAILED', 'directory/payment.failed', args.providerMetadata);
	}
});

export const markPaymentFailed = markFailedFromWebhook;

export const markPaymentAbandoned = mutation({
	args: {
		stripeEventId: v.optional(v.string()),
		eventType: v.optional(v.string()),
		reference: v.string(),
		providerSessionId: v.optional(v.string()),
		providerPaymentId: v.optional(v.string()),
		providerMetadata: v.optional(v.any()),
		webhook: webhookArg
	},
	handler: async (ctx, args) => {
		requireWebhookAuth(args.webhook);
		return await markTerminalPayment(ctx, args, 'ABANDONED', 'directory/payment.abandoned', args.providerMetadata);
	}
});

export const markAbandoned = markPaymentAbandoned;

export const markAbandonedFromWorkflow = mutation({
	args: { reference: v.string(), auth: authArg },
	handler: async (ctx, args) => {
		requireAdminAuth(args.auth);
		return await markTerminalPayment(
			ctx,
			{ reference: args.reference, eventType: 'directory/payment.abandoned.workflow' },
			'ABANDONED',
			'directory/payment.abandoned',
			{ source: 'inngest_workflow' }
		);
	}
});

export const handleStripeWebhook = mutation({
	args: {
		stripeEventId: v.optional(v.string()),
		type: v.string(),
		reference: v.string(),
		providerSessionId: v.optional(v.string()),
		providerPaymentId: v.optional(v.string()),
		providerCustomerId: v.optional(v.string()),
		providerSubscriptionId: v.optional(v.string()),
		providerMetadata: v.optional(v.any()),
		webhook: webhookArg
	},
	handler: async (ctx, args) => {
		requireWebhookAuth(args.webhook);
		if (['checkout.session.completed', 'payment_intent.succeeded', 'invoice.paid'].includes(args.type)) {
			return await markSuccessPayment(ctx, {
				reference: args.reference,
				stripeEventId: args.stripeEventId,
				eventType: args.type,
				providerSessionId: args.providerSessionId,
				providerPaymentId: args.providerPaymentId,
				providerCustomerId: args.providerCustomerId,
				providerSubscriptionId: args.providerSubscriptionId,
				providerMetadata: args.providerMetadata
			} as any);
		}
		if (args.type === 'payment_intent.payment_failed') {
			return await markTerminalPayment(ctx, { ...args, eventType: args.type }, 'FAILED', 'directory/payment.failed', args.providerMetadata);
		}
		if (args.type === 'customer.subscription.deleted') {
			const payment = await getPaymentByReferenceInternal(ctx, args.reference);
			if (payment) await logPaymentEvent(ctx, payment, 'directory/subscription.cancelled');
			return payment?._id;
		}
	}
});

export const listApplicationPayments = query({
	args: { applicationId: v.id('directoryApplications'), auth: authArg },
	handler: async (ctx, { applicationId, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('payments').withIndex('by_application', (q) => q.eq('applicationId', applicationId)).collect();
	}
});

export const adminListPayments = query({
	args: { status: v.optional(status), limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { status, limit = 50, auth }) => {
		requireAdminAuth(auth);
		return status
			? await ctx.db.query('payments').withIndex('by_status', (q) => q.eq('status', status)).take(limit)
			: await ctx.db.query('payments').order('desc').take(limit);
	}
});

export const getPaymentByReference = query({
	args: { reference: v.string(), auth: authArg },
	handler: async (ctx, { reference, auth }) => {
		requireAdminAuth(auth);
		return await getPaymentByReferenceInternal(ctx, reference);
	}
});

export const getByReference = getPaymentByReference;

export const getByProviderSessionId = query({
	args: { providerSessionId: v.string(), auth: authArg },
	handler: async (ctx, { providerSessionId, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db
			.query('payments')
			.withIndex('by_provider_session', (q) => q.eq('providerSessionId', providerSessionId))
			.unique();
	}
});

export const getByProviderPaymentId = query({
	args: { providerPaymentId: v.string(), auth: authArg },
	handler: async (ctx, { providerPaymentId, auth }) => {
		requireAdminAuth(auth);
		return (await ctx.db.query('payments').collect()).find((payment) => payment.providerPaymentId === providerPaymentId) ?? null;
	}
});

export const listRecent = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('payments').order('desc').take(limit);
	}
});

export const getById = query({
	args: { paymentId: v.id('payments'), auth: authArg },
	handler: async (ctx, { paymentId, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.get(paymentId);
	}
});

export const listFailed = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('payments').withIndex('by_status', (q) => q.eq('status', 'FAILED')).take(limit);
	}
});

export const listAbandoned = query({
	args: { limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { limit = 50, auth }) => {
		requireAdminAuth(auth);
		return await ctx.db.query('payments').withIndex('by_status', (q) => q.eq('status', 'ABANDONED')).take(limit);
	}
});

export const getSummary = query({
	args: { auth: authArg },
	handler: async (ctx, { auth }) => {
		requireAdminAuth(auth);
		const rows = await ctx.db.query('payments').collect();
		const byStatus = countBy(rows, 'status');
		const totalsByPurpose = totalBy(rows.filter((row) => row.status === 'SUCCESS'), 'purpose');
		const totalsByCurrency = totalBy(rows.filter((row) => row.status === 'SUCCESS'), 'currency');
		return {
			successfulPayments: byStatus.SUCCESS ?? 0,
			pendingPayments: (byStatus.PENDING ?? 0) + (byStatus.INITIATED ?? 0),
			failedPayments: byStatus.FAILED ?? 0,
			abandonedPayments: byStatus.ABANDONED ?? 0,
			totalsByPurpose,
			totalsByCurrency
		};
	}
});

function countBy(rows: any[], key: string) {
	return rows.reduce((acc, row) => ({ ...acc, [row[key]]: (acc[row[key]] ?? 0) + 1 }), {} as Record<string, number>);
}

function totalBy(rows: any[], key: string) {
	return rows.reduce(
		(acc, row) => ({ ...acc, [row[key]]: (acc[row[key]] ?? 0) + row.amount }),
		{} as Record<string, number>
	);
}

async function getPaymentByReferenceInternal(ctx: any, reference: string) {
	return await ctx.db.query('payments').withIndex('by_reference', (q: any) => q.eq('reference', reference)).unique();
}

async function markSuccessPayment(ctx: any, args: any) {
	const payment = await getPaymentByReferenceInternal(ctx, args.reference);
	if (!payment) throw new Error('Payment not found.');
	const eventResult = await recordWebhookEvent(ctx, args, payment, 'PROCESSED');
	if (eventResult === 'duplicate') return payment._id;
	if (payment.status === 'SUCCESS') return payment._id;
	await ctx.db.patch(payment._id, {
		status: 'SUCCESS',
		providerSessionId: args.providerSessionId ?? payment.providerSessionId,
		providerPaymentId: args.providerPaymentId ?? payment.providerPaymentId,
		providerCustomerId: args.providerCustomerId ?? payment.providerCustomerId,
		providerSubscriptionId: args.providerSubscriptionId ?? payment.providerSubscriptionId,
		providerMetadata: args.providerMetadata ?? payment.providerMetadata,
		updatedAt: now()
	});
	if (payment.applicationId) {
		await ctx.db.patch(payment.applicationId, {
			status: 'PAID',
			paymentStatus: 'PAID',
			updatedAt: now()
		});
	}
	await logPaymentEvent(ctx, payment, payment.purpose === 'SUBSCRIPTION' ? 'directory/subscription.started' : 'directory/payment.succeeded');
	return payment._id;
}

async function markTerminalPayment(ctx: any, args: any, nextStatus: 'FAILED' | 'ABANDONED', eventType: string, providerMetadata?: any) {
	const payment = await getPaymentByReferenceInternal(ctx, args.reference);
	if (!payment) throw new Error('Payment not found.');
	const eventResult = await recordWebhookEvent(ctx, args, payment, 'PROCESSED');
	if (eventResult === 'duplicate') return payment._id;
	if (payment.status === 'SUCCESS') return payment._id;
	await ctx.db.patch(payment._id, {
		status: nextStatus,
		providerSessionId: args.providerSessionId ?? payment.providerSessionId,
		providerPaymentId: args.providerPaymentId ?? payment.providerPaymentId,
		providerMetadata,
		updatedAt: now()
	});
	if (payment.applicationId) {
		await ctx.db.patch(payment.applicationId, {
			status: 'AWAITING_PAYMENT',
			paymentStatus: nextStatus,
			updatedAt: now()
		});
	}
	await logPaymentEvent(ctx, payment, eventType);
	return payment._id;
}

async function recordWebhookEvent(ctx: any, args: any, payment: any, status: 'PROCESSED' | 'IGNORED') {
	if (!args.stripeEventId) return 'recorded';
	const existing = await ctx.db
		.query('paymentWebhookEvents')
		.withIndex('by_provider_event', (q: any) => q.eq('provider', 'STRIPE').eq('eventId', args.stripeEventId))
		.unique();
	if (existing) return 'duplicate';
	await ctx.db.insert('paymentWebhookEvents', {
		provider: 'STRIPE',
		eventId: args.stripeEventId,
		eventType: args.eventType ?? 'stripe.webhook',
		reference: payment.reference,
		providerSessionId: args.providerSessionId ?? payment.providerSessionId,
		providerPaymentId: args.providerPaymentId ?? payment.providerPaymentId,
		status,
		metadata: args.providerMetadata,
		createdAt: now()
	});
	return 'recorded';
}

async function logPaymentEvent(ctx: any, payment: any, eventType: string) {
	await ctx.db.insert('activityEvents', {
		subjectUserId: payment.userId,
		applicationId: payment.applicationId,
		listingId: payment.listingId,
		eventType,
		metadata: { reference: payment.reference, provider: payment.provider, purpose: payment.purpose },
		createdAt: now()
	});
}
