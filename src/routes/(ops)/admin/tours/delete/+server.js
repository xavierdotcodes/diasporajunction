import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/routes/(ops)/admin/tours/delete/+server.js');

export async function POST({ request, locals }) {
	if (!locals.user || !locals.user.roles?.some((role) => role.role === 'ADMIN')) {
		log.warn({ phase: 'tour_delete_unauthorized' });
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const { id } = await request.json();

		log.info({
			phase: 'tour_delete_started',
			adminUserId: locals.user.id,
			tourId: id
		});

		if (!id) {
			log.warn({ phase: 'tour_delete_invalid_request', reason: 'missing_id' });
			return new Response(JSON.stringify({ message: 'Tour ID is required' }), { status: 400 });
		}

		const deletedTour = await prisma.tour.delete({
			where: { id }
		});

		log.info({
			phase: 'tour_deleted',
			adminUserId: locals.user.id,
			tourId: deletedTour.id
		});
		return json({ success: true, tour: deletedTour });
	} catch (error) {
		log.error({
			phase: 'tour_delete_failed',
			adminUserId: locals.user?.id,
			error: serializeError(error)
		});
		return new Response(JSON.stringify({ message: 'Error deleting tour' }), { status: 500 });
	}
}
