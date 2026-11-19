import type { RegionCode, PageContext, AffiliateOffer } from "../components/monetization/AffiliateConfig";
import { AFFILIATE_MATRIX } from "../components/monetization/AffiliateConfig";

// Country code → RegionCode mapping
const ASIA_CODES = new Set(["KR","JP","SG","HK","MY","TW","TH","VN","PH","ID"]);
const NA_CODES = new Set(["US","CA"]);
const EU_CODES = new Set(["GB","DE","IT","FR","ES","NL","CH","AT","IE","SE","PL","PT","BE","FI","DK","NO"]);

export function detectRegion(countryCode?: string, locale?: string): RegionCode {
  if (countryCode) {
    const cc = countryCode.toUpperCase();
    if (ASIA_CODES.has(cc)) return "ASIA";
    if (NA_CODES.has(cc)) return "NA";
    if (EU_CODES.has(cc)) return "EU";
    return "GLOBAL";
  }
  // locale fallback e.g. "ko", "ja", "de", "fr", "es", "pt"
  if (locale) {
    const l = locale.toLowerCase().slice(0, 2);
    if (["ko","ja","zh","th","vi","ms","id","tl"].includes(l)) return "ASIA";
    if (["de","fr","it","es","nl","pt","pl","sv","fi","da","no"].includes(l)) return "EU";
  }
  return "GLOBAL";
}

export function buildAffiliateUrl(
  baseUrl: string,
  meta: { slug: string; slot: "pill" | "inline_verdict" | "search_widget" | "footer_card"; region: RegionCode }
): string {
  const sanitizedSlug = meta.slug.replace(/[^a-z0-9-]/gi, "-").slice(0, 30);
  const subId = `${meta.region}_${sanitizedSlug}_${meta.slot}`.slice(0, 64);
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}sub_id=${encodeURIComponent(subId)}`;
}

export function getOffersForContext(context: PageContext, region: RegionCode, limit = 3): AffiliateOffer[] {
  return AFFILIATE_MATRIX
    .filter(o => o.contexts.includes(context) && (o.regions.includes(region) || o.regions.includes("GLOBAL")))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);
}
