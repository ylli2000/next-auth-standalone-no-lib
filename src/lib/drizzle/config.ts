import { env } from '@/lib/env/envSchema';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/lib/drizzle/tableSchema.ts',
    out: './src/lib/drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: env.DATABASE_URL
    }
});
