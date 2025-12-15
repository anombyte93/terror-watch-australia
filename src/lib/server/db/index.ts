import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const client = postgres(connectionString, {
	max: 10,
	idle_timeout: 5,
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

export const db = drizzle(client, { schema });
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
