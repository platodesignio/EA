import type {
  EvidenceAuditCase,
  DDATScores,
  DDATJudgment,
  DDATJudgmentLabel,
  EvidenceLevel,
  SourceType,
  EvidenceConfidence,
  ContradictionFinding,
  GovernanceClaimCategory,
  MasterFunctionComparison,
} from "./ddat-evidence-schema"

function clamp3(n: number): 0 | 1 | 2 | 3 {
  return Math.max(0, Math.min(3, Math.round(n))) as 0 | 1 | 2 | 3
}

function clamp6(n: number): EvidenceLevel {
  return Math.max(0, Math.min(6, Math.round(n))) as EvidenceLevel
}

export function computeScores(c: EvidenceAuditCase): DDATScores {
  // Classification Risk: how many variables are non-contestable / proxy-based
  const vars = c.classification_map.input_variables
  const proxyCount = vars.filter(v =>
    v.category === "socioeconomic_proxy" ||
    v.category === "location_proxy" ||
    v.category === "historical_record"
  ).length
  const nonContestable = vars.filter(v => !v.contestable).length
  const varTotal = vars.length || 1
  const classRisk = clamp3(
    (proxyCount / varTotal) * 1.5 + (nonContestable / varTotal) * 1.5
  )

  // Closure Risk: max severity across closures, weighted by count
  const closures = c.closure_map.closures
  const maxSeverity = closures.reduce((max, cl) => Math.max(max, cl.severity), 0)
  const avgSeverity = closures.length
    ? closures.reduce((s, cl) => s + cl.severity, 0) / closures.length
    : 0
  const closureRisk = clamp3(maxSeverity * 0.6 + avgSeverity * 0.4)

  // Contestability Capacity (high = good for subject = LOW risk, but we invert: 3 = very capable)
  const ct = c.contestability
  const contestRaw =
    (ct.explanation_provided ? 1 : 0) +
    (ct.explanation_specificity / 3) +
    (ct.explanation_actionable ? 1 : 0) +
    (ct.appeal_available ? 1 : 0) +
    (ct.correction_available ? 1 : 0) +
    (ct.human_review_available ? 1 : 0)
  const contestabilityCapacity = clamp3(contestRaw / 2) // max raw = 6, /2 → 0–3

  // Support Conversion
  const sp = c.support
  const supportRaw =
    (sp.support_offered ? 1 : 0) +
    (sp.training_offered ? 1 : 0) +
    (sp.reassessment_date_given ? 1 : 0) +
    (sp.case_worker_available ? 1 : 0) +
    (sp.alternative_pathway_available ? 1 : 0) +
    (sp.intervention_available ? 1 : 0)
  const supportConversion = clamp3(supportRaw / 2)

  // Re-entry Capacity
  const re = c.reentry
  const reentryRaw =
    (re.reapplication_allowed ? 1 : 0) +
    (re.score_expiration_days !== null && re.score_expiration_days > 0 ? 1 : 0) +
    (!re.past_classification_persists ? 1 : 0) +
    (re.reassessment_available ? 1 : 0) +
    (re.reentry_conditions_clear ? 1 : 0)
  const reentryCapacity = clamp3((reentryRaw / 5) * 3)

  // Temporal Recovery (subset of re-entry focusing on time-boundedness)
  const temporalRaw =
    (re.score_expiration_days !== null ? 1 : 0) +
    (!re.past_classification_persists ? 1 : 0) +
    (re.reassessment_interval_days !== null ? 1 : 0) +
    (re.reentry_conditions_clear ? 0.5 : 0)
  const temporalRecovery = clamp3(temporalRaw)

  // Responsibility Gap (high = bad; 3 = severe gap)
  const rs = c.responsibility
  const hasOwners = [
    rs.decision_owner,
    rs.system_operator,
    rs.appeal_owner,
    rs.correction_owner,
    rs.human_override_owner,
  ].filter(Boolean).length
  const gapRaw =
    (rs.responsible_contact_exists ? 0 : 1) +
    (rs.override_authority_exists ? 0 : 1) +
    (hasOwners < 3 ? 1 : 0) +
    (!rs.AI_vendor ? 0.5 : 0)
  const responsibilityGap = clamp3(gapRaw)

  // Evidence Level: highest level across sources
  const evidenceLevel = clamp6(
    c.evidence_sources.reduce((max, s) => Math.max(max, s.evidence_level), 0)
  )

  return {
    classificationRisk: classRisk,
    closureRisk: closureRisk as 0|1|2|3,
    contestabilityCapacity,
    supportConversion,
    reentryCapacity,
    temporalRecovery,
    responsibilityGap,
    evidenceLevel,
  }
}

