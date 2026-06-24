import { loadConfig } from './config.js';
import { createLogger } from './logger.js';
import { createConvexClient } from './clients/convex.js';
import { createMastraClient } from './clients/mastra.js';
import { createInngestClient } from './clients/inngest.js';
import { createToolRegistry } from './tools/index.js';

export function createMcpContext(env = process.env) {
	const config = loadConfig(env);
	const logger = createLogger('diasporajunxion-mcp');
	const convex = createConvexClient(config);
	const mastra = createMastraClient(config);
	const inngest = createInngestClient(config);
	const context = { config, logger, convex, mastra, inngest };
	const tools = createToolRegistry(context);
	return { ...context, tools };
}
