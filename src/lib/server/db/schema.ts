import {
	boolean,
	check,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const threatLevelNameEnum = pgEnum('threat_level_name', [
	'NOT_EXPECTED',
	'POSSIBLE',
	'PROBABLE',
	'EXPECTED',
	'CERTAIN'
]);

export const newsCategoryEnum = pgEnum('news_category', ['incident', 'arrest', 'policy', 'community']);

export const aiInsightTypeEnum = pgEnum('ai_insight_type', ['daily_summary', 'threat_context', 'trend']);

export const threatLevels = pgTable(
	'threat_levels',
	{
		id: serial('id').primaryKey(),
		levelNumber: integer('level_number').notNull(),
		levelName: threatLevelNameEnum('level_name').notNull(),
		description: text('description').notNull(),
		scrapedAt: timestamp('scraped_at', { withTimezone: true }).notNull(),
		sourceUrl: varchar('source_url', { length: 1024 }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => ({
		levelNumberRange: check('threat_levels_level_number_range', sql`${table.levelNumber} BETWEEN 1 AND 5`),
		scrapedAtIdx: index('threat_levels_scraped_at_idx').on(table.scrapedAt)
	})
);

export const newsArticles = pgTable(
	'news_articles',
	{
		id: serial('id').primaryKey(),
		title: varchar('title', { length: 512 }).notNull(),
		summary: text('summary'),
		sourceName: varchar('source_name', { length: 128 }).notNull(),
		sourceUrl: varchar('source_url', { length: 2048 }).notNull(),
		publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
		category: newsCategoryEnum('category').notNull(),
		state: varchar('state', { length: 32 }),
		scrapedAt: timestamp('scraped_at', { withTimezone: true }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => ({
		sourceUrlKey: uniqueIndex('news_articles_source_url_key').on(table.sourceUrl),
		publishedAtIdx: index('news_articles_published_at_idx').on(table.publishedAt),
		categoryIdx: index('news_articles_category_idx').on(table.category)
	})
);

export const aiInsights = pgTable('ai_insights', {
	id: serial('id').primaryKey(),
	insightType: aiInsightTypeEnum('insight_type').notNull(),
	content: text('content').notNull(),
	sources: jsonb('sources').$type<number[]>().notNull(),
	generatedAt: timestamp('generated_at', { withTimezone: true }).notNull(),
	modelUsed: varchar('model_used', { length: 128 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const sources = pgTable(
	'sources',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 128 }).notNull(),
		feedUrl: varchar('feed_url', { length: 2048 }).notNull(),
		isActive: boolean('is_active').default(true).notNull(),
		lastFetched: timestamp('last_fetched', { withTimezone: true })
	},
	(table) => ({
		feedUrlKey: uniqueIndex('sources_feed_url_key').on(table.feedUrl)
	})
);

export type ThreatLevel = typeof threatLevels.$inferSelect;
export type NewThreatLevel = typeof threatLevels.$inferInsert;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type NewNewsArticle = typeof newsArticles.$inferInsert;

export type AiInsight = typeof aiInsights.$inferSelect;
export type NewAiInsight = typeof aiInsights.$inferInsert;

export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;
