// @ts-nocheck
import { json } from '@sveltejs/kit';
import { createMcpContext } from '../../../mcp/context.js';
import { authContextForConvex } from '$lib/server/auth.js';

export async function GET(event) {
	const context = createMcpContext(process.env, authContextForConvex(event));
	const { url } = event;
	if (url.searchParams.get('tools') === '1') {
		return json({ ok: true, tools: context.tools.list() });
	}
	return json(await context.tools.call('ping_diasporajunxion'));
}

export async function POST(event) {
	const context = createMcpContext(process.env, authContextForConvex(event));
	const { request } = event;
	const body = await request.json();
	return json(await context.tools.call(body.name, body.arguments ?? {}));
}
