/**
 * Update Tracker Service
 * Singleton that monitors for data changes and broadcasts to SSE subscribers
 */

import type { SSEEvent, ThreatUpdateEvent, NewsUpdateEvent } from '$lib/types/events';
import { getThreatLevel } from './threat-scraper';
import { getRecentArticles } from './news-aggregator';

type Subscriber = (event: SSEEvent) => void;

const CHECK_INTERVAL = 60000; // 1 minute

class UpdateTracker {
	private subscribers = new Set<Subscriber>();
	private lastThreatLevel: number | null = null;
	private lastNewsCount: number | null = null;
	private checkInterval: ReturnType<typeof setInterval> | null = null;
	private isRunning = false;

	subscribe(callback: Subscriber): () => void {
		this.subscribers.add(callback);

		// Start checking if this is the first subscriber
		if (this.subscribers.size === 1 && !this.isRunning) {
			this.startChecking();
		}

		return () => {
			this.subscribers.delete(callback);

			// Stop checking if no subscribers
			if (this.subscribers.size === 0) {
				this.stopChecking();
			}
		};
	}

	private broadcast(event: SSEEvent): void {
		for (const subscriber of this.subscribers) {
			try {
				subscriber(event);
			} catch (error) {
				console.error('[update-tracker] Subscriber error:', error);
			}
		}
	}

	private startChecking(): void {
		if (this.isRunning) return;
		this.isRunning = true;

		// Initial check
		this.checkForUpdates();

		// Periodic checks
		this.checkInterval = setInterval(() => {
			this.checkForUpdates();
		}, CHECK_INTERVAL);
	}

	private stopChecking(): void {
		if (this.checkInterval) {
			clearInterval(this.checkInterval);
			this.checkInterval = null;
		}
		this.isRunning = false;
	}

	private async checkForUpdates(): Promise<void> {
		await Promise.all([this.checkThreatLevel(), this.checkNewsUpdates()]);
	}

	private async checkThreatLevel(): Promise<void> {
		try {
			const threat = await getThreatLevel();
			const currentLevel = threat.level;

			if (this.lastThreatLevel !== null && currentLevel !== this.lastThreatLevel) {
				const event: ThreatUpdateEvent = {
					type: 'threat-update',
					timestamp: new Date().toISOString(),
					data: {
						level: currentLevel,
						name: threat.name,
						previousLevel: this.lastThreatLevel
					}
				};
				this.broadcast(event);
			}

			this.lastThreatLevel = currentLevel;
		} catch (error) {
			console.error('[update-tracker] Failed to check threat level:', error);
		}
	}

	private async checkNewsUpdates(): Promise<void> {
		try {
			const articles = await getRecentArticles({ limit: 1, days: 1 });
			const currentCount = articles.length;

			if (this.lastNewsCount !== null && currentCount > this.lastNewsCount) {
				const newArticles = currentCount - this.lastNewsCount;
				const event: NewsUpdateEvent = {
					type: 'news-update',
					timestamp: new Date().toISOString(),
					data: {
						count: newArticles,
						latestTitle: articles[0]?.title
					}
				};
				this.broadcast(event);
			}

			this.lastNewsCount = currentCount;
		} catch (error) {
			console.error('[update-tracker] Failed to check news updates:', error);
		}
	}

	// Manual trigger for external callers (e.g., after feed refresh)
	notifyThreatUpdate(level: number, name: string, previousLevel?: number): void {
		const event: ThreatUpdateEvent = {
			type: 'threat-update',
			timestamp: new Date().toISOString(),
			data: { level, name, previousLevel }
		};
		this.broadcast(event);
	}

	notifyNewsUpdate(count: number, latestTitle?: string): void {
		const event: NewsUpdateEvent = {
			type: 'news-update',
			timestamp: new Date().toISOString(),
			data: { count, latestTitle }
		};
		this.broadcast(event);
	}
}

// Singleton instance
export const updateTracker = new UpdateTracker();
