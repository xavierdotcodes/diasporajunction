// @ts-nocheck
const DEFAULT_ENV = process.env;

export function loadConfig(env = DEFAULT_ENV) {
	const config = {
		name: 'diasporajunxion-mcp',
		version: '0.1.0',
		convexUrl: env.CONVEX_URL || '',
		convexDeployment: env.CONVEX_DEPLOYMENT || '',
		convexAdminKey: env.CONVEX_ADMIN_KEY || '',
		appAdminToken: env.DIASPORAJUNXION_ADMIN_TOKEN || env.ADMIN_ACTION_TOKEN || '',
		mastraBaseUrl: env.MASTRA_BASE_URL || '',
		mastraApiKey: env.MASTRA_API_KEY || '',
		inngestEventKey: env.INNGEST_EVENT_KEY || '',
		inngestBaseUrl: env.INNGEST_BASE_URL || 'https://inn.gs',
		transport: env.MCP_TRANSPORT || 'stdio',
		port: Number(env.PORT || env.MCP_PORT || 8787)
	};

	return {
		...config,
		missingConvexConfig: config.convexUrl ? [] : ['CONVEX_URL'],
		missingMastraConfig: config.mastraBaseUrl ? [] : ['MASTRA_BASE_URL'],
		missingInngestConfig: config.inngestEventKey ? [] : ['INNGEST_EVENT_KEY']
	};
}

export function getPublicConfigStatus(config = loadConfig()) {
	return {
		name: config.name,
		version: config.version,
		transport: config.transport,
		port: config.port,
		convexConfigured: Boolean(config.convexUrl),
		mastraConfigured: Boolean(config.mastraBaseUrl),
		inngestConfigured: Boolean(config.inngestEventKey),
		missingConfig: [
			...config.missingConvexConfig,
			...config.missingMastraConfig,
			...config.missingInngestConfig
		]
	};
}
