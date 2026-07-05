// ─── Institution Types ─────────────────────────────────────────────────────────

export type InstitutionType =
  | "hiring_ai"
  | "credit_ai"
  | "welfare_ai"
  | "housing_screening"
  | "education_ai"
  | "medical_ai"
  | "labor_platform"
  | "insurance_ai"
  | "other"

export type ClassifiedSubject =
  | "applicant"
  | "worker"
  | "tenant"
  | "borrower"
  | "student"
  | "patient"
  | "welfare_recipient"
  | "platform_worker"
  | "insured_person"
  | "other"

export type InstitutionProfile = {
  institution_type: InstitutionType
  system_name: string
  decision_domain: string
  audited_institution: string
  classified_subject: ClassifiedSubject
  decision_context: string
  audit_purpose: string
  declared_master_function: string
}

// ─── Classification Map ────────────────────────────────────────────────────────

export type VariableCategory =
  | "historical_record"
  | "behavioral_data"
  | "biometric_data"
  | "socioeconomic_proxy"
  | "institutional_record"
  | "recommendation"
  | "credential"
  | "platform_metric"
  | "location_proxy"
  | "medical_marker"
  | "other"

export type InputVariable = {
  id: string
  name: string
  category: VariableCategory
  source: string
  contestable: boolean
  correction_possible: boolean
  notes: string
}

export type ClassificationMap = {
  classification_terms: string[]
  input_variables: InputVariable[]
}

export type ClassificationAnalysis = {
  reifiesPastRecords: boolean
  convertsSocialConditions: boolean
  usesProxyVariables: boolean
  subjectCanContest: boolean
}

// ─── Closure Map ──────────────────────────────────────────────────────────────

export type DecisionResult =
  | "accepted"
  | "rejected"
  | "flagged"
  | "downgraded"
  | "delayed"
  | "suspended"
  | "surveilled"
  | "higher_price"
  | "lower_priority"
  | "other"

export type AccessType =
  | "employment"
  | "housing"
  | "credit"
  | "welfare"
  | "education"
  | "medical_care"
  | "insurance"
  | "platform_access"
  | "mobility"
  | "public_service"
  | "re_entry"
  | "other"

export type ClosureEntry = {
  id: string
  decision_result: DecisionResult
  access_closed: AccessType[]
  severity: 0 | 1 | 2 | 3
  duration: string
  reversibility: string
  notes: string
}

export type ClosureMap = {
  closures: ClosureEntry[]
}

// ─── Explanation & Contestability ─────────────────────────────────────────────

export type ContestabilityData = {
  explanation_provided: boolean
  explanation_specificity: 0 | 1 | 2 | 3
  explanation_actionable: boolean
  appeal_available: boolean
  correction_available: boolean
  human_review_available: boolean
  appeal_time_limit_days: number | null
  response_time_days: number | null
  notes: string
}

// ─── Support Conversion ────────────────────────────────────────────────────────

export type SupportData = {
  support_offered: boolean
  training_offered: boolean
  reassessment_date_given: boolean
  case_worker_available: boolean
  alternative_pathway_available: boolean
  intervention_available: boolean
  support_notes: string
}

// ─── Re-entry Timeline ────────────────────────────────────────────────────────

export type ReentryData = {
  reapplication_allowed: boolean
  waiting_period_days: number | null
  score_expiration_days: number | null
  past_classification_persists: boolean
  reassessment_available: boolean
  reassessment_interval_days: number | null
  reentry_conditions_clear: boolean
  reentry_notes: string
}

// ─── Responsibility Map ───────────────────────────────────────────────────────

export type ResponsibilityBasis = "declared" | "independently_verified"

export type ResponsibilityData = {
  classification_design_owner: string
  decision_owner: string
  system_operator: string
  AI_vendor: string
  data_provider: string
  appeal_owner: string
  correction_owner: string
  human_override_owner: string
  audit_owner: string
  governance_oversight_owner: string
  responsible_contact_exists: boolean
  override_authority_exists: boolean
  responsibility_basis: ResponsibilityBasis
  responsibility_notes: string
}

// ─── Counterfactual Test ──────────────────────────────────────────────────────

