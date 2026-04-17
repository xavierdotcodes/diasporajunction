import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/(ops)/admin/tours/delete/+server.js');

export async function POST({ request, locals }) {
    // Only allow admins
    if (!locals.user || locals.user.role !== 'ADMIN') {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { id } = await request.json();

        if (!id) {
            return new Response(JSON.stringify({ message: 'Tour ID is required' }), { status: 400 });
        }

        // Delete the tour
        const deletedTour = await prisma.tour.delete({
            where: { id }
        });

        console.log('delete success');
        return json({ success: true, tour: deletedTour });
    } catch (err) {
        console.error('Error deleting tour:', err);
        return new Response(JSON.stringify({ message: 'Error deleting tour' }), { status: 500 });
    }
}
