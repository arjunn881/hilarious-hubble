/**
 * auto-interlink.js
 * Scans every article in src/data/articles/ and injects internal relative links
 * to item pages (/items/<slug>/) for the first unlinked occurrence of each
 * item name and alias phrase.
 * Usage:  node scripts/auto-interlink.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ITEMS_DIR  = join(__dirname, '../src/data/items');
const GUIDES_DIR = join(__dirname, '../src/data/articles');

function collectJsonFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...collectJsonFiles(full));
    else if (extname(entry) === '.json') results.push(full);
  }
  return results;
}

function buildDictionary() {
  const dict = [];
  const itemFiles = collectJsonFiles(ITEMS_DIR);
  for (const filePath of itemFiles) {
    let data;
    try { data = JSON.parse(readFileSync(filePath, 'utf8')); }
    catch (err) { console.warn('  WARNING: Skipping malformed JSON: ' + filePath); continue; }
    const slug = data.slug || data.id;
    if (!slug) continue;
    const phrases = [];
    if (data.name) phrases.push(data.name);
    const aliasArray = data.alsoKnownAs || data.aliases || [];
    for (const alias of aliasArray) {
      if (typeof alias === 'string' && alias.trim()) phrases.push(alias.trim());
    }
    for (const phrase of phrases) {
      if (phrase.length < 4) continue;
      dict.push({ phrase, slug });
    }
  }
  // Longest-phrase-first prevents partial collisions (e.g. "laptop charger" before "charger")
  dict.sort((a, b) => b.phrase.length - a.phrase.length);
  console.log('Dictionary built: ' + dict.length + ' phrase entries from ' + itemFiles.length + ' item files.');
  return dict;
}

function collectGuideFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) results.push(...collectGuideFiles(full));
    else if (['.md', '.mdx'].includes(extname(entry))) results.push(full);
  }
  return results;
}

function splitFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (lines[0].trim() !== '---') return { frontmatter: '', body: raw };
  let closeIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { closeIdx = i; break; }
  }
  if (closeIdx === -1) return { frontmatter: '', body: raw };
  const frontmatter = lines.slice(0, closeIdx + 1).join('\n');
  const body = lines.slice(closeIdx + 1).join('\n');
  return { frontmatter, body };
}

function escapeRegex(str) {
  return str.replace(/[.+?^=!:{}()|[\]\\]/g, '\\$&');
}

function injectLinks(body, dict) {
  let newBody = body;
  const changes = [];
  for (const { phrase, slug } of dict) {
    const escaped = escapeRegex(phrase);
    // Lookbehind: not inside [...] link text. Lookahead: not inside (...) URL.
    const pattern = '(?<!\\[[^\\]]*)\\b(' + escaped + ')s?\\b(?![^(]*\\))';
    const linkRegex = new RegExp(pattern, 'i');
    if (!linkRegex.test(newBody)) continue;
    const targetUrl = '/items/' + slug + '/'; // trailing slash matches Astro trailingSlash config
    const linked = newBody.replace(linkRegex, (match) => '[' + match + '](' + targetUrl + ')');
    if (linked !== newBody) {
      changes.push({ phrase, slug, targetUrl });
      newBody = linked;
    }
  }
  return { newBody, changes };
}

async function main() {
  console.log('BringOnPlane - Auto Internal Linker');
  console.log('====================================');
  const dict = buildDictionary();
  const guideFiles = collectGuideFiles(GUIDES_DIR);
  console.log('Found ' + guideFiles.length + ' guide files to process.\n');
  let totalFilesUpdated = 0;
  let totalLinksAdded   = 0;
  for (const filePath of guideFiles) {
    const raw = readFileSync(filePath, 'utf8');
    const { frontmatter, body } = splitFrontmatter(raw);
    const articleSlug = filePath.split(/[/\\]/).pop().replace(/\.mdx?$/, '');
    const { newBody, changes } = injectLinks(body, dict);
    if (changes.length === 0) continue;
    const sep = frontmatter ? '\n' : '';
    writeFileSync(filePath, frontmatter + sep + newBody, 'utf8');
    totalFilesUpdated++;
    totalLinksAdded += changes.length;
    console.log('  UPDATED: ' + articleSlug + ' (+' + changes.length + ' links)');
    for (const { phrase, targetUrl } of changes) {
      console.log('    - "' + phrase + '" => ' + targetUrl);
    }
  }
  console.log('\n=====================================================');
  console.log('Done. ' + totalLinksAdded + ' links added across ' + totalFilesUpdated + ' files.');
  if (totalFilesUpdated === 0) console.log('(All phrases already linked or no matches.)');
}

main().catch((err) => { console.error('Fatal error:', err); process.exit(1); });