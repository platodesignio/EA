"use client"

import React, {
  createContext, useContext, useReducer, useEffect, type ReactNode,
} from "react"
import type {
  CEOConsoleCase,
  AuditUnit,
  DecisionStageKey,
  DecisionStageData,
  ChainItemKey,
  ChainItemData,
  DeclaredMasterFunction,
  MasterFunctionAnswers,
  MasterFunctionQuestionKey,
} from "./types"
import { DECISION_STAGE_ORDER, CHAIN_ITEM_ORDER } from "./questions"

export type ConsoleStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const EMPTY_AUDIT_UNIT: AuditUnit = {
  organization_name: "",
  user_role: "ceo_founder",
  ai_system_name: "",
  industry_domain: "",
  primary_decision: "",
  who_is_evaluated: "",
  consequence: "other",
  scan_basis: "self_reported",
}

function emptyStageData(key: DecisionStageKey): DecisionStageData {
  return {
    key,
    exists: "unknown",
    owner: "",
    documented: false,
    evidence: "none",
    responsibility_clarity: "unknown",
  }
}

function emptyChainItemData(key: ChainItemKey): ChainItemData {
  return {
    key,
    owner: "",
    evidence: "none",
    responsibility_clarity: "unknown",
    missing_documentation: true,
    risk_note: "",
  }
}

const EMPTY_MASTER_FUNCTION_ANSWERS: MasterFunctionAnswers = {
  visibility_control: "no",
  score_affects_access: "no",
  predicts_future_behavior: "no",
  recommendation_shapes_choice: "no",
  allows_denies_access: "no",
  monitors_productivity: "no",
  can_exclude_automatically: "no",
  human_override_possible: "structurally",
}

export function emptyCEOCase(): CEOConsoleCase {
  return {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString().slice(0, 10),
    audit_unit: { ...EMPTY_AUDIT_UNIT },
    decision_stages: Object.fromEntries(
      DECISION_STAGE_ORDER.map(key => [key, emptyStageData(key)])
    ) as Record<DecisionStageKey, DecisionStageData>,
    master_function: {
      declared: "other",
      answers: { ...EMPTY_MASTER_FUNCTION_ANSWERS },
    },
    chain_items: Object.fromEntries(
      CHAIN_ITEM_ORDER.map(key => [key, emptyChainItemData(key)])
    ) as Record<ChainItemKey, ChainItemData>,
  }
}

type ConsoleState = {
  step: ConsoleStep
  auditCase: CEOConsoleCase
}

type ConsoleAction =
  | { type: "SET_STEP"; payload: ConsoleStep }
  | { type: "SET_AUDIT_UNIT"; payload: Partial<AuditUnit> }
  | { type: "SET_STAGE"; payload: { key: DecisionStageKey; data: Partial<DecisionStageData> } }
  | { type: "SET_DECLARED_MASTER_FUNCTION"; payload: DeclaredMasterFunction }
  | { type: "SET_MASTER_FUNCTION_ANSWER"; payload: { key: MasterFunctionQuestionKey; value: MasterFunctionAnswers[MasterFunctionQuestionKey] } }
  | { type: "SET_CHAIN_ITEM"; payload: { key: ChainItemKey; data: Partial<ChainItemData> } }
  | { type: "LOAD_CASE"; payload: CEOConsoleCase }
  | { type: "RESET" }

const INITIAL: ConsoleState = {
  step: 0,
  auditCase: emptyCEOCase(),
}

const STORAGE_KEY = "ceo-console-v1"

function reducer(state: ConsoleState, action: ConsoleAction): ConsoleState {
  const c = state.auditCase
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload }

    case "SET_AUDIT_UNIT":
      return { ...state, auditCase: { ...c, audit_unit: { ...c.audit_unit, ...action.payload } } }

    case "SET_STAGE":
      return {
        ...state,
        auditCase: {
          ...c,
          decision_stages: {
            ...c.decision_stages,
            [action.payload.key]: { ...c.decision_stages[action.payload.key], ...action.payload.data },
          },
        },
      }

    case "SET_DECLARED_MASTER_FUNCTION":
      return { ...state, auditCase: { ...c, master_function: { ...c.master_function, declared: action.payload } } }

    case "SET_MASTER_FUNCTION_ANSWER":
      return {
        ...state,
        auditCase: {
          ...c,
          master_function: {
            ...c.master_function,
            answers: { ...c.master_function.answers, [action.payload.key]: action.payload.value },
          },
        },
      }

    case "SET_CHAIN_ITEM":
      return {
        ...state,
        auditCase: {
          ...c,
          chain_items: {
            ...c.chain_items,
            [action.payload.key]: { ...c.chain_items[action.payload.key], ...action.payload.data },
          },
        },
      }

    case "LOAD_CASE":
      return { ...state, auditCase: action.payload }

    case "RESET":
      return { step: 0, auditCase: emptyCEOCase() }

    default:
      return state
  }
}

const Ctx = createContext<{ state: ConsoleState; dispatch: React.Dispatch<ConsoleAction> } | null>(null)

export function CEOConsoleStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as ConsoleState
        const loaded = parsed.auditCase
        const merged: CEOConsoleCase = {
          ...emptyCEOCase(),
          ...loaded,
          audit_unit: { ...EMPTY_AUDIT_UNIT, ...loaded.audit_unit },
          decision_stages: {
            ...(Object.fromEntries(DECISION_STAGE_ORDER.map(key => [key, emptyStageData(key)])) as Record<DecisionStageKey, DecisionStageData>),
            ...loaded.decision_stages,
          },
          chain_items: {
            ...(Object.fromEntries(CHAIN_ITEM_ORDER.map(key => [key, emptyChainItemData(key)])) as Record<ChainItemKey, ChainItemData>),
            ...loaded.chain_items,
          },
        }
        dispatch({ type: "LOAD_CASE", payload: merged })
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

export function useCEOConsoleStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useCEOConsoleStore must be inside CEOConsoleStoreProvider")
  return ctx
}
