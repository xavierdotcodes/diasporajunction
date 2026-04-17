import Redis from 'ioredis';
import crypto from 'crypto';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/session.js');

const redis = new Redis(process.env.REDIS_URL);

export async function createSession(user) {
	const sessionId = crypto.randomBytes(32).toString('hex');
	await redis.set(
		`session:${sessionId}`,
		JSON.stringify({ userId: user.id, roles: user.roles.map((r) => r.role) }),
		'EX',
		60 * 60 // 1 hour
	);
	return sessionId;
}

export async function getSession(sessionId) {
	const data = await redis.get(`session:${sessionId}`);
	return data ? JSON.parse(data) : null;
}

export async function destroySession(sessionId) {
	await redis.del(`session:${sessionId}`);
}
