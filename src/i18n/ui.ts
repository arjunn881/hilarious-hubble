/**
 * Aggregated UI dictionaries.
 *
 * English (`en`) is canonical: its key set defines `UIKey`, and every other
 * locale is typed as a *partial* mirror of it. That is deliberate — a locale
 * may omit keys, and `useTranslations` falls back to the English string, so an
 * incomplete translation renders English rather than a raw key.
 */
import { en } from './ui/en';
import { es } from './ui/es';
import { ja } from './ui/ja';
import { fr } from './ui/fr';
import { de } from './ui/de';
import { pt } from './ui/pt';
import { ko } from './ui/ko';
import { it } from './ui/it';
import type { Lang } from './config';

export type UIKey = keyof typeof en;

/** A translation file: any subset of the English keys. */
export type UIDict = Partial<Record<UIKey, string>>;

export const ui: Record<Lang, UIDict> = { en, es, ja, fr, de, pt, ko, it };

/** Keys present in English but missing from `lang` — used by the i18n audit. */
export function missingKeys(lang: Lang): UIKey[] {
  const dict = ui[lang];
  return (Object.keys(en) as UIKey[]).filter((k) => !(k in dict));
}
