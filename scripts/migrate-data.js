import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../src/data/items');

// Find all JSON files in the itemsDir recursively
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
  console.log(`[migrate-data] Found ${jsonFiles.length} JSON files to migrate.`);

  const migratedItems = [];

  for (const file of jsonFiles) {
    const parentDirName = path.basename(path.dirname(file));
    
    // Skip if it's already migrated (i.e. parent directory is NOT a single-character shard)
    if (parentDirName.length > 1) {
      console.log(`[migrate-data] Skipping already migrated file: ${path.basename(file)}`);
      continue;
    }

    const raw = fs.readFileSync(file, 'utf8');
    const old = JSON.parse(raw);

    // Map rule statuses
    const mapStatus = (status) => {
      const s = String(status).toLowerCase().trim();
      if (s === 'allowed') return 'ALLOWED';
      if (s === 'prohibited' || s === 'not_allowed' || s === 'no') return 'NOT_ALLOWED';
      if (s === 'restricted') return 'RESTRICTED';
      return 'UNKNOWN';
    };

    // Calculate dates
    const lastRev = old.lastReviewed || "2026-06-30";
    const dateObj = new Date(lastRev);
    const dateNext = new Date(dateObj);
    dateNext.setMonth(dateNext.getMonth() + 12); // Default review interval 12 months
    const nextRev = dateNext.toISOString().split('T')[0];

    // Build the new strongly typed 19-field schema
    const carryOnStatus = mapStatus(old.carryOn);
    const checkedStatus = mapStatus(old.checked);
    const categorySlug = old.category.toLowerCase().trim().replace(/\s+/g, '-');

    const migrated = {
      id: old.id || old.slug,
      slug: old.slug,
      name: old.name,
      category: old.category,
      subcategory: old.subcategory || "General",
      aliases: old.aliases || [],
      keywords: old.keywords || [],
      description: old.description || `Guidelines for traveling with ${old.name.toLowerCase()} in your luggage.`,
      
      carryOn: {
        status: carryOnStatus,
        reason: old.reason || `Regulations for carrying ${old.name.toLowerCase()} in cabin baggage.`,
        conditions: old.importantNotes || [],
        exceptions: []
      },
      
      checkedBag: {
        status: checkedStatus,
        reason: old.reason || `Regulations for carrying ${old.name.toLowerCase()} in checked luggage.`,
        conditions: old.importantNotes || [],
        exceptions: []
      },
      
      tsa: {
        officialUrl: old.officialSource || "https://www.tsa.gov/travel/security-screening/whatcanibring/all",
        lastVerified: lastRev,
        pageTitle: `Can I bring ${old.name.toLowerCase()} on a plane?`
      },
      
      faa: {
        officialUrl: "https://www.faa.gov/hazmat/packsafe",
        applicable: old.category.toLowerCase() === 'electronics' || old.keywords.includes('battery')
      },
      
      sources: [
        {
          name: "TSA",
          url: old.officialSource || "https://www.tsa.gov/travel/security-screening/whatcanibring/all",
          verified: lastRev,
          priority: 1
        }
      ],
      
      airlines: [],
      international: {},
      travelTips: old.importantNotes ? [old.importantNotes[0] || `Pack ${old.name.toLowerCase()} safely.`] : [],
      relatedItems: old.relatedItems || [],
      faq: [
        {
          question: `Is ${old.name.toLowerCase()} allowed in carry-on bags?`,
          answer: `${old.name} is ${carryOnStatus.replace('_', ' ').toLowerCase()} in carry-on luggage. ${old.reason || ''}`
        },
        {
          question: `Can you pack ${old.name.toLowerCase()} in checked baggage?`,
          answer: `Yes, ${old.name} is ${checkedStatus.replace('_', ' ').toLowerCase()} in checked bags.`
        }
      ],
      
      metadata: {
        lastReviewed: lastRev,
        nextReviewDue: nextRev,
        reviewIntervalMonths: 12,
        editor: "BringOnPlane Editorial Team",
        version: "1.0.0"
      }
    };

    // Ensure output category folder exists
    const categoryFolder = path.join(itemsDir, categorySlug);
    if (!fs.existsSync(categoryFolder)) {
      fs.mkdirSync(categoryFolder, { recursive: true });
    }

    const outputFilePath = path.join(categoryFolder, `${old.slug}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(migrated, null, 2), 'utf8');
    
    migratedItems.push({
      oldFile: file,
      newFile: outputFilePath
    });
  }

  // Delete the old single-character folders and old files
  for (const item of migratedItems) {
    if (fs.existsSync(item.oldFile)) {
      fs.unlinkSync(item.oldFile);
    }
  }

  // Clean up empty directories in itemsDir
  const shardDirs = fs.readdirSync(itemsDir);
  for (const item of shardDirs) {
    const fullPath = path.join(itemsDir, item);
    if (fs.statSync(fullPath).isDirectory() && item.length === 1) {
      // It's a single character directory (shard), delete it if empty
      const children = fs.readdirSync(fullPath);
      if (children.length === 0) {
        fs.rmdirSync(fullPath);
        console.log(`[migrate-data] Removed empty shard directory: ${item}`);
      }
    }
  }

  console.log(`[migrate-data] Successfully migrated ${migratedItems.length} items to category subfolders.`);
} catch (err) {
  console.error('[migrate-data] Migration failed:', err);
  process.exit(1);
}
