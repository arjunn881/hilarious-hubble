/**
 * i18n Content Generator Engine
 *
 * Provides native-language generative content for all 7 non-English locales:
 *  - de (German)
 *  - es (Spanish)
 *  - fr (French)
 *  - it (Italian)
 *  - ja (Japanese)
 *  - ko (Korean)
 *  - pt (Portuguese)
 *
 * Powers:
 *  1. Featured Snippet / Quick Answer (AEO - Answer Engine Optimization)
 *  2. Expanded FAQs (questions and answers for HTML & FAQPage JSON-LD schema)
 *  3. Step-by-Step Category Packing Guides
 *  4. Checkpoint Security Screening Procedures (incorporating local authorities)
 *  5. Hazmat & Aviation Regulatory Details (Geo SEO & E-E-A-T)
 *  6. Airline & International Variations
 *  7. Exceptions, International Considerations & Alternatives
 */
import type { Lang } from '../i18n/config';

type Status = 'ALLOWED' | 'NOT_ALLOWED' | 'RESTRICTED' | 'UNKNOWN';

interface ItemLike {
  name: string;
  category: string;
  carryOn: { status: Status; reason?: string; conditions?: string[]; exceptions?: string[] };
  checkedBag: { status: Status; reason?: string; conditions?: string[]; exceptions?: string[] };
  customNote?: string;
  travelTips?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. QUICK ANSWER / FEATURED SNIPPET (AEO)
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalizedWhatIsThis(item: ItemLike, itemName: string, lang: Lang): string {
  const cStatus = item.carryOn?.status || 'ALLOWED';
  const hStatus = item.checkedBag?.status || 'ALLOWED';

  switch (lang) {
    case 'de': {
      if (cStatus === 'ALLOWED' && hStatus === 'ALLOWED') {
        return `Ja, ${itemName} darf im Handgepäck und im Aufgabegepäck mitgeführt werden. Bei der Flughafenkontrolle gibt es in der Regel keine Beanstandungen, sofern die Standard-Größen- und Gewichtsbeschränkungen der Fluggesellschaft eingehalten werden.`;
      }
      if (cStatus === 'ALLOWED' && hStatus === 'NOT_ALLOWED') {
        return `Ja, ${itemName} ist im Handgepäck erlaubt, im Aufgabegepäck (Koffer) jedoch streng verboten. Aus Brandschutzgründen (z. B. bei Lithium-Akkus) muss der Gegenstand zwingend in der Flugzeugkabine mitgeführt werden.`;
      }
      if (cStatus === 'NOT_ALLOWED' && hStatus === 'ALLOWED') {
        return `Nein, ${itemName} ist im Handgepäck verboten, darf aber sicher im aufgegebenen Koffer transportiert werden. Bei der Sicherheitskontrolle am Gate würde der Gegenstand andernfalls einbehalten und entsorgt.`;
      }
      if (cStatus === 'RESTRICTED') {
        return `${itemName} ist im Handgepäck nur eingeschränkt erlaubt. Achten Sie auf die geltenden Vorgaben (z. B. 100-ml-Flüssigkeitsgrenze oder Wattstunden-Limits) und prüfen Sie vor Abflug die Bestimmungen Ihrer Fluggesellschaft.`;
      }
      return `${itemName} unterliegt spezifischen Luftsicherheitsrichtlinien für Hand- und Aufgabegepäck. Prüfen Sie die genauen Vorgaben vor Ihrer Reise.`;
    }

    case 'es': {
      if (cStatus === 'ALLOWED' && hStatus === 'ALLOWED') {
        return `Sí, se puede llevar ${itemName} tanto en el equipaje de mano como en el equipaje facturado. En los controles de seguridad del aeropuerto suele pasar sin incidencias, siempre que respete los límites de tamaño y peso de su aerolínea.`;
      }
      if (cStatus === 'ALLOWED' && hStatus === 'NOT_ALLOWED') {
        return `Sí, ${itemName} está permitido en el equipaje de mano, pero está totalmente prohibido en el equipaje facturado en bodega. Por motivos de seguridad aérea y prevención de incendios, debe viajar obligatoriamente en cabina.`;
      }
      if (cStatus === 'NOT_ALLOWED' && hStatus === 'ALLOWED') {
        return `No, ${itemName} no se puede llevar en el equipaje de mano, pero sí está permitido en la maleta facturada. Si intenta pasarlo por el control de seguridad de la terminal, los agentes lo confiscarán.`;
      }
      if (cStatus === 'RESTRICTED') {
        return `${itemName} está permitido en cabina con restricciones especiales. Asegúrese de cumplir con la normativa vigente (como la regla 3-1-1 de líquidos o límites de potencia en baterías) antes de embarcar.`;
      }
      return `${itemName} está sujeto a normativas específicas de seguridad aérea. Verifique las instrucciones detalladas para cabina y bodega antes de volar.`;
    }

    case 'fr': {
      if (cStatus === 'ALLOWED' && hStatus === 'ALLOWED') {
        return `Oui, ${itemName} est autorisé en bagage cabine ainsi qu'en bagage en soute. Lors des contrôles de sécurité à l'aéroport, cet article passe sans problème sous réserve de respecter le format et le poids imposés par votre compagnie.`;
      }
      if (cStatus === 'ALLOWED' && hStatus === 'NOT_ALLOWED') {
        return `Oui, ${itemName} est autorisé en cabine, mais strictement interdit dans les bagages enregistrés en soute. En vertu des règles de sécurité incendie de l'aviation civile, il doit impérativement rester avec vous en cabine.`;
      }
      if (cStatus === 'NOT_ALLOWED' && hStatus === 'ALLOWED') {
        return `Non, ${itemName} est interdit en bagage cabine, mais vous pouvez le transporter dans votre valise en soute. Tenter de le passer au filtre de sécurité des passagers entraînera sa confiscation immédiate.`;
      }
      if (cStatus === 'RESTRICTED') {
        return `${itemName} est autorisé en cabine sous conditions particulières. Vérifiez la conformité aux réglementations (comme la règle des 100 ml pour les liquides ou la capacité des batteries) avant votre départ.`;
      }
      return `${itemName} fait l'objet de règles de sûreté aéroportuaire précises pour le transport en cabine et en soute. Consultez les détails ci-dessous.`;
    }

    case 'it': {
      if (cStatus === 'ALLOWED' && hStatus === 'ALLOWED') {
        return `Sì, ${itemName} è consentito sia nel bagaglio a mano sia nel bagaglio da stiva. Ai controlli di sicurezza aeroportuali non crea problemi, purché rispetti i limiti di peso e dimensioni previsti dalla compagnia aerea.`;
      }
      if (cStatus === 'ALLOWED' && hStatus === 'NOT_ALLOWED') {
        return `Sì, ${itemName} è ammesso nel bagaglio a mano, ma è severamente vietato nel bagaglio imbarcato in stiva. Per motivi di sicurezza antincendio aerea, deve viaggiare sempre in cabina con il passeggero.`;
      }
      if (cStatus === 'NOT_ALLOWED' && hStatus === 'ALLOWED') {
        return `No, ${itemName} non è consentito nel bagaglio a mano, ma può essere imbarcato regolarmente nel bagaglio registrato da stiva. Al gate di sicurezza verrebbe altrimenti requisito dagli addetti.`;
      }
      if (cStatus === 'RESTRICTED') {
        return `${itemName} è consentito nel bagaglio a mano solo a determinate condizioni. Verificate le limitazioni (regola dei liquidi da 100 ml o limiti di capacità per batterie) prima del volo.`;
      }
      return `${itemName} è regolato da precise norme di sicurezza aeroportuale per cabina e stiva. Verificate i requisiti prima del viaggio.`;
    }

    case 'ja': {
      if (cStatus === 'ALLOWED' && hStatus === 'ALLOWED') {
        return `はい、${itemName}は機内持ち込み手荷物および受託手荷物（預け荷物）のどちらでも持ち込み可能です。航空会社の標準サイズ・重量規定を満たしていれば、保安検査場も問題なく通過できます。`;
      }
      if (cStatus === 'ALLOWED' && hStatus === 'NOT_ALLOWED') {
        return `はい、${itemName}は機内持ち込み手荷物として認められていますが、受託手荷物（貨物室への預け入れ）は固く禁止されています。リチウムバッテリー等の発火防止規則に基づき、必ず客室にお持ち込みください。`;
      }
      if (cStatus === 'NOT_ALLOWED' && hStatus === 'ALLOWED') {
        return `いいえ、${itemName}は保安上の理由により機内持ち込み禁止ですが、スーツケースに入れて預託（受託手荷物）することは可能です。保安検査場で所持していると没収の対象となります。`;
      }
      if (cStatus === 'RESTRICTED') {
        return `${itemName}は機内持ち込みに一定の条件や制限があります（液体物の100mlルールやバッテリー容量制限など）。事前に航空会社や空港のガイドラインをご確認ください。`;
      }
      return `${itemName}は航空安全基準に基づき持ち込み条件が定められています。フライト前に最新のルールをご確認ください。`;
    }

    case 'ko': {
      if (cStatus === 'ALLOWED' && hStatus === 'ALLOWED') {
        return `네, ${itemName}은(는) 기내 휴대 수하물과 위탁 수하물(부치는 짐) 모두 반입이 가능합니다. 항공사 규격 및 무게 제한을 준수하면 공항 보안검색대를 원활하게 통과할 수 있습니다.`;
      }
      if (cStatus === 'ALLOWED' && hStatus === 'NOT_ALLOWED') {
        return `네, ${itemName}은(는) 기내 반입은 허용되지만 위탁 수하물 탁송은 엄격히 금지됩니다. 항공 화물창 화재 예방을 위해 반드시 기내로 직접 휴대하셔야 합니다.`;
      }
      if (cStatus === 'NOT_ALLOWED' && hStatus === 'ALLOWED') {
        return `아니요, ${itemName}은(는) 기내 반입이 금지되어 있으나 위탁 수하물(화물칸)로는 안전하게 부치실 수 있습니다. 보안검색대에서 적발 시 즉시 압수될 수 있습니다.`;
      }
      if (cStatus === 'RESTRICTED') {
        return `${itemName}은(는) 기내 반입 시 조건부 제한이 적용됩니다(액체류 100ml 제한 또는 배터리 용량 규정 등). 탑승 전 해당 항공사 규정을 확인하세요.`;
      }
      return `${itemName}에 대한 항공 보안 규정을 확인하시고 기내 및 위탁 수하물 준비에 참고하시기 바랍니다.`;
    }

    case 'pt': {
      if (cStatus === 'ALLOWED' && hStatus === 'ALLOWED') {
        return `Sim, ${itemName} é permitido tanto na bagagem de mão quanto na bagagem despachada. Passa normalmente pelo raio-X do aeroporto, desde que respeite os limites de tamanho e peso da companhia aérea.`;
      }
      if (cStatus === 'ALLOWED' && hStatus === 'NOT_ALLOWED') {
        return `Sim, ${itemName} é permitido na bagagem de mão, mas é estritamente proibido na bagagem despachada no porão. Por regras internacionais de segurança contra incêndio, deve obrigatoriamente viajar na cabine.`;
      }
      if (cStatus === 'NOT_ALLOWED' && hStatus === 'ALLOWED') {
        return `Não, ${itemName} é proibido na bagagem de mão, mas pode ser transportado com segurança na mala despachada. No controle de segurança do aeroporto, o item seria confiscado.`;
      }
      if (cStatus === 'RESTRICTED') {
        return `${itemName} tem transporte permitido na cabine com condições especiais (como a regra de líquidos ou limites de baterias). Confirme as diretrizes antes de embarcar.`;
      }
      return `${itemName} possui diretrizes específicas de aviação civil para cabine e porão. Verifique as recomendações antes do voo.`;
    }

    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXPANDED FAQS (HTML ACCORDION + FAQPAGE SCHEMA)
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalizedItemFAQs(
  item: ItemLike,
  itemName: string,
  categoryLabel: string,
  lang: Lang
): Array<{ question: string; answer: string }> {
  const currentYear = new Date().getFullYear();
  const cStatus = item.carryOn?.status || 'ALLOWED';
  const hStatus = item.checkedBag?.status || 'ALLOWED';

  switch (lang) {
    case 'de':
      return [
        {
          question: `Darf man ${itemName} im Flugzeug mitnehmen (${currentYear})?`,
          answer: `Gemäß den internationalen Luftsicherheitsrichtlinien ist ${itemName} im Handgepäck ${
            cStatus === 'ALLOWED' ? 'erlaubt' : cStatus === 'RESTRICTED' ? 'unter Auflagen gestattet' : 'nicht erlaubt'
          } und im Aufgabegepäck ${
            hStatus === 'ALLOWED' ? 'erlaubt' : hStatus === 'RESTRICTED' ? 'unter Auflagen gestattet' : 'verboten'
          }.`,
        },
        {
          question: `Darf ${itemName} ins Handgepäck?`,
          answer: cStatus === 'ALLOWED'
            ? `Ja, ${itemName} darf problemlos mit in die Kabine genommen werden. Stellen Sie sicher, dass der Gegenstand sicher verstaut ist.`
            : cStatus === 'RESTRICTED'
            ? `Ja, allerdings gelten für ${itemName} im Handgepäck besondere Einschränkungen (z. B. Mengenbegrenzungen oder Sicherheitsauflagen).`
            : `Nein, ${itemName} ist im Handgepäck verboten und wird bei der Sicherheitskontrolle beschlagnahmt.`,
        },
        {
          question: `Darf ${itemName} in den Koffer (Aufgabegepäck)?`,
          answer: hStatus === 'ALLOWED'
            ? `Ja, ${itemName} kann sicher im aufgegebenen Koffer transportiert werden.`
            : hStatus === 'RESTRICTED'
            ? `Im Aufgabegepäck ist ${itemName} nur unter bestimmten Sicherheitsvorkehrungen erlaubt.`
            : `Nein, ${itemName} darf unter keinen Umständen im aufgegebenen Koffer transportiert werden (z. B. Brandgefahr im Frachtraum).`,
        },
        {
          question: `Was passiert bei der Sicherheitskontrolle mit ${itemName}?`,
          answer: `Wenn das Sicherheitspersonal bei der Röntgenkontrolle ${itemName} überprüft, kann eine Nachkontrolle durchgeführt werden. Halten Sie den Gegenstand bei Aufforderung bereit. Die finale Entscheidung liegt beim diensthabenden Kontrollpersonal.`,
        },
        {
          question: `Gelten für ${itemName} bei internationalen Flügen andere Regeln?`,
          answer: `Während in den USA die TSA-Regeln gelten, richten sich europäische Flüge nach EASA-Standards. Für Artikel der Kategorie ${categoryLabel} können einzelne Zielländer oder Fluggesellschaften zusätzliche Gepäckbestimmungen vorschreiben.`,
        },
      ];

    case 'es':
      return [
        {
          question: `¿Se puede llevar ${itemName} en el avión (${currentYear})?`,
          answer: `Según la normativa oficial de aviación, ${itemName} está ${
            cStatus === 'ALLOWED' ? 'permitido' : cStatus === 'RESTRICTED' ? 'restringido' : 'prohibido'
          } en el equipaje de mano y ${
            hStatus === 'ALLOWED' ? 'permitido' : hStatus === 'RESTRICTED' ? 'restringido' : 'prohibido'
          } en el equipaje facturado en bodega.`,
        },
        {
          question: `¿Se puede llevar ${itemName} en la maleta de mano?`,
          answer: cStatus === 'ALLOWED'
            ? `Sí, ${itemName} está totalmente permitido en la cabina del avión. Guárdelo en un lugar accesible para el control.`
            : cStatus === 'RESTRICTED'
            ? `Sí, pero ${itemName} está sujeto a condiciones específicas en equipaje de mano.`
            : `No, ${itemName} está prohibido en cabina y los agentes de seguridad lo confiscarán en el control.`,
        },
        {
          question: `¿Se puede facturar ${itemName} en la maleta?`,
          answer: hStatus === 'ALLOWED'
            ? `Sí, puede empacar ${itemName} en su equipaje facturado sin inconvenientes.`
            : hStatus === 'RESTRICTED'
            ? `En bodega, ${itemName} solo se admite si cumple ciertas condiciones de embalaje o seguridad.`
            : `No, está prohibido facturar ${itemName} en bodega debido a los protocolos de seguridad aérea.`,
        },
        {
          question: `¿Qué sucede en el control de seguridad con ${itemName}?`,
          answer: `Al pasar por el escáner de rayos X, el agente puede apartar su equipaje para una inspección visual. Coopere siempre con el personal de seguridad aeroportuaria.`,
        },
        {
          question: `¿Varían las normas de ${itemName} según la aerolínea o el país?`,
          answer: `Aunque la TSA y EASA establecen estándares generales para ${categoryLabel}, cada aerolínea (como Iberia o Vueling) y las aduanas de destino pueden aplicar límites de peso y franquicia propios.`,
        },
      ];

    case 'fr':
      return [
        {
          question: `Peut-on emporter ${itemName} en avion (${currentYear}) ?`,
          answer: `D'après les règlements de sûreté aérienne, ${itemName} est ${
            cStatus === 'ALLOWED' ? 'autorisé' : cStatus === 'RESTRICTED' ? 'soumis à restrictions' : 'interdit'
          } en bagage cabine et ${
            hStatus === 'ALLOWED' ? 'autorisé' : hStatus === 'RESTRICTED' ? 'soumis à restrictions' : 'interdit'
          } en bagage en soute.`,
        },
        {
          question: `Peut-on mettre ${itemName} dans son bagage cabine ?`,
          answer: cStatus === 'ALLOWED'
            ? `Oui, ${itemName} est pleinement autorisé en cabine passagers.`
            : cStatus === 'RESTRICTED'
            ? `Oui, mais ${itemName} est soumis à des règles spécifiques en cabine.`
            : `Non, ${itemName} est formellement interdit en cabine et sera retenu au poste d'inspection filtrage.`,
        },
        {
          question: `Peut-on mettre ${itemName} en soute ?`,
          answer: hStatus === 'ALLOWED'
            ? `Oui, vous pouvez placer ${itemName} dans votre valise enregistrée en soute.`
            : hStatus === 'RESTRICTED'
            ? `En soute, ${itemName} est admis uniquement sous certaines conditions d'emballage.`
            : `Non, il est interdit de déposer ${itemName} en soute pour des raisons de sécurité incendie.`,
        },
        {
          question: `Que se passe-t-il au contrôle de sûreté avec ${itemName} ?`,
          answer: `Si ${itemName} attire l'attention des agents au scanner, un contrôle manuel ou une détection de traces d'explosifs peut être effectuée. La décision finale appartient à l'agent de sûreté.`,
        },
        {
          question: `Les règles pour ${itemName} changent-elles selon les pays ou compagnies ?`,
          answer: `En Europe, les directives de l'EASA et de la DGAC s'appliquent pour les articles de type ${categoryLabel}. Vérifiez également les règles de votre compagnie aérienne (Air France, Transavia, etc.).`,
        },
      ];

    case 'it':
      return [
        {
          question: `Si può portare ${itemName} in aereo (${currentYear})?`,
          answer: `Secondo le norme di sicurezza dell'aviazione, ${itemName} è ${
            cStatus === 'ALLOWED' ? 'consentito' : cStatus === 'RESTRICTED' ? 'soggetto a limitazioni' : 'vietato'
          } nel bagaglio a mano e ${
            hStatus === 'ALLOWED' ? 'consentito' : hStatus === 'RESTRICTED' ? 'soggetto a limitazioni' : 'vietato'
          } nel bagaglio da stiva.`,
        },
        {
          question: `Si può portare ${itemName} nel bagaglio a mano?`,
          answer: cStatus === 'ALLOWED'
            ? `Sì, ${itemName} può viaggiare in cabina senza problemi.`
            : cStatus === 'RESTRICTED'
            ? `Sì, ma ${itemName} è soggetto a condizioni particolari nel bagaglio a mano.`
            : `No, ${itemName} è vietato nel bagaglio a mano e verrà requisito ai controlli di sicurezza.`,
        },
        {
          question: `Si può mettere ${itemName} nella valigia in stiva?`,
          answer: hStatus === 'ALLOWED'
            ? `Sì, potete imbarcare ${itemName} nella valigia da stiva.`
            : hStatus === 'RESTRICTED'
            ? `In stiva ${itemName} è consentito solo rispettando apposite norme di sicurezza.`
            : `No, è severamente vietato imbarcare ${itemName} nella stiva dell'aereo.`,
        },
        {
          question: `Cosa accade ai controlli di sicurezza con ${itemName}?`,
          answer: `Se gli addetti aeroportuali individuano ${itemName} ai raggi X, il bagaglio potrà essere sottoposto a verifica manuale. La decisione definitiva spetta al personale di sicurezza.`,
        },
        {
          question: `Le regole per ${itemName} variano sui voli internazionali?`,
          answer: `In Europa vigono gli standard EASA/ENAC per gli articoli di categoria ${categoryLabel}. Verificate sempre le politiche specifiche della vostra compagnia di volo.`,
        },
      ];

    case 'ja':
      return [
        {
          question: `${itemName}は飛行機に持ち込めますか（${currentYear}年最新）？`,
          answer: `航空保安基準に基づき、${itemName}は機内持ち込みが${
            cStatus === 'ALLOWED' ? '可能' : cStatus === 'RESTRICTED' ? '条件付きで可能' : '禁止'
          }、受託手荷物（預け入れ）が${
            hStatus === 'ALLOWED' ? '可能' : hStatus === 'RESTRICTED' ? '条件付きで可能' : '禁止'
          }と定められています。`,
        },
        {
          question: `${itemName}は機内持ち込み手荷物に入れられますか？`,
          answer: cStatus === 'ALLOWED'
            ? `はい、${itemName}は機内持ち込み手荷物として問題なくお持ちいただけます。`
            : cStatus === 'RESTRICTED'
            ? `はい、ただし${itemName}を機内に持ち込む際は容量や個数などの規定を満たす必要があります。`
            : `いいえ、${itemName}は保安上の危険物とみなされるため機内持ち込みはできません。`,
        },
        {
          question: `${itemName}はスーツケースに入れて預けられますか（受託手荷物）？`,
          answer: hStatus === 'ALLOWED'
            ? `はい、${itemName}はスーツケースに入れて預託手荷物として預けることができます。`
            : hStatus === 'RESTRICTED'
            ? `受託手荷物への預け入れは可能ですが、梱包状態などの規定を遵守してください。`
            : `いいえ、${itemName}は貨物室内での火災防止等の観点から受託手荷物への預け入れが禁止されています。`,
        },
        {
          question: `空港の保安検査場で${itemName}を提示する必要はありますか？`,
          answer: `X線検査装置で確認された場合、保安検査員による目視・開帳検査や爆発物微量検知（ETD）検査が行われる場合があります。検査員の指示に従ってください。`,
        },
        {
          question: `国際線フライトでの${itemName}の取り扱いは国内線と異なりますか？`,
          answer: `日本の国土交通省（JCAB）ルールに加え、渡航先の国や経由地、各航空会社（ANA、JAL等）の独自規定によって${categoryLabel}の持ち込み制限が異なる場合があります。`,
        },
      ];

    case 'ko':
      return [
        {
          question: `${itemName}을(를) 비행기에 가지고 탈 수 있나요 (${currentYear}년)?`,
          answer: `항공 보안 규정에 따라 ${itemName}은(는) 기내 휴대 수하물로 ${
            cStatus === 'ALLOWED' ? '반입 가능' : cStatus === 'RESTRICTED' ? '조건부 반입 가능' : '반입 불가'
          }이며, 위탁 수하물로 ${
            hStatus === 'ALLOWED' ? '부치기 가능' : hStatus === 'RESTRICTED' ? '조건부 부치기 가능' : '탁송 불가'
          }합니다.`,
        },
        {
          question: `${itemName} 기내 반입이 가능한가요?`,
          answer: cStatus === 'ALLOWED'
            ? `네, ${itemName}은(는) 객실 내 휴대 수하물로 안전하게 반입하실 수 있습니다.`
            : cStatus === 'RESTRICTED'
            ? `네, 다만 ${itemName}은(는) 용량 및 포장 등 조건부 규정이 적용됩니다.`
            : `아니요, 보안상 위해 물품으로 분류되어 기내 반입이 불가능하며 검색대에서 포기 처리될 수 있습니다.`,
        },
        {
          question: `${itemName} 위탁 수하물(화물칸)로 보낼 수 있나요?`,
          answer: hStatus === 'ALLOWED'
            ? `네, ${itemName}은(는) 위탁 수하물 가방에 안전하게 포장하여 부치실 수 있습니다.`
            : hStatus === 'RESTRICTED'
            ? `위탁 수하물 탁송은 가능하나 안전 포장 규정을 확인하셔야 합니다.`
            : `아니요, 화재 예방 및 위험물 규정에 따라 위탁 수하물로 부치는 것이 엄격히 금지됩니다.`,
        },
        {
          question: `공항 보안검색대 통과 시 주의할 점은 무엇인가요?`,
          answer: `X선 검색 시 의심 물품으로 분류되면 개봉 검사 또는 폭발물 흔적 탐지 검사를 받을 수 있습니다. 검색 요원의 안내에 따라 협조해 주시기 바랍니다.`,
        },
        {
          question: `국제선과 국내선의 ${itemName} 규정에 차이가 있나요?`,
          answer: `대한민국 국토교통부 규정뿐만 아니라 취항지 국가(미국 TSA, 유럽 EASA 등) 및 해당 항공사(대한항공, 아시아나 등)의 ${categoryLabel} 세부 규정을 사전 확인하시는 것이 안전합니다.`,
        },
      ];

    case 'pt':
      return [
        {
          question: `É permitido levar ${itemName} no avião (${currentYear})?`,
          answer: `De acordo com as regras de aviação civil, ${itemName} é ${
            cStatus === 'ALLOWED' ? 'permitido' : cStatus === 'RESTRICTED' ? 'permitido com restrições' : 'proibido'
          } na bagagem de mão e ${
            hStatus === 'ALLOWED' ? 'permitido' : hStatus === 'RESTRICTED' ? 'permitido com restrições' : 'proibido'
          } na bagagem despachada.`,
        },
        {
          question: `Posso levar ${itemName} na bagagem de mão?`,
          answer: cStatus === 'ALLOWED'
            ? `Sim, ${itemName} é totalmente permitido na cabine do avião.`
            : cStatus === 'RESTRICTED'
            ? `Sim, mas ${itemName} tem condições específicas para transporte na bagagem de mão.`
            : `Não, ${itemName} é proibido na cabine e será retido no raio-X do aeroporto.`,
        },
        {
          question: `Posso despachar ${itemName} na mala de porão?`,
          answer: hStatus === 'ALLOWED'
            ? `Sim, você pode despachar ${itemName} na sua bagagem registrada sem problemas.`
            : hStatus === 'RESTRICTED'
            ? `No porão, ${itemName} é permitido sob requisitos específicos de embalagem.`
            : `Não, é proibido despachar ${itemName} por motivos de segurança e prevenção de incêndios no porão.`,
        },
        {
          question: `O que acontece na inspeção de segurança com ${itemName}?`,
          answer: `Ao passar pelo equipamento de raio-X, o agente de segurança poderá solicitar inspeção manual da mala. A palavra final cabe ao agente de serviço no posto.`,
        },
        {
          question: `As regras para ${itemName} mudam em voos internacionais?`,
          answer: `As regras da ANAC e da EASA cobrem itens da categoria ${categoryLabel}. Verifique sempre as diretrizes da sua companhia aérea (como TAP ou LATAM) e da alfândega de destino.`,
        },
      ];

    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SCREENING PROCEDURE (GEO & TECHNICAL SEO)
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalizedScreeningProcedure(item: ItemLike, itemName: string, lang: Lang): string {
  const cat = item.category?.toLowerCase() || '';

  switch (lang) {
    case 'de':
      if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
        return `Bei der Sicherheitskontrolle für ${itemName} müssen Flüssigkeiten in Behältern bis max. 100 ml in einem transparenten, wiederverschließbaren 1-Liter-Beutel vorgezeigt werden. An Flughäfen mit modernen CT-Scannern kann der Beutel im Gepäck bleiben, es sei denn, das Sicherheitspersonal fordert die Entnahme an.`;
      }
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `Größere elektronische Geräte rund um ${itemName} (Laptops, Tablets, Kameras) müssen an herkömmlichen Kontrollspuren separat in die Kontrollwanne gelegt werden. Powerbanks und Ersatzakkus gehören zwingend ins Handgepäck und dürfen nicht in den Koffer.`;
      }
      return `Am Kontrollpunkt wird ${itemName} durch die Röntgen- oder CT-Prüfanlage gescannt. Halten Sie Gegenstände ordentlich verstaut, um Verzögerungen und manuelle Nachkontrollen durch die Bundespolizei oder das Sicherheitspersonal zu vermeiden.`;

    case 'es':
      if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
        return `En el control de seguridad con ${itemName}, los envases de líquidos deben ser de 100 ml o menos y caber en una bolsa transparente de 1 litro. En aeropuertos con escáneres CT 3D modernos, puede dejarlos dentro de su equipaje a menos que se le indique lo contrario.`;
      }
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `Los dispositivos electrónicos mayores a un móvil vinculados a ${itemName} deben sacarse y colocarse en bandejas independientes en escáneres 2D estándar. Las baterías de repuesto y baterías externas deben viajar siempre en cabina.`;
      }
      return `En el arco de seguridad, ${itemName} pasará por el sistema de inspección radioscópica. Si el escáner detecta áreas densas, los agentes de seguridad aeroportuaria realizarán una revisión manual de su maleta.`;

    case 'fr':
      if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
        return `Au filtre de sécurité, ${itemName} sous forme liquide doit être dans un flacon de 100 ml maximum, placé dans un sac plastique transparent fermé d'un litre. Dans les aéroports équipés de scanners CT 3D, vous pouvez le laisser dans votre sac sauf avis contraire des agents.`;
      }
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `Les appareils électroniques plus grands qu'un smartphone associés à ${itemName} doivent être sortis de votre bagage et déposés dans un bac dédié. Les batteries de secours doivent impérativement voyager en cabine.`;
      }
      return `Au poste d'inspection filtrage, ${itemName} passe par les équipements d'imagerie radiologique. En cas de doute, une vérification manuelle par les agents de sûreté aéroportuaire sera effectuée.`;

