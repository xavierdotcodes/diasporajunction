import { json } from '@sveltejs/kit';
import {
	EBOOK_ENTRY_PAGE,
	EBOOK_PRICE_CENTS,
	EBOOK_PRODUCT_DESCRIPTION,
	EBOOK_PRODUCT_NAME
} from '$lib/ebook/config';
import { getStripe } from '$lib/server/stripe';
import { ensureCommunityUserRecord } from '$lib/server/community/access';
import { captureLeadSignup } from '$lib/server/leads';
import { requestLogger, serializeError } from '$lib/utils/logger';

function normalizeEmail(email) {
	return email?.trim().toLowerCase();
}

export async function POST(event) {
	const log = requestLogger('api.ebook.checkout', event);

	try {
		const { email, firstName, source } = await event.request.json();
		const normalizedEmail = normalizeEmail(email);

		log.info({
			op: 'mutation',
			phase: 'start',
			emailDomain: normalizedEmail?.split('@')[1]
		});

		if (!normalizedEmail) {
			return json({ error: 'Email is required' }, { status: 400 });
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(normalizedEmail)) {
			return json({ error: 'Please enter a valid email address' }, { status: 400 });
		}

		const leadResult = await captureLeadSignup({
			email: normalizedEmail,
			firstName: firstName || null,
			source: source || 'ebook_checkout',
			entryPage: EBOOK_ENTRY_PAGE,
			leadMagnet: EBOOK_PRODUCT_NAME
		});

		if (!leadResult.ok) {
			return json({ error: leadResult.error }, { status: leadResult.status || 400 });
		}

		await ensureCommunityUserRecord({
			email: normalizedEmail,
			firstName: firstName || null
		});

		const stripe = getStripe();
		const origin = event.url.origin;

		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			customer_email: normalizedEmail,
			customer_creation: 'always',
			success_url: `${origin}/ebook?ebook_session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/ebook?checkout=canceled`,
			allow_promotion_codes: true,
			line_items: [
				{
					price_data: {
						currency: 'usd',
						unit_amount: EBOOK_PRICE_CENTS,
						product_data: {
							name: EBOOK_PRODUCT_NAME,
							description: EBOOK_PRODUCT_DESCRIPTION
						}
					},
					quantity: 1
				}
			],
			metadata: {
				kind: 'ebook_purchase',
				email: normalizedEmail,
				firstName: firstName || '',
				source: source || 'ebook_checkout'
			}
		});

		log.info({
			op: 'mutation',
			phase: 'success',
			emailDomain: normalizedEmail?.split('@')[1],
			sessionId: session.id
		});

		return json({
			success: true,
			sessionId: session.id,
			url: session.url
		});
	} catch (error) {
		log.error({
			op: 'mutation',
			phase: 'error',
			error: serializeError(error)
		});
		return json({ error: 'We could not start ebook checkout right now.' }, { status: 500 });
	}
}
