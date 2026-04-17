// src/routes/admin/tours/add/+server.js
import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import { parseDate, validateTourData } from '$lib/server/helpers.js';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/(ops)/admin/tours/add/+server.js');

export async function POST({ request, locals }) {
    // Ensure user is logged in and is admin
    if (!locals.user || !locals.user.roles?.some((r) => r.role === 'ADMIN')) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { price, errors, parsedStart, parsedEnd } = validateTourData(body);

    if (!parsedStart || !parsedEnd) {
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

        console.log('tour added on backend');
        return json({ success: true, tour });
    } catch (err) {
        console.error('Error saving tour:', err);
        return json({ error: 'Failed to save tour' }, { status: 500 });
    }
}
