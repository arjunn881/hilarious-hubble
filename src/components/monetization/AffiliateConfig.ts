/**
 * AffiliateConfig.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central configuration for the BringOnPlane monetization layer.
 *
 * HOW TO UPDATE:
 *   • Swap tracking IDs only here — no page or component files need touching.
 *   • Add new keyword triggers to KEYWORD_CTAs.
 *   • Add new airline slug → luggage brand mappings to AIRLINE_LUGGAGE_MAP.
 *
 * INVARIANT: This file contains ZERO runtime logic. It is pure static config
 * read at build time by the three monetization Astro components.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── § 0. New typed affiliate matrix ─────────────────────────────────────────

export type RegionCode = "ASIA" | "NA" | "EU" | "GLOBAL";
export type PageContext = "ITEM_ALLOWED" | "ITEM_RESTRICTED" | "GUIDE_DEST" | "AIRLINE" | "CHECKLIST";

export interface AffiliateOffer {
  id: string;
  name: string;
  category: "FLIGHTS" | "ESIM" | "INSURANCE" | "STORAGE" | "TRANSFERS" | "ACTIVITIES" | "COMPENSATION";
  baseUrl: string;
  ctaLabel: string;
  pitch: string;
  regions: RegionCode[];
  contexts: PageContext[];
  priority: number;
}

export const KIWI_AFFILIATE_LINKS = {
  // Country / Market Specific
  US: "https://kiwi.tpk.lu/PRoNbR8A",
  GB: "https://kiwi.tpk.lu/zdAwHpk4",
  UK: "https://kiwi.tpk.lu/zdAwHpk4",
  IN: "https://kiwi.tpk.lu/suZfzffW",
  CZ: "https://kiwi.tpk.lu/4JJAeyYQ",
  FI: "https://kiwi.tpk.lu/j9t7bFL8",
  IT: "https://kiwi.tpk.lu/3cbh2gXF",
  DK: "https://kiwi.tpk.lu/k5RXUFYd",
  DA: "https://kiwi.tpk.lu/k5RXUFYd",
  DE: "https://kiwi.tpk.lu/FNBUJmy6",
  NL: "https://kiwi.tpk.lu/U42dntOs",
  PL: "https://kiwi.tpk.lu/bIz4CwgC",
  BR: "https://kiwi.tpk.lu/xF6eey3B",
  ES: "https://kiwi.tpk.lu/tBWe6mTP",
  FR: "https://kiwi.tpk.lu/47KJwXAa",
  // Route & Intent Specific
  countryToCountry: "https://kiwi.tpk.lu/7m9bs2Ap",
  lastMinute: "https://kiwi.tpk.lu/JFMOmSVL",
  // Default Global Fallback (US EN)
  default: "https://kiwi.tpk.lu/PRoNbR8A",
} as const;

export const TRAVELPAYOUTS_CONFIG = {
  marker: "778331.BringonPlane",
  trs: "574616",
  campaignId: "111",
  promoId: "3414",
  scriptBase: "https://tpwdg.com/content",
} as const;

export const AFFILIATE_MATRIX: AffiliateOffer[] = [
  {
    id: "trip_flights",
    name: "Trip.com",
    category: "FLIGHTS",
    baseUrl: "https://tp.media/r?marker=778331.BringonPlane&trs=574616&p=5543&u=https%3A%2F%2Fwww.trip.com%2F",
    ctaLabel: "Search flights on Trip.com →",
    pitch: "Compare cheap flights across 800+ airlines with live prices.",
    regions: ["ASIA"],
    contexts: ["ITEM_ALLOWED", "GUIDE_DEST", "AIRLINE", "CHECKLIST"],
    priority: 1,
  },
  {
    id: "kiwi_flights",
    name: "Kiwi.com",
    category: "FLIGHTS",
    baseUrl: KIWI_AFFILIATE_LINKS.default,
    ctaLabel: "Find cheapest flights →",
    pitch: "Kiwi's unique combination search finds the cheapest fares across airlines.",
    regions: ["EU", "NA", "GLOBAL"],
    contexts: ["ITEM_ALLOWED", "GUIDE_DEST", "AIRLINE", "CHECKLIST"],
    priority: 1,
  },
  {
    id: "yesim",
    name: "Yesim",
    category: "ESIM",
    baseUrl: "https://yesim.tpk.lu/nSZQQkYX",
    ctaLabel: "Get a travel eSIM →",
    pitch: "Instant eSIM mobile data in 160+ countries — activate before you fly.",
    regions: ["ASIA", "NA", "EU", "GLOBAL"],
    contexts: ["ITEM_ALLOWED", "GUIDE_DEST", "CHECKLIST"],
    priority: 2,
  },
  {
    id: "klook",
    name: "Klook",
    category: "ACTIVITIES",
    baseUrl: "https://klook.tpk.lu/sp5LYIRr",
    ctaLabel: "Book airport trains & passes →",
    pitch: "Discounted airport express train passes, tickets, and travel experiences worldwide.",
    regions: ["ASIA", "EU", "NA", "GLOBAL"],
    contexts: ["GUIDE_DEST", "CHECKLIST"],
    priority: 2,
  },
  {
    id: "radical_storage",
    name: "Radical Storage",
    category: "STORAGE",
    baseUrl: "https://radicalstorage.tpk.lu/7bh3hKRs",
    ctaLabel: "Store luggage near the airport →",
    pitch: "Secure luggage storage near airports and train stations in 500+ cities.",
    regions: ["EU", "NA", "ASIA", "GLOBAL"],
    contexts: ["ITEM_RESTRICTED", "AIRLINE"],
    priority: 1,
  },
  {
    id: "airhelp",
    name: "AirHelp",
    category: "COMPENSATION",
    baseUrl: "https://airhelp.tpk.lu/MotuJQgD",
    ctaLabel: "Check flight compensation →",
    pitch: "Check if the airline owes you up to $650 / €600 for delayed or cancelled flights.",
    regions: ["EU", "NA", "GLOBAL"],
    contexts: ["AIRLINE"],
    priority: 1,
  },
  {
    id: "klook_insurance",
    name: "Klook Travel Insurance",
    category: "INSURANCE",
    baseUrl: "https://klook.tpk.lu/sp5LYIRr",
    ctaLabel: "Get travel insurance →",
    pitch: "Comprehensive travel medical & trip protection — instant policy for international travellers.",
    regions: ["EU", "ASIA", "NA", "GLOBAL"],
    contexts: ["GUIDE_DEST", "CHECKLIST"],
    priority: 3,
  },
  {
    id: "kiwitaxi",
    name: "Kiwitaxi",
    category: "TRANSFERS",
    baseUrl: "https://kiwitaxi.tpk.lu/lTXByX4t",
    ctaLabel: "Pre-book airport transfer →",
    pitch: "Pre-book a private airport taxi or shuttle with meet-and-greet in 100+ countries.",
    regions: ["EU", "ASIA", "NA", "GLOBAL"],
    contexts: ["CHECKLIST", "GUIDE_DEST"],
    priority: 3,
  },
];

// ─── § 1. Tracking IDs ───────────────────────────────────────────────────────

/** Amazon Associates tag for USA & international visitors (amazon.com) */
export const AMAZON_TAG_US = "bringonplane-20";
export const AMAZON_DOMAIN_US = "amazon.com";

