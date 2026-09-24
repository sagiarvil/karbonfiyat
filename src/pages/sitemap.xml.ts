export async function GET() {
  const baseUrl = "https://karbonfiyat.com";
  const today = new Date().toISOString().split("T")[0];
  const routes = [
    { path: "", priority: "1.0", changefreq: "daily" },
    { path: "/karbon-fiyati", priority: "0.9", changefreq: "daily" },
    { path: "/cbam-fiyati", priority: "0.9", changefreq: "daily" },
    { path: "/turkiye-ets", priority: "0.9", changefreq: "weekly" },
    { path: "/karbon-maliyet-hesaplama", priority: "0.9", changefreq: "weekly" },
    { path: "/carbon-pnl", priority: "0.8", changefreq: "weekly" },
    { path: "/musteri-karliligi", priority: "0.8", changefreq: "weekly" },
    { path: "/workspace", priority: "0.8", changefreq: "weekly" },
    { path: "/carbon-monitor", priority: "0.8", changefreq: "daily" },
    { path: "/fiyatlandirma", priority: "0.8", changefreq: "weekly" },
    { path: "/metodoloji", priority: "0.7", changefreq: "monthly" },
    { path: "/hakkimizda", priority: "0.7", changefreq: "monthly" },
    { path: "/iletisim", priority: "0.6", changefreq: "monthly" },
    { path: "/gizlilik", priority: "0.5", changefreq: "monthly" }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
