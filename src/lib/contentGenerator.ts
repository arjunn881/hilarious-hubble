export function getWhatIsThisItem(item: any): string {
  const aliasesText = item.aliases && item.aliases.length > 0 
    ? ` Often referred to as ${item.aliases.join(', ')}, it is` 
    : ' It is';
    
  return `${item.name} is a common item that passengers frequently pack when traveling. ${aliasesText} classified under the ${item.category} category by aviation security authorities. When preparing for a trip, understanding exactly what this item is and how it functions can help you determine the best way to pack it in compliance with Transportation Security Administration (TSA) regulations. Generally, ${item.description.toLowerCase()} Making sure you properly identify the item before arriving at the airport checkpoint ensures a smoother screening process.`;
}

export function getExceptions(item: any): string {
  if (item.carryOn.status === 'ALLOWED' && item.checkedBag.status === 'ALLOWED') {
    return `While ${item.name.toLowerCase()} is broadly permitted, there are always caveats at the security checkpoint. The primary exception applies if the item appears to have been modified or is concealed in a way that alarms the X-ray system. Furthermore, excessive quantities might be subject to additional screening. Officers maintain the final discretion to prohibit any item if it poses a perceived security threat.`;
  }
  if (item.carryOn.status === 'NOT_ALLOWED') {
    return `The strict prohibition of ${item.name.toLowerCase()} in carry-on bags rarely has exceptions for general passengers. However, some specialized items might be permitted for credentialed individuals (like law enforcement or certified medical personnel) who have pre-arranged clearance. For the average traveler, do not expect any leniency at the passenger screening checkpoint—it must go in checked baggage or stay home.`;
  }
  if (item.carryOn.status === 'RESTRICTED') {
    return `Because ${item.name.toLowerCase()} is categorized as restricted, exceptions are typically narrow. For example, if it is a medical necessity, you must declare it to the officer and present it for secondary inspection. If the restriction is based on size (such as the 3-1-1 liquids rule), exceptions are strictly limited to prescription medications, baby formula, or breast milk, which require separate screening.`;
  }
  return `Always consult with your airline or the TSA directly if you believe you qualify for a special exception for carrying ${item.name.toLowerCase()}.`;
}

export function getInternationalConsiderations(item: any): string {
  return `When flying internationally, you must comply not only with U.S. TSA regulations but also with the aviation security rules of your destination country and any transit hubs. For ${item.name.toLowerCase()}, policies can vary significantly in regions like the European Union (governed by EASA) or the United Kingdom (CAA). Some countries impose stricter volume limits on liquids, absolute bans on specific electronics, or rigorous customs declarations for items in the ${item.category} category. Always check the official customs and aviation authority website of your arrival country before packing this item.`;
}

export function getAlternativeItems(item: any): string {
  if (item.carryOn.status === 'NOT_ALLOWED') {
    return `If you cannot pack ${item.name.toLowerCase()} in your carry-on, consider purchasing a travel-compliant alternative or acquiring the item at your destination after you land. Many travelers opt for smaller, travel-sized variants, disposable options, or rent restricted equipment upon arrival to avoid the hassle of checked baggage declarations.`;
  }
  return `For travelers looking to optimize their packing space, consider multi-purpose alternatives to ${item.name.toLowerCase()}. Travel-specific versions are often lighter, more compact, and explicitly designed to meet both TSA and international aviation standards seamlessly.`;
}

export function getRelatedGuides(item: any): any[] {
  // A simplistic mock for related guides based on category
  const guides = [
    { title: "The Ultimate Guide to the TSA 3-1-1 Liquids Rule", url: "/guides/tsa-liquids-rule-311" },
    { title: "How to Pack Electronics for Air Travel", url: "/guides/flying-with-electronics" },
    { title: "TSA Prohibited Items List Explained", url: "/guides/tsa-prohibited-items-list" },
    { title: "International Baggage Rules for 2026", url: "/guides/international-baggage-rules" }
  ];
  
  if (item.category.toLowerCase().includes('liquid') || item.category.toLowerCase().includes('beauty')) {
    return [guides[0], guides[2]];
  }
  if (item.category.toLowerCase().includes('electronic') || item.category.toLowerCase().includes('battery')) {
    return [guides[1], guides[3]];
  }
  return [guides[2], guides[3]];
}

// ==========================================
// Category Page Generators
// ==========================================

export function getCategoryIntroduction(categoryName: string, itemsCount: number): string {
  return `Navigating the complexities of airport security can be a daunting task for even the most experienced travelers, especially when it comes to packing items in the ${categoryName} category. With ever-evolving regulations mandated by the Transportation Security Administration (TSA), it is crucial to understand exactly what you can and cannot bring on a plane. This comprehensive guide covers the specific carry-on and checked baggage rules for over ${itemsCount} items classified under ${categoryName}. \n\nWhether you are packing for a quick weekend domestic flight or embarking on a long-haul international journey, knowing the exact security posture for these items prevents delays at the checkpoint, avoids the frustration of having valuable belongings confiscated, and ensures you remain fully compliant with federal aviation safety standards. \n\nMany passengers assume that because an item is allowed in a checked bag, it is also permitted in the cabin—or vice versa. However, aviation security treats accessible cabin baggage and inaccessible cargo hold luggage very differently. By familiarizing yourself with the nuances of the ${categoryName} guidelines, you can pack your bags with confidence and breeze through the X-ray screening process.`;
}

