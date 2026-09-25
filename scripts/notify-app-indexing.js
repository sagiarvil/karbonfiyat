import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { broadcastToIndexNow } from './notify-indexnow.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function pushAppIndexing() {
  console.log('📱 [App Indexing] Android + iOS deep link dosyaları doğrulanıyor...');

  const assetlinksPath = path.join(__dirname, '..', 'public', '.well-known', 'assetlinks.json');
  const applePath = path.join(__dirname, '..', 'public', '.well-known', 'apple-app-site-association');
  const appLinkPath = path.join(__dirname, '..', 'public', 'app-link.json');

  if (fs.existsSync(assetlinksPath) && fs.existsSync(applePath) && fs.existsSync(appLinkPath)) {
    console.log('  ✅ Deep link dosyaları mevcut.');
    await broadcastToIndexNow([
      'https://karbonfiyat.com/.well-known/assetlinks.json',
      'https://karbonfiyat.com/.well-known/apple-app-site-association',
      'https://karbonfiyat.com/app-link.json',
      'https://karbonfiyat.com/sitemap-apps.xml'
    ]);
  } else {
    console.warn('  ⚠️ Bazı deep link dosyaları eksik.');
  }

  console.log('✅ [App Indexing] Tamamlandı.');
}

const isMain = process.argv[1] && process.argv[1].endsWith('notify-app-indexing.js');
if (isMain) pushAppIndexing();
