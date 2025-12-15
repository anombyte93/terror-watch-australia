import type { PageServerLoad } from './$types';
import { getAnalyticsData } from '$lib/server/services/analytics';

export const load: PageServerLoad = async ({ url }) => {
	const timelineDays = parseInt(url.searchParams.get('timelineDays') ?? '90', 10) || 90;
	const volumeDays = parseInt(url.searchParams.get('volumeDays') ?? '30', 10) || 30;
	const distributionDays = parseInt(url.searchParams.get('distributionDays') ?? '30', 10) || 30;

	const analytics = await getAnalyticsData({
		timelineDays: Math.min(timelineDays, 365),
		volumeDays: Math.min(volumeDays, 90),
		distributionDays: Math.min(distributionDays, 90)
	});

	return {
		analytics
	};
};
