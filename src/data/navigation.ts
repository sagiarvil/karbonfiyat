export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Karbon Fiyatı", href: "/karbon-fiyati" },
  { label: "CBAM", href: "/cbam-fiyati" },
  { label: "Türkiye ETS", href: "/turkiye-ets" },
  { label: "Workspace", href: "/workspace" },
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
      { label: "Metodoloji", href: "/metodoloji" },
      { label: "Kaynaklar", href: "/metodoloji#kaynaklar" },
      { label: "Veri Politikası", href: "/metodoloji#veri-politikasi" },
      { label: "Yasal Bilgilendirme", href: "/metodoloji#yasal" }
    ]
  }
];
