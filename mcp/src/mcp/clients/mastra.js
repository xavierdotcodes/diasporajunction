import { missingConfig, notImplemented } from '../response.js';

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
	return {
		agentForTool(toolName) {
			return AGENT_MAP[toolName];
		},
		async runAgent(toolName, input = {}) {
			const agent = AGENT_MAP[toolName];
			if (!agent) return notImplemented('No Mastra agent is mapped for this MCP tool.');
			if (!config.mastraBaseUrl) {
				return missingConfig('Mastra is not configured for MCP.', ['MASTRA_BASE_URL']);
			}
			return notImplemented('Mastra HTTP adapter is declared but not wired to a live agent endpoint yet.', {
				agent,
				input,
				suggestion: true
			});
		}
	};
}
