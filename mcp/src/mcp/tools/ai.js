import { validateRequired } from '../response.js';

export function aiTools({ mastra }) {
	return [
		aiTool('ai_search_directory', 'AI-assisted directory search suggestion.', mastra, {
			required: ['query'],
			properties: { query: { type: 'string' }, location: { type: 'string' } }
		}),
		aiTool('ai_rewrite_directory_search', 'Rewrite a natural language search into structured filters.', mastra, {
			required: ['query'],
			properties: { query: { type: 'string' } }
		}),
		aiTool('ai_summarize_application', 'Summarize an application as an admin-review suggestion.', mastra, {
			required: ['applicationId'],
			properties: { applicationId: { type: 'string' } }
		}),
		aiTool('ai_suggest_application_category', 'Suggest a directory category without changing the application.', mastra, {
			required: ['applicationId'],
			properties: { applicationId: { type: 'string' }, description: { type: 'string' } }
		}),
		aiTool('ai_admin_triage_summary', 'Generate an AI suggestion for what needs attention today.', mastra, {
			properties: {}
		}),
		aiTool(
			'ai_generate_listing_improvement_suggestions',
			'Generate listing profile improvement suggestions.',
			mastra,
			{ required: ['listingId'], properties: { listingId: { type: 'string' } } }
		),
		aiTool('ai_generate_lead_digest', 'Generate an AI lead digest suggestion for a listing.', mastra, {
			required: ['listingId'],
			properties: { listingId: { type: 'string' }, days: { type: 'number', minimum: 1, maximum: 365 } }
		})
	];
}

function aiTool(name, description, mastra, schema) {
	return {
		name,
		description,
		inputSchema: {
			type: 'object',
			additionalProperties: false,
			required: schema.required ?? [],
			properties: schema.properties ?? {}
		},
		handler: async (input = {}) => {
			validateRequired(input, schema.required ?? []);
			const result = await mastra.runAgent(name, input);
			return {
				...result,
				data: { ...(result.data ?? {}), suggestion: true },
				message: `${result.message} AI output is a suggestion and does not approve, reject, or change records.`
			};
		}
	};
}
