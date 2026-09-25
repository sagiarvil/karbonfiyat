import type { SeoPageRecord, SeoEntityRef } from './registry.types';

export const primaryBrandEntity: SeoEntityRef = {
  id: 'https://karbonfiyat.com/#organization',
  name: 'KarbonFiyat',
  type: 'Organization',
  sameAs: [
    'https://www.wikidata.org/wiki/Q11589432',
    'https://x.com/karbonfiyat',
    'https://www.linkedin.com/company/karbonfiyat'
  ]
};

export const defaultCwvBudget = {
  lcpMs: 1800,
  inpMs: 120,
  cls: 0.03,
  ttfbMs: 180,
  fcpMs: 1200,
  tbtMs: 150,
  htmlKb: 55,
  jsKb: 120,
  cssKb: 28,
  totalMb: 1.2
};

export const defaultMobileConfig = {
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, minimum-scale=1, maximum-scale=5',
  bottomNavEnabled: true,
  thumbZoneCtaPosition: 'bottom-right' as const,
  touchTargetsValidated: true,
  horizontalScrollFree: true,
  thumbSafeHeroAnswer: true,
  pwaInstallable: true,
  serviceWorkerRoute: '/sw.js' as const,
  manifestRoute: '/manifest.webmanifest' as const,
  appLinkRoute: '/app-link.json' as const
};

