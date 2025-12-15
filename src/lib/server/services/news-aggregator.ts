import Parser from 'rss-parser';
import { and, desc, eq, gte, inArray } from 'drizzle-orm';
import { db, newsArticles, sources, type NewNewsArticle, type NewsArticle } from '$lib/server/db';
import type { NewsCategory, RawFeedArticle, SourceConfig, StoredArticle } from '$lib/types/news';

const parser = new Parser();

export const SOURCES: SourceConfig[] = [
  // ABC News - Latest news feed
  { name: 'ABC News', url: 'https://www.abc.net.au/news/feed/2942460/rss.xml' },
  // ABC News - Just In (breaking news)
  { name: 'ABC Just In', url: 'https://www.abc.net.au/news/feed/45910/rss.xml' },
  // SBS News - World News
  { name: 'SBS News', url: 'https://www.sbs.com.au/news/topic/world/feed' },
  // The Guardian Australia
  { name: 'The Guardian AU', url: 'https://www.theguardian.com/australia-news/rss' },
  // SMH - National news
  { name: 'SMH', url: 'https://www.smh.com.au/rss/national.xml' },
  // 9News Australia
  { name: '9News', url: 'https://www.9news.com.au/rss' }
];

// Primary keywords - terrorism and national security (high priority)
const PRIMARY_KEYWORDS = [
  'terrorism',
  'terrorist',
  'terror attack',
  'asio',
  'national security',
  'threat level',
  'extremist',
  'extremism',
  'radicalisation',
  'bomb threat',
  'explosive',
  'hostage',
  'security threat',
  'counter-terrorism',
  'counter terrorism',
  'islamic state',
  'isis',
  'al-qaeda',
  'afp',
  'australian federal police',
  'security alert',
  'security warning'
];

// Secondary keywords - general security and crime (lower priority, used as fallback)
const SECONDARY_KEYWORDS = [
  'police',
  'crime',
  'arrest',
  'attack',
  'shooting',
  'stabbing',
  'incident',
  'emergency',
  'security',
  'safety',
  'warning',
  'alert',
  'investigation',
  'suspect',
  'detained',
  'charged',
  'court',
  'threat',
  'dangerous',
  'manhunt',
  'lockdown',
  'evacuation'
];

// Combined for relevance check
const KEYWORDS = [...PRIMARY_KEYWORDS, ...SECONDARY_KEYWORDS];

const STATE_PATTERNS: Record<string, string[]> = {
  NSW: ['nsw', 'new south wales', 'sydney', 'wollongong', 'newcastle'],
  VIC: ['vic', 'victoria', 'melbourne', 'geelong'],
  QLD: ['qld', 'queensland', 'brisbane', 'gold coast', 'cairns'],
  WA: ['wa', 'western australia', 'perth'],
  SA: ['sa', 'south australia', 'adelaide'],
  TAS: ['tas', 'tasmania', 'hobart'],
  NT: ['nt', 'northern territory', 'darwin', 'alice springs'],
  ACT: ['act', 'canberra', 'australian capital territory']
};

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();

const levenshtein = (a: string, b: string) => {
  if (a === b) return 0;
  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
};

const titleSimilarity = (first: string, second: string) => {
  const a = normalize(first);
  const b = normalize(second);
  if (!a.length || !b.length) return 0;
  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return 1 - distance / maxLen;
};

const isRelevant = (article: RawFeedArticle) => {
  const haystack = `${article.title} ${article.content}`.toLowerCase();
  return KEYWORDS.some((keyword) => haystack.includes(keyword));
};

export async function fetchFeed(source: SourceConfig): Promise<RawFeedArticle[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const items = feed.items ?? [];
    return items
      .map((item) => ({
        title: item.title?.trim() ?? 'Untitled',
        url: item.link ?? item.guid ?? '',
        content: normalize(
          [
            item.contentSnippet,
            typeof item.content === 'string' ? item.content : '',
            item.summary ?? ''
          ]
            .filter(Boolean)
            .join(' ')
        ),
        publishedAt: item.isoDate
          ? new Date(item.isoDate)
          : item.pubDate
            ? new Date(item.pubDate)
            : new Date(),
        source: source.name
      }))
      .filter((item) => item.url.length > 0);
  } catch (error) {
    console.error(`Failed to fetch feed for ${source.name}`, error);
    return [];
  }
}

