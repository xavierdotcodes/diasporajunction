import { getHousingViewer } from '$lib/server/housing/access';
import { HOUSING_OWNER_LISTING_FEE_USD } from '$lib/server/housing/config';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	return {
		housingViewer: await getHousingViewer(locals, { op: 'owner_marketing' }),
		ownerListingFeeUsd: HOUSING_OWNER_LISTING_FEE_USD
	};
}
