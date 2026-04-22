import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const connectionString = (process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || '').replace(
	/^"|"$/g,
	''
);

if (!connectionString) {
	throw new Error('Missing DIRECT_DATABASE_URL or DATABASE_URL for Prisma seed.');
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString })
});
const ADMIN_EMAIL = 'x@xavier.codes';
const ADMIN_NAME = 'Xavier';
const ADMIN_PASSWORD = 'Fr33d0m36';

const sampleListings = [
	{
		title: 'Furnished 2-Bed Apartment Near East Legon',
		slug: 'furnished-2-bed-east-legon',
		summary:
			'A cleaner first option for diaspora visitors or returners who want a furnished Accra base without starting from listing chaos.',
		description:
			'This two-bedroom apartment is positioned for someone who wants a soft landing in Accra while sorting schools, neighborhood fit, commute, and day-to-day setup. The unit is furnished, in a familiar residential pocket, and works well for a solo returner, couple, or small family making an initial transition.',
		listingType: 'APARTMENT',
		stayType: 'LONG_STAY',
		priceAmount: 1800,
		currency: 'USD',
		pricePeriod: 'per month',
		location: 'Accra',
		neighborhood: 'East Legon',
		bedrooms: 2,
		bathrooms: 2,
		furnished: true,
		familyFriendly: true,
		availabilityText: 'Available within 2 weeks',
		contactMethod: 'DiasporaJunxion inquiry form',
		inquiryDestination: 'manual_follow_up',
		providerName: 'DiasporaJunxion Housing Desk',
		diasporaFriendlyNotes:
			'Good fit for people who need a first-month base while learning the city and narrowing down a longer-term neighborhood.',
		featured: true,
		status: 'PUBLISHED',
		publishedAt: new Date(),
		images: [
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
		]
	},
	{
		title: 'Family-Oriented 3-Bed House in Tema Community 25',
		slug: 'family-3-bed-house-tema-community-25',
		summary:
			'A quieter option for diaspora families prioritizing space, routine, and a steadier residential feel outside central Accra.',
		description:
			'This three-bedroom house is geared toward longer-stay diaspora families who care about day-to-day livability more than flashy presentation. It offers more space, a calmer rhythm, and a practical layout for parents balancing work, school decisions, and a gradual relocation process.',
		listingType: 'HOUSE',
		stayType: 'LONG_STAY',
		priceAmount: 2200,
		currency: 'USD',
		pricePeriod: 'per month',
		location: 'Tema',
		neighborhood: 'Community 25',
		bedrooms: 3,
		bathrooms: 3,
		furnished: false,
		familyFriendly: true,
		availabilityText: 'Move-in ready next month',
		contactMethod: 'DiasporaJunxion inquiry form',
		inquiryDestination: 'manual_follow_up',
		providerName: 'DiasporaJunxion Housing Desk',
		diasporaFriendlyNotes:
			'Useful for families who want more room and a less compressed daily environment while settling into Ghana.',
		featured: false,
		status: 'PUBLISHED',
		publishedAt: new Date(),
		images: [
			'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80'
		]
	}
];

async function upsertListing(listing) {
	await prisma.housingListing.upsert({
		where: {
			slug: listing.slug
		},
		update: {
			title: listing.title,
			summary: listing.summary,
			description: listing.description,
			listingType: listing.listingType,
			stayType: listing.stayType,
			priceAmount: listing.priceAmount,
			currency: listing.currency,
			pricePeriod: listing.pricePeriod,
			location: listing.location,
			neighborhood: listing.neighborhood,
			bedrooms: listing.bedrooms,
			bathrooms: listing.bathrooms,
			furnished: listing.furnished,
			familyFriendly: listing.familyFriendly,
			availabilityText: listing.availabilityText,
			contactMethod: listing.contactMethod,
			inquiryDestination: listing.inquiryDestination,
			providerName: listing.providerName,
			diasporaFriendlyNotes: listing.diasporaFriendlyNotes,
			featured: listing.featured,
			status: listing.status,
			publishedAt: listing.publishedAt,
			images: {
				deleteMany: {},
				create: listing.images.map((url, index) => ({
					url,
					sortOrder: index
				}))
			}
		},
		create: {
			title: listing.title,
			slug: listing.slug,
			summary: listing.summary,
			description: listing.description,
			listingType: listing.listingType,
			stayType: listing.stayType,
			priceAmount: listing.priceAmount,
			currency: listing.currency,
			pricePeriod: listing.pricePeriod,
			location: listing.location,
			neighborhood: listing.neighborhood,
			bedrooms: listing.bedrooms,
			bathrooms: listing.bathrooms,
			furnished: listing.furnished,
			familyFriendly: listing.familyFriendly,
			availabilityText: listing.availabilityText,
			contactMethod: listing.contactMethod,
			inquiryDestination: listing.inquiryDestination,
			providerName: listing.providerName,
			diasporaFriendlyNotes: listing.diasporaFriendlyNotes,
			featured: listing.featured,
			status: listing.status,
			publishedAt: listing.publishedAt,
			images: {
				create: listing.images.map((url, index) => ({
					url,
					sortOrder: index
				}))
			}
		}
	});
}

async function upsertAdminAccount() {
	const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

	await prisma.adminAccount.upsert({
		where: {
			email: ADMIN_EMAIL
		},
		update: {
			name: ADMIN_NAME,
			active: true,
			passwordHash
		},
		create: {
			email: ADMIN_EMAIL,
			name: ADMIN_NAME,
			active: true,
			passwordHash
		}
	});
}

async function main() {
	await upsertAdminAccount();

	for (const listing of sampleListings) {
		await upsertListing(listing);
	}

	console.log(`Seeded admin account ${ADMIN_EMAIL} and ${sampleListings.length} housing listings`);
}

main()
	.catch((error) => {
		console.error('Housing seed failed', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
