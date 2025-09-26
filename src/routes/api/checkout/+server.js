import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	version: '2024-06-20',
});

export const POST: RequestHandler = async ({ request }) => {
	const { paymentMethod } = await request.json(); 
	// paymentMethod: "card" | "crypto"

	const session = await stripe.checkout.sessions.create({
		payment_method_types: paymentMethod === 'crypto' ? ['us_bank_account'] : ['card'],
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: 'SPACE Mini Bluetooth Speaker',
					},
					unit_amount: 19900, // $65.00 in cents
				},
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: 'http://localhost:5173/success',
		cancel_url: 'http://localhost:5173/cancel',
	});

	return new Response(
		JSON.stringify({ id: session.id, url: session.url }),
		{ status: 200 }
	);
};
