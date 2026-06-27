import type {
  AuditDomain,
  GenerativeRates,
  RiskFlags,
  Intervention,
  SimulationState,
} from "@/types/ddat"
import { clamp, calculateFinalDCR } from "./calculateDCR"
import { interventions as allInterventions } from "./interventions"
import { riskFlagDefinitions } from "./riskFlags"

export function applyInterventionsToRates(
  currentRates: GenerativeRates,
  selectedInterventions: Intervention[]
): GenerativeRates {
  const result = { ...currentRates }
  for (const intervention of selectedInterventions) {
    for (const [key, delta] of Object.entries(intervention.rateChanges)) {
      const k = key as keyof GenerativeRates
      result[k] = clamp(result[k] + (delta ?? 0), 0, 5)
    }
  }
  return result
}

export function applyInterventionsToRisks(
  currentRisks: RiskFlags,
  selectedInterventions: Intervention[]
): RiskFlags {
  const result = { ...currentRisks }
  for (const intervention of selectedInterventions) {
    for (const [key, remove] of Object.entries(intervention.removeRisks)) {
      if (remove) result[key as keyof RiskFlags] = false
    }
  }
  return result
}

export function getRemovedRisks(
  currentRisks: RiskFlags,
  simulatedRisks: RiskFlags
): string[] {
  return (Object.keys(currentRisks) as (keyof RiskFlags)[])
    .filter((k) => currentRisks[k] === true && simulatedRisks[k] === false)
    .map((k) => riskFlagDefinitions[k].label)
}

export function getRemainingRisks(simulatedRisks: RiskFlags): string[] {
  return (Object.keys(simulatedRisks) as (keyof RiskFlags)[])
    .filter((k) => simulatedRisks[k] === true)
    .map((k) => riskFlagDefinitions[k].label)
}

export function getImprovedRates(
  currentRates: GenerativeRates,
  simulatedRates: GenerativeRates
): Partial<GenerativeRates> {
  const result: Partial<GenerativeRates> = {}
  for (const key of Object.keys(currentRates) as (keyof GenerativeRates)[]) {
    const delta = simulatedRates[key] - currentRates[key]
    if (delta > 0) result[key] = delta
  }
  return result
}

export function simulateDDATInterventions(
  currentRates: GenerativeRates,
  currentRisks: RiskFlags,
  selectedInterventionIds: string[],
  domain: AuditDomain
): SimulationState {
  const selected = allInterventions.filter((i) =>
    selectedInterventionIds.includes(i.id)
  )

  const simulatedRates = applyInterventionsToRates(currentRates, selected)
  const simulatedRisks = applyInterventionsToRisks(currentRisks, selected)

  const currentDCR = calculateFinalDCR(currentRates, currentRisks, domain)
  const simulatedDCR = calculateFinalDCR(simulatedRates, simulatedRisks, domain)

  return {
    currentRates,
    currentRisks,
    selectedInterventionIds,
    simulatedRates,
    simulatedRisks,
    currentDCR,
    simulatedDCR,
    dcrDelta: Math.round((simulatedDCR.finalDCR - currentDCR.finalDCR) * 10) / 10,
    removedRisks: getRemovedRisks(currentRisks, simulatedRisks),
    remainingRisks: getRemainingRisks(simulatedRisks),
    improvedRates: getImprovedRates(currentRates, simulatedRates),
  }
}
