/**
 * Combination Engine for Airline & Country Programmatic Pages
 * Provides high-EEAT, AEO, and GEO optimized dynamic content, structured FAQs,
 * and speakable regulatory answers matching exact search queries.
 */

export interface FAQ {
  q: string;
  a: string;
}

export function getAirlineFAQs(item: any, airline: { slug: string; name: string; cabinLimit: string; checkedLimit: string }): FAQ[] {
  const name = item.name.toLowerCase();
  const cat = (item.category || '').toLowerCase().trim();
  const subcat = (item.subcategory || '').toLowerCase().trim();
  const isBattery = cat === 'electronics' || cat.includes('battery') || name.includes('battery') || name.includes('charger') || name.includes('airtag') || name.includes('vape');
  const isLiquid = cat === 'liquids' || cat === 'personal-care' || cat === 'beauty' || subcat === 'liquids';
  const isFood = cat === 'food' || subcat === 'snacks' || name.includes('jerky') || name.includes('banana') || name.includes('spice') || name.includes('noodle');
  const isMedicine = cat === 'medicine' || cat === 'health' || name.includes('melatonin') || name.includes('ibuprofen') || name.includes('creatine') || name.includes('pill');
  const isTobacco = cat === 'tobacco' || name.includes('cigarette') || name.includes('zyn') || name.includes('nicotine') || name.includes('vape') || name.includes('cigar');
  const isSportsTools = cat === 'tools' || cat === 'sports' || name.includes('racket') || name.includes('rope') || name.includes('dumbbell') || name.includes('knife');
  const isValuable = name.includes('gold') || name.includes('ring') || name.includes('jewelry') || name.includes('watch') || name.includes('cash');

  const faqs: FAQ[] = [];

  // 1. Primary Verdict
  faqs.push({
    q: `Can I bring ${name} on ${airline.name} flights in 2026?`,
    a: `Yes, carriage depends on baggage type. Under official TSA and ${airline.name} baggage policies, ${name} has carry-on cabin status: ${item.carryOn.status.replace('_', ' ')} and checked baggage status: ${item.checkedBag.status.replace('_', ' ')}. ${item.carryOn.reason || ''}`
  });

  // 2. Carry-on allowance
  faqs.push({
    q: `Can I take ${name} in my carry-on bag on ${airline.name}?`,
    a: item.carryOn.status === 'ALLOWED'
      ? `Yes, ${airline.name} permits ${name} in your carry-on or personal item bag. Ensure your carry-on complies with ${airline.name}'s cabin weight allowance of ${airline.cabinLimit} and fits in the overhead bin or beneath the seat in front of you.`
      : item.carryOn.status === 'RESTRICTED'
      ? `Carriage of ${name} in ${airline.name} cabin luggage is restricted: ${item.carryOn.reason || 'Check volume or size limits before boarding.'}`
      : `No, ${airline.name} and aviation security prohibit ${name} from being carried in the passenger cabin.`
  });

  // 3. Checked luggage
  faqs.push({
    q: `Can I pack ${name} in checked baggage with ${airline.name}?`,
    a: item.checkedBag.status === 'ALLOWED'
      ? `Yes, you can pack ${name} in checked luggage on ${airline.name}. The standard checked baggage weight limit is ${airline.checkedLimit} per checked suitcase.`
      : item.checkedBag.status === 'RESTRICTED'
      ? `Checked baggage carriage on ${airline.name} is subject to restrictions: ${item.checkedBag.reason || 'Special packaging or declarations required.'}`
      : `No, ${airline.name} strictly bans ${name} from cargo hold luggage due to flight safety regulations. Keep it in your carry-on luggage only.`
  });

  // 4. Category-specific FAQ 1
  if (isBattery) {
    faqs.push({
      q: `What is ${airline.name}'s watt-hour limit for ${name}?`,
      a: `${airline.name} follows ICAO and FAA 49 CFR § 175.10 regulations: lithium batteries under 100Wh are permitted in carry-on baggage with no airline approval required. Spare batteries and power banks are strictly prohibited in checked luggage.`
    });
    faqs.push({
      q: `What happens if ${airline.name} asks me to gate-check my bag containing ${name}?`,
      a: `If gate agents require you to gate-check your carry-on bag, you MUST remove ${name} (and all loose lithium batteries or power banks) and take them with you into the cabin. Never allow lithium batteries into the cargo hold.`
    });
  } else if (isLiquid) {
    faqs.push({
      q: `Does the 3-1-1 liquids rule apply to ${name} on ${airline.name}?`,
      a: `Yes. On all ${airline.name} flights departing from or arriving in the US, UK, and EU, liquids, gels, and aerosols must be in containers of 3.4 oz (100 ml) or smaller and packed inside one transparent, quart-sized resealable plastic bag.`
    });
    faqs.push({
      q: `Can I pack full-sized bottles of ${name} in checked luggage on ${airline.name}?`,
      a: `Yes, full-sized containers of ${name} can be packed in checked hold luggage on ${airline.name}. We strongly recommend placing bottles inside sealed ziploc bags and wrapping them in clothing to guard against pressure leaks.`
    });
  } else if (isFood) {
    faqs.push({
      q: `Can I eat ${name} during my ${airline.name} flight?`,
      a: `Yes, passengers are welcome to consume their own solid food and snacks during ${airline.name} flights. However, any uneaten fresh food, meat, or fruit must be consumed or discarded prior to clearing international customs upon arrival.`
    });
    faqs.push({
      q: `Do liquid food rules apply to ${name} on ${airline.name}?`,
      a: `${name} is classified as a solid item if it maintains its shape at room temperature. If it is a paste, spread, sauce, or liquid (over 3.4 oz / 100 ml), security officers will confiscate it at the screening checkpoint.`
    });
  } else if (isMedicine) {
    faqs.push({
      q: `Does ${name} count toward my carry-on liquids allowance on ${airline.name}?`,
      a: `Solid forms (tablets, capsules, gummies) have no liquid volume limits. Medically necessary liquid medicines are exempt from the 3-1-1 rule in reasonable quantities; inform the TSA or airport security officer at the start of screening.`
    });
    faqs.push({
      q: `Should I pack ${name} in carry-on or checked luggage on ${airline.name}?`,
      a: `Always pack essential medicines like ${name} in your carry-on cabin bag. If your checked luggage is delayed or lost, you will still have access to your daily medication.`
    });
  } else if (isTobacco) {
    faqs.push({
      q: `Can I use ${name} on board ${airline.name}?`,
      a: `No. ${airline.name} strictly prohibits smoking, vaping, and using electronic smoking devices on board all aircraft and in airport jet bridges. Keep devices turned off and safely stowed.`
    });
    faqs.push({
      q: `Are there duty-free allowance limits for ${name} on ${airline.name}?`,
      a: `Yes. Duty-free allowances vary strictly by destination country. Exceeding allowances requires formal declaration and payment of customs excise taxes upon arrival.`
    });
  } else if (isSportsTools) {
    faqs.push({
      q: `Does ${airline.name} allow ${name} as a carry-on personal item?`,
      a: `If ${name} fits within ${airline.name}'s cabin dimensions and contains no sharp blades or blunt striking hazards, it is permitted. Heavy blunt sports equipment like dumbbells must be checked, whereas tennis rackets are typically accepted in cabin bags.`
    });
    faqs.push({
      q: `What is the maximum tool length permitted in cabin bags on ${airline.name}?`,
      a: `Under TSA guidelines, non-bladed tools measuring 7 inches (18 cm) or less are allowed in carry-on baggage. Power tools and tools over 7 inches must be securely packed in checked holds.`
    });
  } else if (isValuable) {
    faqs.push({
      q: `Should I pack high-value ${name} in checked luggage on ${airline.name}?`,
      a: `Never pack expensive ${name}, jewelry, or cash in checked hold luggage. Airlines limit liability for loss or theft under the Montreal Convention; always carry valuables on your person or in your cabin bag.`
    });
    faqs.push({
      q: `Do I need to declare ${name} when boarding ${airline.name}?`,
      a: `Airlines do not require disclosure of personal jewelry or cash. However, international customs authorities mandate declaring currency equivalents exceeding $10,000 USD (or local equivalent) upon arrival.`
    });
  } else {
    faqs.push({
      q: `How does ${airline.name} screen ${name} at airport security checkpoints?`,
      a: `Airport security screeners inspect ${name} using standard automated X-ray scanners. Ensure it is easily accessible in case screeners request manual physical inspection.`
    });
    faqs.push({
      q: `Can ${airline.name} gate staff reject ${name} if cabin bins are full?`,
      a: `Yes. If overhead locker storage reaches capacity, gate staff will require larger carry-on suitcases to be gate-checked. Ensure fragile or high-priority items are kept inside a smaller personal item bag.`
    });
  }

  // 6. Security vs Airline Discretion
  faqs.push({
    q: `Can ${airline.name} enforce stricter rules than TSA for ${name}?`,
    a: `Yes. Under IATA Conditions of Carriage, individual airlines retain the legal right to enforce stricter size, weight, and dangerous goods restrictions than baseline civil aviation security rules.`
  });

  // 7. Confiscation & Consequences
  faqs.push({
    q: `What happens if I inadvertently pack prohibited ${name}?`,
    a: `If airport security detects a prohibited item during X-ray screening, officers will pull the bag for inspection. Prohibited items will be confiscated, and delays or security investigations may occur.`
  });

  // 8. Recommended Packing Technique
  faqs.push({
    q: `What is the best way to pack ${name} for a ${airline.name} flight?`,
    a: `Pack ${name} near the top of your bag inside a transparent or padded organizer. Keep original receipts or product packaging accessible for seamless security verification.`
  });

  return faqs;
}

