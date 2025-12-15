<svelte:options runes={true} />

<script lang="ts">
	import { page } from '$app/stores';
	import EmergencyBanner from '$lib/components/EmergencyBanner.svelte';
	import type { Snippet } from 'svelte';

	type Props = { children: Snippet };
	const { children }: Props = $props();

	const navLinks = [
		{ href: '/safety', label: 'Safety hub', summary: 'Overview of key guidance and contacts.' },
		{
			href: '/safety/during-attack',
			label: 'What to do in an attack',
			summary: 'Run, Hide, Tell steps for immediate action.'
		},
		{
			href: '/safety/report',
			label: 'Report suspicious activity',
			summary: 'Signs to look for and how to contact authorities.'
		},
		{
			href: '/safety/threat-levels',
			label: 'Understanding threat levels',
			summary: 'Plain-language explanation of Australia’s system.'
		},
		{
			href: '/safety/support',
			label: 'Support resources',
			summary: 'Mental health and community assistance.'
		}
	];

	const labelMap: Record<string, string> = {
		safety: 'Safety',
		'during-attack': 'During an attack',
		report: 'Report',
		'threat-levels': 'Threat levels',
		support: 'Support'
	};

	const segments = $derived($page.url.pathname.split('/').filter(Boolean));
	const breadcrumb = $derived([
		{ label: 'Home', href: '/', isCurrent: segments.length === 0 },
		...segments.map((segment, index) => {
			const href = `/${segments.slice(0, index + 1).join('/')}`;
			const label = labelMap[segment] ?? segment.replace(/-/g, ' ');
			return {
				label: label.charAt(0).toUpperCase() + label.slice(1),
				href,
				isCurrent: index === segments.length - 1
			};
		})
	]);

	const currentPath = $derived($page.url.pathname);

	const isActive = (href: string) =>
		currentPath === href || currentPath.startsWith(`${href}/`);
</script>

<svelte:head>
	<meta
		name="description"
		content="Trusted safety guidance for Australians: emergency contacts, reporting pathways, and threat level information."
	/>
</svelte:head>

<div class="safety-layout">
	<header class="page-header">
		<div class="headline">
			<p class="eyebrow">Safety guidance</p>
			<h1>Stay prepared. Stay calm.</h1>
			<p class="lede">
				Official advice to help you act quickly, report concerns, and look after yourself and your
				community.
			</p>
		</div>
		<EmergencyBanner />
	</header>

	<nav class="breadcrumbs" aria-label="Breadcrumb">
		{#each breadcrumb as crumb, index}
			{#if index > 0}
				<span class="divider" aria-hidden="true">/</span>
			{/if}
			{#if crumb.isCurrent}
				<span class="current" aria-current="page">{crumb.label}</span>
			{:else}
				<a href={crumb.href}>{crumb.label}</a>
			{/if}
		{/each}
	</nav>

	<div class="content-shell">
		<aside class="sidebar" aria-label="Safety section navigation">
			<div class="sidebar-card">
				<p class="sidebar-title">Navigate</p>
				<ul>
					{#each navLinks as link}
						<li class:is-active={isActive(link.href)}>
							<a href={link.href}>
								<span class="link-label">{link.label}</span>
								<span class="link-summary">{link.summary}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="sidebar-card secondary">
				<p class="sidebar-title">If unsure</p>
				<p class="sidebar-body">
					If something feels wrong, move to safety and call <strong>000</strong>. Trust your instincts.
				</p>
			</div>
		</aside>

		<div class="content-area">{@render children()}</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background: radial-gradient(circle at 18% 20%, #0d1a2a 0, #081320 46%, #060e19 100%);
		color: #e8f0fb;
		font-family:
			'Space Grotesk',
			'IBM Plex Sans',
			'Public Sans',
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			sans-serif;
	}

	.safety-layout {
		max-width: 1180px;
		margin: 0 auto;
		padding: 72px 22px 56px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.page-header {
		display: grid;
		grid-template-columns: 1fr minmax(260px, 380px);
		gap: 16px;
		align-items: center;
	}

	.headline h1 {
		margin: 6px 0 10px;
		font-size: clamp(2.1rem, 3vw, 2.6rem);
	}

	.eyebrow {
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #8ed0ff;
		margin: 0;
		font-size: 0.8rem;
	}

	.lede {
		margin: 0;
		color: #cdd8e7;
		line-height: 1.6;
		max-width: 680px;
	}

	.breadcrumbs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		color: #a8b8ce;
		font-size: 0.95rem;
	}

	.breadcrumbs a {
		color: #d8e7ff;
		text-decoration: none;
	}

	.breadcrumbs a:hover {
		color: #ffffff;
		text-decoration: underline;
	}

	.current {
		color: #fff;
		font-weight: 600;
	}

	.divider {
		color: #62748a;
	}

	.content-shell {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 18px;
		align-items: start;
	}

	.sidebar {
		position: sticky;
		top: 24px;
		display: grid;
		gap: 12px;
	}

	.sidebar-card {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		padding: 12px 12px 10px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
	}

	.sidebar-card.secondary {
		background: rgba(255, 255, 255, 0.03);
		border-style: dashed;
	}

	.sidebar-title {
		margin: 0 0 8px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9bc5ff;
		font-size: 0.78rem;
	}

	.sidebar ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}

	.sidebar li {
		border-radius: 10px;
	}

	.sidebar a {
		display: grid;
		gap: 2px;
		padding: 10px 12px;
		color: #e9f3ff;
		text-decoration: none;
		border-radius: 10px;
		border: 1px solid transparent;
	}

	.sidebar li:hover a {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.sidebar li.is-active a {
		background: rgba(17, 201, 228, 0.08);
		border-color: rgba(17, 201, 228, 0.3);
		box-shadow: 0 6px 20px rgba(17, 201, 228, 0.15);
	}

	.link-label {
		font-weight: 600;
	}

	.link-summary {
		font-size: 0.9rem;
		color: #c8d5e5;
		line-height: 1.4;
	}

	.sidebar-body {
		margin: 0;
		color: #d6e3f3;
		line-height: 1.4;
		font-size: 0.95rem;
	}

	.content-area {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 16px;
		padding: 18px 20px;
		box-shadow: 0 14px 36px rgba(0, 0, 0, 0.32);
	}

	@media (max-width: 900px) {
		.page-header {
			grid-template-columns: 1fr;
		}

		.content-shell {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: relative;
			top: 0;
		}
	}

	@media (max-width: 540px) {
		.safety-layout {
			padding-top: 56px;
		}

		.content-area {
			padding: 14px;
		}
	}
</style>
