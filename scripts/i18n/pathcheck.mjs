import fs from 'node:fs';
import path from 'node:path';

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = `${d}/${e.name}`;
    e.isDirectory() ? walk(p) : files.push(p);
  }
})('src/pages/[...lang]');

let bad = 0;
let checked = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/["'](\.\.\/[^"']+)["']/g)) {
    const spec = m[1];
    checked++;
    const resolved = path.resolve(path.dirname(f), spec);
    // For a glob, only the static prefix can be checked — a pattern that matches
    // nothing today (e.g. an overlay directory not created yet) is still valid.
    const candidates = spec.includes('*')
      ? [path.dirname(resolved.slice(0, resolved.indexOf('*')))]
      : [resolved, `${resolved}.ts`, `${resolved}.js`, `${resolved}.astro`, `${resolved}/index.ts`];
    if (!candidates.some((c) => fs.existsSync(c))) {
      bad++;
      console.log(`MISSING  ${f}  ->  ${spec}`);
    }
  }
}
console.log(`${checked} specifiers checked — ${bad === 0 ? 'all resolve' : `${bad} broken`}`);
