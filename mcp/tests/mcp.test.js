// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { loadConfig, getPublicConfigStatus } from '../src/mcp/config.js';
import { createMcpContext } from '../src/mcp/context.js';
import { createConvexClient } from '../src/mcp/clients/convex.js';
import { createToolRegistry } from '../src/mcp/tools/index.js';
import { fail, ok } from '../src/mcp/response.js';

describe('mcp config', () => {
	it('reports missing config without leaking secrets', () => {
		const config = loadConfig({});
		const status = getPublicConfigStatus(config);
		expect(status.convexConfigured).toBe(false);
		expect(status.missingConfig).toContain('CONVEX_URL');
		expect(JSON.stringify(status)).not.toContain('ADMIN_KEY');
	});

	it('detects configured dependencies', () => {
		const config = loadConfig({
			CONVEX_URL: 'https://example.convex.cloud',
			MASTRA_BASE_URL: 'https://mastra.example',
			INNGEST_EVENT_KEY: 'secret'
		});
		expect(getPublicConfigStatus(config)).toMatchObject({
			convexConfigured: true,
			mastraConfigured: true,
			inngestConfigured: true
		});
	});
});

describe('mcp response helpers', () => {
	it('uses the standard response shape', () => {
		expect(ok({ value: 1 }, 'done')).toMatchObject({
			ok: true,
			data: { value: 1 },
			message: 'done',
			missingConfig: [],
			notImplemented: false
		});
		expect(fail('bad')).toMatchObject({
			ok: false,
			error: 'bad',
			message: 'bad',
			missingConfig: [],
			notImplemented: false
		});
	});
});

