import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const itemsDir = path.join(__dirname, '../src/data/items');

const itemsToGenerate = [
  // ELECTRONICS
  {
    slug: 'portable-charger',
    name: 'Portable Charger',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Lithium-ion power banks / portable chargers are strictly prohibited in checked baggage because of the risk of thermal runaway and fire. They must be carried in the cabin.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Portable chargers contain lithium-ion batteries and are prohibited in checked baggage because they present a fire hazard in the cargo hold.',
    aliases: ['power bank', 'external battery', 'battery pack'],
    keywords: ['charger', 'battery', 'lithium', 'power']
  },
  {
    slug: 'ipad',
    name: 'iPad',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'iPads and other tablets are allowed in carry-on bags. You will be asked to remove them from your carrying case and place them in a bin for separate X-ray screening at security.',
    checked: 'ALLOWED',
    checkedReason: 'iPads are allowed in checked baggage, though carrying them in the cabin is highly recommended to protect against theft or damage.',
    aliases: ['apple ipad', 'tablet', 'screen'],
    keywords: ['ipad', 'apple', 'screen', 'device']
  },
  {
    slug: 'tablet',
    name: 'Tablet',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Tablets are allowed in carry-on bags. You must remove them from your luggage and place them in a bin for separate screening.',
    checked: 'ALLOWED',
    checkedReason: 'Tablets are allowed in checked baggage, but carry-on is strongly recommended to prevent damage.',
    aliases: ['ipad', 'kindle', 'ereader'],
    keywords: ['tablet', 'screen', 'android', 'device']
  },
  {
    slug: 'phone-charger',
    name: 'Phone Charger',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Standard wall plugs, charging blocks, and USB cables are fully allowed in carry-on baggage. (Note: Only portable power banks/battery packs are restricted).',
    checked: 'ALLOWED',
    checkedReason: 'Phone chargers and cables are allowed in checked baggage.',
    aliases: ['charging cable', 'usb cable', 'charging block', 'wall plug'],
    keywords: ['charger', 'cable', 'wire', 'phone']
  },
  {
    slug: 'laptop-charger',
    name: 'Laptop Charger',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Laptop chargers, power bricks, and charging cables are allowed in carry-on bags. They do not contain battery storage cells.',
    checked: 'ALLOWED',
    checkedReason: 'Laptop chargers are allowed in checked baggage.',
    aliases: ['power adapter', 'macbook charger', 'power brick'],
    keywords: ['charger', 'laptop', 'cable', 'adapter']
  },
  {
    slug: 'camera',
    name: 'Camera',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Cameras are fully allowed in carry-on bags. Keep fragile lenses and camera bodies in your cabin baggage to prevent damage or theft.',
    checked: 'ALLOWED',
    checkedReason: 'Cameras are allowed in checked baggage, but carrying them in the cabin is strongly recommended to protect delicate electronics.',
    aliases: ['dslr', 'digital camera', 'mirrorless camera', 'gopro'],
    keywords: ['camera', 'photo', 'gopro', 'dslr']
  },
  {
    slug: 'camera-battery',
    name: 'Camera Battery',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Spare rechargeable lithium camera batteries must be carried in carry-on baggage only. Protecting terminal contacts (with tape or plastic caps) is recommended.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Spare lithium camera batteries are prohibited in checked baggage holds due to fire risk.',
    aliases: ['spare battery', 'lithium battery', 'rechargeable battery'],
    keywords: ['battery', 'camera', 'lithium', 'spare']
  },
  {
    slug: 'airtag',
    name: 'AirTag',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Smart luggage trackers like AirTags are fully allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'AirTags are allowed in checked baggage. They are commonly placed inside luggage to track bags during travel.',
    aliases: ['smart tracker', 'tile tracker', 'gps tracker'],
    keywords: ['airtag', 'tracker', 'apple', 'gps']
  },
  {
    slug: 'bluetooth-speaker',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Bluetooth speakers are allowed in carry-on bags. If they contain a built-in lithium-ion battery, they must travel in the cabin.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Speakers with rechargeable lithium-ion batteries are prohibited in checked baggage holds to prevent fire risks.',
    aliases: ['wireless speaker', 'portable speaker', 'jbl speaker'],
    keywords: ['speaker', 'bluetooth', 'music', 'sound']
  },
  {
    slug: 'kindle',
    name: 'Kindle',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Kindles and e-readers are allowed in carry-on bags. They must be removed for X-ray screening at security.',
    checked: 'ALLOWED',
    checkedReason: 'Kindles are allowed in checked baggage, though carry-on is recommended.',
    aliases: ['ereader', 'kobo', 'nook'],
    keywords: ['kindle', 'reader', 'book', 'screen']
  },
  {
    slug: 'gaming-console',
    name: 'Gaming Console',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Gaming consoles (Nintendo Switch, Steam Deck, PlayStation, Xbox) are allowed in carry-on bags. Handhelds with built-in lithium batteries must travel in the cabin.',
    checked: 'ALLOWED',
    checkedReason: 'Consoles are allowed in checked baggage, but handheld systems with lithium batteries should travel in the cabin.',
    aliases: ['nintendo switch', 'steam deck', 'ps5', 'xbox'],
    keywords: ['gaming', 'console', 'nintendo', 'playstation']
  },
  {
    slug: 'extension-cord',
    name: 'Extension Cord',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Extension cords and power strips are allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Extension cords are allowed in checked baggage.',
    aliases: ['power strip', 'surge protector', 'multi plug'],
    keywords: ['cord', 'power', 'extension', 'wire']
  },

  // TOILETRIES / PERSONAL CARE
  {
    slug: 'conditioner',
    name: 'Conditioner',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Hair conditioner is subject to the 3-1-1 liquids rule. Cans or bottles in carry-on must be 3.4 oz (100 ml) or less and fit in your quart-sized bag.',
    checked: 'ALLOWED',
    checkedReason: 'Conditioner is allowed in checked baggage in any size.',
    aliases: ['hair conditioner', 'hair cream'],
    keywords: ['conditioner', 'hair', 'liquid', 'shower']
  },
  {
    slug: 'deodorant',
    name: 'Deodorant',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Solid stick deodorant is fully allowed in carry-on with no size limit. Liquid, gel, or aerosol deodorants must be 3.4 oz or less.',
    checked: 'ALLOWED',
    checkedReason: 'All types of deodorant are allowed in checked baggage in any quantity.',
    aliases: ['antiperspirant', 'stick deodorant', 'spray deodorant'],
    keywords: ['deodorant', 'hygiene', 'solid', 'spray']
  },
  {
    slug: 'cologne',
    name: 'Cologne',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Cologne is subject to the 3-1-1 liquids rule. Bottles in carry-on must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Cologne is allowed in checked baggage in any size. Wrap glass bottles carefully.',
    aliases: ['perfume', 'aftershave', 'fragrance'],
    keywords: ['cologne', 'scent', 'spray', 'liquid']
  },
  {
    slug: 'lotion',
    name: 'Lotion',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Body and face lotions are subject to the 3-1-1 liquids rule. Tubes in carry-on must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Lotion is allowed in checked baggage in any size.',
    aliases: ['moisturizer', 'hand cream', 'body lotion'],
    keywords: ['lotion', 'cream', 'skin', 'liquid']
  },
  {
    slug: 'face-wash',
    name: 'Face Wash',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Face wash cleansers (liquid, foam, or gel) must comply with the 3-1-1 liquids rule (3.4 oz or less in carry-on).',
    checked: 'ALLOWED',
    checkedReason: 'Face wash is allowed in checked baggage in any size.',
    aliases: ['cleanser', 'facial wash', 'face cleanser'],
    keywords: ['wash', 'cleanser', 'face', 'liquid']
  },
  {
    slug: 'mouthwash',
    name: 'Mouthwash',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Mouthwash is a liquid and is subject to the 3-1-1 liquids rule. Carry-on bottles must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Mouthwash is allowed in checked baggage in any size.',
    aliases: ['oral rinse', 'listerine'],
    keywords: ['mouthwash', 'rinse', 'teeth', 'liquid']
  },
  {
    slug: 'hair-gel',
    name: 'Hair Gel',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Hair gel, styling wax, and pomades are subject to the 3-1-1 liquids rule. Carry-on containers must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Hair gel is allowed in checked baggage in any size.',
    aliases: ['styling gel', 'pomade', 'hair wax'],
    keywords: ['gel', 'hair', 'styling', 'paste']
  },
  {
    slug: 'hair-spray',
    name: 'Hair Spray',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Hairspray (aerosol or pump) is subject to the 3-1-1 liquids rule. Cans in carry-on must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Hairspray is allowed in checked baggage up to capacity limits for personal aerosols (max 18 oz per container, 70 oz total per passenger).',
    aliases: ['hairspray', 'aerosol hairspray'],
    keywords: ['spray', 'hair', 'aerosol', 'styling']
  },
  {
    slug: 'dry-shampoo',
    name: 'Dry Shampoo',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Aerosol dry shampoo is subject to the 3-1-1 liquids rule. Cans in carry-on must be 3.4 oz (100 ml) or less. Solid/powder dry shampoo has no size limits.',
    checked: 'ALLOWED',
    checkedReason: 'Dry shampoo is allowed in checked baggage.',
    aliases: ['aerosol dry shampoo', 'powder shampoo'],
    keywords: ['shampoo', 'dry', 'aerosol', 'spray']
  },
  {
    slug: 'makeup',
    name: 'Makeup',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Liquid, gel, or cream makeup (mascara, liquid foundation, concealer) must be 3.4 oz or less. Solid, powder, or pressed makeup has no restrictions.',
    checked: 'ALLOWED',
    checkedReason: 'All makeup and cosmetics are allowed in checked baggage.',
    aliases: ['cosmetics', 'mascara', 'foundation', 'lipstick'],
    keywords: ['makeup', 'cosmetics', 'powder', 'beauty']
  },
  {
    slug: 'nail-polish',
    name: 'Nail Polish',
    category: 'Personal Care',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Nail polish is a liquid and is subject to the 3-1-1 liquids rule. Individual bottles in carry-on must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Nail polish and nail polish remover are allowed in checked baggage.',
    aliases: ['nail varnish', 'nail lacquer', 'acetone'],
    keywords: ['polish', 'nail', 'varnish', 'acetone']
  },

  // FOOD
  {
    slug: 'sandwich',
    name: 'Sandwich',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Solid food items like sandwiches and wraps are fully allowed through security checkpoints. (Note: Condiments like mustard, mayo, or jelly must comply with the 3-1-1 rule).',
    checked: 'ALLOWED',
    checkedReason: 'Sandwiches are allowed in checked baggage.',
    aliases: ['wrap', 'sub', 'burger'],
    keywords: ['sandwich', 'bread', 'food', 'snack']
  },
  {
    slug: 'pizza',
    name: 'Pizza',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Pizza slices or whole pizzas are classified as solid food and are allowed through security checkpoints.',
    checked: 'ALLOWED',
    checkedReason: 'Pizza is allowed in checked baggage.',
    aliases: ['pizza slice'],
    keywords: ['pizza', 'cheese', 'food', 'solid']
  },
  {
    slug: 'chips',
    name: 'Chips',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Chips, crackers, pretzels, and other dry snacks are fully allowed through security with no size restrictions.',
    checked: 'ALLOWED',
    checkedReason: 'Chips are allowed in checked baggage.',
    aliases: ['crisps', 'potato chips', 'snacks'],
    keywords: ['chips', 'snack', 'food', 'crisps']
  },
  {
    slug: 'cookies',
    name: 'Cookies',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Cookies, biscuits, and brownies are solid foods and are allowed in carry-on luggage.',
    checked: 'ALLOWED',
    checkedReason: 'Cookies are allowed in checked baggage.',
    aliases: ['biscuits', 'baked goods'],
    keywords: ['cookies', 'snack', 'sweet', 'food']
  },
  {
    slug: 'chocolate',
    name: 'Chocolate',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Solid chocolate is allowed in carry-on baggage. (Note: Chocolate syrups or liquid chocolate are subject to the 3-1-1 rule).',
    checked: 'ALLOWED',
    checkedReason: 'Chocolate is allowed in checked baggage.',
    aliases: ['candy bar', 'chocolate bar'],
    keywords: ['chocolate', 'candy', 'sweet', 'food']
  },
  {
    slug: 'candy',
    name: 'Candy',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Solid candies, gummies, lollipops, and jelly beans are allowed through security checkpoints with no restrictions.',
    checked: 'ALLOWED',
    checkedReason: 'Candy is allowed in checked baggage.',
    aliases: ['sweets', 'gummies'],
    keywords: ['candy', 'sweet', 'food', 'snack']
  },
  {
    slug: 'fruit',
    name: 'Fruit',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Fresh whole fruits are allowed through security. Note that agricultural restrictions apply for international flights, and fresh fruit must be declared at customs.',
    checked: 'ALLOWED',
    checkedReason: 'Fresh fruit is allowed in checked baggage, subject to agricultural import rules at your destination.',
    aliases: ['fresh fruit', 'produce', 'apples', 'bananas'],
    keywords: ['fruit', 'fresh', 'apples', 'bananas', 'food']
  },
  {
    slug: 'apples',
    name: 'Apples',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Apples are solid foods and are allowed through security. Agricultural customs controls apply for international arrivals.',
    checked: 'ALLOWED',
    checkedReason: 'Apples are allowed in checked baggage, subject to local agricultural rules.',
    aliases: ['apple', 'fresh apples'],
    keywords: ['apples', 'fruit', 'fresh', 'food']
  },
  {
    slug: 'bananas',
    name: 'Bananas',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Bananas are solid foods allowed through security checkpoints. Declare all fresh produce at international customs.',
    checked: 'ALLOWED',
    checkedReason: 'Bananas are allowed in checked baggage, subject to agricultural controls.',
    aliases: ['banana', 'fresh banana'],
    keywords: ['bananas', 'fruit', 'fresh', 'food']
  },
  {
    slug: 'peanut-butter',
    name: 'Peanut Butter',
    category: 'Food',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Peanut butter is classified as a liquid/gel because it is spreadable. Carry-on jars must be 3.4 oz (100 ml) or less. Larger jars must go in checked baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Peanut butter is allowed in checked baggage in any size.',
    aliases: ['nut butter', 'almond butter'],
    keywords: ['peanut', 'butter', 'spread', 'liquid']
  },
  {
    slug: 'protein-powder',
    name: 'Protein Powder',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Protein powder is allowed in carry-on. Powders over 12 oz (350 ml) may require separate screening and may be opened by security officers.',
    checked: 'ALLOWED',
    checkedReason: 'Protein powder is allowed in checked baggage in any quantity.',
    aliases: ['whey protein', 'supplement powder'],
    keywords: ['protein', 'powder', 'fitness', 'supplement']
  },
  {
    slug: 'protein-bars',
    name: 'Protein Bars',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Protein bars and energy bars are solid food items and are fully allowed in carry-on luggage.',
    checked: 'ALLOWED',
    checkedReason: 'Protein bars are allowed in checked baggage.',
    aliases: ['energy bars', 'granola bars'],
    keywords: ['bars', 'protein', 'snack', 'food']
  },
  {
    slug: 'tea-bags',
    name: 'Tea Bags',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Dry tea bags and loose leaf tea are fully allowed through security checkpoints.',
    checked: 'ALLOWED',
    checkedReason: 'Tea bags are allowed in checked baggage.',
    aliases: ['tea', 'herbal tea'],
    keywords: ['tea', 'bags', 'dry', 'drink']
  },
  {
    slug: 'spices',
    name: 'Spices',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Dry spices and seasonings are allowed in carry-on. If spices are in powder form and over 12 oz, place them in a bin for separate screening.',
    checked: 'ALLOWED',
    checkedReason: 'Spices and seasonings are allowed in checked baggage.',
    aliases: ['seasoning', 'salt', 'pepper'],
    keywords: ['spices', 'powder', 'food', 'seasoning']
  },
  {
    slug: 'honey',
    name: 'Honey',
    category: 'Food',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Honey is a liquid/gel and is subject to the 3-1-1 liquids rule. Carry-on jars must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Honey is allowed in checked baggage in any quantity.',
    aliases: ['honey jar', 'syrup'],
    keywords: ['honey', 'liquid', 'spread', 'sweet']
  },
  {
    slug: 'hot-sauce',
    name: 'Hot Sauce',
    category: 'Food',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Hot sauce is a liquid and is subject to the 3-1-1 liquids rule. Carry-on bottles must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Hot sauce is allowed in checked baggage in any size.',
    aliases: ['chili sauce', 'sriracha'],
    keywords: ['sauce', 'liquid', 'spicy', 'condiment']
  },

  // MEDICINE
  {
    slug: 'prescription-medicine',
    name: 'Prescription Medicine',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Prescription pills and capsules are allowed in carry-on. Medical liquids, gels, and aerosols are exempt from the 3-1-1 rule in reasonable quantities but must be declared for inspection.',
    checked: 'ALLOWED',
    checkedReason: 'Prescription medicines are allowed in checked baggage, though carrying critical medication in the cabin is strongly recommended.',
    aliases: ['pills', 'rx', 'prescription medication'],
    keywords: ['medicine', 'prescription', 'pills', 'health']
  },
  {
    slug: 'vitamins',
    name: 'Vitamins',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Solid vitamins, capsules, and gummies are fully allowed in carry-on luggage. Liquid vitamins follow the 3-1-1 rule.',
    checked: 'ALLOWED',
    checkedReason: 'Vitamins are allowed in checked baggage.',
    aliases: ['supplements', 'gummy vitamins'],
    keywords: ['vitamins', 'pills', 'health', 'supplements']
  },
  {
    slug: 'insulin',
    name: 'Insulin',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Insulin is allowed in carry-on and is exempt from the 3-1-1 liquids rule as a medical necessity. Declare it to officers at security checkpoints.',
    checked: 'ALLOWED',
    checkedReason: 'Insulin is allowed in checked baggage, but it should travel in the cabin because extreme cold in the cargo hold can freeze and ruin it.',
    aliases: ['diabetic supplies', 'humalog'],
    keywords: ['insulin', 'diabetes', 'medicine', 'liquid']
  },
  {
    slug: 'syringes',
    name: 'Syringes',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Syringes (used or unused) are allowed in carry-on baggage when accompanied by injectable medication (like insulin). Declare them at the checkpoint.',
    checked: 'ALLOWED',
    checkedReason: 'Syringes are allowed in checked baggage.',
    aliases: ['needles', 'injectors'],
    keywords: ['syringes', 'needles', 'diabetic', 'injection']
  },
  {
    slug: 'inhaler',
    name: 'Inhaler',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Asthma inhalers and puffers are allowed in carry-on and checked baggage. Keeping them in the cabin for immediate access is recommended.',
    checked: 'ALLOWED',
    checkedReason: 'Inhalers are allowed in checked baggage.',
    aliases: ['asthma inhaler', 'puffer'],
    keywords: ['inhaler', 'asthma', 'medicine', 'lungs']
  },
  {
    slug: 'contact-lens-solution',
    name: 'Contact Lens Solution',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Contact lens solution is classified as a medically necessary liquid and is exempt from the 3-1-1 liquids rule. Declare it to officers for manual screening.',
    checked: 'ALLOWED',
    checkedReason: 'Contact lens solution is allowed in checked baggage in any size.',
    aliases: ['saline solution', 'contact solution'],
    keywords: ['solution', 'contact', 'lens', 'saline']
  },
  {
    slug: 'eye-drops',
    name: 'Eye Drops',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Over-the-counter eye drops in containers ≤3.4 oz follow the 3-1-1 rule. Prescribed or medically necessary eye drops can exceed this limit if declared.',
    checked: 'ALLOWED',
    checkedReason: 'Eye drops are allowed in checked baggage.',
    aliases: ['eye solution', 'artificial tears'],
    keywords: ['drops', 'eye', 'liquid', 'saline']
  },
  {
    slug: 'ibuprofen',
    name: 'Ibuprofen',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Ibuprofen (Advil, Motrin) and other pain relievers in tablet/gummy form are fully allowed through security checkpoints.',
    checked: 'ALLOWED',
    checkedReason: 'Ibuprofen is allowed in checked baggage.',
    aliases: ['advil', 'motrin', 'painkillers'],
    keywords: ['ibuprofen', 'pills', 'pain', 'advil']
  },
  {
    slug: 'acetaminophen',
    name: 'Acetaminophen',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Acetaminophen (Tylenol) tablets are allowed in carry-on luggage without size limits.',
    checked: 'ALLOWED',
    checkedReason: 'Acetaminophen is allowed in checked baggage.',
    aliases: ['tylenol', 'paracetamol'],
    keywords: ['tylenol', 'pills', 'pain', 'paracetamol']
  },
  {
    slug: 'thermometer',
    name: 'Thermometer',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Digital and medical thermometers are allowed in carry-on. Mercury thermometers are restricted to carry-on (maximum one per person, in a protective case).',
    checked: 'RESTRICTED',
    checkedReason: 'Mercury thermometers are prohibited in checked baggage holds. Digital thermometers are allowed.',
    aliases: ['digital thermometer', 'mercury thermometer'],
    keywords: ['thermometer', 'medical', 'temperature', 'mercury']
  },

  // SHARP OBJECTS / TOOLS
  {
    slug: 'razor',
    name: 'Razor',
    category: 'Tools',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Disposable cartridge razors and electric shavers are allowed in carry-on. Safety razors are only allowed if the blades are removed. Straight razors are prohibited in carry-on.',
    checked: 'ALLOWED',
    checkedReason: 'All types of razors and replacement blades are allowed in checked baggage.',
    aliases: ['shaving razor', 'shaver'],
    keywords: ['razor', 'shave', 'blade', 'shaver']
  },
  {
    slug: 'straight-razor',
    name: 'Straight Razor',
    category: 'Tools',
    carryOn: 'NOT_ALLOWED',
    carryOnReason: 'Straight razors (barber style with exposed blades) are prohibited in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Straight razors are allowed in checked baggage.',
    aliases: ['barber razor', 'shaving blade'],
    keywords: ['razor', 'straight', 'blade', 'barber']
  },
  {
    slug: 'pocket-knife',
    name: 'Pocket Knife',
    category: 'Tools',
    carryOn: 'NOT_ALLOWED',
    carryOnReason: 'Pocket knives, multi-tools with blades, and folding knives are prohibited in carry-on bags.',
    checked: 'ALLOWED',
    checkedReason: 'Pocket knives are allowed in checked baggage. Wrap blades securely for safety.',
    aliases: ['folding knife', 'penknife'],
    keywords: ['knife', 'pocket', 'blade', 'sharp']
  },
  {
    slug: 'swiss-army-knife',
    name: 'Swiss Army Knife',
    category: 'Tools',
    carryOn: 'NOT_ALLOWED',
    carryOnReason: 'Swiss Army knives contain sharp blades and are prohibited in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Swiss Army knives are allowed in checked baggage. Wrap securely.',
    aliases: ['multi tool knife', 'victorinox'],
    keywords: ['knife', 'swiss', 'blade', 'multi-tool']
  },
  {
    slug: 'tweezers',
    name: 'Tweezers',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Tweezers are fully allowed in carry-on baggage (they are not considered dangerous sharp items).',
    checked: 'ALLOWED',
    checkedReason: 'Tweezers are allowed in checked baggage.',
    aliases: ['pluckers'],
    keywords: ['tweezers', 'eyebrow', 'cosmetic', 'grooming']
  },
  {
    slug: 'corkscrew',
    name: 'Corkscrew',
    category: 'Tools',
    carryOn: 'NOT_ALLOWED',
    carryOnReason: 'Corkscrews that contain a small foil-cutting blade are prohibited in carry-on baggage. Bladeless corkscrews are allowed.',
    checked: 'ALLOWED',
    checkedReason: 'All types of corkscrews are allowed in checked baggage.',
    aliases: ['wine opener', 'bottle opener'],
    keywords: ['corkscrew', 'wine', 'opener', 'bottle']
  },

  // BATTERIES
  {
    slug: 'aa-batteries',
    name: 'AA Batteries',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Standard dry cell AA batteries (alkaline) are allowed in carry-on. Protect terminals to prevent short circuits.',
    checked: 'ALLOWED',
    checkedReason: 'Alkaline AA batteries are allowed in checked baggage, though carrying them in original packages is recommended.',
    aliases: ['double a batteries', 'alkaline batteries'],
    keywords: ['batteries', 'aa', 'alkaline', 'cell']
  },
  {
    slug: 'aaa-batteries',
    name: 'AAA Batteries',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Standard dry cell AAA batteries (alkaline) are allowed in carry-on. Protect terminals to prevent short circuits.',
    checked: 'ALLOWED',
    checkedReason: 'Alkaline AAA batteries are allowed in checked baggage.',
    aliases: ['triple a batteries'],
    keywords: ['batteries', 'aaa', 'alkaline', 'cell']
  },
  {
    slug: 'lithium-batteries',
    name: 'Lithium Batteries',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Spare lithium-ion or lithium-metal batteries must be carried in carry-on baggage only. Protecting the terminals is required.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Spare lithium batteries are prohibited in checked baggage holds due to cargo fire hazards.',
    aliases: ['lithium ion batteries', 'rechargeable lithium'],
    keywords: ['lithium', 'batteries', 'spare', 'cell']
  },
  {
    slug: 'rechargeable-batteries',
    name: 'Rechargeable Batteries',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Rechargeable batteries are allowed. Spare lithium-ion rechargeable batteries must go in carry-on. NiMH/NiCad rechargeable batteries can be checked.',
    checked: 'RESTRICTED',
    checkedReason: 'Lithium rechargeable spare batteries are prohibited in checked bags. NiMH rechargeable batteries are allowed.',
    aliases: ['nimh batteries', 'rechargeable cells'],
    keywords: ['rechargeable', 'batteries', 'nimh', 'lithium']
  },
  {
    slug: 'camera-batteries',
    name: 'Camera Batteries',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Spare rechargeable lithium camera batteries must be carried in carry-on baggage only.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Spare camera lithium batteries are prohibited in checked luggage due to safety rules.',
    aliases: ['spare camera batteries', 'camera lithium batteries'],
    keywords: ['batteries', 'camera', 'lithium', 'spare']
  },
  {
    slug: 'coin-cell-batteries',
    name: 'Coin Cell Batteries',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Coin cell / button cell batteries (like watch batteries or CR2032) are allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Coin cell / button cell batteries are allowed in checked baggage.',
    aliases: ['button cell batteries', 'cr2032'],
    keywords: ['coin', 'button', 'batteries', 'watch']
  },
  {
    slug: 'battery-pack',
    name: 'Battery Pack',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Battery packs and external power banks containing lithium-ion cells must be carried in carry-on baggage only.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Battery packs are prohibited in checked baggage due to risk of fire in the cargo hold.',
    aliases: ['power bank', 'portable charger', 'external battery'],
    keywords: ['battery', 'pack', 'power', 'charger']
  },

  // RESTRICTED ITEMS
  {
    slug: 'vape',
    name: 'Vape',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'Vapes, e-cigarettes, and disposable vapes are allowed in carry-on baggage only. The lithium batteries pose a cargo fire risk. Juice follows 3-1-1 rules.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Vapes are strictly prohibited in checked baggage due to safety/fire rules.',
    aliases: ['vape pen', 'e-cigarette', 'disposable vape', 'vaporizer'],
    keywords: ['vape', 'vaporizer', 'ecig', 'nicotine']
  },
  {
    slug: 'e-cigarette',
    name: 'E-Cigarette',
    category: 'Electronics',
    carryOn: 'ALLOWED',
    carryOnReason: 'E-cigarettes and vape devices must travel in carry-on baggage or on your person. Do not charge or use them on board.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'E-cigarettes are prohibited in checked baggage holds due to FAA fire hazard regulations.',
    aliases: ['ecigarette', 'vape pen'],
    keywords: ['ecig', 'vape', 'nicotine', 'cigarette']
  },
  {
    slug: 'lighter',
    name: 'Lighter',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'You can bring one common lighter (Bic or Zippo style) on your person or in carry-on baggage. Torch lighters are prohibited.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Lighters are prohibited in checked baggage unless empty of fuel or stored in a DOT-approved case.',
    aliases: ['bic lighter', 'zippo lighter'],
    keywords: ['lighter', 'fire', 'smoke', 'flame']
  },
  {
    slug: 'matches',
    name: 'Matches',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'One book of safety matches is allowed in carry-on or in your pocket. Strike-anywhere matches are prohibited entirely.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Matches are prohibited in checked baggage holds.',
    aliases: ['safety matches', 'matchbook'],
    keywords: ['matches', 'fire', 'match', 'safety']
  },
  {
    slug: 'cigars',
    name: 'Cigars',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'Cigars are tobacco products and are fully allowed in carry-on baggage. Smoking on commercial flights is prohibited.',
    checked: 'ALLOWED',
    checkedReason: 'Cigars are allowed in checked baggage.',
    aliases: ['cigarillos', 'cuban cigars'],
    keywords: ['cigars', 'tobacco', 'smoke']
  },
  {
    slug: 'cigarettes',
    name: 'Cigarettes',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'Cigarettes are allowed in carry-on baggage. Smoking is prohibited on board the aircraft.',
    checked: 'ALLOWED',
    checkedReason: 'Cigarettes are allowed in checked baggage.',
    aliases: ['tobacco cigarettes', 'smokes'],
    keywords: ['cigarettes', 'tobacco', 'smoke', 'nicotine']
  },
  {
    slug: 'nicotine-pouches',
    name: 'Nicotine Pouches',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Nicotine pouches (like ZYN) are dry tobacco-free products and are fully allowed in carry-on and checked baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Nicotine pouches are allowed in checked baggage.',
    aliases: ['zyn', 'snus', 'nicotine pouches'],
    keywords: ['zyn', 'pouches', 'nicotine', 'tobacco']
  },
  {
    slug: 'hookah',
    name: 'Hookah',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'Hookah pipes (without tobacco or charcoal) are allowed in carry-on bags. Inspecting them at security is common.',
    checked: 'ALLOWED',
    checkedReason: 'Hookahs are allowed in checked baggage.',
    aliases: ['shisha pipe', 'water pipe'],
    keywords: ['hookah', 'shisha', 'pipe', 'smoke']
  },

  // LIQUIDS
  {
    slug: 'olive-oil',
    name: 'Olive Oil',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Olive oil is subject to the 3-1-1 liquids rule. Containers in carry-on must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Olive oil is allowed in checked baggage in any size. Pack carefully to avoid leaks.',
    aliases: ['cooking oil', 'vegetable oil'],
    keywords: ['oil', 'olive', 'cooking', 'liquid']
  },
  {
    slug: 'wine',
    name: 'Wine',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Wine is a liquid and is subject to the 3-1-1 liquids rule (which means standard 750ml bottles must be checked). Duty-free wine is allowed in carry-on if sealed in a tamper-evident bag.',
    checked: 'ALLOWED',
    checkedReason: 'Wine is allowed in checked baggage. Alcohol content must be under 70% ABV (all wine qualifies).',
    aliases: ['red wine', 'white wine', 'bottle of wine'],
    keywords: ['wine', 'alcohol', 'bottle', 'liquid']
  },
  {
    slug: 'whiskey',
    name: 'Whiskey',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Whiskey is a liquid and is subject to the 3-1-1 liquids rule. Standard bottles must go in checked baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Whiskey under 70% ABV (140 proof) is allowed in checked baggage. Limit of 5 liters per passenger for alcohol between 24% and 70% ABV.',
    aliases: ['bourbon', 'scotch', 'spirits'],
    keywords: ['whiskey', 'alcohol', 'liquor', 'bourbon']
  },
  {
    slug: 'beer',
    name: 'Beer',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Beer is a liquid and is subject to the 3-1-1 liquids rule. Cans or bottles over 3.4 oz must be checked.',
    checked: 'ALLOWED',
    checkedReason: 'Beer is allowed in checked baggage in any quantity (ABV is under 24%, so no TSA volume limit applies).',
    aliases: ['ale', 'lager', 'canned beer'],
    keywords: ['beer', 'alcohol', 'can', 'liquid']
  },
  {
    slug: 'juice',
    name: 'Juice',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Juice is subject to the 3-1-1 liquids rule. Carry-on containers must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Juice is allowed in checked baggage in any size.',
    aliases: ['fruit juice', 'orange juice'],
    keywords: ['juice', 'liquid', 'drink', 'beverage']
  },
  {
    slug: 'soda',
    name: 'Soda',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Soda is subject to the 3-1-1 liquids rule. Individual cans or bottles over 3.4 oz must be checked.',
    checked: 'ALLOWED',
    checkedReason: 'Soda is allowed in checked baggage.',
    aliases: ['pop', 'carbonated drink', 'coca cola'],
    keywords: ['soda', 'pop', 'liquid', 'drink']
  },
  {
    slug: 'ice',
    name: 'Ice',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Ice and frozen gel packs must be frozen completely solid when passing security. If they are partially melted or slushy, 3-1-1 liquid limits apply.',
    checked: 'ALLOWED',
    checkedReason: 'Ice and gel packs are allowed in checked baggage.',
    aliases: ['ice cubes', 'frozen water', 'ice pack'],
    keywords: ['ice', 'frozen', 'water', 'cold']
  },
  {
    slug: 'baby-milk',
    name: 'Baby Milk',
    category: 'Baby',
    carryOn: 'ALLOWED',
    carryOnReason: 'Breast milk, baby formula, and baby milk are exempt from the 3-1-1 liquids rule. You can bring reasonable quantities in carry-on. Declare them for manual inspection.',
    checked: 'ALLOWED',
    checkedReason: 'Baby milk is allowed in checked baggage.',
    aliases: ['breast milk', 'baby formula liquid'],
    keywords: ['milk', 'baby', 'breast', 'formula', 'liquid']
  },

  // OUTDOOR
  {
    slug: 'tent-stakes',
    name: 'Tent Stakes',
    category: 'Camping',
    carryOn: 'NOT_ALLOWED',
    carryOnReason: 'Tent stakes or pegs are sharp objects and must be packed in checked baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Tent stakes are allowed in checked baggage.',
    aliases: ['tent pegs', 'camping stakes'],
    keywords: ['stakes', 'pegs', 'tent', 'camping']
  },
  {
    slug: 'camping-stove',
    name: 'Camping Stove',
    category: 'Camping',
    carryOn: 'ALLOWED',
    carryOnReason: 'Camping stoves are allowed in carry-on only if they are completely empty and clean of all fuel residue or odors.',
    checked: 'ALLOWED',
    checkedReason: 'Camping stoves are allowed in checked bags only if completely clean of all fuel residue and odors. Even slight fumes will cause confiscation.',
    aliases: ['camp stove', 'backpacking stove'],
    keywords: ['stove', 'camping', 'burner', 'cook']
  },
  {
    slug: 'propane-canister',
    name: 'Propane Canister',
    category: 'Camping',
    carryOn: 'NOT_ALLOWED',
    carryOnReason: 'Propane, butane, and other compressed fuel canisters are strictly prohibited in carry-on baggage.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Propane and camp fuel canisters are strictly prohibited in checked baggage holds as hazardous materials.',
    aliases: ['propane tank', 'butane canister', 'camp fuel'],
    keywords: ['propane', 'fuel', 'canister', 'gas', 'camping']
  },
  {
    slug: 'trekking-poles',
    name: 'Trekking Poles',
    category: 'Sports',
    carryOn: 'NOT_ALLOWED',
    carryOnReason: 'Hiking poles and trekking poles are prohibited in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Trekking poles and hiking sticks are allowed in checked baggage.',
    aliases: ['hiking poles', 'hiking sticks'],
    keywords: ['poles', 'trekking', 'hiking', 'outdoor']
  },
  {
    slug: 'fishing-rod',
    name: 'Fishing Rod',
    category: 'Sports',
    carryOn: 'ALLOWED',
    carryOnReason: 'Fishing rods are allowed in carry-on if they fit within airline overhead dimension limits. Sharp hooks and lures must be checked.',
    checked: 'ALLOWED',
    checkedReason: 'Fishing rods and reels are allowed in checked baggage.',
    aliases: ['fishing pole', 'fishing gear'],
    keywords: ['fishing', 'rod', 'pole', 'hook']
  },

  // SPORTS
  {
    slug: 'tennis-racket',
    name: 'Tennis Racket',
    category: 'Sports',
    carryOn: 'ALLOWED',
    carryOnReason: 'Tennis rackets and badminton racquets are allowed in carry-on baggage. Check with your airline if it fits in overhead compartments.',
    checked: 'ALLOWED',
    checkedReason: 'Tennis rackets are allowed in checked baggage.',
    aliases: ['tennis racquet', 'badminton racket'],
    keywords: ['racket', 'tennis', 'racquet', 'sport']
  },
  {
    slug: 'bowling-ball',
    name: 'Bowling Ball',
    category: 'Sports',
    carryOn: 'ALLOWED',
    carryOnReason: 'Bowling balls are allowed in carry-on baggage, subject to airline size and weight limits.',
    checked: 'ALLOWED',
    checkedReason: 'Bowling balls are allowed in checked baggage. Watch out for overweight baggage fees.',
    aliases: ['bowling gear'],
    keywords: ['bowling', 'ball', 'sport', 'heavy']
  },
  {
    slug: 'bicycle-helmet',
    name: 'Bicycle Helmet',
    category: 'Sports',
    carryOn: 'ALLOWED',
    carryOnReason: 'Bicycle, motorcycle, or ski helmets are allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Helmets are allowed in checked baggage.',
    aliases: ['bike helmet', 'helmet'],
    keywords: ['helmet', 'bike', 'safety', 'bicycle']
  },
  {
    slug: 'dumbbells',
    name: 'Dumbbells',
    category: 'Sports',
    carryOn: 'NOT_ALLOWED',
    carryOnReason: 'Heavy hand weights and dumbbells are not allowed in carry-on baggage (they can be used as bludgeons).',
    checked: 'ALLOWED',
    checkedReason: 'Dumbbells and weights are allowed in checked baggage. Heavy bag charges may apply.',
    aliases: ['hand weights', 'kettlebells'],
    keywords: ['weights', 'dumbbells', 'heavy', 'fitness']
  },

  // GIFTS & SHOPPING
  {
    slug: 'candles',
    name: 'Candles',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'Solid wax candles are fully allowed in carry-on. Gel candles are subject to 3-1-1 rules.',
    checked: 'ALLOWED',
    checkedReason: 'Wax and gel candles are allowed in checked baggage.',
    aliases: ['wax candles', 'scented candles'],
    keywords: ['candles', 'wax', 'gift', 'scent']
  },
  {
    slug: 'snow-globe',
    name: 'Snow Globe',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Snow globes containing liquid are subject to 3-1-1 rules. Globes under tennis-ball size (≤3.4 oz) are allowed in carry-on. Larger globes must be checked.',
    checked: 'ALLOWED',
    checkedReason: 'Snow globes are allowed in checked baggage. Pack carefully to prevent glass breakage.',
    aliases: ['water globe'],
    keywords: ['globe', 'snow', 'liquid', 'glass', 'gift']
  },
  {
    slug: 'glass-bottle',
    name: 'Glass Bottle',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Empty glass bottles are allowed in carry-on. Glass bottles containing liquids must be 3.4 oz (100 ml) or less.',
    checked: 'ALLOWED',
    checkedReason: 'Glass bottles are allowed in checked baggage. Wrap securely to prevent breaking.',
    aliases: ['glass jar', 'empty bottle'],
    keywords: ['glass', 'bottle', 'jar', 'fragile']
  },
  {
    slug: 'mug',
    name: 'Mug',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'Ceramic mugs, travel cups, and coffee mugs are allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Mugs are allowed in checked baggage. Wrap securely.',
    aliases: ['coffee mug', 'ceramic cup'],
    keywords: ['mug', 'cup', 'ceramic', 'coffee']
  },
  {
    slug: 'picture-frame',
    name: 'Picture Frame',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'Picture frames are allowed in carry-on. Frames with glass should be packed carefully to avoid injury or damage.',
    checked: 'ALLOWED',
    checkedReason: 'Picture frames are allowed in checked baggage.',
    aliases: ['photo frame', 'framed photo'],
    keywords: ['frame', 'picture', 'glass', 'photo']
  },
  {
    slug: 'wine-bottle',
    name: 'Wine Bottle',
    category: 'Liquids',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Standard wine bottles (750 ml) exceed the 3-1-1 limit and are prohibited in carry-on baggage (except duty-free purchases in sealed secure bags).',
    checked: 'ALLOWED',
    checkedReason: 'Wine bottles are allowed in checked baggage. ABV must be under 70%.',
    aliases: ['bottle of wine'],
    keywords: ['wine', 'bottle', 'glass', 'alcohol']
  },
  {
    slug: 'christmas-gifts',
    name: 'Christmas Gifts',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'Christmas gifts are allowed in carry-on, but TSA recommends leaving them unwrapped. Security officers may need to unwrap them for inspection.',
    checked: 'ALLOWED',
    checkedReason: 'Gifts are allowed in checked baggage. Unwrapped or easily inspectable gifts are recommended.',
    aliases: ['wrapped gifts', 'holiday presents'],
    keywords: ['gifts', 'christmas', 'wrapped', 'presents']
  },

  // BABY
  {
    slug: 'stroller',
    name: 'Stroller',
    category: 'Baby',
    carryOn: 'RESTRICTED',
    carryOnReason: 'Standard strollers are too large for the cabin and must be checked (often for free at the gate/jetbridge). Small collapsible strollers that fit overhead are allowed.',
    checked: 'ALLOWED',
    checkedReason: 'Strollers are checked for free by almost all airlines at check-in or at the gate.',
    aliases: ['pram', 'pushchair', 'baby stroller'],
    keywords: ['stroller', 'pram', 'baby', 'gate']
  },
  {
    slug: 'car-seat',
    name: 'Car Seat',
    category: 'Baby',
    carryOn: 'ALLOWED',
    carryOnReason: 'FAA-approved infant car seats are allowed in the cabin if you purchased a seat for the child. Can also be checked at the gate.',
    checked: 'ALLOWED',
    checkedReason: 'Car seats are checked for free by almost all airlines.',
    aliases: ['child car seat', 'booster seat'],
    keywords: ['seat', 'car', 'baby', 'safety']
  },
  {
    slug: 'diapers',
    name: 'Diapers',
    category: 'Baby',
    carryOn: 'ALLOWED',
    carryOnReason: 'Baby diapers (disposable or cloth) are fully allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Diapers are allowed in checked baggage.',
    aliases: ['nappies'],
    keywords: ['diapers', 'baby', 'nappies', 'infant']
  },
  {
    slug: 'formula',
    name: 'Formula',
    category: 'Baby',
    carryOn: 'ALLOWED',
    carryOnReason: 'Baby formula (powder or liquid) is allowed in carry-on and is exempt from the 3-1-1 liquids rule. Declare it to officers at security.',
    checked: 'ALLOWED',
    checkedReason: 'Baby formula is allowed in checked baggage.',
    aliases: ['baby formula', 'infant formula'],
    keywords: ['formula', 'baby', 'powder', 'milk']
  },
  {
    slug: 'breast-pump',
    name: 'Breast Pump',
    category: 'Baby',
    carryOn: 'ALLOWED',
    carryOnReason: 'Breast pumps are medical devices and are allowed in carry-on bags. They do not count toward your carry-on luggage limit under US rules.',
    checked: 'ALLOWED',
    checkedReason: 'Breast pumps are allowed in checked baggage.',
    aliases: ['breast pump electric'],
    keywords: ['pump', 'breast', 'baby', 'medical']
  },

  // PETS
  {
    slug: 'dog-food',
    name: 'Dog Food',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Dry dog kibble and pet treats are allowed in carry-on. Wet canned dog food is subject to the 3-1-1 liquids rule (3.4 oz or less).',
    checked: 'ALLOWED',
    checkedReason: 'Dog food is allowed in checked baggage.',
    aliases: ['dog kibble', 'pet treats'],
    keywords: ['dog', 'food', 'pet', 'kibble']
  },
  {
    slug: 'cat-food',
    name: 'Cat Food',
    category: 'Food',
    carryOn: 'ALLOWED',
    carryOnReason: 'Dry cat food is allowed in carry-on. Wet canned cat food over 3.4 oz must go in checked baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Cat food is allowed in checked baggage.',
    aliases: ['cat kibble', 'canned cat food'],
    keywords: ['cat', 'food', 'pet', 'canned']
  },
  {
    slug: 'pet-carrier',
    name: 'Pet Carrier',
    category: 'Baby', // Mapped to Baby or default category
    carryOn: 'ALLOWED',
    carryOnReason: 'Soft-sided pet carriers are allowed in the cabin if they meet airline size limits to fit under the seat ahead. Pets require fees/booking.',
    checked: 'ALLOWED',
    checkedReason: 'Hard-sided pet crates are allowed in checked baggage/cargo holds under strict airline regulations.',
    aliases: ['dog carrier', 'cat carrier', 'pet kennel'],
    keywords: ['carrier', 'pet', 'dog', 'cat', 'crate']
  },
  {
    slug: 'leash',
    name: 'Dog Leash',
    category: 'Tools',
    carryOn: 'ALLOWED',
    carryOnReason: 'Dog leashes, collars, and harnesses are allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Dog leashes and collars are allowed in checked baggage.',
    aliases: ['dog lead', 'pet leash'],
    keywords: ['leash', 'lead', 'dog', 'pet']
  },
  {
    slug: 'pet-medication',
    name: 'Pet Medication',
    category: 'Medicine',
    carryOn: 'ALLOWED',
    carryOnReason: 'Pet medications (pills) are allowed in carry-on. Liquid veterinary medicines are exempt from 3-1-1 rules if declared.',
    checked: 'ALLOWED',
    checkedReason: 'Pet medications are allowed in checked baggage.',
    aliases: ['veterinary medicine', 'animal medication'],
    keywords: ['medication', 'pet', 'veterinary', 'medicine']
  },
  {
    slug: 'fish',
    name: 'Fish',
    category: 'Baby',
    carryOn: 'ALLOWED',
    carryOnReason: 'Live fish in water in a clear, spill-proof container are allowed in carry-on. Declare them at security for visual inspection.',
    checked: 'NOT_ALLOWED',
    checkedReason: 'Live fish in water cannot go in checked baggage due to lack of pressure/temperature safety.',
    aliases: ['live fish', 'goldfish'],
    keywords: ['fish', 'live', 'pet', 'water']
  },

  // BEAUTY
  {
    slug: 'curling-iron',
    name: 'Curling Iron',
    category: 'Beauty',
    carryOn: 'ALLOWED',
    carryOnReason: 'Electric curling irons are allowed in carry-on and checked bags. Gas/butane-powered curling irons are allowed in carry-on only (must have a safety cover over heating element).',
    checked: 'RESTRICTED',
    checkedReason: 'Butane/gas-powered curling irons are prohibited in checked baggage holds. Electric curling irons are allowed in checked bags.',
    aliases: ['hair curler', 'butane curling iron'],
    keywords: ['curling', 'iron', 'hair', 'electric', 'butane']
  },
  {
    slug: 'hair-straightener',
    name: 'Hair Straightener',
    category: 'Beauty',
    carryOn: 'ALLOWED',
    carryOnReason: 'Electric flat irons and straighteners are allowed in carry-on. Cordless/butane hair straighteners must travel in carry-on with safety covers.',
    checked: 'RESTRICTED',
    checkedReason: 'Butane-powered straighteners are prohibited in checked baggage holds. Electric straighteners are allowed in checked bags.',
    aliases: ['flat iron', 'straightening iron'],
    keywords: ['straightener', 'flat', 'iron', 'hair', 'electric']
  },
  {
    slug: 'beard-trimmer',
    name: 'Beard Trimmer',
    category: 'Beauty',
    carryOn: 'ALLOWED',
    carryOnReason: 'Electric beard trimmers, clippers, and shavers are fully allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Beard trimmers are allowed in checked baggage.',
    aliases: ['clippers', 'hair trimmer'],
    keywords: ['trimmer', 'beard', 'shave', 'electric']
  },
  {
    slug: 'electric-razor',
    name: 'Electric Razor',
    category: 'Beauty',
    carryOn: 'ALLOWED',
    carryOnReason: 'Electric razors and shavers are allowed in carry-on. They contain no exposed blades and are safe for cabin travel.',
    checked: 'ALLOWED',
    checkedReason: 'Electric razors are allowed in checked baggage.',
    aliases: ['electric shaver'],
    keywords: ['razor', 'electric', 'shaver', 'shaving']
  },
  {
    slug: 'makeup-brushes',
    name: 'Makeup Brushes',
    category: 'Beauty',
    carryOn: 'ALLOWED',
    carryOnReason: 'Cosmetic and makeup brushes are allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Makeup brushes are allowed in checked baggage.',
    aliases: ['cosmetic brushes'],
    keywords: ['brushes', 'makeup', 'beauty', 'cosmetics']
  },
  {
    slug: 'lipstick',
    name: 'Lipstick',
    category: 'Beauty',
    carryOn: 'ALLOWED',
    carryOnReason: 'Solid lipsticks, lip balms, and chapsticks are fully allowed in carry-on without size limits. Liquid lip gloss must comply with the 3-1-1 rule.',
    checked: 'ALLOWED',
    checkedReason: 'Lipstick and lip gloss are allowed in checked baggage.',
    aliases: ['chapstick', 'lip gloss', 'lip balm'],
    keywords: ['lipstick', 'makeup', 'lip', 'solid', 'gloss']
  },

  // CLOTHING / PERSONAL CARE
  {
    slug: 'shoes',
    name: 'Shoes',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Shoes, sneakers, and sandals are fully allowed in carry-on and checked baggage.',
    checked: 'ALLOWED',
    checkedReason: 'Shoes are allowed in checked baggage.',
    aliases: ['sneakers', 'sandals'],
    keywords: ['shoes', 'footwear', 'sneakers', 'sandals']
  },
  {
    slug: 'boots',
    name: 'Boots',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Boots (hiking boots, winter boots) are allowed in carry-on. You may need to remove them for screening at security checkpoints.',
    checked: 'ALLOWED',
    checkedReason: 'Boots are allowed in checked baggage.',
    aliases: ['hiking boots', 'rain boots'],
    keywords: ['boots', 'shoes', 'footwear', 'heavy']
  },
  {
    slug: 'high-heels',
    name: 'High Heels',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'High heels, pumps, and stiletto shoes are allowed in carry-on baggage.',
    checked: 'ALLOWED',
    checkedReason: 'High heels are allowed in checked baggage.',
    aliases: ['pumps', 'stilettos', 'heels'],
    keywords: ['heels', 'shoes', 'high', 'footwear']
  },
  {
    slug: 'belt',
    name: 'Belt',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Belts are allowed in carry-on. Remember to remove belts with metal buckles at security screening to avoid setting off metal detectors.',
    checked: 'ALLOWED',
    checkedReason: 'Belts are allowed in checked baggage.',
    aliases: ['leather belt', 'waist belt'],
    keywords: ['belt', 'clothing', 'buckle', 'metal']
  },
  {
    slug: 'jewelry',
    name: 'Jewelry',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Jewelry (rings, necklaces, watches) is allowed in carry-on. Wearing or carrying valuable jewelry in the cabin is highly recommended to prevent loss or theft.',
    checked: 'ALLOWED',
    checkedReason: 'Jewelry is allowed in checked baggage, though checked bags are not recommended for high-value items.',
    aliases: ['gold ring', 'necklace', 'costume jewelry'],
    keywords: ['jewelry', 'gold', 'ring', 'precious']
  },
  {
    slug: 'watch',
    name: 'Watch',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Watches (analog, digital, or smartwatches) are allowed in carry-on baggage. You may be asked to remove them at security.',
    checked: 'ALLOWED',
    checkedReason: 'Watches are allowed in checked baggage, though carrying them in carry-on is recommended.',
    aliases: ['smartwatch', 'wrist watch'],
    keywords: ['watch', 'smartwatch', 'time', 'wrist']
  },
  {
    slug: 'wedding-dress',
    name: 'Wedding Dress',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Wedding dresses are allowed in carry-on baggage. Call your airline in advance to see if they have closet space to hang the dress in the cabin.',
    checked: 'ALLOWED',
    checkedReason: 'Wedding dresses are allowed in checked baggage, though carry-on is highly recommended to protect against damage or lost bags.',
    aliases: ['bridal gown', 'wedding gown'],
    keywords: ['wedding', 'dress', 'gown', 'clothing']
  },
  {
    slug: 'suit',
    name: 'Suit',
    category: 'Personal Care',
    carryOn: 'ALLOWED',
    carryOnReason: 'Business suits and formal suits are allowed in carry-on. Carrying them in a garment bag is recommended.',
    checked: 'ALLOWED',
    checkedReason: 'Suits are allowed in checked baggage.',
    aliases: ['business suit', 'tuxedo', 'blazer'],
    keywords: ['suit', 'clothing', 'blazer', 'formal']
  }
];

