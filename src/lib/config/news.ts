import type { NewsCategory } from '$lib/types/news';

export const NEWS_PAGE_SIZE = 12;
export const NEWS_DAYS_WINDOW = 30;

export const STATE_OPTIONS = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  incident: 'Incident',
  arrest: 'Arrest',
  policy: 'Policy',
  community: 'Community'
};
