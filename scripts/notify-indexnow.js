import https from 'node:https';

const INDEXNOW_CONFIG = {
  host: 'karbonfiyat.com',
  key: '6c72e2729a8a4732b13e9a597a7605d3',
  endpoints: [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
    'https://searchadvisor.naver.com/indexnow',
    'https://search.seznam.cz/indexnow'
  ]
};

export async function broadcastToIndexNow(urlList) {
  if (!Array.isArray(urlList) || urlList.length === 0) {
    urlList = [
      'https://karbonfiyat.com/',
      'https://karbonfiyat.com/karbon-fiyati',
      'https://karbonfiyat.com/cbam-fiyati',
      'https://karbonfiyat.com/turkiye-ets',
      'https://karbonfiyat.com/karbon-maliyet-hesaplama',
      'https://karbonfiyat.com/sitemap-mobile.xml',
      'https://karbonfiyat.com/manifest.webmanifest'
    ];
  }
  const payload = JSON.stringify({
    host: INDEXNOW_CONFIG.host,
    key: INDEXNOW_CONFIG.key,
    keyLocation: `https://${INDEXNOW_CONFIG.host}/${INDEXNOW_CONFIG.key}.txt`,
    urlList: urlList
  });
  console.log(`🚀 [IndexNow] ${urlList.length} adet URL ${INDEXNOW_CONFIG.endpoints.length} merkeze yayınlanıyor...`);
  const promises = INDEXNOW_CONFIG.endpoints.map((endpoint) => {
    return new Promise((resolve) => {
      const u = new URL(endpoint);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 6000
      }, (res) => {
        const isOk = res.statusCode === 200 || res.statusCode === 202;
        resolve({ host: u.hostname, status: res.statusCode, ok: isOk });
      });
      req.on('error', (err) => resolve({ host: u.hostname, status: 'ERROR', message: err.message }));
      req.on('timeout', () => { req.destroy(); resolve({ host: u.hostname, status: 'TIMEOUT' }); });
      req.write(payload);
      req.end();
    });
  });
  const results = await Promise.allSettled(promises);
  results.forEach((r) => {
    if (r.status === 'fulfilled') {
      const { host, status, ok, message } = r.value;
      if (ok) console.log(`  ✅ [${host}] Başarılı (HTTP ${status})`);
      else console.warn(`  ⚠️ [${host}] Bildirim sonucu (HTTP ${status} ${message || ''})`);
    }
  });
}

const isMain = process.argv[1] && process.argv[1].endsWith('notify-indexnow.js');
if (isMain) {
  const urls = process.argv.slice(2);
  broadcastToIndexNow(urls.length > 0 ? urls : undefined);
}
