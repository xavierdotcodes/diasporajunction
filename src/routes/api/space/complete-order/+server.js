import { json } from '@sveltejs/kit';
import { getStripe } from '$lib/server/stripe';
import { prisma } from '$lib/server/prisma';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/api/space/complete-order/+server.js');

export async function POST({ request }) {
	try {
		const { customer, paymentIntentId } = await request.json();

		if (!customer || !paymentIntentId) {
			return json({ error: 'Missing customer or paymentIntentId' }, { status: 400 });
		}

		const stripe = getStripe();
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

		// --- Upsert user ---
		let user = await prisma.user.findUnique({ where: { email: customer.email } });
		if (!user) {
			user = await prisma.user.create({
				data: { name: customer.name, email: customer.email }
			});
		}

		// --- Create primary address ---
		await prisma.address.create({
			data: {
				userId: user.id,
				street: customer.street,
				apt: customer.apt || '',
				city: customer.city,
				state: customer.state,
				country: customer.country,
				zip: customer.zip,
				isPrimary: true
			}
		});

		// --- Create SpaceOrder ---
		const spaceOrder = await prisma.spaceOrder.create({
			data: {
				userId: user.id,
				notes: `Paid via Stripe PaymentIntent ${paymentIntent.id}`,
				payments: {
					create: {
						amount: paymentIntent.amount / 100,
						type: 'FULL',
						status: 'SUCCESS',
						stripePaymentIntentId: paymentIntent.id,
						stripeChargeId: paymentIntent.charges?.data?.[0]?.id || null
					}
				}
			},
			include: {
				payments: true
			}
		});

		return json(spaceOrder);
	} catch (err) {
		console.error('Error completing order:', err);
		return json({ error: 'Failed to complete order', details: err.message }, { status: 500 });
	}
}
