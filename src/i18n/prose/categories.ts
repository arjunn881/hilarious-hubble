/**
 * Translation overlay for the long-form category body.
 *
 * `lib/contentGenerator.ts` builds the eight category blocks from a single
 * English template per block, interpolating the category name (and, for the
 * introduction, the item count). So the localizable unit here is the *template*,
 * not the text: eight templates plus five FAQ pairs cover all 13 categories.
 *
 * Placeholders:
 *   {category}  native category label (already localized by the caller)
 *   {count}     number of items in the category — introduction only
 */
import type { Lang } from '../config';

/** One block of category body copy, before placeholder substitution. */
export interface CategoryProse {
  introduction?: string;
  overview?: string;
  tsaRules?: string;
  exceptions?: string;
  international?: string;
  commonMistakes?: string;
  recommendations?: string;
  faqs?: { question: string; answer: string }[];
}

/** Per-locale templates covering all 7 non-English languages. */
export const categoryProse: Partial<Record<Lang, CategoryProse>> = {
  de: {
    introduction: `Die Navigation durch die Sicherheitsvorschriften an Flughäfen kann selbst für routinierte Reisende eine Herausforderung sein – insbesondere beim Packen von Gegenständen aus der Kategorie {category}. Mit den offiziellen Vorgaben der Luftsicherheitsbehörden ist es unerlässlich, genau zu wissen, was im Handgepäck und was im aufgegebenen Gepäck erlaubt ist. Dieser ausführliche Leitfaden deckt die Bestimmungen für über {count} Gegenstände der Kategorie {category} ab.\n\nEgal, ob Sie einen kurzen Inlandsflug antreten oder eine internationale Fernreise planen: Die genauen Gepäckregeln für diese Gegenstände zu kennen, verhindert Verzögerungen am Kontrollpunkt, schützt vor der Beschlagnahmung wertvoller Besitztümer und stellt sicher, dass Sie alle geltenden Luftsicherheitsstandards einhalten.`,
    overview: `Die Kategorie {category} umfasst ein breites Spektrum an Artikeln des täglichen Bedarfs, der Reiseausrüstung und persönlicher Gegenstände. Das vorrangige Ziel des Sicherheitspersonals besteht darin sicherzustellen, dass keine Gegenstände an Bord gelangen, die die Flugsicherheit gefährden könnten. Daher werden alle mitgeführten Artikel sorgfältig überprüft.`,
    tsaRules: `Unter den internationalen Sicherheitsstandards (wie EASA, LBA und TSA) wird der Transport von Gegenständen der Kategorie {category} streng geregelt. Artikel, die eine Brandgefahr darstellen oder als Gefahrgut (HAZMAT) eingestuft sind, werden in der Passagierkabine untersagt. Unbedenkliche Gegenstände sind in beiden Gepäckarten gestattet, vorbehaltlich der Größen- und Gewichtslimits Ihrer Fluggesellschaft.`,
    exceptions: `Spezifische Ausnahmen gelten vor allem für medizinisch notwendige Produkte, verschreibungspflichtige Medikamente und wichtige Babynahrung. Wenn Sie einen Ausnahmeartikel mitführen, melden Sie diesen bitte vor Beginn der Kontrolle beim Sicherheitspersonal an.`,
    international: `Auf internationalen Flügen können Zollbestimmungen und länderspezifische Einfuhrverbote für {category} strenger sein als die reinen Sicherheitskontrollen am Abflughafen. Informieren Sie sich vor der Reise über die Bestimmungen Ihres Ziellandes.`,
    commonMistakes: `Zu den häufigsten Fehlern gehört das versehentliche Verstauen von Gegenständen mit Übergröße oder Beschränkungen im Handgepäck. Kontrollieren Sie Ihre Taschen vor der Abreise gründlich.`,
    recommendations: `Packen Sie empfindliche Gegenstände gut gepolstert ein, halten Sie prüfpflichtige Artikel griffbereit und verstauen Sie Zubehörteile ordentlich in separaten Organizern.`,
    faqs: [
      {
        question: `Darf man Artikel der Kategorie {category} im Handgepäck mitnehmen?`,
        answer: `Die meisten Standardartikel der Kategorie {category} dürfen im Handgepäck mitgeführt werden, sofern sie keine scharfen Kanten, gefährlichen Batterien oder verbotenen Flüssigkeitsmengen enthalten. Prüfen Sie immer den Einzelfall.`
      },
      {
        question: `Dürfen Gegenstände aus {category} in den aufgegebenen Koffer?`,
        answer: `Ja, der Großteil der Artikel aus dieser Kategorie kann problemlos im Aufgabegepäck transportiert werden. Ausnahmen bilden lose Lithium-Ionen-Akkus oder hochentzündliche Stoffe.`
      },
      {
        question: `Müssen {category}-Artikel bei der Sicherheitskontrolle separat vorgezeigt werden?`,
        answer: `Größere Geräte oder flüssige Bestandteile müssen an herkömmlichen Kontrollspuren separat in die Wanne gelegt werden. An Stationen mit modernen CT-Scannern können sie meist in der Tasche bleiben.`
      },
      {
        question: `Gibt es Mengenbegrenzungen für Artikel aus {category}?`,
        answer: `Für die Passagierkabine gelten vor allem die Handgepäckmaße und Gewichtsgrenzen der Fluggesellschaft sowie eventuelle Sicherheitslimits (wie 100 ml bei Flüssigkeiten).`
      },
      {
        question: `Unterscheiden sich die Regeln für {category} zwischen Fluggesellschaften?`,
        answer: `Während Luftsicherheitsrichtlinien gesetzlich vorgeschrieben sind, können Airlines eigene Grenzen für Handgepäckmaße und zulässiges Maximalgewicht festlegen.`
      }
    ]
  },

  es: {
    introduction: `Navegar por las normativas de seguridad en los aeropuertos puede resultar complejo, especialmente al empacar artículos de la categoría {category}. Con las directrices vigentes de aviación civil, es fundamental conocer con certeza qué se permite en cabina y qué debe transportarse en bodega. Esta guía integral cubre las reglas para más de {count} artículos de {category}.\n\nTanto si va a tomar un vuelo corto como un viaje transoceánico de larga distancia, dominar las condiciones de equipaje para {category} previene retrasos en el control, evita confiscaciones inesperadas y asegura un viaje sin contratiempos.`,
    overview: `La categoría {category} engloba una amplia selección de artículos indispensables para pasajeros. El objetivo principal de los agentes de seguridad es asegurar que ningún elemento comprometa la protección de la aeronave o de sus ocupantes.`,
    tsaRules: `Bajo los estándares de la Agencia Estatal de Seguridad Aérea (AESA), EASA y la TSA, el transporte de artículos clasificados en {category} se monitoriza exhaustivamente. Los artículos que entrañen riesgo de fuego o impacto se restringen en cabina, mientras que los elementos seguros son admitidos con normalidad.`,
    exceptions: `Existen exenciones claras para artículos de necesidad médica demostrable y alimentación para bebés. Si lleva un artículo que califique para estas excepciones, declárelo ante el personal de seguridad antes de pasar el arco.`,
    international: `En vuelos internacionales, las normativas aduaneras de entrada a su país de destino pueden tener restricciones adicionales para {category}. Verifique siempre las leyes locales de importación.`,
    commonMistakes: `Un fallo recurrente consiste en guardar artículos restringidos en bolsillos exteriores del equipaje de mano sin verificar sus condiciones. Revise su maleta con anticipación.`,
    recommendations: `Acomode sus pertenencias con acolchado protector, mantenga a mano aquellos artículos que requieran inspección individual y utilice organizadores compactos.`,
    faqs: [
      {
        question: `¿Se pueden llevar artículos de {category} en el equipaje de mano?`,
        answer: `Gran parte de los artículos de {category} están permitidos en cabina siempre que cumplan los límites dimensionales y de seguridad establecidos.`
      },
      {
        question: `¿Se pueden facturar artículos de {category} en la maleta de bodega?`,
        answer: `Sí, la mayoría de artículos de {category} se pueden facturar sin inconvenientes, a excepción de baterías de litio sueltas o elementos inflamables.`
      },
      {
        question: `¿Debo sacar los artículos de {category} al pasar por el control de seguridad?`,
        answer: `Si contienen componentes electrónicos grandes o partes líquidas, deberán colocarse en bandejas independientes en escáneres convencionales.`
      },
      {
        question: `¿Hay límites de cantidad para artículos de {category}?`,
        answer: `En cabina se aplican las restricciones de peso y volumen de la aerolínea, además de las normativas de seguridad específicas.`
      },
      {
        question: `¿Varían las normas de {category} entre diferentes compañías aéreas?`,
        answer: `Las pautas de seguridad son homogéneas, pero cada aerolínea establece franquicias de equipaje de mano particulares.`
      }
    ]
  },

  fr: {
    introduction: `Préparer ses bagages en conformité avec les règles de sûreté aéroportuaire est essentiel, notamment pour les articles de la catégorie {category}. En vertu des exigences de l'aviation civile, il est primordial de distinguer ce qui est permis en cabine de ce qui doit être placé en soute. Ce guide détaille les dispositions applicables à plus de {count} articles de la catégorie {category}.\n\nQue vous partiez pour un déplacement professionnel ou des vacances internationales, connaître la réglementation de {category} vous évitera toute retenue au filtre de sécurité et garantira un embarquement serein.`,
    overview: `La catégorie {category} regroupe des objets variés transportés par les passagers. La préoccupation première des services de sûreté est d'empêcher l'introduction à bord de tout objet présentant un danger potentiel.`,
    tsaRules: `Selon les règlements de l'EASA, de la DGAC et de la TSA, les articles de la catégorie {category} sont soumis à des critères d'admissibilité précis. Les produits présentant un risque d'incendie ou une dangerosité particulière sont proscrits en cabine passagers.`,
    exceptions: `Des dérogations spécifiques s'appliquent aux médicaments indispensables et à l'alimentation pour nourrissons. Présentez ces articles aux agents dès l'entrée dans la zone de contrôle.`,
    international: `Lors de voyages internationaux, les services des douanes de votre pays d'arrivée peuvent imposer des contrôles supplémentaires pour {category}, distincts des règles de sûreté aérienne.`,
    commonMistakes: `L'erreur classique consiste à oublier un objet soumis à restriction au fond de son bagage cabine. Procédez à un inventaire méticuleux avant votre départ.`,
    recommendations: `Protégez soigneusement les articles délicats, gardez les objets à vérifier à portée de main et respectez scrupuleusement les consignes de poids de votre billet.`,
    faqs: [
      {
        question: `Peut-on transporter des articles de la catégorie {category} en bagage cabine ?`,
        answer: `La plupart des articles de {category} sont autorisés en cabine s'ils respectent les critères de sécurité et les dimensions de bagages de votre compagnie.`
      },
      {
        question: `Peut-on enregistrer des articles de {category} en soute ?`,
        answer: `Oui, la majeure partie des objets de {category} peut voyager en soute sans restriction, sauf s'ils contiennent des batteries lithium dangereuses.`
      },
      {
        question: `Faut-il sortir les articles de {category} lors de l'inspection filtrage ?`,
        answer: `Les équipements électroniques volumineux ou les liquides doivent être déposés dans des bacs séparés lors des contrôles classiques.`
      },
      {
        question: `Y a-t-il une limite de quantité pour {category} en avion ?`,
        answer: `En cabine, les limites correspondent à la franchise de bagages de votre compagnie ainsi qu'aux règles sanitaires et douanières.`
      },
      {
        question: `Les compagnies appliquent-elles des règles différentes pour {category} ?`,
        answer: `Si les normes de sûreté sont réglementaires, chaque transporteur détermine ses propres tolérances de taille et de poids en cabine.`
      }
    ]
  },

  it: {
    introduction: `Rispettare le normative di sicurezza aeroportuale è fondamentale per evitare intoppi alla partenza, in particolare per gli articoli della categoria {category}. Grazie alle regole standard dell'aviazione civile, è essenziale sapere cosa sia ammesso nel bagaglio a mano e cosa debba essere imbarcato in stiva. Questa guida approfondita illustra i criteri per oltre {count} articoli di {category}.\n\nChe si tratti di un breve volo nazionale o di un viaggio a lungo raggio, conoscere con precisione le disposizioni per {category} vi consentirà di superare i controlli senza stress e senza rischiare il sequestro dei vostri beni.`,
    overview: `La categoria {category} include numerosi articoli di uso comune per i viaggiatori. L'obiettivo primario degli addetti alla sicurezza aeroportuale è verificare che nessun oggetto possa costituire un rischio per l'aeromobile o per le persone a bordo.`,
    tsaRules: `In conformità alle disposizioni ENAC, EASA e TSA, il trasporto di articoli di {category} è disciplinato con attenzione. Gli oggetti potenzialmente pericolosi o infiammabili sono vietati in cabina, mentre gli articoli sicuri sono liberamente ammessi nel rispetto delle franchigie di peso.`,
    exceptions: `Sono previste eccezioni per farmaci con prescrizione e alimenti per neonati. Se trasportate articoli soggetti a deroga, dichiarateli all'operatore prima del passaggio ai raggi X.`,
    international: `Sulle tratte internazionali, le autorità doganali di destinazione possono applicare restrizioni supplementari all'importazione di articoli appartenenti a {category}.`,
    commonMistakes: `Un errore frequente è dimenticare articoli non ammessi nel bagaglio a mano senza aver controllato prima le specifiche. Verificate sempre la vostra valigia in anticipo.`,
    recommendations: `Custodite con cura gli oggetti delicati con materiali antiurto e tenete a portata di mano gli articoli che potrebbero richiedere ispezione visiva.`,
    faqs: [
      {
        question: `Gli articoli della categoria {category} si possono portare nel bagaglio a mano?`,
        answer: `La maggior parte degli articoli di {category} è consentita in cabina se rispetta le dimensioni ammesse e non include parti pericolose.`
      },
      {
        question: `È possibile imbarcare oggetti di {category} nella valigia in stiva?`,
        answer: `Sì, quasi tutti gli articoli di questa categoria possono viaggiare in stiva, escluse batterie al litio sfuse o sostanze infiammabili.`
      },
      {
        question: `È necessario estrarre gli articoli di {category} ai varchi di sicurezza?`,
        answer: `I dispositivi di dimensioni maggiori o i contenitori di liquidi devono essere estratti e collocati nelle apposite vaschette nei controlli standard.`
      },
      {
        question: `Ci sono limitazioni sulla quantità trasportabile per {category}?`,
        answer: `Si applicano le franchigie di peso del biglietto aereo e le eventuali limitazioni di sicurezza previste dalle norme vigenti.`
      },
      {
        question: `Le regole per {category} variano a seconda della compagnia aerea?`,
        answer: `Le norme di sicurezza sono uniformi a livello legislativo, ma ogni compagnia aerea adotta proprie regole su dimensioni e peso dei bagagli.`
      }
    ]
  },

  ja: {
    introduction: `飛行機への搭乗前に手荷物の持ち込み規則を正確に把握することは、スムーズで快適な旅行のために欠かせません。特に{category}カテゴリに属する物品は、客室への機内持ち込みと貨物室への受託手荷物（預け荷物）で取り扱いが大きく分かれます。本ガイドでは、{category}カテゴリの{count}以上のアイテムについて最新の航空保安規則を分かりやすく解説します。\n\n国内線の短距離フライトから国際線の長距離フライトまで、{category}の持ち込みルールを事前に確認しておくことで、保安検査場でのトラブルや貴重品の放棄・没収を防ぐことができます。`,
    overview: `{category}カテゴリには旅行者が日常的または趣味・業務で携帯する多種多様な品目が含まれます。空港保安検査では、航空機の運航安全に支障を及ぼす危険物がないか厳正に確認されます。`,
    tsaRules: `国土交通省航空局（JCAB）、国際民間航空機関（ICAO）、米国TSA等の基準に基づき、{category}の物品は危険度や性状に応じて分類されます。発火性・引火性のある物品や凶器になり得るものは客室内への持ち込みが厳しく制限されます。`,
    exceptions: `医師の診断・処方を受けた医薬品や乳幼児用食品・ミルクなどについては特例措置が認められています。該当する物品をお持ちの場合は、保安検査開始前に検査員へお申し出ください。`,
    international: `国際線を利用する場合は、航空保安基準に加えて渡航先国の税関・検疫当局による輸入規制が適用されます。国ごとに持ち込みが制限される品目があるため事前確認が必要です。`,
    commonMistakes: `受託手荷物専用の物品を手荷物に入れ忘れたり、容量制限を超えた物品を客室に持ち込もうとして保安検査場で手放さざるを得なくなる事例が多く見られます。`,
    recommendations: `精密・壊れやすい物品は緩衝材等でしっかり保護し、保安検査で目視確認が必要になりやすいアイテムは取り出しやすい位置にパッキングしてください。`,
    faqs: [
      {
        question: `{category}のアイテムは飛行機の機内に持ち込めますか？`,
        answer: `{category}に属する一般的な物品の多くは、危険物や容量制限に該当しない限り機内持ち込み手荷物として携行可能です。`
      },
      {
        question: `{category}のアイテムはスーツケースに入れて受託手荷物として預けられますか？`,
        answer: `はい、ほとんどの物品は受託手荷物として預け入れ可能です。ただし予備のリチウムバッテリー等の危険物は預け入れできません。`
      },
      {
        question: `保安検査場で{category}のアイテムをバッグから取り出す必要はありますか？`,
        answer: `大型電子機器や液体物を含む物品は、従来の2D X線検査レーンでは専用トレイに取り出して検査を受ける必要があります。`
      },
      {
        question: `{category}の物品に個数や重量の制限はありますか？`,
        answer: `航空会社が定める機内持ち込み手荷物のサイズ・重量基準（一般に7kg〜10kg程度）に収める必要があります。`
      },
      {
        question: `航空会社によって{category}のルールは異なりますか？`,
        answer: `基本的な航空安全基準は共通ですが、機内持ち込み可能なサイズや追加手荷物料金の規定は各航空会社によって異なります。`
      }
    ]
  },

  ko: {
    introduction: `공항 보안검색 규정은 안전하고 편리한 항공 여행을 위해 사전에 숙지해야 할 필수 정보입니다. 특히 {category} 카테고리에 속한 물품들은 기내 휴대 수하물과 위탁 수하물 규정이 엄격히 구분됩니다. 본 종합 가이드는 {category} 분류 내 {count}개 이상의 품목에 대한 최신 규정을 상세히 다룹니다.\n\n국내선 단거리 비행부터 장거리 해외여행까지, {category} 품목의 탑승 기준을 미리 파악해 두면 보안검색대 통과 시간을 단축하고 물품 압수나 지연 없이 쾌적하게 여행할 수 있습니다.`,
    overview: `{category} 카테고리는 여행객들이 자주 지참하는 일상용품과 여행 장비를 폭넓게 포함합니다. 공항 보안 요원은 기내 안전을 저해할 수 있는 위해 물품 여부를 철저하게 점검합니다.`,
    tsaRules: `대한민국 국토교통부 항공보안 규정 및 국제 기준(ICAO/TSA)에 따라 {category} 품목은 위험성에 따라 분류됩니다. 화재 위험물이나 위해 도구로 사용될 수 있는 물품은 기내 반입이 엄격히 금지됩니다.`,
    exceptions: `의학적 처방 약품 및 영유아용 이유식 등 필수 물품에 대해서는 예외 규정이 적용될 수 있습니다. 해당 물품 소지 시 검색 시작 전 보안 요원에게 사전 고지해야 합니다.`,
    international: `국제선 탑승 시에는 출발지 공항 보안 규정 외에도 도착지 국가의 세관 및 검역 규정이 복합적으로 적용되므로 입국 기준을 사전에 확인하시기 바랍니다.`,
    commonMistakes: `위탁 수하물 전용 물품을 기내용 가방에 넣어 검색대에서 포기 처리되는 경우가 빈번합니다. 탑승 전 수하물 구분을 명확히 하시기 바랍니다.`,
    recommendations: `파손되기 쉬운 물품은 완충 포장재로 안전하게 보호하고, 별도 판독이 필요할 수 있는 물품은 가방 상단에 배치하세요.`,
    faqs: [
      {
        question: `{category} 물품은 기내 반입이 가능한가요?`,
        answer: `{category}의 일반 품목 대부분은 위해 요소나 용량 초과가 없는 한 기내 휴대 수하물로 반입할 수 있습니다.`
      },
      {
        question: `{category} 물품을 위탁 수하물로 부칠 수 있나요?`,
        answer: `네, 대부분의 {category} 품목은 위탁 수하물로 안전하게 탁송할 수 있으나 여분의 리튬 배터리 등은 제외됩니다.`
      },
      {
        question: `보안검색대 통과 시 {category} 물품을 별도로 꺼내야 하나요?`,
        answer: `대형 전자기기나 액체류 규정에 해당하는 물품은 일반 검색대에서 별도 바구니에 담아 통과시켜야 합니다.`
      },
      {
        question: `{category} 물품에 수량이나 무게 제한이 있나요?`,
        answer: `항공사별 기내 수하물 규격 및 허용 중량(통상 7~10kg)을 준수해야 합니다.`
      },
      {
        question: `항공사별로 {category} 규정에 차이가 있나요?`,
        answer: `항공 보안법상 기준은 동일하지만 기내 반입 가능 가방 크기 및 추가 요금 정책은 항공사마다 다를 수 있습니다.`
      }
    ]
  },

  pt: {
    introduction: `Compreender as normas de segurança nos aeroportos é indispensável ao fazer as malas, especialmente para itens classificados na categoria {category}. De acordo com os órgãos de aviação civil, é essencial saber exatamente o que pode ser levado na cabine e o que deve ser despachado no porão. Este guia completo orienta as condições para mais de {count} itens da categoria {category}.\n\nSeja em um voo doméstico rápido ou em uma viagem internacional de longa distância, conhecer as exigências para {category} previne retenções no controle de segurança, evita a perda de pertences valiosos e garante uma viagem sem contratempos.`,
    overview: `A categoria {category} reúne uma ampla variedade de artigos usados por viajantes. A principal preocupazione dos agentes aeroportuários é assegurar que nenhum item comprometa a integridade da aeronave ou dos passageiros a bordo.`,
    tsaRules: `Sob as diretrizes da ANAC, EASA e TSA, o transporte de artigos de {category} segue parâmetros rigorosos. Itens com risco de incêndio ou ferramentas perfurocortantes são proibidos na cabine de passageiros.`,
    exceptions: `Existem exceções aplicáveis a medicamentos essenciais com receita médica e alimentação para bebês. Caso transporte itens amparados por exceção, declare-os ao agente antes da inspeção de raio-X.`,
    international: `Em viagens internacionais, as alfândegas dos países de destino impõem exigências sanitárias e tributárias próprias para {category}, além das regras gerais de segurança aérea.`,
    commonMistakes: `Um equívoco frequente é guardar artigos restritos no bolso externo da mala de mão sem verificar previamente as regras. Faça uma revisão detalhada antes de sair de casa.`,
    recommendations: `Embale artigos delicados com proteção acolchoada, mantenha itens que exigem conferência à mão e respeite a franquia de peso da sua companhia aérea.`,
    faqs: [
      {
        question: `Posso levar itens da categoria {category} na bagagem de mão?`,
        answer: `A maioria dos itens de {category} é permitida na cabine desde que cumpra os limites de tamanho da companhia e não apresente riscos à segurança.`
      },
      {
        question: `Posso despachar artigos de {category} na mala do porão?`,
        answer: `Sim, grande parte dos artigos de {category} pode ser despachada sem problemas, com exceção de baterias de lítio soltas ou produtos inflamáveis.`
      },
      {
        question: `Preciso retirar os itens de {category} da mala no controle de raio-X?`,
        answer: `Dispositivos eletrônicos volumosos ou embalagens com líquidos devem ser inspecionados em bandejas separadas nos controles tradicionais.`
      },
      {
        question: `Existem limites de quantidade para artigos de {category}?`,
        answer: `Na cabine aplicam-se os limites de peso e volume estipulados pela companhia aérea no seu bilhete.`
      },
      {
        question: `As regras para {category} mudam de acordo com a companhia aérea?`,
        answer: `As exigências de segurança civil são universais, porém cada companhia aérea estabelece franquias de bagagem próprias.`
      }
    ]
  }
};

function fill(template: string, category: string, count: number): string {
  return template.replaceAll('{category}', category).replaceAll('{count}', String(count));
}

/**
 * The locale's category copy with placeholders resolved, or `undefined` when
 * this locale has no translated blocks yet.
 */
export function getCategoryProse(
  categoryLabel: string,
  itemsCount: number,
  lang: Lang,
): CategoryProse | undefined {
  if (lang === 'en') return undefined;
  const p = categoryProse[lang];
  if (!p) return undefined;

  const resolved: CategoryProse = {};
  for (const key of [
    'introduction',
    'overview',
    'tsaRules',
    'exceptions',
    'international',
    'commonMistakes',
    'recommendations',
  ] as const) {
    const template = p[key];
    if (template) resolved[key] = fill(template, categoryLabel, itemsCount);
  }
  if (p.faqs?.length) {
    resolved.faqs = p.faqs.map((f) => ({
      question: fill(f.question, categoryLabel, itemsCount),
      answer: fill(f.answer, categoryLabel, itemsCount),
    }));
  }
  return resolved;
}
