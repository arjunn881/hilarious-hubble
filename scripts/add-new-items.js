/**
 * add-new-items.js
 * Batch-creates new TSA item JSON files and appends them to metadata-summary.json
 * Run: node scripts/add-new-items.js
 */
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const DATA_DIR = path.resolve(__dirname, '../src/data/items');
const METADATA_PATH = path.resolve(__dirname, '../src/data/metadata-summary.json');

// ─── New Items Definition ────────────────────────────────────────────────────
const newItems = [
  // TOOLS / FIRE ──────────────────────────────────────────────────────────────
  {
    id: 'matchbox', slug: 'matchbox', name: 'Matchbox', category: 'Tools', subcategory: 'General',
    aliases: ['box of matches', 'strike on box matches', 'safety matchbox'],
    keywords: ['matchbox', 'matches', 'fire', 'strike', 'box', 'safety'],
    description: 'Guidelines for traveling with a matchbox on a plane.',
    carryOn: {
      status: 'ALLOWED',
      reason: 'One book or box of safety matches is allowed in carry-on baggage or on your person. Strike-anywhere matches are completely prohibited.',
      conditions: ['Only safety (strike-on-box) matches are permitted', 'Limit of one small box', 'Strike-anywhere matches are prohibited entirely'],
      exceptions: []
    },
    checkedBag: {
      status: 'NOT_ALLOWED',
      reason: 'Matchboxes are prohibited in checked baggage by TSA and IATA regulations.',
      conditions: [],
      exceptions: []
    },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/matches', lastVerified: '2026-07-01', pageTitle: 'Can I bring a matchbox on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/matches', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Carry the matchbox in your pocket or top of your carry-on bag for easy access at security', 'Strike-anywhere matches are never permitted'],
    relatedItems: ['matches', 'lighter', 'candles'],
    faq: [
      { question: 'Can I bring a matchbox on a plane?', answer: 'Yes, one small box of safety matches is allowed in carry-on baggage or on your person. Strike-anywhere matches are prohibited entirely.' },
      { question: 'Are matchboxes allowed in checked baggage?', answer: 'No. Matchboxes are prohibited in checked baggage. You must carry them in your carry-on or on your person.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/matches' }]
  },
  {
    id: 'torch-lighter', slug: 'torch-lighter', name: 'Torch Lighter', category: 'Tools', subcategory: 'General',
    aliases: ['jet lighter', 'butane torch', 'blue flame lighter', 'wind-proof lighter'],
    keywords: ['torch lighter', 'jet lighter', 'butane', 'flame', 'cigar lighter'],
    description: 'TSA rules for torch lighters and jet flame lighters on planes.',
    carryOn: { status: 'NOT_ALLOWED', reason: 'Torch lighters (jet lighters, blue-flame lighters) are prohibited in both carry-on and checked baggage by TSA regulations.', conditions: [], exceptions: [] },
    checkedBag: { status: 'NOT_ALLOWED', reason: 'Torch lighters are prohibited in checked baggage regardless of fuel content.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/torch-lighters', lastVerified: '2026-07-01', pageTitle: 'Can I bring a torch lighter on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: true },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/torch-lighters', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Torch lighters are always prohibited. Use a standard Bic or Zippo lighter instead — one is allowed in carry-on.'],
    relatedItems: ['lighter', 'matches', 'matchbox'],
    faq: [
      { question: 'Are torch lighters allowed on planes?', answer: 'No. Torch lighters (jet lighters, blue-flame lighters) are prohibited in both carry-on and checked baggage by TSA.' },
      { question: 'What is the difference between a regular lighter and a torch lighter on a plane?', answer: 'A standard disposable lighter (Bic, Zippo) is allowed in carry-on. A torch lighter with a blue flame jet is completely prohibited in all baggage.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/torch-lighters' }]
  },

  // ELECTRONICS ───────────────────────────────────────────────────────────────
  {
    id: 'earbuds', slug: 'earbuds', name: 'Earbuds', category: 'Electronics', subcategory: 'Audio',
    aliases: ['earphones', 'in-ear headphones', 'wireless earbuds', 'airpods'],
    keywords: ['earbuds', 'earphones', 'headphones', 'airpods', 'wireless', 'audio', 'music'],
    description: 'TSA rules for earbuds and wireless earphones on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Earbuds, earphones, and wireless earbuds (AirPods, etc.) are fully allowed in carry-on bags and can be used during flight.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Earbuds are allowed in checked baggage, though it\'s best to keep them in carry-on to prevent loss or damage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring earbuds on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Keep earbuds in carry-on to prevent loss', 'Wireless charging cases with lithium batteries should stay in carry-on'],
    relatedItems: ['headphones', 'smartphone', 'laptop'],
    faq: [
      { question: 'Can I bring earbuds on a plane?', answer: 'Yes, earbuds and wireless earphones (including AirPods) are fully allowed in carry-on and checked baggage.' },
      { question: 'Can I use earbuds on the plane?', answer: 'Yes, earbuds can be used throughout the flight including during takeoff and landing on most airlines.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },
  {
    id: 'headphones', slug: 'headphones', name: 'Headphones', category: 'Electronics', subcategory: 'Audio',
    aliases: ['over-ear headphones', 'noise cancelling headphones', 'wireless headphones', 'sony headphones', 'bose headphones'],
    keywords: ['headphones', 'over-ear', 'noise cancelling', 'wireless', 'audio', 'music', 'headset'],
    description: 'TSA rules for headphones on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Headphones of all types (wired, wireless, noise-cancelling) are fully allowed in carry-on baggage.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Headphones are allowed in checked baggage but carry-on is recommended to prevent damage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring headphones on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Carry headphones in your personal item or carry-on for easy in-flight access', 'Large over-ear headphones can go in checked baggage but risk damage'],
    relatedItems: ['earbuds', 'smartphone', 'laptop'],
    faq: [
      { question: 'Can I bring headphones on a plane?', answer: 'Yes, all types of headphones (wired, wireless, noise-cancelling) are fully allowed in carry-on and checked bags.' },
      { question: 'Do I need to remove headphones at TSA security?', answer: 'No, headphones do not need to be removed from your bag separately at TSA screening.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },
  {
    id: 'e-reader', slug: 'e-reader', name: 'E-Reader', category: 'Electronics', subcategory: 'Computing',
    aliases: ['kindle', 'kobo', 'nook', 'ebook reader', 'electronic book'],
    keywords: ['e-reader', 'kindle', 'kobo', 'ebook', 'reading', 'tablet'],
    description: 'TSA rules for e-readers and Kindle devices on planes.',
    carryOn: { status: 'ALLOWED', reason: 'E-readers (Kindle, Kobo, Nook) are fully allowed in carry-on baggage. They do not need to be removed separately at security checkpoints.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'E-readers are allowed in checked baggage though carry-on is recommended.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring an e-reader on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['E-readers are ideal for flights — long battery life and lightweight', 'No need to remove from bag during TSA screening'],
    relatedItems: ['kindle', 'tablet', 'laptop'],
    faq: [
      { question: 'Can I bring a Kindle on a plane?', answer: 'Yes, Kindles and all e-readers are fully allowed in carry-on bags and can be used during flights.' },
      { question: 'Do I need to take my e-reader out of my bag at security?', answer: 'No, e-readers do not need to be removed separately from your bag at TSA security screening.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },
  {
    id: 'electric-kettle', slug: 'electric-kettle', name: 'Electric Kettle', category: 'Electronics', subcategory: 'Appliances',
    aliases: ['travel kettle', 'portable kettle', 'tea kettle'],
    keywords: ['electric kettle', 'kettle', 'travel kettle', 'hot water', 'tea', 'appliance'],
    description: 'TSA rules for electric kettles in carry-on and checked baggage.',
    carryOn: { status: 'ALLOWED', reason: 'Electric kettles are allowed in carry-on baggage. Ensure they are empty and dry before packing.', conditions: ['Must be empty and completely dry', 'No heating elements containing flammable material'], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Electric kettles are allowed in checked baggage when empty and dry.', conditions: ['Must be empty and completely dry'], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring an electric kettle on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Always empty and dry your electric kettle before going through security', 'Travel-sized kettles fit better in carry-on luggage'],
    relatedItems: ['water-bottle', 'coffee-beans'],
    faq: [
      { question: 'Can I bring an electric kettle on a plane?', answer: 'Yes, electric kettles are allowed in carry-on and checked baggage as long as they are empty and dry.' },
      { question: 'Can I use an electric kettle on a plane?', answer: 'No, electric kettles cannot be used on board aircraft. They are for ground use only.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },
  {
    id: 'hair-clippers', slug: 'hair-clippers', name: 'Hair Clippers', category: 'Electronics', subcategory: 'Personal Grooming',
    aliases: ['beard clippers', 'electric clippers', 'hair trimmer', 'clipper machine'],
    keywords: ['hair clippers', 'clippers', 'beard trimmer', 'grooming', 'electric'],
    description: 'TSA rules for hair clippers on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Hair clippers and beard clippers are allowed in carry-on baggage. They are not considered sharp weapons by TSA.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Hair clippers are allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring hair clippers on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Hair clippers are fine in carry-on — they are not considered sharp objects by TSA'],
    relatedItems: ['beard-trimmer', 'electric-razor', 'scissors'],
    faq: [
      { question: 'Can I bring hair clippers on a plane?', answer: 'Yes, hair clippers are fully allowed in carry-on and checked baggage. TSA does not classify them as sharp weapons.' },
      { question: 'Are beard clippers allowed in carry-on?', answer: 'Yes, beard clippers and hair trimmers are permitted in carry-on bags.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },

  // FOOD ──────────────────────────────────────────────────────────────────────
  {
    id: 'instant-noodles', slug: 'instant-noodles', name: 'Instant Noodles', category: 'Food', subcategory: 'Packaged Food',
    aliases: ['ramen', 'cup noodles', 'instant ramen', 'maggi', 'cup of noodles'],
    keywords: ['instant noodles', 'ramen', 'cup noodles', 'maggi', 'packaged food', 'noodles'],
    description: 'TSA rules for instant noodles and packaged ramen on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Instant noodles (dry packaged) are allowed in carry-on baggage without restrictions. Cup noodles without liquid are also fine.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Instant noodles are fully allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages', lastVerified: '2026-07-01', pageTitle: 'Can I bring instant noodles on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Dry instant noodles pass through security without any issue', 'Pre-made liquid cup noodles may trigger the 3-1-1 rule if containing liquid broth'],
    relatedItems: ['spices', 'tea-bags', 'coffee-beans'],
    faq: [
      { question: 'Can I bring instant noodles on a plane?', answer: 'Yes, dry instant noodles and packaged ramen are fully allowed in carry-on and checked bags.' },
      { question: 'Can I bring cup noodles on a plane?', answer: 'Yes, sealed dry cup noodles are allowed in carry-on. Pre-made liquid noodles with broth may be subject to the 3-1-1 liquids rule.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages' }]
  },
  {
    id: 'energy-drink', slug: 'energy-drink', name: 'Energy Drink', category: 'Food', subcategory: 'Beverages',
    aliases: ['red bull', 'monster energy', 'gatorade', 'sports drink', 'energy can'],
    keywords: ['energy drink', 'red bull', 'monster', 'sports drink', 'beverage', 'can', 'liquid'],
    description: 'TSA rules for energy drinks on planes.',
    carryOn: { status: 'RESTRICTED', reason: 'Canned or bottled energy drinks purchased before security are subject to the TSA 3-1-1 rule — containers must be 3.4 oz (100ml) or less. Full-size cans/bottles must be purchased after security or checked.', conditions: ['Must be 3.4 oz or less if brought through security', 'Sealed full-size cans purchased after the security checkpoint are allowed', 'Empty reusable bottles allowed and can be filled airside'], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Sealed factory cans and bottles of energy drinks are allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages', lastVerified: '2026-07-01', pageTitle: 'Can I bring energy drinks on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Buy your energy drink after clearing the security checkpoint at the airport', 'Pack full cans in your checked baggage to avoid confiscation'],
    relatedItems: ['water-bottle', 'juice', 'soda'],
    faq: [
      { question: 'Can I bring energy drinks on a plane?', answer: 'Full-size cans of energy drinks cannot pass through TSA security (they exceed 3.4 oz). Buy them after security, check them, or bring a container under 3.4 oz.' },
      { question: 'Can I put Red Bull in my checked bag?', answer: 'Yes, sealed factory cans of Red Bull and other energy drinks are allowed in checked baggage.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages' }]
  },
  {
    id: 'nuts', slug: 'nuts', name: 'Nuts', category: 'Food', subcategory: 'Snacks',
    aliases: ['almonds', 'cashews', 'peanuts', 'mixed nuts', 'trail mix', 'walnuts', 'pistachios'],
    keywords: ['nuts', 'almonds', 'cashews', 'peanuts', 'snacks', 'trail mix', 'dry food'],
    description: 'TSA rules for nuts and trail mix on planes.',
    carryOn: { status: 'ALLOWED', reason: 'All types of nuts (almonds, cashews, peanuts, mixed nuts, trail mix) are fully allowed in carry-on bags without restrictions.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Nuts are fully allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages', lastVerified: '2026-07-01', pageTitle: 'Can I bring nuts on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Nuts and trail mix are ideal travel snacks — lightweight and allowed without restriction', 'Check airline policies if you have a severe nut allergy — some airlines may accommodate requests'],
    relatedItems: ['protein-bars', 'chips', 'candy'],
    faq: [
      { question: 'Can I bring nuts on a plane?', answer: 'Yes, all types of nuts (almonds, cashews, peanuts, pistachios) and trail mix are fully allowed in carry-on and checked bags.' },
      { question: 'Can I bring peanut butter on a plane?', answer: 'Peanut butter is considered a paste/spread and is subject to the 3-1-1 rule in carry-on — containers must be 3.4 oz or less. Solid peanut butter bars are fine.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages' }]
  },

  // PERSONAL CARE ─────────────────────────────────────────────────────────────
  {
    id: 'razor-blades', slug: 'razor-blades', name: 'Razor Blades', category: 'Personal Care', subcategory: 'Grooming',
    aliases: ['spare blades', 'safety razor blades', 'blade cartridges', 'shaving blades'],
    keywords: ['razor blades', 'blades', 'shaving', 'safety razor', 'spare blades'],
    description: 'TSA rules for loose razor blades on planes.',
    carryOn: { status: 'NOT_ALLOWED', reason: 'Loose or detached razor blades are not allowed in carry-on baggage. Only blades fully enclosed in a cartridge razor or electric razor are permitted in carry-on.', conditions: [], exceptions: ['Razor blades inside a safety razor cartridge are allowed'] },
    checkedBag: { status: 'ALLOWED', reason: 'Loose razor blades are allowed in checked baggage when properly packaged to prevent injury.', conditions: ['Must be wrapped or packaged securely to prevent injury to baggage handlers'], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/razors', lastVerified: '2026-07-01', pageTitle: 'Can I bring razor blades on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/razors', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Pack spare blades in your checked bag; only cartridge-enclosed blades may travel in carry-on', 'Wrap loose blades in cardboard or tape before placing in checked baggage'],
    relatedItems: ['razor', 'safety-razor', 'straight-razor', 'disposable-razor'],
    faq: [
      { question: 'Can I bring razor blades in my carry-on?', answer: 'No. Loose, detached razor blades are not allowed in carry-on bags. They must go in checked baggage.' },
      { question: 'Can I bring razor blades in checked luggage?', answer: 'Yes, loose razor blades are allowed in checked baggage when properly wrapped to prevent injury.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/razors' }]
  },
  {
    id: 'shaving-cream', slug: 'shaving-cream', name: 'Shaving Cream', category: 'Personal Care', subcategory: 'Grooming',
    aliases: ['shaving gel', 'shave foam', 'shaving foam'],
    keywords: ['shaving cream', 'shaving gel', 'shave foam', 'grooming', 'liquid', 'aerosol'],
    description: 'TSA rules for shaving cream and shaving gel on planes.',
    carryOn: { status: 'RESTRICTED', reason: 'Shaving cream, gel, and foam are subject to TSA 3-1-1 liquids rule in carry-on bags. Containers must be 3.4 oz (100ml) or less and fit in a quart-sized clear bag.', conditions: ['3.4 oz (100ml) or less per container', 'Must fit in a single quart-sized clear zip bag', '1 quart-sized bag per passenger'], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Full-size shaving cream and gels are allowed in checked baggage without volume restrictions.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/shaving-cream', lastVerified: '2026-07-01', pageTitle: 'Can I bring shaving cream on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/shaving-cream', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Buy travel-size shaving cream (under 3.4 oz) for carry-on', 'Pack full-size cans in your checked bag for longer trips'],
    relatedItems: ['razor', 'disposable-razor', 'deodorant', 'lotion'],
    faq: [
      { question: 'Can I bring shaving cream on a plane?', answer: 'Yes, in carry-on bags shaving cream must be 3.4 oz or less and fit in your quart-size liquids bag. Full sizes are allowed in checked baggage.' },
      { question: 'Is shaving gel allowed on planes?', answer: 'Yes, same rules apply — 3.4 oz or less in carry-on. Full size is fine in checked baggage.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/shaving-cream' }]
  },
  {
    id: 'beard-oil', slug: 'beard-oil', name: 'Beard Oil', category: 'Personal Care', subcategory: 'Grooming',
    aliases: ['facial oil', 'beard balm', 'beard serum'],
    keywords: ['beard oil', 'beard balm', 'facial oil', 'grooming', 'liquid', 'men'],
    description: 'TSA rules for beard oil on planes.',
    carryOn: { status: 'RESTRICTED', reason: 'Beard oil is a liquid and is subject to the TSA 3-1-1 rule in carry-on bags. Containers must be 3.4 oz (100ml) or less.', conditions: ['3.4 oz (100ml) or less per container', 'Must fit in quart-sized clear bag'], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Beard oil is allowed in checked baggage in any size container.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/toiletries', lastVerified: '2026-07-01', pageTitle: 'Can I bring beard oil on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/toiletries', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Most beard oil bottles are already under 3.4 oz — check the label before packing in carry-on'],
    relatedItems: ['cologne', 'perfume', 'lotion'],
    faq: [
      { question: 'Can I bring beard oil on a plane?', answer: 'Yes, beard oil is allowed in carry-on bags in containers of 3.4 oz (100ml) or less, placed in your quart-sized liquids bag.' },
      { question: 'Is beard oil allowed in checked luggage?', answer: 'Yes, beard oil in any size container is fully allowed in checked baggage.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/toiletries' }]
  },

  // LIQUIDS ───────────────────────────────────────────────────────────────────
  {
    id: 'cooking-oil', slug: 'cooking-oil', name: 'Cooking Oil', category: 'Liquids', subcategory: 'Food Liquid',
    aliases: ['vegetable oil', 'olive oil', 'coconut oil', 'oil bottle'],
    keywords: ['cooking oil', 'vegetable oil', 'olive oil', 'coconut oil', 'liquid', 'oil'],
    description: 'TSA rules for cooking oil on planes.',
    carryOn: { status: 'RESTRICTED', reason: 'Cooking oils (olive oil, vegetable oil, coconut oil) are liquids and subject to the TSA 3-1-1 rule in carry-on bags. Containers must be 3.4 oz (100ml) or less.', conditions: ['3.4 oz (100ml) or less per container', 'Must fit in quart-sized clear bag'], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Cooking oil in sealed containers is allowed in checked baggage. Pack securely to prevent leaks.', conditions: ['Seal containers tightly', 'Place in zip-lock bags to prevent leaks'], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages', lastVerified: '2026-07-01', pageTitle: 'Can I bring cooking oil on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Pack larger oil bottles in checked baggage in sealed zip-lock bags to prevent leaks at altitude'],
    relatedItems: ['olive-oil', 'hot-sauce', 'honey'],
    faq: [
      { question: 'Can I bring cooking oil on a plane?', answer: 'In carry-on bags, cooking oil must be 3.4 oz or less (3-1-1 rule). Full-size bottles must go in checked baggage.' },
      { question: 'Can I bring olive oil in my checked suitcase?', answer: 'Yes, sealed bottles of olive oil and other cooking oils are allowed in checked baggage. Pack them securely to prevent leaks.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/food-and-beverages' }]
  },
  {
    id: 'baby-lotion', slug: 'baby-lotion', name: 'Baby Lotion', category: 'Liquids', subcategory: 'Baby',
    aliases: ['baby cream', 'infant lotion', 'baby moisturizer'],
    keywords: ['baby lotion', 'baby cream', 'infant lotion', 'baby care', 'moisturizer', 'liquid'],
    description: 'TSA rules for baby lotion on planes.',
    carryOn: { status: 'RESTRICTED', reason: 'Baby lotion is subject to the 3-1-1 liquids rule (3.4 oz/100ml or less) in carry-on bags, UNLESS it is for use on the baby during travel, in which case larger quantities are permitted if declared to the TSA officer.', conditions: ['3.4 oz or less under normal 3-1-1 rule', 'Larger quantities allowed if for infant use during flight — must be declared to TSA officer'], exceptions: ['Medical/infant necessity exception applies for quantities exceeding 3.4 oz'] },
    checkedBag: { status: 'ALLOWED', reason: 'Baby lotion is fully allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/baby-formula-baby-food-breast-milk-and-juice', lastVerified: '2026-07-01', pageTitle: 'Can I bring baby lotion on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/baby-formula-baby-food-breast-milk-and-juice', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Declare baby lotion to the TSA officer if you need more than 3.4 oz for infant care during travel'],
    relatedItems: ['baby-wipes', 'baby-formula', 'lotion', 'diaper'],
    faq: [
      { question: 'Can I bring baby lotion on a plane?', answer: 'Yes, baby lotion in 3.4 oz or less goes in your liquids bag. Larger quantities for infant use are allowed — just declare them to the TSA officer.' },
      { question: 'Is there an exemption for baby lotions at TSA?', answer: 'Yes, TSA allows reasonable quantities of baby care items for infant use. Declare them separately at the security checkpoint.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/baby-formula-baby-food-breast-milk-and-juice' }]
  },

  // MEDICINE ──────────────────────────────────────────────────────────────────
  {
    id: 'melatonin', slug: 'melatonin', name: 'Melatonin', category: 'Medicine', subcategory: 'Supplements',
    aliases: ['sleep aid', 'melatonin tablets', 'sleep supplement'],
    keywords: ['melatonin', 'sleep aid', 'supplement', 'tablets', 'pills'],
    description: 'TSA rules for melatonin supplements on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Melatonin tablets and sleep supplements are fully allowed in carry-on bags without restriction. No prescription required.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Melatonin is allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/pills', lastVerified: '2026-07-01', pageTitle: 'Can I bring melatonin on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/pills', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Keep melatonin in its original labeled bottle to avoid questions at security', 'Great for adjusting to new time zones after long flights'],
    relatedItems: ['vitamins', 'ibuprofen', 'prescription-pills'],
    faq: [
      { question: 'Can I bring melatonin on a plane?', answer: 'Yes, melatonin tablets are fully allowed in carry-on and checked bags. No prescription is needed.' },
      { question: 'Do I need to declare melatonin at customs?', answer: 'Generally no, but check destination country rules — some countries restrict certain supplements.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/pills' }]
  },
  {
    id: 'face-mask', slug: 'face-mask', name: 'Face Mask', category: 'Medicine', subcategory: 'Health Protection',
    aliases: ['surgical mask', 'n95 mask', 'kn95', 'respirator', 'cloth mask', 'disposable mask'],
    keywords: ['face mask', 'surgical mask', 'n95', 'kn95', 'respirator', 'cloth mask', 'covid'],
    description: 'TSA rules for face masks on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Face masks of all types (surgical, N95, KN95, cloth, disposable) are fully allowed in carry-on and checked baggage. Airlines may have their own mask policies.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Face masks are allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring face masks on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Carry extra face masks in your personal bag — some international destinations may still require them'],
    relatedItems: ['vitamins', 'hand-sanitizer', 'prescription-medicine'],
    faq: [
      { question: 'Can I bring face masks on a plane?', answer: 'Yes, face masks of all types are fully allowed in carry-on and checked baggage with no restrictions.' },
      { question: 'Are N95 masks allowed in carry-on bags?', answer: 'Yes, N95 and KN95 respirators are allowed in carry-on bags. You can pack as many as you need.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },

  // CAMPING ───────────────────────────────────────────────────────────────────
  {
    id: 'fire-starter', slug: 'fire-starter', name: 'Fire Starter', category: 'Camping', subcategory: 'Fire',
    aliases: ['firestarter', 'fire stick', 'tinder', 'flint and steel', 'ferro rod', 'magnesium rod'],
    keywords: ['fire starter', 'ferro rod', 'flint steel', 'tinder', 'camping fire', 'survival'],
    description: 'TSA rules for fire starters and ferro rods on planes.',
    carryOn: { status: 'NOT_ALLOWED', reason: 'Fire starters including flint and steel, magnesium fire starters, and solid fuel tablets are not allowed in carry-on baggage due to fire risk.', conditions: [], exceptions: [] },
    checkedBag: { status: 'RESTRICTED', reason: 'Some fire starters (metal ferro rods without fuel) may be allowed in checked baggage. Flammable solid fire starters and chemical tinder are prohibited.', conditions: ['Metal ferro rods (flint) may be allowed when no flammable material present', 'Solid fuel fire-starting tablets are prohibited in all baggage'], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/camping-equipment', lastVerified: '2026-07-01', pageTitle: 'Can I bring a fire starter on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: true },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/camping-equipment', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Do not pack fire starters in carry-on. Contact TSA for specific ferro rod guidance before travel', 'Purchase fire starters at your camping destination to avoid issues'],
    relatedItems: ['matches', 'lighter', 'matchbox', 'camping-stove'],
    faq: [
      { question: 'Can I bring a fire starter on a plane?', answer: 'No, fire starters are not allowed in carry-on bags. Solid fuel fire starters are prohibited in all baggage. Plain metal ferro rods may be allowed in checked bags — check with TSA.' },
      { question: 'Can I bring a ferro rod on a plane?', answer: 'Plain metal ferro rods (without flammable material) may be allowed in checked baggage. They are not permitted in carry-on. Always confirm with TSA before travel.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/camping-equipment' }]
  },
  {
    id: 'sleeping-bag', slug: 'sleeping-bag', name: 'Sleeping Bag', category: 'Camping', subcategory: 'Gear',
    aliases: ['camp sleeping bag', 'travel sleeping bag', 'mummy bag', 'backpacking sleeping bag'],
    keywords: ['sleeping bag', 'camp gear', 'backpacking', 'mummy bag', 'camping'],
    description: 'TSA rules for sleeping bags on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Sleeping bags are allowed in carry-on baggage if they fit within the airline\'s overhead bin size limits. Most compressed sleeping bags fit as carry-on.', conditions: ['Must fit within airline carry-on size limits when compressed', 'Bulky bags may need to be checked'], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Sleeping bags are fully allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring a sleeping bag on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Compress your sleeping bag into its stuff sack for carry-on to save space', 'Large sleeping bags are best checked in to avoid overhead bin space issues'],
    relatedItems: ['tent-pegs', 'camping-stove', 'hiking-poles'],
    faq: [
      { question: 'Can I bring a sleeping bag on a plane?', answer: 'Yes, sleeping bags are allowed in carry-on and checked baggage. If compressed it must fit the airline\'s carry-on size limit.' },
      { question: 'Can a sleeping bag be a carry-on item?', answer: 'Yes, if compressed into its stuff sack and within airline carry-on size limits. Most airlines allow 22x14x9 inches.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },

  // SPORTS ────────────────────────────────────────────────────────────────────
  {
    id: 'yoga-mat', slug: 'yoga-mat', name: 'Yoga Mat', category: 'Sports', subcategory: 'Fitness',
    aliases: ['exercise mat', 'fitness mat', 'gym mat'],
    keywords: ['yoga mat', 'exercise mat', 'fitness', 'gym', 'workout'],
    description: 'TSA rules for yoga mats on planes.',
    carryOn: { status: 'RESTRICTED', reason: 'Yoga mats are allowed in carry-on baggage if they fit within the airline\'s overhead bin dimensions when rolled or folded. Most airlines allow yoga mats as an additional personal item.', conditions: ['Must fit overhead bin or under seat dimensions', 'Some airlines allow as a free additional item — check your airline policy'], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Yoga mats are fully allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring a yoga mat on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Carry a travel-size yoga mat as a personal item', 'Check your specific airline\'s policy on yoga mats as extra carry-on items'],
    relatedItems: ['dumbbells', 'tennis-racket', 'sports'],
    faq: [
      { question: 'Can I bring a yoga mat on a plane?', answer: 'Yes, yoga mats are allowed in carry-on and checked bags. They must fit within overhead bin dimensions or your airline may allow it as a free extra item.' },
      { question: 'Do I have to pay to check a yoga mat?', answer: 'A yoga mat counts as checked baggage if you check it — standard checked bag fees apply. Many airlines allow it as a personal item if it\'s a travel size mat.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },
  {
    id: 'jump-rope', slug: 'jump-rope', name: 'Jump Rope', category: 'Sports', subcategory: 'Fitness',
    aliases: ['skipping rope', 'speed rope', 'skipping cord'],
    keywords: ['jump rope', 'skipping rope', 'fitness', 'exercise', 'workout'],
    description: 'TSA rules for jump ropes on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Jump ropes and skipping ropes are allowed in carry-on baggage. TSA does not classify them as weapons.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Jump ropes are allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring a jump rope on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Jump ropes are a great travel workout tool — lightweight and carry-on friendly'],
    relatedItems: ['yoga-mat', 'dumbbells', 'tennis-racket'],
    faq: [
      { question: 'Can I bring a jump rope on a plane?', answer: 'Yes, jump ropes are fully allowed in carry-on and checked baggage.' },
      { question: 'Will TSA allow a jump rope in carry-on?', answer: 'Yes, TSA permits jump ropes in carry-on bags. They are not classified as weapons.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },

  // DOCUMENTS / MISC ──────────────────────────────────────────────────────────
  {
    id: 'gift-cards', slug: 'gift-cards', name: 'Gift Cards', category: 'Documents', subcategory: 'Financial',
    aliases: ['store gift card', 'prepaid card', 'visa gift card', 'amazon gift card'],
    keywords: ['gift cards', 'prepaid card', 'store card', 'voucher'],
    description: 'TSA rules for gift cards on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Gift cards and prepaid cards are fully allowed in carry-on baggage with no restrictions.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Gift cards are allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring gift cards on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Gift cards are allowed on planes — keep them in your wallet or carry-on for safekeeping'],
    relatedItems: ['cash', 'passport', 'boarding-pass'],
    faq: [
      { question: 'Can I bring gift cards on a plane?', answer: 'Yes, gift cards are fully allowed in carry-on and checked baggage with no restrictions.' },
      { question: 'Do gift cards need to be declared at customs?', answer: 'Gift cards generally do not need to be declared unless they represent substantial monetary value — check your destination country\'s customs rules.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  },
  {
    id: 'umbrella', slug: 'umbrella', name: 'Umbrella', category: 'Tools', subcategory: 'General',
    aliases: ['compact umbrella', 'folding umbrella', 'travel umbrella', 'rain umbrella'],
    keywords: ['umbrella', 'compact umbrella', 'folding umbrella', 'rain', 'travel'],
    description: 'TSA rules for umbrellas on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Umbrellas are allowed in carry-on baggage. Compact folding umbrellas easily fit in personal items.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Umbrellas are allowed in checked baggage.', conditions: [], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/umbrella', lastVerified: '2026-07-01', pageTitle: 'Can I bring an umbrella on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/umbrella', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Compact travel umbrellas are ideal carry-on items', 'Full-size golf umbrellas may need to be checked depending on size'],
    relatedItems: ['shoes', 'boots'],
    faq: [
      { question: 'Can I bring an umbrella on a plane?', answer: 'Yes, umbrellas of all types are allowed in carry-on and checked bags. Compact umbrellas fit easily in personal items.' },
      { question: 'Do I need to remove my umbrella at TSA security?', answer: 'No, umbrellas can stay in your bag. TSA may ask you to remove it if the X-ray image is unclear.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/umbrella' }]
  },
  {
    id: 'lock', slug: 'lock', name: 'Lock', category: 'Tools', subcategory: 'Security',
    aliases: ['padlock', 'tsa lock', 'combination lock', 'luggage lock', 'key lock'],
    keywords: ['lock', 'padlock', 'tsa lock', 'combination lock', 'luggage lock', 'security'],
    description: 'TSA rules for padlocks and luggage locks on planes.',
    carryOn: { status: 'ALLOWED', reason: 'Padlocks and combination locks are allowed in carry-on and checked baggage. TSA-approved locks (with TSA key access) are recommended for checked bags.', conditions: [], exceptions: [] },
    checkedBag: { status: 'ALLOWED', reason: 'Locks are allowed on checked baggage. TSA-approved locks are strongly recommended since TSA may need to open your bag for inspection.', conditions: ['Use TSA-approved locks (marked with a red diamond TSA logo) to allow inspection without breaking the lock'], exceptions: [] },
    tsa: { officialUrl: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', lastVerified: '2026-07-01', pageTitle: 'Can I bring a lock on a plane?' },
    faa: { officialUrl: 'https://www.faa.gov/hazmat/packsafe', applicable: false },
    sources: [{ name: 'TSA', url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all', verified: '2026-07-01', priority: 1 }],
    airlines: [], international: {},
    travelTips: ['Use only TSA-approved locks on checked baggage — non-TSA locks can be cut off during security inspection'],
    relatedItems: ['passport', 'cash', 'jewelry'],
    faq: [
      { question: 'Can I use a lock on my checked luggage?', answer: 'Yes, you can use a lock. TSA-approved locks (with the red diamond logo) are strongly recommended — TSA can open them with a master key without damaging them.' },
      { question: 'Can I bring a padlock in my carry-on?', answer: 'Yes, padlocks are allowed in carry-on baggage.' }
    ],
    metadata: { lastReviewed: '2026-07-01', nextReviewDue: '2027-07-01', reviewIntervalMonths: 12, editor: 'BringOnPlane Editorial Team', version: '1.0.0' },
    ruleHistory: [{ effectiveDate: '2026-07-01', change: 'Initial item database entry.', source: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' }]
  }
];

// ─── Write JSON files ────────────────────────────────────────────────────────
let created = 0;
let skipped = 0;

for (const item of newItems) {
  const catSlug = item.category.toLowerCase().trim().replace(/\s+/g, '-');
  const dir = path.join(DATA_DIR, catSlug);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  📁 Created category dir: ${catSlug}`);
  }
  
  const filePath = path.join(dir, `${item.slug}.json`);
  if (fs.existsSync(filePath)) {
    console.log(`  ⏭  Skipping (already exists): ${item.slug}`);
    skipped++;
    continue;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(item, null, 2), 'utf8');
  console.log(`  ✅ Created: ${catSlug}/${item.slug}.json`);
  created++;
}

// ─── Update metadata-summary.json ───────────────────────────────────────────
const existing = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));
const existingSlugs = new Set(existing.map(e => e.slug));

const newSummaries = newItems
  .filter(item => !existingSlugs.has(item.slug))
  .map(item => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    aliases: item.aliases,
    keywords: item.keywords,
    carryOn: item.carryOn.status,
    checked: item.checkedBag.status,
    lastReviewed: item.metadata.lastReviewed
  }));

if (newSummaries.length > 0) {
  const updated = [...existing, ...newSummaries].sort((a, b) => a.slug.localeCompare(b.slug));
  fs.writeFileSync(METADATA_PATH, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`\n  📝 Updated metadata-summary.json with ${newSummaries.length} new entries`);
} else {
  console.log('\n  ℹ️  No new entries to add to metadata-summary.json');
}

console.log(`\n✨ Done! Created: ${created}, Skipped: ${skipped}, Total items: ${existing.length + newSummaries.length}`);
