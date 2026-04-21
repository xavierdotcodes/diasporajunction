import { getInngestClient } from './client.js';
import { createLeadNurtureSequence } from './functions/lead-nurture.js';
import { fileLogger, scopedLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/inngest/index.js');
const log = scopedLogger('inngest.registry');

function getFunctionId(fn) {
	if (typeof fn?.id === 'function') return fn.id();
	if (typeof fn?.name === 'function') return fn.name();
	return fn?.opts?.id ?? fn?.id ?? fn?.name ?? null;
}

let registration;

export const inngest = new Proxy(
	{},
	{
		get(_target, prop) {
			const client = getInngestClient();
			const value = client[prop];

			return typeof value === 'function' ? value.bind(client) : value;
		}
	}
);

export function getInngestRegistration() {
	if (!registration) {
		const inngest = getInngestClient();
		const functions = [createLeadNurtureSequence(inngest)];

		log.info({
			op: 'register_functions',
			phase: 'success',
			functionIds: functions.map(getFunctionId).filter(Boolean),
			count: functions.length
		});

		registration = { inngest, functions };
	}

	return registration;
}
