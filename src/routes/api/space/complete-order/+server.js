import { json } from '@sveltejs/kit';
import { getStripe } from '$lib/server/stripe';
import prisma from '$lib/server/prisma';
import { requestLogger, serializeError } from '$lib/utils/logger';

export async function POST({ request }) {
	const log = requestLogger('src/routes/api/space/complete-order/+server.js', {
		request,
		locals: {}
	});

	try {
		const { customer, paymentIntentId } = await request.json();

		log.info({
			phase: 'complete_order_started',
			paymentIntentId,
			emailDomain: customer?.email?.split('@')[1]
		});

		if (!customer || !paymentIntentId) {
			log.warn({ phase: 'complete_order_invalid_request' });
			return json({ error: 'Missing customer or paymentIntentId' }, { status: 400 });
		}

		const stripe = getStripe();
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

		let user = await prisma.user.findUnique({ where: { email: customer.email } });
		const userCreated = !user;
		if (!user) {
			user = await prisma.user.create({
				data: { name: customer.name, email: customer.email }
			});
		}

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

		log.info({
			phase: 'complete_order_completed',
			orderId: spaceOrder.id,
			userId: user.id,
			userCreated,
			paymentIntentId: paymentIntent.id
		});

		return json(spaceOrder);
	} catch (error) {
		log.error({
			phase: 'complete_order_failed',
			error: serializeError(error)
		});
		return json({ error: 'Failed to complete order', details: error.message }, { status: 500 });
	}
}
