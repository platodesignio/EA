import type { AuditTarget, GenerativeRates, RiskFlags } from "@/types/ddat"

export const sampleAuditTarget: AuditTarget = {
  auditTitle: "AI Hiring Score Audit",
  domain: "labor",
  systemDescription:
    "An AI hiring system ranks applicants based on resume data, interview video analysis, personality prediction, and historical employee performance data. The ranking is used to decide who advances to human interview.",
  evaluator: "Employer using an AI hiring platform",
  evaluatedSubject: "Job applicants",
  dataInputs:
    "Resume, education history, prior employment, interview video, speech pattern, facial analysis, personality test, historical employee data.",
  scoringMethod: "Predictive ranking model trained on past successful employees.",
  decisionOutputs: "Advance, reject, hold.",
  explanationMechanism: "Limited automated explanation.",
  appealMechanism: "None.",
  reentryMechanism: "None.",
  affectedGroups:
    "Applicants with non-linear careers, disabilities, accents, caregiving gaps, unconventional backgrounds, and lower access to elite credentials.",
  intendedBenefit: "Reduce hiring workload and improve matching efficiency.",
  possibleHarm:
    "Historical bias, personhood substitution, future closure, opacity, and lack of re-entry.",
}

export const sampleRates: GenerativeRates = {
  IGR: 2,
  PDFR: 1,
  MGR: 2,
  DRGR: 1.5,
  SRGR: 1,
  TIGR: 0.5,
  RCR: 0.5,
  FGR: 1,
  HGR: 1,
}

export const sampleRisks: RiskFlags = {
  personhoodSubstitution:    true,
  noReentryMechanism:        true,
  noAppealMechanism:         true,
  opaqueScoring:             true,
  excessiveAutomation:       false,
  historicalLockIn:          true,
  povertyPenalty:            false,
  disabilityPenalty:         false,
  biologicalFixation:        false,
  proxyDiscrimination:       true,
  responsibilityShift:       true,
  moralizationOfLowScore:    false,
  classificationAsExclusion: false,
  measurementAsOntology:     true,
  shortTermKPI:              false,
  surveillanceExpansion:     false,
  noPeriodicReaudit:         false,
  noHumanReview:             false,
  noContextRecovery:         true,
  futureClosure:             true,
}
