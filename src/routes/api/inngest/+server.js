import { serve } from 'inngest/sveltekit';
import { functions, inngest } from '$lib/server/inngest';
import { fileLogger, requestLogger, serializeError } from '$lib/utils/logger';

fileLogger('src/routes/api/inngest/+server.js');

const handler = serve({
	client: inngest,
	functions
});

function wrapHandler(method, delegate) {
	return async (event) => {
		const log = requestLogger(`api.inngest.${method.toLowerCase()}`, event, {
			op: 'inngest_endpoint'
		});

		log.info({
			phase: 'start'
		}, 'Handling Inngest endpoint request');

		try {
			const response = await delegate(event);
			log.info({
				phase: 'success',
				status: response.status
			}, 'Handled Inngest endpoint request');
			return response;
		} catch (error) {
			log.error({
				phase: 'error',
				error: serializeError(error)
			}, 'Inngest endpoint request failed');
			throw error;
		}
	};
}

export const GET = wrapHandler('GET', handler.GET);
export const POST = wrapHandler('POST', handler.POST);
export const PUT = wrapHandler('PUT', handler.PUT);
