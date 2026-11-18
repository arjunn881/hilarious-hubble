import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith('.json')) results.push(full);
  });
  return results;
}

const SYNONYMS = {
  'gaming-console': ['ps5', 'playstation', 'ps1', 'xbox', 'game boy', 'console'],
  'energy-drink': ['redbull', 'red bull', 'monster', '5 hour energy'],
  'nicotine-pouches': ['zyn', 'zyns', 'snus', 'nicotine pouch'],
  'multi-tool': ['multitool', 'leatherman'],
  'extension-cord': ['extension lead', 'surge protector', 'power strip', 'extension wire', 'the cable'],
  'fire-starter': ['flint', 'flint and steel', 'ferro rod', 'ferro rods', 'emergency flint'],
  'gold-ring': ['engagement ring', 'wedding ring', 'ring'],
  'heating-pad': ['heat pack', 'heat pad', 'heating pad', 'heat packs'],
  'hookah': ['shisha'],
  'pepper-spray': ['sabre'],
  'chocolate-bar': ['snickers', 'chocolate bar', 'chocolate bars'],
  'lithium-batteries': ['batteries', 'cr2032', 'lithium battery', 'button batteries'],
  'jump-rope': ['skipping rope'],
  'knife': ['box cutter', 'box cutters'],
  'instant-noodles': ['cup noodles', 'cup of noodles', 'instant noodles', 'ramen', 'maggi', 'pot noodles', 'buldak'],
  'nuts': ['almonds', 'cashews', 'cashew', 'pistachios', 'peanuts', 'mixed nuts'],
  'shoes': ['boots', 'heels', 'high heels', 'sneakers'],
  'suit': ['suit bag', 'tux', 'tuxedo'],
  'dumbbells': ['weights', 'dumbbell'],
  'smartwatch': ['smart watch', 'smartwatch'],
  'watch': ['wrist watch', 'analog watch'],
  'canned-food': ['canned salmon', 'can tuna', 'canned'],
  'dog-food': ['dog treats', 'dog food'],
  'cat-food': ['cat treats', 'cat food'],
  'candy': ['lollipops', 'jolly ranchers', 'gummy candy', 'lollies'],
  'shaving-cream': ['shaving foam'],
  'bug-spray': ['insecticide', 'bug spray', 'mosquito repellent', 'mosquito spray', 'odomos'],
  'bananas': ['banana', 'bananas', 'matooke'],
  'spices': ['seasoning', 'seasonings', 'curry powder', 'herbs and spices', 'salt and pepper'],
  'cigarettes': ['cigs', 'cigarates', 'cigarette packs', 'carton of cigarettes', 'cigar', 'cigars'],
  'airtag': ['airtags', 'air tags', 'air tag'],
  'airpods': ['earbuds'],
  'laptop-charger': ['computer charger', 'laptop chargers', 'computer chargers', 'the charger']
};

const content = fs.readFileSync('scripts/raw-queries.txt', 'utf8');
const lines = content.split('\n').filter(Boolean);
const queries = Array.from(new Set(lines.map(l => l.split('\t')[0].trim().toLowerCase()).filter(Boolean)));

const items = walk('src/data/items').map(f => ({
  file: f,
  data: JSON.parse(fs.readFileSync(f, 'utf8'))
}));

let modifiedFiles = 0;
let totalAliasesAdded = 0;
let totalKeywordsAdded = 0;

for (const { file, data } of items) {
  const slug = data.slug;
  const name = data.name.toLowerCase();
  const rootName = name.replace(/s$/, '');
  const syns = SYNONYMS[slug] || [];

  if (!Array.isArray(data.aliases)) data.aliases = [];
  if (!Array.isArray(data.keywords)) data.keywords = [];

  const existingAliases = new Set(data.aliases.map(a => a.toLowerCase().trim()));
  const existingKeywords = new Set(data.keywords.map(k => k.toLowerCase().trim()));

  let fileChanged = false;

  queries.forEach(q => {
    if (
      q.includes(slug) ||
      q.includes(name) ||
      (rootName.length > 3 && q.includes(rootName)) ||
      syns.some(s => q.includes(s))
    ) {
      if (!existingAliases.has(q)) {
        data.aliases.push(q);
        existingAliases.add(q);
        totalAliasesAdded++;
        fileChanged = true;
      }
      if (!existingKeywords.has(q)) {
        data.keywords.push(q);
        existingKeywords.add(q);
        totalKeywordsAdded++;
        fileChanged = true;
      }
    }
  });

  if (fileChanged) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
    modifiedFiles++;
  }
}

console.log(`✅ Applied keywords and aliases:`);
console.log(` - Modified item files: ${modifiedFiles}`);
console.log(` - Total aliases added: ${totalAliasesAdded}`);
console.log(` - Total keywords added: ${totalKeywordsAdded}`);
