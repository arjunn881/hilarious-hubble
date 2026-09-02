/**
 * Data-translation overlay for item regulatory prose.
 *
 * Item *names* live in `../items` — they are the keyword surface and are
 * translated for all 210 items. The prose that explains a rule is different:
 * `carryOn.reason`, `checkedBag.reason`, their `conditions`/`exceptions`,
 * `travelTips` and the long-form blocks from `lib/contentGenerator.ts` are
 * paraphrased from TSA/FAA source text, and a wrong nuance there is a wrong
 * packing decision. So it is translated deliberately, item by item, rather than
 * in bulk.
 *
 * This module is the seam where that translated prose lands. Every locale file
 * is *sparse*: an item with no entry — or an entry that omits a field — renders
 * the English source. That means a locale can be filled one item at a time and
 * no page code has to change again.
 *
 * Two seams, both used by `pages/[...lang]/items/[slug].astro`:
 *
 *   // 1. data fields, swapped in place
 *   const item = localizeItemProse(getItemBySlug(slug)!, lang);
 *
 *   // 2. generated blocks, overridden when a translation exists
 *   const prose = getItemProse(item.slug, lang);
 *   const exceptions = prose?.exceptions ?? getExceptions(item);
 *
 * Because (1) runs first, a generator that has no override still reads any
 * translated `reason`/`conditions` off the item.
 */
import type { Lang } from '../config';
import type { TSAItem } from '../../types/item';
import { es } from './es';
import { ja } from './ja';
import { fr } from './fr';
import { de } from './de';
import { pt } from './pt';
import { ko } from './ko';
import { it } from './it';

/**
 * Translated prose for one item. Every field is optional; an absent field falls
 * back to the English source. Field names are flattened (`carryOnReason` rather
 * than `carryOn.reason`) so a locale entry stays a single shallow object.
 */
export interface ItemProse {
  /** Short lead sentence shown under the item name. */
  description?: string;
  carryOnReason?: string;
  carryOnConditions?: string[];
  carryOnExceptions?: string[];
  checkedReason?: string;
  checkedConditions?: string[];
  checkedExceptions?: string[];
  travelTips?: string[];

  /**
   * Overrides for the long-form blocks that `lib/contentGenerator.ts` composes.
   *
   * That engine is English-grammar-bound — it resolves verb agreement, stems
   * plurals and strips restatements by token overlap against English source
   * text — so it is not localizable in place. Instead a translator supplies the
   * finished block here and the English generator output is used until then.
   * Field names match the generator they replace.
   */
  whatIsThis?: string;
  exceptions?: string;
  international?: string;
  alternatives?: string;
  screening?: string;
  regulatory?: string;
  packingGuide?: string[];
  airlineDifferences?: string;
  faq?: { question: string; answer: string }[];
}

/** Item slug → translated prose. Sparse by design. */
export type ProseOverlay = Readonly<Record<string, ItemProse>>;

/** No `en` entry — English prose is the source text on the item itself. */
export const itemProse: Partial<Record<Lang, ProseOverlay>> = { es, ja, fr, de, pt, ko, it };

/** Translated prose for `slug`, or `undefined` when there is none yet. */
export function getItemProse(slug: string, lang: Lang): ItemProse | undefined {
  if (lang === 'en') return undefined;
  return itemProse[lang]?.[slug];
}

/**
 * Returns `item` with any translated prose swapped in. English — and any locale
 * that has no entry for this slug — gets the original object back untouched, so
 * this costs nothing on the pages that are already correct.
 */
export function localizeItemProse(item: TSAItem, lang: Lang): TSAItem {
  const p = getItemProse(item.slug, lang);
  if (!p) return item;
  return {
    ...item,
    description: p.description ?? item.description,
    carryOn: {
      ...item.carryOn,
      reason: p.carryOnReason ?? item.carryOn.reason,
      conditions: p.carryOnConditions ?? item.carryOn.conditions,
      exceptions: p.carryOnExceptions ?? item.carryOn.exceptions,
    },
    checkedBag: {
      ...item.checkedBag,
      reason: p.checkedReason ?? item.checkedBag.reason,
      conditions: p.checkedConditions ?? item.checkedBag.conditions,
      exceptions: p.checkedExceptions ?? item.checkedBag.exceptions,
    },
    travelTips: p.travelTips ?? item.travelTips,
  };
}

/** Slugs with prose in `lang`. Used by the i18n audit to report coverage. */
export function proseCoverage(lang: Lang): string[] {
  return Object.keys(itemProse[lang] ?? {});
}

export { categoryProse, getCategoryProse } from './categories';
export type { CategoryProse } from './categories';
