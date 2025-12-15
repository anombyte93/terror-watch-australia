<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import Container from '$lib/components/Container.svelte';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	type Category = 'incident' | 'arrest' | 'policy' | 'community' | 'general';
	type Tone = 'default' | 'muted' | 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5';

	// Default threat level fallback
	const defaultThreatLevel = {
		level: 3,
		label: 'PROBABLE',
		description: 'Current threat assessment for Australia.',
		lastUpdated: new Date().toLocaleString('en-AU'),
		message: 'Stay vigilant and report suspicious activity to the National Security Hotline.',
		tone: 'level-3' as Tone
	};

	// Refreshed data from client-side fetch (null = use server data)
	let _refreshedThreatLevel = $state<typeof data.threatLevel | null>(null);
	let _refreshedNewsItems = $state<typeof data.newsItems | null>(null);
	let lastRefresh = $state(new Date());
	let refreshing = $state(false);

	// Derived values: prefer refreshed data, fallback to server data
	// Using $derived.by for explicit reactivity - reads current data at render time
	const threatLevel = $derived.by(() => _refreshedThreatLevel ?? data.threatLevel ?? defaultThreatLevel);
	const newsItems = $derived.by(() => _refreshedNewsItems ?? data.newsItems ?? []);

	// Auto-load news on mount if server returned empty (rare edge case)
	$effect(() => {
		const timeout = setTimeout(() => {
			const currentNews = _refreshedNewsItems ?? data.newsItems ?? [];
			if (currentNews.length === 0 && !refreshing) {
				refreshData();
			}
		}, 500);
		return () => clearTimeout(timeout);
	});

	// Auto-refresh every 5 minutes
	$effect(() => {
		const interval = setInterval(async () => {
			await refreshData();
		}, 5 * 60 * 1000); // 5 minutes

		return () => clearInterval(interval);
	});

	async function refreshData() {
		if (refreshing) return;
		refreshing = true;

		try {
			// Trigger news refresh
			await fetch('/api/news', { method: 'POST' }).catch(() => {});

			// Fetch updated data
			const [threatRes, newsRes] = await Promise.all([
				fetch('/api/threat-level'),
				fetch('/api/news?limit=10&days=7')
			]);

			if (threatRes.ok) {
				const threatData = await threatRes.json();
				_refreshedThreatLevel = {
					level: threatData.level,
					label: threatData.name.toUpperCase(),
					description: threatData.description || 'Current threat assessment for Australia.',
					lastUpdated: new Date(threatData.fetchedAt).toLocaleString('en-AU', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						timeZoneName: 'short'
					}),
					message: 'Stay vigilant and report suspicious activity to the National Security Hotline.',
					tone: `level-${threatData.level}` as Tone
				};
			}

			if (newsRes.ok) {
				const articles = await newsRes.json();
				_refreshedNewsItems = articles.map((article: any) => ({
					id: article.id,
					title: article.title,
					summary: article.summary || article.title,
					time: new Date(article.published_at).toLocaleDateString('en-AU', {
						day: 'numeric',
						month: 'short',
						year: 'numeric'
					}),
					category: article.category || 'general',
					url: article.url,
					source: article.source
				}));
			}

			lastRefresh = new Date();
		} catch (err) {
			console.error('Failed to refresh data:', err);
		} finally {
			refreshing = false;
		}
	}

	const threatScale = [
		{ level: 1, label: 'NOT EXPECTED', description: 'No specific threat identified.', color: 'var(--color-level-1)' },
		{ level: 2, label: 'POSSIBLE', description: 'Low threat with minimal indicators.', color: 'var(--color-level-2)' },
		{
			level: 3,
			label: 'PROBABLE',
			description: 'Credible intelligence suggests a threat is plausible.',
			color: 'var(--color-level-3)'
		},
		{ level: 4, label: 'EXPECTED', description: 'Likely threat with identified intent.', color: 'var(--color-level-4)' },
		{
			level: 5,
			label: 'CERTAIN',
			description: 'Confirmed threat with specific intelligence.',
			color: 'var(--color-level-5)'
		}
	];

	const categoryLabels: Record<Category, string> = {
		incident: 'Incident',
		arrest: 'Arrest & disruption',
		policy: 'Policy & guidance',
		community: 'Community outreach',
		general: 'Security news'
	};

	const categoryTones: Record<Category, Tone> = {
		incident: 'level-5',
		arrest: 'level-2',
		policy: 'muted',
		community: 'level-1',
		general: 'default'
	};

	const guidanceCards = [
		{
			title: 'Recognise suspicious behaviour',
			body: 'Unattended items, unusual interest in security, or testing reactions should be reported immediately.'
		},
		{
			title: 'Plan for crowded places',
			body: 'Agree a meeting point with family, note emergency exits, and keep personal items secured.'
		},
		{
			title: 'Share timely information',
			body: 'If you see something, say something. Provide clear details on location, time, and observations.'
		}
	];

	const quickLinks = [
		{ title: 'Protective Security Advice', href: '#guidance', description: 'Practical steps for venues, workplaces, and events.' },
		{
			title: 'Report suspicious behaviour',
			href: 'tel:1800123400',
			description: 'Call the National Security Hotline on 1800 123 400.'
		},
		{ title: 'Travel and alerts', href: 'https://www.smartraveller.gov.au', description: 'Check current advisories before you travel.' }
	];

	const contacts = [
		{ title: 'Emergency', value: '000', detail: 'Immediate danger or life-threatening situations.', href: 'tel:000' },
		{
			title: 'Police Assistance',
			value: '131 444',
			detail: 'Non-emergency police attendance and support.',
			href: 'tel:131444'
		},
		{
			title: 'National Security Hotline',
			value: '1800 123 400',
			detail: 'Report suspicious behaviour or information.',
			href: 'tel:1800123400'
		}
	];
