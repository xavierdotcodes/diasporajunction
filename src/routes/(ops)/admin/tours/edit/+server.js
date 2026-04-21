import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/routes/(ops)/admin/tours/edit/+server.js');

export async function POST({ request, locals }) {
	if (!locals.user || !locals.user.roles?.some((role) => role.role === 'ADMIN')) {
		log.warn({ phase: 'tour_edit_unauthorized' });
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const { id, startDate, endDate, price } = await request.json();

		log.info({
			phase: 'tour_edit_started',
			adminUserId: locals.user.id,
			tourId: id
		});

		if (!id) {
			log.warn({ phase: 'tour_edit_invalid_request', reason: 'missing_id' });
			return new Response(JSON.stringify({ message: 'Tour ID is required' }), { status: 400 });
		}

		const updatedTour = await prisma.tour.update({
			where: { id },
			data: {
				startDate: startDate ? new Date(startDate) : undefined,
				endDate: endDate ? new Date(endDate) : undefined,
				price: price !== undefined ? parseFloat(price) : undefined
			}
		});

		log.info({
			phase: 'tour_edited',
			adminUserId: locals.user.id,
			tourId: updatedTour.id
		});

		return json({ success: true, tour: updatedTour });
	} catch (error) {
		log.error({
			phase: 'tour_edit_failed',
			adminUserId: locals.user?.id,
			error: serializeError(error)
		});
		return new Response(JSON.stringify({ message: 'Error editing tour' }), { status: 500 });
	}
}
