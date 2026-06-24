import { describe, expect, it } from 'vitest';
import {
	applicationToListingDraft,
	assertApplicationCoreEditable,
	normalizeReferralCode,
	requireCustomCategoryWhenOther,
	validateApplicationInput
} from '../src/lib/directory/applicationRules.js';
import { categoryDisplayName } from '../src/lib/directory/constants.js';
import { summarizeInteractions } from '../src/lib/directory/interactions.js';
import { assertPaymentTransition, mapPaymentToApplicationStatus } from '../src/lib/directory/payments.js';
import { buildSearchFilters, listingMatchesFilters, sortFeaturedFirst } from '../src/lib/directory/search.js';

const baseApplication = {
	_id: 'app123',
	applicantUserId: 'user123',
	businessName: 'Relocation Desk',
	contactName: 'Ama Boateng',
	email: 'ama@example.com',
	phone: '+233000000000',
	category: 'LEGAL_IMMIGRATION',
	description: 'Relocation support for diaspora families.',
	city: 'Accra',
	region: 'Greater Accra',
	country: 'Ghana',
	serviceArea: 'Accra and remote support',
	targetAudience: 'DIASPORA'
};

describe('directory application rules', () => {
	it('formats category labels and uses custom OTHER labels', () => {
		expect(categoryDisplayName('LEGAL_IMMIGRATION')).toBe('Legal & Immigration');
		expect(categoryDisplayName('OTHER', 'Diaspora concierge')).toBe('Diaspora concierge');
	});

	it('requires a custom category when OTHER is selected', () => {
		expect(() => requireCustomCategoryWhenOther({ category: 'OTHER' })).toThrow(/Custom category/);
		expect(() =>
			validateApplicationInput({ ...baseApplication, category: 'OTHER', customCategory: 'Concierge' })
		).not.toThrow();
	});

	it('normalizes and validates referral codes', () => {
		expect(normalizeReferralCode(' dj-accra ')).toBe('DJ-ACCRA');
		expect(() => normalizeReferralCode('AB-ACC')).toThrow(/must start/);
	});

	it('locks core fields after payment/review starts', () => {
		expect(() => assertApplicationCoreEditable('PAYMENT_INITIATED', { businessName: 'Changed' })).toThrow(/locked/);
		expect(() => assertApplicationCoreEditable('PAID', { businessName: 'Changed' })).toThrow(/locked/);
		expect(() => assertApplicationCoreEditable('NEEDS_RESUBMISSION', { businessName: 'Changed' })).not.toThrow();
	});

	it('maps an accepted application into a listing draft', () => {
		const listing = applicationToListingDraft(baseApplication, 'relocation-desk');
		expect(listing.sourceApplicationId).toBe('app123');
		expect(listing.slug).toBe('relocation-desk');
		expect(listing.isActive).toBe(true);
	});
});

describe('payments, search, and interactions', () => {
	it('guards payment status transitions', () => {
		expect(() => assertPaymentTransition('PENDING', 'SUCCESS')).toThrow(/Cannot move/);
		expect(() => assertPaymentTransition('INITIATED', 'SUCCESS')).not.toThrow();
		expect(mapPaymentToApplicationStatus('SUCCESS')).toBe('PAID');
	});

	it('builds and applies deterministic search filters', () => {
		const filters = buildSearchFilters({
			query: 'relocate',
			location: 'Accra',
			category: 'LEGAL_IMMIGRATION',
			targetAudience: 'DIASPORA',
			verifiedOnly: true
		});
		const listing = {
			isActive: true,
			isFeatured: false,
			category: 'LEGAL_IMMIGRATION',
			verificationStatus: 'VERIFIED',
			targetAudience: 'BOTH',
			city: 'Accra',
			description: 'We help families relocate to Ghana.'
		};
		expect(listingMatchesFilters(listing, filters)).toBe(true);
	});

	it('sorts featured listings first', () => {
		const listings = [
			{ businessName: 'A', isFeatured: false, createdAt: 3 },
			{ businessName: 'B', isFeatured: true, createdAt: 1 }
		].sort(sortFeaturedFirst);
		expect(listings[0].businessName).toBe('B');
	});

	it('summarizes interaction counts', () => {
		expect(
			summarizeInteractions([
				{ type: 'VIEW' },
				{ type: 'VIEW' },
				{ type: 'LISTING_PROFILE_VIEWED' },
				{ type: 'WHATSAPP_CLICK' },
				{ type: 'PHONE_CLICK' }
			])
		).toMatchObject({ views: 2, profileViews: 1, whatsappClicks: 1, phoneClicks: 1 });
	});
});
