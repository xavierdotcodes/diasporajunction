import { isCoreApplicationLocked, isValidCategory, isValidTargetAudience } from './constants.js';

const requiredApplicationFields = [
	'businessName',
	'contactName',
	'email',
	'phone',
	'category',
	'description',
	'city',
	'region',
	'country',
	'serviceArea',
	'targetAudience'
];

export function requireCustomCategoryWhenOther(input) {
	if (input.category === 'OTHER' && !String(input.customCategory ?? '').trim()) {
		throw new Error('Custom category is required when category is OTHER.');
	}
}

export function normalizeReferralCode(code, prefix = 'DJ') {
	if (!code || !String(code).trim()) return undefined;
	const normalized = String(code).trim().toUpperCase().replace(/\s+/g, '');
	if (!normalized.startsWith(prefix)) {
		throw new Error(`Referral code must start with ${prefix}.`);
	}
	if (!/^[A-Z0-9_-]{2,40}$/.test(normalized)) {
		throw new Error('Referral code can only contain letters, numbers, underscores, or hyphens.');
	}
	return normalized;
}

export function validateApplicationInput(input) {
	const missing = requiredApplicationFields.filter((field) => !String(input[field] ?? '').trim());
	if (missing.length > 0) {
		throw new Error(`Missing required application fields: ${missing.join(', ')}.`);
	}
	if (!isValidCategory(input.category)) throw new Error('Unsupported directory category.');
	if (!isValidTargetAudience(input.targetAudience)) throw new Error('Unsupported target audience.');
	requireCustomCategoryWhenOther(input);
	return true;
}

export function assertApplicationCoreEditable(currentStatus, nextPatch) {
	if (!isCoreApplicationLocked(currentStatus) || currentStatus === 'NEEDS_RESUBMISSION') return true;
	const lockedFields = [
		'businessName',
		'category',
		'customCategory',
		'description',
		'city',
		'region',
		'country',
		'serviceArea',
		'targetAudience'
	];
	const attempted = lockedFields.filter((field) => Object.hasOwn(nextPatch, field));
	if (attempted.length > 0) {
		throw new Error('Core application fields are locked after payment or review starts.');
	}
	return true;
}

export function applicationToListingDraft(application, slug) {
	return {
		ownerUserId: application.applicantUserId,
		sourceApplicationId: application._id,
		businessName: application.businessName,
		slug,
		category: application.category,
		customCategory: application.customCategory,
		description: application.description,
		shortDescription: application.shortDescription ?? '',
		phone: application.phone,
		whatsapp: application.whatsapp,
		email: application.email,
		website: application.website,
		city: application.city,
		region: application.region,
		country: application.country,
		serviceArea: application.serviceArea,
		targetAudience: application.targetAudience,
		verificationStatus: 'UNVERIFIED',
		isActive: true,
		isFeatured: false,
		referralCode: application.referralCode,
		createdAt: Date.now(),
		updatedAt: Date.now()
	};
}
