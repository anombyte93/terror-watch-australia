import type { RequestHandler } from '@sveltejs/kit';

const SITE_URL = 'https://terrorwatch.au';

export const GET: RequestHandler = async () => {
	const robotsTxt = `# Terror Watch Australia - robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Disallow API routes from indexing
Disallow: /api/

# Allow search engines to crawl all public pages
Allow: /safety/
Allow: /analytics/
`;

	return new Response(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=86400' // 24 hours
		}
	});
};
