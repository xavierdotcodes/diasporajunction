import { inngest } from './client.js';
import { leadNurtureSequence } from './functions/lead-nurture.js';
import { fileLogger, scopedLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/inngest/index.js');
const log = scopedLogger('inngest.registry');

export { inngest };

export const functions = [leadNurtureSequence];

function getFunctionId(fn) {
	if (typeof fn?.id === 'function') return fn.id();
	if (typeof fn?.name === 'function') return fn.name();
	return fn?.opts?.id ?? fn?.id ?? fn?.name ?? null;
}

log.info({
	op: 'register_functions',
	phase: 'success',
	functionIds: functions.map(getFunctionId).filter(Boolean),
	count: functions.length
});
