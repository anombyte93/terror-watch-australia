<svelte:options runes={true} />

<script lang="ts">
	import { THREAT_LEVEL_VISUALS, getVisualForLevel } from './threat-level-palette';

	type Props = { level: number };
	let { level = 0 }: Props = $props();

	const active = $derived(getVisualForLevel(level));
</script>

<div
	class="meter"
	role="img"
	aria-label={`Threat level scale. Current level ${active.value} — ${active.name}.`}
>
	{#each THREAT_LEVEL_VISUALS as item}
		<div
			class={`segment ${level === item.value ? 'active' : ''}`}
			style={`--tone:${item.color}; --accent:${item.accent}; --pattern:${item.pattern};`}
			aria-label={`Level ${item.value}: ${item.name}`}
			aria-current={level === item.value ? 'true' : undefined}
		>
			<span class="pattern" aria-hidden="true"></span>
			<div class="info">
				<span class="badge">Level {item.value}</span>
				<span class="name">{item.name}</span>
			</div>
			{#if level === item.value}
				<span class="current" aria-hidden="true">Current</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.meter {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		gap: 10px;
	}

	.segment {
		position: relative;
		border-radius: 14px;
		padding: 12px 12px 14px;
		background: linear-gradient(135deg, color-mix(in srgb, var(--tone) 82%, #0b1722 18%), #0c121c);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: #f3f7fb;
		overflow: hidden;
		min-height: 88px;
		isolation: isolate;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 10px 26px rgba(0, 0, 0, 0.26);
		transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
	}

	.segment:hover {
		transform: translateY(-2px);
	}

	.segment.active {
		border-color: color-mix(in srgb, var(--accent) 50%, white 30%);
		box-shadow:
			inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, white 20%),
			0 14px 30px rgba(0, 0, 0, 0.32),
			0 0 0 6px rgba(255, 255, 255, 0.03);
		transform: translateY(-3px);
	}

	.pattern {
		position: absolute;
		inset: 0;
		background-image: var(--pattern);
		opacity: 0.34;
		mix-blend-mode: screen;
		pointer-events: none;
		z-index: 0;
	}

	.info {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 4px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.82rem;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: rgba(0, 0, 0, 0.18);
		border-radius: 20px;
		padding: 4px 10px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		width: fit-content;
	}

	.name {
		font-size: 0.95rem;
	}

	.current {
		position: absolute;
		top: 10px;
		right: 10px;
		background: color-mix(in srgb, var(--accent) 30%, white 15%);
		color: #04111b;
		border-radius: 999px;
		padding: 4px 8px;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		border: 1px solid color-mix(in srgb, var(--accent) 40%, #ffffff 15%);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
		z-index: 1;
	}

	@media (max-width: 540px) {
		.segment {
			padding: 12px;
		}

		.info {
			gap: 2px;
			font-size: 0.78rem;
		}
	}
</style>
