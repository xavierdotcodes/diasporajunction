import { validateRequired } from '../response.js';

export function paymentTools({ convex, mastra }) {
	return [
		paymentListTool('list_recent_payments', 'List recent generic payment records.', convex),
		{
			name: 'get_payment_detail',
			description: 'Get payment detail by reference without exposing Stripe secrets.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				required: ['reference'],
				properties: { reference: { type: 'string' } }
			},
			handler: async (input) => {
				validateRequired(input, ['reference']);
				return await convex.queryForTool('get_payment_detail', input);
			}
		},
		paymentListTool('list_failed_payments', 'List failed payments.', convex),
		paymentListTool('list_abandoned_payments', 'List abandoned payments.', convex),
		{
			name: 'summarize_payment_issues',
			description: 'Generate an AI suggestion summarizing payment problems.',
			inputSchema: {
				type: 'object',
				additionalProperties: false,
				properties: { days: { type: 'number', minimum: 1, maximum: 90 } }
			},
			handler: async (input = {}) => await mastra.runAgent('summarize_payment_issues', input)
		}
	];
}

function paymentListTool(name, description, convex) {
	return {
		name,
		description,
		inputSchema: {
			type: 'object',
			additionalProperties: false,
			properties: { limit: { type: 'number', minimum: 1, maximum: 100 } }
		},
		handler: async (input = {}) => await convex.queryForTool(name, { limit: input.limit })
	};
}
