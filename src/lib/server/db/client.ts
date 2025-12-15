import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

type PostgresClient = ReturnType<typeof postgres>;

let client: PostgresClient | null = null;

/**
 * Lazily create and reuse a database connection for server-side requests.
 * Throws if DATABASE_URL is missing to avoid silent misconfiguration.
 */
export const getDb = () => {
	if (!client) {
		const databaseUrl = process.env.DATABASE_URL;

		if (!databaseUrl) {
			throw new Error('DATABASE_URL is not set. Update your environment configuration.');
		}

		client = postgres(databaseUrl, { prepare: false });
	}

	return drizzle(client);
};