    case 'it':
      if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
        return `Ai varchi di sicurezza, ${itemName} in formato liquido deve essere in contenitori di massimo 100 ml inseriti nella bustina trasparente richiudibile da 1 litro. Negli scali con scanner tomografici CT 3D di nuova generazione, può restare all'interno del bagaglio.`;
      }
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `I dispositivi elettronici collegati a ${itemName} di dimensioni superiori a uno smartphone vanno estratti e riposti in una vaschetta dedicata. Power bank e accumulatori devono viaggiare unicamente in cabina.`;
      }
      return `Al controllo passeggeri, ${itemName} transita attraverso l'apparato radiogeno. Se l'immagine risulta complessa, gli addetti alla sicurezza procederanno a una rapida ispezione manuale.`;

    case 'ja':
      if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
        return `保安検査場において、${itemName}などの液体物は1容器あたり100ml（g）以下の容器に入れ、容量1リットル以下の透明プラスチック製開閉式袋にまとめて提示する必要があります。最新型CT検査機導入レーンではバッグから出さずに通過できる場合があります。`;
      }
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `${itemName}に関わる大型電子機器（ノートPC・タブレット・大型カメラ等）は手荷物から取り出し、専用トレイに並べて検査を受けます。予備のリチウム電池やモバイルバッテリーは受託手荷物禁止のため、必ず手荷物として機内にお持ちください。`;
      }
      return `保安検査場では${itemName}がX線またはCTスキャナーを通過します。検査員から指示があった場合は、速やかに手荷物の開帳検査に応じてください。最終的な持ち込み可否の判断は現場の保安検査員に委ねられます。`;

    case 'ko':
      if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
        return `보안검색대에서 ${itemName} 액체류는 개별 용기 100ml 이하로 1리터 규격의 투명 지퍼백 1개에 담아 제시해야 합니다. 최신 3D CT 검색대가 설치된 공항에서는 가방에 넣은 채 통과할 수 있습니다.`;
      }
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `${itemName}과 관련된 스마트폰보다 큰 전자제품은 가방에서 꺼내 바구니에 분리 보관하여 검사받아야 합니다. 보조배터리 및 여분의 리튬 배터리는 위탁 수하물로 부칠 수 없으므로 반드시 기내 휴대하세요.`;
      }
      return `보안검색대에서 ${itemName}은(는) X-ray 검색을 거칩니다. 영상 판독 시 정밀 확인이 필요한 경우 보안검색요원에 의한 개장 검사가 실시될 수 있습니다.`;

    case 'pt':
      if (cat.includes('liquid') || cat.includes('beauty') || cat.includes('personal-care')) {
        return `No controle de segurança para ${itemName}, líquidos devem estar em frascos de até 100 ml dentro de embalagem plástica transparente vedável de até 1 litro. Em aeroportos com tomografia computadorizada 3D, os itens podem permanecer dentro da bagagem.`;
      }
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `Equipamentos eletrônicos maiores que um telefone celular vinculados a ${itemName} devem ser retirados para escaneamento em bandeja separada. Baterias portáteis devem viajar sempre na bagagem de mão.`;
      }
      return `No canal de inspeção, ${itemName} passará pelo equipamento de raio-X. Mantenha os pertences organizados para facilitar a visualização e evitar abertura manual da bagagem pelos agentes.`;

    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REGULATORY DETAILS (GEO SEO & AUTHORITATIVE E-E-A-T)
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalizedRegulatoryDetails(item: ItemLike, itemName: string, lang: Lang): string {
  const cat = item.category?.toLowerCase() || '';

  switch (lang) {
    case 'de':
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `Gemäß den Gefahrgutvorschriften der ICAO/IATA und der EASA dürfen Lithium-Ionen-Akkus für ${itemName} im Handgepäck eine Nennenergie von 100 Wattstunden (Wh) in der Regel nicht überschreiten. Lose Ersatzbatterien im Frachtraum sind aus Sicherheitsgründen international untersagt.`;
      }
      return `Die Mitnahme von ${itemName} richtet sich nach der EU-Verordnung (EU) 2015/1998 über gemeinsame Grundnormen für die Luftsicherheit sowie den Vorgaben des Luftfahrt-Bundesamtes (LBA) und der US-amerikanischen TSA.`;

    case 'es':
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `Bajo las normativas de seguridad de IATA y de la Agencia Estatal de Seguridad Aérea (AESA / EASA), las baterías de litio de ${itemName} tienen un límite habitual de 100 Wh por unidad en cabina. Las baterías sueltas en bodega están terminantemente prohibidas.`;
      }
      return `El transporte de ${itemName} se rige por el Reglamento (UE) 2015/1998 de seguridad de la aviación civil y los protocolos homologados por la TSA y organismos internacionales de navegación aérea.`;

    case 'fr':
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `Conformément aux réglementations sur les marchandises dangereuses de l'IATA et de la DGAC/EASA, les batteries lithium équipant ${itemName} sont limitées à 100 Wh en cabine. Les batteries de rechange en soute sont strictement interdites.`;
      }
      return `Le transport de ${itemName} est encadré par le règlement européen (UE) 2015/1998 fixant les règles de sûreté de l'aviation civile ainsi que par les directives applicables de la TSA.`;

    case 'it':
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `In base alle direttive IATA ed ENAC/EASA sul trasporto di merci pericolose, le batterie agli ioni di litio per ${itemName} sono soggette a una soglia standard di 100 Wh in cabina. Le batterie sfuse in stiva non sono consentite.`;
      }
      return `Il trasporto di ${itemName} è disciplinato dal Regolamento UE 2015/1998 per la sicurezza aerea dei passeggeri e dagli standard internazionali della TSA.`;

    case 'ja':
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `日本の航空法（国土交通省 航空局 危険物基準）および国際航空運送協会（IATA）危険物規則書に基づき、${itemName}に用いられるリチウムイオン電池は単体容量100Wh（または160Wh以下の航空会社承認制）に制限されます。予備電池の受託手荷物は全面禁止です。`;
      }
      return `${itemName}の航空機への搭載基準は、国土交通省（航空局・危険物輸送基準）および米国TSA（運輸保安庁）のセキュリティ基準に準拠しています。`;

    case 'ko':
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `대한민국 항공보안법 및 국토교통부 위험물 운송 기준(IATA Dangerous Goods Regulations 준용)에 따라 ${itemName}에 장착된 리튬 배터리는 100Wh 이하 규정이 적용됩니다. 여분의 리튬 배터리는 위탁 수하물 탑재가 전면 금지됩니다.`;
      }
      return `${itemName}의 운송 규정은 대한민국 국토교통부 항공 보안 지침 및 미국 TSA 표준 보안 운영 절차에 따라 관리됩니다.`;

    case 'pt':
      if (cat.includes('electronic') || cat.includes('battery')) {
        return `Conforme as regras para artigos perigosos da IATA, da ANAC e da EASA, baterias de íon de lítio de ${itemName} respeitam o teto padrão de 100 Wh na cabine. Baterias sobressalentes no porão são proibidas.`;
      }
      return `As condições de transporte para ${itemName} são estabelecidas pela regulamentação da aviação civil da ANAC, EASA e TSA internacional.`;

    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. AIRLINE DIFFERENCES (GEO SEO)
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalizedAirlineDifferences(
  item: ItemLike,
  itemName: string,
  categoryLabel: string,
  lang: Lang
): string {
  switch (lang) {
    case 'de':
      return `Während die TSA in den USA und die EASA in Europa die Sicherheitsstandards vorgeben, können einzelne Fluggesellschaften wie Lufthansa, Eurowings, Ryanair oder Emirates strengere Handgepäckmaße und Gewichtsgrenzen (oft 7 bis 8 kg) für ${itemName} festlegen. Prüfen Sie vorab die Gepäckregeln Ihres gebuchten Tarifs.`;

    case 'es':
      return `Aunque los estándares oficiales de la TSA y EASA marcan las bases de seguridad, aerolíneas como Iberia, Vueling, Ryanair o Air Europa aplican restricciones adicionales de medidas y peso para el bulto de cabina donde viaje ${itemName}.`;

    case 'fr':
      return `Si les exigences de base sont fixées par la TSA et l'EASA, des compagnies telles qu'Air France, Transavia, EasyJet ou Ryanair appliquent leurs propres franchises de bagages à main pour ${itemName} (généralement 8 à 12 kg au total).`;

    case 'it':
      return `Oltre alle linee guida TSA ed EASA, vettori aerei come ITA Airways, Ryanair, EasyJet o Lufthansa applicano limiti dimensionali e ponderali rigorosi per la cabina quando trasportate ${itemName}.`;

    case 'ja':
      return `TSA基準のほか、ANA（全日本空輸）やJAL（日本航空）、格安航空会社（LCC）各社では機内持ち込みサイズ・総重量（合計7kg〜10kg以内）に独自の制限を設けています。${itemName}を含む手荷物の合計サイズを事前にご確認ください。`;

    case 'ko':
      return `국제 보안 지침 외에도 대한항공, 아시아나항공, 제주항공 등 국내외 항공사는 ${itemName}을(를) 포함한 기내 수하물에 대해 7~10kg의 무게 제한 및 크기 규격을 엄격히 적용합니다.`;

    case 'pt':
      return `Além dos requisitos de segurança da TSA e da ANAC, empresas como TAP Air Portugal, LATAM, Azul ou Ryanair possuem regras próprias de dimensões e peso máximo para a bagagem de mão com ${itemName}.`;

    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. STEP-BY-STEP PACKING GUIDE
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalizedStepByStepPackingGuide(item: ItemLike, itemName: string, lang: Lang): string[] {
  const cStatus = item.carryOn?.status || 'ALLOWED';

  // If prohibited in cabin, guide for checked bag
  if (cStatus === 'NOT_ALLOWED') {
    switch (lang) {
      case 'de':
        return [
          `Vergewissern Sie sich, dass ${itemName} im Aufgabegepäck zugelassen ist und keine verbotenen Gefahrstoffe enthält.`,
          `Wickeln Sie ${itemName} in weiche Kleidung oder Luftpolsterfolie, um Erschütterungen im Frachtraum abzufedern.`,
          `Verstauen Sie den Gegenstand mittig im Koffer, geschützt vor Reißverschlüssen und Kanten.`,
          `Verschließen Sie das Gepäckstück vorzugsweise mit einem TSA-konformen Zahlenschloss.`,
          `Achten Sie darauf, dass das zulässige Gesamtgewicht Ihrer Fluggesellschaft (meist 23 kg) nicht überschritten wird.`,
        ];
      case 'es':
        return [
          `Compruebe que ${itemName} esté permitido en equipaje facturado y no contenga componentes HAZMAT prohibidos.`,
          `Envuelva ${itemName} en ropa suave o plástico de burbujas para protegerlo durante la manipulación de equipajes.`,
          `Colóquelo en el centro de la maleta, alejado de las cremalleras exteriores.`,
          `Asegure su maleta con un candado homologado TSA para facilitar posibles revisiones.`,
          `Compruebe que el peso total de la maleta respeta la franquicia de su billete (normalmente 23 kg).`,
        ];
      case 'fr':
        return [
          `Vérifiez que ${itemName} est bien autorisé en soute et ne contient aucun produit dangereux interdit.`,
          `Enveloppez ${itemName} dans un vêtement protecteur ou du papier bulle pour amortir les chocs.`,
          `Placez-le au cœur de votre valise, loin des fermetures éclair externes.`,
          `Verrouillez votre bagage avec un cadenas homologué TSA si possible.`,
          `Assurez-vous de respecter la limite de poids autorisée par votre compagnie (généralement 23 kg).`,
        ];
      case 'it':
        return [
          `Verificate che ${itemName} sia idoneo per il trasporto in stiva e privo di componenti vietati.`,
          `Avvolgete ${itemName} con capi morbidi o pluriball per proteggerlo dalle sollecitazioni.`,
          `Posizionate l'articolo al centro della valigia, al riparo dalle pareti esterne.`,
          `Chiudete il bagaglio con un lucchetto conforme TSA per i controlli doganali.`,
          `Rispettate la franchigia chilogrammi della compagnia aerea (spesso 23 kg per collo).`,
        ];
      case 'ja':
        return [
          `${itemName}が受託手荷物として預託可能であり、禁止危険物を含まないことを再確認します。`,
          `運搬時の衝撃から保護するため、衣類や緩衝材で${itemName}を丁寧に包みます。`,
          `スーツケースの中央部分に配置し、外側のジッパーや角からの圧力を避けます。`,
          `ランダム検査後の再施錠が可能なTSAロック付きスーツケースの使用を推奨します。`,
          `航空会社の預け荷物重量制限（通常20kg〜23kg）を超過していないか確認します。`,
        ];
      case 'ko':
        return [
          `${itemName}이(가) 위탁 수하물로 반입 가능하며 금지 위험물에 해당하지 않는지 확인합니다.`,
          `화물 적재 중 충격으로부터 보호하기 위해 부드러운 옷이나 완충재로 감쌉니다.`,
          `캐리어 중심부에 수납하여 외부 충격이나 지퍼 압력을 피하도록 배치합니다.`,
          `보안 검색 시 파손 없이 검사 가능한 TSA 인증 자물쇠를 사용하는 것이 좋습니다.`,
          `항공사 무료 위탁 수하물 무게 한도(통상 23kg)를 초과하지 않도록 점검합니다.`,
        ];
      case 'pt':
        return [
          `Confirme que ${itemName} pode ser despachado e não possui componentes perigosos proibidos.`,
          `Envolva ${itemName} em roupas macias ou plástico-bolha para amortecer impactos mecânicos.`,
          `Acomode o item no centro da mala, afastado dos zíperes externos.`,
          `Utilize preferencialmente um cadeado aprovado pela TSA para facilitar eventuais inspeções.`,
          `Verifique se o peso total da bagagem despachada permanece dentro da franquia (geralmente 23 kg).`,
        ];
      default:
        return [];
    }
  }

  // Carry-on allowed or restricted
  switch (lang) {
    case 'de':
      return [
        `Prüfen Sie vorab die Abmessungen und das Gewicht für ${itemName} gemäß den Handgepäckregeln Ihrer Airline.`,
        `Verstauen Sie ${itemName} so im Handgepäck, dass Sie am Sicherheitskontrollpunkt bei Bedarf schnellen Zugriff haben.`,
        `Schützen Sie empfindliche Bestandteile durch eine Hülle oder Polsterung im Gepäckstück.`,
        `Halten Sie den Gegenstand bereit, falls das Kontrollpersonal eine gesonderte Überprüfung anordnet.`,
        `Sichern Sie alle Fächer Ihrer Tasche, bevor Sie das Handgepäck in den Gepäckfächern an Bord verstauen.`,
      ];
    case 'es':
      return [
        `Verifique que las dimensiones y peso de ${itemName} se ajustan a las directrices de cabina de su compañía.`,
        `Colóquelo en un compartimento de fácil acceso para agilizar el paso por el control de rayos X.`,
        `Proteja las partes frágiles con una funda protectora o acolchado interior.`,
        `Esté preparado para mostrar el artículo si el agente de seguridad solicita una inspección adicional.`,
        `Cierre bien su equipaje antes de guardarlo en los compartimentos superiores de la cabina.`,
      ];
    case 'fr':
      return [
        `Vérifiez les dimensions et le poids de ${itemName} au regard des exigences cabine de votre compagnie.`,
        `Rangez ${itemName} dans une poche accessible afin de faciliter son extraction lors du contrôle de sûreté.`,
        `Protégez les composants fragiles avec une housse matelassée adaptée.`,
        `Soyez prêt à présenter l'article aux agents si une inspection complémentaire est requise.`,
        `Refermez soigneusement votre sac avant de l'installer dans les coffres à bagages de la cabine.`,
      ];
    case 'it':
      return [
        `Controllate dimensioni e peso di ${itemName} rispetto alle misure previste dal vostro biglietto.`,
        `Sistematelo in una tasca comoda per estrarlo agilmente durante il passaggio ai varchi di sicurezza.`,
        `Proteggete gli elementi delicati con una custodia antiurto adeguata.`,
        `Tenetevi pronti a mostrare l'oggetto qualora il personale richieda un controllo mirato.`,
        `Chiudete tutti gli scomparti prima di stivare il bagaglio nelle cappelliere a bordo.`,
      ];
    case 'ja':
      return [
        `ご搭乗便の機内持ち込みサイズと重量枠に${itemName}が適合しているか事前に測定します。`,
        `保安検査場のトレイに速やかに出せるよう、バッグの取り出しやすい位置に配置します。`,
        `破損しやすいデリケートな部分はクッション性のあるポーチやケースで保護します。`,
        `検査員から個別の目視確認を求められた際には速やかに提示できるよう準備します。`,
        `搭乗後は座席上の頭上収納棚または前席の座席下に確実に収納します。`,
      ];
    case 'ko':
      return [
        `이용하시는 항공사의 기내 수하물 크기 및 무게 기준에 ${itemName}이(가) 맞는지 확인합니다.`,
        `보안검색대에서 필요 시 신속하게 꺼낼 수 있도록 가방 상단이나 외부 포켓에 수납합니다.`,
        `충격에 약한 부품은 보호 케이스나 파우치에 넣어 안전하게 보관합니다.`,
        `보안 요원의 개별 확인 요청 시 바로 제시할 수 있도록 준비합니다.`,
        `기내 탑승 후 머리 위 선반이나 좌석 밑에 안전하게 수납합니다.`,
      ];
    case 'pt':
      return [
        `Confirme as dimensões e o peso de ${itemName} com base nas exigências de cabine da companhia aérea.`,
        `Mantenha ${itemName} em local de fácil acesso para agilizar a passagem pelo raio-X.`,
        `Proteja componentes delicados com estojo almofadado ou capa protetora.`,
        `Esteja pronto para exibir o item caso a segurança solicite inspeção complementar.`,
        `Feche todas as divisórias antes de acomodar a bagagem no compartimento superior da aeronave.`,
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXCEPTIONS, INTERNATIONAL & ALTERNATIVES
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalizedExceptions(item: ItemLike, itemName: string, lang: Lang): string {
  switch (lang) {
    case 'de':
      return `Ausnahmen von den Standardregeln für ${itemName} gelten insbesondere für medizinisch notwendige Artikel sowie Babynahrung. Solche Artikel müssen vor Beginn der Röntgenkontrolle beim Sicherheitspersonal angemeldet werden.`;
    case 'es':
      return `Las excepciones para ${itemName} aplican principalmente a artículos de prescripción médica demostrable y nutrición infantil esencial. Declare estos artículos al llegar al punto de inspección.`;
    case 'fr':
      return `Des dérogations pour ${itemName} s'appliquent en premier lieu aux nécessités médicales et aux besoins d'alimentation des nourrissons. Signalez-les aux agents dès votre arrivée au filtre.`;
    case 'it':
      return `Eventuali deroghe per ${itemName} riguardano primariamente dispositivi o farmaci salvavita e alimenti per la prima infanzia. È necessario dichiararli al personale prima del passaggio al metal detector.`;
    case 'ja':
      return `${itemName}に関する特例は、処方箋が発行された医薬品や乳幼児用食品などに適用されます。該当する場合は保安検査開始時に検査員へ事前に申告してください。`;
    case 'ko':
      return `${itemName}에 대한 면제 기준은 의사 처방 의약품이나 영유아용 이유식 등에 제한적으로 인정됩니다. 해당 시 검색 시작 전 요원에게 사전 신고하셔야 합니다.`;
    case 'pt':
      return `Isenções para ${itemName} contemplam principalmente medicamentos de uso contínuo com laudo e alimentação infantil essencial. Declare esses itens aos fiscais antes do início da inspeção.`;
    default:
      return '';
  }
}

export function getLocalizedInternational(item: ItemLike, itemName: string, lang: Lang): string {
  switch (lang) {
    case 'de':
      return `Bei internationalen Reisen können Zollbestimmungen und länderspezifische Einfuhrverbote (z. B. für Lebensmittel, Pflanzen oder bestimmte Arzneien) strenger sein als die reinen TSA-Flugsicherheitsregeln. Informieren Sie sich vor der Einreise über die Zollvorschriften Ihres Zielstaates.`;
    case 'es':
      return `En vuelos internacionales, las regulaciones aduaneras del país de destino (especialmente para productos biológicos, alimentos o medicamentos) pueden ser más estrictas que las normas de seguridad del aeropuerto de salida.`;
    case 'fr':
      return `Sur les vols internationaux, les services des douanes de votre pays d'arrivée imposent leurs propres règles d'importation (notamment sur les denrées alimentaires et les produits pharmaceutiques) en complément de la sûreté aéroportuaire.`;
    case 'it':
      return `Sui collegamenti internazionali, le normative doganali della nazione di arrivo possono prevedere restrizioni supplementari all'importazione (in particolare per generi alimentari o farmaci particolari).`;
    case 'ja':
      return `国際線では各国の税関・検疫ルール（生鮮食品・肉製品・植物・指定医薬品の輸入制限など）が空港保安基準とは別に適用されます。渡航先国の最新の税関基準を事前にご確認ください。`;
    case 'ko':
      return `국제선 여행 시 도착 국가의 세관 및 검역 규정(식품, 농축산물, 특정 의약품 반입 제한 등)이 적용되므로 방문 국가의 공식 세관 안내를 사전에 확인하시기 바랍니다.`;
    case 'pt':
      return `Em viagens ao exterior, as alfândegas e órgãos de vigilância sanitária dos países de destino impõem restrições de importação específicas que complementam as diretrizes de segurança aérea.`;
    default:
      return '';
  }
}

export function getLocalizedAlternatives(item: ItemLike, itemName: string, lang: Lang): string {
  switch (lang) {
    case 'de':
      return `Falls Sie ${itemName} nicht im Handgepäck mitnehmen können, erwägen Sie den Kauf nach der Sicherheitskontrolle im Duty-Free-Bereich, feste Alternativprodukte (z. B. feste Seifen statt Flüssigkeiten) oder den Kauf am Reiseziel.`;
    case 'es':
      return `Si no puede viajar con ${itemName} en cabina, valore adquirir versiones sólidas en lugar de líquidas, comprar el artículo tras el control de seguridad o adquirirlo directamente en destino.`;
    case 'fr':
      return `Si ${itemName} ne peut être transporté en cabine, privilégiez des formats solides équivalents, des achats en zone duty-free après le filtre, ou l'achat sur votre lieu de séjour.`;
    case 'it':
      return `Qualora ${itemName} non possa salire a bordo in cabina, valutate formulazioni solide, l'acquisto nell'area duty-free dopo i controlli o l'acquisto diretto all'arrivo.`;
    case 'ja':
      return `${itemName}を機内に持ち込めない場合の代替案として、固形製品への切り替え、保安検査通過後の免税店・売店での購入、または現地調達をご検討ください。`;
    case 'ko':
      return `${itemName}의 기내 반입이 제한되는 경우 고체형 대체품 사용, 보안검색 통과 후 면세 구역 내 구매 또는 여행지 현지 구매를 권장합니다.`;
    case 'pt':
      return `Se não puder transportar ${itemName} na cabine, considere alternativas sólidas em vez de líquidas, compras no duty-free após a segurança ou aquisição no destino.`;
    default:
      return '';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CARRY-ON & CHECKED REASON FALLBACKS
// ─────────────────────────────────────────────────────────────────────────────

export function getLocalizedCarryOnReason(item: ItemLike, itemName: string, lang: Lang): string {
  const cStatus = item.carryOn?.status || 'ALLOWED';
  switch (lang) {
    case 'de':
      if (cStatus === 'ALLOWED') return `Gemäß offiziellen Luftsicherheitsrichtlinien ist ${itemName} im Handgepäck gestattet. Halten Sie sich an die Standard-Gepäckmaße Ihrer Fluggesellschaft.`;
      if (cStatus === 'NOT_ALLOWED') return `Im Handgepäck verboten. Bei der Sicherheitskontrolle vor den Gates wird ${itemName} aus Sicherheitsgründen einbehalten.`;
      return `${itemName} ist im Handgepäck nur eingeschränkt erlaubt. Beachten Sie eventuelle Mengen- oder Kapazitätsbeschränkungen.`;
    case 'es':
      if (cStatus === 'ALLOWED') return `Según las directrices de seguridad aérea, ${itemName} está permitido en cabina. Respete las medidas reglamentarias de su billete.`;
      if (cStatus === 'NOT_ALLOWED') return `Prohibido en equipaje de mano. Los agentes del control de seguridad confiscarán ${itemName} si intenta pasarlo.`;
      return `${itemName} tiene paso restringido en cabina y debe cumplir condiciones específicas de transporte.`;
    case 'fr':
      if (cStatus === 'ALLOWED') return `Conformément aux normes de sûreté aéroportuaire, ${itemName} est autorisé en cabine passagers.`;
      if (cStatus === 'NOT_ALLOWED') return `Interdit en bagage cabine. ${itemName} sera retenu lors de l'inspection filtrage avant l'accès aux portes.`;
      return `${itemName} est autorisé en cabine sous réserve du respect de conditions spécifiques.`;
    case 'it':
      if (cStatus === 'ALLOWED') return `Secondo i regolamenti di sicurezza aerea, ${itemName} è ammesso a bordo in cabina.`;
      if (cStatus === 'NOT_ALLOWED') return `Vietato nel bagaglio a mano. ${itemName} verrà requisito al varco di sicurezza prima dell'imbarco.`;
      return `${itemName} è ammesso in cabina con limitazioni. Rispettate i parametri previsti.`;
    case 'ja':
      if (cStatus === 'ALLOWED') return `航空保安基準に基づき、${itemName}は機内持ち込み手荷物として認められています。規定サイズ内で携帯してください。`;
      if (cStatus === 'NOT_ALLOWED') return `機内持ち込み禁止です。保安検査場において${itemName}は没収の対象となります。`;
      return `${itemName}の機内持ち込みには制限があります。数量や容量の規定を満たしている必要があります。`;
    case 'ko':
      if (cStatus === 'ALLOWED') return `공식 항공 보안 규정에 따라 ${itemName}은(는) 기내 휴대 수하물로 반입이 허용됩니다.`;
      if (cStatus === 'NOT_ALLOWED') return `기내 반입이 금지된 품목입니다. 보안검색대 통과 시 ${itemName}은(는) 압수 및 포기 처리됩니다.`;
      return `${itemName}은(는) 기내 반입 시 조건부 제한이 적용되므로 세부 허용 기준을 확인하세요.`;
    case 'pt':
      if (cStatus === 'ALLOWED') return `De acordo com as normas de aviação, ${itemName} é permitido na bagagem de mão da cabine.`;
      if (cStatus === 'NOT_ALLOWED') return `Proibido na bagagem de mão. ${itemName} será confiscado pelos agentes no canal de inspeção.`;
      return `${itemName} é permitido na cabine mediante cumprimento de condições específicas de transporte.`;
    default:
      return item.carryOn?.reason || '';
  }
}

export function getLocalizedCheckedReason(item: ItemLike, itemName: string, lang: Lang): string {
  const hStatus = item.checkedBag?.status || 'ALLOWED';
  switch (lang) {
    case 'de':
      if (hStatus === 'ALLOWED') return `Im aufgegebenen Gepäck (Koffer) uneingeschränkt zulässig. Packen Sie ${itemName} stoßfest ein.`;
      if (hStatus === 'NOT_ALLOWED') return `Im Frachtraum streng verboten. Aus Brandschutzgründen (z. B. bei Lithium-Akkus) darf ${itemName} nicht im Koffer transportiert werden.`;
      return `Im Frachtraum nur unter besonderen Sicherheitsvorkehrungen zugelassen.`;
    case 'es':
      if (hStatus === 'ALLOWED') return `Totalmente permitido en el equipaje facturado en bodega. Empaque ${itemName} de forma segura.`;
      if (hStatus === 'NOT_ALLOWED') return `Estrictamente prohibido en bodega. Por prevención de incendios o riesgos aéreos, ${itemName} no puede ir en la maleta facturada.`;
      return `En bodega se autoriza únicamente bajo condiciones especiales de embalaje.`;
    case 'fr':
      if (hStatus === 'ALLOWED') return `Pleinement autorisé dans les bagages enregistrés en soute. Emballez ${itemName} soigneusement.`;
      if (hStatus === 'NOT_ALLOWED') return `Strictement interdit en soute. Pour des impératifs de sécurité incendie, ${itemName} ne peut voyager en soute.`;
      return `Autorisé en soute uniquement sous réserve d'emballages conformes.`;
    case 'it':
      if (hStatus === 'ALLOWED') return `Pienamente consentito nel bagaglio registrato da stiva. Proteggete ${itemName} con un imballo adeguato.`;
      if (hStatus === 'NOT_ALLOWED') return `Severamente vietato in stiva. Per norme antincendio internazionali, ${itemName} non può viaggiare nel bagaglio imbarcato.`;
      return `In stiva è consentito unicamente nel rispetto di specifici criteri di sicurezza.`;
    case 'ja':
      if (hStatus === 'ALLOWED') return `受託手荷物（預け荷物）として問題なく預けられます。破損を防ぐため${itemName}を緩衝材等で保護してください。`;
      if (hStatus === 'NOT_ALLOWED') return `貨物室への預け入れは禁止されています。発火や安全リスク防止のため、${itemName}は必ず手荷物として機内へお持ちください。`;
      return `受託手荷物として預ける際は、所定の梱包・安全条件を満たす必要があります。`;
    case 'ko':
      if (hStatus === 'ALLOWED') return `위탁 수하물로 안전하게 부치실 수 있습니다. 파손 방지를 위해 ${itemName}을(를) 완충 포장하세요.`;
      if (hStatus === 'NOT_ALLOWED') return `위탁 수하물 탁송이 엄격히 금지됩니다. 항공기 화재 예방을 위해 ${itemName}은(는) 반드시 기내로 직접 휴대하셔야 합니다.`;
      return `위탁 수하물 탁송 시 지정된 안전 요건을 준수해야 합니다.`;
    case 'pt':
      if (hStatus === 'ALLOWED') return `Totalmente permitido na bagagem despachada no porão. Acondicione ${itemName} de forma segura contra impactos.`;
      if (hStatus === 'NOT_ALLOWED') return `Estritamente proibido no porão da aeronave. Por razões de prevenção de incêndio, ${itemName} não pode ser despachado.`;
      return `No porão é autorizado somente mediante cumprimento de normas específicas de proteção.`;
    default:
      return item.checkedBag?.reason || '';
  }
}

