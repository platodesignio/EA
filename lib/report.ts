// ─── CEO AI Accountability Console — Executive Report Generator ───────────
// Produces plain text formatted for direct use in an executive memo: short
// headers, no markup that would look strange pasted into an email or Word
// document, and no gamified language.

import type { CEOConsoleCase, MasterFunctionResult, EvidenceConfidenceResult, ContradictionIndexResult, RiskDashboardResult, EvidenceTier, ResponsibilityClarity } from "./types"
import {
  ROLE_OPTIONS, CONSEQUENCE_OPTIONS, SCAN_BASIS_OPTIONS,
  DECISION_STAGE_ORDER, DECISION_STAGE_LABEL, STAGE_EXISTS_OPTIONS, EVIDENCE_TIER_OPTIONS, RESPONSIBILITY_CLARITY_OPTIONS,
  DECLARED_MASTER_FUNCTION_OPTIONS, CHAIN_ITEM_ORDER, CHAIN_ITEM_LABEL,
} from "./questions"
import { deriveRecommendedNextSteps, derivePrimaryOperationalConcern, formatPreliminaryRisk, NO_CONTRADICTION_TEXT, ASSUMED_CLAIMS_DISCLOSURE, RISK_SCORE_METHOD_NOTE } from "./scoring"

function labelOf<T extends string>(options: { value: T; label: string }[], value: T): string {
  return options.find(o => o.value === value)?.label ?? value
}

function heading(text: string): string {
  return `\n${text.toUpperCase()}\n${"-".repeat(text.length)}\n`
}

// Board-memo placeholders — a blank field reads as noise; a labeled gap
// reads as a finding.
function ownerOrMissing(owner: string): string {
  return owner.trim() ? owner : "Missing owner"
}
function evidenceOrMissing(evidence: EvidenceTier): string {
  return evidence === "none" ? "Missing evidence" : labelOf(EVIDENCE_TIER_OPTIONS, evidence)
}
function clarityOrUnclear(clarity: ResponsibilityClarity): string {
  return clarity === "no_clear_owner" || clarity === "unknown" ? "Unclear responsibility" : labelOf(RESPONSIBILITY_CLARITY_OPTIONS, clarity)
}

export type ComputedResults = {
  masterFunction: MasterFunctionResult
  confidence: EvidenceConfidenceResult
  contradiction: ContradictionIndexResult
  riskDashboard: RiskDashboardResult
}

