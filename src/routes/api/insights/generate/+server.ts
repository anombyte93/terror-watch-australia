import type { RequestHandler } from '@sveltejs/kit';
import { generateInsight, checkOllamaHealth, type InsightType } from '$lib/server/services/ai-insights';

interface GenerateRequest {
	type: InsightType;
	articleIds?: number[];
	maxArticles?: number;
}

const isValidType = (value: unknown): value is InsightType => {
	if (typeof value !== 'string') return false;
	return ['daily_summary', 'threat_context', 'trend'].includes(value);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Check Ollama availability first
		const health = await checkOllamaHealth();
		if (!health.available) {
			return new Response(
				JSON.stringify({
					error: 'AI service unavailable',
					details: health.error,
					model: health.model
				}),
				{
					status: 503,
					headers: { 'content-type': 'application/json' }
				}
			);
		}

		const body = (await request.json()) as GenerateRequest;

		if (!isValidType(body.type)) {
			return new Response(
				JSON.stringify({
					error: 'Invalid insight type',
					validTypes: ['daily_summary', 'threat_context', 'trend']
				}),
				{
					status: 400,
					headers: { 'content-type': 'application/json' }
				}
			);
		}

		const insight = await generateInsight({
			type: body.type,
			articleIds: body.articleIds,
			maxArticles: body.maxArticles
		});

		return new Response(JSON.stringify(insight), {
			status: 201,
			headers: { 'content-type': 'application/json' }
		});
	} catch (error) {
		console.error('Failed to generate insight:', error);

		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		return new Response(
			JSON.stringify({
				error: 'Failed to generate insight',
				details: errorMessage
			}),
			{
				status: 500,
				headers: { 'content-type': 'application/json' }
			}
		);
	}
};
