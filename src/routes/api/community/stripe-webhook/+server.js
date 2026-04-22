import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import { getStripe } from '$lib/server/stripe';
import { syncCommunityAccessFromCheckoutSession } from '$lib/server/community/access';
import { syncEbookPurchaseFromCheckoutSession } from '$lib/server/ebook/purchase';
import { syncHousingListingSubmissionFromCheckoutSession } from '$lib/server/housing/payments';
import { scopedLogger, serializeError } from '$lib/utils/logger';

const log = scopedLogger('api.stripe.webhook');

function normalizeSecret(value) {
	if (typeof value !== 'string') return value;
	return value.trim().replace(/^['"]|['"]$/g, '');
}

function getWebhookSecret() {
	const isDev = process.env.NODE_ENV !== 'production';
	return normalizeSecret(
		isDev ? env.STRIPE_TEST_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET : env.STRIPE_WEBHOOK_SECRET
	);
}

export async function POST({ request }) {
	const signature = request.headers.get('stripe-signature');
	const webhookSecret = getWebhookSecret();

	if (!signature || !webhookSecret) {
		log.warn({
			op: 'guard',
			phase: 'error',
			hasSignature: Boolean(signature),
			hasWebhookSecret: Boolean(webhookSecret)
		});
		return json({ error: 'Webhook configuration missing' }, { status: 400 });
	}

	try {
		const stripe = getStripe();
		const payload = await request.text();
		const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

		log.info({
			op: 'receive',
			phase: 'start',
			eventType: event.type,
			eventId: event.id
		});

		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			const kind = session.metadata?.kind ?? 'unknown';
				const syncResult =
					kind === 'community_access'
						? await syncCommunityAccessFromCheckoutSession(session, 'community_checkout_webhook')
						: kind === 'housing_listing_submission'
							? await syncHousingListingSubmissionFromCheckoutSession(
									session,
									'housing_listing_checkout_webhook'
								)
						: kind === 'ebook_purchase'
						? await syncEbookPurchaseFromCheckoutSession(session, 'ebook_checkout_webhook')
						: { ok: false, reason: 'unsupported_kind' };

			log.info({
				op: 'process',
				phase: 'success',
				eventId: event.id,
				eventType: event.type,
				kind,
				ok: syncResult.ok,
				email: syncResult.email
			});
		}

		return json({ received: true });
	} catch (error) {
		log.error({
			op: 'process',
			phase: 'error',
			error: serializeError(error)
		});
		return json({ error: 'Webhook verification failed' }, { status: 400 });
	}
}
