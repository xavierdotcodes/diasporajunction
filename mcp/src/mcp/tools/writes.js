import { fail, validateRequired } from '../response.js';

export function writeTools({ convex }) {
	return [
		writeTool('add_admin_note_to_application', 'Guarded: add an admin note to an application.', convex, {
			required: ['applicationId', 'note', 'confirm'],
			properties: {
				applicationId: { type: 'string' },
				note: { type: 'string' },
				confirm: { type: 'boolean' }
			},
			transform: (input) => ({ applicationId: input.applicationId, adminNotes: input.note })
		}),
		writeTool('mark_application_under_review', 'Guarded: mark an application under review.', convex, {
			required: ['applicationId', 'confirm'],
			properties: { applicationId: { type: 'string' }, confirm: { type: 'boolean' } },
			transform: (input) => ({ applicationId: input.applicationId })
		}),
		writeTool('request_application_resubmission', 'Guarded: request application resubmission with note.', convex, {
			required: ['applicationId', 'adminNotes', 'confirm'],
			properties: {
				applicationId: { type: 'string' },
				adminNotes: { type: 'string' },
				confirm: { type: 'boolean' }
			},
			transform: (input) => ({ applicationId: input.applicationId, adminNotes: input.adminNotes })
		}),
		writeTool('update_listing_featured_status', 'Guarded: update listing featured status.', convex, {
			required: ['listingId', 'isFeatured', 'confirm'],
			properties: { listingId: { type: 'string' }, isFeatured: { type: 'boolean' }, confirm: { type: 'boolean' } },
			transform: (input) => ({ listingId: input.listingId, isFeatured: input.isFeatured })
		}),
		writeTool('update_listing_active_status', 'Guarded: update listing active status.', convex, {
			required: ['listingId', 'isActive', 'confirm'],
			properties: { listingId: { type: 'string' }, isActive: { type: 'boolean' }, confirm: { type: 'boolean' } },
			transform: (input) => ({ listingId: input.listingId, isActive: input.isActive })
		})
	];
}

function writeTool(name, description, convex, schema) {
	return {
		name,
		description,
		write: true,
		inputSchema: {
			type: 'object',
			additionalProperties: false,
			required: schema.required,
			properties: schema.properties
		},
		handler: async (input = {}) => {
			validateRequired(input, schema.required.filter((field) => field !== 'confirm'));
			if (input.confirm !== true) {
				return fail('Write tool is disabled until explicit confirm=true is provided.', {
					data: { guarded: true, destructive: false }
				});
			}
			return await convex.mutationForTool(name, schema.transform ? schema.transform(input) : input);
		}
	};
}
