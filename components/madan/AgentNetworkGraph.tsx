"use client"

import { useMemo, useState } from "react"
import { useMADAN } from "@/lib/madan/store"
import { buildAgentNetwork } from "@/lib/madan/engine"
import type { AgentId, AgentMessage, AgentStatus, MessageType } from "@/types/madan"

const STATUS_COLORS: Record<AgentStatus, string> = {
  idle: "#d1d5db",
  analyzing: "#3b82f6",
  replying: "#f59e0b",
  completed: "#22c55e",
}

const EDGE_STYLES: Record<MessageType, { stroke: string; strokeWidth: number; dashArray?: string }> = {
  question: { stroke: "#3b82f6", strokeWidth: 1.5, dashArray: "5,3" },
  critique: { stroke: "#ef4444", strokeWidth: 2 },
  support: { stroke: "#22c55e", strokeWidth: 1.5 },
  "evidence-request": { stroke: "#9ca3af", strokeWidth: 1, dashArray: "3,3" },
  synthesis: { stroke: "#8b5cf6", strokeWidth: 2 },
  contradiction: { stroke: "#dc2626", strokeWidth: 2.5 },
  analysis: { stroke: "#60a5fa", strokeWidth: 1.5 },
  judgment: { stroke: "#111827", strokeWidth: 2.5 },
}

const AGENT_ACRONYMS: Record<AgentId, string> = {
  "scenario-parser": "SP",
  "measurement-auditor": "MA",
  "transgression-auditor": "TA",
  "reachable-state-auditor": "RSA",
  "nine-rates-auditor": "NRA",
  "reentry-auditor": "RA",
  "body-load-auditor": "BLA",
  "institution-fixation-auditor": "IFA",
  "genealogy-auditor": "GA",
  "red-team-auditor": "RTA",
  "synthesis-agent": "SYN",
  "ddat-judge": "JDG",
}

