import { describe, expect, it } from 'vitest';
import {
	calculateProfileCompleteness,
	canAccessListingDashboard,
	filterInteractionsByPeriod,
	sanitizeOwnerListingPatch
} from '../convex/ownerDashboard';

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
			description: 'Allowed'
		});
		expect(patch).toEqual({ description: 'Allowed' });
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
