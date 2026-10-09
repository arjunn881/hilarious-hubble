/**
 * Quick Answer Compiler Engine — Semantic Tokenization Edition
 *
 * Self-contained: verb resolved internally, no caller arguments beyond item.
 * Uses item.checkedBag (correct JSON field name — not item.checked).
 *
 * Redundancy detection upgrades over simple regex:
 *  • Parentheticals: "(Puree)", "(alkaline)" stripped before tokenising
 *  • Plurals: proper stemming — batteries→battery, foxes→fox, bags→bag
 *  • Fuzzy order: "Insect repellent aerosols" matches "Aerosol Insect Repellent"
 *    via token-overlap ratio rather than fixed prefix anchors
 *
 * Branch strategy:
 *  NOT_ALLOWED  — reason returned directly if it declares the ban; avoids
 *                 double-negative "No — X NOT allowed. X are prohibited."
 *  ALLOWED      — semantic filter strips restatements; specificity terms
 *                 (ml, oz, rule, must, protect…) always preserved
 *  RESTRICTED   — full reason unfiltered; "restricted by 3-1-1 rule" is
 *                 context, not a restatement, so it must not be stripped
 */
export function getWhatIsThisItem(item: any): string {
  if (!item) return "";

  const name: string = item.name.trim();

  // ── Verb resolver (IIFE) ───────────────────────────────────────────────────
  const verb: "is" | "are" = (() => {
    const lower = name.toLowerCase();
    const irregulars = ["feet", "teeth", "mice", "geese", "oxen", "children"];
    if (irregulars.includes(lower)) return "are";
    if (
      lower.endsWith("ies") ||
      (lower.endsWith("s") && !lower.endsWith("ss") && !lower.endsWith("us") && !lower.endsWith("is"))
    )
      return "are";
    return "is";
  })();

  // ── Data extraction — correct JSON field names ─────────────────────────────
  const cabinStatus: string = item.carryOn?.status  || "ALLOWED";        // "ALLOWED" | "NOT_ALLOWED" | "RESTRICTED"
  const cabinReason: string = (item.carryOn?.reason || "").trim();
  const holdStatus:  string = item.checkedBag?.status || "ALLOWED";      // NOTE: checkedBag, not checked
  const holdReason:  string = (item.checkedBag?.reason || "").trim();

  // ── Semantic token extractor ───────────────────────────────────────────────
  // Normalises a string into a stemmed token set for fuzzy overlap comparison.
  //   Step 1 — strip parentheticals:  "Baby Food (Puree)" → "Baby Food"
  //   Step 2 — strip symbols:          "3-1-1" → "3 1 1"
  //   Step 3 — split on whitespace
  //   Step 4 — drop short words        (≤2 chars: a, in, of, on, by…)
  //   Step 5 — stem common plurals:    batteries→battery  foxes→fox  bags→bag
  function extractTokens(str: string): string[] {
    return str
      .toLowerCase()
      .replace(/\([^)]*\)/g, " ")           // "(Puree)" → " "
      .replace(/[^a-z0-9\s]/g, " ")         // symbols → space
      .split(/\s+/)
      .filter(t => t.length > 2)             // drop: a, in, of, on, by, is…
      .map(t =>
        t.endsWith("ies") && t.length > 4  ? t.slice(0, -3) + "y"  // batteries→battery
        : t.endsWith("es")  && t.length > 4  ? t.slice(0, -2)        // foxes→fox
        : t.endsWith("s")   && t.length > 3  ? t.slice(0, -1)        // bags→bag
        : t
      );
  }

  const nameTokens: string[] = extractTokens(name);

  // ── Specificity guard terms ────────────────────────────────────────────────
  // Any sentence containing at least one of these is considered to carry
  // concrete information beyond a bare status declaration — always kept.
  const SPECIFICITY_TERMS = [
    "oz", "ml", "wh", "gram", "liter", "litre",
    "limit", "maximum", "quantity", "per",
    "rule", "regulation", "must", "cannot", "only",
    "protect", "terminal", "short circuit", "secure",
    "original", "packaging", "because", "due to", "under", "ensure", "place"
  ];

  // ── Semantic redundancy filter (ALLOWED branch only) ──────────────────────
  // Removes sentences from cabinReason / holdReason whose sole purpose is to
  // restate "X is allowed in carry-on", which the primary sentence already says.
  //
  // A sentence is flagged as redundant when ALL three conditions hold:
  //   1. It contains "allow" or "permit"
  //   2. It shares ≥ 40% token overlap with the item name
  //   3. It contains none of the specificity guard terms
  function filterAllowedRestatements(text: string): string {
    return text
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .filter(sentence => {
        const lower = sentence.toLowerCase();
        // Condition 1: status word present?
        const hasStatusWord = lower.includes("allow") || lower.includes("permit");
        if (!hasStatusWord) return true;                             // no status word → always keep
        // Condition 3: does it carry concrete specifics?
        const hasSpecificity = SPECIFICITY_TERMS.some(t => lower.includes(t));
        if (hasSpecificity) return true;                            // has limits/rules → keep
        // Condition 2: token overlap ratio with item name
        const sentTokens = extractTokens(sentence);
        const overlap    = nameTokens.filter(t => sentTokens.includes(t)).length;
        const ratio      = nameTokens.length > 0 ? overlap / nameTokens.length : 0;
        return ratio < 0.4;                                         // low overlap → keep; high → restatement → strip
      })
      .join(" ")
      .trim();
  }

  // ── Segment pipeline helpers ───────────────────────────────────────────────
  const cap      = (s: string): string => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  const terminate = (s: string): string => /[.!?]$/.test(s) ? s : `${s}.`;

  function buildOutput(raw: string[]): string {
    const seen = new Set<string>();
    return raw
      .map(s => terminate(s.trim()))
      .filter(s => s.length > 1 && !seen.has(s) && seen.add(s))
      .join(" ");
  }

  // ── Branch 1: NOT_ALLOWED ──────────────────────────────────────────────────
  // Return the data reason as the sole sentence when it already declares the
  // ban. Prepending "No — X is NOT allowed..." creates a redundant double-negative.
  if (cabinStatus === "NOT_ALLOWED") {
    if (cabinReason && /prohibited|not allowed|forbidden|banned/i.test(cabinReason)) {
      return terminate(cabinReason);
    }
    // Fallback for items with no or non-declarative reason field.
    return `No — ${name} ${verb} NOT allowed in carry-on bags. Pack in checked luggage only.`;
  }

  // ── Branch 2: ALLOWED ──────────────────────────────────────────────────────
  if (cabinStatus === "ALLOWED") {
    const primary    = `Yes — ${name} ${verb} allowed in carry-on bags by TSA.`;
    const cleanCabin = cap(filterAllowedRestatements(cabinReason));

    const segments: string[] = [primary];
    if (cleanCabin) segments.push(cleanCabin);

    if (holdStatus === "ALLOWED") {
      const cleanHold = cap(filterAllowedRestatements(holdReason));
      if (cleanHold && cleanHold !== cleanCabin) {
        // Hold reason adds genuinely new information — include it.
        segments.push(cleanHold);
      } else if (!cleanCabin) {
        // No carry-on copy survived filtering — at minimum confirm hold is fine.
        segments.push(`${name} ${verb} also permitted in checked luggage.`);
      }
    }
    return buildOutput(segments);
  }

  // ── Branch 3: RESTRICTED ──────────────────────────────────────────────────
  // Full cabin reason kept unfiltered. "Restricted by the 3-1-1 liquids rule"
  // is regulation context — stripping it would remove important information.
  const primary   = `${name} ${verb} allowed in carry-on with restrictions.`;
  const segments: string[] = [primary];

  if (cabinReason) segments.push(cap(cabinReason));

  // Append a hold hint only if the cabin reason hasn't already addressed it.
  if (holdStatus === "ALLOWED" && !cabinReason.toLowerCase().includes("checked")) {
    segments.push(`Larger quantities may be stored in checked luggage without the size restriction.`);
  }

  return buildOutput(segments);
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
    { title: "The Complete TSA 3-1-1 Liquids Rule", url: "/guide/tsa-311-liquids-rule/" },
    { title: "Flying With Electronics & Batteries", url: "/guide/batteries-on-plane/" },
    { title: "TSA Prohibited Items Explained", url: "/guide/tsa-precheck-guide/" },
    { title: "International Baggage Rules 2026", url: "/guide/traveling-with-lithium-batteries/" }
  ];
  
  if (item.category.toLowerCase().includes('liquid') || item.category.toLowerCase().includes('beauty')) {
    return [guides[0], guides[2]];
  }
  if (item.category.toLowerCase().includes('electronic') || item.category.toLowerCase().includes('battery')) {
    return [guides[1], guides[3]];
  }
  return [guides[2], guides[3]];
}

