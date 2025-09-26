// src/routes/api/create-payment-intent/+server.js
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST({ request }) {
	try {
		const { amount, currency } = await request.json();

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
