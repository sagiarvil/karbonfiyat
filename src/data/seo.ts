export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
}

export const seoPages: Record<string, SeoMeta> = {
  home: {
    title: "Karbon Fiyatı ve Şirket Karbon Maliyeti | KarbonFiyat",
    description: "CBAM, EU ETS ve Türkiye ETS karbon fiyatlarını takip edin. Karbon maliyetinin ürün, marj, müşteri ve satış fiyatına etkisini hesaplayın.",
    canonical: "/"
  },
  karbonFiyati: {
    title: "Karbon Fiyatı 2026 | CBAM, EU ETS ve Türkiye ETS",
    description: "Güncel karbon fiyatlarını, CBAM sertifika fiyatını, EU ETS piyasa verisini ve Türkiye ETS gelişmelerini karşılaştırın.",
    canonical: "/karbon-fiyati"
  },
  cbamFiyati: {
    title: "CBAM Fiyatı ve Karbon Maliyeti Hesaplama | KarbonFiyat",
    description: "Resmî CBAM sertifika fiyatını görün ve şirketinizin ürün bazlı karbon maliyetini hesaplayın.",
    canonical: "/cbam-fiyati"
  },
  turkiyeEts: {
    title: "Türkiye ETS | Karbon Fiyatı ve Maliyet Senaryosu",
    description: "Türkiye Emisyon Ticaret Sistemi gelişmelerini takip edin. Karbon fiyatı senaryolarının şirket maliyeti ve marj etkisini hesaplayın.",
    canonical: "/turkiye-ets"
  },
  karbonMaliyetHesaplama: {
    title: "Karbon Maliyet Hesaplama | Carbon P&L",
    description: "İhracat, emisyon ve karbon fiyatı verileriyle şirketinizin karbon maliyetini, marj etkisini ve gerekli satış fiyatını hesaplayın.",
    canonical: "/karbon-maliyet-hesaplama"
  },
  carbonPnl: {
    title: "Carbon P&L | Karbon Maliyetini Gelir Tablosuna Bağlayın | KarbonFiyat",
    description: "Karbon fiyatının ürün maliyeti, brüt marj, müşteri kârlılığı ve EBITDA üzerindeki etkisini modelleyin.",
    canonical: "/carbon-pnl"
  },
  musteriKarliligi: {
    title: "Müşteri Kârlılığı ve Karbon Marj Analizi | KarbonFiyat",
    description: "Karbon maliyetini müşteri ve ürün seviyesine dağıtın. Gerçek marjı ve gerekli fiyat revizyonunu tespit edin.",
    canonical: "/musteri-karliligi"
  },
  metodoloji: {
    title: "Metodoloji | KarbonFiyat Veri ve Hesaplama Standardı",
    description: "Her sonuç yeniden üretilebilir olmalı. KarbonFiyat kaynak ayrımı, versiyonlama ve denetlenebilirlik ilkeleri.",
    canonical: "/metodoloji"
  }
};
