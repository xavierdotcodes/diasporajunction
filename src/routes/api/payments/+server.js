import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

// Example: Stripe webhook handler
export async function POST({ request }) {
	try {
		const event = await request.json();

		const { orderId, userId, amount, currency, reference, provider, status } = event;

		// make sure required fields are present
		if (!orderId || !userId || !reference) {
			return json({ error: 'Missing fields' }, { status: 400 });
		}

		// Upsert: if a payment already exists for this order, update it.
		const payment = await prisma.payment.upsert({
			where: { orderId }, // orderId is unique now
			update: {
				amount,
				currency,
				status,
				provider
			},
			create: {
				orderId,
				userId,
				amount,
				currency,
				reference,
				provider,
				status
			}
		});

		return json({ success: true, payment });
	} catch (err) {
		console.error('Payment error:', err);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
