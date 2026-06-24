#!/usr/bin/env node
import http from 'node:http';
import { createMcpContext } from './context.js';

const context = createMcpContext();

if (context.config.transport === 'http' || context.config.transport === 'sse') {
	startHttpServer(context);
} else {
	startStdioServer(context);
}

async function startStdioServer(ctx) {
	try {
		const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
		const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
		const { z } = await import('zod');
		const server = new McpServer({ name: ctx.config.name, version: ctx.config.version });

		for (const tool of ctx.tools.list()) {
			server.tool(tool.name, tool.description, z.object({}).passthrough(), async (input) => {
				const result = await ctx.tools.call(tool.name, input);
				return {
					content: [{ type: 'text', text: JSON.stringify(result) }]
				};
			});
		}

		await server.connect(new StdioServerTransport());
	} catch (error) {
		ctx.logger.error(
			{ error: error instanceof Error ? error.message : 'Unknown MCP stdio failure' },
			'Failed to start stdio MCP server'
		);
		process.exitCode = 1;
	}
}

function startHttpServer(ctx) {
	const server = http.createServer(async (request, response) => {
		response.setHeader('Content-Type', 'application/json');
		if (request.method === 'GET' && request.url === '/health') {
			response.end(JSON.stringify(await ctx.tools.call('ping_diasporajunxion')));
			return;
		}
		if (request.method === 'GET' && request.url === '/tools') {
			response.end(JSON.stringify({ ok: true, tools: ctx.tools.list() }));
			return;
		}
		if (request.method === 'POST' && request.url === '/call') {
			const body = await readJson(request);
			response.end(JSON.stringify(await ctx.tools.call(body.name, body.arguments ?? {})));
			return;
		}
		response.statusCode = 404;
		response.end(JSON.stringify({ ok: false, error: 'Not found' }));
	});

	server.listen(ctx.config.port, () => {
		ctx.logger.info({ port: ctx.config.port }, 'DiasporaJunxion MCP HTTP server listening');
	});
}

async function readJson(request) {
	let body = '';
	for await (const chunk of request) body += chunk;
	return body ? JSON.parse(body) : {};
}
