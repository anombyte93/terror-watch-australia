import postgres from 'postgres';
import type { ThreatLevel } from '$lib/types/threat';

type SqlClient = ReturnType<typeof postgres>;

let client: SqlClient | null = null;

const ensureClient = (): SqlClient | null => {
	if (client) return client;
	if (!process.env.DATABASE_URL) return null;

	try {
		client = postgres(process.env.DATABASE_URL, {
			max: 1,
			idle_timeout: 5,
			connect_timeout: 10,
			ssl: 'prefer'
		});
		return client;
	} catch (error) {
		console.error('[threat][db] Failed to initialize database client', error);
		return null;
	}
};

const ensureTable = async (sql: SqlClient) => {
	// Table is created via Drizzle migrations with correct schema
	// This is just a safety check - table should already exist
	await sql`
		CREATE TABLE IF NOT EXISTS threat_levels (
			id SERIAL PRIMARY KEY,
			level_number INTEGER NOT NULL CHECK (level_number BETWEEN 1 AND 5),
			level_name TEXT NOT NULL,
			description TEXT NOT NULL,
			scraped_at TIMESTAMPTZ NOT NULL,
			source_url VARCHAR(1024) NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;
};

export const loadLatestThreatLevel = async (): Promise<ThreatLevel | null> => {
	const sql = ensureClient();
	if (!sql) return null;

	try {
		await ensureTable(sql);
		const rows = await sql<
			{ level_number: number; level_name: string; description: string; source_url: string; scraped_at: Date }[]
		>`
				SELECT level_number, level_name, description, source_url, scraped_at
				FROM threat_levels
				ORDER BY scraped_at DESC
				LIMIT 1
			`;

		if (!rows.length) {
			return null;
		}

		const [latest] = rows;
		return {
			level: latest.level_number,
			name: latest.level_name,
			description: latest.description,
			link: latest.source_url,
			fetchedAt: new Date(latest.scraped_at),
			source: 'database'
		};
	} catch (error) {
		console.error('[threat][db] Failed to load latest threat level', error);
		return null;
	}
};

export const recordThreatLevel = async (threat: ThreatLevel): Promise<void> => {
	const sql = ensureClient();
	if (!sql) return;

	try {
		await ensureTable(sql);
		await sql`
			INSERT INTO threat_levels (level_number, level_name, description, source_url, scraped_at)
			VALUES (${threat.level}, ${threat.name}, ${threat.description}, ${threat.link}, ${threat.fetchedAt})
		`;
	} catch (error) {
		console.error('[threat][db] Failed to record threat level', error);
	}
};
