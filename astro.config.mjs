// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://bringonplane.com';

// ── Pages excluded from all sitemaps ──────────────────────────────────────────
const EXCLUDED_PATTERNS = [
  '/404',
  '/500',
  '/api/',
  '/robots.txt',
  '/search-index.json',
  '/items/page/',
];

/**
 * Returns the SEO priority (0.0–1.0) for a given URL path.
 * Higher = crawled more often and ranked more prominently in sitemap.
 */
function getPriority(url) {
  const path = url.replace(SITE, '');

  if (path === '/' || path === '') return 1.0;

  // Core hub pages
  if (['/faq', '/about', '/contact', '/checklist', '/compare', '/guides'].includes(path)) return 0.9;

  // New legal/company pages
  if (['/privacy-policy', '/terms'].includes(path)) return 0.6;

  // Top-level content hubs
  if (['/airlines', '/countries'].includes(path)) return 0.85;

  // Item detail pages — highest-traffic long-tail targets
  if (path.startsWith('/items/') && !path.includes('/airline/')) return 0.8;

  // Airline specific item rules
  if (path.includes('/airline/')) return 0.75;

  // Category pages
  if (path.startsWith('/category/')) return 0.75;

  // Individual guide articles
  if (path.startsWith('/guide/')) return 0.7;

  // Packing list pages
  if (path.startsWith('/packing-list/')) return 0.65;

  return 0.5;
}

/**
 * Returns the changefreq for a given URL path.
 */
function getChangefreq(url) {
  const path = url.replace(SITE, '');

  if (path === '/' || path === '') return 'daily';
  if (path.startsWith('/items/')) return 'weekly';
  if (['/faq', '/guides', '/airlines', '/countries'].includes(path)) return 'weekly';
  if (['/about', '/contact', '/privacy-policy', '/terms'].includes(path)) return 'monthly';
  if (path.startsWith('/guide/')) return 'monthly';
  if (path.startsWith('/packing-list/')) return 'weekly';
  if (path.startsWith('/category/')) return 'weekly';

  return 'monthly';
}

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000,
  },
  site: SITE,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Exclude 404, 500, API routes, and redirect pages
      filter: (page) => {
        const path = page.replace(SITE, '');
        return !EXCLUDED_PATTERNS.some(pattern => path.startsWith(pattern))
          && path !== '/items'; // /items is a redirect page; exclude in favor of /items/page/1
      },
      // Customize each URL entry: set priority + changefreq & force trailing slash alignment matching Cloudflare Pages 200 OK endpoints
      serialize: (item) => ({
        ...item,
        url: item.url.endsWith('/') ? item.url : `${item.url}/`,
        priority: getPriority(item.url),
        changefreq: getChangefreq(item.url),
        // lastmod defaults to build time — Astro sitemap integration handles this
      }),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

