import Redis from 'ioredis';
import { REDIS_URL } from '$env/static/private';

const redisUrl = REDIS_URL;
if (!redisUrl) {
	throw new Error('Missing REDIS_URL in environment');
}

export const redis = new Redis(redisUrl);
