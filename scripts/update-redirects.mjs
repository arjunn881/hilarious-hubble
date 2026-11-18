import fs from 'fs';
import path from 'path';

const articles = fs.readdirSync('src/data/articles')
  .filter(f => f.endsWith('.md'))
  .map(f => f.replace('.md', ''));

console.log(`Found ${articles.length} guide articles.`);

let redirects = fs.readFileSync('public/_redirects', 'utf8');

// 1. Remove beef-jerky incorrect redirects
redirects = redirects.replace('/items/beef-jerky  /items/page/1/ 301\n', '');
redirects = redirects.replace('/items/beef-jerky/ /items/page/1/ 301\n', '');

// 2. Build item singular/plural & alias redirects
const itemRedirects = [
  '# ── Item singular/plural & high-intent alias redirects ─────────────────────────',
  '/items/banana  /items/bananas/ 301',
  '/items/banana/ /items/bananas/ 301',
  '/items/seasoning  /items/spices/ 301',
  '/items/seasoning/ /items/spices/ 301',
  '/items/seasonings  /items/spices/ 301',
  '/items/seasonings/ /items/spices/ 301',
  '/items/spice  /items/spices/ 301',
  '/items/spice/ /items/spices/ 301',
  '/items/airtags  /items/airtag/ 301',
  '/items/airtags/ /items/airtag/ 301',
  '/items/air-tag  /items/airtag/ 301',
  '/items/air-tag/ /items/airtag/ 301',
  '/items/air-tags  /items/airtag/ 301',
  '/items/air-tags/ /items/airtag/ 301',
  '/items/skipping-rope  /items/jump-rope/ 301',
  '/items/skipping-rope/ /items/jump-rope/ 301',
  '/items/rope  /items/jump-rope/ 301',
  '/items/rope/ /items/jump-rope/ 301',
  '/items/dumbbell  /items/dumbbells/ 301',
  '/items/dumbbell/ /items/dumbbells/ 301',
  '/items/watches  /items/watch/ 301',
  '/items/watches/ /items/watch/ 301',
  '/items/smart-watch  /items/smartwatch/ 301',
  '/items/smart-watch/ /items/smartwatch/ 301',
  '/items/smartwatches  /items/smartwatch/ 301',
  '/items/smartwatches/ /items/smartwatch/ 301',
  '/items/shoe  /items/shoes/ 301',
  '/items/shoe/ /items/shoes/ 301',
  '/items/boot  /items/boots/ 301',
  '/items/boot/ /items/boots/ 301',
  '/items/sneaker  /items/sneakers/ 301',
  '/items/sneaker/ /items/sneakers/ 301',
  '/items/high-heel  /items/high-heels/ 301',
  '/items/high-heel/ /items/high-heels/ 301',
  '/items/cigarette  /items/cigarettes/ 301',
  '/items/cigarette/ /items/cigarettes/ 301',
  '/items/cigar  /items/cigars/ 301',
  '/items/cigar/ /items/cigars/ 301',
  '/items/zyn  /items/nicotine-pouches/ 301',
  '/items/zyn/ /items/nicotine-pouches/ 301',
  '/items/zyns  /items/nicotine-pouches/ 301',
  '/items/zyns/ /items/nicotine-pouches/ 301',
  '/items/nicotine-pouch  /items/nicotine-pouches/ 301',
  '/items/nicotine-pouch/ /items/nicotine-pouches/ 301',
  '/items/protein-bar  /items/protein-bars/ 301',
  '/items/protein-bar/ /items/protein-bars/ 301',
  '/items/energy-drinks  /items/energy-drink/ 301',
  '/items/energy-drinks/ /items/energy-drink/ 301',
  '/items/extension-lead  /items/extension-cord/ 301',
  '/items/extension-lead/ /items/extension-cord/ 301',
  '/items/power-strip  /items/extension-cord/ 301',
  '/items/power-strip/ /items/extension-cord/ 301',
  '/items/heat-pack  /items/heating-pad/ 301',
  '/items/heat-pack/ /items/heating-pad/ 301',
  '/items/heat-packs  /items/heating-pad/ 301',
  '/items/heat-packs/ /items/heating-pad/ 301',
  '/items/flint-and-steel  /items/fire-starter/ 301',
  '/items/flint-and-steel/ /items/fire-starter/ 301',
  '/items/cup-noodles  /items/instant-noodles/ 301',
  '/items/cup-noodles/ /items/instant-noodles/ 301',
  '/items/cup-noodle  /items/instant-noodles/ 301',
  '/items/cup-noodle/ /items/instant-noodles/ 301',
  '/items/ramen  /items/instant-noodles/ 301',
  '/items/ramen/ /items/instant-noodles/ 301',
  '/items/almonds  /items/nuts/ 301',
  '/items/almonds/ /items/nuts/ 301',
  '/items/cashews  /items/nuts/ 301',
  '/items/cashews/ /items/nuts/ 301',
  '/items/pistachios  /items/nuts/ 301',
  '/items/pistachios/ /items/nuts/ 301',
  '/items/dog-treats  /items/dog-food/ 301',
  '/items/dog-treats/ /items/dog-food/ 301',
  '/items/cat-treats  /items/cat-food/ 301',
  '/items/cat-treats/ /items/cat-food/ 301',
  '/items/suit-bag  /items/suit/ 301',
  '/items/suit-bag/ /items/suit/ 301',
  '/items/gold-rings  /items/gold-ring/ 301',
  '/items/gold-rings/ /items/gold-ring/ 301',
  '/items/creatine-powder  /items/creatine/ 301',
  '/items/creatine-powder/ /items/creatine/ 301',
  '/items/melatonin-gummies  /items/melatonin/ 301',
  '/items/melatonin-gummies/ /items/melatonin/ 301',
  '/items/dry-shampoo  /items/shampoo/ 301',
  '/items/dry-shampoo/ /items/shampoo/ 301',
  '/items/hot-sauces  /items/hot-sauce/ 301',
  '/items/hot-sauces/ /items/hot-sauce/ 301',
  '/items/toothpaste-tube  /items/toothpaste/ 301',
  '/items/toothpaste-tube/ /items/toothpaste/ 301'
];

// 3. Build guide static redirects from /guides/<slug> to /guide/<slug>/
const guideRedirects = [
  '# ── Canonical guide redirects (/guides/<slug> → /guide/<slug>/) ──────────────',
  '/guide/lithium-batteries-on-plane  /guide/lithium-battery-rules/ 301',
  '/guide/lithium-batteries-on-plane/ /guide/lithium-battery-rules/ 301',
  '/guides/lithium-batteries-on-plane  /guide/lithium-battery-rules/ 301',
  '/guides/lithium-batteries-on-plane/ /guide/lithium-battery-rules/ 301'
];

for (const slug of articles) {
  guideRedirects.push(`/guides/${slug}  /guide/${slug}/ 301`);
  guideRedirects.push(`/guides/${slug}/ /guide/${slug}/ 301`);
}

const insertMarker = '# ── Non-existent items & literal template-slug 404 cleanup ────────────────────';
const newBlock = insertMarker + '\n' + itemRedirects.join('\n') + '\n\n' + guideRedirects.join('\n') + '\n';
redirects = redirects.replace(insertMarker, newBlock);

fs.writeFileSync('public/_redirects', redirects, 'utf8');
console.log('✅ Updated public/_redirects successfully!');
