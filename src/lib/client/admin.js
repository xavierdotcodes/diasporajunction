import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/lib/client/admin.js');

export async function addTour(tourData) {
	try {
		log.info({
			op: 'addTour',
			phase: 'start',
			startDate: tourData?.startDate,
			endDate: tourData?.endDate
		});

		const res = await fetch('/admin/tours/add', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(tourData)
		});

		if (res.status === 401) throw new Error('Unauthorized');

		const data = await res.json();
		if (!res.ok) throw new Error(data.message || 'Failed to add tour');

		log.info({
			op: 'addTour',
			phase: 'success',
			tourId: data?.tour?.id
		});

		return data;
	} catch (error) {
		log.error({
			op: 'addTour',
			phase: 'error',
			error: serializeError(error)
		});
		throw error;
	}
}

export async function deleteTour(tourId) {
	try {
		log.info({
			op: 'deleteTour',
			phase: 'start',
			tourId
		});

		const res = await fetch('/admin/tours/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: tourId })
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.message || 'Failed to delete tour');

		log.info({
			op: 'deleteTour',
			phase: 'success',
			tourId: data?.tour?.id ?? tourId
		});

		return data;
	} catch (error) {
		log.error({
			op: 'deleteTour',
			phase: 'error',
			tourId,
			error: serializeError(error)
		});
		throw error;
	}
}

export async function editTour(tourId, tourData) {
	try {
		log.info({
			op: 'editTour',
			phase: 'start',
			tourId
		});

		const res = await fetch('/api/admin/tours/edit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: tourId, ...tourData })
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.message || 'Failed to edit tour');

		log.info({
			op: 'editTour',
			phase: 'success',
			tourId: data?.tour?.id ?? tourId
		});

		return data;
	} catch (error) {
		log.error({
			op: 'editTour',
			phase: 'error',
			tourId,
			error: serializeError(error)
		});
		throw error;
	}
}

export async function unsubscribe(id) {
	try {
		log.info({
			op: 'unsubscribe',
			phase: 'start',
			userId: id
		});

		const res = await fetch('/admin/subscribers/unsubscribe', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to delete subscriber');

		log.info({
			op: 'unsubscribe',
			phase: 'success',
			userId: id
		});

		return data;
	} catch (error) {
		log.error({
			op: 'unsubscribe',
			phase: 'error',
			userId: id,
			error: serializeError(error)
		});
		throw error;
	}
}
