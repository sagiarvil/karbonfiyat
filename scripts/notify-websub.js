import https from 'node:https';

const WEBSUB_CONFIG = {
  hubs: [
    'https://pubsubhubbub.appspot.com/',
    'https://pubsubhubbub.superfeedr.com/'
  ],
  feeds: [
    'https://karbonfiyat.com/feed.xml',
    'https://karbonfiyat.com/atom.xml',
    'https://karbonfiyat.com/mobile/feed.xml'
  ]
};

export async function pingWebSubHubs() {
  const params = WEBSUB_CONFIG.feeds.map(f => `hub.url=${encodeURIComponent(f)}`).join('&');
  const payload = params + '&hub.mode=publish';
  const promises = WEBSUB_CONFIG.hubs.map((hub) => {
    return new Promise((resolve) => {
      const u = new URL(hub);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 6000
      }, (res) => resolve({ host: u.hostname, status: res.statusCode, ok: res.statusCode === 204 || res.statusCode === 200 }));
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
      console.log(ok ? `  ✅ [WebSub ${host}] Başarılı (HTTP ${status})` : `  ⚠️ [WebSub ${host}] Hata (HTTP ${status} - ${message || ''})`);
    }
  });
}

const isMain = process.argv[1] && process.argv[1].endsWith('notify-websub.js');
if (isMain) pingWebSubHubs();
