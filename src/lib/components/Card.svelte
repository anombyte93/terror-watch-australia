<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone =
		| 'default'
		| 'muted'
		| 'level-1'
		| 'level-2'
		| 'level-3'
		| 'level-4'
		| 'level-5';

	const { children, title, eyebrow, tone = 'default' } = $props<{
		children?: Snippet;
		title?: string;
		eyebrow?: string;
		tone?: Tone;
	}>();
</script>

<article class={`card ${tone}`}>
	{#if eyebrow}
		<p class="eyebrow">{eyebrow}</p>
	{/if}
	{#if title}
		<h3>{title}</h3>
	{/if}
	<div class="content">
		{@render children?.()}
	</div>
</article>

<style>
	.card {
		background: var(--surface-panel);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		padding: 1.1rem 1.2rem;
		box-shadow: var(--shadow-soft);
		display: grid;
		gap: 0.6rem;
	}

	.card h3 {
		margin: 0;
	}

	.card .eyebrow {
		margin: 0;
	}

	.card .content {
		display: grid;
		gap: 0.4rem;
		color: var(--text-secondary);
	}

	.card.muted {
		background: var(--surface-muted);
	}

	.card.level-1 {
		border-color: color-mix(in srgb, var(--color-level-1) 45%, var(--border-subtle));
	}

	.card.level-2 {
		border-color: color-mix(in srgb, var(--color-level-2) 45%, var(--border-subtle));
	}

	.card.level-3 {
		border-color: color-mix(in srgb, var(--color-level-3) 45%, var(--border-subtle));
	}

	.card.level-4 {
		border-color: color-mix(in srgb, var(--color-level-4) 45%, var(--border-subtle));
	}

	.card.level-5 {
		border-color: color-mix(in srgb, var(--color-level-5) 45%, var(--border-subtle));
	}
</style>
