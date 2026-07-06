// ─── CEO AI Accountability Console — Scoring Logic ─────────────────────────
// Pure, deterministic functions only. Nothing here touches state or the DOM.
//
// Three outputs are kept structurally separate and are never merged into a
// single number: (1) risk domains, (2) positive capacity domains, and
// (3) evidence confidence. Confidence describes how well-supported the
// inputs are; risk/capacity describe what the inputs say once you trust
// them. A console that folded confidence into risk would let an
// unverified, self-reported "everything is fine" answer look identical to
// an independently verified one.

import type {
  AnswerScale,
  MasterFunctionAnswers,
  MasterFunctionResult,
  DeclaredMasterFunction,
  OperationalFunctionLabel,
  RiskLevel,
  DecisionStageKey,
  DecisionStageData,
  ChainItemKey,
  ChainItemData,
  EvidenceTier,
  ResponsibilityClarity,
  ScanEvidenceBasis,
  EvidenceConfidenceResult,
  ConfidenceLevel,
  ContradictionIndexResult,
  ContradictionCheck,
  RiskDashboardResult,
  RiskDomainKey,
  CapacityDomainKey,
  PreliminaryRiskCategory,
  AuditUnit,
} from "./types"
import { DECISION_STAGE_LABEL, CHAIN_ITEM_LABEL, MAJOR_LIFE_CONSEQUENCES } from "./questions"

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

function clamp04(n: number): number {
  return clamp(Math.round(n), 0, 4)
}

// ─── Section 3 — Master Function Detection ─────────────────────────────────

const ANSWER_VALUE: Record<AnswerScale, number> = {
  no: 0,
  weakly: 1,
  partially: 2,
  strongly: 3,
  structurally: 4,
}

// Which operational function(s) a declared label would be expected to map
// onto. An empty list ("other") means no specific operational function is
// implied, so any strong operational signal is treated as a mismatch.
const DECLARED_EQUIVALENTS: Record<DeclaredMasterFunction, OperationalFunctionLabel[]> = {
  ranking: ["Ranking"],
  scoring: ["Scoring"],
  prediction: ["Prediction"],
  recommendation: ["Recommendation"],
  risk_classification: ["Scoring", "Access Control"],
  access_control: ["Access Control"],
  productivity_monitoring: ["Productivity Monitoring"],
  reputation_system: ["Ranking"],
  behavioral_nudging: ["Recommendation"],
  automated_exclusion: ["Automated Exclusion"],
  other: [],
}

export function deriveMasterFunction(
  declared: DeclaredMasterFunction,
  answers: MasterFunctionAnswers
): MasterFunctionResult {
  const v = (k: keyof MasterFunctionAnswers) => ANSWER_VALUE[answers[k]]
  const overrideValue = v("human_override_possible")
  const overrideWeakness = 4 - overrideValue

  // Automated Exclusion is the only operational function that isn't read
  // directly off a single question — it's the exclusion question tempered
  // by how little a human can actually override it. A system that can
  // exclude strongly but where a human always overrides first is not
  // "automated" in the sense this console cares about.
  const automatedExclusion = Math.round((v("can_exclude_automatically") + overrideWeakness) / 2)

  const scores: Record<OperationalFunctionLabel, number> = {
    "Ranking": v("visibility_control"),
    "Scoring": v("score_affects_access"),
    "Prediction": v("predicts_future_behavior"),
    "Recommendation": v("recommendation_shapes_choice"),
    "Access Control": v("allows_denies_access"),
    "Productivity Monitoring": v("monitors_productivity"),
    "Automated Exclusion": automatedExclusion,
  }

  const ranked = (Object.entries(scores) as [OperationalFunctionLabel, number][])
    .sort((a, b) => b[1] - a[1])

  // Take the top three functions that reach at least "partially" (2). If
  // none do, still surface the single highest-scoring function so the
  // report never shows an empty operational reading.
  let operational = ranked.filter(([, s]) => s >= 2).slice(0, 3).map(([label]) => label)
  if (operational.length === 0) operational = [ranked[0][0]]

  const equivalents = DECLARED_EQUIVALENTS[declared]
  const declaredMismatch =
    equivalents.length > 0
      ? !operational.some(op => equivalents.includes(op))
      : operational.some(op => scores[op] >= 2)

  const maxScore = ranked[0][1]
  const strongOperational = maxScore >= 3
  const weakOverride = overrideValue <= 1
  const accessAffected = scores["Access Control"] >= 2 || scores["Automated Exclusion"] >= 2 || scores["Ranking"] >= 2

  let contradictionRisk: RiskLevel
  if (declaredMismatch && strongOperational && weakOverride && accessAffected) {
    contradictionRisk = "High"
  } else if ((declaredMismatch || strongOperational) && (weakOverride || accessAffected)) {
    contradictionRisk = "Medium"
  } else {
    contradictionRisk = "Low"
  }

  return { declared, operational, operationalScores: scores, contradictionRisk }
}