// ─── Evidence Confidence ────────────────────────────────────────────────────
// Risk scores above describe institutional exposure IF the recorded
// configuration is accurate. Confidence describes how independently verified
// that configuration is. The two are computed separately and never merged.

const SELF_REPORT_SOURCE_TYPES: SourceType[] = [
  "theoretical_hypothesis",
  "simulated_scenario",
  "policy_document",
  "website_or_FAQ",
]

export function isSelfReportSource(type: SourceType): boolean {
  return SELF_REPORT_SOURCE_TYPES.includes(type)
}

export function computeConfidence(c: EvidenceAuditCase): EvidenceConfidence {
  const sources = c.evidence_sources
  const independentSourceCount = sources.filter(s => !isSelfReportSource(s.source_type)).length
  const selfReportedSourceCount = sources.filter(s => isSelfReportSource(s.source_type)).length
  const maxLevel = sources.reduce((m, s) => Math.max(m, s.evidence_level), 0)
  const warnings: string[] = []

  let label: EvidenceConfidence["label"]
  if (sources.length === 0) {
    label = "Unverified"
    warnings.push("No evidence sources are recorded. Every finding in this audit is a hypothesis, not a confirmed institutional fact.")
  } else if (independentSourceCount === 0) {
    label = "Self-Reported Only"
    warnings.push("Every evidence source originates from the institution's own declarations (policy text, website copy, or a hypothetical scenario). No independent or third-party source has been recorded.")
  } else if (independentSourceCount < 2 || maxLevel < 4) {
    label = "Partially Verified"
    warnings.push("Independent evidence exists but remains thin. Real case records, interview records, or a third-party audit are needed to move past partial verification.")
  } else {
    label = "Verified"
  }

  if (c.governance_claims.some(g => g.self_reported) && independentSourceCount === 0) {
    warnings.push("Declared governance claims are corroborated only by the institution's own statements, not by an independent source.")
  }
  if (c.closure_map.closures.length > 0 && sources.length === 0) {
    warnings.push("Closure severity has been recorded without any supporting evidence source.")
  }
  if (c.responsibility.responsibility_basis === "declared" && (c.responsibility.decision_owner || c.responsibility.system_operator)) {
    warnings.push("The responsibility map reflects the institution's own account of who is accountable and has not been independently confirmed.")
  }
  if (sources.length > 0 && sources.every(s => !s.citation_or_url.trim())) {
    warnings.push("No evidence source includes a citation or URL, so none can be independently checked from this record alone.")
  }

  return { label, independentSourceCount, selfReportedSourceCount, missingEvidenceWarnings: warnings }
}

// ─── Contradiction Findings ─────────────────────────────────────────────────
// A declared governance claim is checked against the operational structure
// recorded elsewhere in the case. A mismatch is a contradiction: the
// institution's stated commitment and its actual decision architecture do
// not agree.

type ClaimCheck = (c: EvidenceAuditCase) => string | null // returns operational finding text if contradicted, else null

