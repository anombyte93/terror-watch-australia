<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';

	type Theme = 'light' | 'dark';

	const { children } = $props<{ children?: Snippet }>();

	const STORAGE_KEY = 'twa-theme';
	let theme = $state<Theme>('light');

	const applyTheme = (value: Theme, persist = true) => {
		theme = value;
		if (typeof document !== 'undefined') {
			document.documentElement.dataset.theme = value;
		}
		if (persist) {
			localStorage.setItem(STORAGE_KEY, value);
		}
	};

	const toggleTheme = () => {
		applyTheme(theme === 'light' ? 'dark' : 'light');
	};

	onMount(() => {
		const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? null;
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const initial = saved ?? (media.matches ? 'dark' : 'light');

		applyTheme(initial, Boolean(saved));

		const handler = (event: MediaQueryListEvent) => {
			if (!localStorage.getItem(STORAGE_KEY)) {
				applyTheme(event.matches ? 'dark' : 'light', false);
			}
		};

		media.addEventListener('change', handler);
		return () => media.removeEventListener('change', handler);
	});
</script>

<div class="app-shell">
	<Header currentTheme={theme} onToggleTheme={toggleTheme} />
	<main class="main-content">
		{@render children?.()}
	</main>
	<Footer />
</div>

<style>
	.app-shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: radial-gradient(circle at 20% 0%, rgba(13, 148, 136, 0.08), transparent 35%),
			radial-gradient(circle at 80% 10%, rgba(30, 58, 95, 0.12), transparent 32%),
			var(--surface-page);
		color: var(--text-primary);
	}

	.main-content {
		flex: 1;
		padding-block: clamp(1.5rem, 4vw, 3rem);
	}
</style>
