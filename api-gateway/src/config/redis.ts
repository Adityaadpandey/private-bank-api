import Redis from 'ioredis';
import { config } from '.';
import logger from './logger';

class RedisClient {
  private static instance: Redis;
  private static isConnected = false;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.REDIS_URL, {
        retryStrategy: (times: number) => {
          const delay = Math.min(times * 50, 2000);
          logger.warn(`Redis connection failed. Retrying in ${delay}ms...`);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });
      RedisClient.setupEventListeners();
    }
    return RedisClient.instance;
  }
  private static setupEventListeners() {
    RedisClient.instance.on('connect', () => {
      logger.info('Redis connected');
      RedisClient.isConnected = true;
    });

    RedisClient.instance.on('error', (err) => {
      logger.error(`Redis error: ${err}`);
      RedisClient.isConnected = false;
    });

    RedisClient.instance.on('close', () => {
      logger.warn('Redis connection closed');
      RedisClient.isConnected = false;
    });

    RedisClient.instance.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });
  }

  public static isReady(): boolean {
    return RedisClient.isConnected;
  }
}

export default RedisClient.getInstance();
