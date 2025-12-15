import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sources, threatLevels, type NewSource, type NewThreatLevel } from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is not set for seeding');
}

const client = postgres(connectionString, {
	max: 4,
	idle_timeout: 5,
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

const db = drizzle(client);

const seedSources: NewSource[] = [
	{
		name: 'ABC News',
		feedUrl: 'https://www.abc.net.au/news/feed/51120/rss.xml',
		isActive: true
	},
	{
		name: 'SBS News',
		feedUrl: 'https://www.sbs.com.au/rssfeed',
		isActive: true
	},
	{
		name: 'The Guardian Australia',
		feedUrl: 'https://www.theguardian.com/australia-news/terrorism/rss',
		isActive: true
	},
	{
		name: 'Sydney Morning Herald',
		feedUrl: 'https://www.smh.com.au/rss/national.xml',
		isActive: true
	},
	{
		name: 'news.com.au',
		feedUrl: 'https://www.news.com.au/content-feeds/latest-news-national/',
		isActive: true
	}
];

const threatLevelSourceUrl =
	'https://www.nationalsecurity.gov.au/national-terrorism-threat-advisory-system';

const seedThreatLevels: NewThreatLevel[] = [
	{
		levelNumber: 2,
		levelName: 'POSSIBLE',
		description: 'Stable posture with routine monitoring and no specific intelligence of concern.',
		scrapedAt: new Date('2024-07-01T00:00:00Z'),
		sourceUrl: threatLevelSourceUrl
	},
	{
		levelNumber: 3,
		levelName: 'PROBABLE',
		description:
			'Elevated chatter and regional incidents prompting increased situational awareness.',
		scrapedAt: new Date('2024-09-15T00:00:00Z'),
		sourceUrl: threatLevelSourceUrl
	},
	{
		levelNumber: 4,
		levelName: 'EXPECTED',
		description: 'Targeted warnings from partners suggest credible intent within the next month.',
		scrapedAt: new Date('2024-11-20T00:00:00Z'),
		sourceUrl: threatLevelSourceUrl
	},
	{
		levelNumber: 3,
		levelName: 'PROBABLE',
		description: 'Risk reassessed downward following mitigations and disrupted activity.',
		scrapedAt: new Date('2025-01-10T00:00:00Z'),
		sourceUrl: threatLevelSourceUrl
	},
	{
		levelNumber: 4,
		levelName: 'EXPECTED',
		description: 'Recent developments abroad increase the likelihood of attempted action.',
		scrapedAt: new Date('2025-02-28T00:00:00Z'),
		sourceUrl: threatLevelSourceUrl
	}
];

const seed = async () => {
	await db.transaction(async (tx) => {
		await tx.insert(sources).values(seedSources).onConflictDoNothing({ target: sources.feedUrl });

		for (const threat of seedThreatLevels) {
			const exists = await tx
				.select({ id: threatLevels.id })
				.from(threatLevels)
				.where(eq(threatLevels.scrapedAt, threat.scrapedAt));

			if (exists.length === 0) {
				await tx.insert(threatLevels).values(threat);
			}
		}
	});
};

seed()
	.then(() => {
		console.log('Seed data applied');
	})
	.catch((error) => {
		console.error('Seed failed', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await client.end({ timeout: 5 });
	});
