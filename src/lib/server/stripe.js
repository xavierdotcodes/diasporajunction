// src/lib/server/stripe.js
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

let stripe;

export function getStripe() {
	if (!stripe) {
		if (!env.STRIPE_SECRET_KEY) {
			throw new Error('Missing STRIPE_SECRET_KEY in environment');
		}
		stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: '2024-06-20' // keep Stripe API version pinned
		});
	}
	return stripe;
}
