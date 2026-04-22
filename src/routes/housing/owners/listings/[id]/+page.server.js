import { fail, redirect } from '@sveltejs/kit';
import { requireOwnerListingAccess } from '$lib/server/housing/access';
import { createHousingListingCheckoutSession } from '$lib/server/housing/payments';
import { getOwnerHousingListing, getOwnerListingInput, saveOwnerHousingListing, validateOwnerListingInput } from '$lib/server/housing/listings';
import { loadHousingOwnerListingEditor } from '$lib/server/housing/page';
import { requestLogger, serializeError } from '$lib/utils/logger';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	return loadHousingOwnerListingEditor(event);
}

export const actions = {
	save: async (event) => {
		const log = requestLogger('housing.owner.editor.save', event);

		try {
			const listing = await getOwnerHousingListing(event.params.id);
			const viewer = await requireOwnerListingAccess(event, listing);
			const formData = await event.request.formData();
			const input = getOwnerListingInput(formData, viewer);

			await saveOwnerHousingListing(listing.id, input, viewer, {
				status:
					listing.status === 'PUBLISHED' || listing.status === 'ARCHIVED'
						? listing.status
						: 'DRAFT'
			});

			return {
				success: 'Draft saved.'
			};
		} catch (error) {
			log.error({
				op: 'save',
				phase: 'error',
				error: serializeError(error)
			});

			return fail(500, {
				error: 'We could not save your listing draft right now.'
			});
		}
	},
	payAndSubmit: async (event) => {
		const log = requestLogger('housing.owner.editor.pay_and_submit', event);

		try {
			const listing = await getOwnerHousingListing(event.params.id);
			const viewer = await requireOwnerListingAccess(event, listing);
			const formData = await event.request.formData();
			const input = getOwnerListingInput(formData, viewer);
			const validationError = validateOwnerListingInput(input, { forSubmission: true });

			if (validationError) {
				return fail(400, {
					error: validationError
				});
			}

			if (listing.status === 'PENDING_REVIEW' || listing.status === 'PUBLISHED') {
				return fail(400, {
					error: 'This listing has already been submitted and does not need another payment.'
				});
			}

			const savedListing = await saveOwnerHousingListing(listing.id, input, viewer, {
				status: 'DRAFT'
			});
			const session = await createHousingListingCheckoutSession({
				event,
				listing: savedListing,
				viewer
			});

			throw redirect(303, session.url);
		} catch (error) {
			log.error({
				op: 'pay_and_submit',
				phase: 'error',
				error: serializeError(error)
			});

			if (error?.status && error?.location) {
				throw error;
			}

			return fail(500, {
				error: 'We could not start checkout for your listing right now.'
			});
		}
	}
};
