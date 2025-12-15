import { getDb } from '$lib/server/db/client';
import { threatLevels, newsArticles } from '$lib/server/db/schema';
import { desc, sql, gte, and, eq, count } from 'drizzle-orm';
import type { NewsCategory } from '$lib/types/news';

export interface ThreatTimelinePoint {
	date: string;
	level: number;
	levelName: string;
}

export interface NewsVolumePoint {
	date: string;
	count: number;
	category?: NewsCategory;
}

export interface StateDistribution {
	state: string;
	count: number;
	percentage: number;
}

export interface CategoryDistribution {
	category: NewsCategory;
	count: number;
	percentage: number;
}

export interface AnalyticsSummary {
	currentThreatLevel: number;
	currentThreatName: string;
	totalArticles: number;
	articlesLast24h: number;
	articlesLast7d: number;
	mostActiveState: string | null;
	dominantCategory: NewsCategory | null;
}

export interface AnalyticsData {
	summary: AnalyticsSummary;
	threatTimeline: ThreatTimelinePoint[];
	newsVolume: NewsVolumePoint[];
	stateDistribution: StateDistribution[];
	categoryDistribution: CategoryDistribution[];
}

const AUSTRALIAN_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

/**
 * Get threat level history for the timeline chart
 */
export async function getThreatTimeline(days: number = 90): Promise<ThreatTimelinePoint[]> {
	const db = getDb();
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);

	const results = await db
		.select({
			date: sql<string>`DATE(${threatLevels.scrapedAt})`.as('date'),
			level: threatLevels.levelNumber,
			levelName: threatLevels.levelName
		})
		.from(threatLevels)
		.where(gte(threatLevels.scrapedAt, cutoffDate))
		.orderBy(desc(threatLevels.scrapedAt))
		.limit(100);

	// Deduplicate by date, keeping latest entry per day
	const byDate = new Map<string, ThreatTimelinePoint>();
	for (const row of results) {
		if (!byDate.has(row.date)) {
			byDate.set(row.date, {
				date: row.date,
				level: row.level,
				levelName: row.levelName
			});
		}
	}

	return Array.from(byDate.values()).reverse();
}

/**
 * Get news article volume over time
 */
export async function getNewsVolume(days: number = 30): Promise<NewsVolumePoint[]> {
	const db = getDb();
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);

	const results = await db
		.select({
			date: sql<string>`DATE(${newsArticles.publishedAt})`.as('date'),
			count: count()
		})
		.from(newsArticles)
		.where(gte(newsArticles.publishedAt, cutoffDate))
		.groupBy(sql`DATE(${newsArticles.publishedAt})`)
		.orderBy(sql`DATE(${newsArticles.publishedAt})`);

	return results.map((row) => ({
		date: row.date,
		count: Number(row.count)
	}));
}

/**
 * Get news distribution by Australian state
 */
export async function getStateDistribution(days: number = 30): Promise<StateDistribution[]> {
	const db = getDb();
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);

	const results = await db
		.select({
			state: newsArticles.state,
			count: count()
		})
		.from(newsArticles)
		.where(
			and(gte(newsArticles.publishedAt, cutoffDate), sql`${newsArticles.state} IS NOT NULL`)
		)
		.groupBy(newsArticles.state);

	const total = results.reduce((sum, row) => sum + Number(row.count), 0);

	// Map to known Australian states and calculate percentages
	const stateMap = new Map<string, number>();
	for (const row of results) {
		const state = row.state?.toUpperCase() ?? 'OTHER';
		const normalizedState = AUSTRALIAN_STATES.includes(state as (typeof AUSTRALIAN_STATES)[number])
			? state
			: 'OTHER';
		stateMap.set(normalizedState, (stateMap.get(normalizedState) ?? 0) + Number(row.count));
	}

	return Array.from(stateMap.entries())
		.map(([state, count]) => ({
			state,
			count,
			percentage: total > 0 ? Math.round((count / total) * 100) : 0
		}))
		.sort((a, b) => b.count - a.count);
}