export function getScreeningProcedure(item: any): string {
  const cat = item.category.toLowerCase();
  
  if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
    return `When passing through the TSA checkpoint with ${item.name.toLowerCase()}, place your travel-sized container (3.4 oz / 100 mL or less) inside a clear, quart-sized plastic bag. If standard 2D X-ray machines are operating at your lane, extract the quart bag and lay it flat in a screening bin. At airports equipped with modern 3D CT computed tomography scanners, you may leave your liquids inside your bag unless instructed otherwise by Transportation Security Officers. Medical liquids or baby nourishment exceeding 3.4 oz must be declared immediately prior to screening for manual inspection or explosive trace detection (ETD) testing.`;
  }
  if (cat.includes('electronic') || cat.includes('battery')) {
    return `During security screening for ${item.name.toLowerCase()}, any device larger than a standard smartphone (such as laptops, tablets, or large camera equipment) must be removed from your carry-on luggage and placed in a dedicated screening bin with nothing underneath or on top. Power banks, spare lithium-ion batteries, and rechargeable devices must remain in your carry-on luggage and are strictly forbidden in checked baggage due to FAA cargo fire safety protocols. Turn off high-capacity battery units to prevent accidental activation during flight.`;
  }
  if (cat.includes('medicine') || cat.includes('health')) {
    return `Medication and medical devices such as ${item.name.toLowerCase()} receive special consideration from TSA security personnel. Inform the officer at the start of the screening belt if you are carrying prescription drugs, liquid pharmaceuticals, or specialized equipment. Medical items are not required to fit inside a 3-1-1 liquids bag. Officers may visually inspect the containers, test for trace explosives, or ask you to open non-sterile outer packaging while ensuring your medical items remain sanitary.`;
  }
  if (cat.includes('tool') || cat.includes('camping') || cat.includes('sports')) {
    return `Security officers evaluate ${item.name.toLowerCase()} under strict hazard criteria. Items with sharp edges, heavy weight, or weaponized potential will trigger an automatic secondary bag inspection. If ${item.name.toLowerCase()} is prohibited in carry-on bags, attempting to pass through the checkpoint with it will lead to mandatory confiscation. Ensure tools under 7 inches, sports equipment, or camping gear are clearly accessible in your bag if permitted, or securely wrapped inside checked luggage.`;
  }
  return `At the airport screening lane, ${item.name.toLowerCase()} will pass through standard X-ray or CT scanning equipment. Keep ${item.name.toLowerCase()} neatly arranged in your luggage so officers can get a clear image. If an item appears opaque or clustered with wires or dense materials on the monitor, a secondary manual bag search will be conducted. Cooperate with TSA personnel and allow them to inspect the item without opening sealed packaging yourself.`;
}

export function getRegulatoryDetails(item: any): string {
  const cat = item.category.toLowerCase();
  if (cat.includes('electronic') || cat.includes('battery')) {
    return `Under Federal Aviation Administration (FAA) HazMat safety regulations (49 CFR § 175.10(a)(18)) and IATA Dangerous Goods Regulations, lithium-ion batteries powering ${item.name.toLowerCase()} are capped at 100 Watt-hours (Wh) per battery for standard carry-on. Spare batteries between 100 Wh and 160 Wh require explicit airline approval. Uninstalled lithium batteries are strictly prohibited in checked cargo holds because cargo fires involving lithium chemistries cannot be easily extinguished in flight.`;
  }
  if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
    return `Title 49 of the Code of Federal Regulations (§ 1540.111) dictates the 3-1-1 liquids rule for passenger cabin baggage. Containers carrying ${item.name.toLowerCase()} must be 3.4 fluid ounces (100 milliliters) or smaller by capacity. Larger containers that are only partially full are still prohibited in cabin baggage unless they fall under medical or infant care exemptions. Containers larger than 3.4 oz must be packed in checked luggage.`;
  }
  if (cat.includes('medicine') || cat.includes('health')) {
    return `The TSA operates under 49 CFR § 1544.219 guidelines permitting medically necessary liquids, gels, and aerosols in reasonable quantities exceeding standard 3.4 oz limits. While prescription labels matching your photo ID are not strictly legally required by federal law, carrying original labeled pharmacy packaging drastically reduces checkpoint screening friction.`;
  }
  return `Carriage of ${item.name.toLowerCase()} is governed by TSA security directives under 49 CFR § 1540.111 regarding passenger screening and baggage security. Security rules distinguish sharply between accessible passenger cabin space (where items that could serve as weapons or hazards are prohibited) and cargo hold baggage (where items are safely stowed during flight).`;
}

