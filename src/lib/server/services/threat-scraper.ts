import { z } from 'zod';
import type { ThreatLevel } from '$lib/types/threat';
import { loadLatestThreatLevel, recordThreatLevel } from '$lib/server/db/threat-level';

const THREAT_URL =
	'https://www.nationalsecurity.gov.au/national-threat-level/current-national-terrorism-threat-level';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_STALE_MS = CACHE_TTL_MS * 24; // fallback window
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 500;

export const ThreatLevelSchema = z.object({
	ThreatLevelNo: z.string().transform(Number),
	ThreatLevelName: z.string(),
	ThreatLevelDesc: z.string(),
	ThreatLevelLink: z.string()
});

type CacheEntry = { data: ThreatLevel; timestamp: number };

let cache: CacheEntry | null = null;
let inflight: Promise<ThreatLevel> | null = null;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const extractThreatJson = (html: string): string => {
	const scriptMatch = html.match(
		/<script\s+id=['"]ThreatLevelJson['"][^>]*>([\s\S]*?)<\/script>/im
	);
	if (scriptMatch?.[1]) {
		return scriptMatch[1].trim();
	}

	const fallbackMatch = html.match(
		/\{[^{}]*"ThreatLevelNo"[^{}]*"ThreatLevelName"[^{}]*"ThreatLevelDesc"[^{}]*"ThreatLevelLink"[^{}]*\}/im
	);
	if (fallbackMatch?.[0]) {
		return fallbackMatch[0].trim();
	}

	throw new Error('Threat level JSON not found in response');
};

const unescapeHtmlEntities = (value: string): string =>
	value
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&');

const fetchWithRetry = async (): Promise<string> => {
	let lastError: unknown;

	for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
		try {
			const response = await fetch(THREAT_URL, {
				headers: {
					'User-Agent': 'TWA Threat Scraper/1.0',
					Accept: 'text/html,application/xhtml+xml'
				}
			});

			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`);
			}

			return await response.text();
		} catch (error) {
			lastError = error;
			const backoff = RETRY_BASE_MS * 2 ** (attempt - 1);
			console.error(
				`[threat] Fetch attempt ${attempt} failed: ${(error as Error).message}. Retrying in ${backoff}ms`
			);
			if (attempt < MAX_RETRIES) {
				await delay(backoff);
			}
		}
	}

	throw lastError instanceof Error ? lastError : new Error('Failed to fetch threat level');
};

export const fetchThreatLevel = async (): Promise<ThreatLevel> => {
	const html = await fetchWithRetry();
	const jsonString = unescapeHtmlEntities(extractThreatJson(html));
	const parsed = JSON.parse(jsonString);
	const validated = ThreatLevelSchema.parse(parsed);

	const absoluteLink = validated.ThreatLevelLink.startsWith('http')
		? validated.ThreatLevelLink
		: new URL(validated.ThreatLevelLink, THREAT_URL).toString();
	const name = validated.ThreatLevelName.trim().toUpperCase();

	return {
		level: validated.ThreatLevelNo,
		name,
		description: validated.ThreatLevelDesc.trim(),
		link: absoluteLink,
		fetchedAt: new Date(),
		source: 'scraped'
	};
};

export const getThreatLevel = async (): Promise<ThreatLevel> => {
	const now = Date.now();

	if (cache && now - cache.timestamp < CACHE_TTL_MS) {
		return {
			...cache.data,
			source: cache.data.source === 'scraped' ? 'cache' : cache.data.source
		};
	}

	if (inflight) {
		return inflight;
	}

	inflight = (async () => {
		const latestStored = await loadLatestThreatLevel();
		if (!cache && latestStored) {
			cache = { data: latestStored, timestamp: latestStored.fetchedAt.getTime() };
		}

		try {
			if (latestStored && now - latestStored.fetchedAt.getTime() < CACHE_TTL_MS) {
				return latestStored;
			}

			const scraped = await fetchThreatLevel();
			const hasChanged =
				!latestStored ||
				scraped.level !== latestStored.level ||
				scraped.name !== latestStored.name ||
				scraped.description !== latestStored.description;

			if (hasChanged) {
				console.info(`[threat] Level updated to ${scraped.level} (${scraped.name})`);
				await recordThreatLevel(scraped);
			}

			cache = { data: scraped, timestamp: scraped.fetchedAt.getTime() };
			return scraped;
		} catch (error) {
			console.error('[threat] Failed to refresh threat level', error);

			if (cache && now - cache.timestamp < MAX_STALE_MS) {
				return { ...cache.data, source: 'fallback' };
			}

			if (latestStored) {
				const fallback = { ...latestStored, source: 'database' as const };
				cache = { data: fallback, timestamp: fallback.fetchedAt.getTime() };
				return fallback;
			}

			throw error instanceof Error ? error : new Error('Threat level unavailable');
		} finally {
			inflight = null;
		}
	})();

	return inflight;
};
