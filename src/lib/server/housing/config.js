import { env } from '$env/dynamic/public';

export const HOUSING_OWNER_LISTING_FEE_USD = 7;
export const HOUSING_OWNER_LISTING_FEE_CENTS = HOUSING_OWNER_LISTING_FEE_USD * 100;
export const HOUSING_OWNER_LISTING_PRODUCT_NAME = 'DiasporaJunxion Property Listing Submission';
export const HOUSING_OWNER_LISTING_PRODUCT_DESCRIPTION =
	'One-time fee to submit a Ghana property listing for diaspora-facing review and publication on DiasporaJunxion.';

export const HOUSING_STORAGE_BUCKET =
	env.PUBLIC_HOUSING_STORAGE_BUCKET || env.PUBLIC_SUPABASE_STORAGE_BUCKET || 'housing-listings';

export const MAX_HOUSING_IMAGES = 10;
