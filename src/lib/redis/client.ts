import { env } from '@/lib/env/envSchema';
import { Redis } from '@upstash/redis';

export const redisClient = new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN
});

// Helper function to check if Redis is available
export async function isRedisAvailable(): Promise<boolean> {
    try {
        await redisClient.ping();
        return true;
    } catch (error) {
        console.warn('Redis is not available:', error);
        return false;
    }
}
