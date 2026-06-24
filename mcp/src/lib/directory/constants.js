export const directoryCategories = [
	'FOOD_CATERING',
	'ACCOMMODATION',
	'TRANSPORT',
	'REAL_ESTATE',
	'LEGAL_IMMIGRATION',
	'FINANCE_MONEY',
	'HEALTH_WELLNESS',
	'EDUCATION',
	'EVENTS_ENTERTAINMENT',
	'TOURISM_TRAVEL',
	'CREATIVE_MEDIA',
	'BEAUTY_FASHION',
	'HOME_SERVICES',
	'BUSINESS_SERVICES',
	'TECH_DIGITAL',
	'COMMUNITY_ORGANIZATION',
	'OTHER'
];

export const targetAudiences = ['LOCAL', 'DIASPORA', 'BOTH'];

export const applicationStatuses = [
	'DRAFT',
	'SUBMITTED',
	'AWAITING_PAYMENT',
	'PAYMENT_INITIATED',
	'PAID',
	'UNDER_REVIEW',
	'NEEDS_RESUBMISSION',
	'REJECTED',
	'ACCEPTED',
	'CONVERTED'
];

export const paymentStatuses = [
	'NOT_REQUIRED',
	'PENDING',
	'INITIATED',
	'PAID',
	'FAILED',
	'ABANDONED',
	'REFUNDED'
];

export const contactInteractionTypes = [
	'WHATSAPP_CLICK',
	'PHONE_CLICK',
	'EMAIL_CLICK',
	'WEBSITE_CLICK'
];

const categoryLabels = {
	FOOD_CATERING: 'Food & Catering',
	ACCOMMODATION: 'Accommodation',
	TRANSPORT: 'Transport',
	REAL_ESTATE: 'Real Estate',
	LEGAL_IMMIGRATION: 'Legal & Immigration',
	FINANCE_MONEY: 'Finance & Money',
	HEALTH_WELLNESS: 'Health & Wellness',
	EDUCATION: 'Education',
	EVENTS_ENTERTAINMENT: 'Events & Entertainment',
	TOURISM_TRAVEL: 'Tourism & Travel',
	CREATIVE_MEDIA: 'Creative Media',
	BEAUTY_FASHION: 'Beauty & Fashion',
	HOME_SERVICES: 'Home Services',
	BUSINESS_SERVICES: 'Business Services',
	TECH_DIGITAL: 'Tech & Digital',
	COMMUNITY_ORGANIZATION: 'Community Organization',
	OTHER: 'Other'
};

export function categoryDisplayName(category, customCategory = '') {
	if (category === 'OTHER' && customCategory?.trim()) return customCategory.trim();
	return categoryLabels[category] ?? category;
}

export function statusDisplayName(status) {
	return String(status ?? '')
		.toLowerCase()
		.split('_')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

export function isCoreApplicationLocked(status) {
	return ['PAYMENT_INITIATED', 'PAID', 'UNDER_REVIEW', 'ACCEPTED', 'CONVERTED'].includes(status);
}

export function isValidTargetAudience(value) {
	return targetAudiences.includes(value);
}

export function isValidCategory(value) {
	return directoryCategories.includes(value);
}
