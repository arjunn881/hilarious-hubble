/**
 * Localized item names.
 *
 * Item names are the highest-value keyword surface on the site: they land in
 * `<title>`, `<h1>`, breadcrumbs, search results and JSON-LD. Each locale file
 * maps an item slug to its native name; any slug missing from a locale falls
 * back to the English name from `metadata-summary.json`.
 *
 * Regulatory prose (`carryOn.reason`, `conditions`, `travelTips`, FAQ answers)
 * is *not* here — that lives in the data-translation overlay and stays English
 * until translated.
 */
import type { Lang } from '../config';
import { es } from './es';
import { ja } from './ja';
import { fr } from './fr';
import { de } from './de';
import { pt } from './pt';
import { ko } from './ko';
import { it } from './it';

/** Item slug → native item name. Sparse: missing slugs fall back to English. */
export type ItemNames = Readonly<Record<string, string>>;

/** No `en` entry — English names come straight from the item data. */
export const itemNames: Partial<Record<Lang, ItemNames>> = { es, ja, fr, de, pt, ko, it };

/**
 * Native name for `slug`, falling back to `english` when the locale has no
 * translation for it (or when `lang` is English).
 */
export function getItemName(slug: string, english: string, lang: Lang): string {
  if (lang === 'en') return english;
  return itemNames[lang]?.[slug] ?? english;
}

/** True when `lang` has a native name for `slug`. Used by the i18n audit. */
export function hasItemName(slug: string, lang: Lang): boolean {
  return lang === 'en' || Boolean(itemNames[lang]?.[slug]);
}
