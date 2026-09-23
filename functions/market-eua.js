const getPath = (obj, path) => {
  if (!path) return undefined;
  return String(path)
    .split(".")
    .filter(Boolean)
    .reduce((acc, key) => {
      if (acc == null) return undefined;
      const index = /^\d+$/.test(key) ? Number(key) : key;
      return acc[index];
    }, obj);
};

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const asFinite = (value) => {
  const number = typeof value === "string" ? Number.parseFloat(value.replace(",", ".")) : Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const asIso = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const firstRecord = (payload) => {
  if (Array.isArray(payload)) return payload[0] || {};
  if (Array.isArray(payload?.data)) return payload.data[0] || {};
  if (Array.isArray(payload?.results)) return payload.results[0] || {};
  if (Array.isArray(payload?.items)) return payload.items[0] || {};
  return payload || {};
};

const readByConfiguredPathOrFallback = (payload, record, configuredPath, fallbacks) => {
  const configured = configuredPath ? getPath(payload, configuredPath) : undefined;
  if (configured !== undefined) return configured;
  for (const key of fallbacks) {
    const value = firstDefined(getPath(record, key), getPath(payload, key));
    if (value !== undefined) return value;
  }
  return undefined;
};

function normalizeEuaPayload(payload, config = {}) {
  const record = firstRecord(payload);

  const bid = asFinite(readByConfiguredPathOrFallback(payload, record, config.bidPath, [
    "BidPx", "bid", "bestBid", "bidPrice", "priceBid"
  ]));
  const ask = asFinite(readByConfiguredPathOrFallback(payload, record, config.askPath, [
    "AskPx", "ask", "bestAsk", "askPrice", "priceAsk"
  ]));
  const explicitPrice = asFinite(readByConfiguredPathOrFallback(payload, record, config.pricePath, [
    "Px", "LastPx", "last", "lastPrice", "price", "tradePrice", "settlementPrice"
  ]));

  const mid = Number.isFinite(bid) && Number.isFinite(ask) ? (bid + ask) / 2 : undefined;
  const price = firstDefined(explicitPrice, mid, bid, ask);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("EEX payload does not contain a valid EUA price. Configure EEX_EUA_PRICE_PATH/BID_PATH/ASK_PATH against the subscribed endpoint response.");
  }

  const timestampRaw = readByConfiguredPathOrFallback(payload, record, config.timestampPath, [
    "Tm", "timeStamp", "timestamp", "tradeTime", "updatedAt", "published"
  ]);
  const marketTimestamp = asIso(timestampRaw);

  const instrument = String(firstDefined(
    readByConfiguredPathOrFallback(payload, record, config.instrumentPath, [
      "ShortCode", "shortCode", "Instrument", "instrument", "symbol", "product"
    ]),
    config.instrument,
    "EUA"
  ));

  const spread = Number.isFinite(bid) && Number.isFinite(ask) ? ask - bid : undefined;

  return {
    price,
    bid,
    ask,
    spread,
    marketTimestamp,
    instrument,
    priceType: explicitPrice !== undefined ? "last" : mid !== undefined ? "mid" : bid !== undefined ? "bid" : "ask"
  };
}

module.exports = {
  getPath,
  normalizeEuaPayload
};
