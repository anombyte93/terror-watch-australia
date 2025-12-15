-- Add 'general' to news_category enum
ALTER TYPE "public"."news_category" ADD VALUE IF NOT EXISTS 'general';
