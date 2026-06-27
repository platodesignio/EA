"use client"

import React, { createContext, useContext, useReducer, type ReactNode } from "react"
import type { AgentId, AgentMessage, AuditAgent, AuditResult, AuditScenario, MADANState, SimulationPhase } from "@/types/madan"
import { AUDIT_AGENTS } from "@/lib/madan/agents"

const DEFAULT_SCENARIO: AuditScenario = {
  title: "",
  systemType: "",
  description: "",
  targetPopulation: "",
  evaluationMechanism: "",
  dataSources: "",
  decisionConsequences: "",
  reentryMechanism: "",
  knownRisks: "",
  desiredFutureDirection: "",
}

const INITIAL_STATE: MADANState = {
  scenario: DEFAULT_SCENARIO,
  phase: "input",
  agents: AUDIT_AGENTS.map((a) => ({ ...a })),
  messages: [],
  result: null,
  activeAgentId: null,
  selectedEdge: null,
}

type MADANAction =
  | { type: "SET_SCENARIO"; payload: Partial<AuditScenario> }
  | { type: "SET_PHASE"; payload: SimulationPhase }
  | { type: "UPDATE_AGENT"; payload: { id: AgentId; update: Partial<AuditAgent> } }
  | { type: "ADD_MESSAGE"; payload: AgentMessage }
  | { type: "SET_RESULT"; payload: AuditResult }
  | { type: "SET_ACTIVE_AGENT"; payload: AgentId | null }
  | { type: "SELECT_EDGE"; payload: [AgentId, AgentId] | null }
  | { type: "RESET" }

function madanReducer(state: MADANState, action: MADANAction): MADANState {
  switch (action.type) {
    case "SET_SCENARIO":
      return { ...state, scenario: { ...state.scenario, ...action.payload } }
    case "SET_PHASE":
      return { ...state, phase: action.payload }
    case "UPDATE_AGENT":
      return {
        ...state,
        agents: state.agents.map((a) =>
          a.id === action.payload.id ? { ...a, ...action.payload.update } : a
        ),
      }
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] }
    case "SET_RESULT":
      return { ...state, result: action.payload }
    case "SET_ACTIVE_AGENT":
      return { ...state, activeAgentId: action.payload }
    case "SELECT_EDGE":
      return { ...state, selectedEdge: action.payload }
    case "RESET":
      return { ...INITIAL_STATE, agents: AUDIT_AGENTS.map((a) => ({ ...a })) }
    default:
      return state
  }
}

type MADANContextType = {
  state: MADANState
  dispatch: React.Dispatch<MADANAction>
}

const MADANContext = createContext<MADANContextType | null>(null)

export function MADANProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(madanReducer, INITIAL_STATE)
  return <MADANContext.Provider value={{ state, dispatch }}>{children}</MADANContext.Provider>
}

export function useMADAN(): MADANContextType {
  const ctx = useContext(MADANContext)
  if (!ctx) throw new Error("useMADAN must be used within a MADANProvider")
  return ctx
}
