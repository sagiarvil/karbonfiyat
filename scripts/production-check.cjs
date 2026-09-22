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
  "fiyatlandirma/index.html",
  "workspace/index.html",
  "carbon-monitor/index.html",
  "carbon-pnl/index.html",
  "musteri-karliligi/index.html",
  "metodoloji/index.html",
  "sitemap.xml"
];

for (const relative of required) {
  const target = path.join(dist, relative);
  if (!fs.existsSync(target)) fail("Missing critical build artifact: " + relative);
  const stat = fs.statSync(target);
  if (!stat.isFile() || stat.size < 50) fail("Invalid or empty build artifact: " + relative);
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
  const text = fs.readFileSync(full, "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) fail("Forbidden production placeholder/claim found in " + file + ": " + token);
  }
}

const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!indexHtml.includes("karbonfiyat")) fail("Homepage brand marker missing.");
if (!indexHtml.includes("canli-karbon-fiyatlari")) fail("Market intelligence section missing from homepage.");

const workspaceHtml = fs.readFileSync(path.join(dist, "workspace/index.html"), "utf8");
if (!workspaceHtml.includes("CARBON FINANCIAL WORKSPACE")) fail("Workspace content missing.");
if (!workspaceHtml.includes("data-export-csv")) fail("Workspace export capability missing.");

const monitorHtml = fs.readFileSync(path.join(dist, "carbon-monitor/index.html"), "utf8");
if (!monitorHtml.includes("CARBON MONITOR WORKBENCH")) fail("Carbon Monitor content missing.");
if (!monitorHtml.includes("data-save-snapshot")) fail("Carbon Monitor persistence capability missing.");

const customerHtml = fs.readFileSync(path.join(dist, "musteri-karliligi/index.html"), "utf8");
if (!customerHtml.includes("CANLI PORTFÖY KARAR MOTORU")) fail("Customer portfolio engine missing.");
if (!customerHtml.includes("data-export-portfolio")) fail("Customer portfolio export capability missing.");

console.log("Production checks passed: critical routes, placeholders and core capabilities verified.");