export function getCountryFAQs(item: any, country: { slug: string; name: string; agency: string; declarationLimit: string }): FAQ[] {
  const name = item.name.toLowerCase();
  const cSlug = country.slug.toLowerCase();
  const cat = (item.category || '').toLowerCase().trim();
  const isBattery = cat === 'electronics' || cat.includes('battery') || name.includes('battery') || name.includes('charger') || name.includes('airtag');
  const isLiquid = cat === 'liquids' || cat === 'personal-care' || cat === 'beauty';
  const isFood = cat === 'food' || name.includes('jerky') || name.includes('banana') || name.includes('spice') || name.includes('noodle');
  const isMedicine = cat === 'medicine' || cat === 'health' || name.includes('melatonin') || name.includes('creatine') || name.includes('ibuprofen');
  const isTobacco = cat === 'tobacco' || name.includes('cigarette') || name.includes('zyn') || name.includes('nicotine') || name.includes('vape');
  const isValuable = name.includes('gold') || name.includes('ring') || name.includes('jewelry') || name.includes('cash');

  const faqs: FAQ[] = [];

  // 1. Primary Verdict
  faqs.push({
    q: `Can I bring ${name} into ${country.name} in 2026?`,
    a: `Yes, you can bring ${name} to ${country.name}, subject to customs and border security regulations. At ${country.name} border checkpoints (${country.agency}), carry-on status is ${item.carryOn.status.replace('_', ' ')} and checked baggage status is ${item.checkedBag.status.replace('_', ' ')}. ${country.declarationLimit}`
  });

  // 2. Customs Declaration
  faqs.push({
    q: `Do I need to declare ${name} at ${country.name} customs?`,
    a: `Declaration depends on item nature and quantity. ${country.declarationLimit} If traveling with commercial quantities, agricultural items, or regulated goods, always declare them on your arrival card to avoid penalties.`
  });

  // 3. Checked vs Carry-on in Destination Country
  faqs.push({
    q: `Is ${name} allowed in checked luggage when traveling to ${country.name}?`,
    a: item.checkedBag.status === 'ALLOWED'
      ? `Yes, ${country.name} aviation authorities permit packing ${name} in checked baggage. Ensure all luggage weight and customs duty-free thresholds are respected.`
      : item.checkedBag.status === 'RESTRICTED'
      ? `Checked baggage for ${name} into ${country.name} is restricted: ${item.checkedBag.reason || 'Check security conditions.'}`
      : `No, ${name} is strictly prohibited in checked hold luggage when flying to ${country.name}. Pack it in your cabin bag only.`
  });

  // 4. Country & Category Specific Questions
  if (cSlug === 'singapore') {
    if (isTobacco || name.includes('zyn') || name.includes('nicotine') || name.includes('vape')) {
      faqs.push({
        q: `Is ${name} (like ZYN or e-cigarettes) legal in Singapore?`,
        a: `NO. Under Singapore's Tobacco (Control of Advertisements and Sale) Act, electronic vaporizers, e-liquids, and smokeless nicotine pouches (such as ZYN) are strictly PROHIBITED. Importing, possessing, or using them carries severe fines up to $10,000 SGD or imprisonment.`
      });
      faqs.push({
        q: `Can I bring cigarettes or tobacco into Singapore?`,
        a: `Singapore has NO duty-free allowance for cigarettes or tobacco products. Every single stick or pack of cigarettes brought into Singapore must be declared immediately at the Customs Red Channel and is subject to customs duty and GST.`
      });
    } else if (isMedicine || name.includes('melatonin') || name.includes('ibuprofen') || name.includes('creatine')) {
      faqs.push({
        q: `Can you bring melatonin or ibuprofen into Singapore? Can you buy it at Changi Airport?`,
        a: `Yes, travelers can bring up to a 3-month personal supply of health supplements (such as melatonin) and common over-the-counter medications (ibuprofen, paracetamol) into Singapore without prior Health Sciences Authority (HSA) approval. Melatonin is a prescription-only medicine locally in Singapore, but personal traveler supplies are permitted.`
      });
      faqs.push({
        q: `Do I need an HSA import permit for personal medication in Singapore?`,
        a: `Standard vitamins, supplements, and up to 3 months of personal non-controlled prescription medicines do not require an HSA import permit. Controlled drugs (e.g., strong painkillers, sleeping pills, psychotropics) require prior approval via the HSA online portal at least 10 working days before arrival.`
      });
    } else {
      faqs.push({
        q: `What are Singapore Customs strict baggage rules for ${name}?`,
        a: `Singapore Customs enforces strict screening at Changi Airport. Controlled goods, chewing gum, and items exceeding duty-free allowances ($500 SGD for travelers away >48h, $100 SGD for <48h) must be declared at the Red Channel.`
      });
      faqs.push({
        q: `Are there biosecurity or food limits when bringing ${name} to Singapore?`,
        a: `The Singapore Food Agency (SFA) permits personal imports of processed foods up to 5 kg or 5 liters, provided they do not exceed $100 SGD in value. Fresh meat and poultry from non-approved countries are strictly banned.`
      });
    }
  } else if (cSlug === 'japan') {
    if (isValuable || name.includes('gold') || name.includes('ring') || name.includes('jewelry')) {
      faqs.push({
        q: `Do I have to declare a gold ring or personal jewelry at Japan customs?`,
        a: `Yes, under Japan Customs regulations, if you bring gold products (bullion, ingots, or jewelry exceeding 90% purity) or if the total combined market value of all personal items exceeds 200,000 JPY (approx. $1,300 USD), you MUST declare them on your Declaration of Personal Effects card.`
      });
      faqs.push({
        q: `What happens if I don't declare gold jewelry upon entering Japan?`,
        a: `Failure to declare gold items exceeding Japan customs limits can result in confiscation, severe tax penalties, or criminal detention for smuggling under the Japanese Customs Act. Always use the Red Channel if in doubt.`
      });
    } else if (isMedicine || name.includes('creatine') || name.includes('melatonin')) {
      faqs.push({
        q: `Can you bring creatine or supplements to Japan?`,
        a: `Yes, travelers can bring workout supplements, creatine, vitamins, and over-the-counter medicines into Japan for personal use up to a 2-month supply without needing a special import certificate (Yakkan Shoumei).`
      });
      faqs.push({
        q: `What medicines are strictly banned in Japan?`,
        a: `Japan strictly prohibits stimulant-based medications, including medicines containing pseudoephedrine (such as Sudafed, Advil Cold & Sinus), Adderall, and codeine. Bringing banned medications into Japan can lead to immediate arrest regardless of foreign doctor prescriptions.`
      });
    } else if (isFood) {
      faqs.push({
        q: `Can you bring fruit or food to Japan?`,
        a: `Japan Animal Quarantine Service (AQS) and Plant Protection Station strictly prohibit bringing fresh fruits, vegetables, and meat products (including beef jerky, ham, bacon, and sausages) without an official inspection certificate. Most foreign meat snacks are confiscated immediately.`
      });
      faqs.push({
        q: `Are commercially packaged dry snacks permitted into Japan?`,
        a: `Yes. Processed, sealed dry goods such as commercially packaged cookies, chocolates, potato chips, and instant noodles without meat bits are generally allowed through Japanese customs.`
      });
    } else {
      faqs.push({
        q: `What is Japan's customs duty-free allowance for ${name}?`,
        a: `Travelers entering Japan enjoy a duty-free allowance of up to 200,000 JPY for personal effects. Items within this threshold need no special taxation unless subject to specific import bans.`
      });
      faqs.push({
        q: `How does Japan airport security (JCAB) screen ${name}?`,
        a: `Japan airport security checkpoints use modern 3D CT and X-ray systems. Always remove laptops, power banks, and 100ml liquid pouches when entering security lines unless using smart lanes.`
      });
    }
  } else if (cSlug === 'australia') {
    if (isFood || name.includes('spice') || name.includes('honey') || name.includes('nut')) {
      faqs.push({
        q: `Can you bring spices, food, or honey into Australia?`,
        a: `Australia enforces the world's strictest biosecurity laws under the Department of Agriculture, Fisheries and Forestry (DAFF). You MUST declare ALL food, spices, nuts, seeds, and honey on your Incoming Passenger Card. Commercially packaged, finely ground dried spices are usually permitted after inspection, but fresh herbs, seeds, and honey are often prohibited.`
      });
      faqs.push({
        q: `What is the penalty for failing to declare food in Australia?`,
        a: `Failing to declare biosecurity risk items like food, fruit, or meat can result in on-the-spot infringement notices of up to $5,500 AUD, visa cancellation, or deportation.`
      });
    } else {
      faqs.push({
        q: `What are Australia Border Force (ABF) entry rules for ${name}?`,
        a: `ABF allows general personal goods up to an adult duty-free allowance of $900 AUD. Dangerous items, unapproved weapons, and biosecurity risks must be declared on arrival.`
      });
      faqs.push({
        q: `Does Australia permit carrying ${name} in checked luggage?`,
        a: `Standard items are permitted in checked baggage provided they pose no biohazard, contain no loose lithium batteries, and comply with airline checked luggage weight limits.`
      });
    }
  } else if (cSlug === 'uk') {
    if (isMedicine || name.includes('melatonin')) {
      faqs.push({
        q: `Can you bring melatonin into the UK? Is it legal?`,
        a: `Yes, you CAN bring melatonin into the UK for personal use. While melatonin is classified as a prescription-only medicine under UK MHRA regulations (and cannot be bought over the counter in UK pharmacies), travelers are legally permitted to bring up to a 3-month personal supply into the country.`
      });
      faqs.push({
        q: `Do I need a doctor's note for medicines entering the UK?`,
        a: `For prescription-only medicines, travelers should carry the medication in its original pharmacy packaging showing their name, along with a doctor's letter or prescription copy to present to UK Border Force if requested.`
      });
    } else if (isFood || name.includes('spice')) {
      faqs.push({
        q: `Can you bring spices into the United Kingdom?`,
        a: `Yes! Travelers may bring dried culinary spices, seasoning blends, and salt/pepper into the UK for personal consumption, up to 2 kg per passenger, provided they are dried and commercially packed. Fresh herbs with soil or roots are strictly regulated.`
      });
      faqs.push({
        q: `Can you bring meat or dairy products into the UK?`,
        a: `UK customs rules strictly prohibit passengers arriving from outside the EU from bringing personal quantities of meat, meat products (like beef jerky), milk, or dairy products into Great Britain.`
      });
    } else {
      faqs.push({
        q: `What is the UK Border Force customs allowance for ${name}?`,
        a: `Travelers arriving in the UK can bring personal goods worth up to £390 (or £270 if arriving by private plane or boat) duty-free. Goods exceeding this threshold must be declared and taxed.`
      });
      faqs.push({
        q: `How does UK airport security screen ${name}?`,
        a: `UK Department for Transport (DfT) security checkpoints enforce standard 100ml liquid limits and electronic screening. Follow local airport instructions as next-generation CT scanners roll out across UK hubs.`
      });
    }
  } else if (cSlug === 'canada') {
    faqs.push({
      q: `Do I need to declare ${name} when entering Canada via CBSA?`,
      a: `Canada Border Services Agency (CBSA) requires all travelers to declare any food, animal products, plants, or currency exceeding $10,000 CAD. Commercially packaged dry snacks are generally permitted once declared.`
    });
    faqs.push({
      q: `Can I bring cannabis or CBD products into Canada?`,
      a: `NO. Even though recreational cannabis is legal inside Canada, taking cannabis or CBD products across the Canadian border (entering or leaving) remains strictly ILLEGAL and is a serious criminal offense.`
    });
  } else {
    faqs.push({
      q: `How does ${country.name} airport security screen ${name}?`,
      a: `Security checkpoints utilize automated X-ray equipment and manual secondary screening. Ensure ${name} is accessible if security agents request physical verification.`
    });
    faqs.push({
      q: `What are the penalties for undeclared prohibited items in ${country.name}?`,
      a: `Failing to declare restricted goods can lead to immediate border confiscation, administrative fines, or loss of trusted traveler privileges (such as NEXUS, Global Entry, or e-Gate access).`
    });
  }

  // 6. Liquid / volume check if applicable
  if (isLiquid) {
    faqs.push({
      q: `Are liquid rules for ${name} different in ${country.name}?`,
      a: `Most international airports in ${country.name} strictly adhere to ICAO standards: liquids, gels, and aerosols in carry-on bags must be in containers of 100 ml (3.4 oz) or less, packed in one transparent 1-quart/liter resealable bag.`
    });
  } else {
    faqs.push({
      q: `What happens if ${name} is flagged during transit through ${country.name}?`,
      a: `If transiting through ${country.name}, items must comply with both the departure country and transit security standards. Re-screening of cabin bags is standard before boarding international connecting flights.`
    });
  }

  // 7. General Declaration & Fine Prevention
  faqs.push({
    q: `What is the golden rule when traveling with ${name} to ${country.name}?`,
    a: `When in doubt, always declare. Customs officers worldwide appreciate transparency; declaring an item that turns out to be prohibited usually results in simple voluntary surrender without fines, whereas concealing it leads to hefty penalties.`
  });

  return faqs;
}

export function getSpeakableSummary(item: any, context: { type: 'airline' | 'country'; name: string }): string {
  const name = item.name;
  const status = item.carryOn.status === 'ALLOWED' ? 'permitted' : item.carryOn.status === 'NOT_ALLOWED' ? 'prohibited' : 'restricted';
  const checked = item.checkedBag.status === 'ALLOWED' ? 'allowed in checked luggage' : 'banned in checked bags';

  if (context.type === 'airline') {
    return `${name} is ${status} in carry-on baggage and ${checked} when flying with ${context.name}. Passengers should verify cabin size dimensions and ensure any dangerous goods or batteries adhere to official aviation guidelines.`;
  }
  return `When traveling to ${context.name}, ${name} is ${status} in cabin bags and ${checked}. Travelers must observe local customs duty thresholds and declare any regulated goods upon arrival to clear customs smoothly.`;
}
