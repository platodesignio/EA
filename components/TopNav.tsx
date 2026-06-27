"use client"

import { useStore, type Step } from "@/lib/store"
import { calculateFinalDCR } from "@/lib/ddat/calculateDCR"

const STEPS = [
  "Introduction",
  "Target",
  "Architecture",
  "Rates",
  "Risk Flags",
  "Simulation",
  "Report",
]

export function TopNav() {
  const { state, dispatch } = useStore()
  const { finalDCR, riskLevel } = calculateFinalDCR(state.rates, state.flags, state.target.domain)

  const dcrColor =
    finalDCR >= 80 ? "#4ade80" :
    finalDCR >= 60 ? "#60a5fa" :
    finalDCR >= 40 ? "#fbbf24" :
    finalDCR >= 20 ? "#f97316" : "#f87171"

  return (
    <header className="border-b border-[#e5e7eb] bg-white sticky top-0 z-50 no-print">
      {/* Brand bar */}
      <div className="flex items-center justify-between px-8 h-12 border-b border-[#f3f4f6]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 0 })}
            className="text-xs font-bold tracking-[0.25em] text-[#0a0a0a] uppercase hover:text-[#1d4ed8] transition-colors"
          >
            DDAT STUDIO
          </button>
          <span className="text-[#e5e7eb]">|</span>
          <span className="text-[10px] text-[#9ca3af] tracking-wide hidden sm:block">
            Dialectical Direction Audit Theory
          </span>
        </div>

        {state.step > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 border border-[#e5e7eb]">
            <span className="font-mono text-lg font-bold" style={{ color: dcrColor }}>
              {Math.round(finalDCR)}
            </span>
            <span className="text-[10px] text-[#9ca3af]">DCR</span>
            <span className="text-[10px] font-medium" style={{ color: dcrColor }}>{riskLevel}</span>
          </div>
        )}
      </div>

      {/* Step navigation */}
      <div className="flex overflow-x-auto">
        {STEPS.map((label, i) => {
          const idx = i as Step
          const active = state.step === idx
          const done = state.step > idx
          const reachable = idx <= state.step + 1 || done

          return (
            <button
              key={i}
              onClick={() => reachable && dispatch({ type: "SET_STEP", payload: idx })}
              disabled={!reachable}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-xs border-b-2 whitespace-nowrap transition-colors flex-shrink-0
                ${active
                  ? "border-[#0a0a0a] text-[#0a0a0a] font-semibold"
                  : done
                  ? "border-transparent text-[#6b7280] hover:text-[#0a0a0a] cursor-pointer"
                  : "border-transparent text-[#d1d5db] cursor-not-allowed"
                }
              `}
            >
              <span className={`
                w-4 h-4 flex items-center justify-center text-[9px] font-bold flex-shrink-0
                ${active ? "bg-[#0a0a0a] text-white" : done ? "bg-[#6b7280] text-white" : "bg-[#f3f4f6] text-[#9ca3af]"}
              `}>
                {done ? "✓" : i + 1}
              </span>
              {label}
            </button>
          )
        })}
      </div>
    </header>
  )
}
