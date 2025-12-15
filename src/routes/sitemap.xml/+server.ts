import type { RequestHandler } from '@sveltejs/kit';

const SITE_URL = 'https://terrorwatch.au';

// Define all public routes
const routes = [
	{ path: '/', changefreq: 'hourly', priority: 1.0 },
	{ path: '/analytics', changefreq: 'daily', priority: 0.8 },
	{ path: '/safety', changefreq: 'weekly', priority: 0.9 },
	{ path: '/safety/during-attack', changefreq: 'monthly', priority: 0.9 },
	{ path: '/safety/report', changefreq: 'monthly', priority: 0.8 },
	{ path: '/safety/threat-levels', changefreq: 'monthly', priority: 0.8 },
	{ path: '/safety/support', changefreq: 'monthly', priority: 0.7 }
];

export const GET: RequestHandler = async () => {
	const lastmod = new Date().toISOString().split('T')[0];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map(
		(route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600' // 1 hour
		}
	});
};
