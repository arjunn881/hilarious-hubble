import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../src/data/items');

// Find all JSON files recursively
function findJsonFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findJsonFiles(fullPath, files);
    } else if (item.endsWith('.json') && item !== 'metadata-summary.json') {
      files.push(fullPath);
    }
  }
  return files;
}

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
const validStatuses = ['ALLOWED', 'NOT_ALLOWED', 'RESTRICTED', 'UNKNOWN'];

try {
  const jsonFiles = findJsonFiles(itemsDir);
  const items = [];
  const slugs = new Set();
  let failed = false;

  console.log(`[validate] Auditing ${jsonFiles.length} database entries...`);

  // Phase 1: Load and check schemas/individual properties
  for (const file of jsonFiles) {
    const filename = path.basename(file);
    const raw = fs.readFileSync(file, 'utf8');
    let data;

    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error(`❌ [validate] ${filename}: Invalid JSON format.`);
      failed = true;
      continue;
    }

    // 1. Missing or duplicate slugs
    if (!data.slug) {
      console.error(`❌ [validate] ${filename}: Missing 'slug' property.`);
      failed = true;
      continue;
    }
    if (slugs.has(data.slug)) {
      console.error(`❌ [validate] ${filename}: Duplicate slug found: "${data.slug}"`);
      failed = true;
    } else {
      slugs.add(data.slug);
    }

    // 2. Missing name/category
    if (!data.name) {
      console.error(`❌ [validate] ${data.slug || filename}: Missing 'name' property.`);
      failed = true;
    }
    if (!data.category) {
      console.error(`❌ [validate] ${data.slug || filename}: Missing 'category' property.`);
      failed = true;
    }

    // 3. Status validation
    if (!data.carryOn || !validStatuses.includes(data.carryOn.status)) {
      console.error(`❌ [validate] ${data.slug}: Invalid carryOn status: "${data.carryOn?.status}". Allowed values: ${validStatuses.join(', ')}`);
      failed = true;
    }
    if (!data.checkedBag || !validStatuses.includes(data.checkedBag.status)) {
      console.error(`❌ [validate] ${data.slug}: Invalid checkedBag status: "${data.checkedBag?.status}". Allowed values: ${validStatuses.join(', ')}`);
      failed = true;
    }

    // 4. Source validation (At least one official government source)
    if (!data.sources || !Array.isArray(data.sources) || data.sources.length === 0) {
      console.error(`❌ [validate] ${data.slug}: Missing source citations. At least one source must be provided.`);
      failed = true;
    } else {
      for (const src of data.sources) {
        if (!src.name) {
          console.error(`❌ [validate] ${data.slug}: Source is missing a 'name'.`);
          failed = true;
        }
        if (!src.url || !urlRegex.test(src.url)) {
          console.error(`❌ [validate] ${data.slug}: Invalid source URL: "${src.url}"`);
          failed = true;
        }
      }
    }

    // 5. TSA officialUrl validation
    if (data.tsa && data.tsa.officialUrl && !urlRegex.test(data.tsa.officialUrl)) {
      console.error(`❌ [validate] ${data.slug}: Invalid TSA officialUrl: "${data.tsa.officialUrl}"`);
      failed = true;
    }

    // 6. Review dates validation
    if (!data.metadata || !data.metadata.lastReviewed || !data.metadata.nextReviewDue) {
      console.error(`❌ [validate] ${data.slug}: Missing review dates metadata.`);
      failed = true;
    }

    // 7. Duplicate keywords
    if (data.keywords && Array.isArray(data.keywords)) {
      const keywordSet = new Set();
      for (const kw of data.keywords) {
        if (keywordSet.has(kw.toLowerCase())) {
          console.error(`❌ [validate] ${data.slug}: Duplicate keyword: "${kw}"`);
          failed = true;
        }
        keywordSet.add(kw.toLowerCase());
      }
    }

    // 8. Rule History Validation
    if (!data.ruleHistory || !Array.isArray(data.ruleHistory) || data.ruleHistory.length === 0) {
      console.error(`❌ [validate] ${data.slug}: Missing or invalid 'ruleHistory' property.`);
      failed = true;
    } else {
      for (const historyItem of data.ruleHistory) {
        if (!historyItem.effectiveDate || isNaN(Date.parse(historyItem.effectiveDate))) {
          console.error(`❌ [validate] ${data.slug}: Invalid effectiveDate in ruleHistory: "${historyItem.effectiveDate}"`);
          failed = true;
        }
        if (!historyItem.change || typeof historyItem.change !== 'string') {
          console.error(`❌ [validate] ${data.slug}: Missing change description in ruleHistory.`);
          failed = true;
        }
        if (!historyItem.source || !urlRegex.test(historyItem.source)) {
          console.error(`❌ [validate] ${data.slug}: Invalid source URL in ruleHistory: "${historyItem.source}"`);
          failed = true;
        }
      }
    }

    // 9. Content Quality Explanation Length limits (Max 80 words)
    const checkWordCount = (text, fieldName) => {
      if (!text) return;
      const count = text.split(/\s+/).filter(Boolean).length;
      if (count > 80) {
        console.error(`❌ [validate] ${data.slug}: ${fieldName} exceeds the 80-word limit (${count} words).`);
        failed = true;
      }
    };
    checkWordCount(data.carryOn?.reason, "carryOn.reason");
    checkWordCount(data.checkedBag?.reason, "checkedBag.reason");
    checkWordCount(data.description, "description");

    items.push(data);
  }

  // Phase 2: Check cross-file relational bounds (relatedItems)
  for (const item of items) {
    if (item.relatedItems && Array.isArray(item.relatedItems)) {
      for (const related of item.relatedItems) {
        if (!slugs.has(related)) {
          console.error(`❌ [validate] ${item.slug}: Broken relatedItems link: "${related}" does not exist in the database.`);
          failed = true;
        }
      }
    }
  }

  if (failed) {
    console.error("\n❌ [validate] Database validation failed. Fix the errors before building.");
    process.exit(1);
  } else {
    console.log(`\n✅ [validate] All ${items.length} items validated successfully!`);
  }
} catch (err) {
  console.error('[validate] Error during validation:', err);
  process.exit(1);
}