export type CounterfactualProfile = {
  id: string
  changed_variable: string
  baseline_value: string
  modified_value: string
  baseline_outcome: DecisionResult | ""
  modified_outcome: DecisionResult | ""
  closure_delta: 0 | 1 | 2 | 3
  notes: string
}

// ─── Declared Governance Claims ────────────────────────────────────────────────

export type GovernanceClaimCategory =
  | "human_review"
  | "appeal_rights"
  | "data_correction"
  | "non_discrimination"
  | "transparency"
  | "data_retention_limits"
  | "re_entry_support"
  | "accountability"
  | "other"

export type GovernanceClaim = {
  id: string
  category: GovernanceClaimCategory
  claim_text: string
  source: string
  self_reported: boolean
}

// ─── Evidence Sources ─────────────────────────────────────────────────────────

export type SourceType =
  | "theoretical_hypothesis"
  | "simulated_scenario"
  | "public_document"
  | "policy_document"
  | "rejection_notice"
  | "website_or_FAQ"
  | "counterfactual_test"
  | "interview_record"
  | "survey_record"
  | "longitudinal_record"
  | "third_party_audit"
  | "other"

// 0–6 scale
export type EvidenceLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type EvidenceSource = {
  id: string
  source_type: SourceType
  title: string
  citation_or_url: string
  date: string
  reliability_notes: string
  evidence_level: EvidenceLevel
}

// ─── Scores (0–3) ─────────────────────────────────────────────────────────────

export type DDATScores = {
  classificationRisk: 0 | 1 | 2 | 3
  closureRisk: 0 | 1 | 2 | 3
  contestabilityCapacity: 0 | 1 | 2 | 3
  supportConversion: 0 | 1 | 2 | 3
  reentryCapacity: 0 | 1 | 2 | 3
  temporalRecovery: 0 | 1 | 2 | 3
  responsibilityGap: 0 | 1 | 2 | 3
  evidenceLevel: EvidenceLevel
}

export type DDATJudgmentLabel =
  | "support-generative"
  | "ambiguous"
  | "closure-generative"
  | "institutionally-dangerous"
  | "insufficient-evidence"

// ─── Evidence Confidence (separate from risk) ─────────────────────────────────
// Risk scores describe institutional exposure IF the recorded configuration is
// accurate. Confidence describes how much independent verification that
// configuration has actually received. The two are never combined into a
// single number.

export type ConfidenceLabel =
  | "Unverified"
  | "Self-Reported Only"
  | "Partially Verified"
  | "Verified"

export type EvidenceConfidence = {
  label: ConfidenceLabel
  independentSourceCount: number
  selfReportedSourceCount: number
  missingEvidenceWarnings: string[]
}

// ─── Contradiction Findings ────────────────────────────────────────────────────
// Where a declared governance claim (what the institution says it does)
// conflicts with the recorded operational structure (what the audit found).

export type ContradictionSeverity = "moderate" | "severe"

export type ContradictionFinding = {
  id: string
  category: GovernanceClaimCategory
  claimText: string
  operationalFinding: string
  severity: ContradictionSeverity
}

// ─── Declared vs. Operational Master Function ─────────────────────────────────

export type MasterFunctionAlignment = "aligned" | "unclear" | "contradicted"

export type MasterFunctionComparison = {
  declared: string
  operational: string
  alignment: MasterFunctionAlignment
  rationale: string
}

export type DDATJudgment = {
  label: DDATJudgmentLabel
  scores: DDATScores
  reasoningPath: string[]
  improvementRequirements: string[]
  evidenceGaps: string[]
  confidence: EvidenceConfidence
  contradictions: ContradictionFinding[]
  masterFunction: MasterFunctionComparison
}

// ─── Full Audit Case ──────────────────────────────────────────────────────────

export type EvidenceAuditCase = {
  id: string
  created_at: string
  institution_profile: InstitutionProfile
  classification_map: ClassificationMap
  closure_map: ClosureMap
  contestability: ContestabilityData
  support: SupportData
  reentry: ReentryData
  responsibility: ResponsibilityData
  counterfactuals: CounterfactualProfile[]
  evidence_sources: EvidenceSource[]
  governance_claims: GovernanceClaim[]
}
