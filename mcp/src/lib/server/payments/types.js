export const paymentProviders = ['STRIPE', 'PAYSTACK', 'MANUAL_MOMO', 'CASH'];

export const paymentPurposePriceEnv = {
	LISTING_APPLICATION_FEE: 'STRIPE_APPLICATION_FEE_PRICE_ID',
	VERIFICATION_FEE: 'STRIPE_VERIFICATION_FEE_PRICE_ID',
	FEATURED_LISTING: 'STRIPE_FEATURED_LISTING_PRICE_ID',
	SUBSCRIPTION: 'STRIPE_SUBSCRIPTION_PRICE_ID'
};

export function assertPaymentPurpose(purpose) {
	if (
		![
			'LISTING_APPLICATION_FEE',
			'VERIFICATION_FEE',
			'FEATURED_LISTING',
			'SUBSCRIPTION',
			'MANUAL_ADJUSTMENT'
		].includes(purpose)
	) {
		throw new Error('Unsupported payment purpose.');
	}
}
