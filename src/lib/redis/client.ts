import { env } from '@/lib/env/envSchema';
import { Redis } from '@upstash/redis';

export const redisClient = new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN
});
