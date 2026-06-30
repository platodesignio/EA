"use client"

import { useStore } from "@/lib/store"
import { Button, StepLabel, GrayCard } from "./ui"

const NODES = [
  { key: "dataInputs",           label: "Data Inputs",             accent: false },
  { key: "scoringMethod",        label: "Scoring / Classification", accent: true  },
  { key: "explanationMechanism", label: "Reason Generation",        accent: false },
  { key: "decisionOutputs",      label: "Decision Output",          accent: true  },
  { key: "possibleHarm",         label: "Social Consequence",       accent: false },
  { key: "reentryMechanism",     label: "Re-entry Possibility",     accent: false },
] as const

export function SystemMap() {
  const { state, dispatch } = useStore()
  const t = state.target

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <StepLabel n={2} label="System Architecture" />

      <div className="flex flex-col items-center mb-10">
        {NODES.map((node, i) => (
          <div key={node.key} className="flex flex-col items-center w-full max-w-xl">
            <div className={`w-full border px-6 py-4 ${
              node.accent
                ? "border-[#1e3a8a] bg-[#eff6ff]"
                : "border-[#e5e7eb] bg-white"
            }`}>
              <p className={`text-[10px] font-bold tracking-[0.15em] uppercase mb-1 ${
                node.accent ? "text-[#1e3a8a]" : "text-[#9ca3af]"
              }`}>
                {node.label}
              </p>
              <p className="text-sm text-[#374151] leading-snug">
                {(t as Record<string, string>)[node.key] || (
                  <span className="text-[#9ca3af] italic text-xs">Not specified</span>
                )}
              </p>
            </div>
            {i < NODES.length - 1 && (
              <div className="flex flex-col items-center py-1">
                <div className="w-px h-4 bg-[#d1d5db]" />
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M0 0L5 6L10 0" fill="#9ca3af" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <GrayCard className="mb-8">
        <p className="text-sm text-[#4b5563] leading-relaxed">
          DDAT audits not only the score itself, but the social path produced by the score.
          A score becomes dangerous when it reorganizes access, opportunity, responsibility,
          and future possibilities without sufficient explanation, appeal, or re-entry.
        </p>
      </GrayCard>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-[#e5e7eb] p-4">
          <p className="text-[10px] font-bold tracking-widest text-[#9ca3af] uppercase mb-2">Evaluated Subject</p>
          <p className="text-sm font-medium text-[#0a0a0a]">{t.evaluatedSubject || "—"}</p>
          <p className="text-xs text-[#6b7280] mt-1">Operated by: {t.evaluator || "—"}</p>
        </div>
        <div className="border border-[#e5e7eb] p-4">
          <p className="text-[10px] font-bold tracking-widest text-[#9ca3af] uppercase mb-2">Affected Groups</p>
          <p className="text-sm text-[#374151]">{t.affectedGroups || "—"}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}>← Back</Button>
        <Button onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}>Generative Rates →</Button>
      </div>
    </div>
  )
}
