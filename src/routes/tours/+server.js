import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

// GET /tours -> list all tours
export async function GET() {
	const tours = await prisma.product.findMany({
		where: { type: 'TOUR' },
		orderBy: { startDate: 'asc' },
		select: {
			id: true,
			name: true,
			location: true,
			price: true,
			currency: true,
			startDate: true,
			endDate: true,
			duration: true
		}
	});

	return json(tours);
}

// POST /tours -> create a new tour (admin only)
export async function POST({ request, locals }) {
	if (!locals.user || locals.user.role !== 'ADMIN') {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const body = await request.json();

	const tour = await prisma.product.create({
		data: {
			name: body.name,
			location: body.location,
			price: parseFloat(body.price),
			currency: body.currency || 'usd',
			type: 'TOUR',
			startDate: new Date(body.startDate),
			endDate: body.endDate ? new Date(body.endDate) : null,
			duration: body.duration ? parseInt(body.duration) : null
		}
	});

	return json(tour, { status: 201 });
}

// DELETE /tours/:id -> delete a tour (admin only)
export async function DELETE({ url, locals }) {
	if (!locals.user || locals.user.role !== 'ADMIN') {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}

	const id = parseInt(url.searchParams.get('id'));
	if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });

	await prisma.product.delete({
		where: { id }
	});

	return new Response(null, { status: 204 });
}
