// src/routes/api/create-payment-intent/+server.js
import { json } from '@sveltejs/kit';
import { getStripe } from '$lib/server/stripe';
import { requestLogger, serializeError } from '$lib/utils/logger';

export async function POST({ request }) {
	const log = requestLogger('src/routes/api/ndgo/create-payment-intent/+server.js', {
		request,
		locals: {}
	});

	try {
		const { amount, currency } = await request.json();
		log.info({
			phase: 'payment_intent_create_started',
			amount,
			currency
		});
		const stripe = getStripe();

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency
		});

		log.info({
			phase: 'payment_intent_created',
			paymentIntentId: paymentIntent.id,
			amount,
			currency
		});

		return json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		log.error({
			phase: 'payment_intent_create_failed',
			error: serializeError(error)
		});
		return json({ error: error.message }, { status: 500 });
	}
}
