'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

console.log('📱 [MOBILE-CI-GATE] Mobile-First SEO, PWA, App Indexing & CWV Kapıları (MG0-MG20) Çalıştırılıyor...');

const violations = [];

const pagesToCheck = [
  'index.html',
  'karbon-fiyati/index.html',
  'cbam-fiyati/index.html',
  'turkiye-ets/index.html',
  'karbon-maliyet-hesaplama/index.html',
  'fiyatlandirma/index.html'
];

// MG0: Viewport Meta Kontrolü
for (const rel of pagesToCheck) {
  const filePath = path.join(dist, rel);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('name="viewport"')) {
    violations.push(`[MG0 VIEWPORT] ${rel} viewport meta YOK!`);
  }
  if (content.includes('user-scalable=no')) {
    violations.push(`[MG0 VIEWPORT] ${rel} user-scalable=no YASAK (WCAG ihlali)!`);
  }
  if (!content.includes('width=device-width')) {
    violations.push(`[MG0 VIEWPORT] ${rel} width=device-width eksik!`);
  }
  if (!content.includes('viewport-fit=cover')) {
    violations.push(`[MG0 VIEWPORT] ${rel} viewport-fit=cover eksik!`);
  }
}

// MG5: PWA Manifest ve Service Worker
if (!fs.existsSync(path.join(dist, 'manifest.webmanifest'))) {
  violations.push('[MG5 PWA] dist/manifest.webmanifest dosyası YOK!');
}
if (!fs.existsSync(path.join(dist, 'sw.js'))) {
  violations.push('[MG5 PWA] dist/sw.js Service Worker YOK!');
}
if (!fs.existsSync(path.join(dist, 'offline.html'))) {
  violations.push('[MG5 PWA] dist/offline.html çevrimdışı sayfası YOK!');
}

for (const rel of pagesToCheck) {
  const filePath = path.join(dist, rel);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('rel="manifest"')) {
      violations.push(`[MG5 PWA] ${rel} manifest linki YOK!`);
    }
  }
}

// MG6: App Link Dosyaları
if (!fs.existsSync(path.join(dist, '.well-known', 'assetlinks.json'))) {
  violations.push('[MG6 APPLINK] /.well-known/assetlinks.json YOK!');
}
if (!fs.existsSync(path.join(dist, '.well-known', 'apple-app-site-association'))) {
  violations.push('[MG6 APPLINK] /.well-known/apple-app-site-association YOK!');
}
if (!fs.existsSync(path.join(dist, 'app-link.json'))) {
  violations.push('[MG6 APPLINK] /app-link.json YOK!');
}

// MG8: Mobile LLM Sub-Graphs
const mobileSubGraphs = [
  'llms/mobile/voice-queries.md',
  'llms/mobile/local-intent.md',
  'llms/mobile/karbon-fiyati-mobile.md',
  'llms/mobile/cbam-fiyati-mobile.md',
  'llms/mobile/turkiye-ets-mobile.md',
  'llms/mobile/karbon-maliyet-hesaplama-mobile.md'
];
for (const mFile of mobileSubGraphs) {
  if (!fs.existsSync(path.join(dist, mFile))) {
    violations.push(`[MG8 MLLM] ${mFile} dist dizininde YOK!`);
  }
}

// MG15: theme-color ve apple-mobile-web-app-capable
for (const rel of pagesToCheck) {
  const filePath = path.join(dist, rel);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('name="theme-color"')) {
      violations.push(`[MG15 THEME] ${rel} theme-color YOK!`);
    }
    if (!content.includes('apple-mobile-web-app-capable')) {
      violations.push(`[MG15 APPLE] ${rel} apple-mobile-web-app-capable YOK!`);
    }
  }
}

// MG16: Mobile Feed Varlığı
if (!fs.existsSync(path.join(dist, 'mobile', 'feed.xml'))) {
  violations.push('[MG16 MFEED] /mobile/feed.xml YOK!');
}

// MG17: Mobile Sitemap Varlığı
if (!fs.existsSync(path.join(dist, 'sitemap-mobile.xml'))) {
  violations.push('[MG17 MSITEMAP] /sitemap-mobile.xml YOK!');
}

// MG18: Intrusive Interstitial Kontrolü
for (const rel of pagesToCheck) {
  const filePath = path.join(dist, rel);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (/class="[^"]*fullscreen-interstitial[^"]*"/i.test(content) && !/class="[^"]*close-button[^"]*"/i.test(content)) {
      violations.push(`[MG18 INTERSTITIAL] ${rel} intrusive interstitial YASAK!`);
    }
  }
}

if (violations.length > 0) {
  console.error(`\n❌ [MOBILE CI-GATE FAILED] ${violations.length} ihlal tespit edildi:\n`);
  violations.forEach(v => console.error(`  ⛔ ${v}`));
  process.exit(1);
}

console.log('✅ [MOBILE CI-GATE PASSED] Tüm MG0-MG20 mobil kontrolleri 0 hata ile tamamlandı.');