// ─── Section 5 — Evidence Confidence ───────────────────────────────────────
// Each evidence tier caps confidence at a fixed ceiling regardless of how
// many stages report that tier — one self-reported claim and ten
// self-reported claims are equally unverified. Confidence rises only when
// a stronger tier is recorded somewhere in the case.

const EVIDENCE_TIER_CAP: Record<EvidenceTier, number> = {
  none: 0,
  self_report_only: 20,
  public_document: 40,
  internal_policy: 60,
  logs_records: 80,
  affected_subject_evidence: 90,
  independent_review: 90,
}

const SCAN_BASIS_TIER: Record<ScanEvidenceBasis, EvidenceTier> = {
  self_reported: "self_report_only",
  document_supported: "public_document",
  evidence_supported: "logs_records",
}

export function computeEvidenceConfidence(
  scanBasis: ScanEvidenceBasis,
  stages: Record<DecisionStageKey, DecisionStageData>,
  chainItems: Record<ChainItemKey, ChainItemData>
): EvidenceConfidenceResult {
  const tiers: EvidenceTier[] = [
    SCAN_BASIS_TIER[scanBasis],
    ...Object.values(stages).map(s => s.evidence),
    ...Object.values(chainItems).map(c => c.evidence),
  ]

  let strongestTier: EvidenceTier = "none"
  let percent = 0
  for (const tier of tiers) {
    if (EVIDENCE_TIER_CAP[tier] > percent) {
      percent = EVIDENCE_TIER_CAP[tier]
      strongestTier = tier
    }
  }

  const level: ConfidenceLevel = percent < 40 ? "Low" : percent < 70 ? "Medium" : "High"

  return {
    percent,
    level,
    strongestTier,
    explanation:
      "Low confidence does not mean low risk. It means the available evidence is insufficient to verify the accountability structure.",
  }
}

// ─── Section 6 — Contradiction Index ───────────────────────────────────────
// Every institution implicitly claims to be human-centered, transparent,
// and accountable — that is the default public narrative this console
// tests against, since no separate claims form is collected. Each check
// below states that default claim and looks for the operational evidence
// that would have to exist for the claim to be true.

