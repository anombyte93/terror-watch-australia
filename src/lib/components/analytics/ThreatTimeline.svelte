<script lang="ts">
	interface DataPoint {
		date: string;
		level: number;
		levelName: string;
	}

	interface Props {
		data: DataPoint[];
	}

	const { data }: Props = $props();

	const width = 800;
	const height = 220;
	const padding = { top: 24, right: 24, bottom: 40, left: 50 };

	const chartWidth = width - padding.left - padding.right;
	const chartHeight = height - padding.top - padding.bottom;

	const xScale = (index: number) =>
		padding.left + (index / Math.max(data.length - 1, 1)) * chartWidth;

	const yScale = (level: number) =>
		padding.top + chartHeight - ((level - 1) / 4) * chartHeight;

	const pathD = $derived(
		data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.level)}`).join(' ')
	);

	const areaD = $derived(
		data.length > 0
			? `${pathD} L ${xScale(data.length - 1)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`
			: ''
	);

	const levelColors: Record<number, string> = {
		1: '#22c55e',
		2: '#84cc16',
		3: '#eab308',
		4: '#f97316',
		5: '#ef4444'
	};

	const levelLabels: Record<number, string> = {
		1: 'Low',
		2: 'Possible',
		3: 'Probable',
		4: 'Expected',
		5: 'Certain'
	};

	const formatDate = (dateStr: string): string => {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
	};
</script>

<div class="chart-container">
	<svg viewBox="0 0 {width} {height}" class="threat-timeline" preserveAspectRatio="xMidYMid meet">
		<defs>
			<linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
				<stop offset="0%" stop-color="#60a5fa" stop-opacity="0.3" />
				<stop offset="100%" stop-color="#60a5fa" stop-opacity="0.02" />
			</linearGradient>
		</defs>

		{#each [1, 2, 3, 4, 5] as level}
			<line
				x1={padding.left}
				y1={yScale(level)}
				x2={width - padding.right}
				y2={yScale(level)}
				class="grid-line"
			/>
			<text x={padding.left - 12} y={yScale(level)} class="axis-label y-label">
				{levelLabels[level]}
			</text>
		{/each}

		{#if data.length > 0}
			<path d={areaD} class="area-fill" fill="url(#areaGradient)" />
			<path d={pathD} class="trend-line" />
		{/if}

		{#each data as point, i}
			<circle
				cx={xScale(i)}
				cy={yScale(point.level)}
				r="6"
				fill={levelColors[point.level]}
				class="data-point"
			>
				<title>{formatDate(point.date)}: Level {point.level} ({point.levelName})</title>
			</circle>
		{/each}

		{#each data as point, i}
			{#if i === 0 || i === data.length - 1 || (data.length > 10 && i % Math.floor(data.length / 5) === 0)}
				<text x={xScale(i)} y={height - 12} class="axis-label x-label">
					{formatDate(point.date)}
				</text>
			{/if}
		{/each}
	</svg>

	{#if data.length === 0}
		<div class="no-data">No threat level data available</div>
	{/if}
</div>

<style>
	.chart-container {
		position: relative;
		width: 100%;
	}

	.threat-timeline {
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

	.area-fill {
		opacity: 1;
	}

	.trend-line {
		fill: none;
		stroke: #60a5fa;
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.data-point {
		cursor: pointer;
		transition: r 150ms ease;
		stroke: var(--surface-page, #0f0f0f);
		stroke-width: 2;
	}

	.data-point:hover {
		r: 9;
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
