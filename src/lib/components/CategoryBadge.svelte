<svelte:options runes={true} />

<script lang="ts">
	import type { NewsCategory } from '$lib/types/news';
	import { CATEGORY_LABELS } from '$lib/config/news';

	const props = $props<{ category: NewsCategory }>();
	const category: NewsCategory = $derived(props.category);

	const label = $derived(CATEGORY_LABELS[category] ?? category);
</script>

<span class={`badge ${category}`} data-category={category} aria-label={label}>
	<span class="dot" aria-hidden="true"></span>
	{label}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 10px;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: capitalize;
		letter-spacing: 0.01em;
		border: 1px solid transparent;
		background: rgba(255, 255, 255, 0.04);
		color: #e8f1fb;
	}

	.badge .dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.04);
	}

	.badge.incident {
		background: rgba(255, 77, 77, 0.12);
		border-color: rgba(255, 77, 77, 0.4);
		color: #ffd2d2;
	}

	.badge.incident .dot {
		background: #ff4d4d;
	}

	.badge.arrest {
		background: rgba(61, 139, 255, 0.12);
		border-color: rgba(61, 139, 255, 0.4);
		color: #c7dcff;
	}

	.badge.arrest .dot {
		background: #3d8bff;
	}

	.badge.policy {
		background: rgba(132, 146, 166, 0.14);
		border-color: rgba(132, 146, 166, 0.45);
		color: #d9e2f1;
	}

	.badge.policy .dot {
		background: #9aa5b8;
	}

	.badge.community {
		background: rgba(76, 175, 80, 0.12);
		border-color: rgba(76, 175, 80, 0.42);
		color: #cfe9d0;
	}

	.badge.community .dot {
		background: #4caf50;
	}
</style>
