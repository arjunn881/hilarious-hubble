/**
 * migrate-schema.js
 * 
 * Injects `restrictionType` and `customNote` fields into all item JSON files
 * under src/data/items/ that are missing them.
 *
 * Usage:
 *   node scripts/migrate-schema.js --dry-run   (preview only, no writes)
 *   node scripts/migrate-schema.js             (live migration)
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, '../src/data/items');
const isDryRun   = process.argv.includes('--dry-run');

// Map item category → restrictionType search-intent label
const CATEGORY_MAP = {
  'Food':          'Solid Food',
  'Liquids':       'Liquid',
  'Electronics':   'Electronic',
  'Personal Care': 'Liquid/Solid',
  'Medicine':      'Medical',
  'Health':        'Medical',
  'Tools':         'Sharp Object',
  'Camping':       'Sharp Object',
  'Sports':        'Blunt Object',
  'Beauty':        'Liquid',
  'Baby':          'Solid/Liquid',
  'Documents':     'Document',
  'Jewelry':       'Jewelry',
};

/**
 * Recursively gather all .json files under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function getFilesRecursively(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else if (entry.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Print a compact diff summary for a single file.
 * @param {string} filePath
 * @param {string[]} additions  Human-readable field→value strings added
 */
function logPreview(filePath, additions) {
  const rel = path.relative(TARGET_DIR, filePath);
  console.log(`\n[PREVIEW] ${rel}`);
  for (const addition of additions) {
    console.log(`  + ${addition}`);
  }
}

function migrate() {
  const label = isDryRun
    ? '--- DRY RUN: SCHEMA MIGRATION PREVIEW ---'
    : '--- EXECUTING LIVE SCHEMA MIGRATION ---';
  console.log(label);

  const files   = getFilesRecursively(TARGET_DIR);
  let changed   = 0;
  let unchanged = 0;

  // Dry-run: surface the 3 sample files first for quick verification
  const SAMPLE_SLUGS = ['apples', 'sunscreen', 'aaa-batteries'];
  const ordered = [
    ...files.filter(f => SAMPLE_SLUGS.some(s => path.basename(f, '.json') === s)),
    ...files.filter(f => !SAMPLE_SLUGS.some(s => path.basename(f, '.json') === s)),
  ];

  for (const filePath of ordered) {
    const raw  = fs.readFileSync(filePath, 'utf8');
    let item;
    try {
      item = JSON.parse(raw);
    } catch (err) {
      console.error(`[ERROR] Failed to parse ${filePath}: ${err.message}`);
      continue;
    }

    const additions = [];

    if (item.restrictionType === undefined) {
      const inferred = CATEGORY_MAP[item.category] || 'General Item';
      item.restrictionType = inferred;
      additions.push(`restrictionType: "${inferred}" (inferred from category "${item.category}")`);
    }

    if (item.customNote === undefined) {
      item.customNote = '';
      additions.push(`customNote: "" (safe placeholder for editorial notes)`);
    }

    if (additions.length === 0) {
      unchanged++;
      continue;
    }

    changed++;

    if (isDryRun) {
      logPreview(filePath, additions);
    } else {
      fs.writeFileSync(filePath, JSON.stringify(item, null, 2), 'utf8');
      const rel = path.relative(TARGET_DIR, filePath);
      console.log(`[UPDATED] ${rel}`);
    }
  }

  console.log(`\n${isDryRun ? 'Dry run' : 'Migration'} complete.`);
  console.log(`  Files updated : ${changed}`);
  console.log(`  Files skipped : ${unchanged} (fields already present)`);
  console.log(`  Total files   : ${files.length}`);

  if (isDryRun) {
    console.log('\nRun without --dry-run to apply changes.');
  }
}

migrate();
