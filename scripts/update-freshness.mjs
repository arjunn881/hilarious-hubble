import fs from 'fs';
import path from 'path';

const TODAY = '2026-11-14';
const NEXT_YEAR = '2027-11-14';

const itemsDir = 'd:/Websites/Bringonplabe/src/data/items';
const articlesDir = 'd:/Websites/Bringonplabe/src/data/articles';

let itemCount = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith('.json')) {
      const content = fs.readFileSync(full, 'utf8');
      const data = JSON.parse(content);
      if (data.metadata) {
        data.metadata.lastReviewed = TODAY;
        data.metadata.nextReviewDue = NEXT_YEAR;
        fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n', 'utf8');
        itemCount++;
      }
    }
  }
}

walk(itemsDir);
console.log(`Updated ${itemCount} items to lastReviewed: ${TODAY}`);

let articleCount = 0;
for (const file of fs.readdirSync(articlesDir)) {
  if (!file.endsWith('.md')) continue;
  const full = path.join(articlesDir, file);
  let content = fs.readFileSync(full, 'utf8');
  if (/^lastUpdated:/m.test(content)) {
    content = content.replace(/^lastUpdated:.*$/m, `lastUpdated: "${TODAY}"`);
    fs.writeFileSync(full, content, 'utf8');
    articleCount++;
  }
}
console.log(`Updated ${articleCount} articles to lastUpdated: ${TODAY}`);
