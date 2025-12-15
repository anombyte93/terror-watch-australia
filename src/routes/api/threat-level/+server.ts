import { json, type RequestHandler } from '@sveltejs/kit';
import { getThreatLevel } from '$lib/server/services/threat-scraper';

const ONE_HOUR_SECONDS = 60 * 60;

export const GET: RequestHandler = async () => {
	try {
		const threat = await getThreatLevel();

		return json(
			{
				...threat,
				fetchedAt: threat.fetchedAt.toISOString()
			},
			{
				headers: {
					'Cache-Control': `public, max-age=${ONE_HOUR_SECONDS}, stale-while-revalidate=${ONE_HOUR_SECONDS}`
				}
			}
		);
	} catch (error) {
		console.error('[threat][api] Failed to return threat level', error);

		return json(
			{
				error: 'Unable to retrieve threat level at this time'
			},
			{
				status: 503,
				headers: {
					'Cache-Control': 'public, max-age=300'
				}
			}
		);
	}
};
