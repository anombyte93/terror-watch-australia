import type { RequestHandler } from '@sveltejs/kit';
import { updateTracker } from '$lib/server/services/update-tracker';
import type { SSEEvent, ConnectedEvent, HeartbeatEvent } from '$lib/types/events';

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

function generateClientId(): string {
	return `client-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatSSEMessage(event: SSEEvent): string {
	return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
}

export const GET: RequestHandler = async () => {
	const clientId = generateClientId();

	const stream = new ReadableStream({
		start(controller) {
			// Send connected event
			const connectedEvent: ConnectedEvent = {
				type: 'connected',
				timestamp: new Date().toISOString(),
				data: { clientId }
			};
			controller.enqueue(formatSSEMessage(connectedEvent));

			// Subscribe to update tracker
			const unsubscribe = updateTracker.subscribe((event) => {
				try {
					controller.enqueue(formatSSEMessage(event));
				} catch {
					// Stream closed, cleanup handled below
				}
			});

			// Heartbeat interval
			const heartbeatId = setInterval(() => {
				try {
					const heartbeat: HeartbeatEvent = {
						type: 'heartbeat',
						timestamp: new Date().toISOString(),
						data: { serverTime: new Date().toISOString() }
					};
					controller.enqueue(formatSSEMessage(heartbeat));
				} catch {
					// Stream closed
					clearInterval(heartbeatId);
				}
			}, HEARTBEAT_INTERVAL);

			// Cleanup on close
			return () => {
				clearInterval(heartbeatId);
				unsubscribe();
			};
		},
		cancel() {
			// Client disconnected
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			Connection: 'keep-alive',
			'X-Accel-Buffering': 'no' // Disable nginx buffering
		}
	});
};