/** Amazon Associates tag for Indian visitors (amazon.in) */
export const AMAZON_TAG_IN = "arjunanayak-21";
export const AMAZON_DOMAIN_IN = "amazon.in";

/** Default Amazon store domain and tag (USA & international visitors). */
export const AMAZON_TAG = AMAZON_TAG_US;
export const AMAZON_DOMAIN = AMAZON_DOMAIN_US;

/**
 * ShareASale / Impact publisher IDs — kept here for future use.
 * These are not yet active; wire them up when you have an approved account.
 */
export const PARTNER_IDS = {
  /** Airalo eSIM — affiliate network: Impact */
  airalo: "AIRALO_IMPACT_ID",
  /** Holafly eSIM — direct referral */
  holafly: "HOLAFLY_REF_CODE",
  /** World Nomads travel insurance — ShareASale */
  worldNomads: "WORLD_NOMADS_SHAREASALE_ID",
  /** Allianz travel insurance — direct / CJ */
  allianz: "ALLIANZ_CJ_ID",
} as const;

// ─── § 2. Keyword → CTA Dictionary (Module A) ────────────────────────────────

/**
 * Each entry maps a set of match terms to a CTA that `TsaGearSuggester` renders.
 *
 * Priority: first match wins.
 *   - `matchTerms` are checked (case-insensitive) against the item name,
 *     category, and keywords array.
 *   - `amazonSearch` is the search query forwarded to Amazon.
 */
