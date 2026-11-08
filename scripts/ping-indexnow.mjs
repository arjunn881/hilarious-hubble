#!/usr/bin/env node
/**
 * scripts/ping-indexnow.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * BringOnPlane — IndexNow Ping Script for Bing
 *
 * Reads the built sitemap-index.xml, collects all URLs from all child sitemaps,
 * and POSTs them to the Bing IndexNow API in batches of 10,000.
 *
 * Usage (run after `astro build`):
 *   node scripts/ping-indexnow.mjs
 *
 * Or hook it into the build script in package.json:
 *   "build": "... && astro build && node scripts/ping-indexnow.mjs"
 *
 * IndexNow spec: https://www.indexnow.org/documentation
 * Bing endpoint:  https://www.bing.com/indexnow
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

const SITE = 'https://bringonplane.com';
const INDEXNOW_KEY = 'fc30209b4bdec22414ec2b19f4f9ef43';
const BING_ENDPOINT = 'https://www.bing.com/indexnow';
const BATCH_SIZE = 10_000;

// ── 1. Parse sitemap XML to extract all <loc> URLs ──────────────────────────
function extractUrls(xmlContent) {
  const matches = xmlContent.match(/<loc>([^<]+)<\/loc>/g) || [];
  return matches.map((m) => m.replace('<loc>', '').replace('</loc>', '').trim());
}

function readSitemapFile(filename) {
  const path = join(DIST, filename);
  if (!existsSync(path)) {
    console.warn(`  ⚠ File not found: ${filename} — skipping`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

async function collectAllUrls() {
  const sitemapIndex = readSitemapFile('sitemap-index.xml');
  if (!sitemapIndex) {
    console.error('✗ sitemap-index.xml not found in dist/. Run astro build first.');
    process.exit(1);
  }

  // Find child sitemaps: e.g. sitemap-0.xml, sitemap-1.xml, ...
  const childSitemapUrls = extractUrls(sitemapIndex);
  const childSitemapFiles = childSitemapUrls
    .filter((u) => u.includes('/sitemap-') && u.endsWith('.xml'))
    .map((u) => u.replace(SITE + '/', '').replace(SITE, ''));

  let allUrls = [];
  for (const file of childSitemapFiles) {
    const content = readSitemapFile(file);
    if (!content) continue;
    const urls = extractUrls(content).filter(
      (u) => u.startsWith(SITE) && !u.includes('/api/') && !u.includes('/404') && !u.includes('/500')
    );
    allUrls = allUrls.concat(urls);
    console.log(`  ✓ ${file}: ${urls.length} URLs`);
  }

  return [...new Set(allUrls)]; // deduplicate
}

// ── 2. POST to Bing IndexNow ─────────────────────────────────────────────────
async function pingBatch(urls) {
  const payload = {
    host: 'bringonplane.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const response = await fetch(BING_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  return response;
}

// ── 3. Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔔 BringOnPlane — IndexNow Bing Ping');
  console.log('─────────────────────────────────────');
  console.log('  Site     :', SITE);
  console.log('  Key      :', INDEXNOW_KEY);
  console.log('  Endpoint :', BING_ENDPOINT);
  console.log('  Collecting URLs from sitemap...\n');

  const allUrls = await collectAllUrls();
  console.log(`\n  Total unique URLs: ${allUrls.length}`);

  if (allUrls.length === 0) {
    console.error('✗ No URLs found. Check sitemap build output.');
    process.exit(1);
  }

  // Split into batches
  const batches = [];
  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    batches.push(allUrls.slice(i, i + BATCH_SIZE));
  }

  console.log(`  Sending in ${batches.length} batch(es) of up to ${BATCH_SIZE}...\n`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    process.stdout.write(`  Batch ${i + 1}/${batches.length} (${batch.length} URLs)... `);
    try {
      const res = await pingBatch(batch);
      if (res.status === 200) {
        console.log(`✅ 200 OK`);
      } else if (res.status === 202) {
        console.log(`✅ 202 Accepted`);
      } else {
        const body = await res.text().catch(() => '');
        console.log(`⚠ ${res.status} ${res.statusText} — ${body.slice(0, 200)}`);
      }
    } catch (err) {
      console.log(`✗ Network error: ${err.message}`);
    }

    // Rate limit: 1 batch per second between batches
    if (i < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log('\n✅ IndexNow ping complete. Bing will crawl submitted URLs within minutes.');
  console.log('   Monitor indexing at: https://www.bing.com/webmasters/\n');
}

main().catch((err) => {
  console.error('\n✗ IndexNow ping failed:', err);
  process.exit(1);
});

