import type { Lang } from './config';

/**
 * Destination names for the countries hub. Country names are the ranking term
 * in queries like "aduanas Japón" or "日本 税関", so they get translated even
 * though the regulatory prose beside them stays English for now.
 *
 * Keyed by the hub's country slug. Airline names are deliberately absent —
 * those are brands and stay in their registered form everywhere.
 */
type CountryNames = Record<string, string>;

const countryNames: Partial<Record<Lang, CountryNames>> = {
  es: {
    singapore: 'Singapur',
    uk: 'Reino Unido',
    france: 'Francia',
    australia: 'Australia',
    japan: 'Japón',
    usa: 'Estados Unidos',
    canada: 'Canadá',
    germany: 'Alemania',
  },
  ja: {
    singapore: 'シンガポール',
    uk: 'イギリス',
    france: 'フランス',
    australia: 'オーストラリア',
    japan: '日本',
    usa: 'アメリカ',
    canada: 'カナダ',
    germany: 'ドイツ',
  },
  fr: {
    singapore: 'Singapour',
    uk: 'Royaume-Uni',
    france: 'France',
    australia: 'Australie',
    japan: 'Japon',
    usa: 'États-Unis',
    canada: 'Canada',
    germany: 'Allemagne',
  },
  de: {
    singapore: 'Singapur',
    uk: 'Vereinigtes Königreich',
    france: 'Frankreich',
    australia: 'Australien',
    japan: 'Japan',
    usa: 'USA',
    canada: 'Kanada',
    germany: 'Deutschland',
  },
  pt: {
    singapore: 'Singapura',
    uk: 'Reino Unido',
    france: 'França',
    australia: 'Austrália',
    japan: 'Japão',
    usa: 'Estados Unidos',
    canada: 'Canadá',
    germany: 'Alemanha',
  },
  ko: {
    singapore: '싱가포르',
    uk: '영국',
    france: '프랑스',
    australia: '호주',
    japan: '일본',
    usa: '미국',
    canada: '캐나다',
    germany: '독일',
  },
  it: {
    singapore: 'Singapore',
    uk: 'Regno Unito',
    france: 'Francia',
    australia: 'Australia',
    japan: 'Giappone',
    usa: 'Stati Uniti',
    canada: 'Canada',
    germany: 'Germania',
  },
};

/** Native country name, falling back to the English source string. */
export function getCountryName(slug: string, english: string, lang: Lang): string {
  if (lang === 'en') return english;
  return countryNames[lang]?.[slug] ?? english;
}
