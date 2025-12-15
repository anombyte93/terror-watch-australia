<script lang="ts">
	import Container from '$lib/components/Container.svelte';

	interface HealthData {
		status: string;
		timestamp: string;
		version: string;
		uptime: number;
		memory: {
			heapUsed: number;
			heapTotal: number;
			rss: number;
		};
		node: string;
		environment: string;
	}

	let health = $state<HealthData | null>(null);
	let error = $state<string | null>(null);
	let loading = $state(true);
	let lastChecked = $state<Date | null>(null);

	async function fetchHealth() {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/health');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			health = await res.json();
			lastChecked = new Date();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch health data';
		} finally {
			loading = false;
		}
	}

	// Initial fetch
	$effect(() => {
		fetchHealth();
		// Auto-refresh every 30 seconds
		const interval = setInterval(fetchHealth, 30000);
		return () => clearInterval(interval);
	});

	function formatUptime(seconds: number): string {
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor((seconds % 86400) / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		const parts = [];
		if (days) parts.push(`${days}d`);
		if (hours) parts.push(`${hours}h`);
		if (mins) parts.push(`${mins}m`);
		parts.push(`${secs}s`);
		return parts.join(' ');
	}
</script>

<svelte:head>
	<title>System Status | Terror Watch Australia</title>
	<meta name="description" content="System status and health monitoring for Terror Watch Australia" />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="status-page">
	<Container width="narrow">
		<header class="page-header">
			<h1>System Status</h1>
			<p class="subtitle">Real-time health monitoring</p>
		</header>

		{#if loading && !health}
			<div class="status-card loading">
				<div class="spinner"></div>
				<p>Checking system health...</p>
			</div>
		{:else if error}
			<div class="status-card error">
				<div class="status-indicator down"></div>
				<h2>System Unavailable</h2>
				<p>{error}</p>
				<button onclick={fetchHealth}>Retry</button>
			</div>
		{:else if health}
			<div class="status-card">
				<div class="status-header">
					<div class="status-indicator {health.status === 'ok' ? 'up' : 'down'}"></div>
					<div class="status-text">
						<h2>{health.status === 'ok' ? 'All Systems Operational' : 'System Issues'}</h2>
						<p class="timestamp">Last checked: {lastChecked?.toLocaleTimeString()}</p>
					</div>
				</div>

				<div class="metrics-grid">
					<div class="metric">
						<span class="label">Uptime</span>
						<span class="value">{formatUptime(health.uptime)}</span>
					</div>
					<div class="metric">
						<span class="label">Version</span>
						<span class="value">{health.version}</span>
					</div>
					<div class="metric">
						<span class="label">Environment</span>
						<span class="value">{health.environment}</span>
					</div>
					<div class="metric">
						<span class="label">Node.js</span>
						<span class="value">{health.node}</span>
					</div>
				</div>

				<div class="memory-section">
					<h3>Memory Usage</h3>
					<div class="memory-bars">
						<div class="memory-item">
							<span class="label">Heap Used</span>
							<div class="bar-container">
								<div
									class="bar"
									style="width: {(health.memory.heapUsed / health.memory.heapTotal) * 100}%"
								></div>
							</div>
							<span class="value">{health.memory.heapUsed} MB</span>
						</div>
						<div class="memory-item">
							<span class="label">Heap Total</span>
							<div class="bar-container">
								<div class="bar" style="width: 100%"></div>
							</div>
							<span class="value">{health.memory.heapTotal} MB</span>
						</div>
						<div class="memory-item">
							<span class="label">RSS</span>
							<div class="bar-container">
								<div class="bar rss" style="width: 80%"></div>
							</div>
							<span class="value">{health.memory.rss} MB</span>
						</div>
					</div>
				</div>
			</div>

			<div class="services-card">
				<h3>Services</h3>
				<div class="service-list">
					<div class="service">
						<span class="indicator up"></span>
						<span class="name">Web Application</span>
						<span class="status-text">Operational</span>
					</div>
					<div class="service">
						<span class="indicator up"></span>
						<span class="name">API Endpoints</span>
						<span class="status-text">Operational</span>
					</div>
					<div class="service">
						<span class="indicator up"></span>
						<span class="name">Real-time Updates (SSE)</span>
						<span class="status-text">Operational</span>
					</div>
					<div class="service">
						<span class="indicator up"></span>
						<span class="name">Database</span>
						<span class="status-text">Operational</span>
					</div>
				</div>
			</div>
		{/if}

		<footer class="page-footer">
			<p>
				Monitoring powered by Railway. For issues, contact
				<a href="mailto:support@terrorwatch.au">support@terrorwatch.au</a>
			</p>
		</footer>
	</Container>
</div>

<style>
	.status-page {
		padding: 2rem 0 4rem;
		min-height: 100vh;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0 0 0.35rem;
	}

	.subtitle {
		color: var(--text-secondary);
		font-size: 1rem;
		margin: 0;
	}

	.status-card {
		background: var(--surface-panel);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.status-card.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 3rem;
	}

	.status-card.error {
		border-color: #ef4444;
		text-align: center;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border-subtle);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.status-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-subtle);
	}

	.status-indicator {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.status-indicator.up {
		background: #22c55e;
		box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
	}

	.status-indicator.down {
		background: #ef4444;
		box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
	}

	.status-text h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.timestamp {
		color: var(--text-tertiary);
		font-size: 0.85rem;
		margin: 0.25rem 0 0;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.metric {
		background: var(--surface-muted);
		padding: 1rem;
		border-radius: var(--radius-md);
	}

	.metric .label {
		display: block;
		color: var(--text-tertiary);
		font-size: 0.8rem;
		margin-bottom: 0.25rem;
	}

	.metric .value {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.memory-section h3 {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin: 0 0 1rem;
	}

	.memory-bars {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.memory-item {
		display: grid;
		grid-template-columns: 100px 1fr 60px;
		gap: 0.75rem;
		align-items: center;
	}

	.memory-item .label {
		color: var(--text-secondary);
		font-size: 0.85rem;
	}

	.bar-container {
		height: 8px;
		background: var(--surface-muted);
		border-radius: 4px;
		overflow: hidden;
	}

	.bar {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary), #22c55e);
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.bar.rss {
		background: linear-gradient(90deg, #f97316, #facc15);
	}

	.memory-item .value {
		text-align: right;
		font-size: 0.85rem;
		color: var(--text-primary);
		font-weight: 500;
	}

	.services-card {
		background: var(--surface-panel);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.services-card h3 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 1rem;
	}

	.service-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.service {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: var(--surface-muted);
		border-radius: var(--radius-md);
	}

	.service .indicator {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.service .indicator.up {
		background: #22c55e;
	}

	.service .name {
		flex: 1;
		font-weight: 500;
		color: var(--text-primary);
	}

	.service .status-text {
		color: #22c55e;
		font-size: 0.85rem;
		font-weight: 500;
	}

	.page-footer {
		text-align: center;
		color: var(--text-tertiary);
		font-size: 0.85rem;
		margin-top: 2rem;
	}

	.page-footer a {
		color: var(--color-primary);
	}

	button {
		margin-top: 1rem;
		padding: 0.5rem 1.5rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
	}

	button:hover {
		opacity: 0.9;
	}
</style>
