import type { RequestHandler } from '@sveltejs/kit';
import {
	getRecentInsights,
	getLatestInsights,
	getInsightById,
	checkOllamaHealth,
	type InsightType
} from '$lib/server/services/ai-insights';

const isValidType = (value: string | null): value is InsightType => {
	if (!value) return false;
	return ['daily_summary', 'threat_context', 'trend'].includes(value);
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const type = url.searchParams.get('type');
		const latest = url.searchParams.get('latest') === 'true';
		const id = url.searchParams.get('id');
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 50);
		const healthCheck = url.searchParams.get('health') === 'true';

		// Health check endpoint
		if (healthCheck) {
			const health = await checkOllamaHealth();
			return new Response(JSON.stringify(health), {
				headers: { 'content-type': 'application/json' }
			});
		}

		// Get specific insight by ID
		if (id) {
			const insight = await getInsightById(parseInt(id, 10));
			if (!insight) {
				return new Response(JSON.stringify({ error: 'Insight not found' }), {
					status: 404,
					headers: { 'content-type': 'application/json' }
				});
			}
			return new Response(JSON.stringify(insight), {
				headers: { 'content-type': 'application/json' }
			});
		}

		// Get latest of each type
		if (latest) {
			const insights = await getLatestInsights();
			return new Response(JSON.stringify(insights), {
				headers: { 'content-type': 'application/json' }
			});
		}

		// Get recent insights with optional type filter
		const insights = await getRecentInsights({
			type: isValidType(type) ? type : undefined,
			limit
		});

		return new Response(JSON.stringify(insights), {
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('Failed to fetch insights:', error);
		return new Response(
			JSON.stringify({ error: 'Failed to fetch insights' }),
			{
				status: 500,
				headers: { 'content-type': 'application/json' }
			}
		);
	}
};
