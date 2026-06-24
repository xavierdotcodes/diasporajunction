import { validateRequired } from '../response.js';

export function supportTools({ convex }) {
	return [
		activityTool('get_application_activity', 'Get activity events for one application.', convex, 'applicationId'),
		activityTool('get_listing_activity', 'Get activity events for one listing.', convex, 'listingId'),
		{
			name: 'get_recent_error_events',
			description: 'Get recent error activity events for debugging.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				properties: { limit: { type: 'number', minimum: 1, maximum: 100 } }
			},
			handler: async (input = {}) => await convex.queryForTool('get_recent_error_events', input)
		},
		{
			name: 'get_user_support_context',
			description: 'Get non-secret support context for a user.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				required: ['userId'],
				properties: { userId: { type: 'string' } }
			},
			handler: async (input) => {
				validateRequired(input, ['userId']);
				return await convex.queryForTool('get_user_support_context', input);
			}
		}
	];
}

function activityTool(name, description, convex, idField) {
	return {
		name,
		description,
		inputSchema: {
			type: 'object',
			additionalProperties: false,
			required: [idField],
			properties: { [idField]: { type: 'string' }, limit: { type: 'number', minimum: 1, maximum: 100 } }
		},
		handler: async (input) => {
			validateRequired(input, [idField]);
			return await convex.queryForTool(name, input);
		}
	};
}
