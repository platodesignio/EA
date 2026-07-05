"use client"

import { useEvidenceStore, type EvidenceStep } from "@/lib/evidence-store"

const STEPS: { label: string; short: string }[] = [
  { label: "Overview",         short: "Overview" },
  { label: "Institution",      short: "Institution" },
  { label: "Classification",   short: "Class." },
  { label: "Contestability",   short: "Contest." },
  { label: "Support & Re-entry", short: "Support" },
  { label: "Counterfactual",   short: "CF Test" },
  { label: "Evidence",         short: "Evidence" },
  { label: "Judgment & Report", short: "Judgment" },
]

export function EvidenceNav() {
  const { state, dispatch } = useEvidenceStore()

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-11">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 0 })}
          className="font-mono text-[11px] font-bold tracking-[0.2em] text-gray-900 hover:text-gray-600 transition-colors uppercase whitespace-nowrap"
        >
          DDAT Evidence
        </button>

        <div className="flex items-center gap-0.5 overflow-x-auto">
          {STEPS.map((s, i) => {
            const idx = i as EvidenceStep
            const active = state.step === idx
            const done = state.step > idx
            const reachable = idx <= state.step + 1 || done

            return (
              <button
                key={i}
                onClick={() => reachable && dispatch({ type: "SET_STEP", payload: idx })}
                disabled={!reachable}
                title={s.label}
                className={`
                  flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-mono whitespace-nowrap transition-colors
                  ${active
                    ? "text-white bg-gray-900"
                    : done
                    ? "text-gray-500 hover:text-gray-700 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed"
                  }
                `}
              >
                <span>{done ? "✓" : i + 1}</span>
                <span className="hidden lg:inline">{s.label}</span>
                <span className="lg:hidden">{s.short}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => { if (confirm("Reset all audit data?")) dispatch({ type: "RESET" }) }}
          className="text-[10px] font-mono text-gray-300 hover:text-gray-600 transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>
    </header>
  )
}