const NODE_COLORS: Record<AgentId, string> = {
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

export function AgentNetworkGraph() {
  const { state, dispatch } = useMADAN()
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null)
  const [selectedEdgeMsg, setSelectedEdgeMsg] = useState<AgentMessage | null>(null)

  const { nodes, edges } = useMemo(
    () => buildAgentNetwork(state.agents, state.messages),
    [state.agents, state.messages]
  )

  const contradictionCount = state.messages.filter((m) => m.isContradiction).length

  function handleEdgeClick(fromId: AgentId, toId: AgentId, msgId: string) {
    dispatch({ type: "SELECT_EDGE", payload: [fromId, toId] })
    const msg = state.messages.find((m) => m.id === msgId)
    setSelectedEdgeMsg(msg ?? null)
  }

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox="0 0 600 560"
        className="w-full border border-gray-200 rounded-xl bg-white"
        style={{ maxHeight: 380 }}
      >
        <defs>
          <marker id="arrow-default" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#9ca3af" />
          </marker>
          {Object.entries(EDGE_STYLES).map(([type, style]) => (
            <marker
              key={type}
              id={`arrow-${type}`}
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill={style.stroke} />
            </marker>
          ))}
        </defs>

        {/* Edges */}
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from)
          const toNode = nodes.find((n) => n.id === edge.to)
          if (!fromNode || !toNode) return null
          const style = EDGE_STYLES[edge.type]
          const isHovered = hoveredEdge === edge.id
          const isSelected = state.selectedEdge?.[0] === edge.from && state.selectedEdge?.[1] === edge.to

          // Offset line slightly from node center so arrow starts/ends at edge of circle
          const dx = toNode.x - fromNode.x
          const dy = toNode.y - fromNode.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const r = 26
          const x1 = fromNode.x + (dx / dist) * r
          const y1 = fromNode.y + (dy / dist) * r
          const x2 = toNode.x - (dx / dist) * r
          const y2 = toNode.y - (dy / dist) * r

          return (
            <line
              key={edge.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={style.stroke}
              strokeWidth={isHovered || isSelected ? style.strokeWidth + 1 : style.strokeWidth}
              strokeDasharray={style.dashArray}
              markerEnd={`url(#arrow-${edge.type})`}
              opacity={isHovered || isSelected ? 1 : 0.55}
              style={{ cursor: "pointer", transition: "opacity 0.15s" }}
              onMouseEnter={() => setHoveredEdge(edge.id)}
              onMouseLeave={() => setHoveredEdge(null)}
              onClick={() => handleEdgeClick(edge.from, edge.to, edge.id)}
            />
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = state.activeAgentId === node.id
          const agent = state.agents.find((a) => a.id === node.id)
          const baseColor = NODE_COLORS[node.id]
          const statusColor = STATUS_COLORS[node.status]

          return (
            <g
              key={node.id}
              style={{ cursor: "pointer" }}
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_AGENT", payload: isActive ? null : node.id })
              }
            >
              {/* Active ring */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={33}
                  fill="none"
                  stroke={baseColor}
                  strokeWidth={2.5}
                  opacity={0.6}
                />
              )}
              {/* Status ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={28}
                fill={statusColor}
                opacity={0.25}
              />
              {/* Main circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={24}
                fill={baseColor}
                stroke="white"
                strokeWidth={2}
              />
              {/* Acronym */}
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={node.id === "reachable-state-auditor" || node.id === "institution-fixation-auditor" ? 7 : 8}
                fontFamily="monospace"
                fontWeight="bold"
              >
                {AGENT_ACRONYMS[node.id]}
              </text>
              {/* Label below */}
              <text
                x={node.x}
                y={node.y + 38}
                textAnchor="middle"
                fill="#374151"
                fontSize={8}
                fontFamily="monospace"
              >
                {node.label}
              </text>
              {/* Confidence dot */}
              {agent && agent.confidence > 0 && (
                <circle
                  cx={node.x + 18}
                  cy={node.y - 18}
                  r={5}
                  fill={agent.confidence > 75 ? "#22c55e" : agent.confidence > 50 ? "#f59e0b" : "#ef4444"}
                  stroke="white"
                  strokeWidth={1.5}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-[10px] text-gray-500 px-1">
        <span>
          <span className="font-semibold text-gray-700">{state.messages.length}</span> messages exchanged
        </span>
        <span>
          <span className="font-semibold text-red-600">{contradictionCount}</span> contradictions flagged
        </span>
        <span className="ml-auto flex items-center gap-3">
          {(["critique", "synthesis", "judgment", "contradiction"] as MessageType[]).map((t) => (
            <span key={t} className="flex items-center gap-1">
              <span
                className="inline-block w-3 h-0.5"
                style={{
                  backgroundColor: EDGE_STYLES[t].stroke,
                  borderTop: EDGE_STYLES[t].dashArray ? `2px dashed ${EDGE_STYLES[t].stroke}` : undefined,
                  display: "block",
                  height: EDGE_STYLES[t].dashArray ? 0 : 2,
                }}
              />
              {t}
            </span>
          ))}
        </span>
      </div>

      {/* Selected edge detail */}
      {selectedEdgeMsg && (
        <div className="border border-gray-200 rounded-lg p-3 text-[11px] bg-gray-50">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-700">{selectedEdgeMsg.fromAgent}</span>
            <span className="text-gray-400">→</span>
            <span className="font-semibold text-gray-700">{selectedEdgeMsg.toAgent}</span>
            <span
              className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-semibold text-white"
              style={{ backgroundColor: EDGE_STYLES[selectedEdgeMsg.type].stroke }}
            >
              {selectedEdgeMsg.type}
            </span>
            {selectedEdgeMsg.isContradiction && (
              <span className="text-red-500 text-[9px] font-bold">⚑ contradiction</span>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed">{selectedEdgeMsg.content}</p>
          {selectedEdgeMsg.referencedMetric && (
            <p className="mt-1 text-[9px] text-blue-500 font-mono">ref: {selectedEdgeMsg.referencedMetric}</p>
          )}
          <button
            className="mt-2 text-[9px] text-gray-400 hover:text-gray-600"
            onClick={() => {
              setSelectedEdgeMsg(null)
              dispatch({ type: "SELECT_EDGE", payload: null })
            }}
          >
            close ×
          </button>
        </div>
      )}
    </div>
  )
}
