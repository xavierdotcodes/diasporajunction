export function listingSeo(listing, baseUrl = 'https://diasporajunxion.com') {
	const title = `${listing.businessName} | DiasporaJunxion Directory`;
	const description =
		listing.shortDescription ||
		`${listing.businessName} is listed in ${listing.city || listing.region || 'Ghana'} on DiasporaJunxion.`;
	const canonical = `${baseUrl}/directory/${listing.slug}`;
	return {
		title,
		description,
		canonical,
		openGraphImage: listing.coverUrl || listing.logoUrl || `${baseUrl}/og/directory.png`,
		category: listing.customCategory || listing.category,
		location: [listing.city, listing.region, listing.country].filter(Boolean).join(', '),
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': listing.category === 'REAL_ESTATE' ? 'LocalBusiness' : 'Service',
			name: listing.businessName,
			description,
			url: canonical,
			areaServed: listing.serviceArea,
			address: {
				'@type': 'PostalAddress',
				addressLocality: listing.city,
				addressRegion: listing.region,
				addressCountry: listing.country
			}
		}
	};
}

export const guideTemplates = [
	{
		slug: 'trusted-help-ghana-diaspora-visitor',
		title: 'How to find trusted help in Ghana as a diaspora visitor'
	},
	{ slug: 'verified-relocation-support-ghana', title: 'Verified relocation support in Ghana' },
	{ slug: 'diaspora-friendly-services-accra', title: 'Diaspora-friendly services in Accra' },
	{ slug: 'reliable-driver-accra', title: 'How to find a reliable driver in Accra' },
	{ slug: 'trusted-housing-support-moving-to-ghana', title: 'Trusted housing support for people moving to Ghana' },
	{ slug: 'ghana-local-services-directory-diaspora', title: 'Ghana local services directory for diaspora visitors' }
];
