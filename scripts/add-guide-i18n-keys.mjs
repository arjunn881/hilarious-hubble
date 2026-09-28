import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const UI_DIR = join(__dirname, '../src/i18n/ui');

// New keys to insert after 'guide.quickAnswer' in each language file
const newKeys = {
  en: {
    'guide.title': '{title} | BringOnPlane Travel Guide',
    'guide.description': '{description}',
    'guide.keywords': '{title}, {category} tsa rules, {category} carry on rules, tsa {year}, airport security {category}, bringonplane guide',
    'guide.faq.allowed': 'Is {item} allowed in carry-on?',
    'guide.faq.rules': 'What are the TSA rules for {item}?',
    'guide.faq.international': 'Can I bring {item} on an international flight?',
    'guide.faq.allowedAnswer': 'According to TSA, {item} is allowed in carry-on bags. {reason}',
    'guide.faq.notAllowedAnswer': 'According to TSA, {item} is not allowed in carry-on bags. {reason}',
    'guide.faq.restrictedAnswer': 'According to TSA, {item} has restrictions for carry-on. {reason}',
  },
  es: {
    'guide.title': '{title} | Guía de viaje BringOnPlane',
    'guide.description': '{description}',
    'guide.keywords': '{title}, normas tsa {category}, {category} en equipaje de mano, normas tsa {year}, seguridad aeropuerto {category}, guia bringonplane',
    'guide.faq.allowed': '¿Está permitido {item} en el equipaje de mano?',
    'guide.faq.rules': '¿Cuáles son las normas TSA para {item}?',
    'guide.faq.international': '¿Puedo llevar {item} en un vuelo internacional?',
    'guide.faq.allowedAnswer': 'Según la TSA, {item} está permitido en el equipaje de mano. {reason}',
    'guide.faq.notAllowedAnswer': 'Según la TSA, {item} no está permitido en el equipaje de mano. {reason}',
    'guide.faq.restrictedAnswer': 'Según la TSA, {item} tiene restricciones para el equipaje de mano. {reason}',
  },
  ja: {
    'guide.title': '{title} | BringOnPlane旅行ガイド',
    'guide.description': '{description}',
    'guide.keywords': '{title}, TSA {category}ルール, {category}機内持ち込み, TSA {year}年規則, 空港セキュリティ {category}, BringOnPlaneガイド',
    'guide.faq.allowed': '{item}は機内持ち込み可能ですか？',
    'guide.faq.rules': '{item}のTSAルールは何ですか？',
    'guide.faq.international': '{item}を国際線に持ち込めますか？',
    'guide.faq.allowedAnswer': 'TSAによると、{item}は機内持ち込みが許可されています。{reason}',
    'guide.faq.notAllowedAnswer': 'TSAによると、{item}は機内持ち込みが禁止されています。{reason}',
    'guide.faq.restrictedAnswer': 'TSAによると、{item}の機内持ち込みには制限があります。{reason}',
  },
  fr: {
    'guide.title': '{title} | Guide de voyage BringOnPlane',
    'guide.description': '{description}',
    'guide.keywords': '{title}, règles TSA {category}, {category} bagage cabine, règles TSA {year}, sécurité aéroport {category}, guide bringonplane',
    'guide.faq.allowed': '{item} est-il autorisé en bagage cabine ?',
    'guide.faq.rules': 'Quelles sont les règles TSA pour {item} ?',
    'guide.faq.international': 'Puis-je emporter {item} sur un vol international ?',
    'guide.faq.allowedAnswer': 'Selon la TSA, {item} est autorisé en bagage cabine. {reason}',
    'guide.faq.notAllowedAnswer': 'Selon la TSA, {item} n\'est pas autorisé en bagage cabine. {reason}',
    'guide.faq.restrictedAnswer': 'Selon la TSA, {item} est soumis à des restrictions en bagage cabine. {reason}',
  },
  de: {
    'guide.title': '{title} | BringOnPlane Reiseführer',
    'guide.description': '{description}',
    'guide.keywords': '{title}, TSA {category} regeln, {category} handgepäck, TSA {year} regeln, flughafen sicherheit {category}, bringonplane ratgeber',
    'guide.faq.allowed': 'Ist {item} im Handgepäck erlaubt?',
    'guide.faq.rules': 'Was sind die TSA-Regeln für {item}?',
    'guide.faq.international': 'Kann ich {item} auf einem internationalen Flug mitnehmen?',
    'guide.faq.allowedAnswer': 'Laut TSA ist {item} im Handgepäck erlaubt. {reason}',
    'guide.faq.notAllowedAnswer': 'Laut TSA ist {item} im Handgepäck nicht erlaubt. {reason}',
    'guide.faq.restrictedAnswer': 'Laut TSA gilt für {item} im Handgepäck eine Einschränkung. {reason}',
  },
  pt: {
    'guide.title': '{title} | Guia de viagem BringOnPlane',
    'guide.description': '{description}',
    'guide.keywords': '{title}, regras TSA {category}, {category} bagagem de mão, regras TSA {year}, segurança aeroporto {category}, guia bringonplane',
    'guide.faq.allowed': '{item} é permitido na bagagem de mão?',
    'guide.faq.rules': 'Quais são as regras da TSA para {item}?',
    'guide.faq.international': 'Posso levar {item} num voo internacional?',
    'guide.faq.allowedAnswer': 'Segundo a TSA, {item} é permitido na bagagem de mão. {reason}',
    'guide.faq.notAllowedAnswer': 'Segundo a TSA, {item} não é permitido na bagagem de mão. {reason}',
    'guide.faq.restrictedAnswer': 'Segundo a TSA, {item} tem restrições na bagagem de mão. {reason}',
  },
  ko: {
    'guide.title': '{title} | BringOnPlane 여행 가이드',
    'guide.description': '{description}',
    'guide.keywords': '{title}, TSA {category} 규정, {category} 기내 반입, TSA {year} 규칙, 공항 보안 {category}, BringOnPlane 가이드',
    'guide.faq.allowed': '{item}을(를) 기내에 반입할 수 있나요?',
    'guide.faq.rules': '{item}에 대한 TSA 규정은 무엇인가요?',
    'guide.faq.international': '{item}을(를) 국제선에 가지고 탈 수 있나요?',
    'guide.faq.allowedAnswer': 'TSA에 따르면 {item}은(는) 기내 반입이 허용됩니다. {reason}',
    'guide.faq.notAllowedAnswer': 'TSA에 따르면 {item}은(는) 기내 반입이 금지됩니다. {reason}',
    'guide.faq.restrictedAnswer': 'TSA에 따르면 {item}은(는) 기내 반입에 제한이 있습니다. {reason}',
  },
  it: {
    'guide.title': '{title} | Guida di viaggio BringOnPlane',
    'guide.description': '{description}',
    'guide.keywords': '{title}, regole TSA {category}, {category} bagaglio a mano, regole TSA {year}, sicurezza aeroporto {category}, guida bringonplane',
    'guide.faq.allowed': '{item} è consentito nel bagaglio a mano?',
    'guide.faq.rules': 'Quali sono le regole TSA per {item}?',
    'guide.faq.international': 'Posso portare {item} su un volo internazionale?',
    'guide.faq.allowedAnswer': 'Secondo la TSA, {item} è consentito nel bagaglio a mano. {reason}',
    'guide.faq.notAllowedAnswer': 'Secondo la TSA, {item} non è consentito nel bagaglio a mano. {reason}',
    'guide.faq.restrictedAnswer': 'Secondo la TSA, {item} è soggetto a restrizioni nel bagaglio a mano. {reason}',
  },
};

const langs = Object.keys(newKeys);

for (const lang of langs) {
  const filePath = join(UI_DIR, `${lang}.ts`);
  let content = readFileSync(filePath, 'utf8');

  // Check if already has guide.title to avoid double-adding
  if (content.includes("'guide.title'")) {
    console.log(`SKIP ${lang}.ts — guide.title already exists`);
    continue;
  }

  // Find insertion point: after 'guide.quickAnswer'
  const anchor = "'guide.quickAnswer'";
  const anchorIdx = content.indexOf(anchor);
  if (anchorIdx === -1) {
    console.log(`WARN: could not find anchor in ${lang}.ts`);
    continue;
  }

  // Find end of that line
  const lineEnd = content.indexOf('\n', anchorIdx);
  
  // Build insertion block
  const entries = Object.entries(newKeys[lang])
    .map(([k, v]) => `  '${k}': '${v}',`)
    .join('\n');
  const block = '\n' + entries;

  content = content.slice(0, lineEnd + 1) + block + content.slice(lineEnd + 1);
  writeFileSync(filePath, content, 'utf8');
  console.log(`DONE ${lang}.ts — added ${Object.keys(newKeys[lang]).length} guide keys`);
}