export interface KeywordCta {
  /** Substrings that trigger this CTA (lowercased, checked against item signals). */
  matchTerms: string[];
  /** Emoji + short button label shown to the user. */
  label: string;
  /** Amazon search query — avoids 404s, always shows live stock. */
  amazonSearch: string;
  /** One-line reason shown as tooltip / sub-text. */
  why: string;
  /** Optional badge label. */
  badge?: string;
}

export const KEYWORD_CTAs: KeywordCta[] = [
  // ── Liquids / Gels / Creams ──────────────────────────────────────────────
  {
    matchTerms: [
      "liquid", "gel", "cream", "lotion", "serum", "shampoo", "conditioner",
      "soap", "toothpaste", "sunscreen", "moisturizer", "toner", "perfume",
      "cologne", "fragrance", "mouthwash", "sanitizer", "spray",
    ],
    label: "🛒 Buy TSA-Approved Travel Bottle Kits on Amazon",
    amazonSearch: "tsa approved travel bottles set leak proof silicone 3.4 oz 100ml",
    why: "Transfers your product into a cabin-safe 100 ml bottle that clears the TSA 3-1-1 rule every time.",
    badge: "TSA Essential",
  },
  // ── Overweight / Luggage / Heavy items ──────────────────────────────────
  {
    matchTerms: [
      "overweight", "heavy", "luggage", "suitcase", "baggage", "bag",
      "duffel", "duffle", "backpack", "trolley", "scale",
    ],
    label: "🛒 Get a Digital Luggage Scale on Amazon to Avoid Fees",
    amazonSearch: "portable digital luggage scale travel weight accurate 50kg",
    why: "Weigh your bag before the airport and avoid surprise overweight fees at the check-in counter.",
    badge: "Must-Have",
  },
  // ── Electronics / Gadgets / Lithium batteries ───────────────────────────
  {
    matchTerms: [
      "power bank", "charger", "laptop", "tablet", "camera", "drone",
      "battery", "electronic", "gadget", "cable", "adapter",
    ],
    label: "🛒 Shop Airline-Safe Power Banks on Amazon",
    amazonSearch: "airline approved power bank portable charger carry on under 100wh",
    why: "FAA-compliant power banks (under 100Wh) must travel in carry-on — find safe, certified options.",
    badge: "Airline Safe",
  },
  // ── Sharp / Tools ────────────────────────────────────────────────────────
  {
    matchTerms: ["knife", "scissors", "razor", "blade", "tool", "sharp"],
    label: "🛒 Shop TSA-Compliant Travel Tool Sets on Amazon",
    amazonSearch: "tsa compliant travel multi-tool keychain safety kit",
    why: "Keep tools that comply with TSA blade-length rules — skip the checkpoint confiscation.",
    badge: "Travel Safe",
  },
  // ── Medicine / Health ────────────────────────────────────────────────────
  {
    matchTerms: ["medicine", "medication", "pill", "tablet", "prescription", "health", "first aid"],
    label: "🛒 Shop Compact Travel Pill Organizers on Amazon",
    amazonSearch: "travel pill organizer moisture proof compact case 7 day",
    why: "Keep prescriptions organised, dry, and accessible at security checkpoints.",
    badge: "Travel Pick",
  },
];

// ─── § 3. Airline Slug → Luggage Brand Map (Module B) ────────────────────────

export interface LuggageBrand {
  /** Brand name shown in the CTA. */
  name: string;
  /** Affiliate search term forwarded to Amazon. */
  amazonSearch: string;
  /** One-line pitch. */
  pitch: string;
}

/**
 * Maps an airline slug to a curated carry-on brand recommendation.
 * Brands are chosen to match each airline's exact size restrictions.
 * Add slugs as needed; unmapped airlines fall back to LUGGAGE_FALLBACK.
 */
