<svelte:options runes={true} />

<script lang="ts">
	import ThreatLevelCard from './ThreatLevelCard.svelte';
	import ConnectionStatus from './ConnectionStatus.svelte';
	import { getVisualForLevel } from './threat-level-palette';
	import type { ThreatLevel } from '$lib/types/threat';
	import { createEventStream } from '$lib/hooks/useEventStream.svelte';
	import type { ThreatUpdateEvent } from '$lib/types/events';

	type Props = {
		threat: ThreatLevel | null;
		isLoading?: boolean;
		error?: string | null;
		isStale?: boolean;
		enableRealtime?: boolean;
		onThreatChange?: (level: number, name: string) => void;
	};

	let {
		threat = null,
		isLoading = false,
		error = null,
		isStale = false,
		enableRealtime = true,
		onThreatChange
	}: Props = $props();

	let hasUpdate = $state(false);
	let pendingLevel = $state<number | null>(null);
	let pendingName = $state<string | null>(null);

	const visual = $derived(getVisualForLevel(threat?.level ?? 0));

	// Real-time updates via SSE - conditionally connect based on prop
	const eventStream = createEventStream({
		onThreatUpdate: (event: ThreatUpdateEvent) => {
			if (event.data.level !== threat?.level) {
				hasUpdate = true;
				pendingLevel = event.data.level;
				pendingName = event.data.name;
				onThreatChange?.(event.data.level, event.data.name);
			}
		}
	});

	// Control connection based on enableRealtime prop
	$effect(() => {
		if (enableRealtime) {
			eventStream.connect();
		} else {
			eventStream.disconnect();
		}
	});

	function dismissUpdate() {
		hasUpdate = false;
		pendingLevel = null;
		pendingName = null;
	}
</script>

<section class="wrapper">
	<div class="intro">
		<div class="intro-header">
			<p class="eyebrow">Australia-wide assessment</p>
			{#if enableRealtime}
				<ConnectionStatus
					connectionState={eventStream.connectionState}
					lastEventTime={eventStream.state.lastEventTime}
				/>
			{/if}
		</div>
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

		{#if hasUpdate && pendingLevel !== null}
			<button type="button" class="update-alert" onclick={dismissUpdate}>
				Threat level changed to Level {pendingLevel} · {pendingName} — Click to dismiss
			</button>
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
