// src/routes/admin/tours/add/+server.js
import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { parseDate, validateTourData } from '$lib/server/helpers.js';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/routes/(ops)/admin/tours/add/+server.js');

export async function POST({ request, locals }) {
	if (!locals.user || !locals.user.roles?.some((r) => r.role === 'ADMIN')) {
		log.warn({ phase: 'tour_create_unauthorized' });
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const body = await request.json();
	const { price, parsedStart, parsedEnd } = validateTourData(body);

	log.info({
		phase: 'tour_create_started',
		adminUserId: locals.user.id,
		price
	});

	if (!parsedStart || !parsedEnd) {
		log.warn({ phase: 'tour_create_invalid_dates' });
		return json({ error: 'Invalid start or end date' }, { status: 400 });
	}

	try {
		const tour = await prisma.tour.create({
			data: {
				startDate: parsedStart,
				endDate: parsedEnd,
				price
			}
		});

		log.info({
			phase: 'tour_created',
			adminUserId: locals.user.id,
			tourId: tour.id
		});
		return json({ success: true, tour });
	} catch (error) {
		log.error({
			phase: 'tour_create_failed',
			adminUserId: locals.user.id,
			error: serializeError(error)
		});
		return json({ error: 'Failed to save tour' }, { status: 500 });
	}
}
