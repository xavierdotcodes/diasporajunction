import { validateRequired } from '../response.js';

export function applicationTools({ convex, mastra }) {
	return [
		statusTool('list_pending_applications', 'List submitted or under-review applications.', convex, 'SUBMITTED'),
		statusTool(
			'list_paid_applications_waiting_review',
			'List paid applications waiting for admin review.',
			convex,
			'PAID'
		),
		statusTool(
			'list_applications_needing_resubmission',
			'List applications waiting on applicant resubmission.',
			convex,
			'NEEDS_RESUBMISSION'
		),
		{
			name: 'list_abandoned_payment_applications',
			description: 'List applications whose payment was abandoned.',
			inputSchema: basicLimitSchema(),
			handler: async (input = {}) =>
				await convex.queryForTool('list_abandoned_payment_applications', {
					...input,
					paymentStatus: 'ABANDONED'
				})
		},
		{
			name: 'get_application_detail',
			description: 'Get a single application without exposing private document URLs.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				required: ['applicationId'],
				properties: { applicationId: { type: 'string' } }
			},
			handler: async (input) => {
				validateRequired(input, ['applicationId']);
				return await convex.queryForTool('get_application_detail', input);
			}
		},
		{
			name: 'summarize_application_for_review',
			description: 'Return an AI suggestion summarizing an application for human admin review.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				required: ['applicationId'],
				properties: { applicationId: { type: 'string' } }
			},
			handler: async (input) => {
				validateRequired(input, ['applicationId']);
				return await mastra.runAgent('summarize_application_for_review', input);
			}
		}
	];
}

function statusTool(name, description, convex, status) {
	return {
		name,
		description,
		inputSchema: basicLimitSchema(),
		handler: async (input = {}) => await convex.queryForTool(name, { limit: input.limit })
	};
}

function basicLimitSchema() {
	return {
		type: 'object',
		additionalProperties: false,
		properties: { limit: { type: 'number', minimum: 1, maximum: 100 } }
	};
}