/**
 * Get news distribution by category
 */
export async function getCategoryDistribution(days: number = 30): Promise<CategoryDistribution[]> {
	const db = getDb();
	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);

	const results = await db
		.select({
			category: newsArticles.category,
			count: count()
		})
		.from(newsArticles)
		.where(gte(newsArticles.publishedAt, cutoffDate))
		.groupBy(newsArticles.category);

	const total = results.reduce((sum, row) => sum + Number(row.count), 0);

	return results
		.map((row) => ({
			category: row.category as NewsCategory,
			count: Number(row.count),
			percentage: total > 0 ? Math.round((Number(row.count) / total) * 100) : 0
		}))
		.sort((a, b) => b.count - a.count);
}

/**
 * Get analytics summary stats
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
	const db = getDb();
	const now = new Date();
	const yesterday = new Date(now);
	yesterday.setDate(yesterday.getDate() - 1);
	const weekAgo = new Date(now);
	weekAgo.setDate(weekAgo.getDate() - 7);

	// Get current threat level
	const [currentThreat] = await db
		.select({
			level: threatLevels.levelNumber,
			name: threatLevels.levelName
		})
		.from(threatLevels)
		.orderBy(desc(threatLevels.scrapedAt))
		.limit(1);

	// Get total articles
	const [totalResult] = await db.select({ count: count() }).from(newsArticles);

	// Get articles last 24h
	const [last24hResult] = await db
		.select({ count: count() })
		.from(newsArticles)
		.where(gte(newsArticles.publishedAt, yesterday));

	// Get articles last 7 days
	const [last7dResult] = await db
		.select({ count: count() })
		.from(newsArticles)
		.where(gte(newsArticles.publishedAt, weekAgo));

	// Get most active state (last 7 days)
	const stateResults = await db
		.select({
			state: newsArticles.state,
			count: count()
		})
		.from(newsArticles)
		.where(and(gte(newsArticles.publishedAt, weekAgo), sql`${newsArticles.state} IS NOT NULL`))
		.groupBy(newsArticles.state)
		.orderBy(desc(count()))
		.limit(1);

	// Get dominant category (last 7 days)
	const categoryResults = await db
		.select({
			category: newsArticles.category,
			count: count()
		})
		.from(newsArticles)
		.where(gte(newsArticles.publishedAt, weekAgo))
		.groupBy(newsArticles.category)
		.orderBy(desc(count()))
		.limit(1);

	return {
		currentThreatLevel: currentThreat?.level ?? 3,
		currentThreatName: currentThreat?.name ?? 'PROBABLE',
		totalArticles: Number(totalResult?.count ?? 0),
		articlesLast24h: Number(last24hResult?.count ?? 0),
		articlesLast7d: Number(last7dResult?.count ?? 0),
		mostActiveState: stateResults[0]?.state ?? null,
		dominantCategory: (categoryResults[0]?.category as NewsCategory) ?? null
	};
}

/**
 * Get complete analytics data bundle
 */
export async function getAnalyticsData(options?: {
	timelineDays?: number;
	volumeDays?: number;
	distributionDays?: number;
}): Promise<AnalyticsData> {
	const timelineDays = options?.timelineDays ?? 90;
	const volumeDays = options?.volumeDays ?? 30;
	const distributionDays = options?.distributionDays ?? 30;

	const [summary, threatTimeline, newsVolume, stateDistribution, categoryDistribution] =
		await Promise.all([
			getAnalyticsSummary(),
			getThreatTimeline(timelineDays),
			getNewsVolume(volumeDays),
			getStateDistribution(distributionDays),
			getCategoryDistribution(distributionDays)
		]);

	return {
		summary,
		threatTimeline,
		newsVolume,
		stateDistribution,
		categoryDistribution
	};
}