export function computeContradictionIndex(
  stages: Record<DecisionStageKey, DecisionStageData>,
  chainItems: Record<ChainItemKey, ChainItemData>,
  masterFunction: MasterFunctionResult
): ContradictionIndexResult {
  const allClarity: ResponsibilityClarity[] = [
    ...Object.values(stages).map(s => s.responsibility_clarity),
    ...Object.values(chainItems).map(c => c.responsibility_clarity),
  ]
  const hasClearOwner = allClarity.some(c => c === "clear_owner_with_authority")

  const weakEvidence = (e: EvidenceTier) => e === "none" || e === "self_report_only"

  const checks: ContradictionCheck[] = [
    {
      id: "human_centered_no_appeal",
      claim: "The organization operates a human-centered AI system.",
      violated: stages.appeal.exists === "no" && stages.human_review.exists === "no",
      operationalFinding: "No appeal route and no human review stage are recorded.",
    },
    {
      id: "oversight_no_override",
      claim: "The organization maintains human oversight of the system.",
      violated: stages.human_review.exists !== "yes",
      operationalFinding: "Human review is not confirmed to fully exist for this system.",
    },
    {
      id: "transparency_no_explanation",
      claim: "The organization provides transparent decision-making.",
      violated: !stages.output.documented && weakEvidence(stages.output.evidence),
      operationalFinding: "Output is undocumented and unsupported by evidence stronger than self-report.",
    },
    {
      id: "responsibility_no_owner",
      claim: "The organization takes responsibility for system outcomes.",
      violated: !hasClearOwner,
      operationalFinding: "No stage or chain item has a clear owner with authority.",
    },
    {
      id: "advisory_but_access_control",
      claim: "The system is used only for recommendation or advisory purposes.",
      violated:
        (masterFunction.declared === "recommendation" || masterFunction.declared === "other") &&
        (masterFunction.operationalScores["Access Control"] >= 3 ||
          masterFunction.operationalScores["Automated Exclusion"] >= 3),
      operationalFinding: "Operational signals show strong access control or automated exclusion despite an advisory framing.",
    },
    {
      id: "advisory_but_automatic_decision",
      claim: "AI outputs are advisory; a human makes the final decision.",
      violated: stages.decision.exists === "yes" && stages.human_review.exists !== "yes",
      operationalFinding: "A decision stage exists without a fully confirmed human review stage in front of it.",
    },
    {
      id: "fairness_no_correction",
      claim: "The organization ensures fairness and correction for affected people.",
      violated: stages.re_entry.exists === "no" || stages.re_entry.evidence === "none",
      operationalFinding: "No re-entry stage or no supporting evidence for re-entry is recorded.",
    },
  ]

  const violatedCount = checks.filter(c => c.violated).length
  const index: RiskLevel = violatedCount >= 4 ? "High" : violatedCount >= 2 ? "Medium" : "Low"

  return {
    declaredGovernancePosition: checks.map(c => c.claim),
    operationalGovernancePattern: checks.filter(c => c.violated).map(c => c.operationalFinding),
    checks,
    index,
  }
}

// ─── Section 7 — Risk Dashboard ────────────────────────────────────────────

function clarityWeight(c: ResponsibilityClarity): number {
  switch (c) {
    case "clear_owner_with_authority": return 0
    case "named_owner_unclear_authority": return 0.25
    case "shared_responsibility": return 0.5
    case "unknown": return 0.75
    case "no_clear_owner": return 1
  }
}

function stageEvidenceStrength(e: EvidenceTier): 0 | 1 | 2 | 3 {
  if (e === "logs_records" || e === "affected_subject_evidence" || e === "independent_review") return 3
  if (e === "public_document" || e === "internal_policy") return 2
  if (e === "self_report_only") return 1
  return 0
}