export function getAirlineDifferences(item: any): string {
  return `While TSA establishes baseline security screening at U.S. airports, individual airlines reserve the right to enforce more stringent baggage policies for ${item.name.toLowerCase()}. Legacy U.S. carriers like Delta, United, and American Airlines generally align directly with TSA standards. However, ultra-low-cost carriers (such as Spirit or Frontier) and international airlines (including Ryanair, Lufthansa, and Emirates) strictly enforce cabin bag dimensions and weight limits (typically 7 kg to 10 kg total carry-on allowance). If traveling internationally, foreign aviation authorities like EASA (European Union) or CAA (United Kingdom) may have additional custom rules regarding ${item.category.toLowerCase()} items.`;
}

export function getStepByStepPackingGuide(item: any): string[] {
  const name   = item.name || "this item";
  const lname  = name.toLowerCase();
  const slug   = item.slug || "";
  const status = item.carryOn?.status || "ALLOWED";

  // ── 1. Checked-bag fallback (NOT_ALLOWED in cabin) ──────────────────────────
  if (status === "NOT_ALLOWED") {
    return [
      `Confirm that ${lname} is fully permitted in checked hold baggage and does not contain prohibited HAZMAT components or uninstalled lithium batteries.`,
      `Wrap ${lname} in bubble wrap, heavy clothing, or a padded protective pouch to shield it from baggage handling turbulence.`,
      `Pack the item deep inside the center of your suitcase, buffered by clothing on all sides rather than pressed against outer luggage walls.`,
      `Secure your suitcase with a TSA-approved combination lock so airport screening agents can inspect and relock the bag without damage.`,
      `Verify your packed bag does not exceed your airline's checked weight threshold (typically 50 lbs / 23 kg) to prevent excess fees at check-in.`,
    ];
  }

  // ── 2. High-Specificity Item Type Blueprints (Apparel, Footwear, Styling) ───
  const isFootwear = [
    'shoes', 'sneakers', 'boots', 'high-heels', 'sandals', 'slippers', 'footwear', 'cleats', 'flip-flops'
  ].some(term => lname.includes(term) || slug.includes(term));

  if (isFootwear) {
    return [
      `Pack ${lname} near the bottom of your suitcase (closest to the wheels) to maintain luggage balance and prevent crushing softer garments.`,
      `Stuff the inside of ${lname} with clean socks, rolled belts, or small accessories to maximize packing density and preserve shoe shape.`,
      `Place ${lname} inside a dedicated shoe bag, travel dust pouch, or plastic bag to prevent street dirt on the soles from transferring to clean clothes.`,
      `Wear your heaviest or bulkiest pair of shoes during transit to reduce suitcase weight and preserve valuable cabin bag volume.`,
      `At TSA airport security checkpoints, standard screening passengers must remove shoes and place them directly in a bin or on the belt (TSA PreCheck travelers may leave shoes on).`,
    ];
  }

  const isGarment = [
    'suit', 'wedding-dress', 'dress', 'garment', 'tuxedo', 'coat', 'jacket', 'belt'
  ].some(term => lname.includes(term) || slug.includes(term));

  if (isGarment) {
    return [
      `Transport high-value or delicate garments like ${lname} inside a breathable folding travel garment bag; many airlines accept garment bags as a carry-on or personal item.`,
      `Politely check with flight attendants upon boarding to see if forward cabin hanging closet space is available for ${lname}.`,
      `If packing ${lname} inside a suitcase, place dry-cleaner plastic bags between folds to minimize friction and prevent travel wrinkles.`,
      `Keep formal wear and suits with you in cabin baggage whenever possible to safeguard against checked luggage delays or loss before special events.`,
      `Hang ${lname} in the hotel bathroom immediately after arrival so shower steam naturally releases any minor packing creases.`,
    ];
  }

  const isAppliance = [
    'hair-dryer', 'straightener', 'curling-iron', 'shaver', 'trimmer'
  ].some(term => lname.includes(term) || slug.includes(term));

  if (isAppliance) {
    return [
      `Ensure ${lname} is completely turned off, unplugged, and cooled to room temperature before packing inside luggage.`,
      `Wrap the electrical cord loosely around the unit or secure it with a velcro tie; avoid tightly wrapping cords to protect internal wiring.`,
      `Check the voltage rating on ${lname} (110V vs 220V–240V); traveling overseas with single-voltage high-wattage styling tools requires a heavy-duty voltage converter, not just a plug adapter.`,
      `Cushion heating elements and motors by surrounding ${lname} with soft clothing inside your carry-on or checked luggage.`,
      `Any cordless styling device powered by butane cartridges or lithium-ion batteries must remain in carry-on baggage with its safety cap locked.`,
    ];
  }

  const isSolidToiletries = [
    'shampoo-bar', 'soap-bar', 'tweezers', 'nail-clippers'
  ].some(term => lname.includes(term) || slug.includes(term));

  if (isSolidToiletries) {
    return [
      `Confirm that ${lname} is completely solid — solid bars and personal grooming tools are 100% exempt from the TSA 3-1-1 liquids rule.`,
      `Store ${lname} in a breathable mesh pouch, aluminum travel tin, or compact toiletry organizer to keep it dry and intact.`,
      `Pack anywhere in your carry-on luggage without needing to place it inside your clear liquids quart bag.`,
      `Ensure sharp grooming tools (like tweezers or nail scissors) have blades under 4 inches from the pivot point to pass cabin security.`,
      `Keep within easy reach in an exterior luggage pocket for convenient freshening up during layovers.`,
    ];
  }

  // ── 3. Category-Aware Carry-On Blueprints ──────────────────────────────────
  const CARRY_ON_BLUEPRINTS: Record<string, string[]> = {
    Liquids: [
      `Verify your container holds 3.4 oz (100 ml) or less. Larger bottles of ${lname} must travel in checked luggage unless purchased airside at a duty-free outlet.`,
      `Seal the ${lname} cap tightly to prevent leaks caused by cabin pressure changes, then place it inside a clear, resealable 1-quart plastic bag.`,
      `Pack the sealed bag in an outer pocket of your carry-on for fast, one-hand retrieval at the TSA liquids checkpoint.`,
      `At the security lane, remove the clear liquids bag from your carry-on and lay it flat in a screening tray on its own.`,
      `If travelling internationally, check the destination country's import limits on volumetric liquids or spirits before boarding.`,
    ],
    Food: [
      `Confirm whether ${lname} is classified as a solid or a liquid/gel — spreads, pastes, and purees fall under the TSA 3-1-1 rule and must fit in your liquids bag.`,
      `Wrap individual pieces in food-grade plastic wrap, foil, or an airtight container to maintain freshness and prevent crushing in a packed bag.`,
      `Place fresh produce or loose food items in an easily accessible top compartment for rapid declaration at customs checkpoints.`,
      `Consume or properly dispose of fresh foods before crossing international borders — agricultural customs inspectors frequently confiscate fresh produce.`,
      `Ensure all food items are fully sealed to prevent odours or liquid drips inside the aircraft cabin.`,
    ],
    Baby: [
      `Baby food, formula, breast milk, and juice are exempt from the 3-1-1 liquids rule — you may carry reasonable quantities regardless of container size.`,
      `Inform the TSA officer at the checkpoint that you are carrying baby items; they may test liquids separately but cannot require you to open sealed formula.`,
      `Pack nappies, wipes, and a change of clothes near the top of your carry-on for quick in-flight access.`,
      `Carry a small portable changing mat in your bag for use on the aircraft or in airport facilities.`,
      `If travelling with sterilised equipment, keep items in sealed, sterile pouches until needed to maintain hygiene during transit.`,
    ],
    Electronics: [
      `Verify battery specifications for ${lname}. Spare lithium-ion batteries and external power banks must stay in carry-on luggage — they are prohibited in checked bags.`,
      `Ensure the ${lname} power switch or heating element is fully off and safety-locked before placing it in your bag.`,
      `Protect exposed terminals on spare batteries by covering contacts with tape or storing them in individual plastic pouches.`,
      `Be prepared to remove large electronics (larger than a mobile phone) from your bag to lay them flat in a TSA screening tray.`,
      `Store delicate screens and components inside a padded sleeve to protect them from impact during boarding and overhead-bin loading.`,
    ],
    Tools: [
      `Measure your ${lname} end-to-end. Hand tools 7 inches or shorter may go in carry-on; anything longer must travel in checked luggage.`,
      `Ensure ${lname} does not feature cutting blades, knives, or sharp points, which are strictly prohibited in the passenger cabin.`,
      `Wrap exposed metallic points or heavy handles in protective padding to avoid puncturing luggage fabric or damaging other items.`,
      `Organise tools inside a dedicated zip pouch or tool roll to keep them contained and simple to present during inspection.`,
      `If packing tools in checked luggage, anchor heavy items against the main suitcase frame to keep baggage weight balanced.`,
    ],
    Flammables: [
      `Verify TSA limits: one common disposable lighter or one box of safety matches is permitted on your person or in cabin baggage.`,
      `Torch lighters (blue flame jet lighters), strike-anywhere matches, and lighter fluid refills are completely prohibited in all baggage.`,
      `Electronic lighters and e-cigarettes containing lithium batteries must be kept in carry-on bags only — never pack them in checked luggage.`,
      `Check destination rules: countries like Singapore, India, and Thailand enforce complete bans and severe penalties for electronic smoking devices.`,
      `Keep ${lname} separate from aerosol toiletries and flammable liquids inside your travel bag.`,
    ],
    Household: [
      `Wrap fragile household items like ${lname} in bubble wrap or thick soft clothing to cushion against baggage movement.`,
      `If carrying solid wax candles, pack them accessibly; dense wax blocks can appear opaque on X-rays and may prompt a brief hand search.`,
      `Do not pre-wrap holiday gifts or boxed items; TSA officers must be able to open packages if an item triggers a screening alarm.`,
      `Pack delicate ceramic mugs, glassware, or picture frames in your cabin bag rather than risking cargo hold handling shock.`,
      `Verify whether your household item contains liquid or gel elements (like snow globes or gel candles), which fall under the 3-1-1 liquids rule.`,
    ],
    "Personal Care": [
      `Any liquid, gel, cream, or aerosol personal care product must comply with the 3-1-1 rule: containers of 3.4 oz (100 ml) or less inside one clear quart bag.`,
      `Aerosol personal-care products must have safety caps attached; TSA officers can refuse items with missing or broken caps.`,
      `Pack solid versions of personal care items (solid shampoo, deodorant sticks, styling accessories) in carry-on without volume restrictions.`,
      `Place your liquids toiletry bag at the top of your carry-on for fast retrieval at the security checkpoint.`,
      `For international journeys, verify destination regulations regarding restricted medicated cosmetics or pressurized aerosol sizes.`,
    ],
    Beauty: [
      `Liquid, gel, or cream beauty products — including ${lname} — must be in 3.4 oz (100 ml) or smaller containers and fit inside one quart-sized clear bag.`,
      `Sharp beauty tools such as nail scissors under 4 inches are generally permitted; check TSA guidelines for any bladed accessories.`,
      `Place fragile glass bottles inside bubble wrap or a padded cosmetics case to prevent breakage inside your bag.`,
      `Keep high-value beauty items (serums, perfumes) in your carry-on rather than checked luggage to avoid loss or theft.`,
      `Remove the liquids bag at the checkpoint; consolidate remaining beauty products in a separate organisational pouch inside your bag.`,
    ],
    Health: [
      `Prescription medications including ${lname} are exempt from the 3-1-1 rule — carry them in their original labelled pharmacy container where possible.`,
      `Carry a copy of your prescription or a doctor's letter, especially when travelling internationally, to prevent customs or security delays.`,
      `Keep essential medications in your carry-on, never in checked luggage, to ensure access if bags are delayed or lost.`,
      `Medical devices, sharps, and syringes require a medical certificate; notify the TSA officer before screening begins.`,
      `Pack a sufficient supply for the entire trip plus extra days to cover potential travel disruptions or missed connections.`,
    ],
    Medicine: [
      `Pack ${lname} in its original pharmacy container with the prescription label intact — this avoids security questions in any country.`,
      `Liquid medicines over 3.4 oz are permitted if medically necessary; declare them separately to the TSA officer before screening.`,
      `Keep a printed copy of your prescription or a physician's letter accessible at the checkpoint for international trips.`,
      `Store temperature-sensitive medicines in an insulated pouch with an ice pack; inform the airline in advance if refrigeration is needed.`,
      `Carry sufficient doses in your carry-on for the full journey in case your checked luggage is delayed or misrouted.`,
    ],
    Camping: [
      `Sharp camping tools (knives, tent stakes, axes) must travel exclusively in checked luggage — they are prohibited in carry-on bags.`,
      `Gas canisters, fuel cells, and liquid fuel are generally prohibited in both carry-on and checked luggage; switch to lightweight solid or electric alternatives for air travel.`,
      `Pack ${lname} in a dedicated hard-shell case or heavy-duty stuff sack and anchor it in the centre of your checked bag to resist impact.`,
      `Trekking poles and hiking poles must be checked — measure overall packed length and confirm your airline's oversized-bag policy.`,
      `Camping stoves must be completely empty of fuel and free of residue before packing in checked luggage; TSA officers may inspect them.`,
    ],
    Sports: [
      `Check your airline's oversized and sports-equipment policy — bulky gear like ${lname} often requires advance booking and additional fees.`,
      `Protect equipment with purpose-built hard travel cases, foam padding, or custom bags rated for checked-luggage impact.`,
      `Remove any loose or protruding parts and pack them separately to prevent damage to the main item or other luggage.`,
      `Drain all inflatable equipment (balls, rafts) fully before packing to minimise volume and prevent pressure-related damage.`,
      `Label your equipment case clearly with your name, phone number, and destination for fast identification at baggage claim.`,
    ],
    Jewelry: [
      `Place high-value jewellery including ${lname} in your carry-on — never pack valuable pieces in checked luggage.`,
      `Store individual pieces in a dedicated jewellery roll or compartmentalised box to prevent tangling or scratching.`,
      `Wear bulky jewellery through security or place it in your personal item before the checkpoint to avoid triggering the metal detector.`,
      `For very high-value items, consider using a TSA-approved locking jewellery pouch and photograph pieces before travel for insurance records.`,
      `Keep certificates of authenticity or purchase receipts accessible when passing through international customs to avoid import duty disputes.`,
    ],
    Documents: [
      `Keep ${lname} and all critical travel documents in a dedicated document organiser in your carry-on — never in checked luggage.`,
      `Use a RFID-blocking passport holder to protect chip-enabled documents from electronic skimming at busy airports.`,
      `Make digital copies of all important documents and store them securely in cloud storage accessible offline on your phone.`,
      `Keep photocopies of key documents separate from the originals — store one set in your carry-on and one in your checked bag.`,
      `At security, leave documents in your bag unless an officer specifically requests them; avoid placing passports loose in trays.`,
    ],
    General: [
      `Verify the size and weight of ${lname} against your airline's carry-on dimensions and weight limits before heading to the airport.`,
      `Place the item in an organised fashion inside your carry-on, grouping similar items in clear packing cubes for easy inspection.`,
      `Keep fragile or high-value items near the centre of your bag, surrounded by soft clothing layers for cushioning.`,
      `Be ready to remove ${lname} from your bag for secondary screening if requested by a TSA officer at the checkpoint.`,
      `Secure all zip compartments and external straps on your luggage so contents stay stable during boarding and overhead-bin placement.`,
    ],
  };

  const currentCategory = item.category?.trim() || "General";
  const matchedKey = Object.keys(CARRY_ON_BLUEPRINTS).find(
    key => key.toLowerCase() === currentCategory.toLowerCase()
  ) ?? "General";
  return CARRY_ON_BLUEPRINTS[matchedKey];
}

