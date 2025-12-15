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
	await sql`
		CREATE TABLE IF NOT EXISTS threat_levels (
			id SERIAL PRIMARY KEY,
			level INTEGER NOT NULL,
			name TEXT NOT NULL,
			description TEXT NOT NULL,
			link TEXT NOT NULL,
			fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;
};

export const loadLatestThreatLevel = async (): Promise<ThreatLevel | null> => {
	const sql = ensureClient();
	if (!sql) return null;

	try {
		await ensureTable(sql);
		const rows = await sql<
			{ level: number; name: string; description: string; link: string; fetched_at: Date }[]
		>`
				SELECT level, name, description, link, fetched_at
				FROM threat_levels
				ORDER BY fetched_at DESC
				LIMIT 1
			`;

		if (!rows.length) {
			return null;
		}

		const [latest] = rows;
		return {
			level: latest.level,
			name: latest.name,
			description: latest.description,
			link: latest.link,
			fetchedAt: new Date(latest.fetched_at),
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
			INSERT INTO threat_levels (level, name, description, link, fetched_at)
			VALUES (${threat.level}, ${threat.name}, ${threat.description}, ${threat.link}, ${threat.fetchedAt})
		`;
	} catch (error) {
		console.error('[threat][db] Failed to record threat level', error);
	}
};
