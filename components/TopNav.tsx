"use client"

import { useStore, type Step } from "@/lib/store"
import { calculateFinalDCR } from "@/lib/ddat/calculateDCR"

const STEPS = ["Introduction", "Target", "Architecture", "Rates", "Risk Flags", "Simulation", "Report"]

export function TopNav() {
  const { state, dispatch } = useStore()
  const { finalDCR, riskLevel } = calculateFinalDCR(state.rates, state.flags, state.target.domain)

  const dcrColor =
    finalDCR >= 80 ? "#16a34a" :
    finalDCR >= 60 ? "#2563eb" :
    finalDCR >= 40 ? "#d97706" :
    finalDCR >= 20 ? "#ea580c" : "#dc2626"

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 no-print">
      <div className="flex items-center justify-between px-6 h-11">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 0 })}
          className="font-mono text-[11px] font-bold tracking-[0.2em] text-gray-900 hover:text-gray-600 transition-colors uppercase"
        >
          DDAT STUDIO
        </button>

        <div className="flex items-center gap-1">
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
                title={label}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-[11px] transition-colors
                  ${active
                    ? "text-white bg-blue-600"
                    : done
                    ? "text-gray-500 hover:text-gray-700 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed"
                  }
                `}
              >
                <span className="font-mono">{done ? "✓" : i + 1}</span>
                <span className="hidden lg:inline">{label}</span>
              </button>
            )
          })}
        </div>

        {state.step > 0 && (
          <div className="flex items-center gap-2 font-mono">
            <span className="text-[11px] text-gray-400">DCR</span>
            <span className="text-base font-bold" style={{ color: dcrColor }}>
              {Math.round(finalDCR)}
            </span>
            <span className="text-[10px] hidden sm:inline" style={{ color: dcrColor }}>{riskLevel}</span>
          </div>
        )}
        {state.step === 0 && <div className="w-20" />}
      </div>
    </header>
  )
}
