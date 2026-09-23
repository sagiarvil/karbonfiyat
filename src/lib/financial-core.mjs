export const ENGINE_META = Object.freeze({
  engineVersion: "2026.09.23.2",
  formulaVersion: "carbon-financial-core-v2",
  releaseDate: "2026-09-23"
});

const assertFinite = (value, field, { min = -Infinity, minExclusive = false, max = Infinity } = {}) => {
  if (!Number.isFinite(value)) throw new RangeError(field + " must be finite.");
  if (minExclusive ? value <= min : value < min) throw new RangeError(field + " is below allowed range.");
  if (value > max) throw new RangeError(field + " exceeds allowed range.");
  return value;
};

export function computeCarbonPnlCore(input) {
  const volume = assertFinite(Number(input.volume), "volume", { min: 0, minExclusive: true });
  const intensity = assertFinite(Number(input.intensity), "intensity", { min: 0 });
  const salesPrice = assertFinite(Number(input.salesPrice), "salesPrice", { min: 0, minExclusive: true });
  const productionCost = assertFinite(Number(input.productionCost), "productionCost", { min: 0 });
  const carbonPrice = assertFinite(Number(input.carbonPrice), "carbonPrice", { min: 0 });
  const targetMarginPct = assertFinite(Number(input.targetMarginPct ?? 0), "targetMarginPct", { min: 0, max: 95 });
  const targetMargin = targetMarginPct / 100;

  const emissions = volume * intensity;
  const carbonCostPerTon = intensity * carbonPrice;
  const carbonCost = emissions * carbonPrice;
  const baseUnitProfit = salesPrice - productionCost;
  const afterUnitProfit = baseUnitProfit - carbonCostPerTon;
  const annualRevenue = volume * salesPrice;
  const annualProfitBefore = volume * baseUnitProfit;
  const annualProfitAfter = volume * afterUnitProfit;
  const marginBefore = (baseUnitProfit / salesPrice) * 100;
  const marginAfter = (afterUnitProfit / salesPrice) * 100;
  const marginDelta = marginBefore - marginAfter;
  const protectivePrice = salesPrice + carbonCostPerTon;
  const targetPrice = (productionCost + carbonCostPerTon) / (1 - targetMargin);
  const breakEven = intensity > 0 ? Math.max(0, baseUnitProfit / intensity) : 0;
  const revisionPct = (carbonCostPerTon / salesPrice) * 100;

  let riskLevel = "normal";
  let decision = "Marj korunabilir.";
  if (afterUnitProfit < 0 || marginAfter < 0) {
    riskLevel = "critical";
    decision = "Zarar bölgesi: fiyat revizyonu zorunlu.";
  } else if (marginAfter < 8 || revisionPct > 10) {
    riskLevel = "elevated";
    decision = "Marj baskısı yüksek: sözleşme revizyonu gerekli.";
  }

  return {
    ...ENGINE_META,
    volume,
    intensity,
    salesPrice,
    productionCost,
    carbonPrice,
    targetMarginPct,
    emissions,
    carbonCostPerTon,
    carbonCost,
    annualRevenue,
    annualProfitBefore,
    annualProfitAfter,
    marginBefore,
    marginAfter,
    marginDelta,
    protectivePrice,
    targetPrice,
    breakEven,
    revisionPct,
    riskLevel,
    decision
  };
}


export function computeExposureCore(input) {
  const tonnes = assertFinite(Number(input.tonnes), "tonnes", { min: 0, minExclusive: true });
  const intensity = assertFinite(Number(input.intensity), "intensity", { min: 0 });
  const annualSales = assertFinite(Number(input.annualSales), "annualSales", { min: 0, minExclusive: true });
  const carbonPrice = assertFinite(Number(input.carbonPrice), "carbonPrice", { min: 0 });

  const emissions = tonnes * intensity;
  const carbonCost = emissions * carbonPrice;
  const carbonCostPerTon = carbonCost / tonnes;
  const salesImpactPct = (carbonCost / annualSales) * 100;

  return {
    ...ENGINE_META,
    tonnes,
    intensity,
    annualSales,
    carbonPrice,
    emissions,
    carbonCost,
    carbonCostPerTon,
    salesImpactPct
  };
}

