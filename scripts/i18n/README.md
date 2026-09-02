# i18n checks

Five standalone harnesses for the eight-locale build. There is no TypeScript
compiler in this project, so these are the verification layer. Run them from the
repository root.

| Command | What it proves |
| --- | --- |
| `npm run i18n:keys` | Every locale in `src/i18n/ui/` mirrors the English key set: no missing, extra or empty keys, and `{placeholder}` sets match per key. Also reports duplicate literal keys. |
| `npm run i18n:leaks -- <files…>` | Finds hardcoded English left in `.astro` templates — visible text and the `aria-label`/`alt`/`title`/`placeholder`/`content` attributes. |
| `npm run i18n:paths` | Every relative specifier under `src/pages/[...lang]/` resolves. Globs are checked down to their static prefix. |
| `npm run i18n:overlay` | The three translation overlays in `src/i18n/prose/` substitute correctly and fall back to English field by field. |
| `npm run i18n:compile -- <files…>` | Type-strips and parses `.astro` files through the Astro compiler and esbuild — catches undeclared identifiers and syntax errors without a full build. |

Typical sweep over the localized routes:

```sh
npm run i18n:keys
npm run i18n:paths
npm run i18n:overlay
npm run i18n:leaks -- 'src/pages/[...lang]/'*.astro 'src/pages/[...lang]/'**/*.astro
npm run build
```

## Known false positives

`i18n:leaks` reports six strings that are intentionally English: the four
`@bringonplane.com` addresses on `about.astro` and `contact.astro`, and
`content="noindex, follow"` on `items/index.astro`.

It also under-reports in two ways, so read the file too when converting a page:
it strips balanced `{…}` expressions, hiding English inside Astro expressions
(inline string arrays, object literals), and its text rule needs two or more
words, so single-word cells slip through.
