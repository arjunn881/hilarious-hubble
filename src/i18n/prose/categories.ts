/**
 * Translation overlay for the long-form category body.
 *
 * `lib/contentGenerator.ts` builds the eight category blocks from a single
 * English template per block, interpolating the category name (and, for the
 * introduction, the item count). So the localizable unit here is the *template*,
 * not the text: eight templates plus five FAQ pairs cover all 13 categories.
 * That is why this lives in one file rather than one file per locale.
 *
 * Placeholders, matching the `ui/*.ts` convention:
 *   {category}  native category label (already localized by the caller)
 *   {count}     number of items in the category — introduction only
 *
 * Sparse: a locale with no entry, or an entry missing a block, renders the
 * English generator output. There is no `en` entry — English is the generator.
 */
import type { Lang } from '../config';

/** One block of category body copy, before placeholder substitution. */
export interface CategoryProse {
  introduction?: string;
  overview?: string;
  tsaRules?: string;
  exceptions?: string;
  international?: string;
  commonMistakes?: string;
  recommendations?: string;
  faqs?: { question: string; answer: string }[];
}

/** Per-locale templates. Fill a block to have it replace the English one. */
export const categoryProse: Partial<Record<Lang, CategoryProse>> = {
  es: {},
  ja: {},
  fr: {},
  de: {},
  pt: {},
  ko: {},
  it: {},
};

function fill(template: string, category: string, count: number): string {
  return template.replaceAll('{category}', category).replaceAll('{count}', String(count));
}

/**
 * The locale's category copy with placeholders resolved, or `undefined` when
 * this locale has no translated blocks yet.
 *
 * `categoryLabel` should already be the native label from `i18n/categories`.
 */
export function getCategoryProse(
  categoryLabel: string,
  itemsCount: number,
  lang: Lang,
): CategoryProse | undefined {
  if (lang === 'en') return undefined;
  const p = categoryProse[lang];
  if (!p) return undefined;

  const resolved: CategoryProse = {};
  for (const key of [
    'introduction',
    'overview',
    'tsaRules',
    'exceptions',
    'international',
    'commonMistakes',
    'recommendations',
  ] as const) {
    const template = p[key];
    if (template) resolved[key] = fill(template, categoryLabel, itemsCount);
  }
  if (p.faqs?.length) {
    resolved.faqs = p.faqs.map((f) => ({
      question: fill(f.question, categoryLabel, itemsCount),
      answer: fill(f.answer, categoryLabel, itemsCount),
    }));
  }
  return resolved;
}
