export const prerender = true;
const urls = [
  '/',
  '/karbon-fiyati',
  '/cbam-fiyati',
  '/turkiye-ets',
  '/karbon-maliyet-hesaplama',
  '/metodoloji'
];
export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `\n  <url><loc>https://karbonfiyat.com${path}</loc><changefreq>${path==='/'?'daily':'weekly'}</changefreq><priority>${path==='/'?'1.0':'0.8'}</priority></url>`).join('')}\n</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
