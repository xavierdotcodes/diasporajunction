import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { now } from './_shared';

const authArg = v.optional(
	v.object({
		userId: v.optional(v.string()),
		role: v.optional(v.union(v.literal('USER'), v.literal('LISTING_OWNER'), v.literal('ADMIN'))),
		adminToken: v.optional(v.string())
	})
);

const publicProfilePatch = v.object({
	description: v.optional(v.string()),
	shortDescription: v.optional(v.string()),
	servicesOffered: v.optional(v.array(v.string())),
	keywords: v.optional(v.array(v.string())),
	phone: v.optional(v.string()),
	whatsapp: v.optional(v.string()),
	email: v.optional(v.string()),
	website: v.optional(v.string()),
	serviceArea: v.optional(v.string()),
	languages: v.optional(v.array(v.string())),
	priceRange: v.optional(v.string()),
	remoteAvailable: v.optional(v.boolean()),
	inPersonAvailable: v.optional(v.boolean()),
	whatsappAvailable: v.optional(v.boolean())
});

export const getMyListings = query({
	args: { auth: authArg },
	handler: async (ctx, { auth }) => {
		requireSignedInOwnerOrAdmin(auth);
		const listings =
			auth?.role === 'ADMIN'
				? await ctx.db.query('directoryListings').order('desc').take(100)
				: await ctx.db
						.query('directoryListings')
						.withIndex('by_owner', (q) => q.eq('ownerUserId', auth?.userId as any))
						.collect();
		return await Promise.all(
			listings.map(async (listing) => ({
				...safeOwnerListing(listing),
				profileCompleteness: await buildProfileCompleteness(ctx, listing),
				interactionSummary7d: await summarizeListingInteractions(ctx, listing._id, 7),
				interactionSummary30d: await summarizeListingInteractions(ctx, listing._id, 30)
			}))
		);
	}
});

export const getListingDashboard = query({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		const listing = await requireListingDashboardAccess(ctx, listingId, auth);
		const [profileCompleteness, interactionSummary7d, interactionSummary30d, leadDigest, improvementSuggestions] =
			await Promise.all([
				buildProfileCompleteness(ctx, listing),
				summarizeListingInteractions(ctx, listingId, 7),
				summarizeListingInteractions(ctx, listingId, 30),
				getLatestAiOutput(ctx, listingId, 'LEAD_DIGEST'),
				getLatestAiOutput(ctx, listingId, 'LISTING_SUMMARY')
			]);
		return {
			listing: safeOwnerListing(listing),
			profileCompleteness,
			interactionSummary7d,
			interactionSummary30d,
			leadDigest: leadDigest ?? deterministicLeadDigest(interactionSummary30d, 'last 30 days'),
			improvementSuggestions: improvementSuggestions ?? deterministicImprovementSuggestions(listing, profileCompleteness)
		};
	}
});

export const getListingInteractionSummary = query({
	args: { listingId: v.id('directoryListings'), period: v.optional(v.union(v.literal('7d'), v.literal('30d'), v.literal('all'))), auth: authArg },
	handler: async (ctx, { listingId, period = '30d', auth }) => {
		await requireListingDashboardAccess(ctx, listingId, auth);
		return await summarizeListingInteractions(ctx, listingId, daysForPeriod(period));
	}
});

export const getListingRecentInteractions = query({
	args: { listingId: v.id('directoryListings'), period: v.optional(v.union(v.literal('7d'), v.literal('30d'), v.literal('all'))), limit: v.optional(v.number()), auth: authArg },
	handler: async (ctx, { listingId, period = '30d', limit = 50, auth }) => {
		await requireListingDashboardAccess(ctx, listingId, auth);
		const rows = await getListingInteractions(ctx, listingId, daysForPeriod(period));
		return rows
			.sort((a: any, b: any) => b.createdAt - a.createdAt)
			.slice(0, Math.min(limit, 100))
			.map(safeInteraction);
	}
});

export const getListingLeadDigest = query({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		await requireListingDashboardAccess(ctx, listingId, auth);
		const summary = await summarizeListingInteractions(ctx, listingId, 30);
		return (await getLatestAiOutput(ctx, listingId, 'LEAD_DIGEST')) ?? deterministicLeadDigest(summary, 'last 30 days');
	}
});

export const getListingImprovementSuggestions = query({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		const listing = await requireListingDashboardAccess(ctx, listingId, auth);
		const completeness = await buildProfileCompleteness(ctx, listing);
		return (await getLatestAiOutput(ctx, listingId, 'LISTING_SUMMARY')) ?? deterministicImprovementSuggestions(listing, completeness);
	}
});

export const getListingProfileCompleteness = query({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		const listing = await requireListingDashboardAccess(ctx, listingId, auth);
		return await buildProfileCompleteness(ctx, listing);
	}
});

