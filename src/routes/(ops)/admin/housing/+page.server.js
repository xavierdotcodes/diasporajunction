import { fail, redirect } from '@sveltejs/kit';
import { getHousingOperatorEmail, isHousingOperator } from '$lib/server/housing/access';
import {
	listAdminHousingInquiries,
	listAdminHousingListings,
	updateHousingInquiryStatus,
	updateHousingListingModeration
} from '$lib/server/housing/listings';
import { requestLogger, serializeError } from '$lib/utils/logger';

function getValue(formData, key) {
	return String(formData.get(key) || '').trim();
}

function getCheckbox(formData, key) {
	return formData.get(key) === 'on';
}

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	if (!isHousingOperator(event.locals)) {
		throw redirect(302, `/admin/login?next=${encodeURIComponent(event.url.pathname)}`);
	}

	const [listings, inquiries] = await Promise.all([
		listAdminHousingListings(),
		listAdminHousingInquiries()
	]);

	return {
		listings,
		inquiries
	};
}

export const actions = {
	updateInquiry: async (event) => {
		const log = requestLogger('admin.housing.update_inquiry', event);

		try {
			if (!isHousingOperator(event.locals)) {
				return fail(401, { error: 'Unauthorized.' });
			}

			const formData = await event.request.formData();
			const id = getValue(formData, 'id');
			const status = getValue(formData, 'status') || 'NEW';

			if (!id) {
				return fail(400, { error: 'Missing inquiry id.' });
			}

			if (!['NEW', 'REVIEWED', 'CLOSED'].includes(status)) {
				return fail(400, { error: 'Choose a valid inquiry status.' });
			}

			await updateHousingInquiryStatus(id, status);

			return { success: 'Housing inquiry updated.' };
		} catch (actionError) {
			log.error({
				op: 'update_inquiry',
				phase: 'error',
				error: serializeError(actionError)
			});

			return fail(500, { error: 'Could not update the housing inquiry.' });
		}
	},
	moderate: async (event) => {
		const log = requestLogger('admin.housing.moderate', event);

		try {
			if (!isHousingOperator(event.locals)) {
				return fail(401, { error: 'Unauthorized.' });
			}

			const formData = await event.request.formData();
			const id = getValue(formData, 'id');
			const status = getValue(formData, 'status') || 'DRAFT';
			const moderationNotes = getValue(formData, 'moderationNotes');
			const featured = getCheckbox(formData, 'featured');

			if (!id) {
				return fail(400, { error: 'Missing listing id.' });
			}

			if (
				!['DRAFT', 'PENDING', 'PAYMENT_PENDING', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(
					status
				)
			) {
				return fail(400, { error: 'Choose a valid listing status.' });
			}

			await updateHousingListingModeration(
				id,
				{
					status,
					featured,
					moderationNotes
				},
				getHousingOperatorEmail(event.locals)
			);

			return { success: 'Housing listing updated.' };
		} catch (actionError) {
			log.error({
				op: 'moderate',
				phase: 'error',
				error: serializeError(actionError)
			});

			return fail(500, { error: 'Could not update the housing listing.' });
		}
	}
};
