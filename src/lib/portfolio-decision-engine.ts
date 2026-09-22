/**
 * Motor 03: Çoklu Müşteri Portföyü & Mahsup Senaryo Karar Motoru
 * CFO ve Yönetim Kurulu için müşteri sözleşmelerindeki marj erimesini
 * ve Türkiye ETS Madde 9 mahsup senaryolarını modeller.
 */

export interface CustomerContract {
  id: string;
  clientName: string;
  country: string;
  volumeTon: number;
  contractPriceEurPerTon: number;
  costEurPerTon: number;
  emissionFactor: number; // tCO2e / ton
}

export interface CustomerEvaluation {
  id: string;
  clientName: string;
  country: string;
  volumeTon: number;
  annualRevenueEur: number;
  grossCarbonCostEur: number;
  netCarbonCostEur: number; // Mahsup sonrası
  marginBeforeCarbonPct: number;
  marginAfterCarbonPct: number;
  marginDeltaPoints: number;
  profitLossEur: number;
  requiredPriceRevisionPct: number;
  riskStatus: "HEALTHY" | "REVISION_REQUIRED" | "CRITICAL_LOSS";
  riskLabel: string;
  actionRecommendation: string;
}

export interface PortfolioDecisionOutput {
  totalVolumeTon: number;
  totalRevenueEur: number;
  totalGrossCarbonCostEur: number;
  totalNetCarbonCostEur: number;
  offsetPercentage: number; // %0 - %100
  portfolioMarginBeforePct: number;
  portfolioMarginAfterPct: number;
  portfolioMarginLossPoints: number;
  criticalClientCount: number;
  evaluations: CustomerEvaluation[];
  executiveTakeaway: string;
}

export const DEFAULT_SAMPLE_PORTFOLIO: CustomerContract[] = [
  { id: "c1", clientName: "ABC Stahl GmbH", country: "Almanya", volumeTon: 5000, contractPriceEurPerTon: 860, costEurPerTon: 620, emissionFactor: 1.84 },
  { id: "c2", clientName: "DEF Metalli SpA", country: "İtalya", volumeTon: 3500, contractPriceEurPerTon: 830, costEurPerTon: 610, emissionFactor: 1.84 },
  { id: "c3", clientName: "XYZ Construct BV", country: "Hollanda", volumeTon: 1500, contractPriceEurPerTon: 790, costEurPerTon: 640, emissionFactor: 1.84 }
];

export function evaluatePortfolio(
  contracts: CustomerContract[],
  cbamPriceEur: number = 75.28,
  offsetPct: number = 0 // TR-ETS mahsup oranı (%0 - %100)
): PortfolioDecisionOutput {
  const validOffset = Math.min(100, Math.max(0, offsetPct)) / 100;
  let totalVol = 0;
  let totalRev = 0;
  let totalBaseProfit = 0;
  let totalGrossCarbon = 0;
  let totalNetCarbon = 0;
  let criticalCount = 0;

  const evaluations: CustomerEvaluation[] = contracts.map(c => {
    const rev = c.volumeTon * c.contractPriceEurPerTon;
    const baseProfit = rev - (c.volumeTon * c.costEurPerTon);
    const grossCarbon = c.volumeTon * c.emissionFactor * cbamPriceEur;
    const netCarbon = grossCarbon * (1 - validOffset);

    const marginBefore = (baseProfit / rev) * 100;
    const profitAfter = baseProfit - netCarbon;
    const marginAfter = (profitAfter / rev) * 100;
    const deltaPoints = marginBefore - marginAfter;

    const reqRevPct = (netCarbon / rev) * 100;

    let riskStatus: CustomerEvaluation["riskStatus"] = "HEALTHY";
    let riskLabel = "KORUNABİLİR";
    let actionRecommendation = "Marj sağlıklı; mevcut sözleşme şartları sürdürülebilir.";

    if (marginAfter < 5) {
      riskStatus = "CRITICAL_LOSS";
      riskLabel = "ZARAR / RİSKLİ";
      actionRecommendation = `Acil sözleşme revizyonu şart (+%${reqRevPct.toFixed(1)} zam veya sevkiyat durdurma).`;
      criticalCount++;
    } else if (marginAfter < 14) {
      riskStatus = "REVISION_REQUIRED";
      riskLabel = "REVİZYON ŞART";
      actionRecommendation = `Vade yenilemesinde +€${(netCarbon / c.volumeTon).toFixed(0)}/t fiyat geçişi hedeflenmeli.`;
    }

    totalVol += c.volumeTon;
    totalRev += rev;
    totalBaseProfit += baseProfit;
    totalGrossCarbon += grossCarbon;
    totalNetCarbon += netCarbon;

    return {
      id: c.id,
      clientName: c.clientName,
      country: c.country,
      volumeTon: c.volumeTon,
      annualRevenueEur: rev,
      grossCarbonCostEur: grossCarbon,
      netCarbonCostEur: netCarbon,
      marginBeforeCarbonPct: marginBefore,
      marginAfterCarbonPct: marginAfter,
      marginDeltaPoints: deltaPoints,
      profitLossEur: profitAfter,
      requiredPriceRevisionPct: reqRevPct,
      riskStatus,
      riskLabel,
      actionRecommendation
    };
  });

  const portfolioMarginBefore = totalRev > 0 ? (totalBaseProfit / totalRev) * 100 : 0;
  const portfolioMarginAfter = totalRev > 0 ? ((totalBaseProfit - totalNetCarbon) / totalRev) * 100 : 0;
  const portfolioMarginLossPoints = portfolioMarginBefore - portfolioMarginAfter;

  const takeaway = criticalCount > 0
    ? `Portföyünüzdeki ${contracts.length} müşteriden ${criticalCount} tanesi karbon maliyeti sonrası kritik zarar bölgesindedir. %${offsetPct} mahsup senaryosunda dahi bu sözleşmeler kârınızı eritmektedir.`
    : `Tüm müşteri sözleşmeleriniz pozitif kârlılıkta kalmaktadır; ortalama marj erimesi ${portfolioMarginLossPoints.toFixed(1)} puandır.`;

  return {
    totalVolumeTon: totalVol,
    totalRevenueEur: totalRev,
    totalGrossCarbonCostEur: totalGrossCarbon,
    totalNetCarbonCostEur: totalNetCarbon,
    offsetPercentage: offsetPct,
    portfolioMarginBeforePct: portfolioMarginBefore,
    portfolioMarginAfterPct: portfolioMarginAfter,
    portfolioMarginLossPoints,
    criticalClientCount: criticalCount,
    evaluations,
    executiveTakeaway: takeaway
  };
}