const CLAIM_CHECKS: Record<GovernanceClaimCategory, ClaimCheck> = {
  human_review: c =>
    c.contestability.human_review_available ? null : "Operational structure records no human review with real override authority.",
  appeal_rights: c =>
    c.contestability.appeal_available ? null : "Operational structure records no available appeal pathway.",
  data_correction: c =>
    c.contestability.correction_available ? null : "Operational structure records no mechanism for the subject to correct input data.",
  non_discrimination: c => {
    const proxyVars = c.classification_map.input_variables.filter(
      v => v.category === "socioeconomic_proxy" || v.category === "location_proxy"
    )
    return proxyVars.length > 0
      ? `${proxyVars.length} recorded input variable(s) rely on socioeconomic or location proxies capable of encoding discriminatory effects.`
      : null
  },
  transparency: c =>
    c.contestability.explanation_provided && c.contestability.explanation_actionable
      ? null
      : "Operational structure does not provide an actionable explanation to affected subjects.",
  data_retention_limits: c =>
    c.reentry.past_classification_persists
      ? "Past classification is recorded as persisting indefinitely; no operational retention limit exists."
      : null,
  re_entry_support: c =>
    c.reentry.reassessment_available || c.reentry.reentry_conditions_clear
      ? null
      : "No operational re-assessment pathway or clearly stated re-entry conditions are recorded.",
  accountability: c =>
    c.responsibility.responsible_contact_exists ? null : "No reachable, named responsible contact is recorded in the responsibility map.",
  other: () => null,
}

const SEVERE_CLAIM_CATEGORIES: GovernanceClaimCategory[] = ["human_review", "accountability", "data_retention_limits"]

export function detectContradictions(c: EvidenceAuditCase): ContradictionFinding[] {
  const findings: ContradictionFinding[] = []
  for (const claim of c.governance_claims) {
    const finding = CLAIM_CHECKS[claim.category](c)
    if (finding) {
      findings.push({
        id: claim.id,
        category: claim.category,
        claimText: claim.claim_text,
        operationalFinding: finding,
        severity: SEVERE_CLAIM_CATEGORIES.includes(claim.category) ? "severe" : "moderate",
      })
    }
  }
  return findings
}

// ─── Declared vs. Operational Master Function ──────────────────────────────
// "Declared" is what the institution states the system is for. "Operational"
// is what the recorded evidence shows the system actually does. The audit
// reports both and states whether they align — it does not assume they do.

const SUPPORTIVE_DECLARATION_KEYWORDS = [
  "support", "help", "assist", "empower", "protect", "fair", "inclusive",
  "second chance", "opportunity", "safeguard", "care",
]

export function deriveOperationalMasterFunction(scores: DDATScores): string {
  const { closureRisk, supportConversion, reentryCapacity, responsibilityGap } = scores
  if (closureRisk >= 2 && supportConversion <= 1 && reentryCapacity <= 1) {
    return "Exclusionary gatekeeping — the system's operational effect is to close access with minimal recovery pathway, regardless of its declared purpose."
  }
  if (closureRisk <= 1 && supportConversion >= 2 && reentryCapacity >= 2) {
    return "Triage with recovery — recorded closures are limited and are paired with functioning support and re-entry mechanisms."
  }
  if (responsibilityGap >= 2) {
    return "Diffused-accountability classification — the system produces consequential decisions without a clear, reachable responsible party."
  }
  return "Mixed function — recorded evidence shows both access-closing and access-preserving characteristics; no single operational function dominates."
}

export function compareMasterFunction(c: EvidenceAuditCase, scores: DDATScores): MasterFunctionComparison {
  const declared = c.institution_profile.declared_master_function.trim()
  const operational = deriveOperationalMasterFunction(scores)

  if (!declared) {
    return {
      declared: "(not declared)",
      operational,
      alignment: "unclear",
      rationale: "No declared master function was recorded for this system, so alignment against operational evidence cannot be assessed.",
    }
  }

  const declaredLower = declared.toLowerCase()
  const soundsSupportive = SUPPORTIVE_DECLARATION_KEYWORDS.some(k => declaredLower.includes(k))
  const isExclusionary = operational.startsWith("Exclusionary")
  const isRecoveryOriented = operational.startsWith("Triage with recovery")

  if (soundsSupportive && isExclusionary) {
    return {
      declared,
      operational,
      alignment: "contradicted",
      rationale: "The declared function uses supportive language, but the operational evidence shows the system primarily closes access with limited recovery. The declared and operational functions diverge.",
    }
  }
  if (soundsSupportive && isRecoveryOriented) {
    return {
      declared,
      operational,
      alignment: "aligned",
      rationale: "The declared supportive function is consistent with the operational evidence of limited closure and functioning recovery pathways.",
    }
  }
  return {
    declared,
    operational,
    alignment: "unclear",
    rationale: "The declared and operational functions cannot be conclusively compared from the recorded evidence alone. Manual review of both statements is required.",
  }
}

