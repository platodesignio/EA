import type { AuditDomain, GenerativeRates, RiskFlags, DCRResult } from "@/types/ddat"
import { domainIdealVectors } from "./domainVectors"
import { calculateTotalPenalty } from "./riskPenalties"

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function ratesToVector(rates: GenerativeRates): number[] {
  return [
    rates.IGR,
    rates.PDFR,
    rates.MGR,
    rates.DRGR,
    rates.SRGR,
    rates.TIGR,
    rates.RCR,
    rates.FGR,
    rates.HGR,
  ]
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
  if (magA === 0 || magB === 0) return 0
  const result = dot / (magA * magB)
  return isNaN(result) ? 0 : result
}

export function calculateRawDCR(rates: GenerativeRates, domain: AuditDomain): number {
  const v = ratesToVector(rates)
  const fStar = domainIdealVectors[domain]
  return Math.round(cosineSimilarity(v, fStar) * 100 * 10) / 10
}

export function getRiskLevel(finalDCR: number): string {
  if (finalDCR >= 80) return "Freedom-generative"
  if (finalDCR >= 60) return "Conditionally generative"
  if (finalDCR >= 40) return "Ambivalent / unstable"
  if (finalDCR >= 20) return "Freedom-closing"
  return "Severe closure"
}

export function getDirectionalJudgment(finalDCR: number): string {
  if (finalDCR >= 80)
    return "This system is broadly freedom-generative, provided that periodic re-audit, appeal, and context recovery remain active."
  if (finalDCR >= 60)
    return "This system is conditionally freedom-generative, but it contains unresolved risks that may become freedom-closing under institutional pressure."
  if (finalDCR >= 40)
    return "This system is directionally unstable. It contains both generative and closing tendencies. It should not be deployed without redesign."
  if (finalDCR >= 20)
    return "This system is freedom-closing. It narrows future possibilities, weakens re-entry, and risks converting measurement into institutional fate."
  return "This system shows severe closure. It should be suspended, redesigned, or rejected before deployment."
}

export function calculateFinalDCR(
  rates: GenerativeRates,
  risks: RiskFlags,
  domain: AuditDomain
): DCRResult {
  const rawDCR = calculateRawDCR(rates, domain)
  const totalPenalty = calculateTotalPenalty(risks)
  const finalDCR = clamp(rawDCR - totalPenalty, 0, 100)
  return {
    rawDCR,
    totalPenalty,
    finalDCR,
    riskLevel: getRiskLevel(finalDCR),
    directionalJudgment: getDirectionalJudgment(finalDCR),
  }
}
