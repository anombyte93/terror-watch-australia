/**
 * Server-Sent Events type definitions for real-time updates
 */

export type EventType = 'threat-update' | 'news-update' | 'heartbeat' | 'connected';

export interface BaseEvent {
	type: EventType;
	timestamp: string;
}

export interface ThreatUpdateEvent extends BaseEvent {
	type: 'threat-update';
	data: {
		level: number;
		name: string;
		previousLevel?: number;
	};
}

export interface NewsUpdateEvent extends BaseEvent {
	type: 'news-update';
	data: {
		count: number;
		latestTitle?: string;
	};
}

export interface HeartbeatEvent extends BaseEvent {
	type: 'heartbeat';
	data: {
		serverTime: string;
	};
}

export interface ConnectedEvent extends BaseEvent {
	type: 'connected';
	data: {
		clientId: string;
	};
}

export type SSEEvent = ThreatUpdateEvent | NewsUpdateEvent | HeartbeatEvent | ConnectedEvent;

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export interface EventStreamState {
	connectionState: ConnectionState;
	lastEventTime: Date | null;
	reconnectAttempts: number;
	clientId: string | null;
}
