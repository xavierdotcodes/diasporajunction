// src/lib/server/redis.js
import Redis from 'ioredis';
import { env } from '$env/dynamic/private';

let client;

export function getRedis() {
	if (!client) {
		if (!env.REDIS_URL) {
			throw new Error('Missing REDIS_URL in environment');
		}
		client = new Redis(env.REDIS_URL);
	}
	return client;
}
