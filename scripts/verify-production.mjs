const targets = [
  {
    url: "https://karbonfiyat.com/",
    status: 200,
    contains: "karbonfiyat",
    headers: {
      "strict-transport-security": "max-age=31536000",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=()"
    }
  },
  { url: "https://karbonfiyat.com/fiyatlandirma", status: 200, contains: "FİYATLANDIRMA" },
  { url: "https://karbonfiyat.com/workspace", status: 200, contains: "CARBON FINANCIAL WORKSPACE" },
  { url: "https://karbonfiyat.com/carbon-monitor", status: 200, contains: "CARBON MONITOR WORKBENCH" },
  { url: "https://karbonfiyat.com/musteri-karliligi", status: 200, contains: "CANLI PORTFÖY KARAR MOTORU" },
  { url: "https://karbonfiyat.com/hakkimizda", status: 200, contains: "YAYINCI KİMLİĞİ" },
  { url: "https://karbonfiyat.com/iletisim", status: 200, contains: "analiz@karbonfiyat.com" },
  { url: "https://karbonfiyat.com/gizlilik", status: 200, contains: "GİZLİLİK VE VERİ İŞLEME" },
  { url: "https://karbonfiyat.com/llms.txt", status: 200, contains: "# KarbonFiyat" },
  { url: "https://karbonfiyat.com/llms-full.txt", status: 200, contains: "# KarbonFiyat" },
  { url: "https://karbonfiyat.com/index.md", status: 200, contains: "# KarbonFiyat" },
  { url: "https://karbonfiyat.com/sitemap.xml", status: 200, contains: "/hakkimizda" },
  {
    url: "https://karbonfiyat.com/api/eua-market",
    status: 200,
    contains: "\"provider\":\"EEX\""
  },
  {
    url: "https://europe-west1-studio-7658156126-ffb8e.cloudfunctions.net/leadIntake",
    status: 405,
    contains: "method_not_allowed"
  }
];

const timeoutMs = 12000;
let failed = false;

for (const target of targets) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(target.url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "KarbonFiyat-Production-Verifier/1.1" }
    });
    const body = await response.text();

    const statusOk = response.status === target.status;
    const markerOk = body.includes(target.contains);
    const headerResults = Object.entries(target.headers || {}).map(([name, expected]) => {
      const actual = response.headers.get(name) || "";
      return { name, expected, actual, ok: actual.includes(expected) };
    });
    const headersOk = headerResults.every((item) => item.ok);
    const ok = statusOk && markerOk && headersOk;

    console.log(
      (ok ? "PASS" : "FAIL") +
      " " +
      target.url +
      " -> " +
      response.status +
      " marker=" +
      (markerOk ? "yes" : "no") +
      (target.headers ? " headers=" + (headersOk ? "yes" : "no") : "")
    );

    for (const result of headerResults.filter((item) => !item.ok)) {
      console.error(
        "  HEADER FAIL " + result.name +
        " expected~=" + JSON.stringify(result.expected) +
        " actual=" + JSON.stringify(result.actual)
      );
    }

    if (!ok) failed = true;
  } catch (error) {
    failed = true;
    console.error("FAIL " + target.url + " -> " + (error?.message || error));
  } finally {
    clearTimeout(timer);
  }
}

if (failed) process.exit(1);
console.log("Production verification passed.");
