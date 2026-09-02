import { build } from 'esbuild';
import { readFileSync } from 'node:fs';

const LANGS = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it'];

// ── duplicate literal keys per file (object literals silently drop dupes) ────
let dupTotal = 0;
for (const lang of LANGS) {
  const src = readFileSync(`src/i18n/ui/${lang}.ts`, 'utf8');
  const seen = new Map();
  for (const m of src.matchAll(/^\s*'([^']+)':/gm)) {
    seen.set(m[1], (seen.get(m[1]) ?? 0) + 1);
  }
  const dupes = [...seen].filter(([, n]) => n > 1).map(([k]) => k);
  if (dupes.length) {
    dupTotal += dupes.length;
    console.log(`${lang}: DUPLICATE LITERAL KEYS -> ${dupes.join(', ')}`);
  }
}
console.log(`duplicate literal keys across all locales: ${dupTotal}`);

// ── bundle + evaluate ────────────────────────────────────────────────────────
const out = await build({
  entryPoints: ['src/i18n/ui.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
});
const code = out.outputFiles[0].text;
const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);

const en = Object.keys(mod.ui.en);
console.log(`\nen key count: ${en.length}`);

const PLACEHOLDER = /\{(\w+)\}/g;
const placeholders = (s) => [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort().join(',');

let problems = 0;
for (const lang of LANGS) {
  const dict = mod.ui[lang];
  const keys = Object.keys(dict);
  const missing = en.filter((k) => !(k in dict));
  const extra = keys.filter((k) => !en.includes(k));
  const empty = keys.filter((k) => !String(dict[k]).trim());
  const phMismatch = en
    .filter((k) => k in dict)
    .filter((k) => placeholders(mod.ui.en[k]) !== placeholders(dict[k]));

  problems += missing.length + extra.length + empty.length + phMismatch.length;
  console.log(
    `${lang}: ${keys.length} keys | missing=${missing.length} extra=${extra.length} empty=${empty.length} placeholderMismatch=${phMismatch.length}`,
  );
  if (missing.length) console.log(`   missing: ${missing.join(', ')}`);
  if (extra.length) console.log(`   extra: ${extra.join(', ')}`);
  if (empty.length) console.log(`   empty: ${empty.join(', ')}`);
  if (phMismatch.length) console.log(`   placeholders: ${phMismatch.join(', ')}`);
}

// ── new key groups render in every locale ────────────────────────────────────
const utils = await build({
  entryPoints: ['src/i18n/utils.ts'],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
});
const u = await import(
  `data:text/javascript;base64,${Buffer.from(utils.outputFiles[0].text).toString('base64')}`
);

console.log('\n--- new key spot check ---');
for (const lang of LANGS) {
  const t = u.useTranslations(lang);
  console.log(
    `${lang}: ${t('selector.subtitle', { item: 'X' })} || ${t('catContent.overview', { category: 'Y' })}`,
  );
}

console.log(`\nRESULT: ${problems === 0 && dupTotal === 0 ? 'OK' : `${problems + dupTotal} PROBLEM(S)`}`);
