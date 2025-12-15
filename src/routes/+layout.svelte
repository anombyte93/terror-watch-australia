<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Layout from '$lib/components/Layout.svelte';
	import type { Snippet } from 'svelte';

	const { children } = $props<{ children: Snippet }>();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Layout>
	{@render children()}
</Layout>
