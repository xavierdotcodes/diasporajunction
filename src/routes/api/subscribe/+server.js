// src/routes/admin/subscribers/toggle/+server.js
import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/api/subscribe/+server.js');

/**
 * POST /admin/subscribers/toggle
 * Body: { email: string, name?: string }
 * If user exists, sets subscribed = true
 * If user does not exist, creates them with subscribed = true
 */
export async function POST({ request }) {
    try {
        const { email, name } = await request.json();

        if (!email) {
            return json({ error: 'Email is required' }, { status: 400 });
        }

        // Try to find existing user
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Already exists — update subscribed
            user = await prisma.user.update({
                where: { email },
                data: { subscribed: true }
            });
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    name: name || null,
                    subscribed: true
                }
            });
        }

        return json({ success: true, user });
    } catch (err) {
        console.error('Failed to subscribe user:', err);
        return json({ error: 'Failed to subscribe user' }, { status: 500 });
    }
}
