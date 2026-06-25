import { fail, validateRequired } from '../response.js';

export function applicationTools({ config, convex, mastra }) {
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
				if (!config?.appAdminToken) {
					return fail('Admin authorization is required for private AI tools.', {
						missingConfig: ['DIASPORAJUNXION_ADMIN_TOKEN']
					});
				}
				const [application, documents] = await Promise.all([
					convex.queryForTool('get_application_detail', input),
					convex.queryForTool('get_application_verification_documents', input)
				]);
				if (!application.ok) return application;
				if (!documents.ok) return documents;
				const result = await mastra.runAgent('summarize_application_for_review', {
					...application.data,
					documentStatusSummary: summarizeDocumentStatuses(documents.data)
				});
				return {
					...result,
					data: { ...sanitizeAiOutput(result.data ?? {}), suggestion: true },
					message: `${result.message ?? 'AI suggestion generated.'} AI output is a suggestion and does not approve, reject, or change records.`
				};
			}
		}
	];
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
