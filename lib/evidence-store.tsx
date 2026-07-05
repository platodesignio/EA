"use client"

import React, {
  createContext, useContext, useReducer, useEffect, type ReactNode,
} from "react"
import type {
  EvidenceAuditCase,
  InstitutionProfile,
  ClassificationMap,
  InputVariable,
  ClosureMap,
  ClosureEntry,
  ContestabilityData,
  SupportData,
  ReentryData,
  ResponsibilityData,
  CounterfactualProfile,
  EvidenceSource,
  GovernanceClaim,
} from "./ddat-evidence-schema"

export type EvidenceStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

const EMPTY_PROFILE: InstitutionProfile = {
  institution_type: "other",
  system_name: "",
  decision_domain: "",
  audited_institution: "",
  classified_subject: "applicant",
  decision_context: "",
  audit_purpose: "",
  declared_master_function: "",
}

const EMPTY_CLASSIFICATION: ClassificationMap = {
  classification_terms: [],
  input_variables: [],
}

const EMPTY_CLOSURE: ClosureMap = {
  closures: [],
}

const EMPTY_CONTESTABILITY: ContestabilityData = {
  explanation_provided: false,
  explanation_specificity: 0,
  explanation_actionable: false,
  appeal_available: false,
  correction_available: false,
  human_review_available: false,
  appeal_time_limit_days: null,
  response_time_days: null,
  notes: "",
}

const EMPTY_SUPPORT: SupportData = {
  support_offered: false,
  training_offered: false,
  reassessment_date_given: false,
  case_worker_available: false,
  alternative_pathway_available: false,
  intervention_available: false,
  support_notes: "",
}

const EMPTY_REENTRY: ReentryData = {
  reapplication_allowed: false,
  waiting_period_days: null,
  score_expiration_days: null,
  past_classification_persists: true,
  reassessment_available: false,
  reassessment_interval_days: null,
  reentry_conditions_clear: false,
  reentry_notes: "",
}

const EMPTY_RESPONSIBILITY: ResponsibilityData = {
  classification_design_owner: "",
  decision_owner: "",
  system_operator: "",
  AI_vendor: "",
  data_provider: "",
  appeal_owner: "",
  correction_owner: "",
  human_override_owner: "",
  audit_owner: "",
  governance_oversight_owner: "",
  responsible_contact_exists: false,
  override_authority_exists: false,
  responsibility_basis: "declared",
  responsibility_notes: "",
}

export function emptyCase(): EvidenceAuditCase {
  return {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString().slice(0, 10),
    institution_profile: { ...EMPTY_PROFILE },
    classification_map: { ...EMPTY_CLASSIFICATION },
    closure_map: { ...EMPTY_CLOSURE },
    contestability: { ...EMPTY_CONTESTABILITY },
    support: { ...EMPTY_SUPPORT },
    reentry: { ...EMPTY_REENTRY },
    responsibility: { ...EMPTY_RESPONSIBILITY },
    counterfactuals: [],
    evidence_sources: [],
    governance_claims: [],
  }
}

type EvidenceState = {
  step: EvidenceStep
  auditCase: EvidenceAuditCase
}

type EvidenceAction =
  | { type: "SET_STEP"; payload: EvidenceStep }
  | { type: "SET_PROFILE"; payload: Partial<InstitutionProfile> }
  | { type: "SET_CLASSIFICATION"; payload: Partial<ClassificationMap> }
  | { type: "ADD_VARIABLE"; payload: InputVariable }
  | { type: "UPDATE_VARIABLE"; payload: { id: string; data: Partial<InputVariable> } }
  | { type: "REMOVE_VARIABLE"; payload: string }
  | { type: "SET_CLOSURE_MAP"; payload: Partial<ClosureMap> }
  | { type: "ADD_CLOSURE"; payload: ClosureEntry }
  | { type: "UPDATE_CLOSURE"; payload: { id: string; data: Partial<ClosureEntry> } }
  | { type: "REMOVE_CLOSURE"; payload: string }
  | { type: "SET_CONTESTABILITY"; payload: Partial<ContestabilityData> }
  | { type: "SET_SUPPORT"; payload: Partial<SupportData> }
  | { type: "SET_REENTRY"; payload: Partial<ReentryData> }
  | { type: "SET_RESPONSIBILITY"; payload: Partial<ResponsibilityData> }
  | { type: "ADD_COUNTERFACTUAL"; payload: CounterfactualProfile }
  | { type: "UPDATE_COUNTERFACTUAL"; payload: { id: string; data: Partial<CounterfactualProfile> } }
  | { type: "REMOVE_COUNTERFACTUAL"; payload: string }
  | { type: "ADD_EVIDENCE"; payload: EvidenceSource }
  | { type: "UPDATE_EVIDENCE"; payload: { id: string; data: Partial<EvidenceSource> } }
  | { type: "REMOVE_EVIDENCE"; payload: string }
  | { type: "ADD_GOVERNANCE_CLAIM"; payload: GovernanceClaim }
  | { type: "UPDATE_GOVERNANCE_CLAIM"; payload: { id: string; data: Partial<GovernanceClaim> } }
  | { type: "REMOVE_GOVERNANCE_CLAIM"; payload: string }
  | { type: "LOAD_CASE"; payload: EvidenceAuditCase }
  | { type: "RESET" }

