export interface FinancialImpact {
  exposure: number;
  carbonCostPerTon: number;
  currentMarginPercent: number;
  adjustedMarginPercent: number;
  marginDeltaPercent: number;
  requiredSellingPrice: number;
  requiredPriceRevisionPercent: number;
}

export function calculateFinancialImpact(
  volumeTon: number,
  emissionIntensity: number,
  carbonPriceEur: number,
  salesPriceEurPerTon: number,
  productCostEurPerTon: number
): FinancialImpact {
  const v = Math.max(0, volumeTon);
  const e = Math.max(0, emissionIntensity);
  const p = Math.max(0, carbonPriceEur);
  const s = Math.max(0, salesPriceEurPerTon);
  const c = Math.max(0, productCostEurPerTon);

  const exposure = v * e * p;
  const carbonCostPerTon = e * p;

  const currentMarginPercent = s > 0 ? ((s - c) / s) * 100 : 0;
  const totalCostWithCarbon = c + carbonCostPerTon;
  const adjustedMarginPercent = s > 0 ? ((s - totalCostWithCarbon) / s) * 100 : 0;
  const marginDeltaPercent = currentMarginPercent - adjustedMarginPercent;

  // Price required to preserve dollar margin per ton:
  const requiredSellingPrice = s + carbonCostPerTon;
  const requiredPriceRevisionPercent = s > 0 ? (carbonCostPerTon / s) * 100 : 0;

  return {
    exposure,
    carbonCostPerTon,
    currentMarginPercent,
    adjustedMarginPercent,
    marginDeltaPercent,
    requiredSellingPrice,
    requiredPriceRevisionPercent
  };
}
