<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'accent' | 'ghost' | 'outline';
	type Size = 'sm' | 'md' | 'lg';

	const {
		children,
		variant = 'primary',
		size = 'md',
		href,
		fullWidth = false,
		type = 'button'
	} = $props<{
		children?: Snippet;
		variant?: Variant;
		size?: Size;
		href?: string;
		fullWidth?: boolean;
		type?: 'button' | 'submit' | 'reset';
	}>();

	const classes = $derived(`btn ${variant} ${size} ${fullWidth ? 'full' : ''}`);
</script>

{#if href}
	<a class={classes} href={href}>
		{@render children?.()}
	</a>
{:else}
	<button class={classes} type={type}>
		{@render children?.()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-weight: 700;
		border-radius: 999px;
		border: 1px solid transparent;
		transition: transform var(--transition-fast), box-shadow var(--transition-fast),
			background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
		text-decoration: none;
		white-space: nowrap;
	}

	.btn.sm {
		padding: 0.4rem 0.8rem;
		font-size: 0.95rem;
	}

	.btn.md {
		padding: 0.55rem 1.1rem;
		font-size: 1rem;
	}

	.btn.lg {
		padding: 0.8rem 1.35rem;
		font-size: 1.05rem;
	}

	.btn.full {
		width: 100%;
	}

	.btn.primary {
		background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
		color: #fff;
		box-shadow: var(--shadow-soft);
	}

	.btn.accent {
		background: linear-gradient(135deg, var(--color-accent), var(--color-accent-light));
		color: #0f172a;
		box-shadow: var(--shadow-soft);
	}

	.btn.outline {
		background: var(--surface-panel);
		color: var(--text-primary);
		border-color: var(--border-subtle);
	}

	.btn.ghost {
		background: transparent;
		color: var(--text-primary);
		border-color: transparent;
	}

	.btn:hover {
		transform: translateY(-1px);
		box-shadow: var(--shadow-raised);
	}

	.btn.outline:hover {
		border-color: color-mix(in srgb, var(--color-primary) 30%, var(--border-subtle));
	}

	.btn.ghost:hover {
		background: var(--surface-muted);
		box-shadow: none;
	}
</style>
