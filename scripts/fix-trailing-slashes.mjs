import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ARTICLES_DIR = join(__dirname, '../src/data/articles');

function collectMd(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) results.push(...collectMd(full));
    else if (['.md', '.mdx'].includes(extname(entry))) results.push(full);
  }
  return results;
}

let totalFixed = 0;
for (const file of collectMd(ARTICLES_DIR)) {
  let content = readFileSync(file, 'utf8');
  // Fix /guide/slug) -> /guide/slug/)
  const fixed = content.replace(/\]\(\/guide\/([^/)]+)\)/g, '](/guide/$1/)');
  // Also fix /items/slug) -> /items/slug/) but only bare slugs (not /items/slug/airline/...)
  const fixed2 = fixed.replace(/\]\(\/items\/([^/)]+)\)/g, '](/items/$1/)');
  if (fixed2 !== content) {
    writeFileSync(file, fixed2, 'utf8');
    const slug = file.split(/[/\\]/).pop();
    totalFixed++;
    console.log('  Fixed: ' + slug);
  }
}
console.log('Done. Fixed ' + totalFixed + ' files.');