const INITIAL: EvidenceState = {
  step: 0,
  auditCase: emptyCase(),
}

const STORAGE_KEY = "ddat-evidence-v1"

function reducer(state: EvidenceState, action: EvidenceAction): EvidenceState {
  const c = state.auditCase
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload }

    case "SET_PROFILE":
      return { ...state, auditCase: { ...c, institution_profile: { ...c.institution_profile, ...action.payload } } }

    case "SET_CLASSIFICATION":
      return { ...state, auditCase: { ...c, classification_map: { ...c.classification_map, ...action.payload } } }

    case "ADD_VARIABLE":
      return { ...state, auditCase: { ...c, classification_map: { ...c.classification_map, input_variables: [...c.classification_map.input_variables, action.payload] } } }

    case "UPDATE_VARIABLE":
      return { ...state, auditCase: { ...c, classification_map: { ...c.classification_map, input_variables: c.classification_map.input_variables.map(v => v.id === action.payload.id ? { ...v, ...action.payload.data } : v) } } }

    case "REMOVE_VARIABLE":
      return { ...state, auditCase: { ...c, classification_map: { ...c.classification_map, input_variables: c.classification_map.input_variables.filter(v => v.id !== action.payload) } } }

    case "ADD_CLOSURE":
      return { ...state, auditCase: { ...c, closure_map: { closures: [...c.closure_map.closures, action.payload] } } }

    case "UPDATE_CLOSURE":
      return { ...state, auditCase: { ...c, closure_map: { closures: c.closure_map.closures.map(cl => cl.id === action.payload.id ? { ...cl, ...action.payload.data } : cl) } } }

    case "REMOVE_CLOSURE":
      return { ...state, auditCase: { ...c, closure_map: { closures: c.closure_map.closures.filter(cl => cl.id !== action.payload) } } }

    case "SET_CONTESTABILITY":
      return { ...state, auditCase: { ...c, contestability: { ...c.contestability, ...action.payload } } }

    case "SET_SUPPORT":
      return { ...state, auditCase: { ...c, support: { ...c.support, ...action.payload } } }

    case "SET_REENTRY":
      return { ...state, auditCase: { ...c, reentry: { ...c.reentry, ...action.payload } } }

    case "SET_RESPONSIBILITY":
      return { ...state, auditCase: { ...c, responsibility: { ...c.responsibility, ...action.payload } } }

    case "ADD_COUNTERFACTUAL":
      return { ...state, auditCase: { ...c, counterfactuals: [...c.counterfactuals, action.payload] } }

    case "UPDATE_COUNTERFACTUAL":
      return { ...state, auditCase: { ...c, counterfactuals: c.counterfactuals.map(cf => cf.id === action.payload.id ? { ...cf, ...action.payload.data } : cf) } }

    case "REMOVE_COUNTERFACTUAL":
      return { ...state, auditCase: { ...c, counterfactuals: c.counterfactuals.filter(cf => cf.id !== action.payload) } }

    case "ADD_EVIDENCE":
      return { ...state, auditCase: { ...c, evidence_sources: [...c.evidence_sources, action.payload] } }

    case "UPDATE_EVIDENCE":
      return { ...state, auditCase: { ...c, evidence_sources: c.evidence_sources.map(e => e.id === action.payload.id ? { ...e, ...action.payload.data } : e) } }

    case "REMOVE_EVIDENCE":
      return { ...state, auditCase: { ...c, evidence_sources: c.evidence_sources.filter(e => e.id !== action.payload) } }

    case "ADD_GOVERNANCE_CLAIM":
      return { ...state, auditCase: { ...c, governance_claims: [...c.governance_claims, action.payload] } }

    case "UPDATE_GOVERNANCE_CLAIM":
      return { ...state, auditCase: { ...c, governance_claims: c.governance_claims.map(g => g.id === action.payload.id ? { ...g, ...action.payload.data } : g) } }

    case "REMOVE_GOVERNANCE_CLAIM":
      return { ...state, auditCase: { ...c, governance_claims: c.governance_claims.filter(g => g.id !== action.payload) } }

    case "LOAD_CASE":
      return { ...state, step: 7, auditCase: action.payload }

    case "RESET":
      return { step: 0, auditCase: emptyCase() }

    default:
      return state
  }
}

const Ctx = createContext<{ state: EvidenceState; dispatch: React.Dispatch<EvidenceAction> } | null>(null)

export function EvidenceStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as EvidenceState
        const loaded = parsed.auditCase
        const merged: EvidenceAuditCase = {
          ...emptyCase(),
          ...loaded,
          institution_profile: { ...EMPTY_PROFILE, ...loaded.institution_profile },
          responsibility: { ...EMPTY_RESPONSIBILITY, ...loaded.responsibility },
          governance_claims: loaded.governance_claims ?? [],
        }
        dispatch({ type: "LOAD_CASE", payload: merged })
        // keep step at 0 on fresh load
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch { /* ignore */ }
  }, [state])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useEvidenceStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useEvidenceStore must be inside EvidenceStoreProvider")
  return ctx
}
