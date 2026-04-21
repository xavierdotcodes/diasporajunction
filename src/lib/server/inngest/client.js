import { dev } from '$app/environment';
import { Inngest } from 'inngest';
import { fileLogger, scopedLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/inngest/client.js');
const log = scopedLogger('inngest.client');

export const inngest = new Inngest({
	id: 'diasporajunxion',
	isDev: dev
});

log.info({
	op: 'init_client',
	phase: 'success',
	clientId: 'diasporajunxion',
	isDev
});
