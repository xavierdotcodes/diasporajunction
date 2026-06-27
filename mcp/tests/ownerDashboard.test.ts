import { describe, expect, it } from 'vitest';
import {
	calculateProfileCompleteness,
	canAccessListingDashboard,
	filterInteractionsByPeriod,
	sanitizeOwnerListingPatch
} from '../convex/ownerDashboard';
import {
	canManageOwnerListingMedia,
	isOwnerPublicMediaType,
	sanitizeOwnerMediaUpdate
} from '../convex/media';
import { buildFeaturedListingUpgradePatch } from '../convex/payments';
import { isFeaturedActive } from '../convex/listings';

describe('owner dashboard access rules', () => {
	const listing = { ownerUserId: 'owner1' };

	it('allows an owner to access their own listing dashboard', () => {
		expect(canAccessListingDashboard({ userId: 'owner1', role: 'LISTING_OWNER' }, listing)).toBe(true);
	});

	it('blocks an owner from another owner listing dashboard', () => {
		expect(canAccessListingDashboard({ userId: 'owner2', role: 'LISTING_OWNER' }, listing)).toBe(false);
	});

	it('allows admins to access any listing dashboard', () => {
		expect(canAccessListingDashboard({ role: 'ADMIN' }, listing)).toBe(true);
	});

	it('blocks public users and unowned listings', () => {
		expect(canAccessListingDashboard(undefined, listing)).toBe(false);
		expect(canAccessListingDashboard({ userId: 'owner1', role: 'LISTING_OWNER' }, {})).toBe(false);
	});
});

describe('owner listing edit sanitizer', () => {
	it('allows safe public fields only', () => {
		const patch = sanitizeOwnerListingPatch({
			description: 'Updated',
			shortDescription: 'Short',
			servicesOffered: ['Tours'],
			keywords: ['ghana'],
			phone: '+233',
			whatsapp: '+233',
			email: 'owner@example.test',
			website: 'https://example.test',
			serviceArea: 'Accra',
			languages: ['English'],
			priceRange: '$$',
			remoteAvailable: true,
			inPersonAvailable: true,
			whatsappAvailable: true
		});
		expect(Object.keys(patch).sort()).toEqual(
			[
				'description',
				'email',
				'inPersonAvailable',
				'keywords',
				'languages',
				'phone',
				'priceRange',
				'remoteAvailable',
				'serviceArea',
				'servicesOffered',
				'shortDescription',
				'website',
				'whatsapp',
				'whatsappAvailable'
			].sort()
		);
	});

	it('drops protected fields', () => {
		const patch = sanitizeOwnerListingPatch({
			verificationStatus: 'VERIFIED',
			verificationLevel: 'GOLD',
			trustSignals: ['Admin approved'],
			isFeatured: true,
			featuredUntil: 999,
			ownerUserId: 'owner2',
			sourceApplicationId: 'app1',
			adminNotes: 'private',
			paymentStatus: 'SUCCESS',
			plan: 'FEATURED',
			planStatus: 'ACTIVE',
			planExpiresAt: 999,
			lastUpgradeAt: 999,
			description: 'Allowed'
		});
		expect(patch).toEqual({ description: 'Allowed' });
	});
});

describe('listing plan and featured upgrade rules', () => {
	it('builds a webhook-only featured upgrade patch', () => {
		const now = Date.UTC(2026, 5, 25);
		const patch = buildFeaturedListingUpgradePatch(now);
		expect(patch).toMatchObject({
			plan: 'FEATURED',
			planStatus: 'ACTIVE',
			isFeatured: true,
			planStartedAt: now,
			updatedAt: now
		});
		expect(patch.featuredUntil).toBe(now + 30 * 24 * 60 * 60 * 1000);
		expect(patch.planExpiresAt).toBe(patch.featuredUntil);
	});

	it('does not treat expired featured listings as active', () => {
		const now = Date.UTC(2026, 5, 25);
		expect(isFeaturedActive({ isFeatured: true, featuredUntil: now + 1000 }, now)).toBe(true);
		expect(isFeaturedActive({ isFeatured: true, featuredUntil: now - 1000 }, now)).toBe(false);
		expect(isFeaturedActive({ isFeatured: false }, now)).toBe(false);
	});
});