export const updateListingPublicProfile = mutation({
	args: { listingId: v.id('directoryListings'), patch: publicProfilePatch, auth: authArg },
	handler: async (ctx, { listingId, patch, auth }) => {
		await requireListingDashboardAccess(ctx, listingId, auth);
		const safePatch = sanitizeOwnerListingPatch(patch);
		await ctx.db.patch(listingId, { ...safePatch, updatedAt: now() });
		await ctx.db.insert('activityEvents', {
			actorUserId: auth?.userId as any,
			listingId,
			eventType: 'listing.owner_public_profile_updated',
			metadata: { fields: Object.keys(safePatch) },
			createdAt: now()
		});
		return listingId;
	}
});

export const requestListingImprovementSuggestions = mutation({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		await requireListingDashboardAccess(ctx, listingId, auth);
		return await createOwnerAiJob(ctx, {
			type: 'LISTING_SUMMARY',
			relatedListingId: listingId,
			input: { listingId, requestedBy: 'owner_dashboard', purpose: 'listing_improvement_suggestions' },
			createdBy: auth?.userId
		});
	}
});

export const requestListingLeadDigest = mutation({
	args: { listingId: v.id('directoryListings'), auth: authArg },
	handler: async (ctx, { listingId, auth }) => {
		await requireListingDashboardAccess(ctx, listingId, auth);
		return await createOwnerAiJob(ctx, {
			type: 'LEAD_DIGEST',
			relatedListingId: listingId,
			input: { listingId, requestedBy: 'owner_dashboard', purpose: 'lead_digest' },
			createdBy: auth?.userId
		});
	}
});

export function canAccessListingDashboard(auth: any, listing: any) {
	if (!auth || (!auth.userId && auth.role !== 'ADMIN')) return false;
	if (auth.role === 'ADMIN') return true;
	return Boolean(listing?.ownerUserId && String(listing.ownerUserId) === String(auth.userId));
}

export function sanitizeOwnerListingPatch(patch: Record<string, unknown> = {}) {
	const allowed = new Set([
		'description',
		'shortDescription',
		'servicesOffered',
		'keywords',
		'phone',
		'whatsapp',
		'email',
		'website',
		'serviceArea',
		'languages',
		'priceRange',
		'remoteAvailable',
		'inPersonAvailable',
		'whatsappAvailable'
	]);
	return Object.fromEntries(Object.entries(patch).filter(([key]) => allowed.has(key)));
}

export function calculateProfileCompleteness(listing: any, media: any[] = []) {
	const hasLogo = Boolean(listing.logoFileId || media.some((item) => item.type === 'LOGO'));
	const hasCover = Boolean(listing.coverFileId || media.some((item) => item.type === 'COVER'));
	const galleryCount = media.filter((item) => ['GALLERY', 'PORTFOLIO'].includes(item.type)).length;
	const checks = [
		['has logo', hasLogo, 'Add a logo so customers recognize your business.'],
		['has cover image', hasCover, 'Add a cover image that shows your service or team.'],
		['has at least 3 gallery or portfolio images', galleryCount >= 3, 'Add at least 3 gallery or portfolio images.'],
		['has short description', Boolean(String(listing.shortDescription ?? '').trim()), 'Add a concise short description.'],
		['has full description', Boolean(String(listing.description ?? '').trim()), 'Add a detailed service description.'],
		['has services offered', Array.isArray(listing.servicesOffered) && listing.servicesOffered.length > 0, 'List the specific services you offer.'],
		['has location or service area', Boolean(String(listing.city ?? '').trim() || String(listing.serviceArea ?? '').trim()), 'Add your city or service area.'],
		['has WhatsApp or phone', Boolean(String(listing.whatsapp ?? '').trim() || String(listing.phone ?? '').trim()), 'Add WhatsApp or phone contact information.'],
		['has target audience', Boolean(String(listing.targetAudience ?? '').trim()), 'Set the audience you serve.'],
		['has verification status', Boolean(String(listing.verificationStatus ?? '').trim()), 'Complete verification steps when available.'],
		['has at least one trust signal', Array.isArray(listing.trustSignals) && listing.trustSignals.length > 0, 'Ask admin to add verified trust signals when earned.']
	] as const;
	const passed = checks.filter(([, ok]) => ok).length;
	return {
		score: Math.round((passed / checks.length) * 100),
		missingItems: checks.filter(([, ok]) => !ok).map(([label]) => label),
		recommendedNextActions: checks.filter(([, ok]) => !ok).map(([, , action]) => action).slice(0, 5)
	};
}

export function filterInteractionsByPeriod(rows: any[] = [], period: '7d' | '30d' | 'all' = '30d', currentTime = Date.now()) {
	const days = daysForPeriod(period);
	if (!days) return rows;
	const since = currentTime - days * 24 * 60 * 60 * 1000;
	return rows.filter((row) => row.createdAt >= since);
}

