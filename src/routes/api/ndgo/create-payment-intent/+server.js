// src/routes/api/create-payment-intent/+server.js
import { json } from '@sveltejs/kit';
import { getStripe } from '$lib/server/stripe';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/api/ndgo/create-payment-intent/+server.js');

export async function POST({ request }) {
	try {
		const { amount, currency } = await request.json();
		const stripe = getStripe();

		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency
		});

		return json({ clientSecret: paymentIntent.client_secret });
	} catch (err) {
		console.error('Stripe error:', err);
		return json({ error: err.message }, { status: 500 });
	}
}
