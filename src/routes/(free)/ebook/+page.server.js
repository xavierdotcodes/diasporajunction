import prisma from '$lib/server/prisma';
import { getStripe } from '$lib/server/stripe';
import { EBOOK_COOKIE_NAME } from '$lib/ebook/config';
import { syncEbookPurchaseFromCheckoutSession } from '$lib/server/ebook/purchase';
import { requestLogger, serializeError } from '$lib/utils/logger';

function normalizeEmail(email) {
	return email?.trim().toLowerCase() ?? null;
}

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const { locals, url, cookies } = event;
	const log = requestLogger('free.ebook.page.server', event);
	const signedInEmail = normalizeEmail(locals.user?.email);
	const cookieEmail = normalizeEmail(cookies.get(EBOOK_COOKIE_NAME));
	const checkoutSessionId = url.searchParams.get('ebook_session_id');
	const checkoutCanceled = url.searchParams.get('checkout') === 'canceled';

	let checkoutResult = null;
	let sessionEmail = null;

	log.info({
		op: 'load',
		phase: 'start',
		hasCheckoutSession: Boolean(checkoutSessionId),
		signedIn: Boolean(locals.user)
	});

	if (checkoutSessionId) {
		try {
			const stripe = getStripe();
			const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
			const syncResult = await syncEbookPurchaseFromCheckoutSession(session, 'ebook_checkout_return');

			if (syncResult.ok) {
				sessionEmail = syncResult.email;
				cookies.set(EBOOK_COOKIE_NAME, syncResult.email, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					maxAge: 60 * 60 * 24 * 30,
					secure: process.env.NODE_ENV === 'production'
				});

				checkoutResult = {
					status: 'success',
					email: syncResult.email
				};

				log.info({
					op: 'checkout',
					phase: 'success',
					emailDomain: syncResult.email?.split('@')[1],
					sessionId: session.id
				});
			}
		} catch (error) {
			log.error({
				op: 'checkout',
				phase: 'error',
				sessionId: checkoutSessionId,
				error: serializeError(error)
			});
			checkoutResult = { status: 'error' };
		}
	} else if (checkoutCanceled) {
		checkoutResult = { status: 'canceled' };
	}

	const purchaserEmail = sessionEmail ?? signedInEmail ?? cookieEmail;
	const lead =
		purchaserEmail
			? await prisma.lead.findUnique({
					where: { email: purchaserEmail }
				})
			: null;

	const hasPurchase =
		Boolean(lead?.ebookPurchasedAt) ||
		(checkoutResult?.status === 'success' && checkoutResult.email === purchaserEmail);

	log.info({
		op: 'load',
		phase: 'success',
		hasPurchase,
		emailDomain: purchaserEmail?.split('@')[1]
	});

	return {
		ebookViewer: {
			email: purchaserEmail,
			hasPurchase,
			purchaseDate: lead?.ebookPurchasedAt?.toISOString() ?? null
		},
		checkoutResult
	};
}
