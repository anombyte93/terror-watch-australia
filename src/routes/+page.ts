import type { PageLoad } from './$types';
import type { ThreatLevel } from '$lib/types/threat';

const STALE_AFTER_MS = 1000 * 60 * 60 * 6; // 6 hours

export const load: PageLoad = async ({ fetch, parent }) => {
	// Get data from +page.server.ts (includes threatLevel and newsItems)
	const parentData = await parent();

	try {
		const response = await fetch('/api/threat-level', {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			return {
				...parentData,
				threat: null,
				error: 'Unable to load the current threat level right now.',
				isStale: false
			};
		}

		const json = await response.json();
		const threat: ThreatLevel = {
			...json,
			fetchedAt: new Date(json.fetchedAt)
		};

		const isStale =
			Date.now() - threat.fetchedAt.getTime() > STALE_AFTER_MS ||
			threat.source === 'database' ||
			threat.source === 'fallback';

		return { ...parentData, threat, error: null, isStale };
	} catch (error) {
		console.error('Failed to load threat level', error);
		return {
			...parentData,
			threat: null,
			error: 'Unable to load the current threat level right now.',
			isStale: false
		};
	}
};
