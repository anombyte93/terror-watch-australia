<script lang="ts">
	type Trend = 'positive' | 'negative' | 'neutral';
	
	interface Props {
		label: string;
		value: number | string;
		trend?: Trend;
		subtitle?: string;
	}
	
	const { label, value, trend = 'neutral', subtitle }: Props = $props();
	
	const formatValue = (val: number | string): string => {
		if (typeof val === 'number') {
			return val.toLocaleString();
		}
		return val;
	};
</script>

<div class="stat-card">
	<span class="label">{label}</span>
	<div class="value-row">
		<span class="value">{formatValue(value)}</span>
		{#if trend !== 'neutral'}
			<span class="trend {trend}" aria-label={trend === 'positive' ? 'Trending up' : 'Trending down'}>
				{trend === 'positive' ? '↑' : '↓'}
			</span>
		{/if}
	</div>
	{#if subtitle}
		<span class="subtitle">{subtitle}</span>
	{/if}
</div>

<style>
	.stat-card {
		background: var(--surface-panel, rgba(255, 255, 255, 0.04));
		border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
		border-radius: var(--radius-md, 14px);
		padding: 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-raised, 0 8px 24px rgba(0, 0, 0, 0.15));
	}

	.label {
		color: var(--text-secondary, #9ca3af);
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 500;
	}

	.value-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.value {
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--text-primary, #e5e7eb);
		line-height: 1.1;
	}

	.trend {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.trend.positive {
		color: var(--color-success, #4ade80);
	}

	.trend.negative {
		color: var(--color-error, #f87171);
	}

	.subtitle {
		color: var(--text-tertiary, #6b7280);
		font-size: 0.85rem;
	}
</style>
