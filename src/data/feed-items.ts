export interface FeedItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  pubDate: string; // RFC 822 / ISO 8601 uyumlu
}

export const siteMetadata = {
  title: "KarbonFiyat · Karbon Maliyet ve Piyasa İstihbarat Platformu",
  description: "AB SKDM (CBAM), EU ETS ve Türkiye ETS karbon fiyatı, emisyon maliyeti ve kurumsal finansal analiz yayını.",
  siteUrl: "https://karbonfiyat.com",
  author: "KarbonFiyat",
  authorEmail: "iletisim@karbonfiyat.com",
  language: "tr"
};

export const feedItems: FeedItem[] = [
  {
    slug: "",
    title: "Karbon Fiyatı ve Şirket Karbon Maliyeti | KarbonFiyat",
    description: "CBAM, EU ETS ve Türkiye ETS karbon fiyatlarını takip edin. Karbon maliyetinin ürün, marj, müşteri ve satış fiyatına etkisini hesaplayın.",
    category: "Piyasa ve Karar Sistemi",
    pubDate: "2026-09-24T12:00:00Z"
  },
  {
    slug: "/karbon-fiyati",
    title: "Karbon Fiyatı 2026 | Ton Başına Karbon Maliyeti ve CBAM Fiyatı",
    description: "Ton başına karbon fiyatı kaç TL? 2026 AB CBAM resmî sertifika fiyatı, EU ETS borsa kotasyonu ve sektör bazlı karbon maliyetini anında hesaplayın.",
    category: "Fiyat Takibi",
    pubDate: "2026-09-24T11:00:00Z"
  },
  {
    slug: "/cbam-fiyati",
    title: "CBAM Fiyatı 2026 ve SKDM Maliyet Hesaplama | KarbonFiyat",
    description: "2026 AB sınırda karbon vergisi (CBAM) oranları, sertifika fiyatı ve demir-çelik, çimento, alüminyum GTİP bazlı karbon maliyeti hesaplama.",
    category: "CBAM / SKDM",
    pubDate: "2026-09-24T10:30:00Z"
  },
  {
    slug: "/turkiye-ets",
    title: "Türkiye ETS | Karbon Fiyatı ve Maliyet Senaryosu",
    description: "Türkiye Emisyon Ticaret Sistemi gelişmelerini takip edin. Karbon fiyatı senaryolarının şirket maliyeti ve marj etkisini hesaplayın.",
    category: "Ulusal Emisyon Ticareti",
    pubDate: "2026-09-24T10:00:00Z"
  },
  {
    slug: "/karbon-maliyet-hesaplama",
    title: "Karbon Maliyet Hesaplama | Carbon P&L",
    description: "İhracat, emisyon ve karbon fiyatı verileriyle şirketinizin karbon maliyetini, marj etkisini ve gerekli satış fiyatını hesaplayın.",
    category: "Hesaplama Motoru",
    pubDate: "2026-09-24T09:30:00Z"
  },
  {
    slug: "/carbon-pnl",
    title: "Carbon P&L | Karbon Maliyetini Gelir Tablosuna Bağlayın",
    description: "Karbon fiyatının ürün maliyeti, brüt marj, müşteri kârlılığı ve EBITDA üzerindeki etkisini modelleyin.",
    category: "Finansal Modelleme",
    pubDate: "2026-09-24T09:00:00Z"
  },
  {
    slug: "/musteri-karliligi",
    title: "Müşteri Kârlılığı ve Karbon Marj Analizi | KarbonFiyat",
    description: "Karbon maliyetini müşteri ve ürün seviyesine dağıtın. Gerçek marjı ve gerekli fiyat revizyonunu tespit edin.",
    category: "Müşteri Portföyü",
    pubDate: "2026-09-24T08:30:00Z"
  },
  {
    slug: "/carbon-monitor",
    title: "Carbon Monitor Workbench | Anlık Karbon İzleme ve Risk Masası",
    description: "Şirketinizin karbon maliyet maruziyetini, döviz kuru ve sertifika fiyatı dalgalanmalarını gerçek zamanlı izleyin.",
    category: "İzleme Konsolu",
    pubDate: "2026-09-24T08:00:00Z"
  },
  {
    slug: "/workspace",
    title: "Carbon Financial Workspace | CFO & Finans Masası",
    description: "Detaylı senaryo analizleri, tesis emisyon dağılımı ve ihracat finansmanı planlama çalışma alanı.",
    category: "Çalışma Alanı",
    pubDate: "2026-09-24T07:30:00Z"
  },
  {
    slug: "/fiyatlandirma",
    title: "Fiyatlandırma & Kurumsal Çözümler | KarbonFiyat",
    description: "CBAM Ön Maliyet Analizi, Finansal Marj Simülasyonu ve Kurumsal Karbon P&L Sistem kurulum paketleri.",
    category: "Kurumsal Çözümler",
    pubDate: "2026-09-24T07:00:00Z"
  },
  {
    slug: "/metodoloji",
    title: "Metodoloji | KarbonFiyat Veri ve Hesaplama Standardı",
    description: "Her sonuç yeniden üretilebilir olmalı. KarbonFiyat kaynak ayrımı, versiyonlama ve denetlenebilirlik ilkeleri.",
    category: "Standartlar",
    pubDate: "2026-09-24T06:30:00Z"
  },
  {
    slug: "/hakkimizda",
    title: "Hakkımızda | KarbonFiyat",
    description: "KarbonFiyat’ın amacı, metodoloji yaklaşımı ve karbon maliyetini finansal karara dönüştüren yayıncı kimliği hakkında bilgi.",
    category: "Kurumsal",
    pubDate: "2026-09-24T06:00:00Z"
  },
  {
    slug: "/iletisim",
    title: "İletişim | KarbonFiyat",
    description: "KarbonFiyat ön analiz, veri ve metodoloji soruları için kurumsal iletişim kanalları.",
    category: "İletişim",
    pubDate: "2026-09-24T05:30:00Z"
  },
  {
    slug: "/gizlilik",
    title: "Gizlilik ve Veri İşleme | KarbonFiyat",
    description: "KarbonFiyat hesaplama araçları ve başvuru formunda hangi verilerin işlendiğini ve hangi amaçlarla kullanıldığını açıklayan gizlilik sayfası.",
    category: "Yasal",
    pubDate: "2026-09-24T05:00:00Z"
  }
];
