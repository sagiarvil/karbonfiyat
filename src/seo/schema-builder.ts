import type { SeoPageRecord } from './registry.types';

export function buildCompleteJsonLdGraph(page: SeoPageRecord, domain: string = 'karbonfiyat.com'): string {
  const origin = `https://${domain}`;
  const pageUrl = `${origin}${page.route === '/' ? '' : page.route}`;

  const graph: Record<string, any>[] = [
    {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'KarbonFiyat',
      url: origin,
      logo: {
        '@type': 'ImageObject',
        '@id': `${origin}/#logo`,
        url: `${origin}/logo/karbonfiyat-logo.png`,
        caption: 'KarbonFiyat Logo'
      },
      sameAs: [
        'https://www.wikidata.org/wiki/Q11589432',
        'https://x.com/karbonfiyat',
        'https://www.linkedin.com/company/karbonfiyat'
      ],
      ...(page.mobile.pwaInstallable ? {
        potentialAction: {
          '@type': 'InstallAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${origin}/?utm_source=pwa_install` }
        }
      } : {})
    },
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      url: origin,
      name: 'KarbonFiyat',
      publisher: { '@id': `${origin}/#organization` },
      inLanguage: page.locale,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${origin}/karbon-fiyati?q={search_term_string}` },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.metaDescription,
      isPartOf: { '@id': `${origin}/#website` },
      about: { '@id': page.primaryEntity.id },
      datePublished: page.publishedAt,
      dateModified: page.modifiedAt,
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      primaryImageOfPage: { '@id': `${origin}/og-karbonfiyat.svg#primaryimage` },
      inLanguage: page.locale,
      isAccessibleForFree: true,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['div.hero-answer-engine', 'h1', 'p.hero-lead']
      }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: page.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.item.startsWith('http') ? b.item : `${origin}${b.item}`
      }))
    }
  ];

  if (page.mobile.pwaInstallable) {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${origin}/#pwa`,
      name: 'KarbonFiyat PWA App',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' }
    });
  }

  if (page.role === 'service' || page.role === 'product' || page.role === 'home') {
    graph.push({
      '@type': 'LocalBusiness',
      '@id': `${origin}/#localbusiness`,
      name: 'KarbonFiyat Karbon Piyasası İstihbarat Merkezi',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Çankaya',
        addressRegion: 'Ankara',
        addressCountry: 'TR'
      },
      telephone: '+908503000000',
      priceRange: '₺₺',
      areaServed: { '@type': 'Country', name: 'Türkiye' }
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}
