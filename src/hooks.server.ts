import type { Handle } from '@sveltejs/kit';

/**
 * Server hooks for performance optimization
 * - Cache headers for static and API routes
 * - Security headers
 * - Compression handled by adapter-node
 */

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event, {
		// Preload critical fonts and CSS
		preload: ({ type }) => {
			return type === 'font' || type === 'css';
		}
	});

	const { pathname } = event.url;

	// Clone response to add headers
	const headers = new Headers(response.headers);

	// Security headers
	headers.set('X-Content-Type-Options', 'nosniff');
	headers.set('X-Frame-Options', 'DENY');
	headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	// Cache control based on route type
	if (pathname.startsWith('/api/')) {
		// API routes: stale-while-revalidate pattern
		if (pathname === '/api/health') {
			headers.set('Cache-Control', 'no-cache');
		} else if (pathname === '/api/threat-level') {
			// Threat level can be cached briefly with revalidation
			headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
		} else if (pathname === '/api/news') {
			// News can be cached a bit longer
			headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
		} else if (pathname === '/api/analytics') {
			// Analytics data cached for 5 minutes
			headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
		} else if (pathname === '/api/events') {
			// SSE should not be cached
			headers.set('Cache-Control', 'no-store');
		} else {
			// Default API cache
			headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
		}
	} else if (pathname.startsWith('/_app/')) {
		// Immutable static assets (hashed filenames)
		headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	} else if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
		// SEO files
		headers.set('Cache-Control', 'public, max-age=86400');
	} else {
		// HTML pages: short cache with revalidation
		headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};
