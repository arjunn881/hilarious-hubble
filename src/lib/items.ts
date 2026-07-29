import type { TSAItem, TSAItemSummary } from '../types/item';
import metadataSummary from '../data/metadata-summary.json';
import fs from 'fs';
import path from 'path';

/**
 * Returns a list of all TSA items metadata summary in the database.
 * This summary represents a lightweight dataset suitable for sitemaps, search indices, and category stats.
 */
export function getAllItems(): TSAItemSummary[] {
  return metadataSummary as TSAItemSummary[];
}

/**
 * Retrieves a detailed TSA item by its slug on-demand from disk.
 * Queries the metadata summary to resolve the correct category subdirectory.
 */
export function getItemBySlug(slug: string): TSAItem | undefined {
  if (!slug) return undefined;
  
  // Find category from the pre-compiled metadata summary
  const summaryItem = metadataSummary.find(item => item.slug === slug);
  if (!summaryItem) return undefined;

  const categorySlug = summaryItem.category.toLowerCase().trim().replace(/\s+/g, '-');
  
  try {
    const filePath = path.resolve(process.cwd(), `src/data/items/${categorySlug}/${slug}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw) as TSAItem;
    }
  } catch (err) {
    console.error(`[items-pipeline] Error loading item slug "${slug}":`, err);
  }
  
  return undefined;
}

/**
 * Searches items by query against name, aliases, keywords, and category.
 * Queries the lightweight metadata summary for peak performance.
 */
export function searchItems(query: string): TSAItemSummary[] {
  if (!query) return [];
  const normalizedQuery = query.toLowerCase().trim();
  
  return getAllItems().filter((item) => {
    return (
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.category.toLowerCase().includes(normalizedQuery) ||
      item.aliases.some((alias) => alias.toLowerCase().includes(normalizedQuery)) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery))
    );
  });
}

/**
 * Gets related items for a given item. 
 * First resolves items explicitly listed in relatedItems.
 * If less than 4 related items are found, fills the remaining slots with items in the same category.
 */
export function getRelatedItems(item: TSAItem): TSAItemSummary[] {
  if (!item) return [];
  
  const allItems = getAllItems();
  const relatedSlugs = new Set(item.relatedItems || []);
  
  // 1. Get explicit relations
  const explicitRelated = allItems.filter((i) => relatedSlugs.has(i.slug) && i.slug !== item.slug);
  
  // 2. Fill from same category if needed
  if (explicitRelated.length < 4) {
    const categoryRelated = allItems.filter(
      (i) => i.category === item.category && i.slug !== item.slug && !relatedSlugs.has(i.slug)
    );
    return [...explicitRelated, ...categoryRelated].slice(0, 4);
  }
  
  return explicitRelated.slice(0, 4);
}
