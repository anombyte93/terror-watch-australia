export type NewsCategory = 'incident' | 'arrest' | 'policy' | 'community';

export interface SourceConfig {
  name: string;
  url: string;
}

export interface RawFeedArticle {
  title: string;
  url: string;
  content: string;
  publishedAt: Date;
  source: string;
}

export interface StoredArticle {
  id?: number;
  title: string;
  summary?: string | null;
  source: string;
  url: string;
  published_at: string;
  category: NewsCategory;
  state: string | null;
}
