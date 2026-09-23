const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const crypto = require("crypto");

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
