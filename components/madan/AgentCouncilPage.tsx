"use client"

import { useState } from "react"
import { useMADAN } from "@/lib/madan/store"
import { useSimulation } from "@/lib/madan/useSimulation"
import { ScenarioInputPanel } from "@/components/madan/ScenarioInputPanel"
import { AgentList } from "@/components/madan/AgentList"
import { AgentNetworkGraph } from "@/components/madan/AgentNetworkGraph"
import { AuditLog } from "@/components/madan/AuditLog"
import { DCRDashboard } from "@/components/madan/DCRDashboard"
import { FinalReport } from "@/components/madan/FinalReport"

const PHASE_LABELS: Record<string, string> = {
  input: "Input",
  parsing: "Phase 1 — Scenario Parsing",
  "parallel-analysis": "Phase 2 — Perspective Analysis",
  "inter-agent-debate": "Phase 3 — Cross-Perspective Review",
  "red-team": "Phase 4 — Adversarial Check",
  synthesis: "Phase 5 — Synthesis",
  judgment: "Phase 6 — Directional Judgment",
  complete: "Review Complete",
}

type CenterTab = "overview" | "log" | "report"

export function AgentCouncilPage() {
  const { state, dispatch } = useMADAN()
  const { runSimulation, isRunning } = useSimulation()
  const [centerTab, setCenterTab] = useState<CenterTab>("overview")

  const isInput = state.phase === "input"
  const isComplete = state.phase === "complete"

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <a href="/" className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">← DDAT Studio</a>
                <span className="text-gray-200">|</span>
                <span className="text-[10px] text-gray-400 font-mono">Multi-Perspective Audit Module</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Structured DDAT Audit</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">Scenario-Based Institutional Review</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              {!isInput && (
                <div className="flex items-center gap-2">
                  {isRunning && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  )}
                  <span className="text-[11px] font-mono text-gray-500">{PHASE_LABELS[state.phase]}</span>
                </div>
              )}
              {!isInput && (
                <div className="flex gap-2">
                  {isComplete && (
                    <button
                      onClick={runSimulation}
                      className="text-[10px] px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-500 transition-all"
                    >
                      Re-run Audit
                    </button>
                  )}
                  <button
                    onClick={() => dispatch({ type: "RESET" })}
                    className="text-[10px] px-3 py-1.5 border border-gray-200 rounded-lg text-gray-500 hover:border-gray-400 transition-all"
                  >
                    New Scenario
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Method statement */}
          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="text-[10px] text-gray-500 leading-relaxed">
              A scenario-based review module for examining how a decision system affects appeal, re-entry, responsibility allocation, context recovery, bodily burden, temporal development, and future possibilities.
              DDAT audits decision architectures — not persons.
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {isInput ? (
          <ScenarioInputPanel />
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden max-w-[1400px] mx-auto w-full px-4 py-4">
            {/* 3-column layout */}
            <div className="flex gap-4 flex-1 overflow-hidden" style={{ minHeight: 0 }}>
              {/* Left: Agent List */}
              <div className="w-64 shrink-0 overflow-y-auto border border-gray-100 rounded-xl p-2">
                <AgentList />
              </div>

              {/* Center */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Tab bar */}
                <div className="flex gap-1 mb-3 border-b border-gray-200 pb-2">
                  {(["overview", "log", "report"] as CenterTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCenterTab(tab)}
                      className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                        centerTab === tab
                          ? "bg-gray-900 text-white"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {tab === "overview" ? "Perspective Overview" : tab === "log" ? "Review Log" : "Audit Report"}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-mono">{state.scenario.title}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {centerTab === "overview" && (
                    <div>
                      <AgentNetworkGraph />
                      {/* Agent detail panel */}
                      {state.activeAgentId && (() => {
                        const agent = state.agents.find((a) => a.id === state.activeAgentId)
                        if (!agent) return null
                        return (
                          <div className="mt-4 border border-gray-200 rounded-xl p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-[13px] font-bold text-gray-900">{agent.name}</h3>
                                <p className="text-[10px] text-gray-500">{agent.role}</p>
                              </div>
                              <button
                                className="text-[9px] text-gray-400 hover:text-gray-600"
                                onClick={() => dispatch({ type: "SET_ACTIVE_AGENT", payload: null })}
                              >
                                ×
                              </button>
                            </div>
                            <p className="text-[11px] text-gray-600 mb-3">{agent.description}</p>
                            {agent.analysisOutput && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-[10px] font-semibold text-gray-500 mb-1">Analysis Output</p>
                                <p className="text-[11px] text-gray-700 leading-relaxed">{agent.analysisOutput}</p>
                              </div>
                            )}
                            {agent.riskFlags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {agent.riskFlags.map((flag, i) => (
                                  <span key={i} className="text-[9px] bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">
                                    {flag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  )}
                  {centerTab === "log" && (
                    <div className="h-full">
                      <AuditLog />
                    </div>
                  )}
                  {centerTab === "report" && (
                    <FinalReport />
                  )}
                </div>
              </div>

              {/* Right: Audit Log */}
              <div className="w-72 shrink-0 overflow-y-auto border border-gray-100 rounded-xl p-3">
                <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mb-3 px-1">Review Log</p>
                <AuditLog compact />
              </div>
            </div>

            {/* Bottom: DCR Dashboard */}
            {isComplete && (
              <div className="mt-4 border border-gray-100 rounded-xl p-4 overflow-y-auto max-h-[500px]">
                <DCRDashboard />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
