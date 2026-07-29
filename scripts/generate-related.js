import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../src/data/items');

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

try {
  const jsonFiles = findJsonFiles(itemsDir);
  const items = jsonFiles.map((file) => {
    const raw = fs.readFileSync(file, 'utf8');
    return {
      filePath: file,
      data: JSON.parse(raw)
    };
  });

  console.log(`[generate-related] Calculating relations for ${items.length} database items...`);

  let updatedCount = 0;

  for (const itemA of items) {
    const candidates = [];

    for (const itemB of items) {
      if (itemA.data.slug === itemB.data.slug) continue;

      let score = 0;

      // 1. Same category (10 points)
      if (itemA.data.category === itemB.data.category) {
        score += 10;
      }

      // 2. Same subcategory (5 points)
      if (itemA.data.subcategory && itemA.data.subcategory === itemB.data.subcategory) {
        score += 5;
      }

      // 3. Shared keywords (4 points each)
      const keysA = new Set(itemA.data.keywords.map(k => k.toLowerCase()));
      const keysB = itemB.data.keywords.map(k => k.toLowerCase());
      for (const kw of keysB) {
        if (keysA.has(kw)) score += 4;
      }

      // 4. Shared aliases (3 points each)
      const aliasesA = new Set(itemA.data.aliases.map(a => a.toLowerCase()));
      const aliasesB = itemB.data.aliases.map(a => a.toLowerCase());
      for (const al of aliasesB) {
        if (aliasesA.has(al)) score += 3;
      }

      // 5. Shared carryOn status (1 point)
      if (itemA.data.carryOn.status === itemB.data.carryOn.status) {
        score += 1;
      }

      if (score > 0) {
        candidates.push({ slug: itemB.data.slug, score });
      }
    }

    // Sort candidates by score descending, then by slug alphabetically
    candidates.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

    // Get the top 4 candidates
    const topRelated = candidates.slice(0, 4).map(c => c.slug);

    // Only update if the relatedItems list changed
    if (JSON.stringify(itemA.data.relatedItems) !== JSON.stringify(topRelated)) {
      itemA.data.relatedItems = topRelated;
      fs.writeFileSync(itemA.filePath, JSON.stringify(itemA.data, null, 2), 'utf8');
      updatedCount++;
    }
  }

  console.log(`[generate-related] Finished. Updated related items for ${updatedCount} files.`);
} catch (err) {
  console.error('[generate-related] Failed to generate related items:', err);
  process.exit(1);
}
