import type { RequestHandler } from '@sveltejs/kit';
import { getAnalyticsData } from '$lib/server/services/analytics';

const parseNumber = (value: string | null, fallback: number, max: number = 365) => {
	if (!value) return fallback;
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 && parsed <= max ? parsed : fallback;
};

export const GET: RequestHandler = async ({ url }) => {
	try {
		const timelineDays = parseNumber(url.searchParams.get('timelineDays'), 90, 365);
		const volumeDays = parseNumber(url.searchParams.get('volumeDays'), 30, 90);
		const distributionDays = parseNumber(url.searchParams.get('distributionDays'), 30, 90);

		const data = await getAnalyticsData({
			timelineDays,
			volumeDays,
			distributionDays
		});

		return new Response(JSON.stringify(data), {
			headers: {
				'content-type': 'application/json',
				'cache-control': 'public, max-age=300' // 5 minute cache
			}
		});
	} catch (error) {
		console.error('Failed to load analytics data', error);
		return new Response(JSON.stringify({ error: 'Failed to load analytics data' }), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
};
