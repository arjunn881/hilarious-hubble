import type { AffiliateLink } from '../components/AmazonAffiliateBox.astro';

export interface AffiliateContext {
  id?: string;
  name?: string;
  category?: string;
  restrictionType?: string;
  carryOn?: {
    status?: string;
    conditions?: string[];
  };
  affiliateLinks?: AffiliateLink[];
}

/**
 * Strips parentheses and extra punctuation from item names to produce clean search terms.
 * e.g. "Spices (Dry / Powder)" -> "Spices"
 * e.g. "Coffee Beans / Grounds" -> "Coffee Beans"
 */
function cleanName(name: string): string {
  return name
    .replace(/\(.*?\)/g, '')
    .split('/')[0]
    .trim();
}

/**
 * Returns customized, high-converting Amazon travel affiliate recommendations.
 * 
 * Strategy:
 * 1. If the item already has custom `affiliateLinks` defined in its JSON/MD file, use those.
 * 2. Otherwise, automatically generate 2 relevant travel gear recommendations based on:
 *    - TSA carry-on status (prohibited items get checked-bag locks & travel alternatives)
 *    - Specific item matches (perfume gets refillable atomizers, suit gets garment bags, etc.)
 *    - Item category & restriction type (liquids get 3-1-1 bottles, electronics get power banks, etc.)
 *    - Universal contextual fallback
 */
