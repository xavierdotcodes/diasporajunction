import { inngest } from './client.js';
import { leadNurtureSequence } from './functions/lead-nurture.js';
import { fileLogger, scopedLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/inngest/index.js');
const log = scopedLogger('inngest.registry');

export { inngest };

export const functions = [leadNurtureSequence];

log.info({
	op: 'register_functions',
	phase: 'success',
	functionIds: functions.map((fn) => fn.id ?? fn.name).filter(Boolean),
	count: functions.length
});
