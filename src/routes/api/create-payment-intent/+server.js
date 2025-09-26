// src/routes/api/create-payment-intent/+server.js
import { json } from '@sveltejs/kit';
import { getStripe } from '$lib/server/stripe';

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