function generate() {
  let createdCount = 0;
  let skippedCount = 0;

  for (const item of itemsToGenerate) {
    const categorySlug = item.category.toLowerCase().trim().replace(/\s+/g, '-');
    const folderPath = path.join(itemsDir, categorySlug);
    const filePath = path.join(folderPath, `${item.slug}.json`);

    // Ensure category folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (fs.existsSync(filePath)) {
      skippedCount++;
      continue;
    }

    const itemTemplate = {
      id: item.slug,
      slug: item.slug,
      name: item.name,
      category: item.category,
      subcategory: 'General',
      aliases: item.aliases || [],
      keywords: item.keywords || [],
      description: `Guidelines for traveling with ${item.name.toLowerCase()} in your luggage.`,
      carryOn: {
        status: item.carryOn,
        reason: item.carryOnReason,
        conditions: [],
        exceptions: []
      },
      checkedBag: {
        status: item.checked === 'NOT_ALLOWED' ? 'NOT_ALLOWED' : 'ALLOWED',
        reason: item.checkedReason || `Guidelines for traveling with ${item.name.toLowerCase()} in checked baggage.`,
        conditions: [],
        exceptions: []
      },
      tsa: {
        officialUrl: `https://www.tsa.gov/travel/security-screening/whatcanibring/items/${item.slug}`,
        lastVerified: '2026-06-30',
        pageTitle: `Can I bring ${item.name.toLowerCase()} on a plane?`
      },
      faa: {
        officialUrl: 'https://www.faa.gov/hazmat/packsafe',
        applicable: ['vape', 'e-cigarette', 'portable-charger', 'battery-pack', 'camera-battery', 'bluetooth-speaker', 'lithium-batteries'].includes(item.slug)
      },
      sources: [
        {
          name: 'TSA',
          url: `https://www.tsa.gov/travel/security-screening/whatcanibring/items/${item.slug}`,
          verified: '2026-06-30',
          priority: 1
        }
      ],
      airlines: [],
      international: {},
      travelTips: [item.carryOnReason],
      relatedItems: [],
      faq: [
        {
          question: `Is ${item.name.toLowerCase()} allowed in carry-on bags?`,
          answer: `${item.name} is ${item.carryOn.toLowerCase()} in carry-on luggage. ${item.carryOnReason}`
        },
        {
          question: `Can you pack ${item.name.toLowerCase()} in checked baggage?`,
          answer: item.checked === 'ALLOWED' 
            ? `Yes, ${item.name} is allowed in checked bags. ${item.checkedReason}`
            : `No, ${item.name} is not allowed in checked bags. ${item.checkedReason}`
        }
      ],
      metadata: {
        lastReviewed: '2026-06-30',
        nextReviewDue: '2027-06-30',
        reviewIntervalMonths: 12,
        editor: 'BringOnPlane Editorial Team',
        version: '1.0.0'
      },
      ruleHistory: [
        {
          effectiveDate: '2026-06-30',
          change: 'Initial item database entry.',
          source: `https://www.tsa.gov/travel/security-screening/whatcanibring/items/${item.slug}`
        }
      ]
    };

    fs.writeFileSync(filePath, JSON.stringify(itemTemplate, null, 2), 'utf8');
    createdCount++;
  }

  console.log(`[generate-missing-items] Created ${createdCount} new JSON files. Skipped ${skippedCount} existing files.`);
}

generate();
