import { fileLogger, requestLogger, serializeError } from '$lib/utils/logger';

fileLogger('src/routes/api/inngest/+server.js');

let handlerPromise;

async function getHandler() {
	if (!handlerPromise) {
		handlerPromise = Promise.all([import('inngest/sveltekit'), import('$lib/server/inngest')]).then(
			([{ serve }, { getInngestRegistration }]) => {
				const { functions, inngest } = getInngestRegistration();

				return serve({
					client: inngest,
					functions
				});
			}
		);
	}

	return handlerPromise;
}

function wrapHandler(method, delegate) {
	return async (event) => {
		const log = requestLogger(`api.inngest.${method.toLowerCase()}`, event, {
			op: 'inngest_endpoint'
		});

		log.info({
			phase: 'start'
		}, 'Handling Inngest endpoint request');

		try {
			const handler = await getHandler();
			const response = await delegate(handler, event);
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

export const GET = wrapHandler('GET', (handler, event) => handler.GET(event));
export const POST = wrapHandler('POST', (handler, event) => handler.POST(event));
export const PUT = wrapHandler('PUT', (handler, event) => handler.PUT(event));
