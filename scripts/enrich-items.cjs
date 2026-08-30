const fs = require('fs');
const path = require('path');

function updateItem(relPath, updater) {
  const fullPath = path.join(__dirname, '../src/data/items', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error('File does not exist:', fullPath);
    return;
  }
  const item = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  updater(item);
  fs.writeFileSync(fullPath, JSON.stringify(item, null, 2), 'utf8');
}

// 1. Jump Rope
updateItem('sports/jump-rope.json', item => {
  const aliases = [
    'can i take a jump rope in my carry on', 'can you bring a jump rope on a plane',
    'can i bring a jump rope on an airplane', 'can you take a jump rope on a plane',
    'can i bring a jump rope on a plane', 'are jump ropes allowed on airplanes',
    'can you take skipping rope on a plane', 'can you bring rope on a plane',
    'can i bring rope on a plane', 'can you take rope on a plane',
    'skipping rope', 'weighted jump rope', 'speed rope', 'exercise rope', 'fitness rope'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.keywords = Array.from(new Set([...(item.keywords || []), 'jump rope', 'skipping rope', 'rope', 'fitness', 'workout', 'carry on', 'checked bag', 'tsa']));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I take a jump rope in my carry-on bag?', answer: 'Yes! TSA and international airport security allow jump ropes, speed ropes, and skipping ropes in both carry-on and checked luggage without restriction.' },
    { question: 'Can you bring rope on a plane?', answer: 'Yes, standard jumping ropes, nylon cords, and workout ropes are permitted in carry-on and checked bags. Ensure heavy metal handles are packed neatly for clear X-ray screening.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 2. Nicotine Pouches
updateItem('personal-care/nicotine-pouches.json', item => {
  const aliases = [
    'zyn pouches', 'nicotine pouches singapore airport', 'ryanair nicotine pouches',
    'zyn', 'tobacco free pouches', 'snus', 'nicotine oral pouches',
    'can i bring nicotine pouches on a plane to singapore', 'bring nicotine pouches on plane',
    'nicotine pouches carry on', 'bring cigarettes to sg', 'nicotine pouches uk'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.keywords = Array.from(new Set([...(item.keywords || []), 'nicotine', 'zyn', 'pouches', 'singapore', 'changi', 'ryanair', 'tsa', 'uk']));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Singapore Airlines')) {
    item.airlines.push({ name: 'Singapore Airlines', status: 'NOT_ALLOWED', notes: 'Strictly prohibited into Singapore under tobacco analogue laws.' });
  }
  if (!item.airlines.some(a => a.name === 'Ryanair')) {
    item.airlines.push({ name: 'Ryanair', status: 'ALLOWED', notes: 'Permitted in hand luggage and checked bags for personal use within EU nations.' });
  }
  item.international = item.international || {};
  item.international['Singapore'] = { status: 'NOT_ALLOWED', reason: 'STRICTLY PROHIBITED. Singapore Customs and HSA ban all tobacco-free nicotine pouches (like ZYN), vaporizers, and chewing tobacco under the Tobacco Act. Fines up to SGD $2,000 apply at Changi Airport.' };
  item.international['UK'] = { status: 'ALLOWED', reason: 'Allowed in hand luggage and checked baggage for personal consumption.' };
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring nicotine pouches to Singapore or Changi Airport?', answer: 'No. Singapore enforces a strict zero-tolerance ban on nicotine pouches (such as ZYN), snus, and e-cigarettes. Possession or importation at Changi Airport carries heavy fines up to SGD $2,000.' },
    { question: 'Can you bring nicotine pouches on a plane in carry-on?', answer: 'Yes, on US domestic flights and European flights (like Ryanair), nicotine pouches are solid items and are 100% permitted in carry-on and checked bags.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 3. Laptop Charger
updateItem('electronics/laptop-charger.json', item => {
  const aliases = [
    'laptop charger can check in baggage', 'can you check in laptop charger',
    'can i check in my laptop charger', 'can laptop charger be checked in',
    'laptop charger in checked luggage', 'can i pack laptop charger in checked baggage',
    'can check in laptop charger', 'laptop charger hand carry or check in',
    'can we check in laptop charger', 'can laptop charger be put in checked luggage',
    'can you put laptop charger in checked luggage', 'laptop charger check in',
    'do laptop chargers have lithium batteries', 'can i put laptop charger in checked luggage',
    'can we put laptop charger in check in baggage', 'is laptop charger allowed in check in baggage',
    'macbook charger', 'laptop power adapter', 'charging brick', 'laptop cord', 'laptop power cable'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.keywords = Array.from(new Set([...(item.keywords || []), 'laptop', 'charger', 'adapter', 'checked baggage', 'carry on', 'lithium', 'power brick']));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I put my laptop charger in checked luggage?', answer: 'Yes! Standard laptop chargers, cords, and power bricks contain no internal battery cells and are 100% allowed in checked baggage as well as carry-on luggage on all airlines.' },
    { question: 'Do laptop chargers have lithium batteries?', answer: 'No. Wall chargers and power adapters do not store energy and contain zero lithium batteries. Only portable power banks / external battery packs contain lithium cells (which must stay in carry-on).' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 4. AirTag
updateItem('electronics/airtag.json', item => {
  const aliases = [
    'apple airtag', 'airtags', 'air tags', 'air tag', 'apple airtag uk',
    'air france airtag', 'emirates airtag', 'smart tracker', 'tile tracker',
    'smart luggage tag', 'bluetooth tracker', 'cr2032 tracker', 'luggage tracker'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.keywords = Array.from(new Set([...(item.keywords || []), 'airtag', 'apple', 'airtags', 'tracker', 'checked baggage', 'cr2032', 'air france', 'emirates']));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Air France')) {
    item.airlines.push({ name: 'Air France', status: 'ALLOWED', notes: 'AirTags and Bluetooth luggage trackers are fully permitted in checked and cabin baggage.' });
  }
  if (!item.airlines.some(a => a.name === 'Emirates')) {
    item.airlines.push({ name: 'Emirates', status: 'ALLOWED', notes: 'AirTags permitted in all baggage for passenger tracking.' });
  }
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you put an Apple AirTag in checked luggage?', answer: 'Yes! The FAA, TSA, EASA, Air France, Lufthansa, and Emirates all officially permit Apple AirTags and CR2032 button-cell trackers inside checked suitcases.' },
    { question: 'Do AirTags violate lithium battery checked bag rules?', answer: 'No. FAA and ICAO regulations state that low-power tracking devices containing lithium coin cells with under 0.3g lithium metal (like CR2032) do not present a fire risk and are exempt from battery restrictions.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 5. Tent Stakes
updateItem('camping/tent-stakes.json', item => {
  const aliases = [
    'can you bring tent stakes on a plane', 'tsa tent stakes',
    'can you take tent stakes on a plane', 'tent stakes tsa',
    'can i bring tent stakes on a plane', 'can you fly with tent stakes',
    'can tent stakes go in carry on', 'tent stakes in carry on luggage',
    'stakes on a plane', 'can i take tent pegs on a plane',
    'are tent stakes allowed in carry on', 'can you carry on tent stakes',
    'tent pegs', 'metal tent stakes', 'camping pegs', 'ground stakes'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.keywords = Array.from(new Set([...(item.keywords || []), 'tent stakes', 'tent pegs', 'camping', 'checked baggage', 'prohibited carry on']));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can tent stakes go in carry-on luggage?', answer: 'No. TSA and international aviation rules prohibit metal or sharp tent stakes and tent pegs in carry-on bags because they can be used as weapons. They MUST be packed in checked luggage.' },
    { question: 'Are tent stakes allowed in checked baggage?', answer: 'Yes! Tent stakes, tent poles, and camping pegs are 100% allowed in checked luggage.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 6. Nuts
updateItem('food/nuts.json', item => {
  const aliases = [
    'can i bring pistachios on a plane', 'can you bring almonds on a plane',
    'can i bring almonds on a plane', 'can you take pistachios on a plane',
    'can you bring nuts on a plane', 'can i carry cashew nuts in hand luggage',
    'can i bring cashews on a plane', 'can i bring nuts in my carry on bag',
    'can i bring cashew nuts to australia', 'can you bring cashews on a plane',
    'can i carry almonds in cabin baggage', 'can i bring mixed nuts on a plane',
    'can i take walnuts on the plane', 'can i bring walnuts on a plane',
    'can you take almonds on a plane', 'pistachios', 'almonds', 'cashews', 'walnuts',
    'peanuts', 'mixed nuts', 'roasted nuts'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.keywords = Array.from(new Set([...(item.keywords || []), 'nuts', 'pistachios', 'almonds', 'cashews', 'walnuts', 'australia customs']));
  item.international = item.international || {};
  item.international['Australia'] = { status: 'RESTRICTED', reason: 'Nuts MUST be declared on your Incoming Passenger Card. Commercially roasted, packaged nuts without raw seeds or plant matter are permitted after biosecurity inspection.' };
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring pistachios, almonds, and cashews on a plane?', answer: 'Yes! All nuts are solid foods and are allowed without limit in both carry-on and checked bags through TSA security.' },
    { question: 'Can I bring cashew nuts into Australia?', answer: 'Yes, but you MUST declare them on your Incoming Passenger Card. Commercially packaged roasted nuts will clear Australian biosecurity inspection.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 7. Instant Noodles
updateItem('food/instant-noodles.json', item => {
  const aliases = [
    'singapore airlines cup noodles', 'can i bring cup noodles into australia',
    'can i bring cup noodles on plane', 'can you bring instant noodles on a plane',
    'singapore airlines instant noodles', 'can you bring instant noodles on a plane carry-on international',
    'can i bring instant noodles to uk', 'can you take instant noodles on a plane',
    'can you bring instant noodles on a plane carry-on', 'cup noodles', 'ramen', 'pot noodle', 'dry noodles'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.keywords = Array.from(new Set([...(item.keywords || []), 'cup noodles', 'ramen', 'instant noodles', 'singapore airlines', 'australia biosecurity']));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Singapore Airlines')) {
    item.airlines.push({ name: 'Singapore Airlines', status: 'ALLOWED', notes: 'Dry cup noodles permitted in cabin baggage. Cabin crew can provide hot water on request when cruising safely.' });
  }
  item.international = item.international || {};
  item.international['Australia'] = { status: 'RESTRICTED', reason: 'Instant noodles MUST be declared on the Australian Incoming Passenger Card. Noodles containing visible dried meat, pork, egg, or poultry may be confiscated by biosecurity.' };
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring cup noodles on Singapore Airlines?', answer: 'Yes! Dry cup noodles are allowed in your carry-on luggage. You can request hot water from flight attendants during flight.' },
    { question: 'Can I bring cup noodles into Australia?', answer: 'Yes, provided you declare all food on arrival. Noodles containing real meat/egg ingredients may be seized, while vegetarian or seafood noodles usually pass.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 8. Shoes
updateItem('personal-care/shoes.json', item => {
  const aliases = [
    'can i bring shoes in my carry on', 'can i put shoes in my carry on',
    'can you put shoes in your carry on', 'can i bring shoes in my personal bag',
    'can you put shoes in carry on bag', 'can you bring shoes in carry on',
    'can i put shoes in my carry on bag', 'can i carry a pair of shoes on a plane',
    'can you bring shoes on a plane', 'can i carry shoes in my carry on',
    'can you carry shoes on a plane', 'can i put shoes in my personal bag',
    'can you have shoes in your carry on', 'are shoes allowed in carry on',
    'shoes allowed in hand luggage', 'can i bring shoes in my carry on bag',
    'can shoes go in carry on luggage', 'can you put shoes in your personal item bag',
    'can you bring an extra pair of shoes on a plane', 'can you bring shoes in your personal bag',
    'how many pairs of shoes can you take on a plane', 'can shoes go in carry on',
    'sneakers', 'boots', 'extra pair of shoes'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'How many pairs of shoes can you take on a plane?', answer: 'There is no limit on how many pairs of shoes you can bring, as long as your bags fit within your airline size and weight limits. You can pack shoes in carry-on, personal bags, or checked luggage.' },
    { question: 'Can I put shoes in my personal item bag or carry-on?', answer: 'Yes! Shoes are completely permitted in carry-on bags and personal item backpacks.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 9. High Heels
updateItem('personal-care/high-heels.json', item => {
  const aliases = [
    'can i bring heels in my carry on', 'can i put heels in my carry on',
    'can you bring heels on a plane', 'high heels', 'stilettos', 'pumps', 'heels in carry on'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring high heels in your carry-on?', answer: 'Yes! High heels and stilettos are 100% permitted in carry-on baggage. Metal heel tips do not violate TSA checkpoint rules.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 10. Shaving Cream
updateItem('personal-care/shaving-cream.json', item => {
  const aliases = [
    'tsa shaving cream', 'tsa shaving cream size', 'can i take shaving foam on a plane',
    'what size shaving cream can you take on a plane', 'can i bring shaving cream on a plane',
    'can i put shaving foam in checked luggage', 'is shaving foam allowed on airplanes',
    'how much shaving cream can i bring on a plane', 'is shaving cream allowed on planes',
    'is shaving foam allowed in flight', 'can you bring barbasol on a plane',
    'can you have shaving cream in checked bag', 'can you fly with shaving cream',
    'can shaving foam go in hold luggage', 'shaving foam', 'barbasol', 'shave foam', 'shave gel'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.keywords = Array.from(new Set([...(item.keywords || []), 'shaving cream', 'shaving foam', 'barbasol', '3-1-1', 'aerosol']));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'What size shaving cream can you take on a plane?', answer: 'In carry-on bags, shaving cream or foam must be in travel-size containers of 3.4 oz (100 ml) or less inside your quart liquid bag. In checked luggage, full-size cans (up to 18 oz / 500 ml each, total 70 oz per passenger) are allowed under FAA rules.' },
    { question: 'Can I put shaving foam in checked luggage?', answer: 'Yes! Full-size shaving foam and Barbasol cans are permitted in checked luggage with protective caps on the nozzles.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 11. Shampoo Bar
updateItem('personal-care/shampoo-bar.json', item => {
  const aliases = [
    'do conditioner bars count as liquids for tsa, or are they solids?',
    'are shampoo bars tsa-friendly for carry-on bags?',
    'conditioner bar', 'solid conditioner', 'solid shampoo', 'shampoo soap bar'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Do conditioner bars count as liquids for TSA, or are they solids?', answer: 'Conditioner bars and shampoo bars are classified as SOLIDS by TSA and international aviation security. They are completely exempt from the 3.4 oz liquid limit and do NOT need to go in your liquids bag.' },
    { question: 'Is there a way to bring my full hair routine on a flight without checking a bag?', answer: 'Yes! Use solid shampoo bars, solid conditioner bars, and decant remaining liquids into 3.4 oz (100 ml) travel containers inside a clear quart bag.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 12. Beard Trimmer & Hair Clippers
updateItem('beauty/beard-trimmer.json', item => {
  const aliases = [
    'are beard trimmers allowed on planes', 'beard trimmer on plane',
    'can you bring a beard trimmer on a plane', 'can i put clippers in my carry on',
    'can i take a beard trimmer in my carry on', 'can i bring a beard trimmer on a plane',
    'is trimmer allowed in hand luggage emirates', 'can i bring my beard trimmer on a plane',
    'beard trimmer airplane', 'can hair clippers go in checked luggage', 'electric beard trimmer'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Emirates')) {
    item.airlines.push({ name: 'Emirates', status: 'ALLOWED', notes: 'Personal electric beard trimmers allowed in cabin baggage and checked luggage.' });
  }
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Are beard trimmers allowed on planes in carry-on?', answer: 'Yes! Electric beard trimmers, hair clippers, and personal groomers are 100% permitted in carry-on and checked bags across TSA, Emirates, British Airways, and European airlines.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 13. Electric Razor
updateItem('beauty/electric-razor.json', item => {
  const aliases = [
    'can you bring an electric shaver on a plane', 'can you carry on an electric razor',
    'electric shaver carry on', 'american airlines electric razor',
    'can you bring a gillette razor on an airplane canada', 'electric shaver',
    'electric toothbrush carry on', 'british airways electric toothbrush',
    'air canada electric toothbrush', 'can you take electric toothbrush in hand luggage emirates',
    'razor in carry on', 'can you bring a shaving razor on a plane'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'American Airlines')) {
    item.airlines.push({ name: 'American Airlines', status: 'ALLOWED', notes: 'Electric shavers permitted in carry-on and checked baggage.' });
  }
  if (!item.airlines.some(a => a.name === 'British Airways')) {
    item.airlines.push({ name: 'British Airways', status: 'ALLOWED', notes: 'Electric toothbrushes and shavers permitted in cabin luggage.' });
  }
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring an electric shaver or electric toothbrush in carry-on?', answer: 'Yes! Electric razors, rotary shavers, and rechargeable electric toothbrushes are allowed in carry-on bags and checked baggage on all airlines.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 14. Extension Cord & Surge Protector
updateItem('electronics/extension-cord.json', item => {
  const aliases = [
    'can i bring extension cord on plane', 'tsa extension cord',
    'can you fly with an extension cord', 'are extension cords allowed on planes',
    'can i put extension cord in checked luggage', 'can i bring extension wire on plane',
    'is extension cord allowed in hand carry', 'can extension cord be checked in',
    'can you take a surge protector on a plane', 'can i bring a surge protector on a plane',
    'surge protector', 'extension wire', 'power strip', 'power extension'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring an extension cord or surge protector on a plane?', answer: 'Yes! TSA and international airlines allow standard extension cords, surge protectors, and power strips in both carry-on and checked luggage.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 15. Mug
updateItem('tools/mug.json', item => {
  const aliases = [
    'can i bring a mug in my carry on', 'can you take mugs in carry on luggage',
    'are mugs allowed in carry on', 'can i bring a mug on a plane',
    'can you bring a mug in your carry on', 'coffee mug', 'ceramic mug', 'yeti tumbler', 'travel mug'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring a ceramic mug or travel tumbler in my carry-on?', answer: 'Yes! Empty ceramic mugs, coffee cups, and travel tumblers are 100% allowed in carry-on and checked baggage. Just ensure it contains no liquids before security.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 16. Dumbbells
updateItem('sports/dumbbells.json', item => {
  const aliases = [
    'can you bring dumbbells on a plane', 'can you take dumbbells on a plane',
    'can you bring weights on a plane', 'can you carry dumbbells on a plane',
    'can i bring a dumbbell on a plane', 'can i bring dumbbells on a plane',
    'can i carry dumbbells in flight', 'weights on plane', 'gym weights', 'hand weights'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring dumbbells on a plane in carry-on?', answer: 'While TSA does not explicitly prohibit small weights, security officers and airlines often restrict heavy metal dumbbells in cabin luggage due to bludgeon risks and overhead bin limits. It is recommended to pack weights in checked luggage.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 17. Dog Food & Dog Treats
updateItem('food/dog-food.json', item => {
  const aliases = [
    'can you bring dog treats on a plane', 'how to travel with dog food',
    'can you take dog treats on a plane', 'is dog food allowed on planes',
    'can you bring dog food on a plane', 'can i bring dog food in my checked luggage international',
    'can i bring dog treats on a plane', 'dog treats', 'dry dog food', 'kibble'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring dog treats and dog food on a plane?', answer: 'Yes! Dry dog food, kibble, and solid dog treats are allowed in unlimited quantities in carry-on and checked bags. Canned wet dog food over 3.4 oz must go in checked luggage.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 18. Cat Food
updateItem('food/cat-food.json', item => {
  const aliases = [
    'can you bring canned cat food on a plane', 'can you bring cat food on a plane',
    'can you bring wet cat food on a plane', 'can i bring cat food on a plane international',
    'can i bring wet cat food on a plane', 'canned cat food', 'wet cat food', 'cat treats'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring canned wet cat food in carry-on?', answer: 'Canned wet cat food is classified as a liquid/gel: cans in carry-on must be 3.4 oz (100 ml) or less. Larger cans must be packed in checked baggage.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 19. Bananas
updateItem('food/bananas.json', item => {
  const aliases = [
    'can i bring a banana through tsa', 'can you bring a banana through tsa',
    'can i bring bananas on a plane', 'can you bring bananas on a plane',
    'can i take a banana on a plane', 'tsa banana', 'can you bring bananas through tsa',
    'can you carry bananas on a plane', 'can bananas go through tsa',
    'banana through tsa', 'can you take bananas on a plane', 'fresh bananas'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring a banana through TSA airport security?', answer: 'Yes! Fresh bananas and solid whole fruits are 100% allowed through TSA checkpoints in carry-on bags for domestic flights.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 20. Face Mask
updateItem('medicine/face-mask.json', item => {
  const aliases = [
    'can i bring face mask on plane', 'can you take face masks on a plane',
    'can you bring face masks on a plane', 'can you bring face masks on carry on',
    'can you take face masks on carry on', 'are you allowed to bring face masks on a plane',
    'can i bring a face mask on the plane', 'can u bring face masks on a plane',
    'can you bring a face mask on a plane', 'are face masks allowed on carry on',
    'can i bring a face mask in my carry on', 'can i bring face masks in my carry on',
    'can i take face masks on carry on', 'face mask tsa', 'beauty sheet mask', 'facial sheet mask'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring beauty sheet masks in carry-on?', answer: 'Yes! Individually sealed skincare sheet masks contain minimal serum that complies with TSA guidelines. N95, surgical, and cloth masks have no restrictions.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 21. Batteries (AA, Coin Cell, Power Banks)
updateItem('electronics/aa-batteries.json', item => {
  const aliases = [
    'can you take triple as in a carry on', 'can you bring aa batteries on a plane',
    'can you take aa batteries on a plane', 'batteries airplane', 'batteries on airplane',
    'can you take aa batteries on a plane uk', 'are double a batteries allowed on planes',
    'can i bring double a batteries on a plane', 'can i carry batteries on a plane',
    'triple a batteries', 'double a batteries', 'alkaline aa batteries'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring AA and AAA batteries on a plane?', answer: 'Yes! Standard alkaline AA and AAA batteries are allowed in both carry-on bags and checked luggage. Keep them in original packaging or protect terminals to prevent short circuits.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

updateItem('electronics/coin-cell-batteries.json', item => {
  const aliases = [
    'can you check a bag wiu button batteries', 'can you check a bag with button batteries',
    'button batteries', 'coin cell', 'cr2032', 'watch battery in checked luggage'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you check a bag with button batteries?', answer: 'Yes! Devices containing small lithium button cell batteries (like watches, key fobs, and Apple AirTags) are permitted in checked luggage under FAA/ICAO rules.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

updateItem('electronics/power-bank.json', item => {
  const aliases = [
    'air france power bank rules', 'air france battery policy', 'air france powerbank',
    'air france powerbank limit', 'air france power bank', 'air france powerbank rules',
    'air france portable charger policy', 'power bank air france', 'powerbank air france',
    'delta battery pack policy', 'delta portable battery', 'delta power bank rules',
    'delta battery pack', 'delta airlines power bank rules', 'delta portable charger policy',
    'united power bank rules', 'united airlines powerbank', 'united airlines powerbank rules',
    'lufthansa portable charger rules', 'lufthansa lithium batteries',
    'british airways battery policy', 'ba lithium batteries', 'ryanair lithium battery policy',
    'ryanair camera batteries', 'tsa power bank rules', 'tsa rules for power banks',
    'does tsa allow power banks', 'can you bring portable chargers on planes',
    'are battery packs allowed on carry on', 'flying with lithium batteries'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.airlines = item.airlines || [];
  const airlineList = [
    { name: 'Air France', status: 'ALLOWED', notes: 'Max 100Wh allowed in carry-on without approval (max 2 spare units between 100Wh-160Wh with airline permission). Prohibited in checked hold.' },
    { name: 'Delta Air Lines', status: 'ALLOWED', notes: 'Lithium power banks permitted in carry-on only (under 100Wh). Prohibited in checked luggage.' },
    { name: 'United Airlines', status: 'ALLOWED', notes: 'Power banks allowed in cabin bags only. Checked hold carriage strictly prohibited.' },
    { name: 'Lufthansa', status: 'ALLOWED', notes: 'Max 2 portable power banks (up to 100Wh each) in carry-on. Prohibited in checked hold.' },
    { name: 'Emirates', status: 'ALLOWED', notes: 'Lithium power banks must be carried in cabin baggage (under 100Wh). Checked luggage prohibited.' },
    { name: 'Singapore Airlines', status: 'ALLOWED', notes: 'Must be in carry-on baggage. Max 100Wh standard; 100Wh-160Wh requires airline approval.' }
  ];
  airlineList.forEach(al => {
    const idx = item.airlines.findIndex(a => a.name === al.name);
    if (idx >= 0) item.airlines[idx] = al;
    else item.airlines.push(al);
  });
  item.faq = item.faq || [];
  const faqs = [
    { question: 'What are the power bank rules for Air France, Delta, and United?', answer: 'Power banks and portable chargers must ALWAYS be packed in carry-on baggage and are strictly prohibited in checked luggage. Standard limit is 100Wh (approx. 27,000mAh) per power bank.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 22. EpiPen
updateItem('medicine/epipen.json', item => {
  const aliases = [
    'can i bring epipen to japan', 'bringing epipen to japan', 'can i bring my epipen to japan',
    'traveling with injectable meds tsa rules', 'epipen international', 'auto injector'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.international = item.international || {};
  item.international['Japan'] = { status: 'ALLOWED', reason: 'One EpiPen auto-injector for emergency medical use is permitted without prior Yakkan Shoumei import certification. Carry doctor prescription.' };
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring an EpiPen to Japan?', answer: 'Yes! Japan Customs and Health Ministry allow travelers to bring 1 personal EpiPen into Japan without prior approval. Keep it in original labeled packaging with your doctor prescription.' },
    { question: 'What are TSA rules for traveling with injectable medications?', answer: 'Injectable medications (including EpiPens and insulin) are fully allowed through TSA checkpoints in carry-on baggage and are exempt from the 3.4 oz liquid limit.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 23. Cigarettes & Lighters
updateItem('tools/cigarettes.json', item => {
  const aliases = [
    'lufthansa cigarettes allowance', 'emirates cigarette electronique', 'emirates cigarettes',
    'emirates cigarettes allowance', 'bring cigarettes to sg', 'can i bring cigarettes to singapore',
    'can you bring cigarettes to singapore', 'can you bring cigarettes on a plane singapore',
    'can you bring cigarettes to singapore airport', 'can i bring a pack of cigarettes in my carry on to singapore',
    'can bring cigarettes on plane', 'can i bring cigarette on plane', 'can cigarettes be carried on a plane',
    'can you bring raw cones on a plane', 'raw cones', 'tobacco'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.international = item.international || {};
  item.international['Singapore'] = { status: 'RESTRICTED', reason: 'Singapore has NO duty-free concession for cigarettes. You MUST declare even a single pack at customs and pay excise duties (SDPC mark required for local sale).' };
  item.international['Germany'] = { status: 'ALLOWED', reason: '200 cigarettes duty-free allowance for non-EU travelers over age 17.' };
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring cigarettes to Singapore?', answer: 'Singapore allows you to bring duty-paid cigarettes, but there is ZERO duty-free allowance. You must declare every pack at the Red Channel at Changi Airport and pay tax. E-cigarettes are strictly banned.' },
    { question: 'What is Lufthansa cigarette allowance?', answer: 'For travelers arriving in Germany from outside the EU on Lufthansa, the duty-free allowance is 200 cigarettes (or 50 cigars) for passengers aged 17 and older.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

updateItem('tools/lighter.json', item => {
  const aliases = [
    'ryanair lighter', 'can i bring a lighter on a plane', 'can you bring a lighter in a checked bag',
    'can you take a lighter on a plane', 'can you bring a lighter on a plane ryanair',
    'are bic lighters allowed on planes', 'can you bring a torch lighter on a plane',
    'is bic lighter allowed on plane', 'can i bring a lighter on a plane ryanair',
    'bic lighter', 'disposable lighter', 'torch lighter'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring a Bic lighter on Ryanair and TSA flights?', answer: 'Yes! One standard disposable or Bic lighter is allowed ON YOUR PERSON through security on TSA and European flights (like Ryanair). Lighters with fuel are strictly banned in checked bags.' },
    { question: 'Are torch lighters allowed on planes?', answer: 'No. Torch lighters (blue flame / jet lighters) are strictly prohibited in both carry-on and checked luggage.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 24. Box Cutter / Utility Knife
updateItem('tools/utility-knife.json', item => {
  const aliases = [
    'can you bring a box cutter on a plane', 'box cutter in checked luggage',
    'can you bring razor blades in checked luggage', 'box cutter', 'utility knife', 'stanley knife'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you put a box cutter in checked luggage?', answer: 'Yes! Box cutters, utility knives, and razor blades are allowed in checked luggage. They are strictly prohibited in carry-on bags.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 25. Honey & Hot Sauce
updateItem('food/honey.json', item => {
  const aliases = [
    'can i take a jar of honey on the plane', 'is honey considered a liquid for tsa',
    'honey tsa', 'jar of honey', 'liquid honey'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Is honey considered a liquid for TSA?', answer: 'Yes! TSA classifies honey as a liquid/gel. In carry-on luggage, honey jars must be 3.4 oz (100 ml) or less. Larger jars must be packed in checked bags.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

updateItem('food/hot-sauce.json', item => {
  const aliases = [
    'can i bring hot sauce on a plane', 'can you bring hot sauce on a plane',
    'can i bring a bottle of hot sauce on a plane', 'hot sauce bottle', 'sriracha'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring hot sauce on a plane?', answer: 'In carry-on bags, hot sauce bottles must be 3.4 oz (100 ml) or smaller. Full-size bottles must go in checked luggage.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 26. Cooking Oil
updateItem('liquids/cooking-oil.json', item => {
  const aliases = [
    'can i bring cooking oil from malaysia to singapore', 'cooking oil', 'palm oil', 'olive oil cooking'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.international = item.international || {};
  item.international['Singapore'] = { status: 'ALLOWED', reason: 'Singapore Food Agency (SFA) allows travelers from Malaysia to bring up to 5kg / 5L of cooking oil for personal consumption without an import permit.' };
});

// 27. Picture Frame
updateItem('tools/picture-frame.json', item => {
  const aliases = [
    'can i take wooden photo frames to australia', 'wooden photo frames', 'picture frame'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.international = item.international || {};
  item.international['Australia'] = { status: 'RESTRICTED', reason: 'Wooden items and photo frames must be declared on arrival for Australian biosecurity inspection. Manufactured, finished wood without bark or insect damage passes inspection.' };
});

// 28. Juice
updateItem('liquids/juice.json', item => {
  const aliases = [
    'can.inshipped sealed.glass.kuice.in checked luggag', 'sealed glass juice in checked luggage',
    'glass bottle juice checked baggage', 'bottled juice'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 29. Bluetooth Speaker
updateItem('electronics/bluetooth-speaker.json', item => {
  const aliases = [
    'american airlines bluetooth speaker', 'can bluetooth speaker be checked in',
    'can i bring bluetooth speaker in checked luggage', 'can i bring bluetooth speaker on plane',
    'portable speaker', 'jbl speaker'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can a Bluetooth speaker be checked in luggage?', answer: 'Because most portable Bluetooth speakers contain rechargeable lithium-ion batteries, airlines and FAA/TSA strongly require them to be carried in your CARRY-ON baggage. If checked, the speaker must be completely powered off.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 30. Umbrella
updateItem('tools/umbrella.json', item => {
  const aliases = [
    'tsa umbrella policy', 'british airways umbrella', 'ryanair umbrella',
    'can i take an umbrella on a plane ryanair', 'emirates umbrella',
    'can you bring an umbrella on a plane ryanair', 'can you take an umbrella on a plane ryanair',
    'can i bring an umbrella on a plane', 'folding umbrella', 'golf umbrella'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can I bring an umbrella on Ryanair, British Airways, and Emirates?', answer: 'Yes! Small collapsible umbrellas are allowed in carry-on and personal item bags on all airlines. Large pointed golf umbrellas may need to be checked.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 31. Sports & Vehicles (Skateboard, Fishing Rod, Bicycle, Stroller, Golf Clubs)
updateItem('sports/skateboard.json', item => {
  const aliases = ['ryanair skateboard', 'skateboard carry on', 'skateboard on plane'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('sports/fishing-rod.json', item => {
  const aliases = ['united airlines fishing rod policy', 'fishing rod carry on', 'fishing gear plane'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('sports/bicycle.json', item => {
  const aliases = [
    'singapore airlines bike policy', 'singapore airlines bicycle policy',
    'singapore airlines bicycle', 'american airlines bicycle policy', 'bike on plane'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Singapore Airlines')) {
    item.airlines.push({ name: 'Singapore Airlines', status: 'ALLOWED', notes: 'Bicycles accepted as checked baggage within baggage allowance when properly packed in a bike box or protective case.' });
  }
  if (!item.airlines.some(a => a.name === 'American Airlines')) {
    item.airlines.push({ name: 'American Airlines', status: 'ALLOWED', notes: 'Bicycles accepted as standard checked luggage up to 50 lbs (23 kg) in hard/cardboard cases.' });
  }
});

updateItem('sports/golf-clubs.json', item => {
  const aliases = ['lufthansa golf clubs', 'golf clubs on plane', 'golf bag checked'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Lufthansa')) {
    item.airlines.push({ name: 'Lufthansa', status: 'ALLOWED', notes: 'Golf bags accepted as checked baggage or sports luggage up to 23 kg.' });
  }
});

updateItem('baby/collapsible-stroller.json', item => {
  const aliases = [
    'singapore airlines stroller policy', 'air france car seat policy',
    'baby stroller plane', 'gate check stroller'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Singapore Airlines')) {
    item.airlines.push({ name: 'Singapore Airlines', status: 'ALLOWED', notes: 'One fully collapsible stroller or pushchair checked free of charge for passengers traveling with infants.' });
  }
  if (!item.airlines.some(a => a.name === 'Air France')) {
    item.airlines.push({ name: 'Air France', status: 'ALLOWED', notes: 'Foldable stroller under 55 x 35 x 15 cm accepted in cabin; standard strollers checked free of charge at gate.' });
  }
});

// 32. Headphones & Earbuds
updateItem('electronics/headphones.json', item => {
  const aliases = [
    'do you get headphones on emirates flights', 'are headphones considered electronics',
    'headphones singapore airlines', 'are headphones considered electronics tsa',
    'can you put headphones in checked luggage', 'over ear headphones', 'noise cancelling headphones'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Emirates')) {
    item.airlines.push({ name: 'Emirates', status: 'ALLOWED', notes: 'Emirates provides complimentary headphones on all flights for the ice inflight entertainment system.' });
  }
  if (!item.airlines.some(a => a.name === 'Singapore Airlines')) {
    item.airlines.push({ name: 'Singapore Airlines', status: 'ALLOWED', notes: 'Headphones provided on long-haul flights; personal headphones permitted in cabin.' });
  }
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Do you get headphones on Emirates flights?', answer: 'Yes! Emirates provides complimentary premium headphones in Economy and noise-cancelling headsets in Business and First Class for their ice entertainment system.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

updateItem('electronics/earbuds.json', item => {
  const aliases = ['can you bring earbuds on a plane', 'tsa earbuds', 'airpods', 'wireless earbuds'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 33. Hair Straighteners & Hair Care
updateItem('beauty/hair-straightener.json', item => {
  const aliases = [
    'ryanair hair straightener', 'can you take hair straighteners in hand luggage ryanair',
    'ryanair hair straighteners', 'flat iron', 'hair straighteners'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you take hair straighteners in hand luggage on Ryanair?', answer: 'Yes! Electric corded hair straighteners and flat irons are fully allowed in hand luggage and checked bags on Ryanair and TSA flights. Cordless gas/butane straighteners have special limits (max 1 unit with safety cover).' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 34. Drone & Gaming Consoles
updateItem('electronics/drone.json', item => {
  const aliases = ['united airlines drone policy', 'dji drone plane', 'drone carry on'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('electronics/gaming-console.json', item => {
  const aliases = [
    'can you take a playstation on a plane', 'can you take an xbox on a plane as carry on american airlines',
    'playstation on plane', 'ps5 carry on', 'xbox on plane', 'nintendo switch'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you take an Xbox or PlayStation on a plane as carry-on?', answer: 'Yes! Full-size gaming consoles (PS5, Xbox Series X/S) and portable consoles (Nintendo Switch) are allowed in carry-on bags. Remove from your bag for separate X-ray screening at TSA checkpoints.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 35. iPad & Kindle
updateItem('electronics/ipad.json', item => {
  const aliases = ['can i check in ipad', 'can i check in my ipad', 'can i bring ipad on plane', 'tablet in checked luggage'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('electronics/kindle.json', item => {
  const aliases = ['can a kindle go in hold luggage', 'kindle in checked bag', 'e-reader on plane'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 36. Spices & Seasonings
updateItem('food/spices.json', item => {
  const aliases = [
    'can you bring spices on a plane', 'can i bring spices on a plane',
    'can you carry spices in carry on luggage', 'can you carry spices on a plane',
    'can you take seasoning through tsa', 'are spices allowed in checked baggage',
    'can i take spices on a plane', 'can you bring seasonings on a plane',
    'dry spices', 'seasoning powders'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring spices and seasonings on a plane?', answer: 'Yes! Dry spices and seasonings are allowed in carry-on and checked bags. Powder containers over 12 oz (350 ml) in carry-on may undergo additional X-ray screening.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 37. Candy & Sweets
updateItem('food/candy.json', item => {
  const aliases = [
    'can you bring candy on a plane international flight', 'can you bring lollipops on a plane',
    'can you bring gummy candy on a plane', 'can i bring jolly ranchers on a plane',
    'can you bring gummy bears through tsa', 'can you bring candy on a plane',
    'can you take lollipops through airport security', 'can i bring m&ms on an a plane',
    'can i take lollipops on a plane', 'can i bring gummy worms through tsa',
    'how much candy can i bring on a plane', 'can you bring candy through tsa',
    'can you take hard candy through tsa', 'lollipops', 'gummy bears', 'jolly ranchers'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('food/chocolate.json', item => {
  const aliases = [
    'can i bring chocolate in my carry on', 'can you take chocolate on the plane',
    'can i bring chocolate to the us', 'chocolate bar', 'chocolate box'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 38. Energy Drinks & Soda
updateItem('food/energy-drink.json', item => {
  const aliases = [
    'can i bring monster energy on a plane', 'can i bring energy drinks on a plane',
    'can i take monster energy on a plane', 'monster energy drink', 'red bull'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('liquids/soda.json', item => {
  const aliases = ['can you take a can of soda on a plane', 'can of soda', 'carbonated drinks on plane'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 39. Baby Formula & Baby Food
updateItem('baby/baby-formula.json', item => {
  const aliases = [
    'us customs baby formula', 'baby food hand luggage lufthansa', 'baby milk stansted',
    'taking baby milk through airport security uk', 'can i bring milk powder to canada'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
  item.airlines = item.airlines || [];
  if (!item.airlines.some(a => a.name === 'Lufthansa')) {
    item.airlines.push({ name: 'Lufthansa', status: 'ALLOWED', notes: 'Baby food and milk for infants permitted in reasonable quantities in hand luggage; exempt from 100ml rule.' });
  }
  item.faq = item.faq || [];
  const faqs = [
    { question: 'Can you bring baby food and formula on Lufthansa and UK flights?', answer: 'Yes! Baby formula, breast milk, and baby food in reasonable quantities for the flight are medically exempt from standard 100ml liquid limits on all airlines and security checkpoints.' }
  ];
  faqs.forEach(f => { if (!item.faq.some(x => x.question.toLowerCase() === f.question.toLowerCase())) item.faq.push(f); });
});

// 40. Protein Bars & Powder
updateItem('food/protein-bars.json', item => {
  const aliases = [
    'can i bring protein bars on a plane', 'can you take protein bars on a plane',
    'can you bring protein bars on a plane', 'can i take protein bars on a plane',
    'can i bring protein bars in my carry on', 'can i bring a protein bar on a plane',
    'can you pack protein bars in carry on', 'are protein bars allowed in carry on luggage',
    'can you take protein bars in your carry on', 'protein bars', 'energy bars'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 41. Tweezers
updateItem('personal-care/tweezers.json', item => {
  const aliases = [
    'tsa tweezers carry on', 'can you take tweezers in hand luggage ryanair',
    'are you allowed to bring tweezers on a plane', 'can i bring tweezers on a plane',
    'are tweezers allowed on planes', 'can you bring tweezers on a plane',
    'can you take tweezers on a plane', 'eyebrow tweezers'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 42. Mouthwash
updateItem('personal-care/mouthwash.json', item => {
  const aliases = [
    'what size mouthwash can you take on a plane', 'can you bring mouthwash on a plane',
    'can i take mouthwash on a plane', 'can you take mouthwash on a plane',
    'can i bring mouthwash in my carry on', 'can you bring mouthwash on a plane checked baggage',
    'travel mouthwash'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 43. Perfume & Deodorant
updateItem('personal-care/perfume.json', item => {
  const aliases = [
    'american airlines perfume policy', 'duty free perfume allowance uk',
    'how much perfume can i bring into uk', 'changi airport perfume theft', 'cologne on plane'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('personal-care/deodorant.json', item => {
  const aliases = [
    'united airlines deodorant size', 'is deodorant a liquid tsa', 'solid deodorant', 'spray deodorant'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 44. Dry Shampoo & Hairspray
updateItem('personal-care/dry-shampoo.json', item => {
  const aliases = ['can i bring dry shampoo on a plane', 'dry shampoo aerosol'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('personal-care/hair-spray.json', item => {
  const aliases = ['is hairspray allowed in checked baggage', 'hairspray aerosol'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 45. Jewelry & Gold Ring
updateItem('jewelry/gold-ring.json', item => {
  const aliases = [
    'engagement ring airport security uk', 'can i bring jewellery on a plane',
    'can i bring jewelry on a plane', 'diamond engagement ring'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 46. Heating Pad & Sleeping Bag
updateItem('camping/sleeping-bag.json', item => {
  const aliases = ['can you take a sleeping bag on a plane', 'sleeping bag carry on'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('health/heating-pad.json', item => {
  const aliases = ['can you bring heating pad on plane', 'electric heating pad'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 47. Fresh Fruits
updateItem('food/fresh-fruits.json', item => {
  const aliases = [
    'cn i bring oassion fruits through securty', 'can i bring passion fruit through security',
    'fresh fruits plane', 'passion fruit'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 48. Hookah & Vape
updateItem('tools/hookah.json', item => {
  const aliases = ['can i take hookah in flight', 'hookah carry on', 'shisha pipe on plane'];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

updateItem('electronics/vape.json', item => {
  const aliases = [
    'can i take my vape to france', 'can i bring my vape to france',
    'united vape policy', 'air france vape policy', 'e-cigarette carry on'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 49. Bug Spray / Aerosol
updateItem('liquids/aerosol-insect-repellent.json', item => {
  const aliases = [
    'can you bring bug spray on airplane', 'flying with aerosol bug spray',
    'insect repellent plane', 'deet bug spray'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

// 50. Canned Food & Canned Tuna
updateItem('food/canned-food.json', item => {
  const aliases = [
    'can i bring canned food on a plane', 'tsa canned food',
    'can i bring canned tuna to australia', 'canned tuna australia customs', 'canned soup'
  ];
  item.aliases = Array.from(new Set([...(item.aliases || []), ...aliases]));
});

console.log('Finished updating individual item records.');
