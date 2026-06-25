// @ts-nocheck
import { loadConfig } from './config.js';
import { createLogger } from './logger.js';
import { createConvexClient } from './clients/convex.js';
import { createMastraClient } from './clients/mastra.js';
import { createInngestClient } from './clients/inngest.js';
import { createToolRegistry } from './tools/index.js';

export function createMcpContext(env = process.env, auth = null) {
	const config = loadConfig(env);
	const configWithAuth = { ...config, requestAuth: auth };
	const logger = createLogger('diasporajunxion-mcp');
	const convex = createConvexClient(configWithAuth);
	const mastra = createMastraClient(configWithAuth);
	const inngest = createInngestClient(configWithAuth);
	const context = { config: configWithAuth, logger, convex, mastra, inngest };
	const tools = createToolRegistry(context);
	return { ...context, tools };
}
