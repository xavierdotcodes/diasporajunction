import { error, redirect } from '@sveltejs/kit';
import { HOUSING_OWNER_LISTING_FEE_USD } from '$lib/server/housing/config';
import { getHousingViewer, requireHousingIdentity, requireOwnerListingAccess } from '$lib/server/housing/access';
import {
	getHousingListingBySlug,
	getOwnerHousingListing,
	listHousingListings,
	listHousingPreviews,
	listOwnerHousingListings,
	listRelatedHousingListings,
	markListingPaymentCanceled,
	parseHousingFilters
} from '$lib/server/housing/listings';
import { syncHousingListingSubmissionFromCheckoutSession } from '$lib/server/housing/payments';
import { getStripe } from '$lib/server/stripe';
import { requestLogger, serializeError } from '$lib/utils/logger';

export async function loadHousingLanding(event) {
	const log = requestLogger('housing.landing.page', event);
	const housingViewer = await getHousingViewer(event.locals, { op: 'landing' });
	let previewListings = [];

	try {
		previewListings = await listHousingPreviews(4);
	} catch (previewError) {
		log.error({
			op: 'load_preview_listings',
			phase: 'error',
			error: serializeError(previewError)
		});
	}

	return {
		housingViewer,
		previewListings,
		ownerListingFeeUsd: HOUSING_OWNER_LISTING_FEE_USD
	};
}

export async function loadHousingListingsPage(event) {
	const log = requestLogger('housing.listings.page', event);
	const filters = parseHousingFilters(event.url.searchParams);
	const housingViewer = await getHousingViewer(event.locals, { op: 'listings' });
	let listings = [];

	try {
		listings = await listHousingListings(filters);
	} catch (listingsError) {
		log.error({
			op: 'load_listings',
			phase: 'error',
			error: serializeError(listingsError)
		});
	}

	return {
		housingViewer,
		listings,
		filters
	};
}

export async function loadHousingListingPage(event) {
	const [housingViewer, listing] = await Promise.all([
		getHousingViewer(event.locals, { op: 'detail' }),
		getHousingListingBySlug(event.params.slug)
	]);

	if (!listing || listing.status !== 'PUBLISHED') {
		throw error(404, 'Housing listing not found');
	}

	const relatedListings = await listRelatedHousingListings(listing, 3);

	return {
		housingViewer,
		listing,
		relatedListings
	};
}

export async function loadHousingOwnerDashboard(event) {
	const log = requestLogger('housing.owner.dashboard.page', event);
	const viewer = await requireHousingIdentity(event);

	if (viewer.isOperator && !viewer.signedIn) {
		throw redirect(303, '/admin/housing');
	}

	let listings = [];

	try {
		listings = await listOwnerHousingListings(viewer);
	} catch (listingsError) {
		log.error({
			op: 'load_owner_listings',
			phase: 'error',
			supabaseUserId: viewer.supabaseUserId,
			error: serializeError(listingsError)
		});
	}

	return {
		housingViewer: viewer,
		listings,
		ownerListingFeeUsd: HOUSING_OWNER_LISTING_FEE_USD
	};
}

export async function loadHousingOwnerListingEditor(event) {
	const log = requestLogger('housing.owner.editor.page', event);
	const viewer = await requireHousingIdentity(event);
	let listing = await getOwnerHousingListing(event.params.id);
	await requireOwnerListingAccess(event, listing);

	const checkoutSessionId = event.url.searchParams.get('listing_checkout_session_id');
	const checkoutCanceled = event.url.searchParams.get('checkout') === 'canceled';
	let checkoutResult = null;

	if (checkoutSessionId) {
		try {
			const stripe = getStripe();
			const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
			const sessionMatchesListing =
				session.id === listing.stripeCheckoutSessionId &&
				session.metadata?.listingId === listing.id &&
				session.metadata?.kind === 'housing_listing_submission';
			const syncResult = sessionMatchesListing
				? await syncHousingListingSubmissionFromCheckoutSession(
						session,
						'housing_listing_checkout_return'
					)
				: { ok: false, reason: 'session_mismatch' };

			checkoutResult = syncResult.ok
				? { status: 'success' }
				: { status: 'error' };

			if (syncResult.ok) {
				listing = await getOwnerHousingListing(event.params.id);
			}
		} catch (checkoutError) {
			log.error({
				op: 'checkout_return',
				phase: 'error',
				sessionId: checkoutSessionId,
				error: serializeError(checkoutError)
			});

			checkoutResult = { status: 'error' };
		}
	} else if (checkoutCanceled) {
		if (listing.stripeCheckoutSessionId) {
			await markListingPaymentCanceled(listing.id, listing.stripeCheckoutSessionId);
			listing = await getOwnerHousingListing(event.params.id);
		}

		checkoutResult = { status: 'canceled' };
	}

	return {
		housingViewer: viewer,
		listing,
		checkoutResult,
		ownerListingFeeUsd: HOUSING_OWNER_LISTING_FEE_USD
	};
}
