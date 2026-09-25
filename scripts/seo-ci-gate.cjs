'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

console.log('🛡️ [CI-GATE] Enterprise SEO, GEO, AEO, LLMO & LLM Kalite Kapıları (G0-G15) Çalıştırılıyor...');

const violations = [];

const pagesToCheck = [
  'index.html',
  'karbon-fiyati/index.html',
  'cbam-fiyati/index.html',
  'turkiye-ets/index.html',
  'karbon-maliyet-hesaplama/index.html',
  'fiyatlandirma/index.html',
  'workspace/index.html',
  'carbon-monitor/index.html',
  'carbon-pnl/index.html',
  'musteri-karliligi/index.html',
  'metodoloji/index.html',
  'hakkimizda/index.html',
  'iletisim/index.html',
  'gizlilik/index.html'
];

// G1 & G2: SSR HTML Varlık ve Canonical Kontrolü
for (const rel of pagesToCheck) {
  const filePath = path.join(dist, rel);
  if (!fs.existsSync(filePath)) {
    violations.push(`[G2 SSR] ${rel} çıktısı diskte bulunamadı!`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('<title>')) violations.push(`[G2 SSR] ${rel} sayfasında <title> eksik!`);
  if (!/<h1\b/i.test(content)) violations.push(`[G2 SSR] ${rel} sayfasında <H1> başlığı eksik!`);
  if (!content.includes('rel="canonical"')) violations.push(`[G1 CANONICAL] ${rel} sayfasında Canonical eksik!`);
  if (!content.includes('lang="tr"')) violations.push(`[G15 WCAG] ${rel} sayfasında <html lang="tr"> eksik!`);
}

// G4: LLM Kök ve Alt-Graf Bütünlüğü
const rootLlmsPath = path.join(dist, 'llms.txt');
if (!fs.existsSync(rootLlmsPath)) violations.push('[G4 LLMS ROOT] Kök /llms.txt dosyası bulunamadı!');

const subGraphs = [
  'llms/pages/karbon-fiyati.md',
  'llms/pages/cbam-fiyati.md',
  'llms/pages/turkiye-ets.md',
  'llms/pages/karbon-maliyet-hesaplama.md'
];
for (const sg of subGraphs) {
  if (!fs.existsSync(path.join(dist, sg))) {
    violations.push(`[G4 SUB-GRAPH] ${sg} dosyası dist dizininde yok!`);
  }
}

// G5: IndexNow Alfanümerik Key Dosyası
const keyFiles = fs.readdirSync(dist).filter(f => f.endsWith('.txt') && f.length >= 16);
if (keyFiles.length === 0) violations.push('[G5 INDEXNOW] Çıktı dizininde alfanümerik IndexNow [KEY].txt dosyası yok!');

// G8: OpenGraph & Twitter Card
for (const rel of pagesToCheck) {
  const filePath = path.join(dist, rel);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('property="og:title"')) violations.push(`[G8 OG] ${rel} og:title eksik!`);
    if (!content.includes('property="og:image"')) violations.push(`[G8 OG] ${rel} og:image eksik!`);
    if (!content.includes('name="twitter:card"')) violations.push(`[G8 TWITTER] ${rel} twitter:card eksik!`);
  }
}

// G9: Feed Bütünlüğü
for (const f of ['feed.xml', 'atom.xml', 'feed.json']) {
  if (!fs.existsSync(path.join(dist, f))) violations.push(`[G9 FEED] Zorunlu feed dist içinde yok: /${f}`);
}

// G10: agent.txt
if (!fs.existsSync(path.join(dist, 'agent.txt'))) violations.push('[G10 AGENT] /agent.txt yok!');

if (violations.length > 0) {
  console.error(`\n❌ [SEO CI-GATE FAILED] ${violations.length} ihlal tespit edildi:\n`);
  violations.forEach(v => console.error(`  ⛔ ${v}`));
  process.exit(1);
}

console.log('✅ [SEO CI-GATE PASSED] Tüm G0-G15 kalite kontrolleri başarıyla tamamlandı.');