export function getExpandedItemFAQs(item: any): Array<{ question: string; answer: string }> {
  const name = item.name.toLowerCase();
  const cat = item.category.toLowerCase();
  
  return [
    {
      question: `Is ${name} allowed on a plane in 2026?`,
      answer: `Yes, ${name} is ${item.carryOn.status.toLowerCase().replace('_', ' ')} in carry-on cabin baggage and ${item.checkedBag.status.toLowerCase().replace('_', ' ')} in checked hold luggage according to official TSA regulations. ${item.carryOn.reason}`
    },
    {
      question: `Can I put ${name} in my carry-on bag?`,
      answer: `${item.carryOn.status === 'ALLOWED' ? `Yes, ${name} is fully permitted in your carry-on bag.` : item.carryOn.status === 'RESTRICTED' ? `Yes, but ${name} is subject to specific restrictions in carry-on luggage.` : `No, ${name} is prohibited in carry-on bags.`} ${item.carryOn.conditions && item.carryOn.conditions.length > 0 ? item.carryOn.conditions.join(' ') : 'Ensure it is packed safely and complies with security guidelines.'}`
    },
    {
      question: `Can I pack ${name} in checked luggage?`,
      answer: `${item.checkedBag.status === 'ALLOWED' ? `Yes, ${name} can be safely packed in your checked hold bag without quantity restrictions.` : item.checkedBag.status === 'RESTRICTED' ? `Yes, ${name} is permitted in checked bags under strict conditions.` : `No, ${name} cannot be checked in cargo baggage.`} ${item.checkedBag.reason}`
    },
    {
      question: `What happens if security officers flag ${name} at the airport?`,
      answer: `If a TSA officer flags ${name} during X-ray inspection, your bag will be pulled aside for manual inspection. The officer will inspect the item, potentially test it for explosive residue, and verify compliance. The final decision always rests with the TSA officer on duty.`
    },
    {
      question: `Do international baggage rules for ${name} differ from TSA rules?`,
      answer: `While U.S. TSA rules cover all domestic flights, foreign aviation agencies (such as EASA in Europe or CAA in the UK) may enforce slight variations for ${cat} items. Always verify the rules of your destination country and transit airports before embarking on international flights.`
    }
  ];
}