export function computeMonitorCore(input) {
  const volume = assertFinite(Number(input.volume), "volume", { min: 0, minExclusive: true });
  const factor = assertFinite(Number(input.factor), "factor", { min: 0 });
  const base = assertFinite(Number(input.base), "base", { min: 0 });
  const current = assertFinite(Number(input.current), "current", { min: 0 });
  const revenue = assertFinite(Number(input.revenue), "revenue", { min: 0, minExclusive: true });
  const threshold = assertFinite(Number(input.threshold ?? 50000), "threshold", { min: 0, minExclusive: true });

  const priceDelta = current - base;
  const pricePct = base > 0 ? (priceDelta / base) * 100 : 0;
  const baseCost = volume * factor * base;
  const currentCost = volume * factor * current;
  const annualDelta = currentCost - baseCost;
  const monthlyDelta = annualDelta / 12;
  const weeklyDelta = annualDelta / 52;
  const marginErosion = (annualDelta / revenue) * 100;
  const surcharge = factor * priceDelta;

  let level = "NORMAL";
  let levelKey = "normal";
  if (annualDelta > threshold * 2 || pricePct > 25) {
    level = "KRİTİK";
    levelKey = "critical";
  } else if (annualDelta >= threshold || pricePct > 10) {
    level = "YÜKSEK";
    levelKey = "elevated";
  }

  return { ...ENGINE_META, volume, factor, base, current, revenue, threshold, priceDelta, pricePct, baseCost, currentCost, annualDelta, monthlyDelta, weeklyDelta, marginErosion, surcharge, level, levelKey };
}


export function computeTrEtsScenarioCore(input) {
  const carbonPriceTry = assertFinite(Number(input.carbonPriceTry), "carbonPriceTry", { min: 0 });
  const annualEmission = assertFinite(Number(input.annualEmission), "annualEmission", { min: 0 });
  const freeAllocationPct = assertFinite(Number(input.freeAllocationPct), "freeAllocationPct", { min: 0, max: 100 });
  const annualProductionTon = assertFinite(Number(input.annualProductionTon), "annualProductionTon", { min: 0, minExclusive: true });

  const exposedEmission = annualEmission * (1 - freeAllocationPct / 100);
  const netCostTry = exposedEmission * carbonPriceTry;
  const costPerProductionTonTry = netCostTry / annualProductionTon;

  return {
    ...ENGINE_META,
    carbonPriceTry,
    annualEmission,
    freeAllocationPct,
    annualProductionTon,
    exposedEmission,
    netCostTry,
    costPerProductionTonTry,
    modelStatus: "scenario_only"
  };
}

export function computePortfolioCore(customers, carbonPrice, offsetPct = 0) {
  if (!Array.isArray(customers) || customers.length === 0) throw new RangeError("customers must not be empty.");
  const price = assertFinite(Number(carbonPrice), "carbonPrice", { min: 0 });
  const offset = assertFinite(Number(offsetPct), "offsetPct", { min: 0, max: 100 }) / 100;

  let totalRevenue = 0;
  let totalBaseProfit = 0;
  let totalGrossCarbon = 0;
  let totalNetCarbon = 0;
  let criticalCount = 0;

  const evaluations = customers.map((customer, index) => {
    const volume = assertFinite(Number(customer.volume), "customers[" + index + "].volume", { min: 0, minExclusive: true });
    const sales = assertFinite(Number(customer.sales), "customers[" + index + "].sales", { min: 0, minExclusive: true });
    const cost = assertFinite(Number(customer.cost), "customers[" + index + "].cost", { min: 0 });
    const emission = assertFinite(Number(customer.emission), "customers[" + index + "].emission", { min: 0 });

    const revenue = volume * sales;
    const baseProfit = volume * (sales - cost);
    const grossCarbon = volume * emission * price;
    const netCarbon = grossCarbon * (1 - offset);
    const profitAfter = baseProfit - netCarbon;
    const marginBefore = (baseProfit / revenue) * 100;
    const marginAfter = (profitAfter / revenue) * 100;
    const revisionPct = (netCarbon / revenue) * 100;

    let risk = "HEALTHY";
    if (marginAfter < 5) {
      risk = "CRITICAL";
      criticalCount += 1;
    } else if (marginAfter < 14) {
      risk = "REVISION";
    }

    totalRevenue += revenue;
    totalBaseProfit += baseProfit;
    totalGrossCarbon += grossCarbon;
    totalNetCarbon += netCarbon;

    return { ...customer, volume, sales, cost, emission, revenue, baseProfit, grossCarbon, netCarbon, profitAfter, marginBefore, marginAfter, revisionPct, risk };
  });

  const marginBefore = totalRevenue > 0 ? (totalBaseProfit / totalRevenue) * 100 : 0;
  const marginAfter = totalRevenue > 0 ? ((totalBaseProfit - totalNetCarbon) / totalRevenue) * 100 : 0;

  return { ...ENGINE_META, carbonPrice: price, offsetPct: offset * 100, totalRevenue, totalBaseProfit, totalGrossCarbon, totalNetCarbon, marginBefore, marginAfter, marginLoss: marginBefore - marginAfter, criticalCount, evaluations };
}