</script>

<svelte:head>
	<title>Terror Watch Australia · Current Threat Level</title>
	<meta
		name="description"
		content="Australia's terrorism threat level, recent signals, and practical safety guidance in one place."
	/>

	<!-- Open Graph -->
	<meta property="og:title" content="Terror Watch Australia · Current Threat Level" />
	<meta property="og:description" content="Australia's terrorism threat level, recent signals, and practical safety guidance in one place." />
	<meta property="og:url" content="https://terrorwatch.au" />
	<meta property="og:image" content="https://terrorwatch.au/og-image.png" />

	<!-- Twitter -->
	<meta name="twitter:title" content="Terror Watch Australia · Current Threat Level" />
	<meta name="twitter:description" content="Australia's terrorism threat level, recent signals, and practical safety guidance in one place." />
	<meta name="twitter:image" content="https://terrorwatch.au/og-image.png" />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Terror Watch Australia",
		"url": "https://terrorwatch.au",
		"description": "Monitor Australia's current terrorism threat level with real-time updates and safety guidance",
		"publisher": {
			"@type": "Organization",
			"name": "Terror Watch Australia",
			"logo": {
				"@type": "ImageObject",
				"url": "https://terrorwatch.au/logo.png"
			}
		},
		"potentialAction": {
			"@type": "SearchAction",
			"target": "https://terrorwatch.au/search?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	}
	</script>`}

	<!-- Additional JSON-LD for Government Service -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "GovernmentService",
		"name": "National Security Threat Level",
		"serviceType": "Public Safety Information",
		"provider": {
			"@type": "GovernmentOrganization",
			"name": "Australian Government",
			"url": "https://www.nationalsecurity.gov.au"
		},
		"areaServed": {
			"@type": "Country",
			"name": "Australia"
		}
	}
	</script>`}
</svelte:head>

