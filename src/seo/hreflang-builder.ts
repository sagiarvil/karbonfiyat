import type { SeoPageRecord } from './registry.types';

export function buildHreflangTags(page: SeoPageRecord, allPages: readonly SeoPageRecord[], domain: string = 'karbonfiyat.com'): string {
  if (!page.hreflangGroup) return '';
  const alternates = allPages
    .filter(p => p.hreflangGroup === page.hreflangGroup && p.locale !== page.locale)
    .map(p => `<link rel="alternate" hreflang="${p.locale}" href="https://${domain}${p.route}">`)
    .join('\n');
  const defaultTag = `<link rel="alternate" hreflang="x-default" href="https://${domain}${page.route}">`;
  return alternates ? `${alternates}\n${defaultTag}` : defaultTag;
}
