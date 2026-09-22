export function sanitizePositiveNumber(val: unknown, fallback = 0): number {
  const num = typeof val === "number" ? val : parseFloat(String(val || ""));
  if (isNaN(num) || num < 0) return fallback;
  return num;
}
