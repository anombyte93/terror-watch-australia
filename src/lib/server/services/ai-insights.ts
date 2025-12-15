import { db, aiInsights, newsArticles, type AiInsight, type NewAiInsight } from '$lib/server/db';
import { desc, gte, inArray, eq } from 'drizzle-orm';
import { readFile } from 'fs/promises';
import { join } from 'path';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:7b';

export type InsightType = 'daily_summary' | 'threat_context' | 'trend';

interface OllamaResponse {
	model: string;
	created_at: string;
	response: string;
	done: boolean;
}

interface GenerateOptions {
	type: InsightType;
	articleIds?: number[];
	maxArticles?: number;
}

/**
 * Load a prompt template from the prompts directory
 */
async function loadPromptTemplate(type: InsightType): Promise<string> {
	const promptFiles: Record<InsightType, string> = {
		daily_summary: 'daily-summary.txt',
		threat_context: 'threat-context.txt',
		trend: 'trend-detection.txt'
	};

	const filename = promptFiles[type];
	const promptPath = join(process.cwd(), 'src/lib/server/prompts', filename);

	try {
		return await readFile(promptPath, 'utf-8');
	} catch (error) {
		// Fallback prompts if files don't exist
		const fallbacks: Record<InsightType, string> = {
			daily_summary: `You are an Australian security analyst. Summarize these news articles about terrorism and security in Australia. Focus on key incidents, arrests, policy changes, and community impact. Be concise and factual.\n\nArticles:\n{{ARTICLES}}\n\nProvide a brief daily summary (3-5 bullet points):`,
			threat_context: `Analyze these Australian security-related news articles and provide context about the current threat environment. Consider patterns, geographic distribution, and any emerging concerns.\n\nArticles:\n{{ARTICLES}}\n\nProvide contextual analysis:`,
			trend: `Analyze these Australian security news articles for trends and patterns over time. Identify any escalation or de-escalation, geographic shifts, or changes in threat types.\n\nArticles:\n{{ARTICLES}}\n\nIdentify key trends:`
		};
		return fallbacks[type];
	}
}

/**
 * Format articles for inclusion in a prompt
 */
function formatArticlesForPrompt(articles: { title: string; summary: string | null; sourceName: string; publishedAt: Date }[]): string {
	return articles
		.map((a, i) => `${i + 1}. [${a.sourceName}] ${a.title}\n   ${a.summary || 'No summary available'}\n   Published: ${a.publishedAt.toLocaleDateString('en-AU')}`)
		.join('\n\n');
}

/**
 * Call Ollama API to generate text
 */
async function callOllama(prompt: string): Promise<string> {
	const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: OLLAMA_MODEL,
			prompt,
			stream: false,
			options: {
				temperature: 0.7,
				top_p: 0.9,
				num_predict: 1024
			}
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Ollama API error: ${response.status} ${errorText}`);
	}

	const data = (await response.json()) as OllamaResponse;
	return data.response.trim();
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaHealth(): Promise<{ available: boolean; model: string; error?: string }> {
	try {
		const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
			method: 'GET',
			signal: AbortSignal.timeout(5000)
		});

		if (!response.ok) {
			return { available: false, model: OLLAMA_MODEL, error: `HTTP ${response.status}` };
		}

		const data = await response.json();
		const models = data.models || [];
		const hasModel = models.some((m: { name: string }) => m.name.includes(OLLAMA_MODEL.split(':')[0]));

		return {
			available: true,
			model: OLLAMA_MODEL,
			error: hasModel ? undefined : `Model ${OLLAMA_MODEL} not found. Available: ${models.map((m: { name: string }) => m.name).join(', ')}`
		};
	} catch (error) {
		return {
			available: false,
			model: OLLAMA_MODEL,
			error: error instanceof Error ? error.message : 'Connection failed'
		};
	}
}

/**
 * Generate a new AI insight
 */
export async function generateInsight(options: GenerateOptions): Promise<AiInsight> {
	const { type, articleIds, maxArticles = 20 } = options;

	// Fetch articles
	let articles;
	if (articleIds && articleIds.length > 0) {
		articles = await db
			.select({
				id: newsArticles.id,
				title: newsArticles.title,
				summary: newsArticles.summary,
				sourceName: newsArticles.sourceName,
				publishedAt: newsArticles.publishedAt
			})
			.from(newsArticles)
			.where(inArray(newsArticles.id, articleIds))
			.orderBy(desc(newsArticles.publishedAt))
			.limit(maxArticles);
	} else {
		// Get recent articles (last 24 hours for daily summary, 7 days for others)
		const cutoffHours = type === 'daily_summary' ? 24 : 168;
		const cutoffDate = new Date();
		cutoffDate.setHours(cutoffDate.getHours() - cutoffHours);

		articles = await db
			.select({
				id: newsArticles.id,
				title: newsArticles.title,
				summary: newsArticles.summary,
				sourceName: newsArticles.sourceName,
				publishedAt: newsArticles.publishedAt
			})
			.from(newsArticles)
			.where(gte(newsArticles.publishedAt, cutoffDate))
			.orderBy(desc(newsArticles.publishedAt))
			.limit(maxArticles);
	}

	if (articles.length === 0) {
		throw new Error('No articles found for insight generation');
	}

	// Load prompt template and inject articles
	const template = await loadPromptTemplate(type);
	const formattedArticles = formatArticlesForPrompt(articles);
	const prompt = template.replace('{{ARTICLES}}', formattedArticles);

	// Generate insight via Ollama
	const content = await callOllama(prompt);

	// Save to database
	const newInsight: NewAiInsight = {
		insightType: type,
		content,
		sources: articles.map((a) => a.id),
		generatedAt: new Date(),
		modelUsed: OLLAMA_MODEL
	};

	const [inserted] = await db.insert(aiInsights).values(newInsight).returning();
	return inserted;
}

/**
 * Get recent insights
 */
export async function getRecentInsights(options?: {
	type?: InsightType;
	limit?: number;
	since?: Date;
}): Promise<AiInsight[]> {
	const { type, limit = 10, since } = options || {};

	let query = db.select().from(aiInsights);

	const conditions = [];
	if (type) {
		conditions.push(eq(aiInsights.insightType, type));
	}
	if (since) {
		conditions.push(gte(aiInsights.generatedAt, since));
	}

	if (conditions.length === 1) {
		query = query.where(conditions[0]) as typeof query;
	} else if (conditions.length > 1) {
		// @ts-expect-error - drizzle typing issue with dynamic conditions
		query = query.where(...conditions);
	}

	return query.orderBy(desc(aiInsights.generatedAt)).limit(limit);
}

/**
 * Get a specific insight by ID
 */
export async function getInsightById(id: number): Promise<AiInsight | null> {
	const [insight] = await db.select().from(aiInsights).where(eq(aiInsights.id, id)).limit(1);
	return insight || null;
}

/**
 * Get the latest insight of each type
 */
export async function getLatestInsights(): Promise<Record<InsightType, AiInsight | null>> {
	const types: InsightType[] = ['daily_summary', 'threat_context', 'trend'];
	const result: Record<InsightType, AiInsight | null> = {
		daily_summary: null,
		threat_context: null,
		trend: null
	};

	for (const type of types) {
		const [insight] = await db
			.select()
			.from(aiInsights)
			.where(eq(aiInsights.insightType, type))
			.orderBy(desc(aiInsights.generatedAt))
			.limit(1);

		result[type] = insight || null;
	}

	return result;
}
