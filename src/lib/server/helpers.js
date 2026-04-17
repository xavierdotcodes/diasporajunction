import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/helpers.js');

/**
 * Safely parses a date string into a Date object.
 * Returns null if invalid.
 */
export function parseDate(dateStr) {
	const d = new Date(dateStr);
	if (isNaN(d)) return null;
	return d;
}
/**
 * Validate tour data before sending to Prisma
 * @param {Object} param0
 */
export function validateTourData({ startDate, endDate, price }) {
	const errors = [];

	const parsedStart = parseDate(startDate);
	const parsedEnd = parseDate(endDate);
	const parsedPrice = Number(price);

	if (!parsedStart) errors.push('Invalid start date');
	if (!parsedEnd) errors.push('Invalid end date');
	if (isNaN(parsedPrice)) errors.push('Invalid price');

	return {
		errors,
		parsedStart,
		parsedEnd,
		price: parsedPrice
	};
}
