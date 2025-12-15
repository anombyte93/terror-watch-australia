import type { RequestHandler } from '@sveltejs/kit';
import type { NewsCategory } from '$lib/types/news';
import { getRecentArticles, refreshAllFeeds } from '$lib/server/services/news-aggregator';

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const isCategory = (value: string | null): value is NewsCategory => {
  if (!value) return false;
  return ['incident', 'arrest', 'policy', 'community'].includes(value);
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const category = isCategory(url.searchParams.get('category'))
      ? (url.searchParams.get('category') as NewsCategory)
      : undefined;
    const state = url.searchParams.get('state') ?? undefined;
    const limit = parseNumber(url.searchParams.get('limit'), 20);
    const days = parseNumber(url.searchParams.get('days'), 7);

    const articles = await getRecentArticles({ category, state, limit, days });
    return new Response(JSON.stringify(articles), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to load articles', error);
    return new Response(JSON.stringify({ error: 'Failed to load articles' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
};

export const POST: RequestHandler = async () => {
  try {
    const stats = await refreshAllFeeds();
    return new Response(JSON.stringify({ status: 'ok', ...stats }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to refresh feeds', error);
    return new Response(JSON.stringify({ error: 'Failed to refresh feeds' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
};
