const targets = [
  { url: "https://karbonfiyat.com/", status: 200, contains: "karbonfiyat" },
  { url: "https://karbonfiyat.com/fiyatlandirma", status: 200, contains: "FİYATLANDIRMA" },
  { url: "https://karbonfiyat.com/workspace", status: 200, contains: "CARBON FINANCIAL WORKSPACE" },
  { url: "https://karbonfiyat.com/carbon-monitor", status: 200, contains: "CARBON MONITOR WORKBENCH" },
  { url: "https://karbonfiyat.com/musteri-karliligi", status: 200, contains: "CANLI PORTFÖY KARAR MOTORU" },
  { url: "https://karbonfiyat.com/sitemap.xml", status: 200, contains: "/workspace" },
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
      headers: { "User-Agent": "KarbonFiyat-Production-Verifier/1.0" }
    });
    const body = await response.text();

    const statusOk = response.status === target.status;
    const markerOk = body.includes(target.contains);
    const ok = statusOk && markerOk;

    console.log(
      (ok ? "PASS" : "FAIL") +
      " " +
      target.url +
      " -> " +
      response.status +
      " marker=" +
      (markerOk ? "yes" : "no")
    );

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
