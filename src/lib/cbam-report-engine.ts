/**
 * Motor 02: Endüstriyel CBAM Ön Analiz Rapor Motoru
 * AB Tüzüğü (EU 2023/956) uyarınca GTIP, Scope 1 (Doğrudan) ve Scope 2 (Dolaylı)
 * emisyonlarını hesaplayarak kurumsal finansal rapor çıktısı üretir.
 */

export interface GtipDefinition {
  gtipCode: string;
  name: string;
  sector: "steel" | "aluminum" | "cement" | "fertilizer";
  defaultScope1: number; // tCO2e / ton
  defaultScope2: number; // tCO2e / ton
  benchmarkEur: number;
}

/**
 * Referans profiller yalnızca demo/modelleme başlangıç değerleridir.
 * Resmî veya mevzuatça kabul edilmiş default value olarak kullanılmamalıdır.
 * Ücretli analizde doğrulanmış tesis/ürün emisyon verisi ile değiştirilmelidir.
 */
export const REFERENCE_GTIP_PROFILES: GtipDefinition[] = [
  { gtipCode: "7208", name: "Demir & Çelik: Sıcak Haddelenmiş Yassı Mamul", sector: "steel", defaultScope1: 1.45, defaultScope2: 0.39, benchmarkEur: 75.28 },
  { gtipCode: "7214", name: "Demir & Çelik: İnşaat Demiri ve Çubuklar", sector: "steel", defaultScope1: 1.62, defaultScope2: 0.42, benchmarkEur: 75.28 },
  { gtipCode: "7601", name: "Alüminyum: İşlenmemiş Külçe / Alaşım", sector: "aluminum", defaultScope1: 2.10, defaultScope2: 2.10, benchmarkEur: 75.28 },
  { gtipCode: "7604", name: "Alüminyum: Ekstrüzyon Profiller & Çubuklar", sector: "aluminum", defaultScope1: 1.85, defaultScope2: 1.35, benchmarkEur: 75.28 },
  { gtipCode: "2523", name: "Çimento: Portland Klinkeri & Çimento", sector: "cement", defaultScope1: 0.58, defaultScope2: 0.07, benchmarkEur: 75.28 },
  { gtipCode: "3102", name: "Gübre: Amonyum Nitrat & Azotlu Gübreler", sector: "fertilizer", defaultScope1: 1.80, defaultScope2: 0.30, benchmarkEur: 75.28 }
];

export interface ReportInput {
  companyName: string;
  gtipCode: string;
  annualVolumeTon: number;
  salesPriceEur: number;
  productionCostEur: number;
  customScope1?: number;
  customScope2?: number;
  cbamPriceEur?: number;
}

export interface ExecutiveReportData {
  reportId: string;
  generatedAt: string;
  companyName: string;
  gtipCode: string;
  gtipName: string;
  annualVolumeTon: number;
  totalSpecificEmission: number; // tCO2e / ton
  scope1: number;
  scope2: number;
  cbamPriceEur: number;
  
  // Parasal Sonuçlar
  grossCarbonExposureEur: number;
  carbonCostPerTonEur: number;
  currentRevenueEur: number;
  currentGrossProfitEur: number;
  currentGrossMarginPct: number;
  adjustedGrossProfitEur: number;
  adjustedGrossMarginPct: number;
  marginLossPointsPct: number;
  profitErosionPct: number;
  protectiveSellingPriceEur: number;
  requiredPriceRevisionPct: number;
  carbonBreakevenPriceEur: number;
  
  // Regülasyon Notu
  regulatoryStatus: string;
  complianceDeadline: string;
}

export function generateExecutiveReport(input: ReportInput): ExecutiveReportData {
  const gtip = REFERENCE_GTIP_PROFILES.find(g => g.gtipCode === input.gtipCode) || REFERENCE_GTIP_PROFILES[0];
  const s1 = input.customScope1 !== undefined ? Math.max(0, input.customScope1) : gtip.defaultScope1;
  const s2 = input.customScope2 !== undefined ? Math.max(0, input.customScope2) : gtip.defaultScope2;
  const totalSpecificEmission = s1 + s2;
  const cbamPrice = input.cbamPriceEur || gtip.benchmarkEur;
  const vol = Math.max(1, input.annualVolumeTon);
  const salesPrice = Math.max(1, input.salesPriceEur);
  const prodCost = Math.max(0, input.productionCostEur);

  // Maruziyet hesaplamaları
  const carbonCostPerTonEur = totalSpecificEmission * cbamPrice;
  const grossCarbonExposureEur = vol * carbonCostPerTonEur;

  // Finansal Marj Analizi
  const currentRevenueEur = vol * salesPrice;
  const currentGrossProfitEur = currentRevenueEur - (vol * prodCost);
  const currentGrossMarginPct = (currentGrossProfitEur / currentRevenueEur) * 100;

  const totalCostWithCarbonPerTon = prodCost + carbonCostPerTonEur;
  const adjustedGrossProfitEur = currentRevenueEur - (vol * totalCostWithCarbonPerTon);
  const adjustedGrossMarginPct = (adjustedGrossProfitEur / currentRevenueEur) * 100;
  const marginLossPointsPct = currentGrossMarginPct - adjustedGrossMarginPct;
  const profitErosionPct = currentGrossProfitEur > 0 
    ? ((currentGrossProfitEur - adjustedGrossProfitEur) / currentGrossProfitEur) * 100 
    : 100;

  // Koruyucu Fiyat Revizyonu
  const protectiveSellingPriceEur = salesPrice + carbonCostPerTonEur;
  const requiredPriceRevisionPct = (carbonCostPerTonEur / salesPrice) * 100;

  // Ürünü kârdan zarara geçiren karbon eşiği
  const unitMarginBeforeCarbon = salesPrice - prodCost;
  const carbonBreakevenPriceEur = totalSpecificEmission > 0 ? unitMarginBeforeCarbon / totalSpecificEmission : 0;

  const reportId = "KF-RPT-" + Date.now().toString(36).toUpperCase();
  const dateStr = new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" });

  return {
    reportId,
    generatedAt: dateStr,
    companyName: input.companyName || "Kurumsal İhracatçı Firma",
    gtipCode: gtip.gtipCode,
    gtipName: gtip.name,
    annualVolumeTon: vol,
    totalSpecificEmission,
    scope1: s1,
    scope2: s2,
    cbamPriceEur: cbamPrice,
    grossCarbonExposureEur,
    carbonCostPerTonEur,
    currentRevenueEur,
    currentGrossProfitEur,
    currentGrossMarginPct,
    adjustedGrossProfitEur,
    adjustedGrossMarginPct,
    marginLossPointsPct,
    profitErosionPct,
    protectiveSellingPriceEur,
    requiredPriceRevisionPct,
    carbonBreakevenPriceEur,
    regulatoryStatus: "2026 Mali Dönemi Yürürlükte (EU 2023/956)",
    complianceDeadline: "30 Eylül 2027 (İlk Resmî Yıllık Beyan)"
  };
}
