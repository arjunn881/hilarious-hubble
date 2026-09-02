/**
 * Locale registry for BringOnPlane.
 *
 * English lives at the site root (`/items/laptop/`); every other locale is
 * served from a path prefix (`/es/items/laptop/`). Adding a language here is
 * the only change required for routing, hreflang and the sitemap to pick it up
 * — page routes read `langParams` from this file inside `getStaticPaths()`.
 */

export const defaultLang = 'en';

/** English is served without a `/en/` prefix. */
export const showDefaultLang = false;

/** Display label for each locale, written in that locale. */
export const languages = {
  en: 'English',
  es: 'Español',
  ja: '日本語',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ko: '한국어',
  it: 'Italiano',
} as const;

export type Lang = keyof typeof languages;

export const langCodes = Object.keys(languages) as Lang[];

/** Locales that carry a URL prefix. */
export const prefixedLangs = langCodes.filter((l) => l !== defaultLang || showDefaultLang);

export interface LocaleMeta {
  /** BCP-47 tag emitted in `<html lang>` and `hreflang`. */
  hreflang: string;
  /** Facebook-style locale for `og:locale`. */
  ogLocale: string;
  /** Writing direction — all eight current locales are left-to-right. */
  dir: 'ltr' | 'rtl';
  /** Value for the legacy `<meta name="language">` tag, in English. */
  metaLanguage: string;
  /** Tag passed to `toLocaleDateString()` for review dates. */
  dateLocale: string;
}

export const localeMeta: Record<Lang, LocaleMeta> = {
  en: { hreflang: 'en', ogLocale: 'en_US', dir: 'ltr', metaLanguage: 'English', dateLocale: 'en-US' },
  es: { hreflang: 'es', ogLocale: 'es_ES', dir: 'ltr', metaLanguage: 'Spanish', dateLocale: 'es-ES' },
  ja: { hreflang: 'ja', ogLocale: 'ja_JP', dir: 'ltr', metaLanguage: 'Japanese', dateLocale: 'ja-JP' },
  fr: { hreflang: 'fr', ogLocale: 'fr_FR', dir: 'ltr', metaLanguage: 'French', dateLocale: 'fr-FR' },
  de: { hreflang: 'de', ogLocale: 'de_DE', dir: 'ltr', metaLanguage: 'German', dateLocale: 'de-DE' },
  pt: { hreflang: 'pt', ogLocale: 'pt_BR', dir: 'ltr', metaLanguage: 'Portuguese', dateLocale: 'pt-BR' },
  ko: { hreflang: 'ko', ogLocale: 'ko_KR', dir: 'ltr', metaLanguage: 'Korean', dateLocale: 'ko-KR' },
  it: { hreflang: 'it', ogLocale: 'it_IT', dir: 'ltr', metaLanguage: 'Italian', dateLocale: 'it-IT' },
};

/**
 * The `[...lang]` rest-parameter values every localised route must emit.
 * `undefined` collapses to the un-prefixed English route.
 */
export const langParams: Array<{ lang: string | undefined }> = langCodes.map((lang) => ({
  lang: lang === defaultLang && !showDefaultLang ? undefined : lang,
}));

/** Resolves a `[...lang]` param back to a concrete locale code. */
export function resolveLang(param?: string | undefined): Lang {
  return param && (langCodes as string[]).includes(param) ? (param as Lang) : (defaultLang as Lang);
}
