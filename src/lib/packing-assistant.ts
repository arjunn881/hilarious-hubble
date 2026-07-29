import type { TSAItem, RuleStatus } from '../types/item';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  airline: string;
  tripType: 'business' | 'vacation' | 'international' | 'domestic' | 'weekend';
  lists: PackingList[];
  notes: string;
}

export interface PackingList {
  id: string;
  name: string;
  isCustom: boolean;
  items: PackedItem[];
}

export interface PackedItem {
  id: string; // matches item slug or custom id
  name: string;
  category: string;
  carryOnStatus: RuleStatus;
  checkedStatus: RuleStatus;
  reason: string;
  travelTip: string;
  officialSource?: string;
  lastReviewed?: string;
  packed: boolean;
  
  // Rule checks
  compliance: {
    status: 'SAFE' | 'WARNING' | 'DANGER' | 'INFO';
    message: string;
  };
}

/**
 * 1. TRIP ENGINE
 * Handles trip structure presets, destination analytics, and metadata resolution.
 */
export class TripEngine {
  static createTrip(params: Omit<Trip, 'id' | 'lists' | 'notes'>): Trip {
    const defaultLists: PackingList[] = [
      { id: 'carry-on', name: 'Carry-on Bag', isCustom: false, items: [] },
      { id: 'checked-bag', name: 'Checked Bag', isCustom: false, items: [] },
      { id: 'personal-item', name: 'Personal Item', isCustom: false, items: [] },
      { id: 'documents', name: 'Documents', isCustom: false, items: [] },
      { id: 'essentials', name: 'Essentials', isCustom: false, items: [] }
    ];

    return {
      id: `trip-${Date.now()}`,
      ...params,
      lists: defaultLists,
      notes: ''
    };
  }

  static getDestinationSuggestions(destination: string, tripType: string): { name: string; category: string; reason: string }[] {
    const suggestions: { name: string; category: string; reason: string }[] = [];
    const dest = destination.toLowerCase().trim();

    // Destination weather/power adapter checks
    if (dest.includes("london") || dest.includes("uk") || dest.includes("paris") || dest.includes("europe") || dest.includes("tokyo") || dest.includes("japan")) {
      suggestions.push({
        name: "Universal Travel Adapter",
        category: "Electronics",
        reason: "Different plug geometries and voltages are used at your destination."
      });
    }

    if (dest.includes("london") || dest.includes("uk") || dest.includes("seattle") || dest.includes("rain") || dest.includes("vancouver")) {
      suggestions.push({
        name: "Compact Umbrella",
        category: "Clothing",
        reason: "Rain is common at your destination."
      });
    }

    if (dest.includes("niseko") || dest.includes("alps") || dest.includes("snow") || dest.includes("winter") || dest.includes("iceland")) {
      suggestions.push({
        name: "Insulated Jacket",
        category: "Clothing",
        reason: "Freezing temperatures are expected."
      });
    }

    // Trip type suggestions
    if (tripType === 'international') {
      suggestions.push({
        name: "Passport",
        category: "Documents",
        reason: "Required for border crossings and customs clearance."
      });
      suggestions.push({
        name: "Visa Confirmation Page",
        category: "Documents",
        reason: "Check visa requirements for entry clearance."
      });
      suggestions.push({
        name: "Travel Insurance Certificate",
        category: "Documents",
        reason: "Recommended for emergency medical coverage abroad."
      });
    }

    return suggestions;
  }
}

/**
 * 2. RULE ENGINE
 * Evaluates packed item categories and target lists, detecting TSA/FAA regulatory conflicts.
 */
