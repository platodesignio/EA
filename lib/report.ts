// ─── CEO AI Accountability Console — Executive Report Generator ───────────
// Produces plain text formatted for direct use in an executive memo: short
// headers, no markup that would look strange pasted into an email or Word
// document, and no gamified language.

import type { CEOConsoleCase, MasterFunctionResult, EvidenceConfidenceResult, ContradictionIndexResult, RiskDashboardResult } from "./types"
import {
  ROLE_OPTIONS, CONSEQUENCE_OPTIONS, SCAN_BASIS_OPTIONS,
  DECISION_STAGE_ORDER, DECISION_STAGE_LABEL, STAGE_EXISTS_OPTIONS, EVIDENCE_TIER_OPTIONS, RESPONSIBILITY_CLARITY_OPTIONS,
  DECLARED_MASTER_FUNCTION_OPTIONS, CHAIN_ITEM_ORDER, CHAIN_ITEM_LABEL,
} from "./questions"
import { deriveRecommendedNextSteps } from "./scoring"

function labelOf<T extends string>(options: { value: T; label: string }[], value: T): string {
  return options.find(o => o.value === value)?.label ?? value
}

function heading(text: string): string {
  return `\n${text.toUpperCase()}\n${"-".repeat(text.length)}\n`
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

  lines.push("CEO AI ACCOUNTABILITY CONSOLE — PRELIMINARY EXECUTIVE SCAN")
  lines.push("Powered by the DDAT Evidence Standard")
  lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`)
  lines.push("")
  lines.push(
    "This preliminary scan does not measure private belief. It reviews how an AI-enabled decision system " +
    "appears to distribute evaluation, responsibility, appealability, re-entry, and future possibility based " +
    "on the information provided."
  )

  // 1. Audit Unit
  lines.push(heading("1. Audit Unit"))
  lines.push(`Organization: ${u.organization_name || "(not specified)"}`)
  lines.push(`Role of respondent: ${labelOf(ROLE_OPTIONS, u.user_role)}`)
  lines.push(`AI system: ${u.ai_system_name || "(not specified)"}`)
  lines.push(`Industry / domain: ${u.industry_domain || "(not specified)"}`)
  lines.push(`Primary decision affected: ${u.primary_decision || "(not specified)"}`)
  lines.push(`Who is evaluated: ${u.who_is_evaluated || "(not specified)"}`)
  lines.push(`Consequence category: ${labelOf(CONSEQUENCE_OPTIONS, u.consequence)}`)
  lines.push(`Scan basis: ${labelOf(SCAN_BASIS_OPTIONS, u.scan_basis)}`)

  // 2. Declared Function
  lines.push(heading("2. Declared Function"))
  lines.push(`Declared master function: ${labelOf(DECLARED_MASTER_FUNCTION_OPTIONS, mf.declared)}`)

  // 3. Operational Master Function
  lines.push(heading("3. Operational Master Function"))
  lines.push(`Operational master function(s): ${mf.operational.join(", ")}`)
  lines.push(`Master function contradiction risk: ${mf.contradictionRisk.toUpperCase()}`)

  // 4. Accountability Chain Summary
  lines.push(heading("4. Accountability Chain Summary"))
  lines.push("Decision system stages:")
  DECISION_STAGE_ORDER.forEach(key => {
    const s = decision_stages[key]
    lines.push(
      `  - ${DECISION_STAGE_LABEL[key]}: exists=${labelOf(STAGE_EXISTS_OPTIONS, s.exists)}, ` +
      `owner=${s.owner || "(not named)"}, evidence=${labelOf(EVIDENCE_TIER_OPTIONS, s.evidence)}, ` +
      `responsibility=${labelOf(RESPONSIBILITY_CLARITY_OPTIONS, s.responsibility_clarity)}`
    )
  })
  lines.push("")
  lines.push("Ontological accountability chain:")
  CHAIN_ITEM_ORDER.forEach(key => {
    const item = chain_items[key]
    lines.push(
      `  - ${CHAIN_ITEM_LABEL[key]}: owner=${item.owner || "(not named)"}, ` +
      `evidence=${labelOf(EVIDENCE_TIER_OPTIONS, item.evidence)}, ` +
      `responsibility=${labelOf(RESPONSIBILITY_CLARITY_OPTIONS, item.responsibility_clarity)}` +
      (item.missing_documentation ? " [documentation missing]" : "")
    )
  })

  // 5. Risk Summary
  lines.push(heading("5. Risk Summary"))
  lines.push(`Preliminary risk: ${risk.preliminaryRisk.toFixed(1)}/4.0 — ${risk.preliminaryRiskCategory.toUpperCase()} (preliminary, evidence-dependent, unverified)`)
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
  lines.push(`Evidence confidence: ${confidence.level.toUpperCase()} (${confidence.percent}% ceiling, separate from risk)`)
  lines.push(confidence.explanation)

  // 7. Contradiction Findings
  lines.push(heading("7. Contradiction Findings"))
  lines.push(`Contradiction index: ${contradiction.index.toUpperCase()}`)
  lines.push("Declared governance position (assumed institutional narrative, tested below):")
  contradiction.declaredGovernancePosition.forEach(p => lines.push(`  - ${p}`))
  lines.push("")
  if (contradiction.operationalGovernancePattern.length > 0) {
    lines.push("Operational governance pattern (contradictions found):")
    contradiction.operationalGovernancePattern.forEach(p => lines.push(`  - ${p}`))
  } else {
    lines.push("No contradictions were found between the assumed governance narrative and the recorded operational structure.")
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
    gapEntries.forEach(e => lines.push(`  - ${e.label} (${labelOf(RESPONSIBILITY_CLARITY_OPTIONS, e.clarity)})`))
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
