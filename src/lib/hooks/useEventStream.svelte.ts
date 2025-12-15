/**
 * useEventStream - Svelte 5 hook for SSE real-time updates
 * Uses $state and $effect runes for reactive connection management
 */

import type {
	SSEEvent,
	ConnectionState,
	EventStreamState,
	ThreatUpdateEvent,
	NewsUpdateEvent
} from '$lib/types/events';

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_BASE = 1000; // 1 second, will exponentially increase

type EventHandler<T extends SSEEvent> = (event: T) => void;

interface EventHandlers {
	onThreatUpdate?: EventHandler<ThreatUpdateEvent>;
	onNewsUpdate?: EventHandler<NewsUpdateEvent>;
	onConnectionChange?: (state: ConnectionState) => void;
}

export function createEventStream(handlers: EventHandlers = {}) {
	let connectionState = $state<ConnectionState>('disconnected');
	let lastEventTime = $state<Date | null>(null);
	let reconnectAttempts = $state(0);
	let clientId = $state<string | null>(null);

	let eventSource: EventSource | null = null;
	let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

	const state = $derived<EventStreamState>({
		connectionState,
		lastEventTime,
		reconnectAttempts,
		clientId
	});

	function connect(): void {
		if (typeof window === 'undefined') return;
		if (eventSource?.readyState === EventSource.OPEN) return;

		connectionState = 'connecting';
		handlers.onConnectionChange?.('connecting');

		eventSource = new EventSource('/api/events');

		eventSource.onopen = () => {
			connectionState = 'connected';
			reconnectAttempts = 0;
			handlers.onConnectionChange?.('connected');
		};

		eventSource.onerror = () => {
			connectionState = 'disconnected';
			handlers.onConnectionChange?.('disconnected');
			eventSource?.close();
			eventSource = null;
			scheduleReconnect();
		};

		// Handle specific event types
		eventSource.addEventListener('connected', (e: MessageEvent) => {
			try {
				const event: SSEEvent = JSON.parse(e.data);
				if (event.type === 'connected') {
					clientId = event.data.clientId;
					lastEventTime = new Date(event.timestamp);
				}
			} catch (error) {
				console.error('[useEventStream] Failed to parse connected event:', error);
			}
		});

		eventSource.addEventListener('heartbeat', (e: MessageEvent) => {
			try {
				const event: SSEEvent = JSON.parse(e.data);
				lastEventTime = new Date(event.timestamp);
			} catch (error) {
				console.error('[useEventStream] Failed to parse heartbeat:', error);
			}
		});

		eventSource.addEventListener('threat-update', (e: MessageEvent) => {
			try {
				const event: ThreatUpdateEvent = JSON.parse(e.data);
				lastEventTime = new Date(event.timestamp);
				handlers.onThreatUpdate?.(event);
			} catch (error) {
				console.error('[useEventStream] Failed to parse threat-update:', error);
			}
		});

		eventSource.addEventListener('news-update', (e: MessageEvent) => {
			try {
				const event: NewsUpdateEvent = JSON.parse(e.data);
				lastEventTime = new Date(event.timestamp);
				handlers.onNewsUpdate?.(event);
			} catch (error) {
				console.error('[useEventStream] Failed to parse news-update:', error);
			}
		});
	}

	function disconnect(): void {
		if (reconnectTimeout) {
			clearTimeout(reconnectTimeout);
			reconnectTimeout = null;
		}
		if (eventSource) {
			eventSource.close();
			eventSource = null;
		}
		connectionState = 'disconnected';
		clientId = null;
	}

	function scheduleReconnect(): void {
		if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
			console.warn('[useEventStream] Max reconnect attempts reached');
			return;
		}

		connectionState = 'reconnecting';
		handlers.onConnectionChange?.('reconnecting');

		const delay = RECONNECT_DELAY_BASE * Math.pow(2, reconnectAttempts);
		reconnectAttempts++;

		reconnectTimeout = setTimeout(() => {
			connect();
		}, delay);
	}

	// Auto-connect on creation if in browser
	$effect(() => {
		if (typeof window !== 'undefined') {
			connect();
		}

		return () => {
			disconnect();
		};
	});

	return {
		get state() {
			return state;
		},
		get connectionState() {
			return connectionState;
		},
		get isConnected() {
			return connectionState === 'connected';
		},
		connect,
		disconnect
	};
}
