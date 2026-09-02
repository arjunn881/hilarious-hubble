/**
 * Localized category labels.
 *
 * Item data stores categories as English display names ("Personal Care"), while
 * routes and the UI dictionary key them by slug (`cat.personal-care`). These
 * helpers bridge the two so a category renders natively in every locale while
 * URLs stay stable — the slug is part of the canonical path and must not change
 * per language.
 */
import type { UIKey } from './ui';
import { useTranslations, type Lang } from './utils';

/** "Personal Care" → "personal-care". Idempotent for values already slugged. */
export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Native label for a category, accepting either a display name or a slug.
 * Unknown categories fall through to the value supplied by the caller.
 */
export function getCategoryName(category: string, lang: Lang): string {
  if (!category) return category;
  const slug = categorySlug(category);
  const t = useTranslations(lang);
  const key = `cat.${slug}` as UIKey;
  const translated = t(key);
  // `t()` echoes the key back when nothing matches in any locale.
  return translated === key ? category : translated;
}

/** Maps a list of `{ name, slug }` categories into the active locale. */
export function localizeCategories<T extends { name: string; slug: string }>(
  categories: readonly T[],
  lang: Lang,
): Array<T & { name: string }> {
  return categories.map((category) => ({
    ...category,
    name: getCategoryName(category.slug, lang),
  }));
}
