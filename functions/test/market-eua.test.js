const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeEuaPayload } = require("../market-eua");

test("normalizes explicit EEX trade-style price", () => {
  const q = normalizeEuaPayload([{ Px: 86.03, Tm: "2026-09-23T10:40:00Z", ShortCode: "EUA" }]);
  assert.equal(q.price, 86.03);
  assert.equal(q.priceType, "last");
  assert.equal(q.marketTimestamp, "2026-09-23T10:40:00.000Z");
});

test("uses mid price when top-of-book has bid and ask", () => {
  const q = normalizeEuaPayload({ data: [{ BidPx: 85.98, AskPx: 86.02, Tm: "2026-09-23T10:40:01.123456Z" }] });
  assert.equal(q.price, 86);
  assert.equal(q.bid, 85.98);
  assert.equal(q.ask, 86.02);
  assert.ok(Math.abs(q.spread - 0.04) < 1e-9);
  assert.equal(q.priceType, "mid");
});

test("supports configured nested JSON paths", () => {
  const payload = { result: { quote: { last: "87.20", time: "2026-09-23T10:40:02Z" } } };
  const q = normalizeEuaPayload(payload, {
    pricePath: "result.quote.last",
    timestampPath: "result.quote.time",
    instrument: "EUA-CUSTOM"
  });
  assert.equal(q.price, 87.2);
  assert.equal(q.instrument, "EUA-CUSTOM");
});

test("rejects payload without a valid price", () => {
  assert.throws(() => normalizeEuaPayload({ data: [] }), /valid EUA price/);
});
