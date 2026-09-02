/**
 * Parse-checks .astro files: runs the real Astro compiler over each file, then
 * runs esbuild over the emitted TSX so frontmatter type/syntax errors surface too.
 */
import fs from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import * as esbuild from 'esbuild';

const files = process.argv.slice(2);
let bad = 0;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  try {
    const result = await transform(source, { filename: file, sourcemap: 'inline' });
    for (const d of result.diagnostics ?? []) {
      if (d.severity === 1) {
        bad++;
        console.log(`ERROR ${file}: ${d.text} (line ${d.location?.line})`);
      }
    }
    const fm = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fm) {
      // Astro wraps the frontmatter in a function, so a top-level `return`
      // (e.g. Astro.redirect) is legal there but not in a plain ES module.
      const script = fm[1]
        .replace(/^(\s*)return(\s*;)/gm, '$1void 0$2')
        .replace(/^(\s*)return\s/gm, '$1void ');
      await esbuild.transform(script, { loader: 'ts', sourcefile: file });
    }
    console.log(`ok   ${file}`);
  } catch (err) {
    bad++;
    console.log(`FAIL ${file}: ${err.message}`);
    if (err.errors) for (const e of err.errors) console.log(`     ${e.text} @ line ${e.location?.line}`);
  }
}

console.log(bad === 0 ? 'RESULT: OK' : `RESULT: ${bad} problem(s)`);
process.exit(bad === 0 ? 0 : 1);