export const AIRLINE_LUGGAGE_MAP: Record<string, LuggageBrand> = {
  // Samsonite for size-strict European carriers
  "ryanair": {
    name: "Samsonite",
    amazonSearch: "samsonite ryanair cabin bag 40x20x25 underseat",
    pitch: "Guaranteed to fit Ryanair's 40×20×25 cm under-seat personal item slot.",
  },
  "lufthansa": {
    name: "Samsonite",
    amazonSearch: "samsonite cabin luggage 55x40x23 carry on trolley",
    pitch: "Fits Lufthansa's 55×40×23 cm overhead cabin allowance without hassle.",
  },
  "air-france": {
    name: "Samsonite",
    amazonSearch: "samsonite spinner carry on 55cm cabin bag lightweight",
    pitch: "Meets Air France's 55×35×25 cm carry-on dimension limit exactly.",
  },
  "british-airways": {
    name: "Samsonite",
    amazonSearch: "samsonite 55cm carry on spinner cabin approved british airways",
    pitch: "British Airways allows a generous 56×45×25 cm — maximise every centimetre.",
  },

  // Matein for Asian budget and mid-range carriers
  "singapore-airlines": {
    name: "Matein",
    amazonSearch: "matein travel laptop backpack cabin carry on personal item singapore airlines",
    pitch: "Slim, TSA-friendly backpack that fits Singapore Airlines' under-seat slot and 7 kg limit.",
  },
  "emirates": {
    name: "Matein",
    amazonSearch: "matein 40L travel backpack cabin carry on emirates 55x38x20",
    pitch: "Maximises Emirates' Economy 7 kg cabin allowance with a flight-ready organisational layout.",
  },

  // Nomatic for US domestic travellers
  "united-airlines": {
    name: "Nomatic",
    amazonSearch: "nomatic carry on travel bag 22x14x9 united airlines approved",
    pitch: "Engineered for US domestic overhead bins — fits United's 22×14×9 in limit.",
  },
  "delta-air-lines": {
    name: "Nomatic",
    amazonSearch: "nomatic travel bag carry on 22 inch delta airlines overhead",
    pitch: "Nomatic's modular carry-on nails Delta's 22×14×9 in cabin allowance.",
  },
  "american-airlines": {
    name: "Nomatic",
    amazonSearch: "nomatic 30l travel bag american airlines carry on 22x14x9",
    pitch: "Built for American Airlines overhead bins — packed with smart organisational pockets.",
  },
};

/** Shown when an airline slug isn't in AIRLINE_LUGGAGE_MAP. */
export const LUGGAGE_FALLBACK: LuggageBrand = {
  name: "top-rated carry-on luggage",
  amazonSearch: "best carry on luggage spinner airline approved lightweight",
  pitch: "Find a carry-on guaranteed to meet your airline's size and weight requirements.",
};

// ─── § 4. eSIM & Insurance partners (Module C) ───────────────────────────────

export const ESIM_PARTNERS = {
  yesim: {
    name: "Yesim",
    url: "https://yesim.tpk.lu/nSZQQkYX",
    pitch: "Instant eSIM mobile data in 160+ countries — activate before you fly.",
  },
  airalo: {
    name: "Airalo",
    url: "https://www.airalo.com/",
    pitch: "eSIMs for 200+ countries — buy before you fly, activate on arrival.",
  },
  holafly: {
    name: "Holafly",
    url: "https://esim.holafly.com/",
    pitch: "Unlimited data eSIMs with 24/7 live support for international travellers.",
  },
} as const;

export const INSURANCE_PARTNERS = {
  klookInsurance: {
    name: "Klook Travel Insurance",
    url: "https://klook.tpk.lu/sp5LYIRr",
    pitch: "Comprehensive travel medical & trip protection — instant policy for international travellers.",
  },
  ekta: {
    name: "Klook Travel Insurance",
    url: "https://klook.tpk.lu/sp5LYIRr",
    pitch: "Comprehensive travel medical & trip protection — instant policy for international travellers.",
  },
  worldNomads: {
    name: "World Nomads",
    url: "https://www.worldnomads.com/",
    pitch: "Adventure & medical cover for travellers in 150+ countries.",
  },
  allianz: {
    name: "Allianz Travel Insurance",
    url: "https://www.allianztravelinsurance.com/",
    pitch: "Comprehensive trip cancellation, medical, and baggage protection.",
  },
} as const;

export const AIRPORT_PARTNERS = {
  airhelp: {
    name: "AirHelp",
    url: "https://airhelp.tpk.lu/MotuJQgD",
    pitch: "Check if the airline owes you up to $650 / €600 for delayed or cancelled flights.",
  },
  radicalStorage: {
    name: "Radical Storage",
    url: "https://radicalstorage.tpk.lu/7bh3hKRs",
    pitch: "Secure luggage storage near airports and train stations in 500+ cities.",
  },
  kiwitaxi: {
    name: "Kiwitaxi",
    url: "https://kiwitaxi.tpk.lu/lTXByX4t",
    pitch: "Pre-book a private airport taxi or shuttle with meet-and-greet in 100+ countries.",
  },
  klook: {
    name: "Klook",
    url: "https://klook.tpk.lu/sp5LYIRr",
    pitch: "Discounted airport express train passes, tickets, and travel experiences worldwide.",
  },
} as const;