export function computeRiskDashboard(
  auditUnit: AuditUnit,
  stages: Record<DecisionStageKey, DecisionStageData>,
  chainItems: Record<ChainItemKey, ChainItemData>,
  masterFunction: MasterFunctionResult,
  masterFunctionAnswers: MasterFunctionAnswers,
  confidence: EvidenceConfidenceResult,
  contradiction: ContradictionIndexResult
): RiskDashboardResult {
  const overrideValue = ANSWER_VALUE[masterFunctionAnswers.human_override_possible]
  const overrideWeak = overrideValue <= 1

  const allClarityEntries: ResponsibilityClarity[] = [
    ...Object.values(stages).map(s => s.responsibility_clarity),
    ...Object.values(chainItems).map(c => c.responsibility_clarity),
  ]
  const total = allClarityEntries.length
  const displacementProportion = allClarityEntries.reduce((sum, c) => sum + clarityWeight(c), 0) / total
  const hasClearOwner = allClarityEntries.some(c => c === "clear_owner_with_authority")

  const appeal = stages.appeal
  const reEntryStage = stages.re_entry
  const decisionAutomatic = stages.decision.exists === "yes" && stages.human_review.exists !== "yes"

  // ─ Risk domains (0 = no evidence of risk … 4 = structural evidence) ─
  const ontologicalOverreach = (() => {
    const base = Math.max(masterFunction.operationalScores.Prediction, masterFunction.operationalScores.Scoring)
    return clamp04(overrideWeak ? base : Math.max(0, base - 1))
  })()

  const humanReduction = clamp04(
    Math.max(
      masterFunction.operationalScores.Scoring,
      masterFunction.operationalScores.Ranking,
      masterFunction.operationalScores["Productivity Monitoring"]
    )
  )

  const responsibilityDisplacement = clamp04(displacementProportion * 4)

  const recognitionLoss = (() => {
    if (appeal.exists === "no") return 4
    if (appeal.exists === "unknown") return 3
    if (appeal.exists === "partial") return stageEvidenceStrength(appeal.evidence) <= 1 ? 3 : 2
    // exists === "yes"
    const strength = stageEvidenceStrength(appeal.evidence)
    return strength === 0 ? 2 : strength === 1 ? 2 : strength === 2 ? 1 : 0
  })()

  const reversalLoss = clamp04((overrideWeak ? 2 : 0) + (decisionAutomatic ? 2 : 0))

  const futureClosure = (() => {
    const reEntryWeak = reEntryStage.exists === "no" ? 2 : reEntryStage.exists === "yes" ? 0 : 1
    return clamp04(reEntryWeak + Math.round(masterFunction.operationalScores["Automated Exclusion"] / 2))
  })()

  const returnDamage = (() => {
    const item = chainItems.re_entry_recovery
    const points =
      (item.missing_documentation ? 1 : 0) +
      (item.responsibility_clarity === "no_clear_owner" || item.responsibility_clarity === "unknown" ? 1 : 0) +
      (item.evidence === "none" || item.evidence === "self_report_only" ? 1 : 0) +
      (reEntryStage.exists === "no" ? 1 : 0)
    return clamp04(points)
  })()

  const riskDomains: Record<RiskDomainKey, number> = {
    ontological_overreach: ontologicalOverreach,
    human_reduction: humanReduction,
    responsibility_displacement: responsibilityDisplacement,
    recognition_loss: recognitionLoss,
    reversal_loss: reversalLoss,
    future_closure: futureClosure,
    return_damage: returnDamage,
  }

  // ─ Positive capacity domains (0 = absent … 4 = structurally embedded) ─
  const responsibilityGeneration = clamp04((1 - displacementProportion) * 4)
  const counterAuditCapacity = clamp04(confidence.percent / 22.5) // 90% → 4
  const appealability = (() => {
    if (appeal.exists !== "yes") return appeal.exists === "partial" ? 1 : 0
    const strength = stageEvidenceStrength(appeal.evidence)
    return strength === 3 ? 4 : strength === 2 ? 3 : 2
  })()
  const reEntryCapacity = (() => {
    if (reEntryStage.exists !== "yes") return reEntryStage.exists === "partial" ? 1 : 0
    const strength = stageEvidenceStrength(reEntryStage.evidence)
    return strength === 3 ? 4 : strength === 2 ? 3 : 2
  })()
  const directionalLegitimacy = (() => {
    let base = contradiction.index === "Low" ? 4 : contradiction.index === "Medium" ? 2 : 0
    if (masterFunction.contradictionRisk === "High") base = Math.max(0, base - 1)
    return clamp04(base)
  })()

  const capacityDomains: Record<CapacityDomainKey, number> = {
    responsibility_generation: responsibilityGeneration,
    counter_audit_capacity: counterAuditCapacity,
    appealability,
    re_entry_capacity: reEntryCapacity,
    directional_legitimacy: directionalLegitimacy,
  }

  const riskValues = Object.values(riskDomains)
  const capacityValues = Object.values(capacityDomains)
  const riskAverage = riskValues.reduce((a, b) => a + b, 0) / riskValues.length
  const capacityAverage = capacityValues.reduce((a, b) => a + b, 0) / capacityValues.length

  const isMajorLife = MAJOR_LIFE_CONSEQUENCES.includes(auditUnit.consequence)
  const adjustmentsApplied: string[] = []
  if (appeal.exists === "no") adjustmentsApplied.push("No appeal process exists.")
  if (reEntryStage.exists === "no") adjustmentsApplied.push("No re-entry process exists.")
  if (!hasClearOwner) adjustmentsApplied.push("No responsible owner with clear authority exists.")
  if (masterFunction.operationalScores["Automated Exclusion"] === 4) adjustmentsApplied.push("Automated exclusion is structural.")
  if (isMajorLife && (masterFunction.operationalScores["Access Control"] >= 2 || masterFunction.operationalScores["Automated Exclusion"] >= 2)) {
    adjustmentsApplied.push("Access control affects a major life opportunity.")
  }
  if (confidence.level === "Low" && isMajorLife) {
    adjustmentsApplied.push("Evidence confidence is low while consequence severity is high.")
  }

  const rawPreliminaryRisk = riskAverage - capacityAverage * 0.5
  const preliminaryRisk = clamp(rawPreliminaryRisk + adjustmentsApplied.length * 0.4, 0, 4)

  const preliminaryRiskCategory: PreliminaryRiskCategory =
    preliminaryRisk < 1.0 ? "Low" : preliminaryRisk < 2.0 ? "Moderate" : preliminaryRisk < 3.0 ? "High" : "Severe"

  const primaryMissingEvidence: string[] = [
    ...Object.entries(stages)
      .filter(([, s]) => s.evidence === "none")
      .map(([key]) => DECISION_STAGE_LABEL[key as DecisionStageKey]),
    ...Object.entries(chainItems)
      .filter(([, c]) => c.evidence === "none")
      .map(([key]) => CHAIN_ITEM_LABEL[key as ChainItemKey]),
  ].slice(0, 6)

  const recommendedImmediateAction = deriveRecommendedNextSteps({
    hasClearOwner,
    appealability,
    reEntryCapacity,
    confidenceLevel: confidence.level,
    futureClosure,
    masterFunction,
  })[0]

  return {
    riskDomains,
    capacityDomains,
    riskAverage,
    capacityAverage,
    preliminaryRisk,
    preliminaryRiskCategory,
    adjustmentsApplied,
    primaryMissingEvidence,
    recommendedImmediateAction,
  }
}

