import type { RiskFlags } from "@/types/ddat"

export const riskFlagDefinitions: Record<
  keyof RiskFlags,
  { label: string; description: string }
> = {
  personhoodSubstitution: {
    label: "Personhood substitution",
    description:
      "The score begins to replace the person, treating measurement as a substitute for human reality.",
  },
  noReentryMechanism: {
    label: "No re-entry mechanism",
    description:
      "The system provides no meaningful route for return, retry, correction, retraining, or reclassification.",
  },
  noAppealMechanism: {
    label: "No appeal mechanism",
    description:
      "The affected subject cannot contest, explain, or challenge the decision.",
  },
  opaqueScoring: {
    label: "Opaque scoring",
    description:
      "The scoring process is not explainable, reviewable, or accountable.",
  },
  excessiveAutomation: {
    label: "Excessive automation",
    description:
      "Automated processing becomes the effective decision-maker rather than an audit-support mechanism.",
  },
  historicalLockIn: {
    label: "Historical lock-in",
    description: "Past data patterns are converted into future fate.",
  },
  povertyPenalty: {
    label: "Poverty penalty",
    description:
      "Poverty-related conditions are converted into lower scores or reduced access.",
  },
  disabilityPenalty: {
    label: "Disability penalty",
    description:
      "Disability, bodily difference, or neurodivergence becomes a basis for exclusion or disadvantage.",
  },
  biologicalFixation: {
    label: "Genetic or biological fixation",
    description:
      "Biological, genetic, bodily, or neurological difference is treated as destiny.",
  },
  proxyDiscrimination: {
    label: "Proxy discrimination",
    description:
      "Apparently neutral variables reproduce race, gender, class, disability, origin, or other protected-status inequalities.",
  },
  responsibilityShift: {
    label: "Institutional responsibility shifted to individuals",
    description:
      "The system converts institutional, environmental, and historical conditions into personal failure.",
  },
  moralizationOfLowScore: {
    label: "Low score converted into moral failure",
    description:
      "A low score is interpreted as laziness, irresponsibility, inferiority, or moral defect.",
  },
  classificationAsExclusion: {
    label: "Classification used as exclusion",
    description:
      "Classification is used to deny access rather than design support.",
  },
  measurementAsOntology: {
    label: "Measurement treated as ontology",
    description:
      "The system mistakes a measurement, model, or score for what the person or situation truly is.",
  },
  shortTermKPI: {
    label: "Short-term KPI replaces long-term development",
    description:
      "Short-term efficiency metrics override learning, repair, maturation, and long-term historical development.",
  },
  surveillanceExpansion: {
    label: "Surveillance expands beyond the original purpose",
    description:
      "Data collection expands beyond the original institutional need and reorganizes broader life conditions.",
  },
  noPeriodicReaudit: {
    label: "No periodic re-audit",
    description:
      "The system is not regularly re-examined for drift, bias, closure, or unintended effects.",
  },
  noHumanReview: {
    label: "No human review",
    description:
      "There is no accountable human review for high-impact decisions.",
  },
  noContextRecovery: {
    label: "No context recovery",
    description:
      "The system does not recover relevant social, bodily, historical, or environmental context.",
  },
  futureClosure: {
    label: "Future possibility closure",
    description:
      "The system narrows future reachable states and turns temporary status into durable exclusion.",
  },
}

export const RISK_KEYS = Object.keys(riskFlagDefinitions) as (keyof RiskFlags)[]
