import { z } from 'zod';

const envSchema = z.object({
    // Node environment - Using 'testing' instead of Jest's default 'test'
    NODE_ENV: z.enum(['development', 'testing', 'production']).default('development'),

    // Auth
    AUTH_SECRET: z.string().min(1),
    AUTH_URL: z.string().url(),

    // Database
    DATABASE_URL: z.string().min(1),

    // Upstash Redis (optional)
    UPSTASH_REDIS_URL: z.string().optional(),
    UPSTASH_REDIS_TOKEN: z.string().optional(),

    // Email (optional)
    EMAIL_SERVER_HOST: z.string().optional(),
    EMAIL_SERVER_PORT: z.coerce.number().optional(),
    EMAIL_SERVER_USER: z.string().optional(),
    EMAIL_SERVER_PASSWORD: z.string().optional(),
    EMAIL_FROM: z.string().email().optional()
});

/**
 * @type {Record<keyof z.infer<typeof envSchema>, string | undefined>}
 */
const processEnv = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
    UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM
};

/**
 * Validate environment variables against the schema
 */
function validateEnv() {
    // Parse the environment variables
    const result = envSchema.safeParse(processEnv);

    // Log environment variables for debugging in non-production environment
    if (processEnv.NODE_ENV !== 'production') {
        console.info('🔍 Validating environment variables...');
        console.info('👉 processEnv:', processEnv);
    }

    if (!result.success) {
        console.error('❌ Invalid environment variables:', result.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables:' + JSON.stringify(result.error.flatten().fieldErrors));
    }

    return result.data;
}

/**
 * Validated environment variables
 */
export const env = validateEnv();
