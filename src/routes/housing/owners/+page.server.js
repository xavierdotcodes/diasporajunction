import { redirect } from '@sveltejs/kit';
import { requireHousingIdentity } from '$lib/server/housing/access';
import { createOwnerDraft } from '$lib/server/housing/listings';
import { loadHousingOwnerDashboard } from '$lib/server/housing/page';
import { requestLogger, serializeError } from '$lib/utils/logger';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	return loadHousingOwnerDashboard(event);
}

export const actions = {
	createDraft: async (event) => {
		const log = requestLogger('housing.owner.dashboard.create_draft', event);

		try {
			const viewer = await requireHousingIdentity(event);
			const listing = await createOwnerDraft(viewer);

			log.info({
				op: 'create_draft',
				phase: 'success',
				listingId: listing.id,
				supabaseUserId: viewer.supabaseUserId
			});

			throw redirect(303, `/housing/owners/listings/${listing.id}`);
		} catch (error) {
			log.error({
				op: 'create_draft',
				phase: 'error',
				error: serializeError(error)
			});
			throw error;
		}
	}
};
