import { mutation } from './_generated/server';

export const seedDirectoryFixtures = mutation({
	args: {},
	handler: async (ctx) => {
		const timestamp = Date.now();
		const userId = await ctx.db.insert('users', {
			name: 'Demo Admin',
			email: 'demo-admin@example.test',
			role: 'ADMIN',
			isDeleted: false,
			createdAt: timestamp,
			updatedAt: timestamp
		});
		const relocationListingId = await ctx.db.insert('directoryListings', {
			ownerUserId: userId,
			businessName: 'Accra Relocation Desk',
			slug: 'accra-relocation-desk',
			category: 'BUSINESS_SERVICES',
			description: 'Relocation support for diaspora visitors and families settling in Accra.',
			shortDescription: 'Diaspora-friendly relocation support in Accra.',
			servicesOffered: ['settling-in support', 'local orientation', 'document checklist'],
			keywords: ['relocation', 'diaspora', 'accra'],
			phone: '+233000000001',
			whatsapp: '+233000000001',
			email: 'hello@example.test',
			city: 'Accra',
			region: 'Greater Accra',
			country: 'Ghana',
			serviceArea: 'Accra and remote support',
			targetAudience: 'DIASPORA',
			languages: ['English'],
			remoteAvailable: true,
			inPersonAvailable: true,
			whatsappAvailable: true,
			trustSignals: ['demo verified profile'],
			verificationStatus: 'VERIFIED',
			verificationLevel: 'BASIC',
			lastVerifiedAt: timestamp,
			isActive: true,
			isFeatured: true,
			createdAt: timestamp,
			updatedAt: timestamp
		});
		await ctx.db.insert('listingInteractions', {
			listingId: relocationListingId,
			type: 'WHATSAPP_CLICK',
			metadata: { fixture: true },
			createdAt: timestamp
		});
		await ctx.db.insert('payments', {
			userId,
			listingId: relocationListingId,
			purpose: 'FEATURED_LISTING',
			provider: 'STRIPE',
			amount: 10000,
			currency: 'USD',
			status: 'SUCCESS',
			reference: `fixture-${timestamp}`,
			createdAt: timestamp,
			updatedAt: timestamp
		});
		await ctx.db.insert('activityEvents', {
			actorUserId: userId,
			listingId: relocationListingId,
			eventType: 'fixture.directory_seeded',
			metadata: { fixture: true },
			createdAt: timestamp
		});
		return { userId, relocationListingId };
	}
});
