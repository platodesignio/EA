import type { Intervention } from "@/types/ddat"

export const interventions: Intervention[] = [
  {
    id: "addAppealMechanism",
    title: "Add appeal mechanism",
    description:
      "Create a route for affected subjects to contest, explain, and challenge the decision.",
    rateChanges: { MGR: 0.5, RCR: 1.0, FGR: 0.5 },
    removeRisks: { noAppealMechanism: true },
  },
  {
    id: "addReentryPathway",
    title: "Add re-entry pathway",
    description:
      "Create routes for retry, reclassification, retraining, reapplication, or recovery after a negative decision.",
    rateChanges: { TIGR: 0.8, RCR: 1.5, FGR: 0.8 },
    removeRisks: { noReentryMechanism: true, futureClosure: true },
  },
  {
    id: "addHumanReview",
    title: "Add human review",
    description:
      "Add accountable human review for high-impact decisions and prevent automation from becoming the sole decision-maker.",
    rateChanges: { IGR: 0.5, MGR: 0.5, SRGR: 0.5 },
    removeRisks: { noHumanReview: true, excessiveAutomation: true },
  },
  {
    id: "addExplanationRequirement",
    title: "Add explanation requirement",
    description:
      "Require meaningful, contestable, and understandable explanations for scores, classifications, and decisions.",
    rateChanges: { IGR: 0.5, MGR: 1.0, SRGR: 0.5 },
    removeRisks: { opaqueScoring: true },
  },
  {
    id: "addContextRecovery",
    title: "Add context recovery",
    description:
      "Recover relevant bodily, social, environmental, institutional, and historical context before final judgment.",
    rateChanges: { IGR: 1.0, PDFR: 0.5, SRGR: 1.0, FGR: 0.5 },
    removeRisks: { noContextRecovery: true, responsibilityShift: true },
  },
  {
    id: "reduceAutomation",
    title: "Reduce automation",
    description:
      "Reduce automated decision-making and reposition AI as an audit-support mechanism rather than the final authority.",
    rateChanges: { MGR: 0.5, SRGR: 0.5, FGR: 0.4 },
    removeRisks: { excessiveAutomation: true },
  },
  {
    id: "addPeriodicReaudit",
    title: "Add periodic re-audit",
    description:
      "Add recurring audits for drift, bias, closure, degradation, and unintended institutional effects.",
    rateChanges: { TIGR: 0.7, HGR: 0.8, SRGR: 0.5 },
    removeRisks: { noPeriodicReaudit: true },
  },
  {
    id: "convertExclusionIntoSupport",
    title: "Convert exclusion into support recommendation",
    description:
      "Convert low scores or negative classifications into support, training, mediation, or redesign recommendations rather than exclusion.",
    rateChanges: { DRGR: 1.0, SRGR: 1.0, RCR: 1.0, FGR: 1.2 },
    removeRisks: { classificationAsExclusion: true, futureClosure: true },
  },
  {
    id: "addInstitutionalResponsibilityCorrection",
    title: "Add institutional responsibility correction",
    description:
      "Prevent the system from converting institutional, historical, or environmental conditions into individual moral failure.",
    rateChanges: { SRGR: 1.5, DRGR: 0.5, FGR: 0.5 },
    removeRisks: { responsibilityShift: true, moralizationOfLowScore: true },
  },
  {
    id: "reduceSurveillanceScope",
    title: "Reduce surveillance scope",
    description:
      "Restrict data collection to the minimum necessary purpose and prevent monitoring from expanding across life domains.",
    rateChanges: { PDFR: 0.5, FGR: 0.7, HGR: 0.5 },
    removeRisks: { surveillanceExpansion: true },
  },
  {
    id: "preventPersonhoodSubstitution",
    title: "Prevent personhood substitution",
    description:
      "Explicitly prohibit treating scores, rankings, or classifications as substitutes for the person or their total reality.",
    rateChanges: { PDFR: 1.0, MGR: 0.5, FGR: 1.0 },
    removeRisks: { personhoodSubstitution: true, measurementAsOntology: true },
  },
  {
    id: "preserveLongTermDevelopment",
    title: "Preserve long-term development",
    description:
      "Protect maturation, learning, historical change, and long-term development from short-term KPI compression.",
    rateChanges: { TIGR: 1.0, HGR: 1.5, FGR: 0.8 },
    removeRisks: { historicalLockIn: true, shortTermKPI: true },
  },
]
