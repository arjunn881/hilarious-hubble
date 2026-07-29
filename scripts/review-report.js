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
  const now = new Date();
  
  const expired = [];
  const upcoming = [];
  const clean = [];

  for (const file of jsonFiles) {
    const raw = fs.readFileSync(file, 'utf8');
    const content = JSON.parse(raw);
    const nextReview = new Date(content.metadata.nextReviewDue);

    const diffTime = nextReview.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const itemReport = {
      slug: content.slug,
      name: content.name,
      lastReviewed: content.metadata.lastReviewed,
      nextReviewDue: content.metadata.nextReviewDue,
      daysRemaining: diffDays
    };

    if (diffDays < 0) {
      expired.push(itemReport);
    } else if (diffDays <= 30) {
      upcoming.push(itemReport);
    } else {
      clean.push(itemReport);
    }
  }

  console.log("\n====================================================");
  console.log("BRINGONPLANE CONTENT REVIEW STATUS REPORT");
  console.log("====================================================");
  console.log(`Total Items Audited: ${jsonFiles.length}`);
  console.log(`Clean items (Review safe): ${clean.length}`);
  console.log(`Upcoming reviews (Within 30 days): ${upcoming.length}`);
  console.log(`Expired reviews (Action required): ${expired.length}`);
  console.log("====================================================\n");

  if (expired.length > 0) {
    console.log("⚠️ EXPIRED REVIEWS:");
    expired.sort((a, b) => a.daysRemaining - b.daysRemaining);
    for (const item of expired) {
      console.log(`  - [${item.slug}] ${item.name}: Expired ${Math.abs(item.daysRemaining)} days ago (Next review due: ${item.nextReviewDue})`);
    }
    console.log("");
  }

  if (upcoming.length > 0) {
    console.log("📅 UPCOMING REVIEWS (NEXT 30 DAYS):");
    upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);
    for (const item of upcoming) {
      console.log(`  - [${item.slug}] ${item.name}: Due in ${item.daysRemaining} days (Next review due: ${item.nextReviewDue})`);
    }
    console.log("");
  }

  console.log("✅ Audit report complete.");
} catch (err) {
  console.error('[review-report] Audit failed:', err);
  process.exit(1);
}
