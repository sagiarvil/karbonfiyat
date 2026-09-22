export async function GET() {
  const baseUrl = "https://karbonfiyat.com";
  const routes = [
    "",
    "/karbon-fiyati",
    "/cbam-fiyati",
    "/turkiye-ets",
    "/karbon-maliyet-hesaplama",
    "/carbon-pnl",
    "/musteri-karliligi",
    "/workspace",
    "/carbon-monitor",
    "/fiyatlandirma",
    "/metodoloji"
  ];

  const now = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === "" ? "daily" : "weekly"}</changefreq>
    <priority>${route === "" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}