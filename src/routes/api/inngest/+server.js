import { serve } from 'inngest/sveltekit';
import { functions, inngest } from '$lib/server/inngest';

const handler = serve({
	client: inngest,
	functions
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
