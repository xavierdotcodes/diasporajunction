// src/hooks.server.js
//import { pubsubSetup } from '$lib/server/realtime/pubsub';
import { getSession, destroySession } from '$lib/server/session';
import { scopedLogger } from '$lib/utils/logger';
//import { building } from '$app/environment';
import { startEmailWorker } from '$lib/server/workers/email.worker';

const log = scopedLogger('hooks');

let workerStarted = false;

/*
if (!building) {
    pubsubSetup();
}
*/

export async function handle({ event, resolve }) {
    const op = 'handle';
    if (!workerStarted) {
        startEmailWorker();
        workerStarted = true;
    }
    const started = Date.now();
    const session = await getSession(event.cookies);
    log.info({ op, phase: 'start', path: event.url.pathname, ms: Date.now() - started });

    if (session?.user) {
        event.locals.user = session.user;
        log.debug({ phase: 'session_found', userId: session.userId });
    } else {
        log.debug({ phase: 'no_session' });
        destroySession(event.cookies);
        event.cookies.delete('session', { path: '/' });
    }

    const response = await resolve(event);

    log.info({ op, phase: 'end', path: event.url.pathname, status: response.status, ms: Date.now() - started });

    return response;
}
