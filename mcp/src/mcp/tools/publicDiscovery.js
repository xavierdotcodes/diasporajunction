import { buildDiscoveryFilters, publicDiscoveryDescription } from '../discovery.js';
import { validateRequired } from '../response.js';

export function publicDiscoveryTools({ convex, mastra }) {
	return [
		discoveryTool('find_diaspora_friendly_services', publicDiscoveryDescription('diaspora-friendly relocation, housing, transport, errands, events, and business support'), convex, mastra),
		discoveryTool('search_verified_services', publicDiscoveryDescription('verified services only'), convex, mastra, {
			force: { verifiedOnly: true }
		}),
		discoveryTool('recommend_services_for_need', publicDiscoveryDescription('matching a natural-language need to service options'), convex, mastra),
		profileTool('get_listing_profile', 'Get one active public listing profile by listingId. Does not return admin/private fields.', convex),
		discoveryTool('compare_service_options', publicDiscoveryDescription('comparing active public service options for a user need'), convex, mastra),
		contactTool(convex),
		discoveryTool('find_relocation_support', publicDiscoveryDescription('relocation and getting-settled help'), convex, mastra, {
			intent: 'RELOCATION'
		}),
		discoveryTool('find_housing_support', publicDiscoveryDescription('housing support near Accra, East Legon, or elsewhere in Ghana'), convex, mastra, {
			intent: 'HOUSING'
		}),
		discoveryTool('find_transport_help', publicDiscoveryDescription('drivers, airport pickup, and transport help'), convex, mastra, {
			intent: 'TRANSPORT'
		}),
		discoveryTool('find_event_services', publicDiscoveryDescription('event vendors and event support services'), convex, mastra, {
			intent: 'EVENT_VENDOR'
		}),
		discoveryTool('find_local_errand_help', publicDiscoveryDescription('reliable local errands and on-the-ground help'), convex, mastra, {
			intent: 'LOCAL_ERRANDS'
		}),
		discoveryTool('find_legal_or_immigration_help', publicDiscoveryDescription('legal or immigration support'), convex, mastra, {
			intent: 'LEGAL_IMMIGRATION'
		})
	];
}

function discoveryTool(name, description, convex, mastra, options = {}) {
	return {
		name,
		description,
		public: true,
		inputSchema: discoverySchema(),
		handler: async (input = {}) => {
			const fallbackFilters = buildDiscoveryFilters({ ...input, ...options.force }, options.intent);
			let aiRewrite;
			let aiInterpretation;
			if (input.query || input.need) {
				const aiResult = await mastra.runAgent('ai_rewrite_directory_search', {
					query: input.query ?? input.need,
					location: input.location ?? input.city,
					targetAudience: input.targetAudience,
					biasIntent: options.intent
				});
				if (aiResult.ok && aiResult.data) {
					aiInterpretation = publicAiInterpretation(aiResult.data);
					aiRewrite = filtersFromAi(aiResult.data);
				}
			}
			const filters = { ...fallbackFilters, ...(aiRewrite ?? {}) };
			const result = await convex.queryForTool('public_search_directory', filters);
			return {
				...result,
				data: {
					intent: filters.intent,
					filters,
					aiRewriteUsed: Boolean(aiRewrite),
					aiInterpretation,
					results: result.ok ? asArray(result.data).map(sanitizePublicListing) : []
				},
				message: result.ok
					? 'Public directory discovery results.'
					: `${result.message} AI rewrite is optional; deterministic filters were used.`
			};
		}
	};
}

function filtersFromAi(ai = {}) {
	return {
		category: ai.category,
		location: ai.location,
		targetAudience: ai.targetAudience,
		keywords: ai.serviceKeywords,
		remoteAvailable: ai.remoteOrInPerson === 'REMOTE' ? true : undefined,
		inPersonAvailable: ai.remoteOrInPerson === 'IN_PERSON' ? true : undefined
	};
}

