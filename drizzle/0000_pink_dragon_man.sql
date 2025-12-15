CREATE TYPE "public"."ai_insight_type" AS ENUM('daily_summary', 'threat_context', 'trend');--> statement-breakpoint
CREATE TYPE "public"."news_category" AS ENUM('incident', 'arrest', 'policy', 'community');--> statement-breakpoint
CREATE TYPE "public"."threat_level_name" AS ENUM('NOT_EXPECTED', 'POSSIBLE', 'PROBABLE', 'EXPECTED', 'CERTAIN');--> statement-breakpoint
CREATE TABLE "ai_insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"insight_type" "ai_insight_type" NOT NULL,
	"content" text NOT NULL,
	"sources" jsonb NOT NULL,
	"generated_at" timestamp with time zone NOT NULL,
	"model_used" varchar(128) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
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
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"feed_url" varchar(2048) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_fetched" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "threat_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"level_number" integer NOT NULL,
	"level_name" "threat_level_name" NOT NULL,
	"description" text NOT NULL,
	"scraped_at" timestamp with time zone NOT NULL,
	"source_url" varchar(1024) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "threat_levels_level_number_range" CHECK ("threat_levels"."level_number" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "news_articles_source_url_key" ON "news_articles" USING btree ("source_url");--> statement-breakpoint
CREATE INDEX "news_articles_published_at_idx" ON "news_articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "news_articles_category_idx" ON "news_articles" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX "sources_feed_url_key" ON "sources" USING btree ("feed_url");--> statement-breakpoint
CREATE INDEX "threat_levels_scraped_at_idx" ON "threat_levels" USING btree ("scraped_at");