export class RuleEngine {
  static evaluateCompliance(itemName: string, category: string, slug: string, listId: string, itemData?: TSAItem): PackedItem['compliance'] {
    const list = listId.toLowerCase().trim();
    const cat = category.toLowerCase().trim();
    const name = itemName.toLowerCase().trim();

    // 1. Lithium batteries (Power bank) added to Checked Bag check
    if (slug === 'power-bank' && list === 'checked-bag') {
      return {
        status: 'DANGER',
        message: 'Power banks must travel in your Carry-on cabin bag. Prohibited in checked luggage due to fire risk.'
      };
    }

    // 2. Large liquids in Carry-on check
    if (cat === 'liquids' && (list === 'carry-on' || list === 'personal-item')) {
      return {
        status: 'WARNING',
        message: 'Liquids inside cabin luggage must follow the 3-1-1 rule (containers under 3.4 oz / 100ml in a clear pouch).'
      };
    }

    // 3. Bladed/Blunt items (Tools or Sports) added to cabin check
    if ((cat === 'tools' || cat === 'camping' || cat === 'sports') && (list === 'carry-on' || list === 'personal-item')) {
      // Exclude things like watch/electronics
      if (name.includes("hammer") || name.includes("knife") || name.includes("peg") || name.includes("bat") || name.includes("cutter") || name.includes("axe")) {
        return {
          status: 'DANGER',
          message: 'Bladed tools and sports clubs are strictly prohibited in the cabin. Move to Checked Bag.'
        };
      }
    }

    // 4. Fallback validation checks using raw db data if loaded
    if (itemData) {
      if ((list === 'carry-on' || list === 'personal-item') && itemData.carryOn.status === 'NOT_ALLOWED') {
        return {
          status: 'DANGER',
          message: `${itemData.name} is prohibited in cabin bags. Move to Checked Bag.`
        };
      }
      if (list === 'checked-bag' && itemData.checkedBag.status === 'NOT_ALLOWED') {
        return {
          status: 'DANGER',
          message: `${itemData.name} is prohibited in checked cargo holds. Move to Carry-on.`
        };
      }
      if ((list === 'carry-on' || list === 'personal-item') && itemData.carryOn.status === 'RESTRICTED') {
        return {
          status: 'WARNING',
          message: `TSA restrictions apply: ${itemData.carryOn.reason}`
        };
      }
      if (list === 'checked-bag' && itemData.checkedBag.status === 'RESTRICTED') {
        return {
          status: 'WARNING',
          message: `Hold baggage restrictions apply: ${itemData.checkedBag.reason}`
        };
      }
    }

    return {
      status: 'SAFE',
      message: 'Verified compliant with standard aviation carriage rules.'
    };
  }
}

/**
 * 3. SUGGESTION ENGINE
 * Fires contextual suggestions based on active items.
 */
export class SuggestionEngine {
  static getSmartSuggestions(packedSlugsOrNames: string[]): { name: string; category: string; trigger: string }[] {
    const suggestions: { name: string; category: string; trigger: string }[] = [];
    const set = new Set(packedSlugsOrNames.map(s => s.toLowerCase().trim()));

    if (set.has("camera") || set.has("drone")) {
      const trigger = set.has("camera") ? "Camera" : "Drone";
      if (!set.has("battery") && !set.has("camera battery")) {
        suggestions.push({ name: "Spare Lithium Batteries", category: "Electronics", trigger });
      }
      if (!set.has("memory card") && !set.has("sd card")) {
        suggestions.push({ name: "SD Memory Card", category: "Electronics", trigger });
      }
      if (!set.has("tripod")) {
        suggestions.push({ name: "Travel Tripod", category: "Electronics", trigger });
      }
    }

    if (set.has("baby formula") || set.has("baby milk") || set.has("breast milk")) {
      const trigger = "Baby Formula";
      if (!set.has("baby bottle") && !set.has("bottle")) {
        suggestions.push({ name: "Baby Feeding Bottle", category: "Baby", trigger });
      }
      if (!set.has("diapers")) {
        suggestions.push({ name: "Diapers", category: "Baby", trigger });
      }
      if (!set.has("baby wipes") && !set.has("wipes")) {
        suggestions.push({ name: "Baby Wipes", category: "Baby", trigger });
      }
    }

    if (set.has("prescription pills") || set.has("insulin") || set.has("epipen")) {
      const trigger = "Medical Items";
      if (!set.has("doctors prescription") && !set.has("prescription copy")) {
        suggestions.push({ name: "Doctor's Prescription Copy", category: "Documents", trigger });
      }
      if (!set.has("pill organizer") && !set.has("pill box")) {
        suggestions.push({ name: "Pill Organizer", category: "Medicine", trigger });
      }
    }

    return suggestions;
  }
}

/**
 * 4. TEMPLATE ENGINE
 * Generates initial recommended list presets.
 */
