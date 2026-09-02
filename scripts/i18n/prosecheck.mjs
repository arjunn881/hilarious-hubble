/**
 * Verifies the translation overlays actually substitute.
 *
 * The shipped locale files are empty stubs, so a plain build can never prove the
 * seams work. This injects synthetic entries and asserts, for each of the three
 * overlays, that a present field is swapped, an absent field falls back to
 * English, and English is returned untouched.
 */
import { buildSync } from 'esbuild';
import { unlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const OUT = '.prosecheck.cjs';
const OUT_ARTICLES = '.prosecheck-articles.cjs';
const require = createRequire(import.meta.url);

buildSync({
  entryPoints: ['src/i18n/prose/index.ts'],
  outfile: OUT,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  logLevel: 'silent',
});
buildSync({
  entryPoints: ['src/i18n/prose/articles.ts'],
  outfile: OUT_ARTICLES,
  bundle: true,
  format: 'cjs',
  platform: 'node',
  logLevel: 'silent',
});

const {
  itemProse,
  localizeItemProse,
  getItemProse,
  proseCoverage,
  categoryProse,
  getCategoryProse,
} = require(resolve(OUT));
const { indexArticleOverlay, pickArticle, articleSlug } = require(resolve(OUT_ARTICLES));

const LANGS = ['es', 'ja', 'fr', 'de', 'pt', 'ko', 'it'];

/** Minimal stand-in shaped like the fields the overlay touches. */
const english = {
  slug: 'test-item',
  name: 'Test Item',
  description: 'EN description',
  carryOn: { status: 'ALLOWED', reason: 'EN carry reason', conditions: ['EN c1'], exceptions: ['EN e1'] },
  checkedBag: { status: 'ALLOWED', reason: 'EN checked reason', conditions: ['EN c2'], exceptions: ['EN e2'] },
  travelTips: ['EN tip'],
};

const failures = [];
const eq = (label, got, want) => {
  const a = JSON.stringify(got);
  const b = JSON.stringify(want);
  if (a !== b) failures.push(`${label}: got ${a}, want ${b}`);
};

// 1. Shipped stubs are empty — every locale falls back to English today.
for (const lang of LANGS) {
  if (!itemProse[lang]) failures.push(`${lang}: no overlay registered in itemProse`);
  eq(`${lang} coverage`, proseCoverage(lang), []);
  eq(`${lang} passthrough`, localizeItemProse(english, lang), english);
  if (!categoryProse[lang]) failures.push(`${lang}: no overlay registered in categoryProse`);
  eq(`${lang} category empty`, getCategoryProse('Elektronik', 42, lang), {});
}
if (itemProse.en !== undefined) failures.push('en: should not have an overlay');
eq('en lookup', getItemProse('test-item', 'en'), undefined);
eq('en category lookup', getCategoryProse('Electronics', 42, 'en'), undefined);

// 2. A partial entry swaps only the fields it defines.
itemProse.de = {
  'test-item': {
    carryOnReason: 'DE carry reason',
    carryOnConditions: ['DE c1', 'DE c1b'],
    travelTips: ['DE tip'],
  },
};
const de = localizeItemProse(english, 'de');
eq('de carryOn.reason', de.carryOn.reason, 'DE carry reason');
eq('de carryOn.conditions', de.carryOn.conditions, ['DE c1', 'DE c1b']);
eq('de travelTips', de.travelTips, ['DE tip']);
eq('de carryOn.exceptions falls back', de.carryOn.exceptions, ['EN e1']);
eq('de checkedBag falls back', de.checkedBag, english.checkedBag);
eq('de description falls back', de.description, 'EN description');
eq('de status preserved', de.carryOn.status, 'ALLOWED');

// 3. Other locales and other slugs are unaffected; the source is not mutated.
eq('it unaffected', localizeItemProse(english, 'it'), english);
eq('de other slug', localizeItemProse({ ...english, slug: 'other' }, 'de').carryOn.reason, 'EN carry reason');
eq('source not mutated', english.carryOn.reason, 'EN carry reason');
eq('de coverage', proseCoverage('de'), ['test-item']);

// 4. Generated-block overrides replace the contentGenerator output.
itemProse.de = { 'test-item': { whatIsThis: 'DE snippet', packingGuide: ['DE s1'] } };
const gen = getItemProse('test-item', 'de');
eq('de whatIsThis', gen.whatIsThis, 'DE snippet');
eq('de packingGuide', gen.packingGuide, ['DE s1']);
eq('de exceptions absent', gen.exceptions, undefined);
eq('it generated absent', getItemProse('test-item', 'it'), undefined);

// 5. Category templates interpolate {category} and {count}.
categoryProse.de = {
  overview: 'Die Kategorie {category} umfasst {count} Artikel.',
  faqs: [{ question: '{category}?', answer: '{count} Artikel.' }],
};
const cp = getCategoryProse('Elektronik', 42, 'de');
eq('de category overview', cp.overview, 'Die Kategorie Elektronik umfasst 42 Artikel.');
eq('de category faqs', cp.faqs, [{ question: 'Elektronik?', answer: '42 Artikel.' }]);
eq('de category tsaRules absent', cp.tsaRules, undefined);
eq('it category still empty', getCategoryProse('Elettronica', 42, 'it'), {});

// 6. Article overlay keys on <lang>/<slug> and falls back per locale.
eq('articleSlug', articleSlug('a/b/knife-on-plane.md'), 'knife-on-plane');
const enModule = { frontmatter: { title: 'EN title' } };
const overlay = indexArticleOverlay({
  '../../data/articles/de/knife-on-plane.md': { frontmatter: { title: 'DE Titel' } },
  '..\\..\\data\\articles\\ja\\knife-on-plane.md': { frontmatter: { title: 'JA タイトル' } },
});
eq('article de hit', pickArticle(overlay, 'knife-on-plane', 'de', enModule).frontmatter.title, 'DE Titel');
eq('article ja hit (win32 sep)', pickArticle(overlay, 'knife-on-plane', 'ja', enModule).frontmatter.title, 'JA タイトル');
eq('article it miss', pickArticle(overlay, 'knife-on-plane', 'it', enModule), enModule);
eq('article en never overlaid', pickArticle(overlay, 'knife-on-plane', 'en', enModule), enModule);
eq('article unknown slug', pickArticle(overlay, 'other-guide', 'de', enModule), enModule);
eq('empty overlay', pickArticle(indexArticleOverlay({}), 'knife-on-plane', 'de', enModule), enModule);

unlinkSync(OUT);
unlinkSync(OUT_ARTICLES);

if (failures.length) {
  for (const f of failures) console.log(`FAIL ${f}`);
  console.log(`RESULT: ${failures.length} failure(s)`);
  process.exitCode = 1;
} else {
  console.log('RESULT: OK — all three overlays substitute, fall back per field, and ship empty');
}
