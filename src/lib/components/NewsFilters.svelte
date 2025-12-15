<svelte:options runes={true} />

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { CATEGORY_LABELS } from '$lib/config/news';
	import type { NewsCategory } from '$lib/types/news';

	type FilterCategory = NewsCategory | 'all';
	type FilterState = 'all' | string;

	const props = $props<{
		category?: FilterCategory;
		state?: FilterState;
		states: string[];
	}>();

	const dispatch = createEventDispatcher<{ change: { category: FilterCategory; state: FilterState } }>();

	let selectedCategory: FilterCategory = $state(props.category ?? 'all');
	let selectedState: FilterState = $state(props.state ?? 'all');

	$effect(() => {
		selectedCategory = props.category ?? 'all';
		selectedState = props.state ?? 'all';
	});

	const categories: FilterCategory[] = ['all', 'incident', 'arrest', 'policy', 'community'];
	const stateOptions = $derived(props.states ?? []);

	function onCategoryClick(value: FilterCategory) {
		if (selectedCategory === value) return;
		selectedCategory = value;
		emitChange();
	}

	function onStateChange(event: Event) {
		const value = (event.currentTarget as HTMLSelectElement).value as FilterState;
		selectedState = value;
		emitChange();
	}

	function emitChange() {
		dispatch('change', { category: selectedCategory, state: selectedState });
	}
</script>

<div class="filters">
	<div class="tabs" role="tablist" aria-label="Filter by news category">
		{#each categories as value}
			<button
				type="button"
				role="tab"
				class:selected={selectedCategory === value}
				onclick={() => onCategoryClick(value)}
			>
				{value === 'all' ? 'All' : CATEGORY_LABELS[value]}
			</button>
		{/each}
	</div>

	<label class="state-filter">
		<span>State / Territory</span>
		<div class="select-wrap">
			<select bind:value={selectedState} onchange={onStateChange}>
				<option value="all">All Australia</option>
				{#each stateOptions as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
			<span class="chevron" aria-hidden="true">⌄</span>
		</div>
	</label>
</div>

<style>
	.filters {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		justify-content: space-between;
		padding: 10px 12px;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 14px;
		background: rgba(12, 22, 35, 0.7);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
	}

	.tabs {
		display: inline-flex;
		gap: 8px;
		padding: 4px;
		background: rgba(255, 255, 255, 0.04);
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.tabs button {
		border: none;
		background: transparent;
		color: #c7d8ed;
		padding: 8px 14px;
		border-radius: 999px;
		font-weight: 700;
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 160ms ease, color 160ms ease, transform 160ms ease;
	}

	.tabs button:hover {
		color: #89c5ff;
		transform: translateY(-1px);
	}

	.tabs button.selected {
		background: linear-gradient(120deg, #2c7be5, #00c1ed);
		color: #04101b;
		box-shadow: 0 10px 24px rgba(0, 193, 237, 0.35);
	}

	.state-filter {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #d2e1f5;
		font-weight: 600;
	}

	.state-filter span {
		white-space: nowrap;
	}

	.select-wrap {
		position: relative;
	}

	.select-wrap select {
		background: rgba(255, 255, 255, 0.04);
		color: #e7f2ff;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		padding: 10px 36px 10px 12px;
		font-weight: 600;
		appearance: none;
		min-width: 150px;
	}

	.select-wrap select:focus {
		outline: 2px solid #49bfff;
		outline-offset: 2px;
	}

	.chevron {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: #9bb5d5;
	}

	@media (max-width: 720px) {
		.filters {
			flex-direction: column;
			align-items: stretch;
		}

		.tabs {
			width: 100%;
			flex-wrap: wrap;
			justify-content: center;
		}

		.state-filter {
			width: 100%;
			justify-content: space-between;
		}

		.select-wrap select {
			width: 100%;
		}
	}
</style>