export class TemplateEngine {
  static getTemplateItems(template: 'weekend' | 'business' | 'international' | 'beach' | 'camping' | 'family'): { name: string; category: string; listId: string }[] {
    const base = [
      { name: "Wallet & Cash", category: "Documents", listId: "personal-item" },
      { name: "Smartphone", category: "Electronics", listId: "personal-item" },
      { name: "Phone Charger", category: "Electronics", listId: "carry-on" },
      { name: "Toothbrush & Toothpaste", category: "Personal Care", listId: "carry-on" }
    ];

    switch (template) {
      case 'weekend':
        return [
          ...base,
          { name: "Changes of Clothes (2x)", category: "Clothing", listId: "carry-on" },
          { name: "Deodorant", category: "Personal Care", listId: "carry-on" }
        ];
      case 'business':
        return [
          ...base,
          { name: "Laptop Computer", category: "Electronics", listId: "personal-item" },
          { name: "Laptop Charger", category: "Electronics", listId: "carry-on" },
          { name: "Notepad & Pen", category: "Documents", listId: "personal-item" },
          { name: "Formal Blazer / Suit", category: "Clothing", listId: "carry-on" },
          { name: "Business Cards", category: "Documents", listId: "personal-item" }
        ];
      case 'international':
        return [
          ...base,
          { name: "Passport", category: "Documents", listId: "personal-item" },
          { name: "Universal Travel Adapter", category: "Electronics", listId: "carry-on" },
          { name: "Travel Insurance Copy", category: "Documents", listId: "personal-item" },
          { name: "Local Currency Cash", category: "Documents", listId: "personal-item" }
        ];
      case 'beach':
        return [
          ...base,
          { name: "Swimsuit", category: "Clothing", listId: "carry-on" },
          { name: "Sunscreen Lotion", category: "Liquids", listId: "checked-bag" },
          { name: "Sunglasses", category: "Clothing", listId: "personal-item" },
          { name: "Beach Towel", category: "Clothing", listId: "checked-bag" },
          { name: "Flip Flops", category: "Clothing", listId: "checked-bag" }
        ];
      case 'camping':
        return [
          ...base,
          { name: "Sleeping Bag", category: "Clothing", listId: "checked-bag" },
          { name: "Flashlight / Headlamp", category: "Electronics", listId: "carry-on" },
          { name: "Matches / Lighter", category: "Camping", listId: "carry-on" },
          { name: "Water Bottle", category: "Camping", listId: "personal-item" },
          { name: "Tent Pegs", category: "Camping", listId: "checked-bag" }
        ];
      case 'family':
        return [
          ...base,
          { name: "First Aid Kit", category: "Medicine", listId: "checked-bag" },
          { name: "Travel Snacks", category: "Food", listId: "carry-on" },
          { name: "Diapers & Baby Wipes", category: "Baby", listId: "carry-on" },
          { name: "Coloring Books & Toys", category: "Baby", listId: "carry-on" }
        ];
      default:
        return base;
    }
  }
}

/**
 * 5. STORAGE ENGINE
 * Manages active and historical trips in LocalStorage.
 */
export class StorageEngine {
  private static TRIPS_KEY = 'bop_trips';
  private static ACTIVE_TRIP_KEY = 'bop_active_trip_id';

  static getTrips(): Trip[] {
    try {
      return JSON.parse(localStorage.getItem(this.TRIPS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  static saveTrip(trip: Trip) {
    const trips = this.getTrips();
    const idx = trips.findIndex(t => t.id === trip.id);
    if (idx >= 0) {
      trips[idx] = trip;
    } else {
      trips.push(trip);
    }
    localStorage.setItem(this.TRIPS_KEY, JSON.stringify(trips));
  }

  static getTrip(id: string): Trip | undefined {
    return this.getTrips().find(t => t.id === id);
  }

  static deleteTrip(id: string) {
    const trips = this.getTrips().filter(t => t.id !== id);
    localStorage.setItem(this.TRIPS_KEY, JSON.stringify(trips));
    
    if (this.getActiveTripId() === id) {
      localStorage.removeItem(this.ACTIVE_TRIP_KEY);
    }
  }

  static getActiveTripId(): string | null {
    return localStorage.getItem(this.ACTIVE_TRIP_KEY);
  }

  static getActiveTrip(): Trip | undefined {
    const activeId = this.getActiveTripId();
    if (!activeId) return undefined;
    return this.getTrip(activeId);
  }

  static setActiveTripId(id: string | null) {
    if (id) {
      localStorage.setItem(this.ACTIVE_TRIP_KEY, id);
    } else {
      localStorage.removeItem(this.ACTIVE_TRIP_KEY);
    }
  }
}