async function requireListingDashboardAccess(ctx: any, listingId: any, auth: any) {
	requireSignedInOwnerOrAdmin(auth);
	const listing = await ctx.db.get(listingId);
	if (!listing) throw new Error('Listing not found.');
	if (!canAccessListingDashboard(auth, listing)) throw new Error('Listing owner or admin authorization is required.');
	return listing;
}

async function createOwnerAiJob(ctx: any, args: any) {
	const timestamp = now();
	return await ctx.db.insert('aiJobs', {
		type: args.type,
		status: 'QUEUED',
		input: args.input,
		relatedListingId: args.relatedListingId,
		createdBy: args.createdBy as any,
		createdAt: timestamp,
		updatedAt: timestamp
	});
}

function requireSignedInOwnerOrAdmin(auth: any) {
	if (auth?.role === 'ADMIN') return true;
	if (auth?.userId && ['USER', 'LISTING_OWNER'].includes(auth?.role)) return true;
	throw new Error('Listing owner or admin authorization is required.');
}

async function buildProfileCompleteness(ctx: any, listing: any) {
	const media = await ctx.db.query('listingMedia').withIndex('by_listing', (q: any) => q.eq('listingId', listing._id)).collect();
	return calculateProfileCompleteness(listing, media);
}

async function getListingInteractions(ctx: any, listingId: any, days?: number) {
	const rows = await ctx.db
		.query('listingInteractions')
		.withIndex('by_listing_created', (q: any) => q.eq('listingId', listingId))
		.collect();
	if (!days) return rows;
	const since = now() - days * 24 * 60 * 60 * 1000;
	return rows.filter((row: any) => row.createdAt >= since);
}

async function summarizeListingInteractions(ctx: any, listingId: any, days?: number) {
	return summarizeInteractions(await getListingInteractions(ctx, listingId, days), days ? `last ${days} days` : 'all time');
}

function summarizeInteractions(rows: any[], period: string) {
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
	return {
		period,
		total: rows.length,
		counts,
		topInteractionTypes: Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.filter(([, count]) => count > 0)
			.slice(0, 5)
			.map(([type, count]) => ({ type, count }))
	};
}

async function getLatestAiOutput(ctx: any, listingId: any, type: string) {
	const rows = await ctx.db
		.query('aiJobs')
		.withIndex('by_type', (q: any) => q.eq('type', type))
		.collect();
	const job = rows
		.filter((row: any) => row.status === 'COMPLETED' && String(row.relatedListingId ?? '') === String(listingId))
		.sort((a: any, b: any) => b.updatedAt - a.updatedAt)[0];
	return job?.output ? { ...job.output, aiJobId: job._id, suggestion: true } : null;
}

function deterministicLeadDigest(summary: any, period: string) {
	const c = summary?.counts ?? {};
	return {
		digestSummary: `${summary?.total ?? 0} listing interactions in ${period}.`,
		interactionSummary: summary,
		topLeadSourcesActions: summary?.topInteractionTypes ?? [],
		suggestedImprovements: c.whatsappClicks || c.phoneClicks ? ['Follow up quickly on direct contact actions.'] : ['Make contact options more prominent.'],
		providerFacingSummary: 'This is a deterministic fallback summary until an AI lead digest is available.',
		suggestion: true,
		fallbackUsed: true
	};
}

function deterministicImprovementSuggestions(listing: any, completeness: any) {
	return {
		profileImprovementSuggestions: completeness.recommendedNextActions,
		missingTrustSignals: listing.verificationStatus === 'VERIFIED' ? [] : ['Public verification is not marked verified yet.'],
		contentPhotoRecommendations: completeness.missingItems.filter((item: string) => item.includes('image') || item.includes('gallery')),
		ctaRecommendations: listing.whatsapp || listing.phone ? ['Keep direct contact details current.'] : ['Add WhatsApp or phone so leads can contact you.'],
		suggestion: true,
		fallbackUsed: true
	};
}

function safeOwnerListing(listing: any) {
	return {
		id: listing._id,
		ownerUserId: listing.ownerUserId,
		businessName: listing.businessName,
		slug: listing.slug,
		category: listing.category,
		customCategory: listing.customCategory,
		description: listing.description,
		shortDescription: listing.shortDescription,
		servicesOffered: listing.servicesOffered ?? [],
		keywords: listing.keywords ?? [],
		phone: listing.phone,
		whatsapp: listing.whatsapp,
		email: listing.email,
		website: listing.website,
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
		isActive: listing.isActive,
		isFeatured: listing.isFeatured,
		featuredUntil: listing.featuredUntil,
		profileUrl: `/directory/profile/${listing.slug}`,
		createdAt: listing.createdAt,
		updatedAt: listing.updatedAt
	};
}

function safeInteraction(row: any) {
	return {
		id: row._id,
		type: row.type,
		referrer: row.referrer,
		metadata: row.metadata,
		createdAt: row.createdAt
	};
}

function daysForPeriod(period?: '7d' | '30d' | 'all') {
	if (period === '7d') return 7;
	if (period === 'all') return undefined;
	return 30;
}
