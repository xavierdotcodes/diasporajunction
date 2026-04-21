// src/lib/server/stripe.js
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/lib/server/stripe.js');

let stripe;

export function getStripe() {
	if (!stripe) {
		const isDev = process.env.NODE_ENV !== 'production';

		const secretKey = isDev ? env.STRIPE_TEST_SECRET_KEY : env.STRIPE_SECRET_KEY;

		if (!secretKey) {
			throw new Error(`Missing Stripe secret key for ${isDev ? 'test' : 'live'} mode`);
		}

		log.info({
			phase: 'stripe_client_initializing',
			mode: isDev ? 'test' : 'live'
		});

		try {
			stripe = new Stripe(secretKey, {
				apiVersion: '2026-03-25.dahlia'
			});
		} catch (error) {
			log.error({
				phase: 'stripe_client_initialization_failed',
				mode: isDev ? 'test' : 'live',
				error: serializeError(error)
			});
			throw error;
		}
	}
	return stripe;
}
