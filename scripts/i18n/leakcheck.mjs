import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

/** Strips balanced `{ ... }` Astro expressions, tolerating nesting. */
function stripExpressions(src) {
  let out = '';
  let depth = 0;
  for (const ch of src) {
    if (ch === '{') depth++;
    else if (ch === '}') { if (depth > 0) depth--; }
    else if (depth === 0) out += ch;
  }
  return out;
}

const WORD = /\b[A-Za-z][a-z]{2,}\b/g;
const SKIP_WORDS = new Set([
  'div', 'span', 'svg', 'href', 'class', 'true', 'false', 'null', 'and', 'the',
]);

/** Text nodes worth reporting: two or more real words. */
function leaks(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (!l || l.startsWith('<!--')) return false;
      const words = (l.match(WORD) || []).filter((w) => !SKIP_WORDS.has(w.toLowerCase()));
      return words.length >= 2;
    });
}

const files = process.argv.slice(2);
let total = 0;

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const fmEnd = raw.indexOf('\n---', 3);
  const template = fmEnd === -1 ? raw : raw.slice(fmEnd + 4);

  const body = template
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');

  // ── literal English in user-visible attributes ────────────────────────────
  const attrs = [];
  for (const m of body.matchAll(/\b(aria-label|alt|title|placeholder|content)="([^"{][^"]*)"/g)) {
    if ((m[2].match(WORD) || []).length >= 2) attrs.push(`${m[1]}="${m[2]}"`);
  }

  const text = leaks(stripExpressions(body).replace(/<[^>]*>/g, '\n'));

  if (text.length || attrs.length) {
    total += text.length + attrs.length;
    console.log(`\n=== ${file} ===`);
    for (const a of attrs) console.log(`  [attr] ${a}`);
    for (const t of text) console.log(`  [text] ${t.slice(0, 160)}`);
  }
}

console.log(`\nRESULT: ${total} literal string(s) across ${files.length} file(s)`);
