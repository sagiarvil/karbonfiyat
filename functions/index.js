const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const crypto = require("crypto");
const { normalizeEuaPayload } = require("./market-eua");

const eexApiKey = defineSecret("EEX_API_KEY");
const eexEuaMarketUrl = defineString("EEX_EUA_MARKET_URL", { default: "" });
const eexPricePath = defineString("EEX_EUA_PRICE_PATH", { default: "" });
const eexBidPath = defineString("EEX_EUA_BID_PATH", { default: "" });
const eexAskPath = defineString("EEX_EUA_ASK_PATH", { default: "" });
const eexTimestampPath = defineString("EEX_EUA_TIMESTAMP_PATH", { default: "" });
const eexInstrumentPath = defineString("EEX_EUA_INSTRUMENT_PATH", { default: "" });
const eexInstrument = defineString("EEX_EUA_INSTRUMENT", { default: "EUA" });

let euaCache = {
  fetchedAt: 0,
  quote: null,
  error: null
};
const EUA_CACHE_MS = 5000;


initializeApp();

const db = getFirestore();

const allowedOrigins = new Set([
  "https://karbonfiyat.com",
  "https://www.karbonfiyat.com",
  "https://karbonfiyat.web.app"
]);

const text = (value, max = 300) =>
  String(value ?? "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);

const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneOk = (value) => /^[0-9+()\s.-]{7,30}$/.test(value);

const applyCors = (req, res) => {
  const origin = req.get("origin");
  if (origin && allowedOrigins.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
  res.set("Access-Control-Max-Age", "3600");
};

const json = (res, status, payload) => {
  res.status(status);
  res.set("Cache-Control", "no-store");
  res.set("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(payload));
};

exports.leadIntake = onRequest(
  {
    region: "europe-west1",
    invoker: "public",
    timeoutSeconds: 15,
    memory: "256MiB",
    maxInstances: 5
  },
  async (req, res) => {
    applyCors(req, res);

    const origin = req.get("origin");
    if (origin && !allowedOrigins.has(origin)) {
      return json(res, 403, { ok: false, error: "origin_not_allowed" });
    }

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      res.set("Allow", "POST, OPTIONS");
      return json(res, 405, { ok: false, error: "method_not_allowed" });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (body.website) {
      return json(res, 200, { ok: true, requestId: "ignored" });
    }

    const payload = {
      company: text(body.company, 180),
      name: text(body.name, 140),
      phone: text(body.phone, 40),
      email: text(body.email, 180).toLowerCase(),
      sector: text(body.sector, 100),
      volume: text(body.volume, 80),
      service: text(body.service || "Ön Analiz 4.900 TL + KDV", 140),
      clientRequestId: text(body.clientRequestId, 96),
      consent: body.consent === true
    };

    if (!payload.company || !payload.name || !payload.email || !payload.phone || !payload.sector) {
      return json(res, 422, { ok: false, error: "missing_required_fields" });
    }

    if (!emailOk(payload.email) || !phoneOk(payload.phone)) {
      return json(res, 422, { ok: false, error: "invalid_contact_fields" });
    }

    if (!payload.consent) {
      return json(res, 422, { ok: false, error: "consent_required" });
    }

    if (!/^KF-LEAD-[A-Z0-9-]{8,80}$/.test(payload.clientRequestId)) {
      return json(res, 422, { ok: false, error: "invalid_request_id" });
    }

    const leadRef = db.collection("leads").doc(payload.clientRequestId);
    const existing = await leadRef.get();
    if (existing.exists) {
      return json(res, 200, { ok: true, requestId: payload.clientRequestId, idempotent: true });
    }

    const forwarded = req.get("x-forwarded-for") || req.ip || "unknown";
    const ip = forwarded.split(",")[0].trim();
    const hourKey = new Date().toISOString().slice(0, 13);
    const ipHash = crypto.createHash("sha256").update(ip + "|" + hourKey).digest("hex").slice(0, 24);
    const rateRef = db.collection("_leadRateLimits").doc(ipHash);

    try {
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(rateRef);
        const count = snap.exists ? Number(snap.data().count || 0) : 0;
        if (count >= 8) throw new Error("rate_limited");
        tx.set(rateRef, {
          count: count + 1,
          hourKey,
          updatedAt: FieldValue.serverTimestamp()
        }, { merge: true });
      });
    } catch (error) {
      if (error && error.message === "rate_limited") {
        return json(res, 429, { ok: false, error: "rate_limited" });
      }
      console.error("rate_limit_error", error);
      return json(res, 500, { ok: false, error: "storage_unavailable" });
    }

    const requestId = payload.clientRequestId;

    try {
      await leadRef.set({
        ...payload,
        requestId,
        status: "new",
        source: "karbonfiyat.com",
        createdAt: FieldValue.serverTimestamp(),
        consentAt: FieldValue.serverTimestamp(),
        userAgent: text(req.get("user-agent"), 260)
      });

      return json(res, 201, { ok: true, requestId });
    } catch (error) {
      console.error("lead_write_error", error);
      return json(res, 500, { ok: false, error: "storage_unavailable" });
    }
  }
);


exports.euaMarket = onRequest(
  {
    region: "europe-west1",
    invoker: "public",
    timeoutSeconds: 12,
    memory: "256MiB",
    maxInstances: 1,
    concurrency: 80,
    secrets: [eexApiKey]
  },
  async (req, res) => {
    res.set("Cache-Control", "no-store, max-age=0");
    res.set("Content-Type", "application/json; charset=utf-8");
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "GET") {
      res.set("Allow", "GET, OPTIONS");
      return res.status(405).send(JSON.stringify({ ok: false, error: "method_not_allowed" }));
    }

    const now = Date.now();
    if (euaCache.quote && now - euaCache.fetchedAt < EUA_CACHE_MS) {
      return res.status(200).send(JSON.stringify({
        ok: true,
        source: "EEX Group DataSource REST API v2",
        freshness: "cache",
        serverTimestamp: new Date(now).toISOString(),
        ...euaCache.quote
      }));
    }

    const url = eexEuaMarketUrl.value().trim();
    if (!url) {
      return res.status(503).send(JSON.stringify({
        ok: false,
        error: "eex_url_not_configured",
        message: "EEX_EUA_MARKET_URL is not configured."
      }));
    }

    const token = eexApiKey.value();
    if (!token) {
      return res.status(503).send(JSON.stringify({
        ok: false,
        error: "eex_api_key_not_configured"
      }));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    const requestStarted = Date.now();

    try {
      const upstream = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Accept": "application/json",
          "User-Agent": "KarbonFiyat-EUA-Market-Monitor/1.0"
        },
        signal: controller.signal
      });

      const rawText = await upstream.text();
      if (!upstream.ok) {
        throw new Error("EEX upstream HTTP " + upstream.status + ": " + rawText.slice(0, 180));
      }

      let payload;
      try {
        payload = JSON.parse(rawText);
      } catch {
        throw new Error("EEX upstream returned non-JSON data.");
      }

      const normalized = normalizeEuaPayload(payload, {
        pricePath: eexPricePath.value().trim(),
        bidPath: eexBidPath.value().trim(),
        askPath: eexAskPath.value().trim(),
        timestampPath: eexTimestampPath.value().trim(),
        instrumentPath: eexInstrumentPath.value().trim(),
        instrument: eexInstrument.value().trim() || "EUA"
      });

      const receivedAt = new Date().toISOString();
      const marketAgeMs = normalized.marketTimestamp
        ? Math.max(0, Date.now() - new Date(normalized.marketTimestamp).getTime())
        : null;

      const quote = {
        provider: "EEX",
        venue: "EEX",
        currency: "EUR",
        unit: "tCO2",
        price: normalized.price,
        bid: normalized.bid ?? null,
        ask: normalized.ask ?? null,
        spread: normalized.spread ?? null,
        instrument: normalized.instrument,
        priceType: normalized.priceType,
        marketTimestamp: normalized.marketTimestamp ?? null,
        receivedAt,
        marketAgeMs,
        upstreamLatencyMs: Date.now() - requestStarted
      };

      euaCache = { fetchedAt: Date.now(), quote, error: null };

      return res.status(200).send(JSON.stringify({
        ok: true,
        source: "EEX Group DataSource REST API v2",
        freshness: "upstream",
        serverTimestamp: receivedAt,
        ...quote
      }));
    } catch (error) {
      const detail = error?.name === "AbortError" ? "upstream_timeout" : String(error?.message || error);
      euaCache.error = { at: Date.now(), detail };

      if (euaCache.quote) {
        return res.status(200).send(JSON.stringify({
          ok: true,
          source: "EEX Group DataSource REST API v2",
          freshness: "stale-fallback",
          serverTimestamp: new Date().toISOString(),
          warning: detail,
          ...euaCache.quote
        }));
      }

      console.error("eua_market_error", error);
      return res.status(502).send(JSON.stringify({
        ok: false,
        error: "eex_upstream_unavailable",
        detail
      }));
    } finally {
      clearTimeout(timer);
    }
  }
);
