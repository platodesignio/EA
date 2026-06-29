"use client"

import { useState, useMemo } from "react"
import { useMADAN } from "@/lib/madan/store"
import type { AgentId, MessageType } from "@/types/madan"

const AGENT_COLORS: Record<AgentId, string> = {
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

const TYPE_BADGE: Record<MessageType, string> = {
  question: "bg-blue-100 text-blue-700",
  critique: "bg-red-100 text-red-700",
  support: "bg-green-100 text-green-700",
  "evidence-request": "bg-gray-100 text-gray-600",
  synthesis: "bg-purple-100 text-purple-700",
  contradiction: "bg-red-200 text-red-800",
  analysis: "bg-blue-50 text-blue-600",
  judgment: "bg-gray-900 text-white",
}

const ALL_AGENT_IDS: AgentId[] = [
  "scenario-parser", "measurement-auditor", "transgression-auditor", "reachable-state-auditor",
  "nine-rates-auditor", "reentry-auditor", "body-load-auditor", "institution-fixation-auditor",
  "genealogy-auditor", "red-team-auditor", "synthesis-agent", "ddat-judge",
]

const ALL_TYPES: MessageType[] = [
  "question", "critique", "support", "evidence-request", "synthesis", "contradiction", "analysis", "judgment",
]

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 5) return "just now"
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export function AuditLog({ compact = false }: { compact?: boolean }) {
  const { state } = useMADAN()
  const [filterAgent, setFilterAgent] = useState<AgentId | "all">("all")
  const [filterType, setFilterType] = useState<MessageType | "all">("all")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return [...state.messages]
      .reverse()
      .filter((m) => {
        if (filterAgent !== "all" && m.fromAgent !== filterAgent) return false
        if (filterType !== "all" && m.type !== filterType) return false
        return true
      })
  }, [state.messages, filterAgent, filterType])

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col h-full">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Audit Log</p>

      {/* Filters — hidden in compact mode */}
      {!compact && (
        <div className="flex flex-col gap-1.5 mb-3">
          <select
            className="text-[10px] border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-700 w-full"
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value as AgentId | "all")}
          >
            <option value="all">All agents</option>
            {ALL_AGENT_IDS.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
          <select
            className="text-[10px] border border-gray-200 rounded px-1.5 py-1 bg-white text-gray-700 w-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as MessageType | "all")}
          >
            <option value="all">All message types</option>
            {ALL_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}

      <div className="text-[9px] text-gray-400 mb-2">{filtered.length} messages</div>

      {/* Message list */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {filtered.length === 0 && (
          <p className="text-[10px] text-gray-400 italic text-center py-8">No messages yet. Run the audit to see agent communications.</p>
        )}
        {filtered.map((msg) => {
          const isExpanded = expandedIds.has(msg.id)
          const truncated = msg.content.length > 120 && !isExpanded
          return (
            <div
              key={msg.id}
              className={`border rounded-lg p-2.5 text-[10px] transition-all ${
                msg.isContradiction ? "border-red-200 bg-red-50" : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span
                  className="font-mono font-bold text-[9px]"
                  style={{ color: AGENT_COLORS[msg.fromAgent] }}
                >
                  {msg.fromAgent}
                </span>
                <span className={`text-[8px] font-semibold px-1 py-0.5 rounded ${TYPE_BADGE[msg.type]}`}>
                  {msg.type}
                </span>
                {msg.isContradiction && (
                  <span className="text-[8px] text-red-600 font-bold ml-auto">⚑</span>
                )}
                <span className="text-[8px] text-gray-400 ml-auto">{relativeTime(msg.timestamp)}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {truncated ? msg.content.slice(0, 120) + "…" : msg.content}
              </p>
              {msg.content.length > 120 && (
                <button
                  className="text-[8px] text-blue-500 mt-1 hover:underline"
                  onClick={() => toggleExpand(msg.id)}
                >
                  {isExpanded ? "collapse" : "expand"}
                </button>
              )}
              {msg.referencedMetric && (
                <p className="mt-1 text-[8px] font-mono text-blue-400">↗ {msg.referencedMetric}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
