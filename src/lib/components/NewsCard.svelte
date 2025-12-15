<svelte:options runes={true} />

<script lang="ts">
	import CategoryBadge from './CategoryBadge.svelte';
	import type { StoredArticle } from '$lib/types/news';

	const { article } = $props<{ article: StoredArticle }>();

	const publishedDate = $derived(new Date(article.published_at));
	const relativeTime = $derived(formatRelativeTime(publishedDate));
	const absoluteDate = $derived(formatAbsoluteDate(publishedDate));
	const hasState = $derived(Boolean(article.state));

	const timeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	const dateFormatter = new Intl.DateTimeFormat('en-AU', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	function formatRelativeTime(date: Date) {
		const diffMs = date.getTime() - Date.now();
		const minutes = Math.round(diffMs / (1000 * 60));
		if (Math.abs(minutes) < 60) return timeFormatter.format(minutes, 'minute');

		const hours = Math.round(diffMs / (1000 * 60 * 60));
		if (Math.abs(hours) < 24) return timeFormatter.format(hours, 'hour');

		const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
		if (Math.abs(days) < 7) return timeFormatter.format(days, 'day');

		const weeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
		return timeFormatter.format(weeks, 'week');
	}

	function formatAbsoluteDate(date: Date) {
		return dateFormatter.format(date);
	}
</script>

<article class="news-card">
	<div class="card-top">
		<CategoryBadge category={article.category} />
		<div class="meta">
			<span class="source">{article.source}</span>
			{#if hasState}
				<span class="chip">{article.state}</span>
			{/if}
		</div>
	</div>

	<a class="title" href={article.url} target="_blank" rel="noopener noreferrer">
		{article.title}
	</a>

	{#if article.summary}
		<p class="summary">{article.summary}</p>
	{/if}

	<div class="footer">
		<span class="relative">{relativeTime}</span>
		<span class="exact">{absoluteDate}</span>
	</div>
</article>

<style>
	.news-card {
		background: linear-gradient(150deg, rgba(15, 26, 39, 0.85), rgba(10, 16, 24, 0.9));
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 18px;
		padding: 16px;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
		display: flex;
		flex-direction: column;
		gap: 10px;
		transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
	}

	.news-card:hover {
		border-color: rgba(125, 183, 255, 0.4);
		transform: translateY(-2px);
		box-shadow: 0 16px 40px rgba(12, 37, 72, 0.45);
	}

	.card-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.meta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: #9db5ce;
		font-size: 0.9rem;
	}

	.meta .source {
		background: rgba(255, 255, 255, 0.04);
		padding: 6px 10px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.chip {
		border-radius: 999px;
		padding: 6px 10px;
		background: rgba(146, 228, 255, 0.14);
		border: 1px solid rgba(146, 228, 255, 0.28);
		color: #d5f5ff;
		font-weight: 600;
	}

	.title {
		font-size: 1.1rem;
		font-weight: 700;
		line-height: 1.4;
		color: #e7f0fb;
		text-decoration: none;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.title:hover {
		color: #8dc5ff;
	}

	.summary {
		margin: 0;
		color: #c6d8e8;
		line-height: 1.5;
	}

	.footer {
		display: flex;
		align-items: center;
		gap: 10px;
		color: #90a7c0;
		font-size: 0.9rem;
	}

	.relative {
		color: #b9d7ff;
		font-weight: 600;
	}

	.exact {
		opacity: 0.8;
	}

	@media (max-width: 640px) {
		.card-top {
			flex-direction: column;
			align-items: flex-start;
		}

		.meta {
			flex-wrap: wrap;
			justify-content: flex-start;
		}
	}
</style>
