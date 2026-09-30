export interface MegaSubItem {
  label: string;
  href: string;
  badge?: string;
  desc?: string;
  icon?: string;
}

export interface MegaColumn {
  title: string;
  desc?: string;
  items: MegaSubItem[];
}

export interface MegaMenuData {
  columns: MegaColumn[];
  featured?: {
    badge: string;
    title: string;
    desc: string;
    href: string;
    cta: string;
  };
}

export interface NavDropdownItem {
  label: string;
  href: string;
  badge?: string;
  desc?: string;
  external?: boolean;
}

export interface NavItem {
  label: string;
  href?: string;
  badge?: string;
  items?: NavDropdownItem[];
  megaMenu?: MegaMenuData;
}

export interface NavLink {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  {
    label: "Karbon Fiyatı",
    href: "/karbon-fiyati"
  },
  {
    label: "CBAM",
    href: "/cbam-fiyati"
  },
  {
    label: "Türkiye ETS",
    href: "/turkiye-ets"
  },
  {
    label: "Terminaller & Motorlar",
    badge: "Terminal V3",
    megaMenu: {
      columns: [
        {
          title: "Finansal Karar Motorları",
          desc: "Şirket bilançosunu, ürün maliyetini ve brüt marj kaybını koruyan kurumsal analizler",
          items: [
            { label: "Kurumsal Workspace", href: "/workspace", badge: "Aktif", desc: "Portföy senaryo, mahsup simülasyonu ve bilanço stres testi", icon: "terminal" },
            { label: "Carbon Monitor 7/24", href: "/carbon-monitor", badge: "Canlı", desc: "EUA, CBAM ve TR-ETS anlık piyasa fiyat akışı ve volatilite", icon: "activity" },
            { label: "Carbon P&L Marj Etkisi", href: "/carbon-pnl", desc: "Ürün bazında birim emisyon maliyeti ve koruyucu fiyat revizyonu", icon: "trending-up" },
            { label: "Müşteri Portföy Kârlılığı", href: "/musteri-karliligi", desc: "AB alıcı bazında karbon maliyet paylaşımı ve marj optimizasyonu", icon: "users" }
          ]
        },
        {
          title: "Yasal Uyum & Raporlama",
          desc: "AB Komisyonu onaylı XML altyapısı ve resmi metodoloji doğrulama",
          items: [
            { label: "Resmî SKDM Raporu ↗", href: "https://skdmhesapla.com/", badge: "Resmî XML", desc: "AB Komisyonu Transition Registry uyumlu resmi beyanname", icon: "file-check" },
            { label: "Karbon Maliyet Hesaplama", href: "/karbon-maliyet-hesaplama", desc: "Demir-çelik, alüminyum, çimento sektörlerine özel hızlı hesaplayıcı", icon: "calculator" },
            { label: "LCA & Emisyon Katsayıları", href: "/metodoloji#lca", badge: "ISO 14064", desc: "Varsayılan değerler yerine doğrulanmış birincil fabrika verisi", icon: "layers" },
            { label: "Yasal Takvim & Direktifler", href: "/#mevzuat", desc: "2026 mali yükümlülük takvimi ve ceza muafiyet protokolü", icon: "shield" }
          ]
        }
      ],
      featured: {
        badge: "ÖN MALİYET ANALİZİ",
        title: "4.900 TL CBAM & ETS Raporu",
        desc: "Yönetim kurulu seviyesinde net marj kaybı, fiyat revizyon katsayısı ve aksiyon haritası sunan hızlı analiz.",
        href: "/#basvuru",
        cta: "Ön Analiz Başvurusu Yap ↗"
      }
    }
  },
  {
    label: "Fiyatlandırma",
    href: "/fiyatlandirma"
  },
  {
    label: "Metodoloji",
    href: "/metodoloji"
  }
];

export const navLinks: NavLink[] = [
  { label: "Karbon Fiyatı", href: "/karbon-fiyati" },
  { label: "CBAM", href: "/cbam-fiyati" },
  { label: "Türkiye ETS", href: "/turkiye-ets" },
  { label: "Workspace", href: "/workspace" },
  { label: "Monitor", href: "/carbon-monitor" },
  { label: "Fiyatlandırma", href: "/fiyatlandirma" },
  { label: "Resmî SKDM Raporu ↗", href: "https://skdmhesapla.com/" },
  { label: "Metodoloji", href: "/metodoloji" }
];

export const footerColumns = [
  {
    title: "Veri",
    links: [
      { label: "Karbon Fiyatı", href: "/karbon-fiyati" },
      { label: "CBAM", href: "/cbam-fiyati" },
      { label: "EU ETS", href: "/karbon-fiyati" },
      { label: "Türkiye ETS", href: "/turkiye-ets" }
    ]
  },
  {
    title: "Araçlar & Motorlar",
    links: [
      { label: "Workspace", href: "/workspace" },
      { label: "Carbon Monitor", href: "/carbon-monitor" },
      { label: "Fiyatlandırma", href: "/fiyatlandirma" },
      { label: "Resmî SKDM Raporu Hazırla ↗", href: "https://skdmhesapla.com/" },
      { label: "Karbon Maliyet Hesaplama", href: "/karbon-maliyet-hesaplama" },
      { label: "Carbon P&L", href: "/carbon-pnl" },
      { label: "Müşteri Kârlılığı", href: "/musteri-karliligi" }
    ]
  },
  {
    title: "Güvence",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" },
      { label: "Gizlilik", href: "/gizlilik" },
      { label: "Metodoloji", href: "/metodoloji" },
      { label: "Kaynaklar", href: "/metodoloji#kaynaklar" },
      { label: "Veri Politikası", href: "/metodoloji#veri-politikasi" },
      { label: "Yasal Bilgilendirme", href: "/gizlilik" }
    ]
  }
];