describe('mcp tool registry', () => {
	it('lists core and directory tools', () => {
		const { tools } = createMcpContext({});
		const names = tools.list().map((tool) => tool.name);
		expect(names).toContain('ping_diasporajunxion');
		expect(names).toContain('get_admin_dashboard_summary');
		expect(names).toContain('list_paid_applications_waiting_review');
		expect(names).toContain('search_directory_listings');
		expect(names).toContain('ai_admin_triage_summary');
		expect(names).toContain('update_listing_active_status');
		expect(names).toContain('find_diaspora_friendly_services');
		expect(names).toContain('find_housing_support');
		expect(names).toContain('get_contact_options_for_listing');
	});

	it('maps MCP tools to concrete Convex function names', () => {
		const convex = createConvexClient({ convexUrl: 'https://example.convex.cloud' });
		expect(convex.functionForTool('get_admin_dashboard_summary')).toBe('adminDashboard:getSummary');
		expect(convex.functionForTool('list_paid_applications_waiting_review')).toBe(
			'applications:listPaidWaitingReview'
		);
		expect(convex.functionForTool('get_application_verification_documents')).toBe(
			'verificationDocuments:listForApplication'
		);
		expect(convex.functionForTool('search_directory_listings')).toBe('listings:search');
		expect(convex.functionForTool('public_search_directory')).toBe('listings:search');
	});

	it('runs ping and status tools', async () => {
		const { tools } = createMcpContext({});
		await expect(tools.call('ping_diasporajunxion')).resolves.toMatchObject({
			ok: true,
			data: { pong: true }
		});
		await expect(tools.call('get_mcp_server_status')).resolves.toMatchObject({
			ok: true,
			data: { convexConfigured: false }
		});
	});

	it('returns missing Convex config from public read tools', async () => {
		const { tools } = createMcpContext({});
		await expect(tools.call('search_directory_listings')).resolves.toMatchObject({
			ok: false,
			missingConfig: ['CONVEX_URL']
		});
	});

	it('blocks anonymous admin MCP tools before backend execution', async () => {
		const { tools } = createMcpContext({});
		await expect(tools.call('get_admin_dashboard_summary')).resolves.toMatchObject({
			ok: false,
			missingConfig: ['DIASPORAJUNXION_ADMIN_TOKEN']
		});
	});

	it('guards write tools until confirm=true', async () => {
		const { tools } = createMcpContext({});
		await expect(
			tools.call('update_listing_active_status', { listingId: 'listing123', isActive: false })
		).resolves.toMatchObject({
			ok: false,
			data: { guarded: true }
		});
	});

	it('requires admin auth config for private AI tools', async () => {
		const { tools } = createMcpContext({ MASTRA_BASE_URL: 'https://mastra.example' });
		await expect(tools.call('ai_admin_triage_summary')).resolves.toMatchObject({
			ok: false,
			missingConfig: ['DIASPORAJUNXION_ADMIN_TOKEN']
		});
	});

	it('returns Convex-backed data through MCP response shape', async () => {
		const convex = createConvexClient({
			appAdminToken: 'admin-secret',
			convexExecutor: async ({ functionName }) =>
				ok({ source: functionName, activeListings: 2 }, 'mock convex data')
		});
		const tools = createToolRegistry(testContext({ convex }));
		await expect(tools.call('get_directory_health_summary')).resolves.toMatchObject({
			ok: true,
			data: { source: 'adminDashboard:getDirectoryHealth', activeListings: 2 }
		});
	});

	it('returns exact missing backend function when Convex reports a missing function', async () => {
		const convex = createConvexClient({
			appAdminToken: 'admin-secret',
			convexExecutor: async ({ functionName }) => ({
				ok: false,
				error: `Could not find public function ${functionName}`,
				message: `Missing Convex backend function: ${functionName}`,
				missingConfig: [],
				notImplemented: true,
				data: { backendFunction: functionName }
			})
		});
		const tools = createToolRegistry(testContext({ convex }));
		await expect(tools.call('get_recent_activity')).resolves.toMatchObject({
			ok: false,
			notImplemented: true,
			data: { backendFunction: 'adminDashboard:getRecentActivity' }
		});
	});

	it('public discovery falls back when AI is unavailable and whitelists public fields', async () => {
		const convex = createConvexClient({
			convexExecutor: async ({ functionName, args }) => {
				expect(functionName).toBe('listings:search');
				expect(args.category).toBe('REAL_ESTATE');
				return ok([
					{
						id: 'listing1',
						businessName: 'East Legon Housing Help',
						category: 'REAL_ESTATE',
						city: 'Accra',
						verificationStatus: 'VERIFIED',
						logoUrl: 'https://cdn.example/logo.png',
						media: [{ type: 'LOGO', url: 'https://cdn.example/logo.png', storageId: 'private-storage' }],
						contactOptions: { whatsapp: { available: true, value: '+233000000000' } },
						adminNotes: 'private',
						paymentReference: 'secret',
						sourceApplicationId: 'private-app',
						ownerDashboard: { views: 100 },
						interactionSummary30d: { total: 100 },
						verificationDocuments: [{ storageId: 'private-doc' }]
					}
				]);
			}
		});
		const mastra = { runAgent: async () => ({ ok: false, notImplemented: true, message: 'no ai' }) };
		const tools = createToolRegistry(testContext({ convex, mastra }));
		const result = await tools.call('find_housing_support', {
			query: 'trusted housing support near East Legon',
			location: 'East Legon'
		});
		expect(result).toMatchObject({ ok: true, data: { aiRewriteUsed: false } });
		expect(result.data.results[0].businessName).toBe('East Legon Housing Help');
		expect(result.data.results[0].logoUrl).toBe('https://cdn.example/logo.png');
		expect(result.data.results[0].media[0]).toMatchObject({ type: 'LOGO', url: 'https://cdn.example/logo.png' });
		expect(result.data.results[0].media[0]).not.toHaveProperty('storageId');
		expect(result.data.results[0]).not.toHaveProperty('adminNotes');
		expect(result.data.results[0]).not.toHaveProperty('paymentReference');
		expect(result.data.results[0]).not.toHaveProperty('sourceApplicationId');
		expect(result.data.results[0]).not.toHaveProperty('ownerDashboard');
		expect(result.data.results[0]).not.toHaveProperty('interactionSummary30d');
		expect(result.data.results[0]).not.toHaveProperty('verificationDocuments');
	});

	it('private AI tools return suggestions without private document URLs', async () => {
		const convex = createConvexClient({
			appAdminToken: 'admin-token',
			convexExecutor: async ({ functionName }) => {
				if (functionName === 'applications:getById') {
					return ok({
						applicationId: 'app1',
						businessName: 'Immigration Help',
						category: 'LEGAL_IMMIGRATION',
						documentUrl: 'https://private.example/doc',
						verificationDocuments: [{ storageId: 'secret-storage' }]
					});
				}
				return ok({});
			}
		});
		const mastra = {
			runAgent: async (_name, input) =>
				ok({
					summary: `Review ${input.businessName}`,
					suggestedCategory: input.category,
					documentUrl: input.documentUrl,
					suggestion: true
				})
		};
		const tools = createToolRegistry(testContext({ convex, mastra, config: { appAdminToken: 'admin-token' } }));
		const result = await tools.call('ai_summarize_application', { applicationId: 'app1' });
		expect(result).toMatchObject({ ok: true, data: { suggestion: true, suggestedCategory: 'LEGAL_IMMIGRATION' } });
		expect(result.message).toContain('suggestion');
		expect(JSON.stringify(result)).not.toContain('private.example');
		expect(JSON.stringify(result)).not.toContain('secret-storage');
	});
});

function testContext(overrides = {}) {
	return {
		config: overrides.config ?? {},
		logger: { info() {}, error() {} },
		convex:
			overrides.convex ??
			createConvexClient({
				convexExecutor: async () => ok({})
			}),
		mastra: overrides.mastra ?? { runAgent: async () => ({ ok: false, notImplemented: true }) },
		inngest: { send: async () => ok({}) }
	};
}
