import { json } from '@sveltejs/kit';
import { convexMutation } from '$lib/server/convex.js';
import { normalizeStripeEvent, stripeEventToConvexMutation, verifyStripeWebhook } from '$lib/payments/stripe.js';
import { webhookContextForConvex } from '$lib/server/auth.js';
import { withWebhookContext } from '$lib/server/convex.js';
import { INNGEST_EVENTS } from '$lib/inngest/events.js';
import { trySendInngestEvent } from '$lib/inngest/send.js';

export async function POST({ request }) {
	const signature = request.headers.get('stripe-signature');
	if (!signature) return json({ ok: false, error: 'Missing Stripe signature.' }, { status: 400 });

	let event;
	try {
		const body = await request.text();
		event = verifyStripeWebhook({ body, signature });
	} catch (error) {
		return json(
			{ ok: false, error: error instanceof Error ? error.message : 'Stripe webhook verification failed.' },
			{ status: 400 }
		);
	}

	const mutation = stripeEventToConvexMutation(event);
	if (!mutation) return json({ ok: true, ignored: true, type: event.type });

	const normalized = normalizeStripeEvent(event);
	if (!normalized.reference) {
		return json({ ok: false, error: 'Stripe event is missing payment reference metadata.' }, { status: 400 });
	}

	try {
		await convexMutation(mutation, withWebhookContext(normalized, webhookContextForConvex()));
		const eventName = inngestEventForStripeEvent(event.type);
		if (eventName) {
			await trySendInngestEvent(eventName, {
				reference: normalized.reference,
				applicationId: normalized.applicationId,
				listingId: normalized.listingId,
				provider: 'STRIPE',
				providerSessionId: normalized.providerSessionId,
				eventType: event.type
			});
		}
		return json({ ok: true, type: event.type });
	} catch (error) {
		return json(
			{ ok: false, error: error instanceof Error ? error.message : 'Webhook processing failed.' },
			{ status: 500 }
		);
	}
}

function inngestEventForStripeEvent(type) {
	if (['checkout.session.completed', 'payment_intent.succeeded'].includes(type)) return INNGEST_EVENTS.PAYMENT_SUCCEEDED;
	if (type === 'payment_intent.payment_failed') return INNGEST_EVENTS.PAYMENT_FAILED;
	if (type === 'checkout.session.expired') return INNGEST_EVENTS.PAYMENT_ABANDONED;
	return null;
}
