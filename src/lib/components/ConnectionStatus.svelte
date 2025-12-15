<svelte:options runes={true} />

<script lang="ts">
	import type { ConnectionState } from '$lib/types/events';

	type Props = {
		connectionState: ConnectionState;
		lastEventTime?: Date | null;
	};

	let { connectionState, lastEventTime = null }: Props = $props();

	const statusConfig = $derived(getStatusConfig(connectionState));
	const timeSinceUpdate = $derived(getTimeSince(lastEventTime));

	function getStatusConfig(state: ConnectionState) {
		switch (state) {
			case 'connected':
				return { label: 'Live', color: '#4ade80', pulse: true };
			case 'connecting':
				return { label: 'Connecting', color: '#facc15', pulse: true };
			case 'reconnecting':
				return { label: 'Reconnecting', color: '#fb923c', pulse: true };
			case 'disconnected':
				return { label: 'Offline', color: '#f87171', pulse: false };
		}
	}

	function getTimeSince(date: Date | null): string {
		if (!date) return '';
		const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
		if (seconds < 60) return 'just now';
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
		return `${Math.floor(seconds / 3600)}h ago`;
	}
</script>

<div class="connection-status" role="status" aria-live="polite">
	<span
		class="indicator"
		class:pulse={statusConfig.pulse}
		style="--status-color: {statusConfig.color}"
	></span>
	<span class="label">{statusConfig.label}</span>
	{#if timeSinceUpdate && connectionState === 'connected'}
		<span class="time">· {timeSinceUpdate}</span>
	{/if}
</div>

<style>
	.connection-status {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 0.8rem;
		font-weight: 600;
		color: #cbd5e1;
	}

	.indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--status-color, #94a3b8);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--status-color, #94a3b8) 30%, transparent);
	}

	.indicator.pulse {
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 2px color-mix(in srgb, var(--status-color) 30%, transparent);
		}
		50% {
			box-shadow: 0 0 0 6px color-mix(in srgb, var(--status-color) 10%, transparent);
		}
	}

	.label {
		color: var(--status-color, #94a3b8);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.time {
		color: #64748b;
	}
</style>
