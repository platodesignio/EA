// ─── FED-DLR Audit — Question & Option Data ────────────────
// All static labels and option lists live here, separate from scoring logic
// (lib/scoring.ts) and state (lib/ceo-console-store.tsx).

import type {
  UserRole,
  DecisionConsequence,
  ScanEvidenceBasis,
  DecisionStageKey,
  StageExists,
  EvidenceTier,
  ResponsibilityClarity,
  DeclaredMasterFunction,
  MasterFunctionQuestionKey,
  AnswerScale,
  ChainItemKey,
} from "./types"

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "ceo_founder", label: "CEO / Founder" },
  { value: "board_member", label: "Board Member" },
  { value: "executive", label: "Executive" },
  { value: "cto_engineering_lead", label: "CTO / Engineering Lead" },
  { value: "product_lead", label: "Product Lead" },
  { value: "legal_compliance", label: "Legal / Compliance" },
  { value: "researcher", label: "Researcher" },
  { value: "auditor", label: "Auditor" },
  { value: "other", label: "Other" },
]

export const CONSEQUENCE_OPTIONS: { value: DecisionConsequence; label: string }[] = [
  { value: "hiring_employment", label: "Hiring / Employment" },
  { value: "credit_finance", label: "Credit / Finance" },
  { value: "housing", label: "Housing" },
  { value: "insurance", label: "Insurance" },
  { value: "education", label: "Education" },
  { value: "healthcare_triage", label: "Healthcare / Triage" },
  { value: "welfare_public_services", label: "Welfare / Public Services" },
  { value: "platform_visibility", label: "Platform Visibility" },
  { value: "creator_ranking", label: "Creator Ranking" },
  { value: "worker_productivity", label: "Worker Productivity" },
  { value: "content_recommendation", label: "Content Recommendation" },
  { value: "access_control", label: "Access Control" },
  { value: "pricing_eligibility", label: "Pricing / Eligibility" },
  { value: "other", label: "Other" },
]

// Consequence categories treated as "major life opportunity" for risk
// adjustment purposes (Section 7).
export const MAJOR_LIFE_CONSEQUENCES: DecisionConsequence[] = [
  "hiring_employment",
  "credit_finance",
  "housing",
  "insurance",
  "education",
  "healthcare_triage",
  "welfare_public_services",
]

export const SCAN_BASIS_OPTIONS: { value: ScanEvidenceBasis; label: string }[] = [
  { value: "self_reported", label: "Self-reported" },
  { value: "document_supported", label: "Document-supported" },
  { value: "evidence_supported", label: "Evidence-supported" },
]

// ─── Section 2 — Decision System Map ───────────────────────────────────────

export const DECISION_STAGE_ORDER: DecisionStageKey[] = [
  "input_data",
  "model_scoring_logic",
  "output",
  "human_review",
  "decision",
  "consequence",
  "appeal",
  "re_entry",
]

export const DECISION_STAGE_LABEL: Record<DecisionStageKey, string> = {
  input_data: "Input Data",
  model_scoring_logic: "Model / Scoring Logic",
  output: "Output",
  human_review: "Human Review",
  decision: "Decision",
  consequence: "Consequence",
  appeal: "Appeal",
  re_entry: "Re-entry",
}

export const STAGE_EXISTS_OPTIONS: { value: StageExists; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "partial", label: "Partial" },
  { value: "no", label: "No" },
  { value: "unknown", label: "Unknown" },
]

export const EVIDENCE_TIER_OPTIONS: { value: EvidenceTier; label: string }[] = [
  { value: "none", label: "None" },
  { value: "self_report_only", label: "Self-report only" },
  { value: "public_document", label: "Public document" },
  { value: "internal_policy", label: "Internal policy" },
  { value: "logs_records", label: "Logs / records" },
  { value: "affected_subject_evidence", label: "Affected subject evidence" },
  { value: "independent_review", label: "Independent review" },
]

