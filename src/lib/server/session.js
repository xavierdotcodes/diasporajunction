import crypto from 'crypto';
import { getRedis } from '$lib/server/redis';
import { fileLogger, scopedLogger, serializeError } from '$lib/utils/logger';

fileLogger('src/lib/server/session.js');
const log = scopedLogger('session');

export async function createSession(user) {
	const roles = Array.isArray(user?.roles)
		? user.roles.map((role) => role?.role ?? role).filter(Boolean)
		: [];

	log.info({
		op: 'create_session',
		phase: 'start',
		userId: user?.id,
		roleCount: roles.length
	});

	const sessionId = crypto.randomBytes(32).toString('hex');
	const redis = getRedis();

	try {
		await redis.set(
			`session:${sessionId}`,
			JSON.stringify({
				userId: user.id,
				adminAccountId: user.adminAccountId ?? null,
				accountType: user.accountType ?? 'user',
				email: user.email ?? null,
				name: user.name ?? null,
				roles
			}),
			'EX',
			60 * 60 // 1 hour
		);
	} catch (error) {
		log.error({
			op: 'create_session',
			phase: 'error',
			userId: user?.id,
			error: serializeError(error)
		});
		throw error;
	}

	log.info({
		op: 'create_session',
		phase: 'success',
		userId: user?.id,
		sessionId
	});
	return sessionId;
}

export async function getSession(sessionId) {
	log.debug({
		op: 'get_session',
		phase: 'start',
		sessionId
	});

	const redis = getRedis();
	let data;

	try {
		data = await redis.get(`session:${sessionId}`);
	} catch (error) {
		log.error({
			op: 'get_session',
			phase: 'error',
			sessionId,
			error: serializeError(error)
		});
		throw error;
	}

	log.debug({
		op: 'get_session',
		phase: 'success',
		sessionId,
		found: Boolean(data)
	});

	return data ? JSON.parse(data) : null;
}

export async function destroySession(sessionId) {
	log.info({
		op: 'destroy_session',
		phase: 'start',
		sessionId
	});

	const redis = getRedis();

	try {
		await redis.del(`session:${sessionId}`);
	} catch (error) {
		log.error({
			op: 'destroy_session',
			phase: 'error',
			sessionId,
			error: serializeError(error)
		});
		throw error;
	}

	log.info({
		op: 'destroy_session',
		phase: 'success',
		sessionId
	});
}