export function computeJudgment(c: EvidenceAuditCase): DDATJudgment {
  const scores = computeScores(c)
  const confidence = computeConfidence(c)
  const contradictions = detectContradictions(c)
  const masterFunction = compareMasterFunction(c, scores)
  const reasoning: string[] = []
  const improvements: string[] = []
  const gaps: string[] = []

  // Evidence gate
  if (scores.evidenceLevel < 2) {
    reasoning.push(
      `Evidence level is ${scores.evidenceLevel} (${evidenceLevelLabel(scores.evidenceLevel)}). Audit is theoretical or based on simulated scenarios only. All risk assessments remain hypothetical.`
    )
    gaps.push("Provide at least one public document, policy document, or rejection notice to reach evidence level 2.")
    gaps.push("Perform counterfactual testing or collect real case records to strengthen the audit.")
    return {
      label: "insufficient-evidence",
      scores,
      reasoningPath: reasoning,
      improvementRequirements: improvements,
      evidenceGaps: gaps,
      confidence,
      contradictions,
      masterFunction,
    }
  }

  // Build reasoning
  if (scores.classificationRisk >= 2) {
    reasoning.push(
      `Classification risk is high (${scores.classificationRisk}/3): the system uses proxy variables, socioeconomic markers, or historical records that are largely non-contestable.`
    )
    improvements.push("Reduce reliance on socioeconomic proxy variables.")
    improvements.push("Make all input variables individually contestable.")
  }

  if (scores.closureRisk >= 2) {
    reasoning.push(
      `Closure risk is high (${scores.closureRisk}/3): the system produces significant or severe access closure. Duration and reversibility are limited.`
    )
    improvements.push("Add a clear re-entry pathway with defined conditions and timeline.")
  }

  if (scores.contestabilityCapacity <= 1) {
    reasoning.push(
      `Contestability capacity is low (${scores.contestabilityCapacity}/3): explanation is absent or generic, appeal pathways are weak or inaccessible.`
    )
    improvements.push("Add actionable, specific explanation for every decision.")
    improvements.push("Add a functional appeal pathway with a human reviewer who has override authority.")
    improvements.push("Add a correction right for input variables.")
  }

  if (scores.supportConversion <= 1) {
    reasoning.push(
      `Support conversion is low (${scores.supportConversion}/3): the system classifies without offering meaningful support, alternative pathways, or re-evaluation.`
    )
    improvements.push("Add case worker support or structured intervention after adverse classification.")
    improvements.push("Add a re-assessment date and alternative pathway.")
  }

  if (scores.reentryCapacity <= 1) {
    reasoning.push(
      `Re-entry capacity is low (${scores.reentryCapacity}/3): the classification effectively closes future access without clear conditions or support for re-entry.`
    )
    improvements.push("Define explicit re-entry conditions and timelines.")
  }

  if (scores.temporalRecovery <= 1) {
    reasoning.push(
      `Temporal recovery is low (${scores.temporalRecovery}/3): past classifications persist indefinitely or without expiration, freezing subjects in their current status.`
    )
    improvements.push("Add score expiration and past-record decay.")
    improvements.push("Schedule automatic re-assessment at defined intervals.")
  }

  if (scores.responsibilityGap >= 2) {
    reasoning.push(
      `Responsibility gap is high (${scores.responsibilityGap}/3): accountability is fragmented, displaced onto the AI system, or uncontactable.`
    )
    improvements.push("Name a single responsible contact with correction authority.")
    improvements.push("Clarify who has override authority and how to reach them.")
    improvements.push("Document the AI vendor and their accountability relationship.")
  }

  // Evidence gaps
  if (scores.evidenceLevel < 4) {
    gaps.push("Collect real case records or interviews to reach evidence level 4.")
  }
  if (scores.evidenceLevel < 6) {
    gaps.push("Commission or perform a third-party reproducible audit to reach evidence level 6.")
  }
  if (c.counterfactuals.length === 0) {
    gaps.push("Perform counterfactual testing to identify which variables drive access closure.")
  }
  if (c.evidence_sources.length < 3) {
    gaps.push("Document at least three independent evidence sources.")
  }

  const label = deriveLabel(scores)

  return {
    label,
    scores,
    reasoningPath: reasoning,
    improvementRequirements: improvements.length
      ? improvements
      : ["Document evidence sources.", "Perform a counterfactual test."],
    evidenceGaps: gaps.length
      ? gaps
      : ["Longitudinal follow-up data would strengthen this audit."],
    confidence,
    contradictions,
    masterFunction,
  }
}

