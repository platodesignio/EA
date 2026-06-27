"use client"

import { useMADAN } from "@/lib/madan/store"
import type { AgentId, AgentStatus } from "@/types/madan"

const STATUS_STYLES: Record<AgentStatus, string> = {
  idle: "bg-gray-200 text-gray-600",
  analyzing: "bg-blue-100 text-blue-700 animate-pulse",
  replying: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
}

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: "Idle",
  analyzing: "Analyzing",
  replying: "Replying",
  completed: "Done",
}

const AGENT_ACCENT_COLORS: Record<AgentId, string> = {
  "scenario-parser": "#6366f1",
  "measurement-auditor": "#0891b2",
  "transgression-auditor": "#dc2626",
  "reachable-state-auditor": "#16a34a",
  "nine-rates-auditor": "#7c3aed",
  "reentry-auditor": "#0284c7",
  "body-load-auditor": "#b45309",
  "institution-fixation-auditor": "#be185d",
  "genealogy-auditor": "#4f7942",
  "red-team-auditor": "#c2410c",
  "synthesis-agent": "#2563eb",
  "ddat-judge": "#1e1e1e",
}

export function AgentList() {
  const { state, dispatch } = useMADAN()

  return (
    <div className="flex flex-col gap-1 overflow-y-auto h-full py-2">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 pb-1">Agent Council</p>
      {state.agents.map((agent) => {
        const isActive = state.activeAgentId === agent.id
        const accent = AGENT_ACCENT_COLORS[agent.id]

        return (
          <button
            key={agent.id}
            onClick={() => dispatch({ type: "SET_ACTIVE_AGENT", payload: isActive ? null : agent.id })}
            className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
              isActive
                ? "border-gray-900 bg-gray-50 shadow-sm"
                : "border-transparent hover:border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <span
                className="text-[11px] font-bold leading-tight"
                style={{ color: accent }}
              >
                {agent.name}
              </span>
              <span
                className={`shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${STATUS_STYLES[agent.status]}`}
              >
                {STATUS_LABELS[agent.status]}
              </span>
            </div>
            <p className="text-[9px] text-gray-400 leading-tight mb-2">{agent.role}</p>

            {/* Confidence bar */}
            {agent.confidence > 0 && (
              <div className="mb-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[8px] text-gray-400">Confidence</span>
                  <span className="text-[8px] font-mono text-gray-600">{agent.confidence}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ width: `${agent.confidence}%`, backgroundColor: accent }}
                  />
                </div>
              </div>
            )}

            {/* Risk flags */}
            {agent.riskFlags.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[8px] text-red-600 font-medium">{agent.riskFlags.length} risk flag{agent.riskFlags.length > 1 ? "s" : ""}</span>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