export function getCategoryOverview(categoryName: string): string {
  return `The ${categoryName} category encompasses a wide range of personal, professional, and recreational items that travelers frequently bring to the airport. The primary concern for security officials regarding these items is whether they could be used to compromise the safety of the aircraft, the crew, or other passengers. Therefore, items in this classification are rigorously scrutinized under TSA's standard operating procedures.`;
}

export function getCategoryTSARules(categoryName: string): string {
  return `Under standard TSA regulations (Title 49 of the Code of Federal Regulations), the carriage of ${categoryName} items is strictly monitored. If an item presents a fire hazard, is classified as a hazardous material (HAZMAT), or features characteristics that could be weaponized (such as sharp edges, heavy blunt weight, or volatile chemical compositions), it will be restricted or outright banned from the passenger cabin. Conversely, if it poses no tangible threat, it is generally permitted in both carry-on and checked luggage, subject to standard size and weight limitations imposed by your specific airline.`;
}

export function getCategoryExceptions(categoryName: string): string {
  return `While the general rules for ${categoryName} are firm, the TSA does provide specific exceptions. The most common exemptions apply to medically necessary devices, prescription medications, and essential childcare items like baby formula and breast milk. If you believe an item in this category qualifies for a medical or essential needs exemption, you must declare it to the Transportation Security Officer (TSO) immediately upon arriving at the screening belt. The item will undergo additional testing, such as explosive trace detection or manual physical inspection.`;
}

export function getCategoryInternational(categoryName: string): string {
  return `International travel introduces an additional layer of regulatory complexity. When flying outside the United States with ${categoryName} items, you are subject to the aviation security rules of your departure airport, your destination, and any transit hubs in between. Agencies such as the European Union Aviation Safety Agency (EASA) or the UK Civil Aviation Authority (CAA) may have divergent restrictions compared to the TSA. Furthermore, local customs authorities may impose import restrictions or duties on specific items within this category, regardless of their flight safety status.`;
}

export function getCategoryCommonMistakes(categoryName: string): string {
  return `One of the most frequent mistakes passengers make with ${categoryName} items is failing to pack them accessibly. If an item is restricted or dense enough to obscure the X-ray operator's view, you will be required to remove it from your bag. Packing these items at the bottom of a tightly stuffed suitcase inevitably leads to a bag search, slowing down the line for everyone. Another common error is assuming that an expensive or sentimental item will be granted a pass by security officers—rules are enforced regardless of an item's monetary value.`;
}

export function getCategoryPackingRecommendations(categoryName: string): string {
  return `To optimize your airport experience, we strongly recommend packing ${categoryName} items in clear, dedicated organizational pouches or packing cubes near the top of your carry-on bag. This not only protects the items during transit but also allows you to quickly extract them if the TSA officer requests a separate screening bin. For items that must be checked, ensure they are thoroughly padded and surrounded by soft clothing to prevent damage from the rigorous mechanical baggage handling systems used at modern airports.`;
}

export function getCategoryFAQs(categoryName: string): any[] {
  const faqs = [];
  
  faqs.push({
    question: `Are all ${categoryName} items allowed on airplanes?`,
    answer: `No. While many ${categoryName} items are permitted, they are subject to specific carry-on and checked baggage rules depending on their size, battery type, and potential security risk as assessed by the TSA.`
  });
  
  faqs.push({
    question: `Do I need to remove ${categoryName} items from my bag at security?`,
    answer: `It depends on the specific item and the type of screening equipment used at the checkpoint. Generally, large electronics, dense organic materials, and restricted liquids must be removed and placed in a separate bin. Listen to the instructions provided by the TSA officers on duty.`
  });

  faqs.push({
    question: `Can I pack ${categoryName} items in my checked luggage?`,
    answer: `Most ${categoryName} items can be packed in checked luggage, provided they do not contain uninstalled lithium-ion batteries, flammable liquids, or other hazardous materials banned by the FAA in the cargo hold.`
  });
  
  faqs.push({
    question: `What happens if the TSA confiscates my ${categoryName} item?`,
    answer: `If a Transportation Security Officer determines an item is prohibited, you generally have a few options: surrender the item voluntarily, return to the ticketing counter to check it in a hold bag, hand it off to a non-traveling companion, or mail it to yourself if the airport provides postal services. TSA does not return surrendered items.`
  });
  
  faqs.push({
    question: `Do international airlines have different rules for ${categoryName}?`,
    answer: `Yes. Always consult your specific airline's conditions of carriage and the aviation authority of your destination country, as international rules regarding ${categoryName} items may be more stringent than U.S. TSA regulations.`
  });

  return faqs;
}
