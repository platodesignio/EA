import type { EvidenceAuditCase } from "./ddat-evidence-schema"
import type { DDATJudgment } from "./ddat-evidence-schema"
import { evidenceLevelLabel, judgmentDescription, scoreLabel, governanceClaimCategoryLabel } from "./ddat-judgment"

function line(s: string) { return s + "\n" }
function h1(s: string) { return `# ${s}\n` }
function h2(s: string) { return `\n## ${s}\n` }
function h3(s: string) { return `\n### ${s}\n` }
function bold(s: string) { return `**${s}**` }
function item(s: string) { return `- ${s}` }
function br() { return "\n" }

export function generateMarkdownReport(
  auditCase: EvidenceAuditCase,
  judgment: DDATJudgment
): string {
  const p = auditCase.institution_profile
  const cm = auditCase.classification_map
  const cl = auditCase.closure_map
  const ct = auditCase.contestability
  const sp = auditCase.support
  const re = auditCase.reentry
  const rs = auditCase.responsibility
  const cf = auditCase.counterfactuals
  const ev = auditCase.evidence_sources
  const gc = auditCase.governance_claims
  const sc = judgment.scores
  const conf = judgment.confidence
  const mf = judgment.masterFunction

  const sections: string[] = []

  // Header
  sections.push(h1("DDAT Evidence Audit Report"))
  sections.push(line(`${bold("System:")} ${p.system_name || "(not specified)"}`))
  sections.push(line(`${bold("Institution:")} ${p.audited_institution || "(not specified)"}`))
  sections.push(line(`${bold("Institution Type:")} ${p.institution_type}`))
  sections.push(line(`${bold("Classified Subject:")} ${p.classified_subject}`))
  sections.push(line(`${bold("Audit Purpose:")} ${p.audit_purpose || "(not specified)"}`))
  sections.push(line(`${bold("Generated:")} ${new Date().toISOString().slice(0, 10)}`))
  sections.push(br())

  // Non-person scoring statement
  sections.push(line("> **Non-Person-Scoring Statement:** This audit does not score the affected person. It evaluates the institution's classification regime, decision architecture, responsibility structure, and capacity to preserve or close future possibility."))
  sections.push(line("> **Audit Standard:** We do not measure private belief. We audit institutionalized commitments — the declared and operational structures the institution has actually put in place."))
  sections.push(br())

  // Evidence Confidence — separate from risk, stated up front
  sections.push(h2("Evidence Confidence"))
  sections.push(line(`${bold("Confidence Level:")} ${conf.label.toUpperCase()}`))
  sections.push(line(`${bold("Independent Sources:")} ${conf.independentSourceCount}  ${bold("Self-Reported Sources:")} ${conf.selfReportedSourceCount}`))
  if (conf.label === "Unverified" || conf.label === "Self-Reported Only") {
    sections.push(br())
    sections.push(line("> This audit is UNVERIFIED against independent evidence. The risk scores below describe institutional exposure *if* the recorded configuration is accurate. That configuration has not been independently confirmed."))
  }
  if (conf.missingEvidenceWarnings.length > 0) {
    sections.push(br())
    sections.push(line(bold("Missing Evidence Warnings:")))
    conf.missingEvidenceWarnings.forEach(w => sections.push(line(item(w))))
  }
  sections.push(br())

  // Declared vs. Operational Master Function
  sections.push(h2("Declared vs. Operational Master Function"))
  sections.push(line(`${bold("Declared Master Function:")} ${mf.declared}`))
  sections.push(line(`${bold("Operational Master Function:")} ${mf.operational}`))
  sections.push(line(`${bold("Alignment:")} ${mf.alignment.toUpperCase()}`))
  sections.push(line(mf.rationale))
  sections.push(br())

  // DDAT Judgment (risk — kept separate from confidence above)
  sections.push(h2("DDAT Judgment"))
  sections.push(line(`${bold("Judgment:")} ${judgment.label.toUpperCase()}`))
  sections.push(line(judgmentDescription(judgment.label)))
  sections.push(br())

  sections.push(h3("Scores"))
  sections.push(line(`| Dimension | Score | Label |`))
  sections.push(line(`|---|---|---|`))
  sections.push(line(`| Classification Risk | ${sc.classificationRisk}/3 | ${scoreLabel(sc.classificationRisk)} |`))
  sections.push(line(`| Closure Risk | ${sc.closureRisk}/3 | ${scoreLabel(sc.closureRisk)} |`))
  sections.push(line(`| Contestability Capacity | ${sc.contestabilityCapacity}/3 | ${scoreLabel(sc.contestabilityCapacity, true)} |`))
  sections.push(line(`| Support Conversion | ${sc.supportConversion}/3 | ${scoreLabel(sc.supportConversion, true)} |`))
  sections.push(line(`| Re-entry Capacity | ${sc.reentryCapacity}/3 | ${scoreLabel(sc.reentryCapacity, true)} |`))
  sections.push(line(`| Temporal Recovery | ${sc.temporalRecovery}/3 | ${scoreLabel(sc.temporalRecovery, true)} |`))
  sections.push(line(`| Responsibility Gap | ${sc.responsibilityGap}/3 | ${scoreLabel(sc.responsibilityGap)} |`))
  sections.push(line(`| Evidence Level | ${sc.evidenceLevel}/6 | ${evidenceLevelLabel(sc.evidenceLevel)} |`))
  sections.push(br())

  sections.push(h3("Reasoning Path"))
  if (judgment.reasoningPath.length > 0) {
    judgment.reasoningPath.forEach(r => sections.push(line(item(r))))
  } else {
    sections.push(line("No significant risks identified at current evidence level."))
  }
  sections.push(br())

  // Institution Profile
  sections.push(h2("Institution Profile"))
  sections.push(line(`${bold("Decision Domain:")} ${p.decision_domain || "(not specified)"}`))
  sections.push(line(`${bold("Decision Context:")} ${p.decision_context || "(not specified)"}`))
  sections.push(br())
  sections.push(line("> The object of audit is the institution, not the individual."))
  sections.push(br())

  // Classification Map
  sections.push(h2("Classification Map"))
  if (cm.classification_terms.length > 0) {
    sections.push(line(`${bold("Classification Terms:")} ${cm.classification_terms.join(", ")}`))
  }
  sections.push(br())
  if (cm.input_variables.length > 0) {
    sections.push(line(`| Variable | Category | Contestable | Correction Possible |`))
    sections.push(line(`|---|---|---|---|`))
    cm.input_variables.forEach(v => {
      sections.push(line(`| ${v.name} | ${v.category} | ${v.contestable ? "Yes" : "No"} | ${v.correction_possible ? "Yes" : "No"} |`))
    })
    sections.push(br())
  } else {
    sections.push(line("No input variables documented."))
    sections.push(br())
  }

  // Closure Map
  sections.push(h2("Closure Map"))
  if (cl.closures.length > 0) {
    cl.closures.forEach(c => {
      sections.push(line(`${bold("Decision Result:")} ${c.decision_result}`))
      sections.push(line(`${bold("Access Closed:")} ${c.access_closed.join(", ")}`))
      sections.push(line(`${bold("Severity:")} ${c.severity}/3`))
      sections.push(line(`${bold("Duration:")} ${c.duration || "(not specified)"}`))
      sections.push(line(`${bold("Reversibility:")} ${c.reversibility || "(not specified)"}`))
      if (c.notes) sections.push(line(`${bold("Notes:")} ${c.notes}`))
      sections.push(br())
    })
  } else {
    sections.push(line("No closures documented."))
    sections.push(br())
  }

  // Explanation and Contestability
  sections.push(h2("Explanation and Contestability"))
  sections.push(line(`| Field | Value |`))
  sections.push(line(`|---|---|`))
  sections.push(line(`| Explanation Provided | ${ct.explanation_provided ? "Yes" : "No"} |`))
  sections.push(line(`| Explanation Specificity | ${ct.explanation_specificity}/3 |`))
  sections.push(line(`| Explanation Actionable | ${ct.explanation_actionable ? "Yes" : "No"} |`))
  sections.push(line(`| Appeal Available | ${ct.appeal_available ? "Yes" : "No"} |`))
  sections.push(line(`| Correction Available | ${ct.correction_available ? "Yes" : "No"} |`))
  sections.push(line(`| Human Review Available | ${ct.human_review_available ? "Yes" : "No"} |`))
  if (ct.appeal_time_limit_days !== null) sections.push(line(`| Appeal Time Limit | ${ct.appeal_time_limit_days} days |`))
  if (ct.response_time_days !== null) sections.push(line(`| Response Time | ${ct.response_time_days} days |`))
  if (ct.notes) { sections.push(br()); sections.push(line(ct.notes)) }
  sections.push(br())

  // Support Conversion
  sections.push(h2("Support Conversion"))
  sections.push(line(`| Field | Value |`))
  sections.push(line(`|---|---|`))
  sections.push(line(`| Support Offered | ${sp.support_offered ? "Yes" : "No"} |`))
  sections.push(line(`| Training Offered | ${sp.training_offered ? "Yes" : "No"} |`))
  sections.push(line(`| Reassessment Date Given | ${sp.reassessment_date_given ? "Yes" : "No"} |`))
  sections.push(line(`| Case Worker Available | ${sp.case_worker_available ? "Yes" : "No"} |`))
  sections.push(line(`| Alternative Pathway Available | ${sp.alternative_pathway_available ? "Yes" : "No"} |`))
  sections.push(line(`| Intervention Available | ${sp.intervention_available ? "Yes" : "No"} |`))
  if (sp.support_notes) { sections.push(br()); sections.push(line(sp.support_notes)) }
  sections.push(br())

  // Re-entry Timeline
  sections.push(h2("Re-entry Timeline"))
  sections.push(line(`| Field | Value |`))
  sections.push(line(`|---|---|`))
  sections.push(line(`| Reapplication Allowed | ${re.reapplication_allowed ? "Yes" : "No"} |`))
  if (re.waiting_period_days !== null) sections.push(line(`| Waiting Period | ${re.waiting_period_days} days |`))
  if (re.score_expiration_days !== null) sections.push(line(`| Score Expiration | ${re.score_expiration_days} days |`))
  sections.push(line(`| Past Classification Persists | ${re.past_classification_persists ? "Yes" : "No"} |`))
  sections.push(line(`| Reassessment Available | ${re.reassessment_available ? "Yes" : "No"} |`))
  sections.push(line(`| Re-entry Conditions Clear | ${re.reentry_conditions_clear ? "Yes" : "No"} |`))
  if (re.reentry_notes) { sections.push(br()); sections.push(line(re.reentry_notes)) }
  sections.push(br())

  // Responsibility Map
  sections.push(h2("Responsibility Map"))
  sections.push(line(`${bold("Basis:")} ${rs.responsibility_basis === "independently_verified" ? "Independently Verified" : "Declared (institution's own account)"}`))
  sections.push(br())
  sections.push(line(`| Accountability Stage | Named Party |`))
  sections.push(line(`|---|---|`))
  sections.push(line(`| Classification Design Owner | ${rs.classification_design_owner || "(not named)"} |`))
  sections.push(line(`| Decision Owner | ${rs.decision_owner || "(not named)"} |`))
  sections.push(line(`| System Operator | ${rs.system_operator || "(not named)"} |`))
  sections.push(line(`| AI Vendor | ${rs.AI_vendor || "(not named)"} |`))
  sections.push(line(`| Data Provider | ${rs.data_provider || "(not named)"} |`))
  sections.push(line(`| Appeal Owner | ${rs.appeal_owner || "(not named)"} |`))
  sections.push(line(`| Correction Owner | ${rs.correction_owner || "(not named)"} |`))
  sections.push(line(`| Human Override Owner | ${rs.human_override_owner || "(not named)"} |`))
  sections.push(line(`| Governance Oversight Owner | ${rs.governance_oversight_owner || "(not named)"} |`))
  sections.push(line(`| Audit Owner | ${rs.audit_owner || "(not named)"} |`))
  sections.push(br())
  sections.push(line(`${bold("Responsible Contact Exists:")} ${rs.responsible_contact_exists ? "Yes" : "No"}`))
  sections.push(line(`${bold("Override Authority Exists:")} ${rs.override_authority_exists ? "Yes" : "No"}`))
  if (rs.responsibility_notes) { sections.push(br()); sections.push(line(rs.responsibility_notes)) }
  sections.push(br())

  // Declared Governance Claims
  sections.push(h2("Declared Governance Claims"))
  if (gc.length > 0) {
    sections.push(line(`| Category | Claim | Source | Self-Reported |`))
    sections.push(line(`|---|---|---|---|`))
    gc.forEach(g => {
      sections.push(line(`| ${governanceClaimCategoryLabel(g.category)} | ${g.claim_text} | ${g.source || "—"} | ${g.self_reported ? "Yes" : "No"} |`))
    })
    sections.push(br())
  } else {
    sections.push(line("No governance claims recorded."))
    sections.push(br())
  }

  // Contradiction Findings
  sections.push(h2("Contradiction Findings"))
  if (judgment.contradictions.length > 0) {
    sections.push(line("Declared governance claims that conflict with the recorded operational structure:"))
    sections.push(br())
    judgment.contradictions.forEach(cx => {
      sections.push(line(`${bold(`[${cx.severity.toUpperCase()}]`)} ${governanceClaimCategoryLabel(cx.category)}`))
      sections.push(line(`${bold("Declared:")} ${cx.claimText}`))
      sections.push(line(`${bold("Operational Finding:")} ${cx.operationalFinding}`))
      sections.push(br())
    })
  } else {
    sections.push(line("No contradictions identified between declared governance claims and the recorded operational structure."))
    sections.push(br())
  }

  // Counterfactual Test Results
  sections.push(h2("Counterfactual Test Results"))
  if (cf.length > 0) {
    cf.forEach((test, i) => {
      sections.push(h3(`Test ${i + 1}: ${test.changed_variable}`))
      sections.push(line(`${bold("Baseline:")} ${test.baseline_value} → ${test.baseline_outcome || "(not recorded)"}`))
      sections.push(line(`${bold("Modified:")} ${test.modified_value} → ${test.modified_outcome || "(not recorded)"}`))
      sections.push(line(`${bold("Closure Delta:")} ${test.closure_delta}/3`))
      if (test.notes) sections.push(line(`${bold("Notes:")} ${test.notes}`))
      sections.push(br())
    })
  } else {
    sections.push(line("No counterfactual tests performed."))
    sections.push(br())
  }

  // Evidence Table
  sections.push(h2("Evidence Table"))
  if (ev.length > 0) {
    sections.push(line(`| Source | Type | Level | Date |`))
    sections.push(line(`|---|---|---|---|`))
    ev.forEach(s => {
      sections.push(line(`| ${s.title} | ${s.source_type} | ${s.evidence_level} – ${evidenceLevelLabel(s.evidence_level)} | ${s.date || "—"} |`))
    })
    sections.push(br())
  } else {
    sections.push(line("No evidence sources documented."))
    sections.push(br())
  }

  // Improvement Requirements
  sections.push(h2("Improvement Requirements"))
  if (judgment.improvementRequirements.length > 0) {
    judgment.improvementRequirements.forEach(r => sections.push(line(item(r))))
  } else {
    sections.push(line("No specific improvements identified."))
  }
  sections.push(br())

  // Evidence Gaps
  sections.push(h2("Evidence Gaps"))
  if (judgment.evidenceGaps.length > 0) {
    judgment.evidenceGaps.forEach(g => sections.push(line(item(g))))
  } else {
    sections.push(line("No evidence gaps identified."))
  }
  sections.push(br())

  // Footer
  sections.push(h2("About This Audit"))
  sections.push(line("This report was generated by the DDAT Evidence Simulator, a research prototype for auditing AI-scored decision systems. It is not a legal compliance document. It is structured for direct use in an executive memo or board briefing."))
  sections.push(br())
  sections.push(line("> **DDAT audits institutions, not persons.** The object of audit is the classification regime, responsibility structure, and decision architecture — not the moral worth, ability, or future of any individual."))

  return sections.join("")
}
