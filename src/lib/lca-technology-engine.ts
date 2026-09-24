/**
 * KarbonFiyat LCA & Üretim Teknolojisi Karbon Katsayıları Motoru
 * (Steel_CBAM ve AB CBAM Benchmark Standartları Referans Alınmıştır)
 */

export interface TechnologyRoute {
  id: string;
  name: string;
  sector: "steel" | "aluminum" | "cement" | "fertilizer";
  scope1Factor: number; // tCO2e / ton ürün
  scope2Factor: number; // tCO2e / ton ürün
  totalFactor: number;
  euBenchmark: number; // AB Benchmark değeri (tCO2e / ton)
  description: string;
}

export const TECHNOLOGY_ROUTES: Record<string, TechnologyRoute> = {
  // Demir - Çelik Rotaları
  "steel-eaf-scrap": {
    id: "steel-eaf-scrap",
    name: "Elektrikli Ark Ocağı (EAF) - %100 Hurda",
    sector: "steel",
    scope1Factor: 0.35,
    scope2Factor: 0.38,
    totalFactor: 0.73,
    euBenchmark: 1.328, // Ham çelik AB ortalama referansı
    description: "Yüksek oranda geri dönüştürülmüş çelik hurdası kullanan, düşük doğrudan emisyona sahip Türk çelik sektörü baskın teknolojisi."
  },
  "steel-bf-bof": {
    id: "steel-bf-bof",
    name: "Yüksek Fırın - Bazik Oksijen Fırını (BF-BOF)",
    sector: "steel",
    scope1Factor: 1.85,
    scope2Factor: 0.35,
    totalFactor: 2.20,
    euBenchmark: 1.328,
    description: "Cevherden üretim yapan entegre demir-çelik tesisleri. Kok ve kömür tüketimi nedeniyle yüksek Kapsam 1 maruziyeti içerir."
  },
  "steel-dri-eaf": {
    id: "steel-dri-eaf",
    name: "Doğrudan İndirgeme (DRI / HBI) + EAF (Doğal Gazlı)",
    sector: "steel",
    scope1Factor: 0.95,
    scope2Factor: 0.40,
    totalFactor: 1.35,
    euBenchmark: 1.328,
    description: "Doğal gaz bazlı doğrudan indirgenmiş demir kullanımı ile geleneksel yüksek fırına göre %40 daha düşük karbon yoğunluğu."
  },

  // Alüminyum Rotaları
  "aluminum-secondary": {
    id: "aluminum-secondary",
    name: "İkincil Alüminyum (Geri Dönüşüm / Ergitme)",
    sector: "aluminum",
    scope1Factor: 0.45,
    scope2Factor: 0.25,
    totalFactor: 0.70,
    euBenchmark: 1.484,
    description: "Hurda alüminyumun yeniden ergitilmesiyle üretilen, birincil üretime göre %90 enerji ve emisyon tasarruflu teknoloji."
  },
  "aluminum-primary-grid": {
    id: "aluminum-primary-grid",
    name: "Birincil Alüminyum Elektroliz (Şebeke Elektriği)",
    sector: "aluminum",
    scope1Factor: 2.10,
    scope2Factor: 5.80,
    totalFactor: 7.90,
    euBenchmark: 1.484,
    description: "Boksitten alümina elektrolizi. Yüksek elektrik tüketimi nedeniyle şebeke emisyon faktörüne doğrudan bağımlıdır."
  },

  // Çimento Rotaları
  "cement-dry-high-clinker": {
    id: "cement-dry-high-clinker",
    name: "Kuru Sistem Fırın (Yüksek Klinker Oranı - CEM I)",
    sector: "cement",
    scope1Factor: 0.78,
    scope2Factor: 0.08,
    totalFactor: 0.86,
    euBenchmark: 0.693,
    description: "Kalsinasyon prosesi ve kalsiyum karbonat ayrışması kaynaklı doğrudan proses emisyonu yoğun portland çimentosu."
  },
  "cement-composite-blended": {
    id: "cement-composite-blended",
    name: "Katkılı Çimento (Uçucu Kül / Cüruf İkameli - CEM II/III)",
    sector: "cement",
    scope1Factor: 0.52,
    scope2Factor: 0.07,
    totalFactor: 0.59,
    euBenchmark: 0.693,
    description: "Klinker oranı cüruf ve puzolan ile düşürülmüş, AB benchmark değerinin altında kalan düşük karbonlu çimento."
  }
};

export interface TechnologyComparisonResult {
  route: TechnologyRoute;
  volumeTons: number;
  totalEmissionsTCO2e: number;
  benchmarkDifferencePercentage: number;
  isCompliantWithBenchmark: boolean;
  statusText: string;
}

export function evaluateTechnologyRoute(
  routeId: string,
  volumeTons: number
): TechnologyComparisonResult {
  const route = TECHNOLOGY_ROUTES[routeId] || TECHNOLOGY_ROUTES["steel-eaf-scrap"];
  const totalEmissionsTCO2e = Number((route.totalFactor * volumeTons).toFixed(2));
  const diffPercent = Number((((route.totalFactor - route.euBenchmark) / route.euBenchmark) * 100).toFixed(1));
  const isCompliant = route.totalFactor <= route.euBenchmark;

  return {
    route,
    volumeTons,
    totalEmissionsTCO2e,
    benchmarkDifferencePercentage: diffPercent,
    isCompliantWithBenchmark: isCompliant,
    statusText: isCompliant
      ? `AB Referans Değerinin Altında (%${Math.abs(diffPercent)} Avantajlı)`
      : `AB Referans Değerinin Üzerinde (%${diffPercent} Ceza Riski)`
  };
}
