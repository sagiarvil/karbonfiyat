export interface GtipSector {
  id: string;
  name: string;
  gtipCodes: string;
  defaultIntensity: string;
  unit: string;
  riskLevel: "Yüksek" | "Kritik" | "Orta";
  cbamPhase: string;
  description: string;
  searchQueries: string[];
}

export const gtipSectors: GtipSector[] = [
  {
    id: "demir-celik",
    name: "Demir ve Çelik Sanayii",
    gtipCodes: "Fasıl 72, 7301-7311, 7318, 7326",
    defaultIntensity: "1.80 – 2.40 tCO₂e / ton",
    unit: "ton ham çelik / mamul",
    riskLevel: "Kritik",
    cbamPhase: "2026 Ocak İtibarıyla Mali Yükümlülük Başladı",
    description: "Ark ocaklı ve entegre tesislerde kütük, nervürlü inşaat demiri, sac, boru ve profil ihracatında doğrudan ve dolaylı emisyon beyanı zorunludur.",
    searchQueries: [
      "demir çelik skdm maliyeti nasıl hesaplanır",
      "inşaat demiri ihracatı karbon vergisi",
      "72. fasıl çelik karbon sertifika fiyatı"
    ]
  },
  {
    id: "aluminyum",
    name: "Alüminyum ve Alaşımları",
    gtipCodes: "Fasıl 7601 – 7616",
    defaultIntensity: "4.50 – 8.20 tCO₂e / ton (Elektrik Yoğun)",
    unit: "ton birincil / ikincil alüminyum",
    riskLevel: "Kritik",
    cbamPhase: "2026 Kapsamında Maliyet Doğrudan Yansıyor",
    description: "Ekstrüzyon profiller, alüminyum levha ve külçe ihracatında elektrik tüketiminden kaynaklanan dolaylı emisyonlar CBAM maliyetinin %70'inden fazlasını oluşturur.",
    searchQueries: [
      "alüminyum ekstrüzyon skdm emisyon katsayısı",
      "76. fasıl alüminyum karbon maliyeti hesaplama",
      "alüminyum ihracatı ton başına karbon vergisi"
    ]
  },
  {
    id: "cimento",
    name: "Çimento ve Klinker",
    gtipCodes: "2523 10 (Klinker), 2523 21-29 (Portland)",
    defaultIntensity: "0.65 – 0.95 tCO₂e / ton",
    unit: "ton klinker / çimento",
    riskLevel: "Kritik",
    cbamPhase: "Sertifika Alım Zorunluluğu Başlangıcı: 2026",
    description: "Kalsinasyon prosesinden kaynaklanan kaçınılmaz proses emisyonları nedeniyle klinker ve çimento ihracatında ton başına karbon maruziyeti en yüksek sektörlerden biridir.",
    searchQueries: [
      "çimento cbam emisyon katsayısı",
      "klinker ton başına karbon maliyeti kaç tl",
      "2523 çimento ab sınırda karbon vergisi"
    ]
  },
  {
    id: "gubre",
    name: "Gübre ve Azotlu Bileşikler",
    gtipCodes: "Fasıl 3102, 3105, 2808, 2814",
    defaultIntensity: "1.20 – 3.10 tCO₂e / ton",
    unit: "ton amonyak / nitrat gübre",
    riskLevel: "Yüksek",
    cbamPhase: "2026 Öncelikli CBAM Sektörü",
    description: "Amonyak sentezi ve nitrik asit üretiminden kaynaklanan yüksek N₂O ve CO₂ emisyonları, AB'ye ihraç edilen kimyevi gübrelerde ton başına ciddi marj kaybı yaratır.",
    searchQueries: [
      "amonyak gübre skdm sertifika maliyeti",
      "31. fasıl gübre ihracatı karbon vergisi",
      "azotlu gübre gömülü emisyon hesabı"
    ]
  },
  {
    id: "hidrojen",
    name: "Hidrojen Üretimi",
    gtipCodes: "2804 10 00",
    defaultIntensity: "0.00 – 10.50 tCO₂e / ton H₂",
    unit: "ton hidrojen",
    riskLevel: "Orta",
    cbamPhase: "2026 Temiz Enerji & Karbon Rejimi",
    description: "Gri hidrojen (doğalgaz buhar reformasyonu) yüksek karbon maliyetine tabi iken yeşil hidrojen (elektroliz) sıfır CBAM yükümlülüğü avantajı sağlar.",
    searchQueries: [
      "gri hidrojen cbam sertifika bedeli",
      "hidrojen ihracatı karbon maliyeti hesaplama",
      "2804 hidrojen ab sınırda karbon düzenlemesi"
    ]
  },
  {
    id: "elektrik",
    name: "Elektrik Enerjisi İthalatı",
    gtipCodes: "2716 00 00",
    defaultIntensity: "0.35 – 0.60 tCO₂e / MWh",
    unit: "MWh şebeke elektriği",
    riskLevel: "Yüksek",
    cbamPhase: "Doğrudan Sınır Enterkonneksiyon Rejimi",
    description: "AB sınır enterkonneksiyonu üzerinden elektrik ihracatı yapan üreticiler, Türkiye şebeke emisyon faktörü üzerinden sertifika bedeline tabidir.",
    searchQueries: [
      "elektrik ihracatı karbon vergisi mwh",
      "türkiye şebeke emisyon faktörü cbam",
      "2716 elektrik enerjisi ab skdm"
    ]
  }
];