export function generateExecutiveReport(c: CEOConsoleCase, computed: ComputedResults): string {
  const { audit_unit: u, decision_stages, chain_items } = c
  const { masterFunction: mf, confidence, contradiction, riskDashboard: risk } = computed
  const lines: string[] = []
  const generatedOn = new Date().toISOString().slice(0, 10)

  // ─── Title ───────────────────────────────────────────────────────────────
  lines.push("CEO AI ACCOUNTABILITY CONSOLE")
  lines.push("Preliminary Executive Scan")
  lines.push("")

  // ─── Metadata block ──────────────────────────────────────────────────────
  lines.push(`Organization:          ${u.organization_name || "(not specified)"}`)
  lines.push(`AI system:             ${u.ai_system_name || "(not specified)"}`)
  lines.push(`Domain:                ${u.industry_domain || "(not specified)"}`)
  lines.push(`Evaluated population:  ${u.who_is_evaluated || "(not specified)"}`)
  lines.push(`Primary decision:      ${u.primary_decision || "(not specified)"}`)
  lines.push(`Consequence:           ${labelOf(CONSEQUENCE_OPTIONS, u.consequence)}`)
  lines.push(`Scan type:             ${labelOf(SCAN_BASIS_OPTIONS, u.scan_basis)}`)
  lines.push(`Evidence confidence:   ${confidence.level} (${confidence.percent}%)`)
  lines.push(`Generated on:          ${generatedOn}`)

  // 1. Executive Summary
  lines.push(heading("1. Executive Summary"))
  lines.push(
    "This preliminary scan reviews how the AI-enabled decision system described above appears to distribute " +
    "evaluation, responsibility, appealability, re-entry, and future possibility. It does not measure private " +
    "belief and does not provide legal, compliance, psychological, medical, or AI safety certification."
  )
  lines.push("")
  lines.push(`Primary operational concern: ${derivePrimaryOperationalConcern(risk.riskDomains)}`)
  lines.push(`Primary missing evidence: ${risk.primaryMissingEvidence[0] ?? "None — no stage or chain item is entirely without evidence."}`)
  lines.push(`Recommended immediate action: ${risk.recommendedImmediateAction}`)

  // 2. Audit Unit
  lines.push(heading("2. Audit Unit"))
  lines.push(`Organization: ${u.organization_name || "(not specified)"}`)
  lines.push(`Role of respondent: ${labelOf(ROLE_OPTIONS, u.user_role)}`)
  lines.push(`AI system: ${u.ai_system_name || "(not specified)"}`)
  lines.push(`Industry / domain: ${u.industry_domain || "(not specified)"}`)
  lines.push(`Primary decision affected: ${u.primary_decision || "(not specified)"}`)
  lines.push(`Who is evaluated: ${u.who_is_evaluated || "(not specified)"}`)
  lines.push(`Consequence category: ${labelOf(CONSEQUENCE_OPTIONS, u.consequence)}`)
  lines.push(`Scan basis: ${labelOf(SCAN_BASIS_OPTIONS, u.scan_basis)}`)

  // 3. Declared vs Operational Master Function
  lines.push(heading("3. Declared vs Operational Master Function"))
  lines.push(`Declared function: ${labelOf(DECLARED_MASTER_FUNCTION_OPTIONS, mf.declared)}`)
  lines.push(`Operational master function: ${mf.operational.join(", ")}`)
  lines.push(`Function mismatch risk: ${mf.functionMismatchRisk}`)
  lines.push("")
  lines.push(
    "The operational master function is the function that appears to hold practical authority over the " +
    "evaluated human, based on the answers and evidence provided. This mismatch risk is separate from the " +
    "Contradiction Index in Section 7, which tests different claims against operational structure."
  )

  // 4. Accountability Chain Summary
  lines.push(heading("4. Accountability Chain Summary"))
  lines.push("Decision system stages:")
  DECISION_STAGE_ORDER.forEach(key => {
    const s = decision_stages[key]
    lines.push(
      `  - ${DECISION_STAGE_LABEL[key]}: exists=${labelOf(STAGE_EXISTS_OPTIONS, s.exists)}, ` +
      `owner=${ownerOrMissing(s.owner)}, evidence=${evidenceOrMissing(s.evidence)}, ` +
      `responsibility=${clarityOrUnclear(s.responsibility_clarity)}`
    )
  })
  lines.push("")
  lines.push("Ontological accountability chain:")
  CHAIN_ITEM_ORDER.forEach(key => {
    const item = chain_items[key]
    lines.push(
      `  - ${CHAIN_ITEM_LABEL[key]}: owner=${ownerOrMissing(item.owner)}, ` +
      `evidence=${evidenceOrMissing(item.evidence)}, ` +
      `responsibility=${clarityOrUnclear(item.responsibility_clarity)}` +
      (item.missing_documentation ? " [documentation missing]" : "")
    )
  })

  // 5. Risk Summary
  lines.push(heading("5. Risk Summary"))
  lines.push(RISK_SCORE_METHOD_NOTE)
  lines.push("")
  lines.push(`Preliminary risk: ${risk.preliminaryRisk.toFixed(1)}/4.0 — ${formatPreliminaryRisk(risk.preliminaryRiskCategory)}`)
  lines.push(`Risk domain average: ${risk.riskAverage.toFixed(2)}/4.0`)
  lines.push(`Positive capacity average: ${risk.capacityAverage.toFixed(2)}/4.0`)
  lines.push("Risk domains:")
  Object.entries(risk.riskDomains).forEach(([k, v]) => lines.push(`  - ${k.replace(/_/g, " ")}: ${v}/4`))
  lines.push("Positive capacity domains:")
  Object.entries(risk.capacityDomains).forEach(([k, v]) => lines.push(`  - ${k.replace(/_/g, " ")}: ${v}/4`))
  if (risk.adjustmentsApplied.length > 0) {
    lines.push("Upward adjustments applied:")
    risk.adjustmentsApplied.forEach(a => lines.push(`  - ${a}`))
  }

  // 6. Evidence Confidence
  lines.push(heading("6. Evidence Confidence"))
  lines.push(`Evidence confidence: ${confidence.level} (${confidence.percent}%, separate from risk)`)
  lines.push(`Strongest evidence type detected: ${labelOf(EVIDENCE_TIER_OPTIONS, confidence.strongestTier)}`)
  lines.push(confidence.explanation)

  // 7. Contradiction Findings
  lines.push(heading("7. Contradiction Findings"))
  lines.push(ASSUMED_CLAIMS_DISCLOSURE)
  lines.push("")
  lines.push(`Contradiction index: ${contradiction.index}`)
  const violatedChecks = contradiction.checks.filter(ch => ch.violated)
  if (violatedChecks.length > 0) {
    violatedChecks.forEach(ch => lines.push(`  - ${ch.plainFinding}`))
  } else {
    lines.push(NO_CONTRADICTION_TEXT)
  }

  // 8. Missing Evidence
  lines.push(heading("8. Missing Evidence"))
  if (risk.primaryMissingEvidence.length > 0) {
    risk.primaryMissingEvidence.forEach(m => lines.push(`  - No evidence recorded for: ${m}`))
  } else {
    lines.push("No stage or chain item is entirely without recorded evidence.")
  }

  // 9. Appeal and Re-entry Assessment
  lines.push(heading("9. Appeal and Re-entry Assessment"))
  lines.push(`Appealability: ${risk.capacityDomains.appealability}/4`)
  lines.push(`Re-entry capacity: ${risk.capacityDomains.re_entry_capacity}/4`)
  lines.push(`Future closure risk: ${risk.riskDomains.future_closure}/4`)
  lines.push(`Return damage risk: ${risk.riskDomains.return_damage}/4`)

  // 10. Responsibility Ownership Gaps
  lines.push(heading("10. Responsibility Ownership Gaps"))
  lines.push(`Responsibility displacement risk: ${risk.riskDomains.responsibility_displacement}/4`)
  lines.push(`Responsibility generation capacity: ${risk.capacityDomains.responsibility_generation}/4`)
  const gapEntries = [
    ...DECISION_STAGE_ORDER.map(key => ({ label: DECISION_STAGE_LABEL[key], clarity: decision_stages[key].responsibility_clarity })),
    ...CHAIN_ITEM_ORDER.map(key => ({ label: CHAIN_ITEM_LABEL[key], clarity: chain_items[key].responsibility_clarity })),
  ].filter(e => e.clarity === "no_clear_owner" || e.clarity === "unknown")
  if (gapEntries.length > 0) {
    lines.push("Stages/chain items without a clear owner:")
    gapEntries.forEach(e => lines.push(`  - ${e.label} (Unclear responsibility)`))
  } else {
    lines.push("Every stage and chain item has at least a named owner.")
  }

  // 11. Immediate Governance Questions
  lines.push(heading("11. Immediate Governance Questions"))
  deriveImmediateGovernanceQuestions(computed).forEach(q => lines.push(`  - ${q}`))

  // 12. Recommended Next Steps
  lines.push(heading("12. Recommended Next Steps"))
  deriveRecommendedNextSteps({
    hasClearOwner: gapEntries.length === 0,
    appealability: risk.capacityDomains.appealability,
    reEntryCapacity: risk.capacityDomains.re_entry_capacity,
    confidenceLevel: confidence.level,
    futureClosure: risk.riskDomains.future_closure,
    masterFunction: mf,
  }).forEach(s => lines.push(`  - ${s}`))

  // 13. Disclaimer
  lines.push(heading("13. Disclaimer"))
  lines.push(DISCLAIMER_TEXT)
  lines.push("")
  lines.push("Audit the institution. Not the person.")
  lines.push("We do not measure private belief. We audit institutionalized commitments.")

  return lines.join("\n")
}

export const DISCLAIMER_TEXT =
  "This tool does not provide legal advice, compliance certification, psychological diagnosis, medical " +
  "assessment, or formal AI safety certification. It is a preliminary executive governance tool for mapping " +
  "accountability risks in AI-enabled decision systems."

function deriveImmediateGovernanceQuestions(computed: ComputedResults): string[] {
  const { contradiction, riskDashboard: risk, masterFunction: mf } = computed
  const questions: string[] = []

  contradiction.checks.filter(c => c.violated).forEach(c => {
    questions.push(`If "${c.claim}" is the organization's position, why does the evidence show: ${c.operationalFinding}`)
  })

  questions.push("Who is accountable if this system produces a wrongful exclusion, and can they actually suspend or reverse it?")
  questions.push("Can a human meaningfully override this system today, or only in principle?")

  if (risk.riskDomains.future_closure >= 3) {
    questions.push("What happens to a person after a negative decision — is there a real, time-bound path back in?")
  }
  if (mf.operational.includes("Access Control") || mf.operational.includes("Automated Exclusion")) {
    questions.push("What independent evidence exists that this system's exclusions are proportionate and correctable?")
  }

  return questions
}
