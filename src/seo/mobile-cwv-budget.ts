import type { MobileCwvBudget } from './registry.types';

export const CRITICAL_CWV_LIMITS: MobileCwvBudget = {
  lcpMs: 2500,
  inpMs: 200,
  cls: 0.1,
  ttfbMs: 500,
  fcpMs: 2000,
  tbtMs: 500,
  htmlKb: 100,
  jsKb: 250,
  cssKb: 50,
  totalMb: 3.0
};

export function validateCwvBudget(budget: MobileCwvBudget): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (budget.lcpMs > CRITICAL_CWV_LIMITS.lcpMs) errors.push(`LCP ${budget.lcpMs}ms > ${CRITICAL_CWV_LIMITS.lcpMs}ms`);
  if (budget.inpMs > CRITICAL_CWV_LIMITS.inpMs) errors.push(`INP ${budget.inpMs}ms > ${CRITICAL_CWV_LIMITS.inpMs}ms`);
  if (budget.cls > CRITICAL_CWV_LIMITS.cls) errors.push(`CLS ${budget.cls} > ${CRITICAL_CWV_LIMITS.cls}`);
  if (budget.ttfbMs > CRITICAL_CWV_LIMITS.ttfbMs) errors.push(`TTFB ${budget.ttfbMs}ms > ${CRITICAL_CWV_LIMITS.ttfbMs}ms`);
  if (budget.htmlKb > CRITICAL_CWV_LIMITS.htmlKb) errors.push(`HTML ${budget.htmlKb}KB > ${CRITICAL_CWV_LIMITS.htmlKb}KB`);
  if (budget.jsKb > CRITICAL_CWV_LIMITS.jsKb) errors.push(`JS ${budget.jsKb}KB > ${CRITICAL_CWV_LIMITS.jsKb}KB`);
  if (budget.cssKb > CRITICAL_CWV_LIMITS.cssKb) errors.push(`CSS ${budget.cssKb}KB > ${CRITICAL_CWV_LIMITS.cssKb}KB`);
  if (budget.totalMb > CRITICAL_CWV_LIMITS.totalMb) errors.push(`Total ${budget.totalMb}MB > ${CRITICAL_CWV_LIMITS.totalMb}MB`);
  return { ok: errors.length === 0, errors };
}
