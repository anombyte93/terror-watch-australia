<svelte:options runes={true} />

<script lang="ts">
	import NewsCard from './NewsCard.svelte';
	import NewsFilters from './NewsFilters.svelte';
	import ConnectionStatus from './ConnectionStatus.svelte';
	import { NEWS_DAYS_WINDOW, NEWS_PAGE_SIZE, STATE_OPTIONS } from '$lib/config/news';
	import type { NewsCategory, StoredArticle } from '$lib/types/news';
	import { createEventStream } from '$lib/hooks/useEventStream.svelte';
	import type { NewsUpdateEvent } from '$lib/types/events';

	type FilterCategory = NewsCategory | 'all';
	type FilterState = 'all' | string;
	type GroupKey = 'today' | 'yesterday' | 'this-week' | 'older';

	type Props = {
		initialArticles: StoredArticle[];
		initialLimit?: number;
		initialError?: string | null;
		enableRealtime?: boolean;
	};
	const props: Props = $props();

	const pageSize = props.initialLimit ?? NEWS_PAGE_SIZE;
	let articles: StoredArticle[] = $state(props.initialArticles ?? []);
	let category: FilterCategory = $state('all');
	let stateFilter: FilterState = $state('all');
	let page = $state(1);
	let isLoading = $state(false);
	let errorMsg: string | null = $state(props.initialError ?? null);
	let hasMore = $state((props.initialArticles?.length ?? 0) >= pageSize);
	let newArticlesCount = $state(0);

	// Real-time updates via SSE
	const eventStream = props.enableRealtime !== false
		? createEventStream({
				onNewsUpdate: (event: NewsUpdateEvent) => {
					newArticlesCount += event.data.count;
				}
			})
		: null;

	const grouped = $derived(groupArticles(articles));
	const totalLabel = $derived(
		`${articles.length} article${articles.length === 1 ? '' : 's'} in view`
	);

	function startOfDay(date: Date) {
		const clone = new Date(date);
		clone.setHours(0, 0, 0, 0);
		return clone;
	}

	function groupKey(date: Date): GroupKey {
		const today = startOfDay(new Date());
		const target = startOfDay(date);
		const diffDays = Math.round((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

		if (diffDays <= 0) return 'today';
		if (diffDays === 1) return 'yesterday';
		if (diffDays < 7) return 'this-week';
		return 'older';
	}

	function groupArticles(list: StoredArticle[]) {
		const buckets: Record<GroupKey, StoredArticle[]> = {
			today: [],
			yesterday: [],
			'this-week': [],
			older: []
		};

		for (const item of list) {
			const key = groupKey(new Date(item.published_at));
			buckets[key].push(item);
		}

		const order: { key: GroupKey; label: string }[] = [
			{ key: 'today', label: 'Today' },
			{ key: 'yesterday', label: 'Yesterday' },
			{ key: 'this-week', label: 'This Week' },
			{ key: 'older', label: 'Older' }
		];

		return order
			.filter((entry) => buckets[entry.key].length > 0)
			.map((entry) => ({ ...entry, items: buckets[entry.key] }));
	}

	function formatGroupDate(value: string) {
		return new Date(value).toLocaleDateString('en-AU', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}

	async function fetchArticles(requestedPage = 1) {
		isLoading = true;
		errorMsg = null;
		const limit = requestedPage * pageSize;
		const params = new URLSearchParams({
			limit: String(limit),
			days: String(NEWS_DAYS_WINDOW)
		});

		if (category !== 'all') params.set('category', category);
		if (stateFilter !== 'all') params.set('state', stateFilter);

		try {
			const response = await fetch(`/api/news?${params.toString()}`);
			if (!response.ok) {
				throw new Error(`Fetch failed with status ${response.status}`);
			}
			const data: StoredArticle[] = await response.json();
			articles = data;
			page = requestedPage;
			hasMore = data.length >= limit;
		} catch (err) {
			console.error('Failed to fetch news', err);
			errorMsg = 'Unable to load news right now. Please try again shortly.';
		} finally {
			isLoading = false;
		}
	}

	function handleFiltersChange(detail: { category: FilterCategory; state: FilterState }) {
		category = detail.category;
		stateFilter = detail.state;
		hasMore = true;
		fetchArticles(1);
	}

	function onLoadMore() {
		if (!hasMore || isLoading) return;
		fetchArticles(page + 1);
	}

	function refreshForNewArticles() {
		newArticlesCount = 0;
		fetchArticles(1);
	}
</script>

<section class="news-feed">
	<header class="feed-header">
		<div>
			<p class="eyebrow">Live Signals</p>
			<h2>News Timeline</h2>
			<p class="lede">
				Chronological feed of terrorism-related coverage across national publishers. Newest
				articles appear first.
			</p>
		</div>
		<div class="header-actions">
			{#if eventStream}
				<ConnectionStatus
					connectionState={eventStream.connectionState}
					lastEventTime={eventStream.state.lastEventTime}
				/>
			{/if}
			<div class="totals" aria-live="polite">{totalLabel}</div>
		</div>
	</header>

	{#if newArticlesCount > 0}
		<button type="button" class="new-articles-banner" onclick={refreshForNewArticles}>
			{newArticlesCount} new article{newArticlesCount === 1 ? '' : 's'} available — Click to refresh
		</button>
	{/if}

	<NewsFilters
		states={[...STATE_OPTIONS]}
		category={category}
		state={stateFilter}
		on:change={(event: CustomEvent<{ category: FilterCategory; state: FilterState }>) =>
			handleFiltersChange(event.detail)}
	/>

	{#if isLoading && !articles.length}
		<div class="skeleton-list" aria-label="Loading articles">
			{#each Array.from({ length: 4 }) as _, index (index)}
				<div class="skeleton-card"></div>
			{/each}
		</div>
	{:else if !articles.length}
		<div class="empty" aria-live="polite">
			<p>No articles match the current filters.</p>
			<button type="button" class="ghost" onclick={() => fetchArticles(1)}>Reload feed</button>
		</div>
	{:else}
		<div class="timeline" aria-live="polite">
			{#each grouped as group (group.key)}
				<div class="group">
					<div class="group-header">
						<div class="pill">{group.label}</div>
						<span class="group-date">{formatGroupDate(group.items[0].published_at)}</span>
					</div>
					<div class="items">
						{#each group.items as item (item.url)}
							<NewsCard article={item} />
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if errorMsg}
		<div class="error">{errorMsg}</div>
	{/if}

	<div class="actions">
		<button type="button" class="load-more" onclick={onLoadMore} disabled={!hasMore || isLoading}>
			{#if isLoading}
				Loading…
			{:else if hasMore}
				Load more
			{:else}
				No more results
			{/if}
		</button>
	</div>
</section>

<style>
	.news-feed {
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: 18px;
		background: rgba(5, 12, 19, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 20px;
		box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(6px);
	}

	.feed-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #7fb3ff;
		margin: 0 0 4px;
		font-weight: 800;
	}

	h2 {
		margin: 0;
		font-size: clamp(1.6rem, 3vw, 2rem);
		color: #e8f1fb;
	}

	.lede {
		margin: 6px 0 0;
		color: #b8cadd;
		line-height: 1.5;
		max-width: 720px;
	}

	.header-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
	}

	.totals {
		background: linear-gradient(140deg, rgba(57, 140, 255, 0.2), rgba(0, 225, 255, 0.2));
		border: 1px solid rgba(136, 196, 255, 0.4);
		color: #d2e8ff;
		padding: 10px 14px;
		border-radius: 12px;
		font-weight: 700;
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
		white-space: nowrap;
	}

	.new-articles-banner {
		width: 100%;
		padding: 12px 16px;
		border-radius: 12px;
		border: 1px solid rgba(74, 222, 128, 0.4);
		background: linear-gradient(130deg, rgba(22, 101, 52, 0.6), rgba(34, 197, 94, 0.3));
		color: #bbf7d0;
		font-weight: 700;
		cursor: pointer;
		text-align: center;
		animation: pulse-banner 2s ease-in-out infinite;
		transition: transform 150ms ease, box-shadow 150ms ease;
	}

	.new-articles-banner:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
	}

	@keyframes pulse-banner {
		0%,
		100% {
			border-color: rgba(74, 222, 128, 0.4);
		}
		50% {
			border-color: rgba(74, 222, 128, 0.8);
		}
	}

	.timeline {
		position: relative;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 12px;
		top: 0;
		bottom: 0;
		width: 2px;
		background: linear-gradient(180deg, rgba(94, 149, 255, 0.6), rgba(94, 149, 255, 0));
		opacity: 0.7;
	}

	.group {
		position: relative;
		padding-left: 36px;
		margin-bottom: 10px;
	}

	.group-header {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}

	.group-header::before {
		content: '';
		position: absolute;
		left: 6px;
		width: 12px;
		height: 12px;
		background: #59b1ff;
		border: 2px solid #0c1523;
		border-radius: 50%;
		box-shadow: 0 0 0 6px rgba(89, 177, 255, 0.2);
	}

	.group-date {
		color: #9ab3cf;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.pill {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.14);
		color: #e1edfd;
		padding: 7px 12px;
		border-radius: 12px;
		font-weight: 800;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		font-size: 0.85rem;
	}

	.items {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 12px;
	}

	.skeleton-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 12px;
	}

	.skeleton-card {
		height: 150px;
		border-radius: 16px;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05));
		background-size: 200% 100%;
		animation: shimmer 1.2s ease-in-out infinite;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}

	.empty {
		text-align: center;
		color: #c2d4eb;
		padding: 32px 16px;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 16px;
		border: 1px dashed rgba(255, 255, 255, 0.2);
		display: grid;
		gap: 10px;
		justify-items: center;
	}

	.ghost {
		background: transparent;
		color: #92c8ff;
		border: 1px solid rgba(146, 200, 255, 0.4);
		padding: 10px 12px;
		border-radius: 10px;
		cursor: pointer;
		font-weight: 700;
	}

	.error {
		color: #ffd2d2;
		background: rgba(255, 77, 77, 0.14);
		border: 1px solid rgba(255, 77, 77, 0.35);
		padding: 10px 12px;
		border-radius: 10px;
	}

	.actions {
		display: flex;
		justify-content: center;
	}

	.load-more {
		padding: 12px 18px;
		border-radius: 12px;
		border: 1px solid rgba(144, 181, 255, 0.6);
		background: linear-gradient(130deg, rgba(19, 47, 78, 0.9), rgba(39, 86, 132, 0.9));
		color: #d9e8ff;
		font-weight: 800;
		cursor: pointer;
		min-width: 180px;
		box-shadow: 0 12px 28px rgba(20, 79, 140, 0.35);
		transition: transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease;
	}

	.load-more:hover:enabled {
		transform: translateY(-1px);
		box-shadow: 0 16px 32px rgba(34, 110, 184, 0.4);
	}

	.load-more:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 720px) {
		.news-feed {
			padding: 14px;
		}

		.feed-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.timeline::before {
			left: 8px;
		}

		.group {
			padding-left: 26px;
		}

		.group-header::before {
			left: 0;
		}
	}
</style>
