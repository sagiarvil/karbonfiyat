/**
 * Motor 04: Sürekli Karbon Fiyat Delta & Risk İzleme Motoru
 * AB CBAM borsa kotasyonlarındaki haftalık/aylık değişimleri (deltaları)
 * şirket bütçesi ve nakit akışındaki anlık risk sapmasına çevirir.
 */

export interface MonitorInput {
  annualVolumeTon: number;
  emissionFactor: number; // tCO2e / ton
  basePriceEur: number;   // Mevcut resmî gösterge: €75,28
  simulatedMarketPriceEur: number; // Örn: €85, €95, €110
  annualSalesRevenueEur: number;
  alarmThresholdEur?: number; // Alarm tetikleme tutarı (varsayılan: €50.000)
}

export interface DeltaMonitorResult {
  basePriceEur: number;
  simulatedPriceEur: number;
  deltaPriceEur: number; // Fiyat farkı
  deltaPricePct: number; // Yüzde artış
  
  // Parasal Deltalar
  annualBaseCostEur: number;
  annualSimulatedCostEur: number;
  annualCostDeltaEur: number; // Yıllık ek bütçe sapması
  weeklyCostDeltaEur: number; // Haftalık nakit akışı erimesi (52 hafta)
  monthlyCostDeltaEur: number;// Aylık nakit akışı erimesi (12 ay)
  
  // Marj & Fiyatlama Etkisi
  marginErosionPoints: number; // Ek marj kaybı puanı
  protectivePriceSurchargeEurPerTon: number; // Teklife eklenmesi gereken dinamik karbon zammı
  
  // Alarm & Risk Durumu
  isAlarmTriggered: boolean;
  alertLevel: "NORMAL" | "ELEVATED" | "CRITICAL";
  alertMessage: string;
}

export function computeDeltaMonitor(input: MonitorInput): DeltaMonitorResult {
  const vol = Math.max(1, input.annualVolumeTon);
  const factor = Math.max(0.1, input.emissionFactor);
  const basePrice = Math.max(0, input.basePriceEur);
  const simPrice = Math.max(0, input.simulatedMarketPriceEur);
  const rev = Math.max(1, input.annualSalesRevenueEur);
  const threshold = input.alarmThresholdEur || 50000;

  const deltaPriceEur = simPrice - basePrice;
  const deltaPricePct = basePrice > 0 ? (deltaPriceEur / basePrice) * 100 : 0;

  const annualBaseCostEur = vol * factor * basePrice;
  const annualSimulatedCostEur = vol * factor * simPrice;
  const annualCostDeltaEur = annualSimulatedCostEur - annualBaseCostEur;

  const weeklyCostDeltaEur = annualCostDeltaEur / 52;
  const monthlyCostDeltaEur = annualCostDeltaEur / 12;

  const marginErosionPoints = (annualCostDeltaEur / rev) * 100;
  const protectivePriceSurchargeEurPerTon = factor * deltaPriceEur;

  const isAlarmTriggered = annualCostDeltaEur >= threshold;

  let alertLevel: DeltaMonitorResult["alertLevel"] = "NORMAL";
  let alertMessage = "Fiyat deltası güvenli bütçe toleransı içinde.";

  if (annualCostDeltaEur > threshold * 2 || deltaPricePct > 25) {
    alertLevel = "CRITICAL";
    alertMessage = `KRİTİK BÜTÇE SAPMASI: Karbon fiyatındaki +€${deltaPriceEur.toFixed(2)} artış, yıllık net kârınızdan €${Math.round(annualCostDeltaEur).toLocaleString("tr-TR")} eksiltmektedir. Açık tekliflerinizi derhal güncelleyin!`;
  } else if (isAlarmTriggered || deltaPricePct > 10) {
    alertLevel = "ELEVATED";
    alertMessage = `DİKKAT (EŞİK AŞILDI): Yıllık maruziyet bütçesi +€${Math.round(annualCostDeltaEur).toLocaleString("tr-TR")} sapma gösterdi. Haftalık nakit rezervinizi +€${Math.round(weeklyCostDeltaEur).toLocaleString("tr-TR")} artırın.`;
  }

  return {
    basePriceEur: basePrice,
    simulatedPriceEur: simPrice,
    deltaPriceEur,
    deltaPricePct,
    annualBaseCostEur,
    annualSimulatedCostEur,
    annualCostDeltaEur,
    weeklyCostDeltaEur,
    monthlyCostDeltaEur,
    marginErosionPoints,
    protectivePriceSurchargeEurPerTon,
    isAlarmTriggered,
    alertLevel,
    alertMessage
  };
}