export async function fetchAllFeeds(): Promise<RawFeedArticle[]> {
  const results = await Promise.allSettled(SOURCES.map((source) => fetchFeed(source)));
  const articles: RawFeedArticle[] = [];

  results.forEach((result, index) => {
    const source = SOURCES[index];
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    } else {
      console.error(`Feed failure for ${source.name}:`, result.reason);
    }
  });

  return articles;
}

export function filterRelevantArticles(articles: RawFeedArticle[]): RawFeedArticle[] {
  return articles.filter(isRelevant);
}

const deduplicateArticles = (articles: RawFeedArticle[]): RawFeedArticle[] => {
  const seenUrls = new Set<string>();
  const filtered: RawFeedArticle[] = [];

  for (const article of articles) {
    if (seenUrls.has(article.url)) continue;
    const similarTitle = filtered.find(
      (existing) => titleSimilarity(existing.title, article.title) > 0.9
    );
    if (similarTitle) continue;

    seenUrls.add(article.url);
    filtered.push(article);
  }

  return filtered;
};

export function categorizeArticle(title: string, content: string): NewsCategory {
  const text = normalize(`${title} ${content}`);

  if (/(arrest|charged|custody|court|bail|sentenced|detained)/.test(text)) return 'arrest';
  if (
    /(attack|bomb|explosion|stabbing|shooting|hostage|incident|plot|attempted|device)/.test(text)
  )
    return 'incident';
  if (/(policy|law|bill|legislation|government|minister|parliament|strategy)/.test(text))
    return 'policy';
  if (/(community|awareness|safety|campaign|program|training|outreach|education)/.test(text))
    return 'community';

  return 'general';
}

const extractState = (title: string, content: string): string | null => {
  const text = normalize(`${title} ${content}`);
  for (const [state, patterns] of Object.entries(STATE_PATTERNS)) {
    if (patterns.some((pattern) => text.includes(pattern))) {
      return state;
    }
  }
  return null;
};

const ensureSources = async () => {
  await Promise.all(
    SOURCES.map((source) =>
      db
        .insert(sources)
        .values({
          name: source.name,
          feedUrl: source.url
        })
        .onConflictDoNothing()
    )
  );
};

const storeArticles = async (articles: RawFeedArticle[]) => {
  if (!articles.length) return 0;

  const urls = articles.map((article) => article.url);
  const existing = await db
    .select({ url: newsArticles.sourceUrl })
    .from(newsArticles)
    .where(inArray(newsArticles.sourceUrl, urls));

  const existingUrls = new Set(existing.map((row) => row.url));

  const now = new Date();
  const records: NewNewsArticle[] = articles
    .filter((article) => !existingUrls.has(article.url))
    .map((article) => {
      const category = categorizeArticle(article.title, article.content);
      const state = extractState(article.title, article.content);

      return {
        title: article.title,
        summary: null,
        sourceName: article.source,
        sourceUrl: article.url,
        publishedAt: article.publishedAt,
        category,
        state,
        scrapedAt: now
      };
    });

  if (!records.length) return 0;

  await db.insert(newsArticles).values(records).onConflictDoNothing();
  return records.length;
};

export async function refreshAllFeeds() {
  await ensureSources();

  const fetched = await fetchAllFeeds();
  const relevant = filterRelevantArticles(fetched);
  const deduped = deduplicateArticles(relevant);

  const inserted = await storeArticles(deduped);

  return { fetched: fetched.length, relevant: relevant.length, inserted };
}

export async function getRecentArticles(params: {
  days?: number;
  category?: NewsCategory;
  state?: string;
  limit?: number;
}): Promise<StoredArticle[]> {
  const days = params.days ?? 7;
  const limit = params.limit ?? 20;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const conditions = [gte(newsArticles.publishedAt, cutoff)];
  if (params.category) {
    conditions.push(eq(newsArticles.category, params.category));
  }
  if (params.state) {
    conditions.push(eq(newsArticles.state, params.state));
  }

  const rows: NewsArticle[] = await db
    .select()
    .from(newsArticles)
    .where(and(...conditions))
    .orderBy(desc(newsArticles.publishedAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id ?? 0,
    title: row.title,
    summary: row.summary ?? null,
    source: row.sourceName,
    url: row.sourceUrl,
    published_at: new Date(row.publishedAt).toISOString(),
    category: row.category as NewsCategory,
    state: row.state ?? null
  }));
}
