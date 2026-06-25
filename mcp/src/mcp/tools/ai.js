// @ts-nocheck
import { fail, validateRequired } from '../response.js';

export function aiTools({ config, convex, mastra }) {
	return [
		aiTool('ai_search_directory', 'AI-assisted directory search suggestion.', { convex, mastra, config }, {
			required: ['query'],
			properties: { query: { type: 'string' }, location: { type: 'string' } },
			public: true
		}),
		aiTool('ai_rewrite_directory_search', 'Rewrite a natural language search into structured filters.', { convex, mastra, config }, {
			required: ['query'],
			properties: { query: { type: 'string' }, location: { type: 'string' } },
			public: true
		}),
		aiTool('ai_summarize_application', 'Summarize an application as an admin-review suggestion.', { convex, mastra, config }, {
			required: ['applicationId'],
			properties: { applicationId: { type: 'string' } }
		}),
		aiTool('ai_suggest_application_category', 'Suggest a directory category without changing the application.', { convex, mastra, config }, {
			required: ['applicationId'],
			properties: { applicationId: { type: 'string' }, description: { type: 'string' } }
		}),
		aiTool('ai_admin_triage_summary', 'Generate an AI suggestion for what needs attention today.', { convex, mastra, config }, {
			properties: {}
		}),
		aiTool(
			'ai_generate_listing_improvement_suggestions',
			'Generate listing profile improvement suggestions.',
			{ convex, mastra, config },
			{ required: ['listingId'], properties: { listingId: { type: 'string' } } }
		),
		aiTool('ai_generate_lead_digest', 'Generate an AI lead digest suggestion for a listing.', { convex, mastra, config }, {
			required: ['listingId'],
			properties: { listingId: { type: 'string' }, days: { type: 'number', minimum: 1, maximum: 365 } }
		})
	];
}

function aiTool(name, description, context, schema) {
	return {
		name,
		description,
		public: Boolean(schema.public),
		inputSchema: {
			type: 'object',
			additionalProperties: false,
			required: schema.required ?? [],
			properties: schema.properties ?? {}
		},
		handler: async (input = {}) => {
			validateRequired(input, schema.required ?? []);
			const hasAdminAuth = context.config?.requestAuth?.role === 'ADMIN' || Boolean(context.config?.appAdminToken);
			if (!schema.public && !hasAdminAuth) {
				return fail('Admin authorization is required for private AI tools.', {
					missingConfig: ['DIASPORAJUNXION_ADMIN_TOKEN']
				});
			}
			const agentInput = await buildAgentInput(name, input, context);
			if (agentInput?.ok === false) return agentInput;
			const result = await context.mastra.runAgent(name, agentInput);
			if (name === 'ai_search_directory') {
				const search = await context.convex.queryForTool('public_search_directory', filtersFromRewrite(input, result.data));
				return {
					...search,
					data: {
						aiInterpretation: sanitizeAiOutput(result.data),
						results: search.ok ? search.data : [],
						suggestion: true
					},
					missingConfig: result.missingConfig ?? search.missingConfig ?? [],
					message: `${search.message ?? result.message ?? 'Public AI directory search completed.'} AI output is a suggestion and public results only.`
				};
			}
			return {
				...result,
				data: { ...sanitizeAiOutput(result.data ?? {}), suggestion: true },
				message: `${result.message ?? 'AI suggestion generated.'} AI output is a suggestion and does not approve, reject, mark payments, or change records.`
			};
		}
	};
}

function sanitizeAiOutput(value) {
	if (Array.isArray(value)) return value.map(sanitizeAiOutput);
	if (!value || typeof value !== 'object') return value;
	const blocked = /documentUrl|storageId|providerMetadata|verificationDocuments|private/i;
	return Object.fromEntries(
		Object.entries(value)
			.filter(([key]) => !blocked.test(key))
			.map(([key, item]) => [key, sanitizeAiOutput(item)])
	);
}

async function buildAgentInput(name, input, { convex }) {
	if (name === 'ai_summarize_application' || name === 'ai_suggest_application_category') {
		const [application, documents] = await Promise.all([
			convex.queryForTool('get_application_detail', { applicationId: input.applicationId }),
			convex.queryForTool('get_application_verification_documents', { applicationId: input.applicationId })
		]);
		if (!application.ok) return application;
		if (!documents.ok) return documents;
		return {
			...application.data,
			applicationId: input.applicationId,
			documentStatusSummary: summarizeDocumentStatuses(documents.data)
		};
	}
	if (name === 'ai_admin_triage_summary') {
		const [needsAttention, recentActivity, paymentSummary] = await Promise.all([
			convex.queryForTool('get_needs_attention', {}),
			convex.queryForTool('get_recent_activity', { limit: 20 }),
			convex.queryForTool('get_payment_summary', {})
		]);
		const failed = [needsAttention, recentActivity, paymentSummary].find((result) => !result.ok);
		if (failed) return failed;
		return {
			needsAttentionSummary: needsAttention.data,
			recentActivitySummary: recentActivity.data,
			paymentSummary: paymentSummary.data
		};
	}
	if (name === 'ai_generate_listing_improvement_suggestions' || name === 'ai_generate_lead_digest') {
		const [listing, interactions] = await Promise.all([
			convex.queryForTool('get_listing_detail', { listingId: input.listingId }),
			convex.queryForTool('get_listing_interaction_summary', {
				listingId: input.listingId,
				days: input.days ?? 30
			})
		]);
		const failed = [listing, interactions].find((result) => !result.ok);
		if (failed) return failed;
		return {
			...listing.data,
			interactionSummary: interactions.data,
			period: `${input.days ?? 30} days`,
			mediaPresence: {
				hasLogo: Boolean(listing.data?.logoFileId || listing.data?.logoUrl),
				hasCover: Boolean(listing.data?.coverFileId || listing.data?.coverUrl)
			}
		};
	}
	return input;
}

function filtersFromRewrite(input, rewrite = {}) {
	return {
		query: input.query,
		category: rewrite.category,
		location: rewrite.location ?? input.location,
		targetAudience: rewrite.targetAudience ?? input.targetAudience,
		keywords: rewrite.serviceKeywords,
		remoteAvailable: rewrite.remoteOrInPerson === 'REMOTE' ? true : undefined,
		inPersonAvailable: rewrite.remoteOrInPerson === 'IN_PERSON' ? true : undefined
	};
}

function summarizeDocumentStatuses(documents = []) {
	return (Array.isArray(documents) ? documents : []).reduce(
		(acc, document) => ({
			...acc,
			total: acc.total + 1,
			byStatus: { ...acc.byStatus, [document.status]: (acc.byStatus[document.status] ?? 0) + 1 },
			byType: { ...acc.byType, [document.type]: (acc.byType[document.type] ?? 0) + 1 }
		}),
		{ total: 0, byStatus: {}, byType: {} }
	);
}
