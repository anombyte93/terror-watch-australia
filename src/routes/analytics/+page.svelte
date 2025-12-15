<script lang="ts">
	import ThreatTimeline from '$lib/components/analytics/ThreatTimeline.svelte';
	import NewsVolumeChart from '$lib/components/analytics/NewsVolumeChart.svelte';
	import GeoDistribution from '$lib/components/analytics/GeoDistribution.svelte';
	import StatCard from '$lib/components/analytics/StatCard.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let period = $state<'7d' | '30d' | '90d'>('30d');
	let analyticsOverride = $state<typeof data.analytics | null>(null);
	const analytics = $derived(analyticsOverride ?? data.analytics);
	let loading = $state(false);

	async function changePeriod(newPeriod: typeof period) {
		if (newPeriod === period || loading) return;

		period = newPeriod;
		loading = true;

		try {
			const days = newPeriod === '7d' ? 7 : newPeriod === '90d' ? 90 : 30;
			const res = await fetch(`/api/analytics?timelineDays=${days}&volumeDays=${days}&distributionDays=${days}`);
			if (res.ok) {
				analyticsOverride = await res.json();
			}
		} catch (err) {
			console.error('Failed to fetch analytics:', err);
		} finally {
			loading = false;
		}
	}

	const getTrendDirection = (current: number, threshold: number): 'positive' | 'negative' | 'neutral' => {
		if (current > threshold) return 'negative';
		if (current < threshold * 0.5) return 'positive';
		return 'neutral';
	};
</script>

<svelte:head>
	<title>Analytics | Terror Watch Australia</title>
	<meta name="description" content="Historical security trends and news analytics for Australia" />
	<meta property="og:title" content="Analytics | Terror Watch Australia" />
	<meta property="og:description" content="Historical security trends and news analytics for Australia" />
	<meta property="og:url" content="https://terrorwatch.au/analytics" />
</svelte:head>

<div class="analytics-page">
	<Container width="wide">
		<header class="page-header">
			<div class="title-block">
				<h1>Analytics Dashboard</h1>
				<p class="subtitle">Historical trends and patterns in Australian security news</p>
			</div>

			<div class="period-selector" role="tablist" aria-label="Time period selector">
				<button
					class="period-btn"
					class:active={period === '7d'}
					onclick={() => changePeriod('7d')}
					disabled={loading}
					role="tab"
					aria-selected={period === '7d'}
				>
					7 Days
				</button>
				<button
					class="period-btn"
					class:active={period === '30d'}
					onclick={() => changePeriod('30d')}
					disabled={loading}
					role="tab"
					aria-selected={period === '30d'}
				>
					30 Days
				</button>
				<button
					class="period-btn"
					class:active={period === '90d'}
					onclick={() => changePeriod('90d')}
					disabled={loading}
					role="tab"
					aria-selected={period === '90d'}
				>
					90 Days
				</button>
			</div>
		</header>

		<div class="stats-grid" class:loading>
			<StatCard
				label="Current Threat Level"
				value={analytics.summary.currentThreatName}
				subtitle="Level {analytics.summary.currentThreatLevel} of 5"
			/>
			<StatCard
				label="Total Articles"
				value={analytics.summary.totalArticles}
			/>
			<StatCard
				label="Last 24 Hours"
				value={analytics.summary.articlesLast24h}
				trend={getTrendDirection(analytics.summary.articlesLast24h, 10)}
				subtitle="Articles published"
			/>
			<StatCard
				label="Last 7 Days"
				value={analytics.summary.articlesLast7d}
				trend={getTrendDirection(analytics.summary.articlesLast7d, 50)}
				subtitle="Articles published"
			/>
		</div>

		<section class="chart-section" class:loading>
			<h2>Threat Level History</h2>
			<p class="section-desc">Tracking Australia's national terrorism threat level over time</p>
			<ThreatTimeline data={analytics.threatTimeline} />
		</section>

		<section class="chart-section" class:loading>
			<h2>News Volume</h2>
			<p class="section-desc">Daily article count from monitored news sources</p>
			<NewsVolumeChart data={analytics.newsVolume} />
		</section>

		<section class="chart-section" class:loading>
			<h2>Geographic Distribution</h2>
			<p class="section-desc">Security-related news coverage by Australian state</p>
			<GeoDistribution data={analytics.stateDistribution} />
		</section>

		{#if analytics.categoryDistribution.length > 0}
			<section class="chart-section categories" class:loading>
				<h2>Category Breakdown</h2>
				<p class="section-desc">Distribution of news by category</p>
				<div class="category-pills">
					{#each analytics.categoryDistribution as cat}
						<div class="category-pill {cat.category}">
							<span class="cat-name">{cat.category}</span>
							<span class="cat-count">{cat.count}</span>
							<span class="cat-pct">{cat.percentage}%</span>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</Container>
</div>

<style>
	.analytics-page {
		padding: 2rem 0 4rem;
		min-height: 100vh;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.title-block h1 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0 0 0.35rem;
	}

	.subtitle {
		color: var(--text-secondary);
		font-size: 1rem;
		margin: 0;
	}

	.period-selector {
		display: flex;
		gap: 0.5rem;
		background: var(--surface-panel);
		padding: 0.35rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
	}

	.period-btn {
		padding: 0.5rem 1rem;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		font-weight: 500;
		font-size: 0.9rem;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.period-btn:hover:not(:disabled) {
		color: var(--text-primary);
		background: var(--surface-muted);
	}

	.period-btn.active {
		background: var(--color-primary);
		color: white;
	}

	.period-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2.5rem;
		transition: opacity 0.2s ease;
	}

	.chart-section {
		margin-bottom: 2.5rem;
		transition: opacity 0.2s ease;
	}

	.chart-section h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 0.35rem;
	}

	.section-desc {
		color: var(--text-tertiary);
		font-size: 0.9rem;
		margin: 0 0 1rem;
	}

	.loading {
		opacity: 0.5;
		pointer-events: none;
	}

	.category-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.category-pill {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1rem;
		background: var(--surface-panel);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
	}

	.category-pill.incident {
		border-left: 3px solid #ef4444;
	}

	.category-pill.arrest {
		border-left: 3px solid #f97316;
	}

	.category-pill.policy {
		border-left: 3px solid #3b82f6;
	}

	.category-pill.community {
		border-left: 3px solid #22c55e;
	}

	.cat-name {
		font-weight: 600;
		color: var(--text-primary);
		text-transform: capitalize;
	}

	.cat-count {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.cat-pct {
		color: var(--text-tertiary);
		font-size: 0.85rem;
	}

	@media (max-width: 640px) {
		.page-header {
			flex-direction: column;
		}

		.period-selector {
			width: 100%;
			justify-content: center;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
