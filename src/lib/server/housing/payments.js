import prisma from '$lib/server/prisma';
import { HOUSING_OWNER_LISTING_FEE_CENTS, HOUSING_OWNER_LISTING_PRODUCT_DESCRIPTION, HOUSING_OWNER_LISTING_PRODUCT_NAME } from '$lib/server/housing/config';
import { markListingPaymentPending, markListingSubmittedFromPayment } from '$lib/server/housing/listings';
import { getStripe } from '$lib/server/stripe';
import { scopedLogger, serializeError } from '$lib/utils/logger';

const log = scopedLogger('housing.payments');

export async function createHousingListingCheckoutSession({ event, listing, viewer }) {
	const stripe = getStripe();
	const origin = event.url.origin;

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		customer_email: viewer.email,
		customer_creation: 'always',
		success_url: `${origin}/housing/owners/listings/${listing.id}?listing_checkout_session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/housing/owners/listings/${listing.id}?checkout=canceled`,
		allow_promotion_codes: true,
		line_items: [
			{
				price_data: {
					currency: 'usd',
					unit_amount: HOUSING_OWNER_LISTING_FEE_CENTS,
					product_data: {
						name: HOUSING_OWNER_LISTING_PRODUCT_NAME,
						description: HOUSING_OWNER_LISTING_PRODUCT_DESCRIPTION
					}
				},
				quantity: 1
			}
		],
		metadata: {
			kind: 'housing_listing_submission',
			listingId: listing.id,
			ownerSupabaseUserId: viewer.supabaseUserId || '',
			ownerEmail: viewer.email || '',
			title: listing.title
		}
	});

	await markListingPaymentPending(listing.id, session.id);

	log.info({
		op: 'create_checkout',
		phase: 'success',
		listingId: listing.id,
		sessionId: session.id
	});

	return session;
}

export async function syncHousingListingSubmissionFromCheckoutSession(
	session,
	source = 'housing_listing_checkout_return'
) {
	try {
		const metadata = session.metadata ?? {};
		const listingId = metadata.listingId;
		const ownerEmail = session.customer_details?.email || metadata.ownerEmail || null;

		if (
			session.payment_status !== 'paid' ||
			!listingId ||
			metadata.kind !== 'housing_listing_submission'
		) {
			return { ok: false, reason: 'not_eligible' };
		}

		const paidAt = new Date();

		const payment = await prisma.housingListingPayment.upsert({
			where: {
				stripeSessionId: session.id
			},
			update: {
				listingId,
				ownerSupabaseUserId: metadata.ownerSupabaseUserId || null,
				ownerEmail,
				status: 'PAID',
				amountTotal: session.amount_total ?? null,
				currency: session.currency ?? null,
				source,
				stripePaymentIntentId:
					typeof session.payment_intent === 'string' ? session.payment_intent : null,
				stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
				paidAt
			},
			create: {
				listingId,
				stripeSessionId: session.id,
				ownerSupabaseUserId: metadata.ownerSupabaseUserId || null,
				ownerEmail,
				status: 'PAID',
				amountTotal: session.amount_total ?? null,
				currency: session.currency ?? null,
				source,
				stripePaymentIntentId:
					typeof session.payment_intent === 'string' ? session.payment_intent : null,
				stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
				paidAt
			}
		});

		const listing = await markListingSubmittedFromPayment({
			listingId,
			stripeCheckoutSessionId: session.id,
			paidAt,
			ownerSupabaseUserId: metadata.ownerSupabaseUserId || null,
			ownerEmail
		});

		return {
			ok: true,
			payment,
			listing
		};
	} catch (error) {
		log.error({
			op: 'sync_checkout',
			phase: 'error',
			sessionId: session?.id,
			error: serializeError(error)
		});

		return {
			ok: false,
			reason: 'error',
			error
		};
	}
}
