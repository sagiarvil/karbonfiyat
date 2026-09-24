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
    title: "Karbon Fiyatı 2026 | Ton Başına Karbon Maliyeti ve CBAM Fiyatı",
    description: "Ton başına karbon fiyatı kaç TL? 2026 AB CBAM resmî sertifika fiyatı, EU ETS borsa kotasyonu ve sektör bazlı karbon maliyetini anında hesaplayın.",
    canonical: "/karbon-fiyati"
  },
  cbamFiyati: {
    title: "CBAM Fiyatı 2026 ve SKDM Maliyet Hesaplama | KarbonFiyat",
    description: "2026 AB sınırda karbon vergisi (CBAM) oranları, sertifika fiyatı ve demir-çelik, çimento, alüminyum GTİP bazlı karbon maliyeti hesaplama.",
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
  },
  hakkimizda: {
    title: "Hakkımızda | KarbonFiyat",
    description: "KarbonFiyat’ın amacı, metodoloji yaklaşımı ve karbon maliyetini finansal karara dönüştüren yayıncı kimliği hakkında bilgi.",
    canonical: "/hakkimizda"
  },
  iletisim: {
    title: "İletişim | KarbonFiyat",
    description: "KarbonFiyat ön analiz, veri ve metodoloji soruları için kurumsal iletişim kanalları.",
    canonical: "/iletisim"
  },
  gizlilik: {
    title: "Gizlilik ve Veri İşleme | KarbonFiyat",
    description: "KarbonFiyat hesaplama araçları ve başvuru formunda hangi verilerin işlendiğini ve hangi amaçlarla kullanıldığını açıklayan gizlilik sayfası.",
    canonical: "/gizlilik"
  }
};
