import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	// Ensure admin
	if (!locals.user || !locals.user.roles.some((r) => r.role === 'ADMIN')) {
		throw redirect(302, '/login');
	}

	// Fetch Tours
	const tours = await prisma.tour.findMany({
		orderBy: { startDate: 'asc' }
	});

	// Fetch Orders
	const orders = await prisma.order.findMany({
		include: { user: true, payments: true },
		orderBy: { createdAt: 'asc' }
	});

	// Fetch Bookings
	const bookings = await prisma.booking.findMany({
		include: { user: true, tour: true, payments: true }
	});

	const registrations = await prisma.registration.findMany({
		include: { user: true, course: true, payments: true }
	});

	// Fetch all Users
	const users = await prisma.user.findMany({
		include: {
			registrations: true,
			bookings: true,
			orders: true
		},
		orderBy: { createdAt: 'desc' }
	});

	return {
		tours,
		orders,
		registrations,
		bookings,
		users
	};
}
