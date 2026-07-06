"use client"

import { useCEOConsoleStore, type ConsoleStep } from "@/lib/ceo-console-store"

const STEPS: { label: string; short: string }[] = [
  { label: "CEO Entry", short: "Entry" },
  { label: "Decision Map", short: "Map" },
  { label: "Master Function", short: "Function" },
  { label: "Accountability Chain", short: "Chain" },
  { label: "Evidence Confidence", short: "Confidence" },
  { label: "Contradiction Index", short: "Contradiction" },
  { label: "Risk Dashboard", short: "Risk" },
  { label: "Executive Report", short: "Report" },
]

export function ConsoleNav({ onViewAuditLogic }: { onViewAuditLogic: () => void }) {
  const { state, dispatch } = useCEOConsoleStore()

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-11 gap-4">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 0 })}
          className="font-mono text-[11px] font-bold tracking-[0.15em] text-gray-900 hover:text-gray-600 transition-colors uppercase whitespace-nowrap shrink-0"
        >
          CEO AI ACCOUNTABILITY CONSOLE
        </button>

        <div className="flex items-center gap-0.5 overflow-x-auto">
          {STEPS.map((s, i) => {
            const idx = (i + 1) as ConsoleStep
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

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onViewAuditLogic}
            className="text-[10px] font-mono text-gray-400 hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            View Audit Logic
          </button>
          <button
            onClick={() => { if (confirm("Reset the scan? Current data will be cleared.")) dispatch({ type: "RESET" }) }}
            className="text-[10px] font-mono text-gray-300 hover:text-gray-600 transition-colors whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  )
}
