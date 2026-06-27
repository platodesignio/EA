export type AuditDomain =
  | "education"
  | "labor"
  | "welfare"
  | "healthcare"
  | "research"
  | "finance"
  | "governance"
  | "platform"
  | "other"

export type AuditTarget = {
  auditTitle: string
  domain: AuditDomain
  systemDescription: string
  evaluator: string
  evaluatedSubject: string
  dataInputs: string
  scoringMethod: string
  decisionOutputs: string
  explanationMechanism: string
  appealMechanism: string
  reentryMechanism: string
  affectedGroups: string
  intendedBenefit: string
  possibleHarm: string
}

export type GenerativeRates = {
  IGR: number
  PDFR: number
  MGR: number
  DRGR: number
  SRGR: number
  TIGR: number
  RCR: number
  FGR: number
  HGR: number
}

export type RiskFlags = {
  personhoodSubstitution: boolean
  noReentryMechanism: boolean
  noAppealMechanism: boolean
  opaqueScoring: boolean
  excessiveAutomation: boolean
  historicalLockIn: boolean
  povertyPenalty: boolean
  disabilityPenalty: boolean
  biologicalFixation: boolean
  proxyDiscrimination: boolean
  responsibilityShift: boolean
  moralizationOfLowScore: boolean
  classificationAsExclusion: boolean
  measurementAsOntology: boolean
  shortTermKPI: boolean
  surveillanceExpansion: boolean
  noPeriodicReaudit: boolean
  noHumanReview: boolean
  noContextRecovery: boolean
  futureClosure: boolean
}

export type RiskPenaltyMap = Record<keyof RiskFlags, number>

export type Intervention = {
  id: string
  title: string
  description: string
  rateChanges: Partial<GenerativeRates>
  removeRisks: Partial<RiskFlags>
}

export type DCRResult = {
  rawDCR: number
  totalPenalty: number
  finalDCR: number
  riskLevel: string
  directionalJudgment: string
}

export type SimulationState = {
  currentRates: GenerativeRates
  currentRisks: RiskFlags
  selectedInterventionIds: string[]
  simulatedRates: GenerativeRates
  simulatedRisks: RiskFlags
  currentDCR: DCRResult
  simulatedDCR: DCRResult
  dcrDelta: number
  removedRisks: string[]
  remainingRisks: string[]
  improvedRates: Partial<GenerativeRates>
}
