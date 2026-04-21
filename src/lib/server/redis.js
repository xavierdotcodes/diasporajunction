// src/lib/server/redis.js
import Redis from 'ioredis';
import { env } from '$env/dynamic/private';
import { fileLogger, serializeError } from '$lib/utils/logger';

const log = fileLogger('src/lib/server/redis.js');

let client;

function assertRedisUrl() {
	if (!env.REDIS_URL) {
		throw new Error('Missing REDIS_URL in environment');
	}
}

export function getRedis() {
	if (!client) {
		assertRedisUrl();
		log.info({ phase: 'redis_client_initializing' });

		try {
			client = new Redis(env.REDIS_URL);
			client.on('connect', () => {
				log.info({ phase: 'redis_connected' });
			});
			client.on('error', (error) => {
				log.error({
					phase: 'redis_error',
					error: serializeError(error)
				});
			});
		} catch (error) {
			log.error({
				phase: 'redis_client_initialization_failed',
				error: serializeError(error)
			});
			throw error;
		}
	}
	return client;
}
