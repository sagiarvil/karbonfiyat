export function buildAssetLinks(packageName: string = 'com.karbonfiyat.app', sha256Fingerprint: string = '14:6D:E9:A5:0F:8E:2A:B1:90:85:2F:56:4C:98:B7:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12') {
  return [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: packageName,
        sha256_cert_fingerprints: [sha256Fingerprint]
      }
    }
  ];
}

export function buildAppleAppSiteAssociation(teamId: string = '9XYZABC123', bundleId: string = 'com.karbonfiyat.app') {
  return {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${teamId}.${bundleId}`,
          paths: ['*']
        }
      ]
    }
  };
}

export function buildAppLinkJson(origin: string = 'https://karbonfiyat.com') {
  return {
    version: '1.0',
    origin,
    routes: [
      { web: '/', app: 'karbonfiyat://home' },
      { web: '/karbon-fiyati', app: 'karbonfiyat://market/live' },
      { web: '/cbam-fiyati', app: 'karbonfiyat://cbam/rates' },
      { web: '/turkiye-ets', app: 'karbonfiyat://ets/regulation' },
      { web: '/karbon-maliyet-hesaplama', app: 'karbonfiyat://calc/loss' },
      { web: '/fiyatlandirma', app: 'karbonfiyat://pricing' },
      { web: '/workspace', app: 'karbonfiyat://workspace' }
    ]
  };
}
