import { dev } from '$app/environment';
import { Inngest } from 'inngest';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/inngest/client.js');

export const inngest = new Inngest({
	id: 'diasporajunxion',
	isDev: dev
});
