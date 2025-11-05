import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

export async function runMigrations(): Promise<void> {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}

	const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
	const migrationDb = drizzle(migrationClient);

	try {
		console.log('[Migration] Checking pending migrations...');

		await migrate(migrationDb, {
			migrationsFolder: './drizzle',
		});

		console.log('[Migration] ✅ All migrations applied successfully');
	} catch (error) {
		console.error('[Migration] ❌ Failed to apply migrations:', error);
		throw error;
	} finally {
		await migrationClient.end();
	}
}
