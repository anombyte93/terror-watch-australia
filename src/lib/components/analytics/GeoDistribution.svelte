<script lang="ts">
	interface StateData {
		state: string;
		count: number;
		percentage: number;
	}

	interface Props {
		data: StateData[];
	}

	const { data }: Props = $props();

	const maxCount = $derived(Math.max(...data.map(d => d.count), 1));

	const stateLabels: Record<string, string> = {
		NSW: 'New South Wales',
		VIC: 'Victoria',
		QLD: 'Queensland',
		WA: 'Western Australia',
		SA: 'South Australia',
		TAS: 'Tasmania',
		NT: 'Northern Territory',
		ACT: 'Australian Capital Territory',
		OTHER: 'Other/National'
	};

	const getBarWidth = (count: number): number => {
		return (count / maxCount) * 100;
	};

	const getColorIntensity = (count: number): string => {
		const intensity = Math.min((count / maxCount) * 100, 100);
		if (intensity > 75) return 'high';
		if (intensity > 40) return 'medium';
		return 'low';
	};
</script>

<div class="geo-distribution">
	{#if data.length > 0}
		<div class="bars">
			{#each data as item}
				<div class="bar-row">
					<div class="label">
						<span class="state-code">{item.state}</span>
						<span class="state-name">{stateLabels[item.state] ?? item.state}</span>
					</div>
					<div class="bar-container">
						<div
							class="bar {getColorIntensity(item.count)}"
							style="width: {getBarWidth(item.count)}%"
						>
							<span class="count">{item.count}</span>
						</div>
					</div>
					<div class="percentage">{item.percentage}%</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="no-data">No geographic distribution data available</div>
	{/if}
</div>

<style>
	.geo-distribution {
		background: var(--surface-panel, rgba(255, 255, 255, 0.02));
		border-radius: var(--radius-md, 12px);
		border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
		padding: 1.25rem;
	}

	.bars {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.bar-row {
		display: grid;
		grid-template-columns: 140px 1fr 50px;
		align-items: center;
		gap: 0.75rem;
	}

	.label {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.state-code {
		font-weight: 600;
		color: var(--text-primary, #e5e7eb);
		font-size: 0.9rem;
	}

	.state-name {
		color: var(--text-tertiary, #6b7280);
		font-size: 0.75rem;
	}

	.bar-container {
		height: 28px;
		background: var(--surface-muted, rgba(255, 255, 255, 0.04));
		border-radius: 6px;
		overflow: hidden;
	}

	.bar {
		height: 100%;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 0.5rem;
		min-width: 32px;
		transition: width 0.3s ease;
	}

	.bar.high {
		background: linear-gradient(90deg, #3b82f6, #1d4ed8);
	}

	.bar.medium {
		background: linear-gradient(90deg, #60a5fa, #3b82f6);
	}

	.bar.low {
		background: linear-gradient(90deg, #93c5fd, #60a5fa);
	}

	.count {
		color: white;
		font-size: 0.8rem;
		font-weight: 600;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.percentage {
		color: var(--text-secondary, #9ca3af);
		font-size: 0.85rem;
		text-align: right;
		font-weight: 500;
	}

	.no-data {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary, #6b7280);
		font-size: 0.9rem;
		min-height: 200px;
	}

	@media (max-width: 640px) {
		.bar-row {
			grid-template-columns: 100px 1fr 40px;
		}

		.state-name {
			display: none;
		}
	}
</style>
