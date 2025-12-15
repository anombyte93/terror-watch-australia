import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Lazy database connection - only connect when actually used
let _db: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> {
	if (_db) return _db;

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error('DATABASE_URL is not set');
	}

	const client = postgres(connectionString, {
		max: 10,
		idle_timeout: 5,
		ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
	});

	_db = drizzle(client, { schema });
	return _db;
}

// Export as getter for lazy initialization
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
	get(_, prop) {
		const instance = getDb();
		return (instance as unknown as Record<string | symbol, unknown>)[prop];
	}
});

export { schema };

export {
	threatLevels,
	newsArticles,
	aiInsights,
	sources,
	threatLevelNameEnum,
	newsCategoryEnum,
	aiInsightTypeEnum,
	type ThreatLevel,
	type NewThreatLevel,
	type NewsArticle,
	type NewNewsArticle,
	type AiInsight,
	type NewAiInsight,
	type Source,
	type NewSource
} from './schema';
