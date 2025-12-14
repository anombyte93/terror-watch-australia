# Task 2: Database Schema & Migrations

## Context
- Project: Terror Watch Australia
- Location: /home/anombyte/Projects/in-progress/terror
- Reference: GIGA_PRD.md
- Depends on: Task 1 (project structure exists)

## Goal
Design and implement PostgreSQL schema using Drizzle ORM.

## Requirements
1. Create Drizzle schema in `src/lib/server/db/schema.ts`:

```typescript
// threat_levels table
- id: serial primary key
- level_number: integer (1-5)
- level_name: varchar (NOT_EXPECTED, POSSIBLE, PROBABLE, EXPECTED, CERTAIN)
- description: text
- scraped_at: timestamp
- source_url: varchar
- created_at: timestamp default now()

// news_articles table
- id: serial primary key
- title: varchar
- summary: text (nullable, AI-generated)
- source_name: varchar (ABC, SBS, Guardian, etc.)
- source_url: varchar unique
- published_at: timestamp
- category: varchar (incident, arrest, policy, community)
- state: varchar (nullable - NSW, VIC, etc.)
- scraped_at: timestamp
- created_at: timestamp

// ai_insights table
- id: serial primary key
- insight_type: varchar (daily_summary, threat_context, trend)
- content: text
- sources: jsonb (array of article IDs)
- generated_at: timestamp
- model_used: varchar
- created_at: timestamp

// sources table (RSS feed config)
- id: serial primary key
- name: varchar
- feed_url: varchar
- is_active: boolean default true
- last_fetched: timestamp
```

2. Create Drizzle config `drizzle.config.ts`
3. Create database connection in `src/lib/server/db/index.ts`
4. Add npm scripts:
   - `db:generate` - Generate migrations
   - `db:migrate` - Run migrations
   - `db:studio` - Open Drizzle Studio
5. Create seed data file with:
   - Initial RSS sources (ABC, SBS, Guardian, SMH, news.com.au)
   - Historical threat levels (last 5 changes)

## Acceptance Criteria
- [ ] `npm run db:generate` creates migration files
- [ ] Schema includes all 4 tables with proper relations
- [ ] Indexes on: news_articles.published_at, news_articles.category, threat_levels.scraped_at
- [ ] Seed script works with `npm run db:seed`

## On Completion
1. Run `npm run db:generate`
2. Verify migration files exist in `drizzle/` folder
3. Commit: "Task 2: Drizzle ORM schema and migrations"
4. Create `.sprint-complete.json`
