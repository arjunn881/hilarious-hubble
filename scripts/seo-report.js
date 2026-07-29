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
  const issues = [];

  for (const file of jsonFiles) {
    const raw = fs.readFileSync(file, 'utf8');
    const item = JSON.parse(raw);

    // Dynamic SEO generation simulation (exactly matching our Astro pages logic)
    const seoTitle = `Can You Bring ${item.name} On Plane? Carry-On & Checked Bags Rules`;
    const seoDescription = item.carryOn.reason || item.description;

    if (seoTitle.length > 60) {
      issues.push({
        slug: item.slug,
        field: 'title',
        length: seoTitle.length,
        value: seoTitle,
        recommendation: 'Reduce length to < 60 characters for search snippets.'
      });
    }

    if (seoDescription.length > 160) {
      issues.push({
        slug: item.slug,
        field: 'description',
        length: seoDescription.length,
        value: seoDescription,
        recommendation: 'Reduce length to < 160 characters for mobile truncation.'
      });
    }

    // Check basic metadata
    if (!item.keywords || item.keywords.length < 3) {
      issues.push({
        slug: item.slug,
        field: 'keywords',
        length: item.keywords?.length || 0,
        value: '',
        recommendation: 'Add at least 3 keywords for SEO index mapping.'
      });
    }
  }

  console.log("\n====================================================");
  console.log("BRINGONPLANE TECHNICAL SEO AUDIT REPORT");
  console.log("====================================================");
  console.log(`Total Pages Audited: ${jsonFiles.length}`);
  console.log(`Total SEO Issues Found: ${issues.length}`);
  console.log("====================================================\n");

  if (issues.length > 0) {
    for (const issue of issues) {
      console.log(`⚠️  [${issue.slug}] - Invalid ${issue.field} length: ${issue.length} chars.`);
      console.log(`    Value: "${issue.value}"`);
      console.log(`    Recommendation: ${issue.recommendation}\n`);
    }
  } else {
    console.log("✅ No technical SEO issues found! All pages comply with metadata limits.");
  }
} catch (err) {
  console.error('[seo-report] SEO audit failed:', err);
  process.exit(1);
}