// ─── Section 8 — Recommended Next Steps ────────────────────────────────────
// Shared between the Risk Dashboard (top action only) and the Executive
// Report (full ordered list), so the two never disagree with each other.

export function deriveRecommendedNextSteps(input: {
  hasClearOwner: boolean
  appealability: number
  reEntryCapacity: number
  confidenceLevel: ConfidenceLevel
  futureClosure: number
  masterFunction: MasterFunctionResult
}): string[] {
  const steps: string[] = []

  if (!input.hasClearOwner) {
    steps.push("Add named responsibility owners with authority to intervene, suspend, revise, and compensate.")
  }
  if (input.appealability <= 1) {
    steps.push("Create an explanation and appeal route for affected subjects.")
  }
  if (input.reEntryCapacity <= 1) {
    steps.push("Create a documented path for correction, re-evaluation, reapplication, and recovery.")
  }
  if (input.confidenceLevel === "Low") {
    steps.push("Collect decision logs, override records, appeal outcomes, UI screenshots, policy documents, and affected subject evidence.")
  }
  if (input.futureClosure >= 3) {
    steps.push("Reduce irreversible automated decisions and add time-bound review, human reconsideration, and non-score-based alternatives.")
  }
  if (input.masterFunction.operational.includes("Access Control") || input.masterFunction.operational.includes("Automated Exclusion")) {
    steps.push("Require stronger documentation, human review, counter-audit access, and re-entry pathways.")
  }

  if (steps.length === 0) {
    steps.push("Continue periodic re-scanning as the system evolves; no immediate governance gaps were detected from the evidence provided.")
  }
  return steps
}
