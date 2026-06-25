import { fail, redirect } from '@sveltejs/kit';
import { requireOwnerListingAccess } from '$lib/server/housing/access';
import { createHousingListingCheckoutSession } from '$lib/server/housing/payments';
import {
	getOwnerHousingListing,
	getOwnerListingInput,
	saveOwnerHousingListing,
	validateOwnerListingImages,
	validateOwnerListingInput
} from '$lib/server/housing/listings';
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

			if (
				!viewer.isOperator &&
				['PAYMENT_PENDING', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(listing.status)
			) {
				return fail(400, {
					error:
						'This listing has moved past draft editing. Contact support if you need to change it.'
				});
			}

			await saveOwnerHousingListing(listing.id, input, viewer, {
				status: 'DRAFT'
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
			const imageValidationError =
				validationError || validateOwnerListingImages(input, { listingId: listing.id, viewer });

			if (imageValidationError) {
				return fail(400, {
					error: imageValidationError
				});
			}

			if (['PAYMENT_PENDING', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(listing.status)) {
				return fail(400, {
					error:
						listing.status === 'PAYMENT_PENDING'
							? 'Checkout has already been started for this listing. Finish or contact support before starting a new payment.'
							: 'This listing has already been submitted and does not need another payment.'
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
