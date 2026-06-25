import { createAiService } from '../../lib/ai/service.js';
import { ok } from '../response.js';

const AGENT_MAP = {
	ai_search_directory: 'directorySearchAgent',
	ai_rewrite_directory_search: 'directorySearchAgent',
	ai_summarize_application: 'applicationReviewAssistAgent',
	summarize_application_for_review: 'applicationReviewAssistAgent',
	ai_suggest_application_category: 'categoryClassifierAgent',
	ai_admin_triage_summary: 'adminTriageAgent',
	ai_generate_listing_improvement_suggestions: 'listingSummaryAgent',
	ai_generate_lead_digest: 'leadDigestAgent',
	summarize_payment_issues: 'adminTriageAgent'
};

export function createMastraClient(config) {
	const service = createAiService(config.ai ?? {});
	return {
		agentForTool(toolName) {
			return AGENT_MAP[toolName];
		},
		async runAgent(toolName, input = {}) {
			const agent = AGENT_MAP[toolName];
			if (!agent) {
				return {
					ok: false,
					message: 'No AI agent is mapped for this MCP tool.',
					error: 'No AI agent is mapped for this MCP tool.',
					missingConfig: [],
					notImplemented: true
				};
			}
			const result = await runServiceAgent(service, toolName, input);
			if (result.missingConfig?.length) {
				return {
					ok: false,
					message: 'AI provider is not configured. Returned deterministic fallback where available.',
					error: 'AI provider is not configured.',
					missingConfig: result.missingConfig,
					notImplemented: false,
					data: { ...(result.data ?? {}), agent, suggestion: true, fallbackUsed: true }
				};
			}
			return ok({ ...(result ?? {}), agent, suggestion: true }, 'AI suggestion generated.');
		}
	};
}

async function runServiceAgent(service, toolName, input) {
	const missingConfig = service.isConfigured() ? [] : service.getMissingConfig();
	if (toolName === 'ai_search_directory' || toolName === 'ai_rewrite_directory_search') {
		const data = await service.rewriteDirectorySearch(input);
		return { data, missingConfig };
	}
	if (toolName === 'ai_summarize_application' || toolName === 'summarize_application_for_review') {
		const data = await service.summarizeApplicationForReview(input);
		return { data, missingConfig };
	}
	if (toolName === 'ai_suggest_application_category') {
		const data = await service.summarizeApplicationForReview(input);
		return { data: { suggestedCategory: data.suggestedCategory, suggestion: true }, missingConfig };
	}
	if (toolName === 'ai_admin_triage_summary' || toolName === 'summarize_payment_issues') {
		const data = await service.generateAdminTriageSummary(input);
		return { data, missingConfig };
	}
	if (toolName === 'ai_generate_listing_improvement_suggestions') {
		const data = await service.generateListingImprovementSuggestions(input);
		return { data, missingConfig };
	}
	if (toolName === 'ai_generate_lead_digest') {
		const data = await service.generateLeadDigest(input);
		return { data, missingConfig };
	}
	return { data: {}, missingConfig };
}
