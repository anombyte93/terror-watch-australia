import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
  console.log('Running migrations...');

  try {
    // Check if tables exist
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log('Existing tables:', tables.map(t => t.table_name));

    // Run individual CREATE statements only for missing tables
    if (!tables.some(t => t.table_name === 'news_articles')) {
      console.log('Creating missing tables...');

      // Create enums if they don't exist
      try {
        await sql.unsafe(`CREATE TYPE "public"."ai_insight_type" AS ENUM('daily_summary', 'threat_context', 'trend')`);
        console.log('Created ai_insight_type enum');
      } catch (e) { console.log('ai_insight_type already exists'); }

      try {
        await sql.unsafe(`CREATE TYPE "public"."news_category" AS ENUM('incident', 'arrest', 'policy', 'community', 'general')`);
        console.log('Created news_category enum');
      } catch (e) { console.log('news_category already exists'); }

      try {
        await sql.unsafe(`CREATE TYPE "public"."threat_level_name" AS ENUM('NOT_EXPECTED', 'POSSIBLE', 'PROBABLE', 'EXPECTED', 'CERTAIN')`);
        console.log('Created threat_level_name enum');
      } catch (e) { console.log('threat_level_name already exists'); }

      // Create tables if not exist
      try {
        await sql.unsafe(`
          CREATE TABLE IF NOT EXISTS "ai_insights" (
            "id" serial PRIMARY KEY NOT NULL,
            "insight_type" "ai_insight_type" NOT NULL,
            "content" text NOT NULL,
            "sources" jsonb NOT NULL,
            "generated_at" timestamp with time zone NOT NULL,
            "model_used" varchar(128) NOT NULL,
            "created_at" timestamp with time zone DEFAULT now() NOT NULL
          )
        `);
        console.log('Created ai_insights table');
      } catch (e) { console.log('Error creating ai_insights:', e.message); }

      try {
        await sql.unsafe(`
          CREATE TABLE IF NOT EXISTS "news_articles" (
            "id" serial PRIMARY KEY NOT NULL,
            "title" varchar(512) NOT NULL,
            "summary" text,
            "source_name" varchar(128) NOT NULL,
            "source_url" varchar(2048) NOT NULL,
            "published_at" timestamp with time zone NOT NULL,
            "category" "news_category" NOT NULL,
            "state" varchar(32),
            "scraped_at" timestamp with time zone NOT NULL,
            "created_at" timestamp with time zone DEFAULT now() NOT NULL
          )
        `);
        console.log('Created news_articles table');
      } catch (e) { console.log('Error creating news_articles:', e.message); }

      try {
        await sql.unsafe(`
          CREATE TABLE IF NOT EXISTS "sources" (
            "id" serial PRIMARY KEY NOT NULL,
            "name" varchar(128) NOT NULL,
            "feed_url" varchar(2048) NOT NULL,
            "is_active" boolean DEFAULT true NOT NULL,
            "last_fetched" timestamp with time zone
          )
        `);
        console.log('Created sources table');
      } catch (e) { console.log('Error creating sources:', e.message); }

      // Create indexes
      try {
        await sql.unsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "news_articles_source_url_key" ON "news_articles" USING btree ("source_url")`);
        await sql.unsafe(`CREATE INDEX IF NOT EXISTS "news_articles_published_at_idx" ON "news_articles" USING btree ("published_at")`);
        await sql.unsafe(`CREATE INDEX IF NOT EXISTS "news_articles_category_idx" ON "news_articles" USING btree ("category")`);
        await sql.unsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "sources_feed_url_key" ON "sources" USING btree ("feed_url")`);
        console.log('Created indexes');
      } catch (e) { console.log('Error creating indexes:', e.message); }

      console.log('Migration complete!');
    } else {
      console.log('Tables already exist, skipping table creation');
    }

    // Add 'general' to enum if not exists
    console.log('Adding general category to enum...');
    try {
      await sql.unsafe(`ALTER TYPE "public"."news_category" ADD VALUE IF NOT EXISTS 'general'`);
      console.log('Added general category');
    } catch (e) {
      console.log('General category may already exist:', e.message);
    }

    console.log('Migrations complete!');

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
