import { validateRequired } from '../response.js';

export function listingTools({ convex }) {
	return [
		{
			name: 'search_directory_listings',
			description: 'Search public directory listings with safe filters.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				properties: {
					query: { type: 'string' },
					category: { type: 'string' },
					location: { type: 'string' },
					targetAudience: { type: 'string', enum: ['LOCAL', 'DIASPORA', 'BOTH'] },
					verifiedOnly: { type: 'boolean' },
					limit: { type: 'number', minimum: 1, maximum: 50 }
				}
			},
			handler: async (input = {}) => await convex.queryForTool('search_directory_listings', input)
		},
		{
			name: 'get_listing_detail',
			description: 'Get listing detail for admin/support use without private document paths.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				required: ['listingId'],
				properties: { listingId: { type: 'string' } }
			},
			handler: async (input) => {
				validateRequired(input, ['listingId']);
				return await convex.queryForTool('get_listing_detail', input);
			}
		},
		{
			name: 'get_listing_interaction_summary',
			description: 'Get interaction counts for a listing.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				required: ['listingId'],
				properties: { listingId: { type: 'string' }, days: { type: 'number', minimum: 1, maximum: 365 } }
			},
			handler: async (input) => {
				validateRequired(input, ['listingId']);
				return await convex.queryForTool('get_listing_interaction_summary', input);
			}
		},
		listTool('list_listings_missing_media', 'List active listings missing logo/cover/profile media.', convex),
		listTool('list_listings_missing_contact_info', 'List listings missing useful contact details.', convex),
		listTool('list_featured_listings', 'List featured listings.', convex),
		listTool('list_inactive_listings', 'List inactive listings.', convex)
	];
}

function listTool(name, description, convex) {
	return {
		name,
		description,
		inputSchema: {
			type: 'object',
			additionalProperties: false,
			properties: { limit: { type: 'number', minimum: 1, maximum: 100 } }
		},
		handler: async (input = {}) => await convex.queryForTool(name, input)
	};
}
