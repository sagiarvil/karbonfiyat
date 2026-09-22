export function calculateExposure(volumeTon: number, emissionIntensity: number, carbonPriceEur: number): number {
  return Math.max(0, volumeTon) * Math.max(0, emissionIntensity) * Math.max(0, carbonPriceEur);
}

export function calculateCostPerTon(emissionIntensity: number, carbonPriceEur: number): number {
  return Math.max(0, emissionIntensity) * Math.max(0, carbonPriceEur);
}
