import assert from "node:assert/strict";
import { computeCarbonPnlCore, computeExposureCore, computeMonitorCore, computePortfolioCore, computeTrEtsScenarioCore } from "../src/lib/financial-core.mjs";

const approx = (actual, expected, eps = 1e-8) => assert.ok(Math.abs(actual - expected) <= eps, actual + " != " + expected);

{
  const r = computeCarbonPnlCore({ volume: 1000, intensity: 1.8, salesPrice: 850, productionCost: 620, carbonPrice: 75.28, targetMarginPct: 20 });
  approx(r.emissions, 1800);
  approx(r.carbonCost, 135504);
  approx(r.carbonCostPerTon, 135.504);
  approx(r.marginBefore, (230 / 850) * 100);
  approx(r.marginAfter, ((230 - 135.504) / 850) * 100);
  approx(r.protectivePrice, 985.504);
  approx(r.breakEven, 230 / 1.8);
  assert.equal(r.riskLevel, "elevated");
}

{
  const r = computeCarbonPnlCore({ volume: 100, intensity: 3, salesPrice: 700, productionCost: 650, carbonPrice: 100, targetMarginPct: 20 });
  assert.equal(r.riskLevel, "critical");
  assert.ok(r.marginAfter < 0);
}

assert.throws(() => computeCarbonPnlCore({ volume: 0, intensity: 1, salesPrice: 1, productionCost: 0, carbonPrice: 1, targetMarginPct: 0 }), RangeError);
assert.throws(() => computeCarbonPnlCore({ volume: 1, intensity: -1, salesPrice: 1, productionCost: 0, carbonPrice: 1, targetMarginPct: 0 }), RangeError);

{
  const r = computeExposureCore({ tonnes: 1000, intensity: 1.8, annualSales: 2500000, carbonPrice: 75.28 });
  approx(r.emissions, 1800);
  approx(r.carbonCost, 135504);
  approx(r.carbonCostPerTon, 135.504);
  approx(r.salesImpactPct, (135504 / 2500000) * 100);
}

assert.throws(() => computeExposureCore({ tonnes: 0, intensity: 1.8, annualSales: 2500000, carbonPrice: 75.28 }), RangeError);
assert.throws(() => computeExposureCore({ tonnes: 1000, intensity: 1.8, annualSales: 0, carbonPrice: 75.28 }), RangeError);

{
  const r = computeMonitorCore({ volume: 10000, factor: 1.84, base: 75.28, current: 90, revenue: 8500000, threshold: 50000 });
  approx(r.annualDelta, 10000 * 1.84 * (90 - 75.28));
  approx(r.monthlyDelta, r.annualDelta / 12);
  approx(r.weeklyDelta, r.annualDelta / 52);
  assert.equal(r.levelKey, "critical");
}

{
  const r = computeMonitorCore({ volume: 1000, factor: 1, base: 100, current: 90, revenue: 1000000, threshold: 50000 });
  assert.ok(r.annualDelta < 0);
  assert.equal(r.levelKey, "normal");
}

assert.throws(() => computeMonitorCore({ volume: 0, factor: 1, base: 1, current: 1, revenue: 1, threshold: 1 }), RangeError);

{
  const r = computeTrEtsScenarioCore({ carbonPriceTry: 850, annualEmission: 50000, freeAllocationPct: 60, annualProductionTon: 70000 });
  approx(r.exposedEmission, 20000);
  approx(r.netCostTry, 17000000);
  approx(r.costPerProductionTonTry, 17000000 / 70000);
  assert.equal(r.modelStatus, "scenario_only");
}

assert.throws(() => computeTrEtsScenarioCore({ carbonPriceTry: 850, annualEmission: 50000, freeAllocationPct: 101, annualProductionTon: 70000 }), RangeError);
assert.throws(() => computeTrEtsScenarioCore({ carbonPriceTry: 850, annualEmission: 50000, freeAllocationPct: 60, annualProductionTon: 0 }), RangeError);

{
  const r = computePortfolioCore([
    { client: "A", volume: 1000, sales: 850, cost: 620, emission: 1.84 },
    { client: "B", volume: 500, sales: 800, cost: 700, emission: 2.0 }
  ], 75.28, 0);
  assert.equal(r.evaluations.length, 2);
  assert.ok(r.totalRevenue > 0);
  approx(r.totalNetCarbon, r.totalGrossCarbon);
}

{
  const gross = computePortfolioCore([{ client: "A", volume: 1000, sales: 850, cost: 620, emission: 1.84 }], 75.28, 0);
  const half = computePortfolioCore([{ client: "A", volume: 1000, sales: 850, cost: 620, emission: 1.84 }], 75.28, 50);
  approx(half.totalNetCarbon, gross.totalNetCarbon * 0.5);
}

assert.throws(() => computePortfolioCore([], 75.28, 0), RangeError);
assert.throws(() => computePortfolioCore([{ client: "A", volume: 0, sales: 850, cost: 620, emission: 1.84 }], 75.28, 0), RangeError);
assert.throws(() => computePortfolioCore([{ client: "A", volume: 1, sales: 850, cost: 620, emission: 1.84 }], 75.28, 101), RangeError);

console.log("Engine regression checks passed.");