// ==========================================
// Category Page Dedicated Profiles
// ==========================================

interface CategoryProfile {
  introduction: (count: number) => string;
  overview: string;
  tsaRules: string;
  exceptions: string;
  international: string;
  commonMistakes: string;
  recommendations: string;
  faqs: Array<{ question: string; answer: string }>;
}

const CATEGORY_PROFILES: Record<string, CategoryProfile> = {
  tools: {
    introduction: (count) => `Navigating airport security with tools requires strict attention to TSA dimension and sharp-edge rules. While many standard hand tools are permitted in the cabin, strict limits govern blade lengths, heavy blunt instruments, and power tools. This comprehensive guide details the carry-on and checked baggage rules for over ${count} items in the Tools category.\n\nWhether you are a traveling technician, a tradesperson with essential equipment, or an everyday traveler packing a multi-tool, understanding checkpoint limits prevents expensive confiscations. Aviation security distinguishes strictly between accessible cabin tools and secure cargo hold luggage.\n\nFamiliarize yourself with the TSA 7-inch length standard, power tool battery regulations, and checked bag requirements below to clear security without hassle.`,
    overview: `The Tools category encompasses manual hand tools, power equipment, hardware, and multi-tools. Transportation security officers evaluate tools primarily on whether they could be wielded as striking weapons, cutting instruments, or mechanical hazards in the passenger cabin.`,
    tsaRules: `Under Title 49 CFR and TSA checkpoint directives, non-bladed hand tools measuring 7 inches (approx. 18 cm) or less from end to end are permitted in carry-on bags. Any tool exceeding 7 inches—such as hammers, crowbars, large wrenches, and long screwdrivers—must travel in checked baggage. Power tools (drills, circular saws) are strictly prohibited in the cabin.`,
    exceptions: `Small scissors with blades under 4 inches from the pivot point and round-bladed butter knives are permitted in carry-on bags. Cordless power tools must be checked, but their rechargeable lithium-ion battery packs must be detached and carried in the passenger cabin.`,
    international: `International aviation authorities (including EASA across Europe and the UK CAA) enforce stricter tool guidelines than the TSA. In several European and Asian airports, screwdrivers or pliers of any length may be confiscated at the screener's discretion. Check specific overseas carrier guidelines before international flights.`,
    commonMistakes: `The most common mistake is failing to measure a tool including its handle; TSA measures total length from tip to butt. Another frequent error is bringing multi-tools with integrated knife blades into the cabin—even microscopic non-locking blades lead to immediate checkpoint surrender.`,
    recommendations: `Wrap sharp edges and heavy tool heads securely in protective sheaths or thick work towels. When checking tools, pack them in the center of your suitcase surrounded by durable workwear to prevent metal edges from puncturing luggage fabric.`,
    faqs: [
      {
        question: `Can I bring tools in my carry-on bag?`,
        answer: `Non-bladed hand tools 7 inches or shorter (such as small screwdrivers, pliers, and wrenches) are allowed in carry-on bags. Any tool longer than 7 inches must be placed in checked luggage.`
      },
      {
        question: `Are power tools allowed on airplanes?`,
        answer: `Power tools like drills and saws must be packed in checked luggage. However, their rechargeable lithium-ion battery packs must be removed and kept with you in your carry-on luggage.`
      },
      {
        question: `Can I bring a multi-tool through airport security?`,
        answer: `Multi-tools without knives or blades are permitted in carry-on bags. If your multi-tool includes any knife blade, it is strictly prohibited in cabin luggage and must go in checked baggage.`
      },
      {
        question: `What is the TSA 7-inch rule for tools?`,
        answer: `TSA permits hand tools in the aircraft cabin only if their total assembled length is 7 inches or less from end to end. Wrenches, screwdrivers, and pliers exceeding 7 inches must be checked.`
      },
      {
        question: `Do international airlines have different rules for tools?`,
        answer: `Yes. Many international airports (such as in the UK and EU) do not honor the 7-inch exemption and prohibit all manual screwdrivers, pliers, and wrenches in carry-on baggage.`
      }
    ]
  },

  flammables: {
    introduction: (count) => `Carrying flammable items and smoking accessories on commercial aircraft involves stringent safety regulations enforced by the FAA and TSA. This directory covers the exact carry-on and checked luggage guidelines for over ${count} items classified under Flammables.\n\nFrom common disposable lighters and safety matches to e-cigarettes and travel torches, fire safety rules are designed to prevent accidental combustion in the passenger cabin and pressurized cargo hold.\n\nReview the exact carriage limits, lithium-battery restrictions, and prohibited flame items below to ensure full compliance before heading to the terminal.`,
    overview: `The Flammables category includes lighters, matches, tobacco accessories, and combustion materials. Aviation regulations focus primarily on fire prevention, thermal runaway risks, and open-flame hazards aboard commercial aircraft.`,
    tsaRules: `TSA permits passengers to carry one common disposable lighter or one box of safety matches on their person or in carry-on baggage. Torch lighters (jet flame/blue flame), strike-anywhere matches, lighter fluid refills, and flammable gases are strictly prohibited in both carry-on and checked baggage.`,
    exceptions: `Electronic lighters and vape devices containing lithium batteries are permitted only in carry-on luggage with safety covers installed; they are strictly banned from checked baggage to prevent undetected cargo hold fires.`,
    international: `Many international carriers (including Chinese and Japanese airlines) strictly ban all lighters and matches from both carry-on and checked baggage. Furthermore, countries like Singapore, India, and Thailand enforce severe bans and criminal fines for carrying e-cigarettes or vaping devices.`,
    commonMistakes: `Accidentally leaving a vape or electronic lighter in checked baggage is one of the most common airport violations. Another frequent mistake is attempting to pack high-powered torch lighters for cigars, which are confiscated at security checkpoints worldwide.`,
    recommendations: `Keep your allowed single lighter or box of safety matches on your person or in an easily accessible pocket of your personal item. Never pack flammable liquid refills, and always confirm destination smoking device laws before international departures.`,
    faqs: [
      {
        question: `How many lighters can I bring on a plane?`,
        answer: `TSA allows one standard disposable lighter (or one box of safety matches) per passenger in carry-on baggage or on your person. Torch lighters and blue-flame jet lighters are strictly prohibited.`
      },
      {
        question: `Can I pack lighters in checked luggage?`,
        answer: `Standard disposable lighters without fuel absorption cases are prohibited in checked luggage. Electronic and lithium-battery lighters are strictly banned from checked bags under FAA fire-safety regulations.`
      },
      {
        question: `Are e-cigarettes and vapes allowed on airplanes?`,
        answer: `Yes, but only in carry-on luggage or on your person. E-cigarettes and vape devices are strictly prohibited in checked baggage due to lithium battery fire risks. Using them on board is a federal offense.`
      },
      {
        question: `Are strike-anywhere matches allowed?`,
        answer: `No. Strike-anywhere matches are completely banned on aircraft in both carry-on and checked luggage. Only standard safety matches (which ignite exclusively on their striking strip) are permitted.`
      },
      {
        question: `Can I bring cigar torches on a plane?`,
        answer: `No. Torch lighters that create a thin, needle-like blue flame produce temperatures exceeding standard lighters and are prohibited by the TSA and FAA anywhere on the aircraft.`
      }
    ]
  },

  household: {
    introduction: (count) => `Traveling with home goods, gifts, candles, and delicate keepsakes requires careful planning to prevent damage and checkpoint delays. This guide provides official carry-on and checked baggage directives for over ${count} items in the Household category.\n\nFrom solid wax candles and holiday presents to glassware, framed photos, and ceramics, understanding security screening and packing methods ensures your belongings arrive intact.\n\nExplore the rules on solid versus gel items, gift wrapping procedures, and fragile item transport below.`,
    overview: `The Household category covers non-perishable home items, decorative pieces, gifts, and kitchenware. Security screeners focus on material density, fragile glass components, and whether any contents resemble restricted liquids or gels.`,
    tsaRules: `Solid household goods—such as ceramic mugs, picture frames, and solid wax candles—are permitted in both carry-on and checked baggage. However, gel candles and liquid-filled snow globes must adhere to the 3-1-1 liquids rule (3.4 oz or less in carry-on).`,
    exceptions: `Non-liquid household goods carry no volume or dimensional restrictions from the TSA, subject only to your specific airline's carry-on size and checked bag weight allowances.`,
    international: `When traveling internationally, declare high-value decorative pieces, antiques, or cultural artifacts at customs checkpoints to prevent import duty disputes or quarantine delays.`,
    commonMistakes: `Pre-wrapping holiday gifts is the number-one mistake: if an item alarms the X-ray scanner, TSA officers will unwrap and inspect it. Another common error is assuming gel candles are solid wax; gel is classified as a liquid.`,
    recommendations: `Leave gifts unwrapped until reaching your destination, or use gift bags with tissue paper for easy inspection. Cushion fragile household items with heavy bubble wrap and pack them in your cabin bag rather than risk rough checked-luggage handling.`,
    faqs: [
      {
        question: `Can I bring candles on a plane?`,
        answer: `Solid wax candles are fully permitted in both carry-on and checked bags. Gel candles, however, are treated as liquids and must comply with the 3.4 oz limit in carry-on luggage.`
      },
      {
        question: `Can I bring wrapped presents through airport security?`,
        answer: `While wrapped gifts are technically allowed, TSA strongly recommends leaving them unwrapped. If an item triggers an alarm during X-ray screening, officers must unwrap it to inspect the contents.`
      },
      {
        question: `Are fragile picture frames and glass mugs allowed in carry-on?`,
        answer: `Yes. Fragile glass frames and mugs are permitted in carry-on bags. In fact, TSA and airlines recommend keeping fragile valuables in the cabin to avoid damage in cargo handling.`
      },
      {
        question: `Are snow globes allowed on airplanes?`,
        answer: `Snow globes containing liquid that appear smaller than a tennis ball (approx. 3.4 oz / 100 ml) are allowed in carry-on if they fit in your quart liquids bag. Larger snow globes must be checked.`
      },
      {
        question: `Can I pack kitchen appliances in checked luggage?`,
        answer: `Yes, most standard household kitchen appliances without hazardous chemicals or sharp exposed blades can travel safely in checked baggage.`
      }
    ]
  },

  electronics: {
    introduction: (count) => `Modern air travel revolves around electronics, but strict FAA and TSA battery limits dictate where and how gadgets can fly. This comprehensive guide covers baggage rules for over ${count} items in the Electronics category.\n\nFrom laptops, tablets, and cameras to power banks and lithium-ion batteries, knowing the exact carriage requirements keeps your equipment safe and prevents checkpoint delays.\n\nReview lithium-ion watt-hour (Wh) thresholds, screening tray procedures, and checked bag prohibitions below.`,
    overview: `The Electronics category encompasses consumer computing, imaging gear, audio devices, and power banks. Aviation regulators strictly scrutinize electronic items due to lithium-ion battery fire hazards and screen visibility during X-ray inspection.`,
    tsaRules: `Laptops, tablets, cameras, and portable electronics are permitted in carry-on and checked baggage. However, spare lithium-ion batteries and external power banks must travel in carry-on baggage only—they are strictly prohibited in checked hold luggage under FAA safety mandates.`,
    exceptions: `Lithium-ion batteries rated up to 100 watt-hours (Wh) are permitted without airline approval in carry-on bags. Batteries between 101Wh and 160Wh require airline permission, while batteries exceeding 160Wh are strictly forbidden on passenger aircraft.`,
    international: `Many overseas airports (notably throughout China, Europe, and Asia) require every portable charger and power bank to display clear, factory-printed capacity markings in mAh or Wh. Unmarked chargers are confiscated at international checkpoints.`,
    commonMistakes: `Checking a smart bag without removing the internal lithium battery power bank is a frequent violation that leads to offloaded bags. Another common error is packing delicate laptops into checked luggage where they face impact and theft risks.`,
    recommendations: `Keep all high-value electronics and external power banks in your carry-on luggage. At standard security checkpoints, be ready to place laptops and tablets in dedicated screening bins unless using modern CT computed tomography lanes or TSA PreCheck.`,
    faqs: [
      {
        question: `Can I put a power bank in my checked luggage?`,
        answer: `No. External power banks and spare lithium-ion batteries are strictly prohibited in checked baggage by the FAA and international aviation bodies due to fire hazards. They must stay in your carry-on.`
      },
      {
        question: `What is the maximum battery capacity allowed on flights?`,
        answer: `Passengers can bring lithium batteries up to 100 watt-hours (Wh) in carry-on bags without prior airline approval. Batteries between 101Wh and 160Wh require airline consent.`
      },
      {
        question: `Do I need to take my laptop out at airport security?`,
        answer: `In standard TSA screening lanes, laptops and large electronics must be removed from bags and placed flat in a separate bin. In lanes with newer 3D CT scanners or TSA PreCheck, electronics can usually remain inside.`
      },
      {
        question: `Can I bring gaming consoles on a plane?`,
        answer: `Yes. Gaming consoles like the PlayStation, Xbox, or Nintendo Switch are fully allowed in carry-on and checked baggage. Screeners may request full-sized consoles be screened in separate bins.`
      },
      {
        question: `Are smart luggage bags allowed on flights?`,
        answer: `Smart bags with built-in chargers are allowed only if the battery can be removed. If the battery cannot be detached, the luggage cannot travel on the aircraft.`
      }
    ]
  },

  liquids: {
    introduction: (count) => `The TSA 3-1-1 liquids rule remains one of the most frequently enforced regulations at airport security worldwide. This comprehensive guide covers carry-on and checked luggage limits for over ${count} items in the Liquids category.\n\nFrom travel toiletries and beverages to duty-free perfumes and cooking ingredients, understanding volume limits ensures a smooth journey.\n\nReview container rules, duty-free exemptions, and checkpoint screening procedures below.`,
    overview: `The Liquids category covers liquids, aerosols, gels, creams, pastes, and viscous liquids. Transportation security agencies restrict cabin liquids to prevent liquid explosives and hazardous chemicals from boarding the passenger cabin.`,
    tsaRules: `Under the TSA 3-1-1 rule, every liquid, gel, cream, or aerosol carried into the aircraft cabin must be in a container holding 3.4 ounces (100 milliliters) or less. All containers must fit comfortably inside one transparent, quart-sized resealable bag per traveler.`,
    exceptions: `Medically necessary liquids, prescription treatments, and infant feeding essentials (baby formula, breast milk, and baby food) are completely exempt from the 3-1-1 volume limits in reasonable quantities.`,
    international: `International airports strictly enforce the 100 ml limit. If purchasing duty-free liquids during an overseas connection, ensure they are sealed in an official tamper-evident bag (STEB) with your receipt visible.`,
    commonMistakes: `Packing containers larger than 3.4 oz that are only partially full is a major mistake; TSA enforces the labeled capacity of the container, not the remaining liquid inside. Another error is assuming pastes (like peanut butter or toothpaste) are solids.`,
    recommendations: `Transfer essential liquids into travel-sized 3.4 oz silicone bottles and place your quart bag at the top of your carry-on for fast removal. Pack larger liquid bottles in checked luggage, sealed inside zip bags to guard against pressure leaks.`,
    faqs: [
      {
        question: `What is the TSA 3-1-1 liquids rule?`,
        answer: `Each passenger may bring liquids, gels, and aerosols in containers of 3.4 oz (100 ml) or less, all fitted inside one 1-quart transparent, resealable bag. One bag is permitted per traveler.`
      },
      {
        question: `Can I bring a full water bottle through security?`,
        answer: `No. Full water bottles exceed the 3.4 oz limit and will be confiscated. You can bring an empty reusable bottle through security and refill it at water stations once past the checkpoint.`
      },
      {
        question: `Are pastes, creams, and spreads considered liquids?`,
        answer: `Yes. TSA classifies anything you can pour, pump, squeeze, spread, smear, spray, or spill as a liquid or gel. Toothpaste, sunscreen, peanut butter, and lip gloss all fall under the 3-1-1 rule.`
      },
      {
        question: `Can I bring duty-free liquids on connecting flights?`,
        answer: `Yes, provided they were purchased airside and remain sealed in a secure, tamper-evident bag (STEB) with the original receipt clearly visible inside.`
      },
      {
        question: `Is there a limit on liquids in checked luggage?`,
        answer: `Most non-hazardous liquids have no volume limit in checked bags, as long as baggage weight limits are respected. Alcoholic beverages between 24% and 70% ABV are limited to 5 liters per passenger.`
      }
    ]
  }
};

