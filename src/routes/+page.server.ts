import type { PageServerLoad } from './$types';
import { getThreatLevel } from '$lib/server/services/threat-scraper';
import { getRecentArticles, refreshAllFeeds } from '$lib/server/services/news-aggregator';

export const load: PageServerLoad = async () => {
	// Trigger a news refresh on page load (non-blocking)
	refreshAllFeeds().catch((err) => console.error('Failed to refresh feeds:', err));

	// Load threat level and recent news in parallel
	const [threatData, articles] = await Promise.all([
		getThreatLevel().catch((err) => {
			console.error('Failed to fetch threat level:', err);
			return null;
		}),
		getRecentArticles({ limit: 10, days: 7 }).catch((err) => {
			console.error('Failed to fetch news:', err);
			return [];
		})
	]);

	// Map threat level to the format expected by components
	const threatLevel = threatData
		? {
				level: threatData.level,
				label: threatData.name.toUpperCase(),
				description: threatData.description || 'Current threat assessment for Australia.',
				lastUpdated: threatData.fetchedAt.toLocaleString('en-AU', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					timeZoneName: 'short'
				}),
				message: 'Stay vigilant and report suspicious activity to the National Security Hotline.',
				tone: `level-${threatData.level}` as const
			}
		: {
				level: 3,
				label: 'PROBABLE',
				description: 'Unable to fetch current threat level. Default shown.',
				lastUpdated: new Date().toLocaleString('en-AU'),
				message: 'Stay vigilant and report suspicious activity.',
				tone: 'level-3' as const
			};

	// Map articles to the format expected by components
	const newsItems = articles.map((article) => ({
		id: article.id,
		title: article.title,
		summary: article.summary || article.title,
		time: new Date(article.published_at).toLocaleDateString('en-AU', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}),
		category: article.category || 'general',
		url: article.url,
		source: article.source
	}));

	return {
		threatLevel,
		newsItems
	};
};
