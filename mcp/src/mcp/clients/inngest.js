import { missingConfig, ok } from '../response.js';

export function createInngestClient(config) {
	return {
		async send(eventName, data = {}) {
			if (!config.inngestEventKey) {
				return missingConfig('Inngest is not configured for MCP event dispatch.', ['INNGEST_EVENT_KEY']);
			}
			return ok(
				{ eventName, data, queued: false },
				'Inngest wrapper is configured; event HTTP dispatch will be wired when app endpoint is finalized.',
				{ notImplemented: true }
			);
		}
	};
}
