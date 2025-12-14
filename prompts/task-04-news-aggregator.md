# Task 4: News Aggregator Service

## Context
- Project: Terror Watch Australia
- Location: /home/anombyte/Projects/in-progress/terror
- Reference: GIGA_PRD.md

## Goal
Create a service that aggregates terrorism-related news from Australian sources via RSS feeds.

## RSS Feed Sources
```typescript
const SOURCES = [
  { name: 'ABC News', url: 'https://www.abc.net.au/news/feed/51120/rss.xml' },
  { name: 'SBS News', url: 'https://www.sbs.com.au/news/topic/australia/feed' },
  { name: 'The Guardian AU', url: 'https://www.theguardian.com/australia-news/rss' },
  { name: 'SMH', url: 'https://www.smh.com.au/rss/feed.xml' },
  { name: 'news.com.au', url: 'https://www.news.com.au/content-feeds/latest-news-national/' }
];
```

## Requirements
1. Create RSS parser service at `src/lib/server/services/news-aggregator.ts`:
   - Install `rss-parser` package
   - Function `fetchFeed(source)` - fetches single RSS feed
   - Function `fetchAllFeeds()` - fetches all sources in parallel
   - Function `filterRelevantArticles(articles)` - filters by keywords

2. Keyword filtering (case-insensitive):
```typescript
const KEYWORDS = [
  'terrorism', 'terrorist', 'terror attack',
  'ASIO', 'national security', 'threat level',
  'extremist', 'extremism', 'radicalisation',
  'bomb', 'explosive', 'hostage',
  'security threat', 'counter-terrorism',
  'Islamic State', 'ISIS', 'Al-Qaeda'
];
```

3. Deduplication:
   - By URL (exact match)
   - By title similarity (>90% match using simple comparison)

4. Categorization function:
```typescript
function categorizeArticle(title: string, content: string): Category {
  // 'incident' - actual attacks or attempts
  // 'arrest' - terrorism-related arrests
  // 'policy' - government announcements, laws
  // 'community' - community safety, awareness
}
```

5. State/territory extraction:
   - Extract location from title/content
   - Map to: NSW, VIC, QLD, WA, SA, TAS, NT, ACT, or null

6. Create API endpoint `src/routes/api/news/+server.ts`:
   - GET returns recent articles (last 7 days default)
   - Query params: `?category=incident&state=NSW&limit=20`
   - Sorted by published_at descending

7. Create scheduled refresh mechanism:
   - Function to refresh all feeds
   - Store new articles in database
   - Can be triggered via API or cron

## Acceptance Criteria
- [ ] `GET /api/news` returns array of articles
- [ ] Filters work: category, state, limit
- [ ] Deduplication prevents duplicate articles
- [ ] Each article has: title, source, url, published_at, category
- [ ] Handles RSS feed errors gracefully

## On Completion
1. Test with `curl "http://localhost:5173/api/news?limit=5"`
2. Verify articles are filtered and categorized
3. Commit: "Task 4: News aggregator service with RSS feeds"
4. Create `.sprint-complete.json`