function publicAiInterpretation(ai = {}) {
	return {
		intent: ai.intent,
		category: ai.category,
		location: ai.location,
		targetAudience: ai.targetAudience,
		serviceKeywords: ai.serviceKeywords ?? [],
		urgency: ai.urgency,
		remoteOrInPerson: ai.remoteOrInPerson,
		explanation: ai.explanation
	};
}

function profileTool(name, description, convex) {
	return {
		name,
		description,
		public: true,
		inputSchema: {
			type: 'object',
			additionalProperties: false,
			required: ['listingId'],
			properties: { listingId: { type: 'string' } }
		},
		handler: async (input) => {
			validateRequired(input, ['listingId']);
			const result = await convex.queryForTool('public_get_listing_profile', input);
			return { ...result, data: result.ok ? sanitizePublicListing(result.data) : result.data };
		}
	};
}

function contactTool(convex) {
	return {
		name: 'get_contact_options_for_listing',
		description: 'Get public contact options for an active listing. Does not expose private applicant or admin data.',
		public: true,
		inputSchema: {
			type: 'object',
			additionalProperties: false,
			required: ['listingId'],
			properties: { listingId: { type: 'string' } }
		},
		handler: async (input) => {
			validateRequired(input, ['listingId']);
			const result = await convex.queryForTool('public_get_listing_profile', input);
			return {
				...result,
				data: result.ok
					? {
							listingId: input.listingId,
							businessName: result.data?.businessName,
							profileUrl: result.data?.profileUrl,
							contactOptions: sanitizePublicListing(result.data)?.contactOptions
						}
					: result.data
			};
		}
	};
}

function asArray(value) {
	return Array.isArray(value) ? value : [];
}

function sanitizePublicListing(listing = {}) {
	return {
		id: listing.id ?? listing._id,
		businessName: listing.businessName,
		slug: listing.slug,
		category: listing.category,
		customCategory: listing.customCategory,
		description: listing.description,
		shortDescription: listing.shortDescription,
		servicesOffered: listing.servicesOffered ?? [],
		keywords: listing.keywords ?? [],
		city: listing.city,
		region: listing.region,
		country: listing.country,
		serviceArea: listing.serviceArea,
		targetAudience: listing.targetAudience,
		languages: listing.languages ?? [],
		priceRange: listing.priceRange,
		remoteAvailable: listing.remoteAvailable,
		inPersonAvailable: listing.inPersonAvailable,
		whatsappAvailable: listing.whatsappAvailable,
		trustSignals: listing.trustSignals ?? [],
		lastVerifiedAt: listing.lastVerifiedAt,
		verificationLevel: listing.verificationLevel,
		verificationStatus: listing.verificationStatus,
		isFeatured: listing.isFeatured,
		featuredUntil: listing.featuredUntil,
		contactOptions: listing.contactOptions,
		profileUrl: listing.profileUrl,
		media: (listing.media ?? []).map(sanitizePublicMedia),
		logoUrl: listing.logoUrl,
		coverUrl: listing.coverUrl,
		gallery: listing.gallery ?? []
	};
}

function sanitizePublicMedia(item = {}) {
	return {
		type: item.type,
		caption: item.caption,
		sortOrder: item.sortOrder,
		url: item.url,
		createdAt: item.createdAt
	};
}

function discoverySchema() {
	return {
		type: 'object',
		additionalProperties: false,
		properties: {
			query: { type: 'string' },
			need: { type: 'string' },
			location: { type: 'string' },
			city: { type: 'string' },
			category: { type: 'string' },
			keywords: { type: 'array', items: { type: 'string' } },
			targetAudience: { type: 'string', enum: ['LOCAL', 'DIASPORA', 'BOTH'] },
			verifiedOnly: { type: 'boolean' },
			requireVerified: { type: 'boolean' },
			remoteAvailable: { type: 'boolean' },
			inPersonAvailable: { type: 'boolean' },
			limit: { type: 'number', minimum: 1, maximum: 20 }
		}
	};
}
