import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Walk directory recursively
function walkDir(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isDirectory()) {
      walkDir(filePath, filter, fileList);
    } else if (filter(filePath)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function runAudit() {
  const distDir = path.join(__dirname, '../dist');
  if (!fs.existsSync(distDir)) {
    console.error("❌ Build folder /dist does not exist. Run 'npm run build' first.");
    process.exit(1);
  }

  console.log("🔍 Scanning dist folder for HTML pages to audit Technical SEO...");
  const htmlFiles = walkDir(distDir, (f) => f.endsWith('.html'));
  console.log(`📑 Found ${htmlFiles.length} HTML files to inspect.\n`);

  const titles = new Map(); // title -> [paths]
  const descriptions = new Map(); // desc -> [paths]
  const missingTitles = [];
  const missingDescriptions = [];
  const missingCanonicals = [];
  const missingSchemas = [];
  const lengthWarnings = [];

  htmlFiles.forEach((file) => {
    const relativePath = path.relative(distDir, file);
    const html = fs.readFileSync(file, 'utf-8');

    // Skip redirection files
    if (html.includes('http-equiv="refresh"')) {
      return;
    }

    // 1. Extract Title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    // 2. Extract Meta Description
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || 
                      html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
    const desc = descMatch ? descMatch[1].trim() : null;

    // 3. Extract Canonical
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) ||
                           html.match(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;

    // 4. Extract Schema JSON-LD scripts
    const schemaMatches = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    const schemasCount = schemaMatches ? schemaMatches.length : 0;

    // Audit Title
    if (!title) {
      missingTitles.push(relativePath);
    } else {
      if (title.length < 25 || title.length > 75) {
        lengthWarnings.push(`⚠️ Title Length Warning: "${title}" (${title.length} chars) in ${relativePath}`);
      }
      if (!titles.has(title)) {
        titles.set(title, []);
      }
      titles.get(title).push(relativePath);
    }

    // Audit Description
    if (!desc) {
      missingDescriptions.push(relativePath);
    } else {
      if (desc.length < 75 || desc.length > 175) {
        lengthWarnings.push(`⚠️ Desc Length Warning: "${desc.substring(0, 40)}..." (${desc.length} chars) in ${relativePath}`);
      }
      if (!descriptions.has(desc)) {
        descriptions.set(desc, []);
      }
      descriptions.get(desc).push(relativePath);
    }

    // Audit Canonical
    if (!canonical) {
      missingCanonicals.push(relativePath);
    }

    // Audit Schema count
    if (schemasCount === 0) {
      missingSchemas.push(relativePath);
    }
  });

  // Calculate Duplicates
  const duplicateTitles = Array.from(titles.entries()).filter(([_, paths]) => paths.length > 1);
  const duplicateDescriptions = Array.from(descriptions.entries()).filter(([_, paths]) => paths.length > 1);

  // Print Audit Report
  console.log("=========================================");
  console.log("TECHNICAL SEO AUDIT REPORT");
  console.log("=========================================");
  console.log(`Total Pages Audited:      ${htmlFiles.length}`);
  console.log(`Missing Titles:           ${missingTitles.length}`);
  console.log(`Missing Descriptions:     ${missingDescriptions.length}`);
  console.log(`Missing Canonical Tags:   ${missingCanonicals.length}`);
  console.log(`Missing JSON-LD Schemas:  ${missingSchemas.length}`);
  console.log(`Duplicate Titles:         ${duplicateTitles.length}`);
  console.log(`Duplicate Descriptions:   ${duplicateDescriptions.length}`);
  console.log(`Length Warnings:          ${lengthWarnings.length}`);
  console.log("=========================================\n");

  let hasErrors = false;

  if (missingTitles.length > 0) {
    console.error("❌ Missing Titles found in:");
    missingTitles.slice(0, 10).forEach(p => console.error(`  - ${p}`));
    hasErrors = true;
  }

  if (missingDescriptions.length > 0) {
    console.error("❌ Missing Descriptions found in:");
    missingDescriptions.slice(0, 10).forEach(p => console.error(`  - ${p}`));
    hasErrors = true;
  }

  if (duplicateTitles.length > 0) {
    console.error("❌ Duplicate Titles found:");
    duplicateTitles.slice(0, 5).forEach(([title, paths]) => {
      console.error(`  - Title: "${title}" duplicated in:`);
      paths.slice(0, 5).forEach(p => console.error(`    * ${p}`));
    });
    hasErrors = true;
  }

  if (duplicateDescriptions.length > 0) {
    console.error("❌ Duplicate Descriptions found:");
    duplicateDescriptions.slice(0, 5).forEach(([desc, paths]) => {
      console.error(`  - Description: "${desc}" duplicated in:`);
      paths.slice(0, 5).forEach(p => console.error(`    * ${p}`));
    });
    hasErrors = true;
  }

  if (lengthWarnings.length > 0) {
    console.log("ℹ️ Tag Length Diagnostics (Warnings):");
    lengthWarnings.slice(0, 10).forEach(w => console.log(`  ${w}`));
    if (lengthWarnings.length > 10) {
      console.log(`  ... and ${lengthWarnings.length - 10} more warnings.`);
    }
  }

  if (hasErrors) {
    console.error("\n❌ SEO Audit Failed! Fix the errors listed above.");
    process.exit(1);
  } else {
    console.log("\n✅ SEO Validation Passed! Zero duplicate metadata fields, zero missing tags.");
  }
}

runAudit();
