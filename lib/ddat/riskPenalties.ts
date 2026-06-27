import type { RiskFlags, RiskPenaltyMap } from "@/types/ddat"

export const riskPenalties: RiskPenaltyMap = {
  personhoodSubstitution:    15,
  noReentryMechanism:        12,
  noAppealMechanism:         10,
  opaqueScoring:             10,
  excessiveAutomation:        8,
  historicalLockIn:          10,
  povertyPenalty:            10,
  disabilityPenalty:         10,
  biologicalFixation:        15,
  proxyDiscrimination:       15,
  responsibilityShift:       10,
  moralizationOfLowScore:    12,
  classificationAsExclusion: 10,
  measurementAsOntology:     15,
  shortTermKPI:               8,
  surveillanceExpansion:     12,
  noPeriodicReaudit:          6,
  noHumanReview:              8,
  noContextRecovery:         10,
  futureClosure:             15,
}

export function calculateTotalPenalty(risks: RiskFlags): number {
  return (Object.keys(risks) as (keyof RiskFlags)[]).reduce(
    (sum, key) => sum + (risks[key] ? riskPenalties[key] : 0),
    0
  )
}
