"use client"

import { useStore } from "@/lib/store"
import { Button, StepLabel } from "./ui"
import type { RiskFlags } from "@/types/ddat"
import { riskFlagDefinitions, RISK_KEYS } from "@/lib/ddat/riskFlags"
import { riskPenalties, calculateTotalPenalty } from "@/lib/ddat/riskPenalties"

export function RiskFlagChecklist() {
  const { state, dispatch } = useStore()
  const flags = state.flags
  const totalPenalty = calculateTotalPenalty(flags)
  const activeCount = RISK_KEYS.filter((k) => flags[k]).length

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <StepLabel n={4} label="Risk Flags" />

      {/* Summary bar */}
      <div className="flex items-center gap-6 border border-[#e5e7eb] px-6 py-4 mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-[#9ca3af] uppercase mb-0.5">Active Flags</p>
          <p className="font-mono text-3xl font-bold text-[#0a0a0a]">{activeCount}</p>
          <p className="text-[10px] text-[#9ca3af]">of {RISK_KEYS.length}</p>
        </div>
        <div className="w-px h-12 bg-[#e5e7eb]" />
        <div>
          <p className="text-[10px] font-bold tracking-widest text-[#9ca3af] uppercase mb-0.5">Total Penalty</p>
          <p className="font-mono text-3xl font-bold text-[#dc2626]">−{totalPenalty}</p>
          <p className="text-[10px] text-[#9ca3af]">DCR points</p>
        </div>
        <div className="flex-1 ml-4">
          <div className="h-1.5 bg-[#f3f4f6] w-full">
            <div
              className="h-full bg-[#dc2626] transition-all duration-300"
              style={{ width: `${Math.min(100, (activeCount / RISK_KEYS.length) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-[#9ca3af] mt-1">Closure density</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {RISK_KEYS.map((key) => {
          const active = flags[key]
          return (
            <button
              key={key}
              onClick={() => dispatch({ type: "SET_FLAG", payload: { key, value: !active } })}
              className={`w-full text-left border px-5 py-4 transition-colors ${
                active
                  ? "border-[#fca5a5] bg-[#fef2f2]"
                  : "border-[#e5e7eb] bg-white hover:bg-[#f9fafb]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center ${
                  active ? "bg-[#dc2626] border-[#dc2626]" : "border-[#d1d5db]"
                }`}>
                  {active && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-sm font-semibold ${active ? "text-[#991b1b]" : "text-[#374151]"}`}>
                      {riskFlagDefinitions[key].label}
                    </p>
                    <span className={`font-mono text-xs shrink-0 ${active ? "text-[#dc2626]" : "text-[#d1d5db]"}`}>
                      −{riskPenalties[key]}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6b7280] mt-0.5 leading-relaxed">
                    {riskFlagDefinitions[key].description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}>← Back</Button>
        <Button onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}>Simulation →</Button>
      </div>
    </div>
  )
}
