import { getAllItems } from "./items";

export const CATEGORIES = [
  { name: "Electronics", slug: "electronics" },
  { name: "Liquids", slug: "liquids" },
  { name: "Food", slug: "food" },
  { name: "Medicine", slug: "medicine" },
  { name: "Baby", slug: "baby" },
  { name: "Tools", slug: "tools" },
  { name: "Sports", slug: "sports" },
  { name: "Personal Care", slug: "personal-care" },
  { name: "Jewelry", slug: "jewelry" },
  { name: "Documents", slug: "documents" },
  { name: "Weapons", slug: "weapons" },
  { name: "Flammables", slug: "flammables" },
  { name: "Household", slug: "household" }
];

export const POPULAR_AIRLINES = [
  { slug: "delta", name: "Delta Air Lines" },
  { slug: "united", name: "United Airlines" },
  { slug: "american", name: "American Airlines" },
  { slug: "lufthansa", name: "Lufthansa" },
  { slug: "air-france", name: "Air France" },
  { slug: "british-airways", name: "British Airways" },
  { slug: "ryanair", name: "Ryanair" },
  { slug: "emirates", name: "Emirates" },
  { slug: "singapore-airlines", name: "Singapore Airlines" }
];

export const GUIDES = [
  { slug: "tsa-liquids-rule-explained", title: "TSA 3-1-1 Liquids Rule Explained" },
  { slug: "flying-with-medication", title: "Flying with Medication" },
  { slug: "lithium-battery-rules", title: "Lithium Battery Safety Rules" },
  { slug: "traveling-with-baby-formula", title: "Traveling with Baby Formula" },
  { slug: "tsa-food-rules", title: "TSA Food Rules Guide" }
];

export function getRelatedCategories(currentCategorySlug?: string, limit: number = 4) {
  const others = CATEGORIES.filter(c => c.slug !== currentCategorySlug);
  // Pseudo-random deterministic rotation based on string length or just return top
  const seed = currentCategorySlug ? currentCategorySlug.length % others.length : 0;
  return [...others.slice(seed), ...others.slice(0, seed)].slice(0, limit);
}

export function getAirlineCombinationsForItem(itemSlug: string, limit: number = 5) {
  // Rotate airlines based on itemSlug length for variety
  const seed = itemSlug.length % POPULAR_AIRLINES.length;
  const rotated = [...POPULAR_AIRLINES.slice(seed), ...POPULAR_AIRLINES.slice(0, seed)];
  return rotated.slice(0, limit).map(a => ({
    title: `Can I bring on ${a.name}?`,
    url: `/items/${itemSlug}/airline/${a.slug}`
  }));
}

export function getPopularGuides(limit: number = 4) {
  return GUIDES.slice(0, limit).map(g => ({
    title: g.title,
    url: `/guide/${g.slug}`
  }));
}

export function getRelatedItemsWidget(itemSlug: string, category: string, limit: number = 4) {
  const allItems = getAllItems();
  const sameCategory = allItems.filter(i => i.category === category && i.slug !== itemSlug);
  return sameCategory.slice(0, limit).map(i => ({
    title: i.name,
    url: `/items/${i.slug}`
  }));
}