export const RESPONSIBILITY_CLARITY_OPTIONS: { value: ResponsibilityClarity; label: string }[] = [
  { value: "clear_owner_with_authority", label: "Clear owner with authority" },
  { value: "named_owner_unclear_authority", label: "Named owner but unclear authority" },
  { value: "shared_responsibility", label: "Shared responsibility" },
  { value: "no_clear_owner", label: "No clear owner" },
  { value: "unknown", label: "Unknown" },
]

// ─── Section 3 — Master Function Detection ─────────────────────────────────

export const DECLARED_MASTER_FUNCTION_OPTIONS: { value: DeclaredMasterFunction; label: string }[] = [
  { value: "ranking", label: "Ranking" },
  { value: "scoring", label: "Scoring" },
  { value: "prediction", label: "Prediction" },
  { value: "recommendation", label: "Recommendation" },
  { value: "risk_classification", label: "Risk Classification" },
  { value: "access_control", label: "Access Control" },
  { value: "productivity_monitoring", label: "Productivity Monitoring" },
  { value: "reputation_system", label: "Reputation System" },
  { value: "behavioral_nudging", label: "Behavioral Nudging" },
  { value: "automated_exclusion", label: "Automated Exclusion" },
  { value: "other", label: "Other" },
]

export const ANSWER_SCALE_OPTIONS: { value: AnswerScale; label: string }[] = [
  { value: "no", label: "No" },
  { value: "weakly", label: "Weakly" },
  { value: "partially", label: "Partially" },
  { value: "strongly", label: "Strongly" },
  { value: "structurally", label: "Structurally" },
]

export const MASTER_FUNCTION_QUESTION_ORDER: MasterFunctionQuestionKey[] = [
  "visibility_control",
  "score_affects_access",
  "predicts_future_behavior",
  "recommendation_shapes_choice",
  "allows_denies_access",
  "monitors_productivity",
  "can_exclude_automatically",
  "human_override_possible",
]

export const MASTER_FUNCTION_QUESTION_TEXT: Record<MasterFunctionQuestionKey, string> = {
  visibility_control: "Does the system determine who becomes visible or invisible?",
  score_affects_access: "Does it assign a score that affects access, price, ranking, treatment, or status?",
  predicts_future_behavior: "Does it predict future behavior and use that prediction to change present treatment?",
  recommendation_shapes_choice: "Does it recommend options in a way that shapes the user's real choice environment?",
  allows_denies_access: "Does it allow or deny access to work, credit, housing, education, healthcare, visibility, or opportunity?",
  monitors_productivity: "Does it continuously monitor productivity or behavior?",
  can_exclude_automatically: "Can it exclude, suspend, hide, downgrade, reject, or deprioritize someone automatically?",
  human_override_possible: "Can a human meaningfully override the system?",
}

// ─── Section 4 — Ontological Accountability Chain ──────────────────────────

export const CHAIN_ITEM_ORDER: ChainItemKey[] = [
  "belief_strategic_intent",
  "business_model",
  "data_collection",
  "model_scoring_logic",
  "interface_ux",
  "policy_terms",
  "human_oversight",
  "decision_execution",
  "appeal_complaint_handling",
  "re_entry_recovery",
  "affected_human_future",
]

export const CHAIN_ITEM_LABEL: Record<ChainItemKey, string> = {
  belief_strategic_intent: "Belief / Strategic Intent",
  business_model: "Business Model",
  data_collection: "Data Collection",
  model_scoring_logic: "Model / Scoring Logic",
  interface_ux: "Interface / UX",
  policy_terms: "Policy / Terms",
  human_oversight: "Human Oversight",
  decision_execution: "Decision Execution",
  appeal_complaint_handling: "Appeal / Complaint Handling",
  re_entry_recovery: "Re-entry / Recovery",
  affected_human_future: "Affected Human Future",
}
