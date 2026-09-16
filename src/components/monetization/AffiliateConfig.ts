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

// ─── § 1. Tracking IDs ───────────────────────────────────────────────────────

/** Amazon Associates tag (used on amazon.in by default). */
export const AMAZON_TAG = "arjunanayak-21";

/** Amazon store domain.  */
export const AMAZON_DOMAIN = "amazon.in";

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
