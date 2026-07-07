// ─── CEO AI Accountability Console — Type Definitions ──────────────────────
// Powered by the DDAT Evidence Standard. This tool audits institutions, not
// persons: every type below describes a decision system's declared and
// operational structure, never a person's belief, character, or worth.

// ─── Section 1 — CEO Entry / Audit Unit ────────────────────────────────────

export type UserRole =
  | "ceo_founder"
  | "board_member"
  | "executive"
  | "cto_engineering_lead"
  | "product_lead"
  | "legal_compliance"
  | "researcher"
  | "auditor"
  | "other"

export type DecisionConsequence =
  | "hiring_employment"
  | "credit_finance"
  | "housing"
  | "insurance"
  | "education"
  | "healthcare_triage"
  | "welfare_public_services"
  | "platform_visibility"
  | "creator_ranking"
  | "worker_productivity"
  | "content_recommendation"
  | "access_control"
  | "pricing_eligibility"
  | "other"

export type ScanEvidenceBasis = "self_reported" | "document_supported" | "evidence_supported"

export type AuditUnit = {
  organization_name: string
  user_role: UserRole
  ai_system_name: string
  industry_domain: string
  primary_decision: string
  who_is_evaluated: string
  consequence: DecisionConsequence
  scan_basis: ScanEvidenceBasis
}

// ─── Shared vocabulary — reused across Sections 2 and 4 ────────────────────
// The accountability chain (Section 4) and the decision system map (Section
// 2) both record "does it exist," "who owns it," and "what evidence
// supports it" — so they share the same three enumerations.

export type StageExists = "yes" | "partial" | "no" | "unknown"

export type EvidenceTier =
  | "none"
  | "self_report_only"
  | "public_document"
  | "internal_policy"
  | "logs_records"
  | "affected_subject_evidence"
  | "independent_review"

export type ResponsibilityClarity =
  | "clear_owner_with_authority"
  | "named_owner_unclear_authority"
  | "shared_responsibility"
  | "no_clear_owner"
  | "unknown"

// ─── Section 2 — AI Decision System Map ────────────────────────────────────

export type DecisionStageKey =
  | "input_data"
  | "model_scoring_logic"
  | "output"
  | "human_review"
  | "decision"
  | "consequence"
  | "appeal"
  | "re_entry"

export type DecisionStageData = {
  key: DecisionStageKey
  exists: StageExists
  owner: string
  documented: boolean
  evidence: EvidenceTier
  responsibility_clarity: ResponsibilityClarity
}

// ─── Section 3 — Master Function Detection ─────────────────────────────────

export type DeclaredMasterFunction =
  | "ranking"
  | "scoring"
  | "prediction"
  | "recommendation"
  | "risk_classification"
  | "access_control"
  | "productivity_monitoring"
  | "reputation_system"
  | "behavioral_nudging"
  | "automated_exclusion"
  | "other"

export type AnswerScale = "no" | "weakly" | "partially" | "strongly" | "structurally"

export type MasterFunctionQuestionKey =
  | "visibility_control"
  | "score_affects_access"
  | "predicts_future_behavior"
  | "recommendation_shapes_choice"
  | "allows_denies_access"
  | "monitors_productivity"
  | "can_exclude_automatically"
  | "human_override_possible"

export type MasterFunctionAnswers = Record<MasterFunctionQuestionKey, AnswerScale>

export type OperationalFunctionLabel =
  | "Ranking"
  | "Scoring"
  | "Prediction"
  | "Recommendation"
  | "Access Control"
  | "Productivity Monitoring"
  | "Automated Exclusion"

export type RiskLevel = "Low" | "Medium" | "High"

export type MasterFunctionResult = {
  declared: DeclaredMasterFunction
  operational: OperationalFunctionLabel[] // top 1–3, highest signal first
  operationalScores: Record<OperationalFunctionLabel, number> // 0–4 each
  // Deliberately not named "contradictionRisk" — that name collides with the
  // unrelated Contradiction Index (Section 6/7, computeContradictionIndex),
  // which tests declared governance claims, not this declared-vs-operational
  // function comparison. Two similarly-named but methodologically distinct
  // metrics in one report is a real source of reader confusion.
  functionMismatchRisk: RiskLevel
}

// ─── Section 4 — Ontological Accountability Chain ──────────────────────────

export type ChainItemKey =
  | "belief_strategic_intent"
  | "business_model"
  | "data_collection"
  | "model_scoring_logic"
  | "interface_ux"
  | "policy_terms"
  | "human_oversight"
  | "decision_execution"
  | "appeal_complaint_handling"
  | "re_entry_recovery"
  | "affected_human_future"

export type ChainItemData = {
  key: ChainItemKey
  owner: string
  evidence: EvidenceTier
  responsibility_clarity: ResponsibilityClarity
  missing_documentation: boolean
  risk_note: string
}

// ─── Section 5 — Evidence Confidence ───────────────────────────────────────
// Confidence is capped by the strongest evidence tier actually recorded. It
// is never combined with risk — see EvidenceConfidenceResult vs RiskDashboard.

export type ConfidenceLevel = "Low" | "Medium" | "High"

export type EvidenceConfidenceResult = {
  percent: number // 0–90, capped per EVIDENCE_TIER_CAP
  level: ConfidenceLevel
  strongestTier: EvidenceTier
  explanation: string
}

// ─── Section 6 — Contradiction Index ───────────────────────────────────────

export type ContradictionCheck = {
  id: string
  claim: string
  violated: boolean
  operationalFinding: string
  // Board-memo phrasing combining claim + finding into one sentence, e.g.
  // "Human-centered claim is weakened by a missing appeal route."
  plainFinding: string
}

export type ContradictionIndexResult = {
  // Not collected from the organization — this is the generic institutional
  // narrative (human-centered, transparent, accountable) the console
  // assumes as a baseline and tests, since no separate claims-intake exists.
  // Never call this "declared" anywhere it's displayed: nothing here was
  // actually declared by the audited organization.
  assumedGovernancePosition: string[]
  checks: ContradictionCheck[]
  index: RiskLevel
}

// ─── Section 7 — Risk Dashboard ────────────────────────────────────────────

export type RiskDomainKey =
  | "ontological_overreach"
  | "human_reduction"
  | "responsibility_displacement"
  | "recognition_loss"
  | "reversal_loss"
  | "future_closure"
  | "return_damage"

export type CapacityDomainKey =
  | "responsibility_generation"
  | "counter_audit_capacity"
  | "appealability"
  | "re_entry_capacity"
  | "directional_legitimacy"

export type PreliminaryRiskCategory = "Low" | "Moderate" | "High" | "Severe"

export type RiskDashboardResult = {
  riskDomains: Record<RiskDomainKey, number> // 0–4
  capacityDomains: Record<CapacityDomainKey, number> // 0–4
  riskAverage: number
  capacityAverage: number
  preliminaryRisk: number // 0–4, after adjustments
  preliminaryRiskCategory: PreliminaryRiskCategory
  adjustmentsApplied: string[]
  primaryMissingEvidence: string[]
  recommendedImmediateAction: string
}

// ─── Full Case ──────────────────────────────────────────────────────────────

export type CEOConsoleCase = {
  id: string
  created_at: string
  audit_unit: AuditUnit
  decision_stages: Record<DecisionStageKey, DecisionStageData>
  master_function: {
    declared: DeclaredMasterFunction
    answers: MasterFunctionAnswers
  }
  chain_items: Record<ChainItemKey, ChainItemData>
}
