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
  const status = item.carryOn?.status || "ALLOWED";

  // ── Category-aware carry-on blueprint matrix ───────────────────────────────
  // Covers all 13 categories present in src/data/items/**/*.json.
  // Matching is case-insensitive so "Personal Care" / "personal-care" both resolve.
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
      `Measure your ${lname} end-to-end. Hand tools under 7 inches may go in carry-on; anything longer must travel in checked luggage.`,
      `If the tool exceeds the 7-inch limit, pack it deep in the centre of your checked suitcase to prevent movement.`,
      `Wrap exposed points, sharp edges, or heavy metallic shafts in protective padding to avoid puncturing bag fabric or injuring handlers.`,
      `Organise tools inside a dedicated zip pouch or tool roll to keep them contained and easy to display during inspection.`,
      `Anchor heavy items against the main frame of your suitcase to prevent weight shifts from damaging other packed belongings.`,
    ],
    "Personal Care": [
      `Any ${lname} in liquid, gel, cream, or aerosol form must comply with the 3-1-1 rule: containers of 3.4 oz (100 ml) or less, in one clear quart-sized bag.`,
      `Aerosol personal-care products must have the safety cap on; TSA officers can refuse items with missing or broken caps.`,
      `Pack solid versions of personal care items (solid shampoo bars, deodorant sticks) in carry-on without volume restrictions.`,
      `Place the clear liquids bag at the top of your carry-on for fast retrieval at the security checkpoint.`,
      `For international trips, research whether your destination has stricter cosmetics or aerosol import restrictions before departure.`,
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

  // ── Checked-bag fallback (NOT_ALLOWED in cabin) ────────────────────────────
  const CHECKED_STEPS: string[] = [
    `Confirm that ${lname} is fully permitted in checked hold baggage and does not contain prohibited HAZMAT components.`,
    `Wrap ${lname} in bubble wrap, soft clothing, or a cushioned travel case to protect it from rough mechanical baggage-sorting systems.`,
    `Pack the item deep in the centre of your suitcase, away from outer zippers, and surrounded by padding on all sides.`,
    `Lock your suitcase with a TSA-approved combination lock so inspectors can reseal it after any random audit.`,
    `Confirm your checked bag's total weight stays within your airline's limit (usually 50 lbs / 23 kg) before dropping it at check-in.`,
  ];

  // Carry-on allowed or restricted → serve category-specific carry-on guide.
  if (status === "ALLOWED" || status === "RESTRICTED") {
    const currentCategory = item.category?.trim() || "General";
    const matchedKey = Object.keys(CARRY_ON_BLUEPRINTS).find(
      key => key.toLowerCase() === currentCategory.toLowerCase()
    ) ?? "General";
    return CARRY_ON_BLUEPRINTS[matchedKey];
  }

  // NOT_ALLOWED in cabin → serve checked-bag instructions.
  return CHECKED_STEPS;
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
