import type { Id } from './_generated/dataModel';

export const now = () => Date.now();

export function normalizeReferralCode(code?: string, prefix = 'DJ') {
	if (!code?.trim()) return undefined;
	const normalized = code.trim().toUpperCase().replace(/\s+/g, '');
	if (!normalized.startsWith(prefix)) throw new Error(`Referral code must start with ${prefix}.`);
	if (!/^[A-Z0-9_-]{2,40}$/.test(normalized)) throw new Error('Invalid referral code.');
	return normalized;
}

export function requireCustomCategoryWhenOther(input: { category: string; customCategory?: string }) {
	if (input.category === 'OTHER' && !input.customCategory?.trim()) {
		throw new Error('Custom category is required when category is OTHER.');
	}
}

export function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 80);
}

export function publicListingFields(listing: any) {
	return listing?.isActive ? listing : null;
}

export type DirectoryListingId = Id<'directoryListings'>;
