import Redis from 'ioredis';
import { env } from '$env/dynamic/private';

const redisUrl = env.REDIS_URL;
if (!redisUrl) {
	throw new Error('Missing REDIS_URL in environment');
}

export const redis = new Redis(redisUrl);