<section class="hero" id="threat">
	<Container width="wide">
		<div class="hero-grid">
			<div class="hero-text">
				<p class="eyebrow">Updated {threatLevel.lastUpdated}</p>
				<h1>Australia's terrorism threat level is {threatLevel.label}</h1>
				<p class="lede">{threatLevel.description}</p>
				<div class="cluster hero-actions">
					<Button variant="primary" href="#guidance">View safety guidance</Button>
					<Button variant="outline" href="#news">See recent signals</Button>
				</div>
				<div class="hero-note">
					<span class="dot" aria-hidden="true"></span>
					{threatLevel.message}
				</div>
			</div>

			<Card tone={threatLevel.tone} eyebrow="Threat indicator" title={`Level ${threatLevel.level} · ${threatLevel.label}`}>
				<p class="muted">Confidence: Elevated</p>
				<div class="scale">
					{#each threatScale as level}
						<div class={`scale-row ${level.level === threatLevel.level ? 'active' : ''}`}>
							<div class="scale-meta">
								<span class="pill level" style={`--tone:${level.color}`}>Level {level.level}</span>
								<span class="label">{level.label}</span>
							</div>
							<p class="muted">{level.description}</p>
						</div>
					{/each}
				</div>
			</Card>
		</div>
	</Container>
</section>

<section class="section" id="news">
	<Container width="wide">
		<div class="section-header">
			<div>
				<p class="eyebrow">
					<span class="live-indicator" class:refreshing></span>
					Signals &amp; news
					{#if refreshing}
						<span class="refresh-status">Updating...</span>
					{/if}
				</p>
				<h2>Recent intelligence-informed updates</h2>
				<p class="muted">
					Live feed from Australian news sources.
					<button class="refresh-btn" onclick={refreshData} disabled={refreshing}>
						{refreshing ? 'Refreshing...' : 'Refresh now'}
					</button>
				</p>
			</div>
			<Button variant="accent" href="#contacts">Emergency contacts</Button>
		</div>

		<!-- SSR renders with server data directly; client hydrates with reactive newsItems -->
		{@const ssrNewsItems = data.newsItems ?? []}
		<p style="color: red; font-weight: bold;">DEBUG: SSR={ssrNewsItems.length} / Reactive={newsItems.length}</p>
		<div class="grid news-grid">
			{#each ssrNewsItems.length > 0 ? ssrNewsItems : newsItems as item}
				{@const category = (item.category in categoryLabels ? item.category : 'general') as Category}
				<a href={item.url} target="_blank" rel="noopener noreferrer" class="news-link">
					<Card tone={categoryTones[category]} eyebrow={categoryLabels[category]} title={item.title}>
						<p>{item.summary}</p>
						<div class="meta cluster">
							<span class="chip">{item.time}</span>
							{#if item.source}
								<span class="chip source">{item.source}</span>
							{/if}
						</div>
					</Card>
				</a>
			{/each}
		</div>
		{#if ssrNewsItems.length === 0 && newsItems.length === 0}
			<div class="no-news">
				<p>No recent security news available. Check back soon for updates.</p>
			</div>
		{/if}
	</Container>
</section>

<section class="section" id="guidance">
	<Container>
		<div class="section-header">
			<div>
				<p class="eyebrow">Guidance</p>
				<h2>Quick actions for the public</h2>
				<p class="muted">Simple steps to stay aware, prepared, and supportive of community safety.</p>
			</div>
		</div>

		<div class="grid guidance-grid">
			{#each guidanceCards as item}
				<Card tone="muted" title={item.title}>
					<p>{item.body}</p>
				</Card>
			{/each}
		</div>

		<div class="quick-links">
			{#each quickLinks as link}
				<Card tone="default" title={link.title}>
					<p>{link.description}</p>
					<Button variant="ghost" href={link.href}>Open</Button>
				</Card>
			{/each}
		</div>
	</Container>
</section>

<section class="section contacts" id="contacts">
	<Container width="narrow">
		<div class="section-header">
			<div>
				<p class="eyebrow">Emergency contacts</p>
				<h2>Who to call</h2>
				<p class="muted">Use the correct number so responders can prioritise quickly.</p>
			</div>
		</div>
		<div class="grid contact-grid">
			{#each contacts as contact}
				<Card tone="muted" title={contact.title}>
					<p class="contact-number">{contact.value}</p>
					<p class="muted">{contact.detail}</p>
					<Button variant="outline" href={contact.href}>Call now</Button>
				</Card>
			{/each}
		</div>
	</Container>
</section>

<style>
	.hero {
		padding-top: clamp(1rem, 3vw, 2rem);
		padding-bottom: clamp(1.5rem, 4vw, 2.75rem);
	}

	.hero-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.25rem;
		align-items: start;
	}

	.hero-text h1 {
		margin: 0.15rem 0 0.5rem;
	}

	.hero .lede {
		font-size: 1.05rem;
		margin-bottom: 1rem;
		color: var(--text-secondary);
	}

	.hero-actions {
		margin: 1rem 0;
	}

	.hero-note {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		background: var(--surface-muted);
		color: var(--text-primary);
		border: 1px solid var(--border-subtle);
		box-shadow: var(--shadow-soft);
	}

	.hero-note .dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-accent);
		display: inline-block;
	}

	.scale {
		display: grid;
		gap: 0.6rem;
	}

	.scale-row {
		padding: 0.65rem 0.7rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
	}

	.scale-row.active {
		border-color: color-mix(in srgb, var(--color-level-3) 60%, var(--border-subtle));
		background: color-mix(in srgb, var(--color-level-3) 10%, var(--surface-panel));
	}

	.scale-meta {
		display: flex;
		gap: 0.65rem;
		align-items: center;
		margin-bottom: 0.35rem;
	}

	.scale .label {
		font-weight: 700;
		color: var(--text-primary);
	}

	.pill.level {
		background: color-mix(in srgb, var(--color-level-3) 18%, var(--surface-muted));
		border-color: var(--border-subtle);
		padding: 0.2rem 0.65rem;
		font-size: 0.95rem;
		color: var(--text-primary);
	}

	.section {
		padding: clamp(1.5rem, 4vw, 2.5rem) 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.news-grid {
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	}

	.news-link {
		text-decoration: none;
		color: inherit;
		display: block;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	.news-link:hover {
		transform: translateY(-2px);
	}

	.news-link:hover :global(.card) {
		box-shadow: var(--shadow-md);
		border-color: var(--color-primary);
	}

	.no-news {
		padding: 2rem;
		text-align: center;
		background: var(--surface-muted);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
	}

	.chip.source {
		background: var(--surface-panel);
		font-size: 0.85rem;
	}

	.live-indicator {
		display: inline-block;
		width: 8px;
		height: 8px;
		background: #22c55e;
		border-radius: 50%;
		margin-right: 0.5rem;
		animation: pulse 2s infinite;
	}

	.live-indicator.refreshing {
		background: #f97316;
		animation: spin 1s linear infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.refresh-status {
		font-size: 0.85rem;
		color: #f97316;
		margin-left: 0.5rem;
	}

	.refresh-btn {
		background: none;
		border: none;
		color: var(--color-primary);
		font-size: 0.9rem;
		cursor: pointer;
		text-decoration: underline;
		padding: 0;
		margin-left: 0.5rem;
	}

	.refresh-btn:hover:not(:disabled) {
		opacity: 0.8;
	}

	.refresh-btn:disabled {
		color: var(--text-tertiary);
		cursor: not-allowed;
	}

	.guidance-grid {
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		margin-bottom: 1rem;
	}

	.quick-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.meta {
		font-size: 0.95rem;
		justify-content: space-between;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.65rem;
		border-radius: 999px;
		border: 1px solid var(--border-subtle);
		background: var(--surface-muted);
		color: var(--text-primary);
		font-weight: 600;
	}

	.chip.incident {
		border-color: color-mix(in srgb, var(--color-incident) 40%, var(--border-subtle));
	}

	.chip.arrest {
		border-color: color-mix(in srgb, var(--color-arrest) 40%, var(--border-subtle));
	}

	.chip.policy {
		border-color: color-mix(in srgb, var(--color-policy) 40%, var(--border-subtle));
	}

	.chip.community {
		border-color: color-mix(in srgb, var(--color-community) 40%, var(--border-subtle));
	}

	.contacts {
		background: var(--surface-muted);
		border-top: 1px solid var(--border-subtle);
	}

	.contact-grid {
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
	}

	.contact-number {
		font-size: 1.4rem;
		font-weight: 800;
		margin: 0.1rem 0;
		color: var(--text-primary);
	}

	@media (max-width: 720px) {
		.section-header {
			align-items: flex-start;
		}
	}
</style>
