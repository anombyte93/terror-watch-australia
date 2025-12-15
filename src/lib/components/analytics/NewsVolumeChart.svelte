<script lang="ts">
	interface DataPoint {
		date: string;
		count: number;
		category?: string;
	}

	interface Props {
		data: DataPoint[];
	}

	const { data }: Props = $props();

	const width = 800;
	const height = 240;
	const padding = { top: 24, right: 24, bottom: 50, left: 50 };

	const chartWidth = width - padding.left - padding.right;
	const chartHeight = height - padding.top - padding.bottom;

	const maxCount = $derived(Math.max(...data.map(d => d.count), 1));
	const barWidth = $derived(data.length > 0 ? Math.min((chartWidth / data.length) * 0.7, 40) : 20);
	const barGap = $derived(data.length > 0 ? (chartWidth - barWidth * data.length) / (data.length + 1) : 0);

	const xScale = (index: number) =>
		padding.left + barGap + index * (barWidth + barGap) + barWidth / 2;

	const yScale = (count: number) =>
		padding.top + chartHeight - (count / maxCount) * chartHeight;

	const barHeight = (count: number) => (count / maxCount) * chartHeight;

	const formatDate = (dateStr: string): string => {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
	};

	// Generate Y-axis ticks
	const yTicks = $derived(() => {
		const step = Math.ceil(maxCount / 5);
		const ticks = [];
		for (let i = 0; i <= maxCount; i += step) {
			ticks.push(i);
		}
		return ticks;
	});
</script>

<div class="chart-container">
	<svg viewBox="0 0 {width} {height}" class="volume-chart" preserveAspectRatio="xMidYMid meet">
		<!-- Gradient for bars -->
		<defs>
			<linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
				<stop offset="0%" stop-color="#3b82f6" />
				<stop offset="100%" stop-color="#1d4ed8" />
			</linearGradient>
		</defs>

		<!-- Y-axis grid lines and labels -->
		{#each yTicks() as tick}
			<line
				x1={padding.left}
				y1={yScale(tick)}
				x2={width - padding.right}
				y2={yScale(tick)}
				class="grid-line"
			/>
			<text x={padding.left - 12} y={yScale(tick)} class="axis-label y-label">
				{tick}
			</text>
		{/each}

		<!-- Bars -->
		{#each data as point, i}
			<g class="bar-group">
				<rect
					x={xScale(i) - barWidth / 2}
					y={yScale(point.count)}
					width={barWidth}
					height={barHeight(point.count)}
					class="bar"
					rx="4"
				>
					<title>{formatDate(point.date)}: {point.count} articles</title>
				</rect>
			</g>
		{/each}

		<!-- X-axis labels (show selected dates) -->
		{#each data as point, i}
			{#if i === 0 || i === data.length - 1 || (data.length > 7 && i % Math.floor(data.length / 5) === 0)}
				<text
					x={xScale(i)}
					y={height - 12}
					class="axis-label x-label"
				>
					{formatDate(point.date)}
				</text>
			{/if}
		{/each}

		<!-- Y-axis title -->
		<text
			x={14}
			y={padding.top + chartHeight / 2}
			class="axis-title"
			transform="rotate(-90, 14, {padding.top + chartHeight / 2})"
		>
			Articles
		</text>
	</svg>

	{#if data.length === 0}
		<div class="no-data">No news volume data available</div>
	{/if}
</div>

<style>
	.chart-container {
		position: relative;
		width: 100%;
	}

	.volume-chart {
		width: 100%;
		height: auto;
		background: var(--surface-panel, rgba(255, 255, 255, 0.02));
		border-radius: var(--radius-md, 12px);
		border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.06));
	}

	.grid-line {
		stroke: var(--border-subtle, rgba(255, 255, 255, 0.08));
		stroke-dasharray: 4 4;
	}

	.axis-label {
		fill: var(--text-secondary, #9ca3af);
		font-size: 11px;
	}

	.y-label {
		text-anchor: end;
		dominant-baseline: middle;
	}

	.x-label {
		text-anchor: middle;
		dominant-baseline: hanging;
	}

	.axis-title {
		fill: var(--text-tertiary, #6b7280);
		font-size: 11px;
		text-anchor: middle;
	}

	.bar {
		fill: url(#barGradient);
		cursor: pointer;
		transition: opacity 150ms ease;
	}

	.bar:hover {
		opacity: 0.85;
	}

	.no-data {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary, #6b7280);
		font-size: 0.9rem;
	}
</style>
