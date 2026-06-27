import type { AuditResult, GenerativeRateScore } from "@/types/madan"

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

export function calculateMADANDCR(
  result: Pick<
    AuditResult,
    | "nineRates"
    | "reentryScore"
    | "bodyLoadRisk"
    | "institutionFixationRisk"
    | "transgressionRisk"
    | "futureClosureRisk"
  >
): number {
  const { nineRates, reentryScore, bodyLoadRisk, institutionFixationRisk, transgressionRisk, futureClosureRisk } = result

  const baseDCR =
    nineRates.length > 0
      ? nineRates.reduce((sum: number, r: GenerativeRateScore) => sum + r.score, 0) / nineRates.length
      : 0

  const dcr =
    baseDCR -
    futureClosureRisk * 0.15 -
    institutionFixationRisk * 0.15 -
    bodyLoadRisk * 0.1 -
    transgressionRisk * 0.1 +
    reentryScore * 0.2

  return clamp(dcr, -5, 5)
}

export function getFinalJudgment(dcr: number): string {
  if (dcr >= 3.5) return "Strongly Freedom-Generative"
  if (dcr >= 1.5) return "Conditionally Freedom-Generative"
  if (dcr >= -1.49) return "Ambiguous / Requires Further Audit"
  if (dcr >= -3.49) return "Freedom-Closing"
  return "Dangerously Freedom-Closing"
}
