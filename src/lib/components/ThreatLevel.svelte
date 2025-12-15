<svelte:options runes={true} />

<script lang="ts">
	import ThreatLevelCard from './ThreatLevelCard.svelte';
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
</script>

<section class="wrapper">
	<div class="intro">
		<p class="eyebrow">Australia-wide assessment</p>
		<h1>Monitor the current terrorism threat level</h1>
		<p class="lede">
			Live reading from the official national security source, paired with an accessible meter and
			plain-language guidance.
		</p>
		{#if threat}
			<div class="chip" style={`--accent:${visual.accent};`}>
				Level {threat.level} · {threat.name}
			</div>
		{:else if isLoading}
			<div class="chip muted">Fetching the latest level…</div>
		{:else if error}
			<div class="chip muted">{error}</div>
		{/if}
	</div>

	<ThreatLevelCard threat={threat} isLoading={isLoading} error={error} isStale={isStale} />
</section>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 22px;
		align-items: start;
	}

	.intro h1 {
		margin: 6px 0 10px;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.82rem;
		color: #7fb3ff;
		margin: 0;
	}

	.lede {
		color: #cbd8e6;
		line-height: 1.6;
		margin-top: 0;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.06);
		color: #eaf4ff;
		font-weight: 700;
		width: fit-content;
		margin-top: 8px;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.chip::before {
		content: '';
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--accent, #5bd8ff);
		box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent, #5bd8ff) 30%, transparent);
	}

	.chip.muted {
		color: #b7c5d4;
		background: rgba(255, 255, 255, 0.04);
	}

	@media (max-width: 720px) {
		.wrapper {
			grid-template-columns: 1fr;
		}
	}
</style>
