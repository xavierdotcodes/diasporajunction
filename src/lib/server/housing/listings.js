import prisma from '$lib/server/prisma';
import { MAX_HOUSING_IMAGES } from '$lib/server/housing/config';
import { normalizeEmail } from '$lib/server/housing/access';
import { scopedLogger } from '$lib/utils/logger';

const log = scopedLogger('housing.listings');
export const DEFAULT_HOUSING_CONTACT_METHOD = 'DiasporaJunxion inquiry form';
export const DEFAULT_HOUSING_INQUIRY_DESTINATION = 'DiasporaJunxion internal follow-up';

function normalizeOptionalString(value) {
	if (typeof value !== 'string') return null;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}

function maybeInt(value) {
	if (value === '' || value === null || value === undefined) return null;
	const parsed = Number.parseInt(String(value), 10);
	return Number.isFinite(parsed) ? parsed : null;
}

function maybeBoolean(value) {
	return value === true || value === 'true' || value === 'on' || value === '1';
}

function slugify(value) {
	return String(value || '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80);
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
	const normalizedBase = baseSlug || `listing-${Date.now()}`;
	let slug = normalizedBase;
	let suffix = 2;

	while (true) {
		const existing = await prisma.housingListing.findUnique({
			where: { slug },
			select: { id: true }
		});

		if (!existing || existing.id === excludeId) {
			return slug;
		}

		slug = `${normalizedBase}-${suffix}`.slice(0, 90);
		suffix += 1;
	}
}

function includeListingRelations() {
	return {
		images: {
			orderBy: {
				sortOrder: 'asc'
			}
		},
		payments: {
			orderBy: {
				createdAt: 'desc'
			},
			take: 1
		}
	};
}

export function parseHousingFilters(searchParams) {
	return {
		location: searchParams.get('location')?.trim() || '',
		listingType: searchParams.get('listingType')?.trim() || '',
		stayType: searchParams.get('stayType')?.trim() || '',
		furnished: searchParams.get('furnished') === '1',
		familyFriendly: searchParams.get('familyFriendly') === '1',
		minPrice: maybeInt(searchParams.get('minPrice')),
		maxPrice: maybeInt(searchParams.get('maxPrice'))
	};
}

function buildPublishedWhere(filters = {}) {
	const where = {
		status: 'PUBLISHED'
	};

	if (filters.location) {
		where.OR = [
			{
				location: {
					contains: filters.location,
					mode: 'insensitive'
				}
			},
			{
				neighborhood: {
					contains: filters.location,
					mode: 'insensitive'
				}
			}
		];
	}

	if (filters.listingType) {
		where.listingType = filters.listingType;
	}

	if (filters.stayType) {
		where.stayType = filters.stayType;
	}

	if (filters.furnished) {
		where.furnished = true;
	}

	if (filters.familyFriendly) {
		where.familyFriendly = true;
	}

	if (filters.minPrice !== null || filters.maxPrice !== null) {
		where.priceAmount = {};

		if (filters.minPrice !== null) where.priceAmount.gte = filters.minPrice;
		if (filters.maxPrice !== null) where.priceAmount.lte = filters.maxPrice;
	}

	return where;
}

export function parseHousingImagePayload(imagePayload) {
	let parsed = [];

	try {
		parsed = JSON.parse(String(imagePayload || '[]'));
	} catch {
		parsed = [];
	}

	if (!Array.isArray(parsed)) {
		return [];
	}

	return parsed
		.map((image, index) => ({
			url: String(image?.url || '').trim(),
			storagePath: normalizeOptionalString(image?.storagePath),
			alt: normalizeOptionalString(image?.alt),
			sortOrder: maybeInt(image?.sortOrder) ?? index
		}))
		.filter((image) => image.url)
		.sort((a, b) => a.sortOrder - b.sortOrder)
		.slice(0, MAX_HOUSING_IMAGES)
		.map((image, index) => ({
			...image,
			sortOrder: index
		}));
}

export function validateOwnerListingInput(input, { forSubmission = false } = {}) {
	if (!input.title || !input.summary || !input.description || !input.location) {
		return 'Title, summary, description, and location are required.';
	}

	if (!['APARTMENT', 'HOUSE', 'DEVELOPMENT'].includes(input.listingType)) {
		return 'Choose a valid listing type.';
	}

	if (!['SHORT_STAY', 'LONG_STAY', 'FLEXIBLE'].includes(input.stayType)) {
		return 'Choose a valid stay type.';
	}

	if (forSubmission && input.images.length === 0) {
		return 'Add at least one image before submitting the listing.';
	}

	if (forSubmission && !String(input.priceAmount || '').trim()) {
		return 'Add the listing price before submitting.';
	}

	if (forSubmission && !String(input.pricePeriod || '').trim()) {
		return 'Add the listing price period before submitting.';
	}

	if (forSubmission && !String(input.ownerPhone || '').trim()) {
		return 'Add an owner phone or WhatsApp number before submitting.';
	}

	if (input.priceAmount && maybeInt(input.priceAmount) === null) {
		return 'Enter a valid whole-number listing price.';
	}

	if (input.bedrooms && maybeInt(input.bedrooms) === null) {
		return 'Enter a valid number of bedrooms.';
	}

	if (input.bathrooms && maybeInt(input.bathrooms) === null) {
		return 'Enter a valid number of bathrooms.';
	}

	if (input.images.length > MAX_HOUSING_IMAGES) {
		return `Add no more than ${MAX_HOUSING_IMAGES} images.`;
	}

	return null;
}

export function validateOwnerListingImages(input, { listingId, viewer } = {}) {
	if (!listingId || !viewer?.supabaseUserId) {
		return 'Listing image ownership could not be verified.';
	}

	const expectedPrefix = `${viewer.supabaseUserId}/${listingId}/`;
	const invalidImage = input.images.find(
		(image) => !image.storagePath || !image.storagePath.startsWith(expectedPrefix)
	);

	if (invalidImage) {
		return 'Upload listing images through this owner portal before submitting.';
	}

	return null;
}

export function getOwnerListingInput(formData, viewer) {
	return {
		title: String(formData.get('title') || '').trim(),
		slug: String(formData.get('slug') || '').trim(),
		summary: String(formData.get('summary') || '').trim(),
		description: String(formData.get('description') || '').trim(),
		listingType: String(formData.get('listingType') || '').trim(),
		stayType: String(formData.get('stayType') || '').trim(),
		priceAmount: String(formData.get('priceAmount') || '').trim(),
		currency: String(formData.get('currency') || '').trim() || 'USD',
		pricePeriod: String(formData.get('pricePeriod') || '').trim(),
		location: String(formData.get('location') || '').trim(),
		neighborhood: String(formData.get('neighborhood') || '').trim(),
		bedrooms: String(formData.get('bedrooms') || '').trim(),
		bathrooms: String(formData.get('bathrooms') || '').trim(),
		furnished: formData.get('furnished') === 'on',
		familyFriendly: formData.get('familyFriendly') === 'on',
		availabilityText: String(formData.get('availabilityText') || '').trim(),
		providerName: String(formData.get('providerName') || '').trim(),
		diasporaFriendlyNotes: String(formData.get('diasporaFriendlyNotes') || '').trim(),
		ownerName:
			String(formData.get('ownerName') || '').trim() || viewer.firstName || viewer.email || 'Property owner',
		ownerPhone: String(formData.get('ownerPhone') || '').trim(),
		images: parseHousingImagePayload(formData.get('imagesPayload'))
	};
}

function toListingMutationData(input, viewer, { status = 'DRAFT', preserveCheckoutSessionId = null } = {}) {
	return {
		ownerSupabaseUserId: viewer.supabaseUserId,
		ownerEmail: normalizeEmail(viewer.email),
		ownerName: input.ownerName || viewer.firstName || null,
		ownerPhone: normalizeOptionalString(input.ownerPhone),
		title: input.title,
		summary: input.summary,
		description: input.description,
		listingType: input.listingType,
		stayType: input.stayType,
		priceAmount: maybeInt(input.priceAmount),
		currency: normalizeOptionalString(input.currency) || 'USD',
		pricePeriod: normalizeOptionalString(input.pricePeriod),
		location: input.location,
		neighborhood: normalizeOptionalString(input.neighborhood),
		bedrooms: maybeInt(input.bedrooms),
		bathrooms: maybeInt(input.bathrooms),
		furnished: maybeBoolean(input.furnished),
		familyFriendly: maybeBoolean(input.familyFriendly),
		availabilityText: normalizeOptionalString(input.availabilityText),
		contactMethod: DEFAULT_HOUSING_CONTACT_METHOD,
		inquiryDestination: DEFAULT_HOUSING_INQUIRY_DESTINATION,
		providerName: normalizeOptionalString(input.providerName),
		diasporaFriendlyNotes: normalizeOptionalString(input.diasporaFriendlyNotes),
		status,
		stripeCheckoutSessionId: preserveCheckoutSessionId,
		updatedByEmail: normalizeEmail(viewer.email)
	};
}

export async function listHousingPreviews(limit = 4) {
	const listings = await prisma.housingListing.findMany({
		where: {
			status: 'PUBLISHED'
		},
		orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
		take: limit,
		include: includeListingRelations()
	});

	log.info({
		op: 'list_previews',
		phase: 'success',
		count: listings.length
	});

	return listings;
}

export async function listHousingListings(filters) {
	const listings = await prisma.housingListing.findMany({
		where: buildPublishedWhere(filters),
		orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
		include: includeListingRelations()
	});

	log.info({
		op: 'list_public',
		phase: 'success',
		count: listings.length
	});

	return listings;
}

export async function getHousingListingBySlug(slug) {
	return prisma.housingListing.findUnique({
		where: { slug },
		include: includeListingRelations()
	});
}

export async function listRelatedHousingListings(listing, limit = 3) {
	return prisma.housingListing.findMany({
		where: {
			status: 'PUBLISHED',
			id: { not: listing.id },
			OR: [
				{ location: listing.location },
				...(listing.neighborhood ? [{ neighborhood: listing.neighborhood }] : [])
			]
		},
		orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
		take: limit,
		include: includeListingRelations()
	});
}

export async function createOwnerDraft(viewer) {
	const timestamp = Date.now();
	const slug = await ensureUniqueSlug(`property-draft-${timestamp}`);

	return prisma.housingListing.create({
		data: {
			ownerSupabaseUserId: viewer.supabaseUserId,
			ownerEmail: normalizeEmail(viewer.email),
			ownerName: viewer.firstName,
			title: 'New property draft',
			slug,
			summary: 'Add a short summary for diaspora renters or returnees.',
			description: 'Describe the property, the setup, and why it may fit a diaspora renter or relocating family.',
			listingType: 'APARTMENT',
			stayType: 'LONG_STAY',
			location: 'Accra',
			currency: 'USD',
			pricePeriod: 'month',
			status: 'DRAFT',
			createdByEmail: normalizeEmail(viewer.email),
			updatedByEmail: normalizeEmail(viewer.email)
		}
	});
}

export async function listOwnerHousingListings(viewer) {
	return prisma.housingListing.findMany({
		where: {
			ownerSupabaseUserId: viewer.supabaseUserId
		},
		orderBy: [{ updatedAt: 'desc' }],
		include: {
			...includeListingRelations(),
			_count: {
				select: {
					inquiries: true
				}
			},
			inquiries: {
				orderBy: {
					createdAt: 'desc'
				},
				take: 5
			}
		}
	});
}

export async function getOwnerHousingListing(id) {
	return prisma.housingListing.findUnique({
		where: { id },
		include: {
			...includeListingRelations(),
			_count: {
				select: {
					inquiries: true
				}
			}
		}
	});
}

export async function saveOwnerHousingListing(id, input, viewer, { status } = {}) {
	const listing = await getOwnerHousingListing(id);

	if (!listing) {
		throw new Error('Housing listing not found');
	}

	if (
		!viewer.isOperator &&
		['PAYMENT_PENDING', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(listing.status)
	) {
		throw new Error('Submitted listings cannot be edited from the owner portal.');
	}

	const nextStatus = status ?? listing.status ?? 'DRAFT';
	const slug = await ensureUniqueSlug(slugify(input.slug || input.title), id);

	return prisma.housingListing.update({
		where: { id },
		data: {
			...toListingMutationData(input, viewer, {
				status: nextStatus,
				preserveCheckoutSessionId: listing.stripeCheckoutSessionId
			}),
			slug,
			images: {
				deleteMany: {},
				create: input.images
			}
		},
		include: includeListingRelations()
	});
}

export async function markListingPaymentPending(id, stripeCheckoutSessionId) {
	return prisma.housingListing.update({
		where: { id },
		data: {
			status: 'PAYMENT_PENDING',
			stripeCheckoutSessionId,
			submittedAt: null,
			paidAt: null
		}
	});
}

export async function markListingPaymentCanceled(id, stripeCheckoutSessionId) {
	const listing = await getHousingListingForCheckoutSession(id);

	if (!listing || listing.stripeCheckoutSessionId !== stripeCheckoutSessionId) {
		return null;
	}

	if (listing.status !== 'PAYMENT_PENDING') {
		return listing;
	}

	return prisma.housingListing.update({
		where: { id },
		data: {
			status: 'DRAFT',
			stripeCheckoutSessionId: null
		}
	});
}

export async function getHousingListingForCheckoutSession(id) {
	return prisma.housingListing.findUnique({
		where: { id },
		select: {
			id: true,
			status: true,
			stripeCheckoutSessionId: true,
			ownerSupabaseUserId: true,
			ownerEmail: true
		}
	});
}

export async function markListingSubmittedFromPayment({
	listingId,
	stripeCheckoutSessionId,
	paidAt,
	ownerSupabaseUserId,
	ownerEmail
}) {
	return prisma.housingListing.update({
		where: { id: listingId },
		data: {
			status: 'PENDING_REVIEW',
			stripeCheckoutSessionId,
			ownerSupabaseUserId,
			ownerEmail,
			submittedAt: paidAt,
			paidAt
		}
	});
}

export async function listAdminHousingListings() {
	return prisma.housingListing.findMany({
		orderBy: [{ updatedAt: 'desc' }],
		include: {
			...includeListingRelations(),
			_count: {
				select: {
					inquiries: true
				}
			}
		}
	});
}

export async function listAdminHousingInquiries() {
	return prisma.housingInquiry.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			listing: {
				select: {
					id: true,
					title: true,
					slug: true,
					location: true,
					ownerEmail: true
				}
			}
		}
	});
}

export async function updateHousingInquiryStatus(id, status) {
	if (!['NEW', 'REVIEWED', 'CLOSED'].includes(status)) {
		throw new Error('Choose a valid inquiry status.');
	}

	return prisma.housingInquiry.update({
		where: { id },
		data: {
			status
		}
	});
}

export async function updateHousingListingModeration(id, input, operatorEmail) {
	const existing = await prisma.housingListing.findUnique({
		where: { id },
		select: {
			id: true,
			publishedAt: true
		}
	});

	if (!existing) {
		throw new Error('Housing listing not found');
	}

	const nextStatus = input.status || 'DRAFT';

	return prisma.housingListing.update({
		where: { id },
		data: {
			featured: maybeBoolean(input.featured),
			status: nextStatus,
			moderationNotes: normalizeOptionalString(input.moderationNotes),
			publishedAt:
				nextStatus === 'PUBLISHED'
					? existing.publishedAt ?? new Date()
					: nextStatus === 'ARCHIVED'
						? null
						: existing.publishedAt,
			updatedByEmail: normalizeEmail(operatorEmail)
		}
	});
}
