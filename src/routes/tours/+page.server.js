// src/routes/reservations/+page.server.js
import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	try {
		// Optionally: check if user is logged in
		// if (!locals.user) throw redirect(302, '/login');

		const tours = await prisma.tour.findMany({
			orderBy: { startDate: 'asc' },
			select: {
				id: true,
				startDate: true,
				endDate: true,
				price: true
			}
		});

		return { tours };
	} catch (err) {
		console.error('Error loading tours:', err);
		return { tours: [] };
	}
}
