#!/usr/bin/env node
// scripts/sanitize-entire-database.js
//
// Recursively scans src/data/items/**/*.json and enforces:
//   1. Whitespace trim on carryOn.reason and checkedBag.reason
//   2. Presence of restrictionType and customNote top-level fields
//   3. Valid JSON integrity (parse errors are reported, never silently swallowed)
//
// NOTE — categories are NOT lowercased or slugified here.
//   Category values ("Electronics", "Personal Care", etc.) are display names
//   rendered verbatim inside <h1> tags on category pages. URL slugs are
//   computed at build-time inside getStaticPaths(). Slugifying the stored
//   value would produce broken headings like "personal-care TSA Rules".
//   Directory slug compliance is handled by scripts/fix-category-slugs.js.

import fs   from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);


const DATA_DIR = path.join(__dirname, '../src/data/items');

// ── Counters ─────────────────────────────────────────────────────────────────
let scanned  = 0;
let mutated  = 0;
let errored  = 0;

// ── Core sanitization logic ───────────────────────────────────────────────────
function sanitizeFile(fullPath) {
  scanned++;
  const rawData = fs.readFileSync(fullPath, 'utf8');
  let obj;
  try {
    obj = JSON.parse(rawData);
  } catch (err) {
    console.error(`[MALFORMED JSON] ${path.relative(DATA_DIR, fullPath)}: ${err.message}`);
    errored++;
    return;
  }

  let dirty = false;

  // ── 1. Trim whitespace on carryOn.reason ────────────────────────────────
  if (obj.carryOn && typeof obj.carryOn.reason === 'string') {
    const trimmed = obj.carryOn.reason.trim();
    if (trimmed !== obj.carryOn.reason) {
      console.log(`[TRIM carryOn.reason]    ${path.basename(fullPath)}`);
      obj.carryOn.reason = trimmed;
      dirty = true;
    }
  }

  // ── 2. Trim whitespace on checkedBag.reason (NOT "checked") ─────────────
  //    All 197 items use the field name "checkedBag", not "checked".
  if (obj.checkedBag && typeof obj.checkedBag.reason === 'string') {
    const trimmed = obj.checkedBag.reason.trim();
    if (trimmed !== obj.checkedBag.reason) {
      console.log(`[TRIM checkedBag.reason] ${path.basename(fullPath)}`);
      obj.checkedBag.reason = trimmed;
      dirty = true;
    }
  }

  // ── 3. Ensure restrictionType and customNote fields exist ────────────────
  if (obj.restrictionType === undefined) {
    obj.restrictionType = "";
    dirty = true;
  }
  if (obj.customNote === undefined) {
    obj.customNote = "";
    dirty = true;
  }

  // ── 4. Write back only if something changed ──────────────────────────────
  if (dirty) {
    fs.writeFileSync(fullPath, JSON.stringify(obj, null, 2), 'utf8');
    mutated++;
  }
}

// ── Recursive directory walker ────────────────────────────────────────────────
function walk(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`[ERROR] Directory not found: ${dir}`);
    process.exit(1);
  }
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (entry.endsWith('.json')) {
      sanitizeFile(full);
    }
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────
console.log('--- INITIATING FULL-SITE DATA SANITIZATION PASS ---');
console.log(`Target: ${DATA_DIR}\n`);

walk(DATA_DIR);

console.log('\n' + '─'.repeat(45));
console.log('Sanitization complete.');
console.log(`  Files scanned : ${scanned}`);
console.log(`  Files mutated : ${mutated}`);
console.log(`  Parse errors  : ${errored}`);

if (errored > 0) {
  console.error('\n[WARNING] Some files could not be parsed. Review errors above.');
  process.exit(1);
}
