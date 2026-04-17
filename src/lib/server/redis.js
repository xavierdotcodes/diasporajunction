// src/lib/server/redis.js
import Redis from 'ioredis';
import { env } from '$env/dynamic/private';
import { fileLogger } from '$lib/utils/logger';

fileLogger('src/lib/server/redis.js');

let client;
let bullmqClient;

function assertRedisUrl() {
	if (!env.REDIS_URL) {
		throw new Error('Missing REDIS_URL in environment');
	}
}

export function getRedis() {
	if (!client) {
		assertRedisUrl();
		client = new Redis(env.REDIS_URL);
	}
	return client;
}

export function getBullRedis() {
	if (!bullmqClient) {
		assertRedisUrl();
		bullmqClient = new Redis(env.REDIS_URL, {
			maxRetriesPerRequest: null
		});
	}

	return bullmqClient;
}
