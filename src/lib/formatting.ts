const euro0 = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const euro2 = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percent1 = new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const num0 = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

export function formatEuro(val: number, decimals: 0 | 2 = 0): string {
  return decimals === 0 ? euro0.format(val) : euro2.format(val);
}

export function formatPercent(val: number): string {
  return "%" + percent1.format(val);
}

export function formatNumber(val: number): string {
  return num0.format(val);
}
