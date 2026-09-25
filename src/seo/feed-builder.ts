import type { SeoPageRecord } from './registry.types';

export function buildRssFeed(pages: readonly SeoPageRecord[], domain: string = 'karbonfiyat.com') {
  const origin = `https://${domain}`;
  const items = pages
    .filter(p => p.indexDirective === 'index, follow')
    .map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${origin}${p.route}</link>
      <guid isPermaLink="true">${origin}${p.route}</guid>
      <description><![CDATA[${p.metaDescription}]]></description>
      <content:encoded><![CDATA[${p.heroAnswerEngine}]]></content:encoded>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <author>official@karbonfiyat.com (KarbonFiyat Araştırma)</author>
      <category>${p.feedCategory || 'article'}</category>
      <atom:link rel="alternate" type="text/markdown" href="${origin}${p.llmSubGraphRoute || ''}"/>
      <atom:link rel="alternate" type="text/markdown" href="${origin}${p.mobileSubGraphRoute || ''}" title="Mobile LLM Graph"/>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KarbonFiyat — Piyasa, SKDM ve ETS İstihbarat Akışı</title>
    <link>${origin}</link>
    <description>Güncel karbon fiyatları, CBAM / SKDM maliyet analizleri ve Türkiye ETS regülasyon bildirimleri</description>
    <language>tr-TR</language>
    <atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}

export function buildMobileFeed(pages: readonly SeoPageRecord[], domain: string = 'karbonfiyat.com') {
  const origin = `https://${domain}`;
  const items = pages
    .filter(p => p.indexDirective === 'index, follow')
    .map(p => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${origin}${p.route}</link>
      <guid isPermaLink="true">${origin}${p.route}#mobile</guid>
      <description><![CDATA[${p.heroAnswerEngine}]]></description>
      <content:encoded><![CDATA[${p.heroAnswerEngine}]]></content:encoded>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <author>official@karbonfiyat.com (KarbonFiyat Mobile)</author>
      <category>${p.feedCategory || 'service'}</category>
      <atom:link rel="alternate" type="text/markdown" href="${origin}${p.mobileSubGraphRoute || ''}" title="Mobile Voice Graph"/>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KarbonFiyat Mobile &amp; Voice Intelligence Feed</title>
    <link>${origin}</link>
    <description>Mobil cihazlar, sesli asistanlar ve on-device AI için optimize edilmiş 29-kelimelik yanıt akışı</description>
    <language>tr-TR</language>
    <atom:link href="${origin}/mobile/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link rel="hub" href="https://pubsubhubbub.appspot.com/"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}
