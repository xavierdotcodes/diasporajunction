import { coreTools } from './core.js';
import { adminTools } from './admin.js';
import { applicationTools } from './applications.js';
import { listingTools } from './listings.js';
import { paymentTools } from './payments.js';
import { supportTools } from './support.js';
import { aiTools } from './ai.js';
import { publicDiscoveryTools } from './publicDiscovery.js';
import { writeTools } from './writes.js';
import { withToolLogging } from '../logger.js';

export function createToolRegistry(context) {
	const registry = new Map();
	const fullContext = {
		...context,
		listTools: () => Array.from(registry.values()).map(stripHandler)
	};

	const tools = [
		...coreTools(fullContext),
		...adminTools(fullContext),
		...applicationTools(fullContext),
		...listingTools(fullContext),
		...paymentTools(fullContext),
		...supportTools(fullContext),
		...publicDiscoveryTools(fullContext),
		...aiTools(fullContext),
		...writeTools(fullContext)
	];

	for (const tool of tools) {
		registry.set(tool.name, {
			...tool,
			handler: (input) =>
				withToolLogging(tool.name, context.logger, async () => await tool.handler(input ?? {}))
		});
	}

	return {
		get(name) {
			return registry.get(name);
		},
		list() {
			return Array.from(registry.values()).map(stripHandler);
		},
		async call(name, input = {}) {
			const tool = registry.get(name);
			if (!tool) {
				return {
					ok: false,
					error: `Unknown tool: ${name}`,
					message: `Unknown tool: ${name}`,
					missingConfig: [],
					notImplemented: false
				};
			}
			return await tool.handler(input);
		}
	};
}

function stripHandler(tool) {
	const { handler, ...safeTool } = tool;
	return safeTool;
}
