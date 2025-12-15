import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const memUsage = process.memoryUsage();

	return json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		version: '1.0.0',
		uptime: Math.floor(process.uptime()),
		memory: {
			heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
			heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
			rss: Math.round(memUsage.rss / 1024 / 1024)
		},
		node: process.version,
		environment: process.env.NODE_ENV || 'development'
	});
};
