<script lang="ts">
	import type { Snippet } from 'svelte';
	import Container from './Container.svelte';

	type Theme = 'light' | 'dark';

	const { currentTheme = 'light', onToggleTheme } = $props<{
		currentTheme?: Theme;
		onToggleTheme?: () => void;
	}>();

	const handleToggle = () => {
		onToggleTheme?.();
	};
</script>

<header class="site-header">
	<Container width="wide">
		<div class="bar">
			<a class="brand cluster" href="/">
				<div class="mark" aria-hidden="true">
					<span class="dot"></span>
					<span class="ray"></span>
				</div>
				<div class="stack">
					<span class="title">Terror Watch Australia</span>
					<span class="tagline">Threat tracking &amp; public guidance</span>
				</div>
			</a>

			<nav class="nav cluster" aria-label="Primary navigation">
				<a href="#threat">Threat level</a>
				<a href="#news">Signals</a>
				<a href="#guidance">Guidance</a>
				<a href="#contacts">Contacts</a>
			</nav>

			<button class="theme-toggle" type="button" onclick={handleToggle} aria-pressed={currentTheme === 'dark'}>
				{#if currentTheme === 'dark'}
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" role="presentation">
						<path
							fill="currentColor"
							d="M21 13.04A9.003 9.003 0 0 1 11 3c-.26 0-.52.01-.78.04A9 9 0 1 0 21 13.04Z"
						/>
					</svg>
					Dark
				{:else}
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" role="presentation">
						<path
							fill="currentColor"
							d="M12 4.5a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1Zm0 17a1 1 0 0 1-1-1V19a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1ZM4.5 12a1 1 0 0 1-1-1H2a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2Zm17 0a1 1 0 0 1-1-1H21a1 1 0 1 1 0-2h-1.5a1 1 0 1 1 0 2ZM6.34 6.34a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41Zm12.73 12.73a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 1.41ZM6.34 17.66 5.28 18.7a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 1.42Zm12.73-12.73-1.06 1.06a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
						/>
					</svg>
					Light
				{/if}
			</button>
		</div>
	</Container>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: color-mix(in srgb, var(--surface-page) 88%, transparent);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--border-subtle);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 0;
	}

	.brand {
		text-decoration: none;
		color: inherit;
		flex: 1;
		min-width: 0;
		align-items: center;
	}

	.brand .stack {
		gap: 0.1rem;
	}

	.mark {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		position: relative;
		background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
		box-shadow: 0 8px 24px rgba(30, 58, 95, 0.35);
		display: grid;
		place-items: center;
	}

	.dot {
		width: 12px;
		height: 12px;
		background: var(--color-accent);
		border-radius: 50%;
		position: relative;
	}

	.ray {
		position: absolute;
		inset: 8px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 50%;
	}

	.title {
		font-weight: 700;
		color: var(--text-primary);
	}

	.tagline {
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	.nav {
		justify-content: center;
		gap: 0.9rem;
	}

	.nav a {
		color: var(--text-secondary);
		font-weight: 600;
		padding: 0.45rem 0.65rem;
		border-radius: var(--radius-sm);
		transition: background var(--transition-fast), color var(--transition-fast);
	}

	.nav a:hover {
		background: var(--surface-muted);
		color: var(--text-primary);
	}

	.theme-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--border-subtle);
		background: var(--surface-panel);
		color: var(--text-primary);
		box-shadow: var(--shadow-soft);
		transition: transform var(--transition-fast), box-shadow var(--transition-fast),
			border-color var(--transition-fast);
	}

	.theme-toggle:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-raised);
		border-color: color-mix(in srgb, var(--color-primary) 25%, var(--border-subtle));
	}

	.theme-toggle svg {
		width: 18px;
		height: 18px;
	}

	@media (max-width: 900px) {
		.bar {
			flex-wrap: wrap;
			gap: 0.75rem;
		}

		.nav {
			order: 3;
			width: 100%;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
	}

	@media (max-width: 640px) {
		.theme-toggle {
			width: 100%;
			justify-content: center;
		}

		.brand {
			width: 100%;
		}
	}
</style>
