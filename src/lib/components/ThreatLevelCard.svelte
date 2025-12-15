<svelte:options runes={true} />

<script lang="ts">
	import ThreatLevelMeter from './ThreatLevelMeter.svelte';
	import { getVisualForLevel } from './threat-level-palette';
	import type { ThreatLevel } from '$lib/types/threat';

	type Props = {
		threat: ThreatLevel | null;
		isLoading?: boolean;
		error?: string | null;
		isStale?: boolean;
	};

	let { threat = null, isLoading = false, error = null, isStale = false }: Props = $props();

	const visual = $derived(getVisualForLevel(threat?.level ?? 0));
	const lastChecked = $derived(threat ? new Date(threat.fetchedAt) : null);
	const sourceLabel = $derived(threat?.source ?? 'unavailable');

	const statusLabel = $derived(
		isLoading
			? 'Updating'
			: error
				? 'Unavailable'
				: isStale
					? 'Stale data'
					: threat?.source === 'cache'
						? 'Cached'
						: threat?.source === 'database' || threat?.source === 'fallback'
							? 'Recovered'
							: 'Live'
	);

	const formatDateTime = (value: Date | null) =>
		value
			? new Intl.DateTimeFormat('en-AU', {
					dateStyle: 'medium',
					timeStyle: 'short'
				}).format(value)
			: 'Not available';

	const formatRelative = (value: Date | null) => {
		if (!value) return '';
		const diffMs = Date.now() - value.getTime();
		const minutes = Math.floor(diffMs / (1000 * 60));
		if (minutes < 1) return 'just now';
		if (minutes < 60) return `${minutes} min ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 48) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
		const days = Math.floor(hours / 24);
		return `${days} day${days > 1 ? 's' : ''} ago`;
	};
</script>

<section class="card" aria-live="polite">
	<header class="header">
		<div>
			<p class="eyebrow">National security signal</p>
			<h2>Current threat level</h2>
		</div>
		<span class={`status ${statusLabel.toLowerCase().replace(/\s+/g, '-')}`} aria-label={`Data status: ${statusLabel}`}>
			{statusLabel}
		</span>
	</header>

	{#if isLoading}
		<div class="indicator loading">
			<span class="skeleton block"></span>
			<span class="skeleton line"></span>
		</div>
		<div class="skeleton paragraph"></div>
		<div class="skeleton meter"></div>
	{:else if error}
		<div class="indicator muted">
			<p class="muted-text">{error}</p>
			<a class="link" href="https://www.nationalsecurity.gov.au" target="_blank" rel="noreferrer">
				Check the official site
			</a>
		</div>
	{:else if threat}
		<div
			class={`indicator level-${visual.value}`}
			style={`--tone:${visual.color}; --accent:${visual.accent}; --pattern:${visual.pattern};`}
		>
			<span class="pattern" aria-hidden="true"></span>
			<div class="level">
				<div class="level-number">{threat.level}</div>
				<div class="level-name">{threat.name}</div>
				<p class="tagline">{visual.tagline}</p>
			</div>
			<div class="callout">
				<span class="dot" aria-hidden="true"></span>
				<div>
					<p class="callout-label">Plain-language guidance</p>
					<p class="callout-desc">{threat.description}</p>
				</div>
			</div>
		</div>

		<div class="meter-wrapper" aria-label={`Threat level meter highlighting level ${threat.level}`}>
			<ThreatLevelMeter level={threat.level} />
		</div>

		<footer class="meta">
			<div class="meta-item">
				<span class="meta-label">Last checked</span>
				<span class="meta-value">{formatDateTime(lastChecked)}</span>
				{#if lastChecked}
					<span class="muted-text">{formatRelative(lastChecked)}</span>
				{/if}
			</div>
			<div class="meta-item">
				<span class="meta-label">Data source</span>
				<span class="meta-value">{sourceLabel}</span>
				{#if isStale}
					<span class="pill warning">Cached/stale</span>
				{:else if threat.source !== 'scraped'}
					<span class="pill">{threat.source}</span>
				{/if}
			</div>
			<div class="meta-item link-item">
				<a class="link" href={threat.link} target="_blank" rel="noreferrer">
					Official source — nationalsecurity.gov.au
				</a>
			</div>
		</footer>
	{:else}
		<div class="indicator muted">
			<p class="muted-text">Threat level data has not loaded yet.</p>
		</div>
	{/if}
</section>

<style>
	.card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 18px;
		padding: 18px;
		box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
		display: grid;
		gap: 14px;
		max-width: 1024px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.78rem;
		margin: 0 0 6px 0;
		color: #9fc6ff;
	}

	h2 {
		margin: 0;
		font-size: 1.4rem;
	}

	.status {
		padding: 6px 12px;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.06);
		color: #d8e7f7;
	}

	.status.live {
		border-color: rgba(91, 216, 255, 0.5);
		background: rgba(91, 216, 255, 0.12);
		color: #eaffff;
	}

	.status.cached,
	.status.recovered {
		border-color: rgba(255, 214, 102, 0.4);
		background: rgba(255, 214, 102, 0.12);
		color: #ffe8a8;
	}

	.status.stale,
	.status.stale-data,
	.status.unavailable,
	.status.updating {
		border-color: rgba(255, 140, 140, 0.45);
		background: rgba(255, 140, 140, 0.14);
		color: #ffd6d6;
	}

	.indicator {
		position: relative;
		border-radius: 16px;
		padding: 16px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		display: grid;
		gap: 12px;
		background: linear-gradient(140deg, #0c1825, #0a121b);
		overflow: hidden;
		isolation: isolate;
	}

	.indicator.level-1,
	.indicator.level-2,
	.indicator.level-3,
	.indicator.level-4,
	.indicator.level-5 {
		background: linear-gradient(120deg, color-mix(in srgb, var(--tone) 70%, #0b141f 30%), #0a111a);
		border-color: color-mix(in srgb, var(--accent) 35%, rgba(255, 255, 255, 0.18));
		box-shadow:
			0 10px 26px rgba(0, 0, 0, 0.32),
			0 0 0 1px rgba(255, 255, 255, 0.04);
	}

	.pattern {
		position: absolute;
		inset: 0;
		background-image: var(--pattern);
		opacity: 0.34;
		mix-blend-mode: screen;
		z-index: 0;
	}

	.level {
		position: relative;
		z-index: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 8px 16px;
		align-items: center;
	}

	.level-number {
		font-size: clamp(2.4rem, 5vw, 3.2rem);
		font-weight: 700;
		line-height: 1;
	}

	.level-name {
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.tagline {
		flex-basis: 100%;
		margin: 2px 0 0;
		color: #e9f2fb;
		max-width: 720px;
	}

	.callout {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 8px 12px;
		align-items: start;
		padding: 12px;
		border-radius: 12px;
		background: rgba(0, 0, 0, 0.18);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 35%, transparent);
		margin-top: 4px;
	}

	.callout-label {
		margin: 0;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		font-size: 0.78rem;
		color: #b9cedf;
	}

	.callout-desc {
		margin: 2px 0 0;
		color: #f2f7ff;
		line-height: 1.5;
	}

	.meter-wrapper {
		margin-top: 4px;
	}

	.meta {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 12px;
		align-items: center;
	}

	.meta-item {
		display: grid;
		gap: 4px;
	}

	.meta-label {
		color: #9db4c5;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.meta-value {
		font-weight: 700;
		font-size: 1rem;
	}

	.muted-text {
		color: #aab9c5;
		margin: 0;
		font-size: 0.9rem;
	}

	.link {
		color: #9bc7ff;
		text-decoration: none;
		border-bottom: 1px solid rgba(155, 199, 255, 0.5);
		width: fit-content;
	}

	.link:hover {
		color: #cce2ff;
		border-color: rgba(204, 226, 255, 0.8);
	}

	.link-item {
		align-self: end;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		width: fit-content;
		font-size: 0.82rem;
		text-transform: capitalize;
	}

	.pill.warning {
		background: rgba(255, 196, 0, 0.12);
		border-color: rgba(255, 196, 0, 0.45);
		color: #ffe2a8;
	}

	.muted {
		background: rgba(0, 0, 0, 0.24);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.skeleton {
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05));
		background-size: 240% 100%;
		animation: shimmer 1.4s ease infinite;
		border-radius: 10px;
		display: block;
	}

	.skeleton.block {
		height: 88px;
	}

	.skeleton.line {
		height: 22px;
		max-width: 280px;
		margin-top: 8px;
	}

	.skeleton.paragraph {
		height: 60px;
	}

	.skeleton.meter {
		height: 90px;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}

		100% {
			background-position: -200% 0;
		}
	}

	@media (max-width: 720px) {
		.card {
			padding: 16px;
		}

		.header {
			align-items: flex-start;
			flex-direction: column;
		}

		.meta {
			grid-template-columns: 1fr;
		}
	}
</style>
