"use client"

import { useStore, type Step } from "@/lib/store"
import { calculateFinalDCR } from "@/lib/ddat/calculateDCR"
import { getLevelStyle } from "./ui"

const STEPS: { label: string }[] = [
  { label: "Introduction" },
  { label: "Target" },
  { label: "Architecture" },
  { label: "Rates" },
  { label: "Risk Flags" },
  { label: "Simulation" },
  { label: "Report" },
]

export function TopNav() {
  const { state, dispatch } = useStore()
  const { finalDCR, riskLevel } = calculateFinalDCR(state.rates, state.flags, state.target.domain)
  const ls = getLevelStyle(riskLevel)

  return (
    <header className="border-b border-[#e5e7eb] bg-white sticky top-0 z-50 no-print">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 h-14 border-b border-[#f3f4f6]">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold tracking-[0.2em] text-[#1e3a8a] uppercase">DDAT Studio</span>
          <span className="w-px h-4 bg-[#e5e7eb]" />
          <span className="text-[11px] text-[#9ca3af] tracking-wide">Dialectical Direction Audit Theory</span>
        </div>
        {state.step > 0 && (
          <div
            className="flex items-center gap-3 px-4 py-1.5"
            style={{ backgroundColor: ls.bg }}
          >
            <span className="font-mono text-2xl font-bold" style={{ color: ls.color }}>
              {Math.round(finalDCR)}
            </span>
            <div>
              <p className="text-[10px] text-[#6b7280] leading-none mb-0.5">DCR</p>
              <p className="text-[11px] font-semibold leading-none" style={{ color: ls.color }}>
                {riskLevel}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step progress */}
      <div className="flex items-stretch h-10 overflow-x-auto">
        {STEPS.map((s, i) => {
          const idx = i as Step
          const active = state.step === idx
          const done = state.step > idx
          const accessible = idx <= state.step + 1 || done

          return (
            <button
              key={i}
              onClick={() => accessible && dispatch({ type: "SET_STEP", payload: idx })}
              disabled={!accessible}
              className={`
                flex items-center gap-2 px-5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap
                ${active
                  ? "border-[#1d4ed8] text-[#1d4ed8] bg-[#eff6ff]"
                  : done
                  ? "border-transparent text-[#374151] hover:bg-[#f9fafb] cursor-pointer"
                  : "border-transparent text-[#9ca3af] cursor-not-allowed"
                }
              `}
            >
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold flex-shrink-0 ${
                  active
                    ? "bg-[#1d4ed8] text-white"
                    : done
                    ? "bg-[#0a0a0a] text-white"
                    : "bg-[#e5e7eb] text-[#9ca3af]"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              {s.label}
            </button>
          )
        })}
      </div>
    </header>
  )
}
