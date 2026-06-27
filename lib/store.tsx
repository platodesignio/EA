"use client"

import React, {
  createContext, useContext, useReducer, useEffect, type ReactNode,
} from "react"
import type { AuditTarget, GenerativeRates, RiskFlags } from "@/types/ddat"
import { sampleAuditTarget, sampleRates, sampleRisks } from "./ddat/sampleData"

export type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6

type State = {
  step: Step
  target: AuditTarget
  rates: GenerativeRates
  flags: RiskFlags
}

type Action =
  | { type: "SET_STEP"; payload: Step }
  | { type: "SET_TARGET"; payload: Partial<AuditTarget> }
  | { type: "SET_RATE"; payload: { key: keyof GenerativeRates; value: number } }
  | { type: "SET_FLAG"; payload: { key: keyof RiskFlags; value: boolean } }
  | { type: "RESET" }
  | { type: "HYDRATE"; payload: State }

const INITIAL: State = {
  step: 0,
  target: sampleAuditTarget,
  rates: sampleRates,
  flags: sampleRisks,
}

const STORAGE_KEY = "ddat-studio-v2"

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload }
    case "SET_TARGET":
      return { ...state, target: { ...state.target, ...action.payload } }
    case "SET_RATE":
      return { ...state, rates: { ...state.rates, [action.payload.key]: action.payload.value } }
    case "SET_FLAG":
      return { ...state, flags: { ...state.flags, [action.payload.key]: action.payload.value } }
    case "RESET":
      return INITIAL
    case "HYDRATE":
      return action.payload
    default:
      return state
  }
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as State
        dispatch({ type: "HYDRATE", payload: { ...INITIAL, ...parsed, step: 0 } })
      }
    } catch {}
  }, [])

  // Persist to localStorage (exclude step)
  useEffect(() => {
    try {
      const { step: _step, ...rest } = state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch {}
  }, [state])

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useStore must be inside StoreProvider")
  return ctx
}
