import { getPublicConfigStatus } from '../config.js';
import { ok } from '../response.js';

export function coreTools(context) {
	return [
		{
			name: 'ping_diasporajunxion',
			description: 'Health check for the DiasporaJunxion MCP server.',
			inputSchema: { type: 'object', additionalProperties: false, properties: {} },
			handler: async () => ok({ pong: true, service: 'DiasporaJunxion MCP' }, 'DiasporaJunxion MCP is reachable.')
		},
		{
			name: 'get_mcp_server_status',
			description: 'Return redacted MCP server configuration and dependency status.',
			inputSchema: { type: 'object', additionalProperties: false, properties: {} },
			handler: async () => ok(getPublicConfigStatus(context.config), 'MCP server status.')
		},
		{
			name: 'list_diasporajunxion_tools',
			description: 'List approved DiasporaJunxion MCP tools.',
			inputSchema: { type: 'object', additionalProperties: false, properties: {} },
			handler: async () =>
				ok(
					context.listTools().map(({ name, description, write }) => ({ name, description, write: Boolean(write) })),
					'Available DiasporaJunxion MCP tools.'
				)
		}
	];
}