function deriveLabel(scores: DDATScores): DDATJudgmentLabel {
  const {
    closureRisk,
    contestabilityCapacity,
    supportConversion,
    reentryCapacity,
    temporalRecovery,
    responsibilityGap,
    evidenceLevel,
  } = scores

  const generativeSignals =
    contestabilityCapacity + supportConversion + reentryCapacity + temporalRecovery
  const closingSignals = closureRisk + responsibilityGap

  if (
    closureRisk >= 2 &&
    responsibilityGap >= 2 &&
    evidenceLevel >= 3 &&
    generativeSignals <= 4
  ) {
    return "institutionally-dangerous"
  }

  if (
    closureRisk >= 2 &&
    (supportConversion <= 1 || reentryCapacity <= 1)
  ) {
    return "closure-generative"
  }

  if (
    generativeSignals >= 10 &&
    closingSignals <= 2
  ) {
    return "support-generative"
  }

  return "ambiguous"
}

export function evidenceLevelLabel(level: EvidenceLevel): string {
  const labels: Record<EvidenceLevel, string> = {
    0: "Theoretical hypothesis",
    1: "Simulated scenario",
    2: "Public document evidence",
    3: "Counterfactual test",
    4: "Real case record",
    5: "Longitudinal record",
    6: "Third-party reproducible audit",
  }
  return labels[level]
}

export function judgmentDescription(label: DDATJudgmentLabel): string {
  switch (label) {
    case "support-generative":
      return "The system classifies in order to support, correct, re-evaluate, and reopen future possibilities. Contestability is functional, support conversion is meaningful, and re-entry is available and time-limited."
    case "ambiguous":
      return "Evidence is insufficient or mixed. The system shows both generative and closing tendencies. It should not be deployed without redesign and longitudinal monitoring."
    case "closure-generative":
      return "The system classifies in ways that restrict future access without adequate support, contestability, or re-entry. Classification functions as durable exclusion rather than conditional differentiation."
    case "institutionally-dangerous":
      return "The system produces severe access closure, weak contestability, weak support conversion, unclear responsibility, and has sufficient evidence to confirm this pattern. Immediate suspension or redesign is required."
    case "insufficient-evidence":
      return "The audit is based on theoretical or simulated evidence only. All risk assessments remain hypothetical. The analysis cannot support institutional conclusions without stronger evidence."
  }
}

export function scoreLabel(score: 0 | 1 | 2 | 3, invert = false): string {
  if (invert) {
    const map: Record<number, string> = { 0: "None", 1: "Weak", 2: "Moderate", 3: "Strong" }
    return map[score]
  }
  const map: Record<number, string> = { 0: "None", 1: "Low", 2: "Moderate", 3: "High" }
  return map[score]
}

export function governanceClaimCategoryLabel(category: GovernanceClaimCategory): string {
  const labels: Record<GovernanceClaimCategory, string> = {
    human_review: "Human Review",
    appeal_rights: "Appeal Rights",
    data_correction: "Data Correction",
    non_discrimination: "Non-Discrimination",
    transparency: "Transparency",
    data_retention_limits: "Data Retention Limits",
    re_entry_support: "Re-entry Support",
    accountability: "Accountability",
    other: "Other",
  }
  return labels[category]
}