export function getCategoryIntroduction(categoryName: string, itemsCount: number): string {
  const key = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
  const profile = CATEGORY_PROFILES[key];
  if (profile) return profile.introduction(itemsCount);

  return `Navigating the complexities of airport security is straightforward when you know the rules for the ${categoryName} category. Mandated by the Transportation Security Administration (TSA) and international civil aviation bodies, these guidelines outline carry-on and checked luggage limits for over ${itemsCount} items.\n\nWhether preparing for a domestic flight or an international journey, knowing the exact security posture for ${categoryName} items prevents delays at the checkpoint and ensures full compliance with aviation safety standards.\n\nReview the detailed baggage allowances, exceptions, and packing recommendations below to pack your bags with confidence.`;
}

export function getCategoryOverview(categoryName: string): string {
  const key = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
  const profile = CATEGORY_PROFILES[key];
  if (profile) return profile.overview;

  return `The ${categoryName} category encompasses essential personal, professional, and travel goods. Airport security screeners evaluate items in this classification to ensure they pose no threat to the aircraft, crew, or fellow passengers during transit.`;
}

export function getCategoryTSARules(categoryName: string): string {
  const key = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
  const profile = CATEGORY_PROFILES[key];
  if (profile) return profile.tsaRules;

  return `Under Title 49 CFR and TSA standard operating procedures, items classified under ${categoryName} are evaluated for cabin and checked hold suitability. Non-hazardous items complying with dimensional and weight rules are generally permitted across both baggage types.`;
}

