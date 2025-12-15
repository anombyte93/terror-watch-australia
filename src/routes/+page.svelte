<svelte:head>
	<title>Terror Watch Australia</title>
	<meta
		name="description"
		content="Public information site tracking Australia's terrorism threat level with context and guidance."
	/>
</svelte:head>

<main class="page">
	<section class="hero">
		<p class="eyebrow">Task 1 · Project setup</p>
		<h1>Terror Watch Australia</h1>
		<p class="lede">
			Deployment-ready SvelteKit starter for tracking Australia's national terrorism threat level,
			news signals, and safety guidance.
		</p>
		<div class="actions">
			<a class="btn" href="/api/health" aria-label="Health check endpoint"> Health check </a>
			<a class="link" href="https://www.nationalsecurity.gov.au" target="_blank" rel="noreferrer">
				Primary data source
			</a>
		</div>
	</section>

	<section class="grid">
		<div class="card">
			<h2>What&#39;s ready</h2>
			<ul>
				<li>Railway-focused Node adapter and health endpoint</li>
				<li>TypeScript strict mode with linting and formatting</li>
				<li>Drizzle + PostgreSQL wiring for future data models</li>
			</ul>
		</div>
		<div class="card">
			<h2>Next up</h2>
			<ul>
				<li>Threat level ingestion from nationalsecurity.gov.au</li>
				<li>News aggregation and summarisation services</li>
				<li>Accessible threat level and safety guidance UI</li>
			</ul>
		</div>
	</section>
</main>

<style>
	:global(body) {
		background: radial-gradient(circle at 20% 20%, #102235 0, #0b1621 45%, #050b12 100%);
		color: #e4edf5;
		font-family:
			'Space Grotesk',
			'IBM Plex Sans',
			'Public Sans',
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
		margin: 0;
	}

	.page {
		max-width: 960px;
		margin: 0 auto;
		padding: 96px 24px 64px;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.hero h1 {
		font-size: clamp(2.4rem, 4vw, 3rem);
		margin: 8px 0;
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-size: 0.8rem;
		color: #7fb3ff;
		margin: 0;
	}

	.lede {
		font-size: 1.1rem;
		line-height: 1.6;
		max-width: 720px;
		color: #cdd9e5;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 16px;
	}

	.btn {
		background: linear-gradient(120deg, #1f7ae0, #11c9e4);
		border-radius: 12px;
		color: #061019;
		padding: 12px 18px;
		font-weight: 600;
		text-decoration: none;
		box-shadow: 0 10px 30px rgba(17, 201, 228, 0.3);
	}

	.btn:hover {
		transform: translateY(-1px);
	}

	.link {
		color: #9bc7ff;
		text-decoration: none;
		border-bottom: 1px solid rgba(155, 199, 255, 0.5);
		padding-bottom: 2px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 18px;
	}

	.card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		padding: 18px 20px;
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
	}

	.card h2 {
		margin-top: 0;
		margin-bottom: 12px;
		font-size: 1.2rem;
	}

	.card ul {
		padding-left: 18px;
		margin: 0;
		display: grid;
		gap: 8px;
	}

	.card li {
		line-height: 1.5;
		color: #d4e2ef;
	}

	@media (max-width: 640px) {
		.page {
			padding-top: 72px;
		}

		.hero h1 {
			font-size: 2rem;
		}
	}
</style>
