import { ui, type UIKey } from './ui';
import {
  defaultLang,
  langCodes,
  localeMeta,
  showDefaultLang,
  type Lang,
} from './config';

const SITE = 'https://bringonplane.com';

/**
 * Routes that exist in English only — the item×airline and item×country
 * combination pages, plus error pages and endpoints. Pages matching these
 * prefixes advertise no hreflang alternates, only a self-reference.
 */
const ENGLISH_ONLY_PATTERNS = [/^\/items\/[^/]+\/(airline|country)\//, /^\/(404|500)\/?$/];

/** Reads the locale out of the first path segment. Falls back to English. */
export function getLangFromUrl(url: URL | string): Lang {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const [, maybeLang] = pathname.split('/');
  if (maybeLang && (langCodes as string[]).includes(maybeLang)) {
    return maybeLang as Lang;
  }
  return defaultLang as Lang;
}

/** Drops a leading locale segment, yielding the shared (English) path shape. */
export function stripLangFromPath(pathname: string): string {
  const [, maybeLang, ...rest] = pathname.split('/');
  if (maybeLang && (langCodes as string[]).includes(maybeLang)) {
    return `/${rest.join('/')}`;
  }
  return pathname || '/';
}

type Params = Record<string, string | number>;

/** Fills `{placeholder}` slots in a dictionary string. */
function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

/**
 * Returns a `t()` bound to `lang`. Missing keys fall back to the English
 * string, so a partially translated locale degrades to English rather than
 * rendering a raw key.
 */
export function useTranslations(lang: Lang) {
  const dict = ui[lang] as Record<string, string>;
  const fallback = ui[defaultLang as Lang] as Record<string, string>;
  return function t(key: UIKey, params?: Params): string {
    const template = dict[key] ?? fallback[key] ?? key;
    return interpolate(template, params);
  };
}

/**
 * Returns a `translatePath()` that prefixes internal links with the active
 * locale. Absolute URLs, mail links and hash-only links pass through untouched.
 */
export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, target: Lang = lang): string {
    if (!path || /^([a-z]+:|\/\/|#)/i.test(path)) return path;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (target === defaultLang && !showDefaultLang) return normalized;
    return `/${target}${normalized === '/' ? '/' : normalized}`;
  };
}

/** True when a shared path is deliberately not translated. */
export function isEnglishOnlyPath(pathname: string): boolean {
  const shared = stripLangFromPath(pathname);
  return ENGLISH_ONLY_PATTERNS.some((re) => re.test(shared));
}

export interface AlternateLink {
  hreflang: string;
  href: string;
}

/**
 * Builds the `<link rel="alternate" hreflang>` set for a page, including the
 * `x-default` pointer at the English URL. Google requires the set to be
 * reciprocal and self-referencing, so the active locale is included too.
 */
export function getAlternateLinks(pathname: string): AlternateLink[] {
  const shared = stripLangFromPath(pathname);
  const withSlash = shared.endsWith('/') || /\.[a-zA-Z0-9]+$/.test(shared) ? shared : `${shared}/`;
  const englishHref = `${SITE}${withSlash}`;

  if (isEnglishOnlyPath(pathname)) {
    return [
      { hreflang: 'en', href: englishHref },
      { hreflang: 'x-default', href: englishHref },
    ];
  }

  const alternates: AlternateLink[] = langCodes.map((lang) => ({
    hreflang: localeMeta[lang].hreflang,
    href:
      lang === defaultLang && !showDefaultLang ? englishHref : `${SITE}/${lang}${withSlash}`,
  }));

  alternates.push({ hreflang: 'x-default', href: englishHref });
  return alternates;
}

/** Canonical URL for a page in a given locale. */
export function getCanonicalUrl(pathname: string, lang: Lang): string {
  const shared = stripLangFromPath(pathname);
  const withSlash = shared.endsWith('/') || /\.[a-zA-Z0-9]+$/.test(shared) ? shared : `${shared}/`;
  return lang === defaultLang && !showDefaultLang
    ? `${SITE}${withSlash}`
    : `${SITE}/${lang}${withSlash}`;
}

/** `og:locale:alternate` values — every locale except the active one. */
export function getOgLocaleAlternates(lang: Lang): string[] {
  return langCodes.filter((l) => l !== lang).map((l) => localeMeta[l].ogLocale);
}

/** Formats an ISO date (`2026-06-30`) for the active locale. */
export function formatDate(iso: string, lang: Lang): string {
  if (!iso) return iso;
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString(localeMeta[lang].dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export { defaultLang, langCodes, languages, localeMeta, showDefaultLang } from './config';
export type { Lang } from './config';
