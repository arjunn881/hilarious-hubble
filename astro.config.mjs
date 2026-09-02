// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import { defaultLang, langCodes, localeMeta, prefixedLangs } from './src/i18n/config';

const SITE = 'https://bringonplane.com';

// ── Pages excluded from all sitemaps ──────────────────────────────────────────
// Tested against the *locale-stripped* path, so one entry covers all 8 locales.
const EXCLUDED_PATTERNS = [
  '/404',
  '/500',
  '/api/',
  '/robots.txt',
  '/search-index',
  '/items/page/',
];

/**
 * Removes a leading `/es/`-style locale segment.
 * `/de/items/laptop/` → `/items/laptop/`, `/items/laptop/` → `/items/laptop/`.
 * @param {string} path
 * @returns {string}
 */
function stripLocale(path) {
  for (const lang of prefixedLangs) {
    if (path === `/${lang}` || path === `/${lang}/`) return '/';
    if (path.startsWith(`/${lang}/`)) return path.slice(lang.length + 1);
  }
  return path;
}

/**
 * Site-relative, locale-stripped, trailing-slash-free path for the rules below.
 * @param {string} url
 * @returns {string}
 */
function normalizePath(url) {
  const path = stripLocale(url.replace(SITE, '') || '/');
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * Returns the SEO priority (0.0–1.0) for a given URL path.
 * Higher = crawled more often and ranked more prominently in sitemap.
 * Translations share their English counterpart's priority — the hreflang
 * cluster, not the priority hint, is what tells Google they are equivalents.
 * @param {string} url
 * @returns {number}
 */
function getPriority(url) {
  const path = normalizePath(url);

  if (path === '/' || path === '') return 1.0;

  // Core hub pages
  if (['/faq', '/about', '/contact', '/checklist', '/compare', '/guides', '/tsa-rules'].includes(path)) return 0.9;

  // Top-level content hubs
  if (['/airlines', '/countries'].includes(path)) return 0.85;

  // Item detail pages — highest-traffic long-tail targets
  if (path.startsWith('/items/')) return 0.8;

  // Category pages
  if (path.startsWith('/category/')) return 0.75;

  // Individual guide articles
  if (path.startsWith('/guide/')) return 0.7;

  // Packing list pages
  if (path.startsWith('/packing-list/')) return 0.65;

  // Legal/company pages
  if (['/privacy-policy', '/terms', '/disclaimer'].includes(path)) return 0.6;

  return 0.5;
}

/**
 * Returns the changefreq for a given URL path.
 * @param {string} url
 * @returns {ChangeFreqEnum}
 */
function getChangefreq(url) {
  const path = normalizePath(url);

  if (path === '/' || path === '') return ChangeFreqEnum.DAILY;
  if (path.startsWith('/items/')) return ChangeFreqEnum.WEEKLY;
  if (['/faq', '/guides', '/airlines', '/countries', '/tsa-rules'].includes(path)) return ChangeFreqEnum.WEEKLY;
  if (['/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'].includes(path)) return ChangeFreqEnum.MONTHLY;
  if (path.startsWith('/guide/')) return ChangeFreqEnum.MONTHLY;
  if (path.startsWith('/packing-list/')) return ChangeFreqEnum.WEEKLY;
  if (path.startsWith('/category/')) return ChangeFreqEnum.WEEKLY;

  return ChangeFreqEnum.MONTHLY;
}

/**
 * Cloudflare Pages serves the directory form, so every entry ends in a slash.
 * @param {string} url
 * @returns {string}
 */
function withTrailingSlash(url) {
  return url.endsWith('/') ? url : `${url}/`;
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
      // Emits <xhtml:link rel="alternate" hreflang> clusters. The integration
      // groups URLs by their locale-stripped path and only links locales that
      // actually built, so the English-only item×airline and item×country
      // pages stay alternate-free.
      i18n: {
        defaultLocale: defaultLang,
        locales: Object.fromEntries(langCodes.map((lang) => [lang, localeMeta[lang].hreflang])),
      },
      // Exclude 404, 500, API routes, search indexes and paginated helper paths
      filter: (page) => {
        const path = stripLocale(page.replace(SITE, ''));
        return !EXCLUDED_PATTERNS.some((pattern) => path.startsWith(pattern))
          && path !== '/items'
          && path !== '/items/';
      },
      // Customize each URL entry: set priority + changefreq & force trailing slash alignment matching Cloudflare Pages 200 OK endpoints
      serialize: (item) => ({
        ...item,
        url: withTrailingSlash(item.url),
        links: item.links?.map((link) => ({ ...link, url: withTrailingSlash(link.url) })),
        priority: getPriority(item.url),
        changefreq: getChangefreq(item.url),
      }),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  build: {
    concurrency: 1,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
