<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Layout from '$lib/components/Layout.svelte';
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	const { children } = $props<{ children: Snippet }>();

	const siteName = 'Terror Watch Australia';
	const siteDescription = "Monitor Australia's current terrorism threat level with real-time updates, security news, and official safety guidance.";
	const siteUrl = 'https://terrorwatch.au';
</script>

<svelte:head>
	<!-- Favicon -->
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />

	<!-- Default Meta -->
	<meta name="robots" content="index, follow" />
	<meta name="author" content="Terror Watch Australia" />
	<meta name="theme-color" content="#0f172a" />

	<!-- Default Open Graph -->
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_AU" />
	<meta property="og:type" content="website" />

	<!-- Default Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@TerrorWatchAU" />

	<!-- Canonical URL -->
	<link rel="canonical" href="{siteUrl}{$page.url.pathname}" />

	<!-- Preconnect to external resources -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="dns-prefetch" href="https://nationalsecurity.gov.au" />
</svelte:head>

<Layout>
	{@render children()}
</Layout>
