import { json } from '@sveltejs/kit';
import { createMcpContext } from '../../../mcp/context.js';

const context = createMcpContext();

export async function GET({ url }) {
	if (url.searchParams.get('tools') === '1') {
		return json({ ok: true, tools: context.tools.list() });
	}
	return json(await context.tools.call('ping_diasporajunxion'));
}

export async function POST({ request }) {
	const body = await request.json();
	return json(await context.tools.call(body.name, body.arguments ?? {}));
}
