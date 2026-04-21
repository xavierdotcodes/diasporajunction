// src/routes/reservations/+page.server.js
import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/routes/(products)/tours/+page.server.js');

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	log.info({
		phase: 'tours_page_load_started',
		userId: locals.user?.id
	});

	try {
		const tours = await prisma.tour.findMany({
			orderBy: { startDate: 'asc' },
			select: {
				id: true,
				startDate: true,
				endDate: true,
				price: true
			}
		});

		log.info({
			phase: 'tours_page_load_completed',
			tourCount: tours.length
		});

		return { tours };
	} catch (error) {
		log.error({
			phase: 'tours_page_load_failed',
			error: serializeError(error)
		});
		return { tours: [] };
	}
}
