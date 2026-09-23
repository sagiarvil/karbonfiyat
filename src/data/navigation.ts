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
  items?: NavDropdownItem[];
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
    label: "Terminaller",
    items: [
      {
        label: "Workspace",
        href: "/workspace",
        desc: "Kurumsal portföy analiz ve senaryo motoru"
      },
      {
        label: "Carbon Monitor",
        href: "/carbon-monitor",
        desc: "7/24 canlı piyasa ve sınırda karbon izleme"
      },
      {
        label: "Carbon P&L",
        href: "/carbon-pnl",
        desc: "Ürün ve emisyon bazlı kârlılık etkisi"
      },
      {
        label: "Müşteri Kârlılığı",
        href: "/musteri-karliligi",
        desc: "Müşteri portföy karbon marj analizi"
      },
      {
        label: "Resmî SKDM Raporu ↗",
        href: "https://skdmhesapla.com/",
        badge: "Resmî XML",
        desc: "AB Komisyonu onaylı beyanname motoru",
        external: true
      }
    ]
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

// Geriye dönük uyumluluk için düz liste
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
