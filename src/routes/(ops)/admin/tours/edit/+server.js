import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/(ops)/admin/tours/edit/+server.js');

export async function POST({ request, locals }) {
    // Only allow admins
    if (!locals.user || locals.user.role !== 'ADMIN') {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { id, startDate, endDate, price } = await request.json();

        if (!id) {
            return new Response(JSON.stringify({ message: 'Tour ID is required' }), { status: 400 });
        }

        // Update the tour
        const updatedTour = await prisma.tour.update({
            where: { id: id },
            data: {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                price: price !== undefined ? parseFloat(price) : undefined
            }
        });

        return json({ success: true, tour: updatedTour });
    } catch (err) {
        console.error('Error editing tour:', err);
        return new Response(JSON.stringify({ message: 'Error editing tour' }), { status: 500 });
    }
}
