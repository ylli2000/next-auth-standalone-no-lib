import { env } from '@/lib/env/envSchema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

// Initialize the Neon client and Drizzle ORM
const sql = neon(env.DATABASE_URL);
const db = drizzle(sql);

// Run migrations
async function main() {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './src/lib/drizzle/migrations' });
    console.log('Migrations completed!');
    process.exit(0);
}

main().catch((err) => {
    console.error('Migration failed');
    console.error(err);
    process.exit(1);
});
