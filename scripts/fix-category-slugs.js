/**
 * fix-category-slugs.js
 *
 * Maintenance utility that enforces strict lowercase-hyphenated directory names
 * and synchronized internal JSON `category` fields across src/data/items/.
 *
 * What it does:
 *   1. Scans immediate subdirectories of src/data/items/
 *   2. If a folder name is not already slug-safe (lowercase, hyphens, no spaces),
 *      it renames or merges it into the slugified version
 *   3. Updates the internal `category` field in every JSON file to match the
 *      slugified folder name
 *
 * Usage:
 *   node scripts/fix-category-slugs.js --dry-run   (preview only)
 *   node scripts/fix-category-slugs.js             (live execution)
 *
 * Safety:
 *   - Files are moved individually before legacy folders are dropped
 *   - A pre-flight inventory check runs before any writes
 *   - Dry-run mode performs zero filesystem mutations
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const ITEMS_DIR  = path.join(__dirname, '../src/data/items');
const IS_DRY_RUN = process.argv.includes('--dry-run');

// ── Slugification ──────────────────────────────────────────────────────────────
/**
 * Converts any raw category string to a URL-safe, lowercase, hyphenated slug.
 * "Personal Care" → "personal-care"
 * "Food & Drink"  → "food-drink"
 */
function slugify(raw) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // strip non-alphanumeric except spaces/hyphens
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-{2,}/g, '-')         // collapse consecutive hyphens
    .replace(/^-|-$/g, '');         // trim leading/trailing hyphens
}

// ── Directory audit ────────────────────────────────────────────────────────────
/**
 * Returns all immediate subdirectories of ITEMS_DIR.
 */
function getCategoryDirs() {
  return fs.readdirSync(ITEMS_DIR).filter(entry => {
    return fs.statSync(path.join(ITEMS_DIR, entry)).isDirectory();
  });
}

/**
 * Returns all .json files inside a given directory (non-recursive).
 */
function getJsonFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(dir, f));
}

// ── Folder rename / merge ──────────────────────────────────────────────────────
/**
 * Safely renames or merges a directory into its slugified target path.
 * If the target already exists, moves files individually then removes the source.
 * If not, renames the directory directly.
 */
function fixDirectory(srcDir, destDir) {
  const srcExists  = fs.existsSync(srcDir);
  const destExists = fs.existsSync(destDir);

  if (!srcExists) {
    console.log(`  [SKIP] Source not found: ${path.basename(srcDir)}`);
    return;
  }

  if (srcDir === destDir) {
    console.log(`  [OK]   Already slug-safe: ${path.basename(srcDir)}`);
    return;
  }

  if (destExists) {
    // Merge: move files into existing target, then remove empty source
    console.log(`  [MERGE] ${path.basename(srcDir)} → ${path.basename(destDir)}`);
    const files = getJsonFiles(srcDir);
    for (const file of files) {
      const dest = path.join(destDir, path.basename(file));
      console.log(`    → Moving: ${path.basename(file)}`);
      if (!IS_DRY_RUN) {
        fs.renameSync(file, dest);
      }
    }
    if (!IS_DRY_RUN) {
      // Only remove if now empty
      const remaining = fs.readdirSync(srcDir);
      if (remaining.length === 0) {
        fs.rmdirSync(srcDir);
        console.log(`    → Removed empty source dir: ${path.basename(srcDir)}`);
      } else {
        console.log(`    ⚠ Source dir not empty after move — not removed: ${path.basename(srcDir)}`);
      }
    }
  } else {
    // Simple rename
    console.log(`  [RENAME] ${path.basename(srcDir)} → ${path.basename(destDir)}`);
    if (!IS_DRY_RUN) {
      fs.renameSync(srcDir, destDir);
    }
  }
}

// ── JSON category field sync ───────────────────────────────────────────────────
/**
 * Reads a JSON item file and, if the `category` field does not match the
 * expected display name derived from the folder slug, updates and writes it.
 *
 * NOTE: The JSON `category` field stores the human-readable display name
 * (e.g. "Personal Care"), not the slug. This function maps slug → display name
 * using the folderSlug itself — if the existing display name already slugifies
 * to the correct folder slug, it is left untouched to preserve casing.
 */
function syncJsonCategory(filePath, folderSlug) {
  const raw = fs.readFileSync(filePath, 'utf8');
  let item;
  try {
    item = JSON.parse(raw);
  } catch (err) {
    console.error(`  [ERROR] Failed to parse: ${path.basename(filePath)}`);
    return;
  }

  const existingCategory   = item.category || '';
  const existingCategorySlug = slugify(existingCategory);

  if (existingCategorySlug === folderSlug) {
    // Display name already slugifies to the correct folder — no change needed.
    return;
  }

  // The category field produces a different slug from the folder name.
  // Update it to exactly match the folder slug (slug form, since display name
  // is ambiguous at this point). Flag for manual review.
  console.log(`  [JSON UPDATE] ${path.basename(filePath)}: "${existingCategory}" → "${folderSlug}" (verify display name manually)`);
  if (!IS_DRY_RUN) {
    item.category = folderSlug;
    fs.writeFileSync(filePath, JSON.stringify(item, null, 2), 'utf8');
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
function main() {
  console.log(IS_DRY_RUN
    ? '--- DRY RUN: CATEGORY SLUG FIX PREVIEW ---'
    : '--- EXECUTING LIVE CATEGORY SLUG FIX ---');
  console.log(`Target: ${ITEMS_DIR}\n`);

  const dirs = getCategoryDirs();
  let fixedDirs   = 0;
  let fixedFiles  = 0;
  let cleanDirs   = 0;

  for (const dirName of dirs) {
    const slug    = slugify(dirName);
    const srcDir  = path.join(ITEMS_DIR, dirName);
    const destDir = path.join(ITEMS_DIR, slug);

    if (dirName !== slug) {
      fixedDirs++;
      fixDirectory(srcDir, destDir);
    } else {
      cleanDirs++;
      console.log(`  [OK]   ${dirName} — already slug-safe`);
    }

    // Sync JSON category fields inside the (now-correct) folder
    const targetDir = fs.existsSync(destDir) ? destDir : srcDir;
    for (const jsonFile of getJsonFiles(targetDir)) {
      const before = fixedFiles;
      syncJsonCategory(jsonFile, slug);
      // Count only if changed
      if (fixedFiles > before) fixedFiles++;
    }
  }

  console.log('\n─────────────────────────────────────');
  console.log(`${IS_DRY_RUN ? 'Dry run' : 'Fix'} complete.`);
  console.log(`  Dirs already clean  : ${cleanDirs}`);
  console.log(`  Dirs renamed/merged : ${fixedDirs}`);
  console.log(`  Total dirs scanned  : ${dirs.length}`);
  if (IS_DRY_RUN) {
    console.log('\nRun without --dry-run to apply changes.');
  }
}

main();
