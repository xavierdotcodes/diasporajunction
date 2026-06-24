import { serve } from 'inngest/sveltekit';
import { inngest } from '$lib/inngest/client.js';
import { functions } from '$lib/inngest/functions/index.js';

const handler = serve({
	client: inngest,
	functions,
	signingKey: process.env.INNGEST_SIGNING_KEY
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
