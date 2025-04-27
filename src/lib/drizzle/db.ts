import { env } from '@/lib/env/envSchema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './tableSchema';

// For use in Node.js environments
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });

// Helper function to close database connection
export async function closeConnection() {
    await client.end();
}
