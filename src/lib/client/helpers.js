import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/client/helpers.js');

/**
 * Add a new tour
 */
export async function addTour(tourData) {
	try {
		const res = await fetch('/admin/tours/add', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(tourData)
		});

		if (res.status === 401) throw new Error('Unauthorized');

		const data = await res.json();
		console.log('created', data);
		if (!res.ok) throw new Error(data.message || 'Failed to add tour');
		return data;
	} catch (err) {
		console.error('addTour error:', err);
		throw err;
	}
}
/**
 * Delete a tour by ID
 */
export async function deleteTour(tourId) {
	try {
		const res = await fetch('/admin/tours/delete', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: tourId })
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.message || 'Failed to delete tour');
		return data;
	} catch (err) {
		console.error('deleteTour error:', err);
		throw err;
	}
}

/**
 * Edit a tour
 */
export async function editTour(tourId, tourData) {
	try {
		const res = await fetch('/api/admin/tours/edit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: tourId, ...tourData })
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.message || 'Failed to edit tour');
		return data;
	} catch (err) {
		console.error('editTour error:', err);
		throw err;
	}
}

/**
 * Subscribe a user
 */
export async function subscribe(email, name = '') {
	if (!email) throw new Error('Email is required');

	const res = await fetch('/api/subscribe', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, name })
	});

	let data;
	try {
		data = await res.json();
	} catch (err) {
		throw new Error('Invalid server response');
	}

	if (!res.ok) throw new Error(data.error || 'Failed to subscribe');

	return data.subscriber;
}

/**
 * Delete a subscriber
 */
export async function unsubscribe(id) {
	try {
		const res = await fetch('/admin/subscribers/unsubscribe', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});

		const data = await res.json();
		if (!res.ok) throw new Error(data.error || 'Failed to delete subscriber');
		return data;
	} catch (err) {
		console.error(err);
		throw err;
	}
}
