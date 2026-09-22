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
    price: "€75,28 / tCO₂",
    isFormed: true,
    period: "2026 Q2",
    source: "Avrupa Komisyonu",
    verifiedAt: "2026-09-22",
    description: "Avrupa Komisyonu resmî 2026 Q2 CBAM sertifika fiyatı. Q3 fiyatının yayın tarihi 5 Ekim 2026.",
    ctaText: "CBAM fiyatını incele",
    ctaHref: "/cbam-fiyati"
  },
  {
    id: "eu-ets",
    name: "EU ETS · EUA",
    badge: "PİYASA VERİSİ",
    status: "market",
    price: "Canlı piyasa ekranı aktif",
    isFormed: true,
    period: "ICE Endex EUA Futures · ECF1!",
    source: "TradingView / ICE Endex",
    verifiedAt: "Widget canlı veri akışı",
    description: "EUA vadeli piyasa görünümü. Veri seviyesi ve olası gecikme sağlayıcı veri koşullarına tabidir.",
    ctaText: "Canlı piyasa ekranı",
    ctaHref: "/karbon-fiyati#canli-karbon-fiyatlari"
  },
  {
    id: "tr-ets",
    name: "TÜRKİYE ETS",
    badge: "PİLOT DÖNEM",
    status: "pilot",
    price: "Henüz resmî piyasa fiyatı oluşmadı.",
    isFormed: false,
    period: "Pilot / hazırlık dönemi",
    source: "Resmî Türkiye ETS gelişmeleri",
    verifiedAt: "2026-09-22",
    description: "Resmî fiyat oluşana kadar yalnızca açıkça etiketlenmiş senaryo fiyatları ile modelleme yapılır.",
    ctaText: "Türkiye ETS görünümü",
    ctaHref: "/turkiye-ets"
  }
];