export function getCategoryExceptions(categoryName: string): string {
  const key = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
  const profile = CATEGORY_PROFILES[key];
  if (profile) return profile.exceptions;

  return `While standard regulations for ${categoryName} apply to the general public, specific exemptions exist for medically necessary equipment, prescription treatments, and infant care supplies. Always declare exempt items to screeners upon arrival at the security belt.`;
}

export function getCategoryInternational(categoryName: string): string {
  const key = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
  const profile = CATEGORY_PROFILES[key];
  if (profile) return profile.international;

  return `When traveling internationally with ${categoryName} items, passengers must observe the security guidelines of their departure airport, destination country, and any transit hubs. Foreign bodies like EASA and the UK CAA may enforce distinct regulations.`;
}

export function getCategoryCommonMistakes(categoryName: string): string {
  const key = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
  const profile = CATEGORY_PROFILES[key];
  if (profile) return profile.commonMistakes;

  return `A frequent mistake when packing ${categoryName} items is stowing screening-sensitive belongings deep inside a tightly packed bag. Grouping items accessibly prevents bag searches and keeps the checkpoint moving efficiently.`;
}

export function getCategoryPackingRecommendations(categoryName: string): string {
  const key = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
  const profile = CATEGORY_PROFILES[key];
  if (profile) return profile.recommendations;

  return `We recommend packing ${categoryName} items in organized, clear travel pouches near the top of your carry-on luggage. For items traveling in checked hold baggage, ensure ample soft padding protects against rough baggage handling systems.`;
}

export function getCategoryFAQs(categoryName: string): any[] {
  const key = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
  const profile = CATEGORY_PROFILES[key];
  if (profile && profile.faqs) return profile.faqs;

  return [
    {
      question: `Are all ${categoryName} items allowed on airplanes?`,
      answer: `Most standard items in ${categoryName} are permitted, but they remain subject to carry-on and checked baggage distinctions based on size, battery composition, and security risk.`
    },
    {
      question: `Do I need to remove ${categoryName} items from my bag at security?`,
      answer: `Large electronics, dense organic materials, and 3-1-1 liquids bags typically require separate screening. Follow the directions provided by the security officers at your checkpoint lane.`
    },
    {
      question: `Can I pack ${categoryName} items in my checked luggage?`,
      answer: `Yes, provided the items contain no hazardous materials, uninstalled spare lithium-ion batteries, or prohibited flammable compounds banned in cargo holds.`
    },
    {
      question: `Do international airlines have different rules for ${categoryName}?`,
      answer: `Yes. Always consult your airline's conditions of carriage and destination customs laws, as international standards for ${categoryName} can vary from domestic TSA rules.`
    }
  ];
}
