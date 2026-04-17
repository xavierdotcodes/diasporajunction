import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getStripe } from '$lib/server/stripe';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/api/space/cancel-payment-intent/+server.js');

export async function POST({ request }) {
	const { paymentIntentId } = await request.json();
	if (!paymentIntentId) return json({ error: 'Missing paymentIntentId' }, { status: 400 });

	const stripe = getStripe();
	try {
		const canceled = await stripe.paymentIntents.cancel(paymentIntentId);
		return json({ canceled });
	} catch (err) {
		return json({ error: err.message }, { status: 500 });
	}
}
