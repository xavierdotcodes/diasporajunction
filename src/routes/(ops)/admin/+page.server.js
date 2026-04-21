import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/routes/(ops)/admin/+page.server.js');

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

    // Fetch Orders (now SpaceOrder)
    const orders = await prisma.spaceOrder.findMany({
        include: { user: true, payments: true },
        orderBy: { createdAt: 'asc' }
    });

    // Fetch Bookings
    const bookings = await prisma.booking.findMany({
        include: { user: true, tour: true, payments: true }
    });

    // Fetch Registrations
    const registrations = await prisma.registration.findMany({
        include: { user: true, course: true, payments: true }
    });

    // Fetch all Users
    const users = await prisma.user.findMany({
        include: {
            registrations: true,
            bookings: true,
            spaceOrders: true, // updated from orders
            roles: true
        },
        orderBy: { createdAt: 'desc' }
    });

    const emails = users
        .map((user) => user.email?.trim().toLowerCase())
        .filter(Boolean);

    const grants = emails.length
        ? await prisma.communityAccessGrant.findMany({
            where: {
                email: {
                    in: emails
                }
            }
        })
        : [];

    const grantsByEmail = new Map(grants.map((grant) => [grant.email, grant]));
    const usersWithAccess = users.map((user) => {
        const grant = user.email ? grantsByEmail.get(user.email.trim().toLowerCase()) : null;
        return {
            ...user,
            communityAccessStatus: grant?.status ?? null,
            communityAccessGrantedAt: grant?.grantedAt ?? null
        };
    });

    return {
        tours,
        orders,
        registrations,
        bookings,
        users: usersWithAccess
    };
}
