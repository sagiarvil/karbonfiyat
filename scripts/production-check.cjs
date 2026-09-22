const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const fail = (message) => {
  console.error("\nPRODUCTION CHECK FAILED: " + message + "\n");
  process.exit(1);
};

const required = [
  "index.html",
  "karbon-fiyati/index.html",
  "cbam-fiyati/index.html",
  "turkiye-ets/index.html",
  "karbon-maliyet-hesaplama/index.html",
  "fiyatlandirma/index.html",
  "workspace/index.html",
  "carbon-monitor/index.html",
  "carbon-pnl/index.html",
  "musteri-karliligi/index.html",
  "metodoloji/index.html",
  "hakkimizda/index.html",
  "iletisim/index.html",
  "gizlilik/index.html",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "llms-full.txt",
  "index.md"
];

for (const relative of required) {
  const target = path.join(dist, relative);
  if (!fs.existsSync(target)) fail("Missing critical build artifact: " + relative);
  const stat = fs.statSync(target);
  if (!stat.isFile() || stat.size < 20) fail("Invalid or empty build artifact: " + relative);
}

const sourceFiles = [
  "src/components/LeadOrderModal.astro",
  "src/components/ProductFunnelLadder.astro",
  "src/components/MarketIntelligenceTerminal.astro",
  "src/pages/fiyatlandirma.astro"
];

const forbidden = [
  "905320000000",
  "Talebiniz alındı. Finans ekibimiz 2 saat",
  "KONTENJAN: İLK 10",
  "OFFICIAL_GTIP_DATABASE"
];

for (const file of sourceFiles) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) fail("Missing guarded source file: " + file);
  const source = fs.readFileSync(full, "utf8");
  for (const token of forbidden) {
    if (source.includes(token)) fail("Forbidden production placeholder/claim found in " + file + ": " + token);
  }
}

const htmlFiles = required.filter((relative) => relative.endsWith(".html"));

for (const relative of htmlFiles) {
  const html = fs.readFileSync(path.join(dist, relative), "utf8");

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) fail(relative + " must contain exactly one H1; found " + h1Count);

  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i);
  if (!canonical || !canonical[1].startsWith("https://karbonfiyat.com/")) {
    fail(relative + " is missing an absolute karbonfiyat.com canonical URL");
  }

  const description =
    /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["'][^>]*>/i.test(html) ||
    /<meta[^>]+content=["'][^"']+["'][^>]+name=["']description["'][^>]*>/i.test(html);
  if (!description) fail(relative + " is missing a non-empty meta description");

  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
    fail(relative + " contains an unexpected noindex directive");
  }

  const inputMatches = [...html.matchAll(/<input\b[^>]*>/gi)];
  for (const match of inputMatches) {
    const input = match[0];
    if (/type=["']hidden["']/i.test(input) || /aria-hidden=["']true["']/i.test(input)) continue;
    if (/aria-label=["'][^"']+["']/i.test(input) || /aria-labelledby=["'][^"']+["']/i.test(input)) continue;

    const before = html.slice(0, match.index);
    const wrappedByLabel = before.lastIndexOf("<label") > before.lastIndexOf("</label>");
    if (wrappedByLabel) continue;

    const idMatch = input.match(/\bid=["']([^"']+)["']/i);
    if (!idMatch) fail(relative + " contains an input without id/accessible name: " + input.slice(0, 120));
    const escapedId = idMatch[1].replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const labelRe = new RegExp("<label[^>]+for=[\\\"']" + escapedId + "[\\\"'][^>]*>", "i");
    if (!labelRe.test(html)) fail(relative + " contains input #" + idMatch[1] + " without an associated label");
  }
}

const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!indexHtml.includes("karbonfiyat")) fail("Homepage brand marker missing.");
if (!indexHtml.includes("canli-karbon-fiyatlari")) fail("Market intelligence section missing from homepage.");
if (!indexHtml.includes('rel="describedby"') || !indexHtml.includes("/llms.txt")) {
  fail("Homepage machine-readable llms.txt discovery link missing.");
}
if (!indexHtml.includes('type="text/markdown"') || !indexHtml.includes("/index.md")) {
  fail("Homepage Markdown alternate discovery link missing.");
}

const workspaceHtml = fs.readFileSync(path.join(dist, "workspace/index.html"), "utf8");
if (!workspaceHtml.includes("CARBON FINANCIAL WORKSPACE")) fail("Workspace content missing.");
if (!workspaceHtml.includes("data-export-csv")) fail("Workspace export capability missing.");

const monitorHtml = fs.readFileSync(path.join(dist, "carbon-monitor/index.html"), "utf8");
if (!monitorHtml.includes("CARBON MONITOR WORKBENCH")) fail("Carbon Monitor content missing.");
if (!monitorHtml.includes("data-save-snapshot")) fail("Carbon Monitor persistence capability missing.");

const customerHtml = fs.readFileSync(path.join(dist, "musteri-karliligi/index.html"), "utf8");
if (!customerHtml.includes("CANLI PORTFÖY KARAR MOTORU")) fail("Customer portfolio engine missing.");
if (!customerHtml.includes("data-export-portfolio")) fail("Customer portfolio export capability missing.");

const llms = fs.readFileSync(path.join(dist, "llms.txt"), "utf8");
if (!/^# KarbonFiyat\s*$/m.test(llms)) fail("llms.txt H1 missing.");
if (!/^>\s+\S+/m.test(llms)) fail("llms.txt blockquote summary missing.");

const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
for (const route of ["/hakkimizda", "/iletisim", "/gizlilik"]) {
  if (!sitemap.includes("https://karbonfiyat.com" + route)) fail("Sitemap missing " + route);
}
if (/<lastmod>/i.test(sitemap)) fail("Sitemap must not emit synthetic build-time lastmod values.");

const firebase = JSON.parse(fs.readFileSync(path.join(root, "firebase.json"), "utf8"));
const globalHeaderBlock = (firebase.hosting?.headers || []).find((entry) => entry.source === "**");
const headerMap = new Map((globalHeaderBlock?.headers || []).map((h) => [String(h.key).toLowerCase(), String(h.value)]));
const expectedHeaders = {
  "strict-transport-security": "max-age=31536000",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "x-frame-options": "DENY"
};
for (const [key, value] of Object.entries(expectedHeaders)) {
  if (headerMap.get(key) !== value) fail("firebase.json header contract missing/mismatched: " + key);
}

console.log("Production checks passed: SEO, trust, accessibility, machine discovery, security headers and core capabilities verified.");
