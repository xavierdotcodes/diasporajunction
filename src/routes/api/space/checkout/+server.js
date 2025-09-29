// src/routes/api/space/checkout/+server.js
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export async function POST({ request }) {
	try {
		const { customer, paymentMethod, paymentDetails } = await request.json();

		if (!customer?.email || !customer?.name) {
			return json({ error: 'Missing required customer fields' }, { status: 400 });
		}

		// 1. Find or create user
		let user = await prisma.user.findUnique({
			where: { email: customer.email }
		});

		if (!user) {
			user = await prisma.user.create({
				data: {
					name: customer.name,
					email: customer.email
				}
			});
		}

		// 2. Create address
		const address = await prisma.address.create({
			data: {
				street: customer.street,
				apt: customer.apt,
				city: customer.city,
				state: customer.state,
				country: customer.country,
				zip: customer.zip,
				userId: user.id
			}
		});

		// 3. Create order
		const order = await prisma.order.create({
			data: {
				userId: user.id,
				addressId: address.id,
				paymentMethod,
				paymentDetails: paymentDetails ? JSON.stringify(paymentDetails) : null,
				status: 'PENDING'
			}
		});

		return json({ success: true, order });
	} catch (err) {
		console.error('Checkout error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
