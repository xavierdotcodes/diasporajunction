// src/lib/server/stripe.js
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

let stripe;

export function getStripe() {
	if (!stripe) {
		const isDev = process.env.NODE_ENV !== 'production';

		const secretKey = isDev ? env.STRIPE_TEST_SECRET_KEY : env.STRIPE_SECRET_KEY;
		console.log('secretKey', secretKey);

		if (!secretKey) {
			throw new Error(`Missing Stripe secret key for ${isDev ? 'test' : 'live'} mode`);
		}

		console.log('🔑 Using Stripe key:', isDev ? 'TEST' : 'LIVE');

		stripe = new Stripe(secretKey, {
			apiVersion: '2024-06-20' // keep this pinned
		});
	}
	return stripe;
}
