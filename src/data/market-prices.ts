export interface MarketPrice {
  id: string;
  name: string;
  badge: string;
  status: "official" | "market" | "pilot" | "scenario";
  price: string;
  isFormed: boolean;
  period: string;
  source: string;
  verifiedAt: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export const marketPrices: MarketPrice[] = [
  {
    id: "cbam",
    name: "CBAM",
    badge: "RESMÎ",
    status: "official",
    price: "€75,28",
    isFormed: true,
    period: "2026 Q2",
    source: "Avrupa Komisyonu",
    verifiedAt: "2026-09-15",
    description: "Avrupa Komisyonu resmî çeyreklik sertifika fiyatı.",
    ctaText: "CBAM fiyatını incele",
    ctaHref: "/cbam-fiyati"
  },
  {
    id: "eu-ets",
    name: "EU ETS",
    badge: "PİYASA VERİSİ",
    status: "market",
    price: "Lisanslı piyasa verisi entegrasyonu hazırlanıyor.",
    isFormed: false,
    period: "Gerçek zamanlı kotasyon",
    source: "Lisanslı piyasa feed\x27i",
    verifiedAt: "Sürekli güncellenen feed",
    description: "EEX spot ve vadeli EUA kontratları piyasa verisi.",
    ctaText: "Piyasa görünümü",
    ctaHref: "/karbon-fiyati"
  },
  {
    id: "tr-ets",
    name: "TÜRKİYE ETS",
    badge: "PİLOT DÖNEM",
    status: "pilot",
    price: "Henüz piyasa fiyatı oluşmadı.",
    isFormed: false,
    period: "Hazırlık dönemi",
    source: "Resmî pilot çerçevesi",
    verifiedAt: "İklim Değişikliği Başkanlığı",
    description: "Resmî fiyat oluşana kadar senaryo fiyatı ile modelleme yapılabilir.",
    ctaText: "Türkiye ETS görünümü",
    ctaHref: "/turkiye-ets"
  }
];
