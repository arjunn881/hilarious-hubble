import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../src/data/items');
const dataDir = path.join(__dirname, '../src/data');
const publicDir = path.join(__dirname, '../public');

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
  const metadata = [];

  for (const file of jsonFiles) {
    const raw = fs.readFileSync(file, 'utf8');
    const content = JSON.parse(raw);

    // Filter only essential fields needed for client search & sitemaps to optimize size
    metadata.push({
      id: content.id,
      slug: content.slug,
      name: content.name,
      category: content.category,
      aliases: content.aliases || [],
      keywords: content.keywords || [],
      carryOn: content.carryOn.status,
      checked: content.checkedBag.status,
      lastReviewed: content.metadata.lastReviewed
    });
  }

  // 1. Write metadata-summary.json for SSG build-time loading
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(dataDir, 'metadata-summary.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );
  console.log(`[build-search-index] Generated src/data/metadata-summary.json with ${metadata.length} entries.`);

  // 2. Write search-index.json for client-side fetches
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(publicDir, 'search-index.json'),
    JSON.stringify(metadata),
    'utf8'
  );
  console.log(`[build-search-index] Generated public/search-index.json with ${metadata.length} entries.`);
} catch (err) {
  console.error('[build-search-index] Compilation failed:', err);
  process.exit(1);
}