describe('owner listing media rules', () => {
	const listing = { ownerUserId: 'owner1' };

	it('allows owners to manage their own listing media', () => {
		expect(canManageOwnerListingMedia({ userId: 'owner1', role: 'LISTING_OWNER' }, listing)).toBe(true);
	});

	it('blocks owners from another listing media', () => {
		expect(canManageOwnerListingMedia({ userId: 'owner2', role: 'LISTING_OWNER' }, listing)).toBe(false);
	});

	it('allows admins to manage any listing media', () => {
		expect(canManageOwnerListingMedia({ userId: 'admin1', role: 'ADMIN' }, listing)).toBe(true);
	});

	it('blocks public users from owner media functions', () => {
		expect(canManageOwnerListingMedia(undefined, listing)).toBe(false);
		expect(canManageOwnerListingMedia({ role: 'USER' }, listing)).toBe(false);
	});

	it('allows only public listing media types for owners', () => {
		expect(isOwnerPublicMediaType('LOGO')).toBe(true);
		expect(isOwnerPublicMediaType('COVER')).toBe(true);
		expect(isOwnerPublicMediaType('GALLERY')).toBe(true);
		expect(isOwnerPublicMediaType('PORTFOLIO')).toBe(true);
		expect(isOwnerPublicMediaType('BUSINESS_PROOF')).toBe(false);
		expect(isOwnerPublicMediaType('ID_FRONT')).toBe(false);
	});

	it('rejects verification document and proof-style types from owner updates', () => {
		expect(() => sanitizeOwnerMediaUpdate({ type: 'BUSINESS_PROOF' })).toThrow(/Only public listing media/);
		expect(() => sanitizeOwnerMediaUpdate({ type: 'ID_FRONT' })).toThrow(/Only public listing media/);
	});

	it('sanitizes media captions and sort order', () => {
		const result = sanitizeOwnerMediaUpdate({ type: 'GALLERY', caption: '  Team photo  ', sortOrder: '3' });
		expect(result).toEqual({ type: 'GALLERY', caption: 'Team photo', sortOrder: 3 });
	});
});

describe('profile completeness and analytics periods', () => {
	it('calculates a complete profile score', () => {
		const result = calculateProfileCompleteness(
			{
				logoFileId: 'logo',
				coverFileId: 'cover',
				shortDescription: 'Short',
				description: 'Full',
				servicesOffered: ['Driver'],
				city: 'Accra',
				serviceArea: 'Greater Accra',
				phone: '+233',
				targetAudience: 'DIASPORA',
				verificationStatus: 'VERIFIED',
				trustSignals: ['Verified business']
			},
			[
				{ type: 'GALLERY' },
				{ type: 'GALLERY' },
				{ type: 'PORTFOLIO' }
			]
		);
		expect(result.score).toBe(100);
		expect(result.missingItems).toEqual([]);
	});

	it('reports missing profile actions', () => {
		const result = calculateProfileCompleteness({ verificationStatus: 'UNVERIFIED' }, []);
		expect(result.score).toBeLessThan(50);
		expect(result.missingItems).toContain('has logo');
		expect(result.recommendedNextActions.length).toBeGreaterThan(0);
	});

	it('improves completeness when logo, cover, and gallery media exist', () => {
		const sparse = {
			shortDescription: 'Short',
			description: 'Full',
			servicesOffered: ['Driver'],
			city: 'Accra',
			phone: '+233',
			targetAudience: 'DIASPORA',
			verificationStatus: 'UNVERIFIED',
			trustSignals: []
		};
		const withoutMedia = calculateProfileCompleteness(sparse, []);
		const withMedia = calculateProfileCompleteness(sparse, [
			{ type: 'LOGO' },
			{ type: 'COVER' },
			{ type: 'GALLERY' },
			{ type: 'GALLERY' },
			{ type: 'PORTFOLIO' }
		]);
		expect(withMedia.score).toBeGreaterThan(withoutMedia.score);
		expect(withMedia.missingItems).not.toContain('has logo');
		expect(withMedia.missingItems).not.toContain('has cover image');
		expect(withMedia.missingItems).not.toContain('has at least 3 gallery or portfolio images');
	});

	it('filters interactions by 7 days, 30 days, and all time', () => {
		const now = Date.UTC(2026, 5, 24);
		const rows = [
			{ type: 'VIEW', createdAt: now - 3 * 24 * 60 * 60 * 1000 },
			{ type: 'PHONE_CLICK', createdAt: now - 20 * 24 * 60 * 60 * 1000 },
			{ type: 'EMAIL_CLICK', createdAt: now - 50 * 24 * 60 * 60 * 1000 }
		];
		expect(filterInteractionsByPeriod(rows, '7d', now)).toHaveLength(1);
		expect(filterInteractionsByPeriod(rows, '30d', now)).toHaveLength(2);
		expect(filterInteractionsByPeriod(rows, 'all', now)).toHaveLength(3);
	});
});
