export type RuleStatus = 'ALLOWED' | 'NOT_ALLOWED' | 'RESTRICTED' | 'UNKNOWN';

export interface BaggageRule {
  status: RuleStatus;
  reason: string;
  conditions: string[];
  exceptions: string[];
}

export interface Source {
  name: string;
  url: string;
  verified: string;
  priority: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Lightweight index metadata schema for listings, search, sitemaps, category stats
export interface TSAItemSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  aliases: string[];
  keywords: string[];
  carryOn: RuleStatus;
  checked: RuleStatus;
  lastReviewed: string;
}

// Full regulation schema for detailed item views
export interface TSAItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  aliases: string[];
  keywords: string[];
  description: string;

  carryOn: BaggageRule;
  checkedBag: BaggageRule;

  tsa?: {
    officialUrl: string;
    lastVerified: string;
    pageTitle: string;
  };
  faa?: {
    officialUrl: string;
    applicable: boolean;
  };

  sources: Source[];
  airlines: {
    name: string;
    status: RuleStatus;
    notes: string;
  }[];
  international: Record<string, {
    status: RuleStatus;
    reason: string;
  }>;

  travelTips: string[];
  relatedItems: string[];
  faq: FAQItem[];
  
  ruleHistory: {
    effectiveDate: string;
    change: string;
    source: string;
  }[];

  metadata: {
    lastReviewed: string;
    nextReviewDue: string;
    reviewIntervalMonths?: number;
    editor: string;
    version: string;
  };
}
