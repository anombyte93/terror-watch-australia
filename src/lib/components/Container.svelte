<script lang="ts">
	import type { Snippet } from 'svelte';

	type Width = 'narrow' | 'regular' | 'wide';

	const { children, width = 'regular' } = $props<{ children?: Snippet; width?: Width }>();
</script>

<div class={`shell ${width}`}>
	{@render children?.()}
</div>

<style>
	.shell {
		width: min(var(--container-width), 100%);
		margin: 0 auto;
		padding-inline: var(--page-padding);
	}

	.shell.narrow {
		max-width: 960px;
	}

	.shell.wide {
		max-width: 1400px;
	}
</style>
