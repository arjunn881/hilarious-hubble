/**
 * Per-locale client search index.
 *
 * The English index is emitted to `public/search-index.json` by
 * `scripts/build-search-index.js`. This endpoint produces the translated
 * siblings (`/search-index-es.json`, `/search-index-ja.json`, …) with native
 * item names and category labels, so the search modal ranks and displays
 * results in the reader's language. English aliases are kept in every locale —
 * they are what a bilingual traveller is likely to type.
 */
import type { APIRoute } from 'astro';
import metadata from '../data/metadata-summary.json';
import { prefixedLangs, type Lang } from '../i18n/config';
import { categorySlug, getCategoryName } from '../i18n/categories';
import { getItemName } from '../i18n/items';

interface MetadataEntry {
  id: string;
  slug: string;
  name: string;
  category: string;
  aliases?: string[];
  keywords?: string[];
  carryOn: string;
  checked: string;
  lastReviewed?: string;
}

const entries = metadata as unknown as MetadataEntry[];

export function getStaticPaths() {
  return prefixedLangs.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = ({ params }) => {
  const lang = params.lang as Lang;

  const index = entries.map((entry) => {
    const localName = getItemName(entry.slug, entry.name, lang);
    const aliases = new Set([...(entry.aliases ?? []), entry.name]);
    aliases.delete(localName);

    return {
      id: entry.id,
      slug: entry.slug,
      name: localName,
      category: getCategoryName(entry.category, lang),
      /** Language-independent key, used for the result-row category icon. */
      categorySlug: categorySlug(entry.category),
      aliases: [...aliases],
      keywords: entry.keywords ?? [],
      carryOn: entry.carryOn,
      checked: entry.checked,
    };
  });

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
