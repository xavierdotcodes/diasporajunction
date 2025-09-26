import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	// Redirect non-admins
	if (!locals.user || locals.user.role !== 'ADMIN') {
		throw redirect(302, '/login');
	}

	// Fetch tours
	const tours = await prisma.product.findMany({
		where: { type: 'TOUR' },
		orderBy: { startDate: 'asc' }
	});

	// Fetch SPACE orders
	const spaceOrders = await prisma.order.findMany({
		where: { product: { type: 'MINI_SPEAKER' } }, // adjust to your enum if needed
		include: { user: true, product: true }
	});

	// Fetch NDGO registrations
	const ndgoRegs = await prisma.order.findMany({
		where: { product: { type: 'NDGO_PROGRAM' } }, // adjust to your enum if needed
		include: { user: true, product: true }
	});

	// Return data directly to page as props
	return {
		tours,
		spaceOrders,
		ndgoRegs
	};
}