export function getItemAffiliateLinks(context?: AffiliateContext): AffiliateLink[] {
  if (!context) return [];

  // 1. If custom manual links already exist, use them
  if (context.affiliateLinks && context.affiliateLinks.length > 0) {
    return context.affiliateLinks;
  }

  const rawName = context.name || 'Travel Item';
  const name = cleanName(rawName);
  const lowerName = rawName.toLowerCase();
  const cat = (context.category || '').toLowerCase();
  const restriction = (context.restrictionType || '').toLowerCase();
  const isProhibited = context.carryOn?.status === 'PROHIBITED';

  // 2. High-Intent Item Specific Overrides
  if (lowerName.includes('perfume') || lowerName.includes('cologne') || lowerName.includes('fragrance')) {
    return [
      {
        title: 'Refillable Mini Travel Perfume Atomizer Spray Bottles (5ml)',
        search: 'travel perfume atomizer refillable mini spray bottle 5ml leak proof',
        why: 'Transfer your favourite fragrance into a pocket-sized 5ml atomizer — fits inside any pocket and passes airport security with ease.',
        badge: 'Travel Must-Have'
      },
      {
        title: 'Clear Quart-Size TSA 3-1-1 Toiletry Bag with Heavy-Duty Zipper',
        search: 'clear quart size travel toiletry bag tsa approved heavy duty',
        why: 'Airport security requires all liquids to fit inside one transparent quart bag. Speeds up checkpoint screening.',
        badge: 'TSA Essential'
      }
    ];
  }

  if (lowerName.includes('suit') || lowerName.includes('dress') || lowerName.includes('garment')) {
    return [
      {
        title: 'Carry-On Garment Bag for Suits & Dresses (Wrinkle-Free Folding)',
        search: 'convertible carry on garment duffle bag for suits wrinkle free',
        why: 'Keep suits and dresses crisp and ready to wear straight out of the overhead bin without ironing.',
        badge: 'Business Travel'
      },
      {
        title: 'Travel Compression Packing Cubes for Luggage',
        search: 'travel compression packing cubes set for carry on luggage',
        why: 'Compresses business attire and clothing by up to 60%, maximizing cabin bag space.',
        badge: 'Best Seller'
      }
    ];
  }

  if (lowerName.includes('jewelry') || lowerName.includes('ring') || lowerName.includes('necklace')) {
    return [
      {
        title: 'Anti-Tangle Velvet Travel Jewelry Organizer Roll Case',
        search: 'travel jewelry organizer roll case anti tangle velvet compact',
        why: 'Keeps rings, necklaces, and delicate valuables protected, untangled, and secure in your carry-on luggage.',
        badge: 'Best Seller'
      },
      {
        title: 'Small Portable Travel Jewelry Box with Ring & Earring Slots',
        search: 'small portable travel jewelry box case compact mirror',
        why: 'Hard-shell mini jewelry case that fits in your handbag or personal item to keep precious items with you in the cabin.',
        badge: 'Travel Pick'
      }
    ];
  }

  // 3. Prohibited in carry-on: travelers must check it in or find compliant alternatives
  if (isProhibited) {
    return [
      {
        title: `TSA-Accepted Luggage Cable Locks (2-Pack) — For Checked Bags`,
        search: 'tsa approved luggage locks flexible cable 2 pack',
        why: `Because ${name} must be placed in checked luggage, secure your bag with TSA-compliant combination locks to prevent tampering.`,
        badge: 'Baggage Essential'
      },
      {
        title: `Travel-Compliant Alternative for ${name}`,
        search: `travel friendly portable ${name}`,
        why: `Looking for a version you can actually bring in your cabin bag? Check out travel-sized or airport-compliant alternatives.`,
        badge: 'Cabin Alternative'
      }
    ];
  }

  // 4. Category: Liquids / Toiletries / Beauty / Personal Care
  if (
    restriction.includes('liquid') ||
    restriction.includes('gel') ||
    restriction.includes('aerosol') ||
    cat.includes('liquid') ||
    cat.includes('beauty') ||
    cat.includes('personal')
  ) {
    return [
      {
        title: 'TSA-Approved Leakproof Travel Bottles Set (3.4 oz / 100ml)',
        search: 'tsa approved travel bottles set leak proof silicone 3.4 oz',
        why: `Ensure your ${name} complies with TSA's 3-1-1 liquids rule without risking messy cabin pressure leaks in your luggage.`,
        badge: 'TSA-Approved'
      },
      {
        title: 'Clear Quart-Size TSA 3-1-1 Toiletry Bag with Heavy-Duty Zipper',
        search: 'clear quart size travel toiletry bag tsa approved heavy duty',
        why: 'Fly through security checkpoints faster with an airport-compliant clear quart bag designed for speedy screening.',
        badge: 'Travel Pick'
      }
    ];
  }

  // 5. Category: Electronics / Gadgets
  if (cat.includes('electronic') || cat.includes('tech')) {
    return [
      {
        title: 'Airline-Approved Fast-Charging Portable Power Bank (Under 100Wh)',
        search: 'airline approved power bank portable charger carry on 20000mah',
        why: 'Complies with FAA & international lithium battery limits for carry-on baggage. Keeps your devices charged on long flights.',
        badge: 'Airline Safe'
      },
      {
        title: 'Shockproof Travel Electronics & Cable Organizer Case',
        search: 'travel electronics cable organizer bag hard shell waterproof',
        why: `Keep your chargers, cables, and ${name} accessories organized and protected from bag pressure during transit.`,
        badge: 'Best Seller'
      }
    ];
  }

  // 6. Category: Food & Snacks
  if (cat.includes('food')) {
    return [
      {
        title: 'Leakproof Airtight Food & Snack Containers for Travel (BPA-Free)',
        search: 'leakproof airtight travel snack containers bpa free food safe',
        why: `Keeps ${name} fresh and sealed tight in your carry-on or checked baggage — prevents messy leaks and cabin pressure spills.`,
        badge: 'Travel Pick'
      },
      {
        title: 'Reusable Silicone Stand-Up Food Storage Bags (Set of 4)',
        search: 'reusable silicone food storage bags stand up travel pouches',
        why: 'Packs flat in your personal item, seals completely airtight, and passes airport screening checkpoints without hassle.',
        badge: 'Eco Friendly'
      }
    ];
  }

  // 7. Category: Medicine & Health
  if (cat.includes('medicine') || cat.includes('health')) {
    return [
      {
        title: 'Moisture-Proof 7-Day Travel Pill Organizer Case (Compact)',
        search: 'travel pill organizer moisture proof compact travel case',
        why: `Keep your ${name} and travel prescriptions secure, dry, and easily accessible during security screening and long flights.`,
        badge: 'Travel Pick'
      },
      {
        title: 'TSA Medical Alert Travel Pouch with Prescription Card Slot',
        search: 'travel medicine bag medical pouch organizer first aid',
        why: 'Discreetly organizes travel health essentials in your personal item for quick access at 30,000 feet.',
        badge: 'Organizer'
      }
    ];
  }

  // 8. Category: Documents
  if (cat.includes('document')) {
    return [
      {
        title: 'RFID-Blocking Travel Passport Wallet & Document Organizer',
        search: 'rfid blocking travel passport wallet document organizer zipper',
        why: 'Protects against electronic skimming and keeps your passport, boarding passes, and documents in one secure zippered pouch.',
        badge: 'Security Pick'
      },
      {
        title: 'Waterproof Document Sleeve for Travel & Boarding Passes',
        search: 'waterproof travel document pouch neck wallet',
        why: 'Keep travel paperwork, passport, and customs cards crisp and protected from rain or spills.',
        badge: 'Travel Pick'
      }
    ];
  }

  // 9. Category: Sports & Camping & Tools
  if (cat.includes('sport') || cat.includes('camp') || cat.includes('tool')) {
    return [
      {
        title: 'Digital Backlit Luggage Scale (50kg / 110lb Capacity)',
        search: 'portable digital luggage scale travel weight accurate',
        why: 'Avoid unexpected overweight baggage penalty fees at the check-in counter before flying with sports or outdoor gear.',
        badge: 'Must-Have'
      },
      {
        title: 'Water-Resistant Packable Travel Sports & Gear Duffle Bag',
        search: 'packable lightweight travel duffle bag water resistant gym sports',
        why: 'Packs down to the size of a book and expands into a full-sized carry-on bag if you need extra storage on your trip.',
        badge: 'Travel Pick'
      }
    ];
  }

  // 10. Category: Baby
  if (cat.includes('baby')) {
    return [
      {
        title: 'Travel Baby Formula Dispenser & Spill-Proof Snack Cups',
        search: 'travel baby formula dispenser spill proof snack cups portable',
        why: 'Exempt from standard 3.4 oz liquid limits under TSA medically necessary / infant rules — keep portions clean and ready.',
        badge: 'Parent Pick'
      },
      {
        title: 'TSA-Compliant Clear Travel Wet Bag for Baby Supplies',
        search: 'tsa approved clear travel wet bag baby waterproof zippered',
        why: 'Waterproof zippered pouch to isolate damp clothes, bibs, and infant items in your diaper bag.',
        badge: 'Travel Pick'
      }
    ];
  }

  // 11. Universal Fallback for any item:
  return [
    {
      title: `Travel-Friendly ${name} & Portable Packing Organizers`,
      search: `travel ${name} portable compact`,
      why: `Compact, travel-ready options designed to save space and pack easily into your cabin bag or checked suitcase.`,
      badge: 'Travel Pick'
    },
    {
      title: 'Ultralight Compression Packing Cubes Set for Carry-On Bags',
      search: 'travel compression packing cubes set for carry on luggage',
      why: 'Compresses clothing and travel gear by up to 60%, maximizing luggage capacity and organizing your bag.',
      badge: 'Best Seller'
    }
  ];
}
