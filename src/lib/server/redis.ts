import Redis from 'ioredis';
import { env } from '$env/dynamic/private';
import { logger } from './logger';

const redisUrl = env.REDIS_URL || 'redis://127.0.0.1:6379';

export const redis = new Redis(redisUrl, {
	maxRetriesPerRequest: null,
	retryStrategy(times) {
		const delay = Math.min(times * 50, 2000);
		return delay;
	}
});

redis.on('connect', () => {
	logger.info('Redis connected successfully');
});

redis.on('error', (err: Error) => {
	if (err.message.includes('ENOTFOUND')) {
		logger.error(`[Redis Config Error]: Host "${redisUrl}" không tồn tại.`);
	} else {
		logger.error('[Redis Connection Error]', err);
	}
});

const closeRedis = async () => {
	logger.info('Closing Redis connection...');
	await redis.quit();
	process.exit(0);
};

process.on('SIGINT', closeRedis);
process.on('SIGTERM', closeRedis);