export const SEO_REGISTRY: readonly SeoPageRecord[] = [
  {
    route: '/',
    locale: 'tr-TR',
    role: 'home',
    indexDirective: 'index, follow',
    canonicalRoute: '/',
    title: 'Karbon Fiyatı & SKDM / ETS Maliyet Analizi | KarbonFiyat',
    metaDescription: 'Canlı karbon fiyatı, AB SKDM (CBAM) maliyeti, Türkiye ETS simülasyonu ve kurumsal emisyon finansal etki hesaplama platformu.',
    h1: 'Karbon Fiyatı ve SKDM Maliyet Hesaplama Motoru',
    primaryIntent: 'karbon fiyati ve skdm hesaplama',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesSolution', object: 'Karbon Piyasası Finansal İstihbarat' },
      { subject: 'KarbonFiyat', predicate: 'compliesWith', object: 'AB CBAM Regülasyonu 2023/956' },
      { subject: 'KarbonFiyat', predicate: 'hasVoiceAnswer', object: 'div.hero-answer-engine' }
    ],
    heroAnswerEngine: 'Karbon fiyatı; Avrupa Birliği Emisyon Ticaret Sistemi (EU ETS) kapsamında ton CO2 eşdeğeri başına işlem gören ve 2026 yılından itibaren Sınırda Karbon Düzenleme Mekanizması (SKDM / CBAM) ile Türkiye ihracatçılarını doğrudan finansal yükümlülüğe tabi tutan piyasa referans değeridir. KarbonFiyat platformu; demir-çelik, alüminyum, çimento ve gübre sektörleri için ton başına net emisyon maliyetini ve gümrük maliyet riskini anlık hesaplar.',
    publishedAt: '2026-01-15T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    llmSubGraphRoute: '/llms/pages/karbon-fiyati.md',
    mobileSubGraphRoute: '/llms/mobile/karbon-fiyati-mobile.md',
    breadcrumbs: [{ name: 'Ana Sayfa', item: '/' }],
    feedCategory: 'service',
    topicCluster: '/karbon-fiyati',
    hreflangGroup: 'home',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'navigate',
      secondaryActions: ['buy', 'form'],
      voiceQueryPatterns: [
        'karbon fiyatı ne kadar',
        'skdm maliyeti nasıl hesaplanır',
        'türkiye ets ne zaman başlıyor'
      ],
      localIntentKeywords: ['türkiye karbon borsası', 'istanbul karbon piyasası', 'ankara ets regülasyonu'],
      serpFeatures: ['ai-overview', 'faq-rich', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/karbon-fiyati',
    locale: 'tr-TR',
    role: 'service',
    indexDirective: 'index, follow',
    canonicalRoute: '/karbon-fiyati',
    title: 'Canlı Karbon Fiyatı — EU ETS EUA ve Güncel Piyasa | KarbonFiyat',
    metaDescription: 'Avrupa Birliği EUA vadeli ve spot karbon fiyatı, günlük değişim oranları ve 2026 SKDM projeksiyonları.',
    h1: 'Canlı Karbon Fiyatı ve Piyasa İstihbarat Terminali',
    primaryIntent: 'canli karbon fiyati takibi',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'tracksAsset', object: 'EUA Carbon Allowance' },
      { subject: 'EUA Carbon Allowance', predicate: 'quotedIn', object: 'EUR per tCO2e' }
    ],
    heroAnswerEngine: 'Canlı karbon fiyatı, Avrupa Enerji Borsası (EEX) ve ICE üzerinde işlem gören EU ETS Emisyon Tahsisatlarının (EUA) ton başına Euro cinsinden anlık değeridir. İhracatçılar için SKDM sertifika bedeli, bir önceki takvim haftasındaki EUA açık artırma kapanış fiyatlarının ağırlıklı ortalaması baz alınarak Avrupa Komisyonu tarafından belirlenir ve doğrudan gümrük beyanına yansıtılır.',
    publishedAt: '2026-01-20T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    llmSubGraphRoute: '/llms/pages/karbon-fiyati.md',
    mobileSubGraphRoute: '/llms/mobile/karbon-fiyati-mobile.md',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Karbon Fiyatı', item: '/karbon-fiyati' }
    ],
    feedCategory: 'service',
    topicCluster: '/karbon-fiyati',
    hreflangGroup: 'karbon-fiyati',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'chat',
      secondaryActions: ['form', 'share'],
      voiceQueryPatterns: [
        'bugün karbon fiyatı kaç euro',
        'eua karbon fiyatı nedir',
        'karbon ton fiyatı güncel'
      ],
      localIntentKeywords: ['türkiye eua karbon fiyatı', 'canlı karbon piyasası'],
      serpFeatures: ['ai-overview', 'faq-rich', 'howto-rich']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/cbam-fiyati',
    locale: 'tr-TR',
    role: 'service',
    indexDirective: 'index, follow',
    canonicalRoute: '/cbam-fiyati',
    title: 'SKDM / CBAM Karbon Sertifika Fiyatı ve Vergi Riski | KarbonFiyat',
    metaDescription: 'Sınırda Karbon Düzenleme Mekanizması (CBAM) sertifika maliyeti, haftalık ortalama hesaplama yöntemi ve sektör bazlı etki.',
    h1: 'SKDM / CBAM Karbon Sertifika Fiyatı ve Vergi Projeksiyonu',
    primaryIntent: 'cbam skdm sertifika fiyati',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesSolution', object: 'CBAM Maliyet Simülasyonu' }
    ],
    heroAnswerEngine: 'CBAM (SKDM) sertifika fiyatı; AB Sınırda Karbon Düzenleme Mekanizması uyarınca ithal edilen ürünlerin gömülü emisyonları için ödenmesi gereken birim maliyettir. Haftalık EEX müzayede ortalaması üzerinden hesaplanır ve ithalatçı tarafından satın alınarak teslim edilir. Yerel karbon fiyatı veya ETS ödemesi yapılmışsa mahsup imkanı sunulmaktadır.',
    publishedAt: '2026-02-01T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    llmSubGraphRoute: '/llms/pages/cbam-fiyati.md',
    mobileSubGraphRoute: '/llms/mobile/cbam-fiyati-mobile.md',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'CBAM Fiyatı', item: '/cbam-fiyati' }
    ],
    feedCategory: 'service',
    topicCluster: '/cbam-fiyati',
    hreflangGroup: 'cbam-fiyati',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['chat', 'call'],
      voiceQueryPatterns: [
        'cbam sertifikası kaç para',
        'skdm vergisi nasıl ödenir',
        'avrupa sınırda karbon fiyatı'
      ],
      localIntentKeywords: ['türkiye cbam sertifika danışmanlığı', 'skdm gümrük beyanı ankara'],
      serpFeatures: ['ai-overview', 'faq-rich', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/turkiye-ets',
    locale: 'tr-TR',
    role: 'service',
    indexDirective: 'index, follow',
    canonicalRoute: '/turkiye-ets',
    title: 'Türkiye Ulusal Emisyon Ticaret Sistemi (ETS) ve Pilot Dönem | KarbonFiyat',
    metaDescription: 'Türkiye ETS takvimi, İklim Kanunu taslağı, tahsisat mekanizmaları ve CBAM mahsup entegrasyonu.',
    h1: 'Türkiye Ulusal Emisyon Ticaret Sistemi (ETS) Rehberi',
    primaryIntent: 'turkiye ets mevzuati ve pilot donem',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesSolution', object: 'Türkiye ETS Uyum Analizi' }
    ],
    heroAnswerEngine: 'Türkiye Ulusal Emisyon Ticaret Sistemi (ETS); İklim Değişikliği Başkanlığı gözetiminde, öncelikle enerji yoğun sektörlerde faaliyet gösteren tesisler için tavan-ve-ticaret (cap-and-trade) esasına dayalı olarak yürürlüğe giren ulusal piyasa aracıdır. Türkiye ETS kapsamında ödenen karbon bedelleri, AB SKDM sertifika yükümlülüğünden doğrudan mahsup edilebilir.',
    publishedAt: '2026-02-10T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    llmSubGraphRoute: '/llms/pages/turkiye-ets.md',
    mobileSubGraphRoute: '/llms/mobile/turkiye-ets-mobile.md',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Türkiye ETS', item: '/turkiye-ets' }
    ],
    feedCategory: 'service',
    topicCluster: '/turkiye-ets',
    hreflangGroup: 'turkiye-ets',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['call', 'chat'],
      voiceQueryPatterns: [
        'türkiye ets ne zaman yürürlüğe girecek',
        'iklim kanunu karbon vergisi ne kadar',
        'türkiye karbon borsası epiaş'
      ],
      localIntentKeywords: ['ankara iklim değişikliği başkanlığı ets', 'epiaş karbon piyasası istanbul'],
      serpFeatures: ['ai-overview', 'faq-rich', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/karbon-maliyet-hesaplama',
    locale: 'tr-TR',
    role: 'tool',
    indexDirective: 'index, follow',
    canonicalRoute: '/karbon-maliyet-hesaplama',
    title: 'Karbon Maliyeti ve CBAM Vergi Hesaplama Aracı | KarbonFiyat',
    metaDescription: 'Üretim tonajı, emisyon faktörü ve güncel karbon fiyatı ile tesisinizin toplam karbon maliyetini anında hesaplayın.',
    h1: 'Karbon Maliyeti ve SKDM Emisyon Vergi Hesaplayıcısı',
    primaryIntent: 'karbon maliyet hesaplama araci',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesTool', object: 'Karbon Maliyet Hesaplayıcı' }
    ],
    heroAnswerEngine: 'Karbon maliyet hesaplama aracı; tesisinizin yıllık üretim tonajı, ürün bazlı özgül gömülü emisyon faktörü (tCO2e/ton) ve yürürlükteki karbon veya CBAM sertifika fiyatını çarparak toplam brüt maliyeti, ücretsiz tahsisat indirimlerini ve net sınır vergisi yükümlülüğünü saniyeler içinde hesaplayan finansal karar destek yazılımıdır.',
    publishedAt: '2026-02-15T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    llmSubGraphRoute: '/llms/pages/karbon-maliyet-hesaplama.md',
    mobileSubGraphRoute: '/llms/mobile/karbon-maliyet-hesaplama-mobile.md',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Hesaplama Aracı', item: '/karbon-maliyet-hesaplama' }
    ],
    feedCategory: 'service',
    topicCluster: '/karbon-maliyet-hesaplama',
    hreflangGroup: 'karbon-maliyet-hesaplama',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['chat', 'share'],
      voiceQueryPatterns: [
        'karbon ayak izi maliyeti nasıl hesaplanır',
        'skdm vergi hesaplama formülü',
        'çelik ihracatı karbon vergisi hesapla'
      ],
      localIntentKeywords: ['sanayi karbon maliyet simülasyonu', 'kocaeli gebze skdm hesaplama'],
      serpFeatures: ['ai-overview', 'faq-rich', 'howto-rich']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/fiyatlandirma',
    locale: 'tr-TR',
    role: 'product',
    indexDirective: 'index, follow',
    canonicalRoute: '/fiyatlandirma',
    title: 'Hizmet Paketleri ve Fiyatlandırma | KarbonFiyat',
    metaDescription: 'Ön analizden tam ölçekli CBAM/ETS uyum yönetimine kadar kurumsal karbon danışmanlık paketleri.',
    h1: 'KarbonFiyat Kurumsal Çözüm ve Analiz Paketleri',
    primaryIntent: 'karbon danismanlik fiyatlari ve paketleri',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'offers', object: '4.900 TL Ön Analiz Raporu' }
    ],
    heroAnswerEngine: 'KarbonFiyat fiyatlandırma modeli; 4.900 TL başlangıç fiyatlı Hızlı Risk Taraması, 24.000 TL kapsamlı SKDM Portföy Denetimi ve kurumsal tesisler için sürekli izleme sağlayan Kurumsal Karbon Yönetim lisanslarından oluşur. Her ölçekteki ihracatçı için şeffaf, sonuç garantili ve sıfır gizli maliyet ilkesiyle sunulur.',
    publishedAt: '2026-02-18T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    llmSubGraphRoute: '/llms/pages/karbon-fiyati.md',
    mobileSubGraphRoute: '/llms/mobile/karbon-fiyati-mobile.md',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Fiyatlandırma', item: '/fiyatlandirma' }
    ],
    feedCategory: 'product',
    topicCluster: '/fiyatlandirma',
    hreflangGroup: 'fiyatlandirma',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'buy',
      secondaryActions: ['form', 'call'],
      voiceQueryPatterns: [
        'karbon danışmanlık ücreti ne kadar',
        'skdm analiz raporu fiyatı',
        'karbon denetim maliyeti'
      ],
      localIntentKeywords: ['istanbul karbon danışmanlık teklifi', 'türkiye ets denetim ücretleri'],
      serpFeatures: ['ai-overview', 'faq-rich', 'shopping']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/workspace',
    locale: 'tr-TR',
    role: 'tool',
    indexDirective: 'index, follow',
    canonicalRoute: '/workspace',
    title: 'Carbon Financial Workspace — Kurumsal Karar Paneli | KarbonFiyat',
    metaDescription: 'Çoklu tesis karbon maliyet projeksiyonu, CBAM senaryo modellemesi ve CSV ihracat terminali.',
    h1: 'Carbon Financial Workspace Kurumsal Konsol',
    primaryIntent: 'carbon financial workspace paneli',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesTool', object: 'Carbon Financial Workspace' }
    ],
    heroAnswerEngine: 'Carbon Financial Workspace; sanayi kuruluşlarının çoklu tesis emisyonlarını, CBAM gümrük beyannamelerini ve Türkiye ETS tahsisat açıklarını tek ekranda senaryolar halinde simüle etmelerini sağlayan gelişmiş finansal analitik ve CSV veri aktarım ortamıdır.',
    publishedAt: '2026-02-20T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Workspace', item: '/workspace' }
    ],
    feedCategory: 'service',
    topicCluster: '/workspace',
    hreflangGroup: 'workspace',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['chat', 'share'],
      voiceQueryPatterns: ['karbon analitik paneli', 'cbam simülatörü kurumsal'],
      localIntentKeywords: ['kurumsal karbon paneli türkiye'],
      serpFeatures: ['ai-overview', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/carbon-monitor',
    locale: 'tr-TR',
    role: 'tool',
    indexDirective: 'index, follow',
    canonicalRoute: '/carbon-monitor',
    title: 'Carbon Monitor Workbench — Sürekli Emisyon Takibi | KarbonFiyat',
    metaDescription: 'Aylık emisyon gerçekleşmeleri, marj erimesi risk radarı ve anlık snapshot kayıt konsolu.',
    h1: 'Carbon Monitor Workbench Emisyon Takip Radarı',
    primaryIntent: 'carbon monitor emisyon izleme',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesTool', object: 'Carbon Monitor Workbench' }
    ],
    heroAnswerEngine: 'Carbon Monitor Workbench; tesislerin fiili üretim verileri üzerinden aylık emisyon gerçekleşmelerini izleyen, karbon fiyat dalgalanmalarının karlılık marjına etkisini anlık grafiklerle sunan ve denetim snapshot kayıtları oluşturan kurumsal gözetim konsoludur.',
    publishedAt: '2026-02-22T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Carbon Monitor', item: '/carbon-monitor' }
    ],
    feedCategory: 'service',
    topicCluster: '/carbon-monitor',
    hreflangGroup: 'carbon-monitor',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['chat'],
      voiceQueryPatterns: ['emisyon izleme motoru', 'karbon marj radarı'],
      localIntentKeywords: ['canlı tesis karbon izleme'],
      serpFeatures: ['ai-overview', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/carbon-pnl',
    locale: 'tr-TR',
    role: 'tool',
    indexDirective: 'index, follow',
    canonicalRoute: '/carbon-pnl',
    title: 'Carbon PnL — Karbon Gelir-Gider ve Bilanço Etkisi | KarbonFiyat',
    metaDescription: 'Emisyon maliyetlerinin EBITDA, brüt kar marjı ve ürün birim fiyatı üzerindeki finansal etki simülatörü.',
    h1: 'Carbon PnL Finansal Bilanço Simülasyon Motoru',
    primaryIntent: 'carbon pnl bilanco marj etkisi',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesTool', object: 'Carbon PnL' }
    ],
    heroAnswerEngine: 'Carbon PnL; karbon fiyatındaki her 10 Euro/tCO2e artışın şirketin FAVÖK (EBITDA) marjı, ürün maliyet yapısı ve ihracat rekabet gücü üzerindeki net parasal etkisini ortaya koyan finansal bilanço simülasyon motorudur.',
    publishedAt: '2026-02-25T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Carbon PnL', item: '/carbon-pnl' }
    ],
    feedCategory: 'service',
    topicCluster: '/carbon-pnl',
    hreflangGroup: 'carbon-pnl',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['chat'],
      voiceQueryPatterns: ['karbon bilançoya etkisi nasıl hesaplanır', 'ebitda karbon riski'],
      localIntentKeywords: ['karbon pnl finansal danışmanlık'],
      serpFeatures: ['ai-overview', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/musteri-karliligi',
    locale: 'tr-TR',
    role: 'tool',
    indexDirective: 'index, follow',
    canonicalRoute: '/musteri-karliligi',
    title: 'Müşteri ve Sipariş Karlılığı Karar Motoru | KarbonFiyat',
    metaDescription: 'Hangi müşteri ve ihracat siparişinin karbon vergisi sonrası net kar bıraktığını analiz eden karar aracı.',
    h1: 'Müşteri ve Sipariş Karlılığı Karar Motoru',
    primaryIntent: 'musteri siparis karliligi karbon analizi',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesTool', object: 'Müşteri Karlılığı Motoru' }
    ],
    heroAnswerEngine: 'Müşteri Karlılığı Karar Motoru; ihracat yapılan her müşterinin satın aldığı ürün gamı ve lojistik/emisyon profilini inceleyerek SKDM kesintileri sonrası gerçek net kar katkısını tespit eden, zarar ettiren siparişleri önceden gösteren karar mekanizmasıdır.',
    publishedAt: '2026-02-28T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Müşteri Karlılığı', item: '/musteri-karliligi' }
    ],
    feedCategory: 'service',
    topicCluster: '/musteri-karliligi',
    hreflangGroup: 'musteri-karliligi',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['chat'],
      voiceQueryPatterns: ['ihracat sipariş karlılığı karbon', 'müşteri karbon risk matrisi'],
      localIntentKeywords: ['ihracat karlılık analizi türkiye'],
      serpFeatures: ['ai-overview', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/metodoloji',
    locale: 'tr-TR',
    role: 'article',
    indexDirective: 'index, follow',
    canonicalRoute: '/metodoloji',
    title: 'Bilimsel ve Finansal Hesaplama Metodolojisi | KarbonFiyat',
    metaDescription: 'GHG Protocol Scope 1-2-3 standartları, IPCC faktörleri ve AB CBAM regülasyon formülleri.',
    h1: 'KarbonFiyat Hesaplama ve Modelleme Metodolojisi',
    primaryIntent: 'karbon hesaplama metodolojisi ve standartlar',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'followsStandard', object: 'ISO 14064-1 ve GHG Protocol' }
    ],
    heroAnswerEngine: 'KarbonFiyat metodolojisi; ISO 14064-1, GHG Protokolü Kurumsal Standardı ve Avrupa Komisyonu CBAM Uygulama Yönetmeliği (EU 2023/1773) uyarınca doğrudan (Kapsam 1) ve dolaylı (Kapsam 2) emisyonların birincil veri veya varsayılan değerlerle matematiksel doğrulanmasına dayanır.',
    publishedAt: '2026-03-01T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Metodoloji', item: '/metodoloji' }
    ],
    feedCategory: 'article',
    topicCluster: '/metodoloji',
    hreflangGroup: 'metodoloji',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['share'],
      voiceQueryPatterns: ['skdm hesaplama formülleri nelerdir', 'ghg protokol kapsam 1 2 nedir'],
      localIntentKeywords: ['karbon metodoloji danışmanlığı ankara'],
      serpFeatures: ['ai-overview', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/hakkimizda',
    locale: 'tr-TR',
    role: 'legal',
    indexDirective: 'index, follow',
    canonicalRoute: '/hakkimizda',
    title: 'Hakkımızda — Karbon Piyasası İstihbarat Platformu | KarbonFiyat',
    metaDescription: 'KarbonFiyat misyonu, uzman kadrosu, teknolojik altyapısı ve kurumsal değerleri.',
    h1: 'KarbonFiyat Hakkında ve Kurumsal Vizyonumuz',
    primaryIntent: 'karbonfiyat hakkinda kurumsal bilgi',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'establishedIn', object: 'Türkiye' }
    ],
    heroAnswerEngine: 'KarbonFiyat; Türkiye sanayisinin ve ihracatçılarının yeşil dönüşüm ve sınırda karbon düzenlemeleri karşısında finansal direncini artırmak amacıyla kurulmuş, bağımsız veri analitiği ve karbon fiyatlama istihbarat platformudur.',
    publishedAt: '2026-03-05T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Hakkımızda', item: '/hakkimizda' }
    ],
    feedCategory: 'article',
    topicCluster: '/hakkimizda',
    hreflangGroup: 'hakkimizda',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['call'],
      voiceQueryPatterns: ['karbonfiyat kimdir', 'karbonfiyat güvenilir mi'],
      localIntentKeywords: ['karbon istihbarat şirketi türkiye'],
      serpFeatures: ['ai-overview', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/iletisim',
    locale: 'tr-TR',
    role: 'service',
    indexDirective: 'index, follow',
    canonicalRoute: '/iletisim',
    title: 'İletişim ve Uzman Danışmanlık Talebi | KarbonFiyat',
    metaDescription: 'KarbonFiyat uzman ekibiyle iletişime geçin, tesisinize özel ön analiz randevusu oluşturun.',
    h1: 'KarbonFiyat İletişim ve Danışmanlık Merkezi',
    primaryIntent: 'karbonfiyat iletisim ve randevu',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'providesSupport', object: 'Kurumsal Danışmanlık Destek Hattı' }
    ],
    heroAnswerEngine: 'KarbonFiyat İletişim Merkezi; tesisinizin karbon emisyon raporlaması, SKDM beyanname hazırlığı ve Türkiye ETS uyum süreçlerinde teknik uzmanlarımızla doğrudan görüşme ve ön analiz talep kanallarını sunar.',
    publishedAt: '2026-03-10T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'İletişim', item: '/iletisim' }
    ],
    feedCategory: 'service',
    topicCluster: '/iletisim',
    hreflangGroup: 'iletisim',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['call', 'chat'],
      voiceQueryPatterns: ['karbonfiyat telefon numarası', 'karbonfiyat randevu al'],
      localIntentKeywords: ['istanbul karbon danışmanlık iletişim', 'ankara skdm danışmanlık'],
      serpFeatures: ['ai-overview', 'sitelinks']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  },
  {
    route: '/gizlilik',
    locale: 'tr-TR',
    role: 'legal',
    indexDirective: 'index, follow',
    canonicalRoute: '/gizlilik',
    title: 'Gizlilik Politikası ve KVKK Aydınlatma Metni | KarbonFiyat',
    metaDescription: 'Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri işleme prensiplerimiz ve gizlilik taahhüdümüz.',
    h1: 'Gizlilik Politikası ve KVKK Aydınlatma Bildirimi',
    primaryIntent: 'karbonfiyat gizlilik politikasi ve kvkk',
    primaryEntity: primaryBrandEntity,
    semanticTriples: [
      { subject: 'KarbonFiyat', predicate: 'compliesWith', object: '6698 Sayılı KVKK Kanunu' }
    ],
    heroAnswerEngine: 'KarbonFiyat gizlilik politikası; 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Genel Veri Koruma Tüzüğü (GDPR) kapsamında, platform kullanıcılarının ve kurumsal müşterilerin verilerinin en yüksek şifreleme ve güvenlik standartlarıyla korunduğunu taahhüt eder.',
    publishedAt: '2026-03-12T08:00:00+03:00',
    modifiedAt: '2026-09-24T22:00:00+03:00',
    breadcrumbs: [
      { name: 'Ana Sayfa', item: '/' },
      { name: 'Gizlilik', item: '/gizlilik' }
    ],
    feedCategory: 'article',
    topicCluster: '/gizlilik',
    hreflangGroup: 'gizlilik',
    mobile: {
      ...defaultMobileConfig,
      primaryAction: 'form',
      secondaryActions: ['share'],
      voiceQueryPatterns: ['karbonfiyat gizlilik politikası', 'kvkk hakları'],
      localIntentKeywords: ['karbonfiyat veri güvenliği'],
      serpFeatures: ['ai-overview']
    },
    mobileCwvBudget: defaultCwvBudget,
    mobileFirstContentParity: true
  }
];
