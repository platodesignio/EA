"use client"

import { useEffect, useRef, useState } from "react"
import { useCEOConsoleStore, type ConsoleStep } from "@/lib/ceo-console-store"
import type { CEOConsoleCase } from "@/lib/types"

const STEPS: { label: string; short: string }[] = [
  { label: "CEO Entry", short: "Entry" },
  { label: "Decision Map", short: "Map" },
  { label: "Master Function", short: "Function" },
  { label: "Accountability Chain", short: "Chain" },
  { label: "Evidence", short: "Evidence" },
  { label: "Contradiction", short: "Contradiction" },
  { label: "Risk Dashboard", short: "Risk" },
  { label: "Executive Report", short: "Report" },
]

// Picks exactly one label per step at any given time — never both. The
// previous implementation rendered a "hidden lg:inline" span next to a
// "lg:hidden" span and relied on CSS to show only one; in practice both
// ended up visible ("CEO Entry Entry"), so the choice is made in JS instead,
// which cannot render two strings in the same slot.
function useCompactLabels(): boolean {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)")
    setCompact(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setCompact(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return compact
}

function looksLikeCase(v: unknown): v is CEOConsoleCase {
  if (!v || typeof v !== "object") return false
  const c = v as Record<string, unknown>
  return typeof c.audit_unit === "object" && typeof c.decision_stages === "object" && typeof c.chain_items === "object"
}

export function ConsoleNav({ onViewAuditLogic }: { onViewAuditLogic: () => void }) {
  const { state, dispatch } = useCEOConsoleStore()
  const compact = useCompactLabels()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // The app has no backend, no login, and no sync — this JSON export is the
  // only thing that survives an app reinstall, device change, or cleared
  // browser storage. Without it, a half-finished scan is gone for good.
  function exportCase() {
    const org = state.auditCase.audit_unit.organization_name.trim().replace(/\s+/g, "-").toLowerCase()
    const blob = new Blob([JSON.stringify(state.auditCase, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ceo-console-case-${org || "untitled"}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        if (!looksLikeCase(parsed)) throw new Error("invalid shape")
        dispatch({ type: "LOAD_CASE", payload: parsed })
        dispatch({ type: "SET_STEP", payload: 1 })
      } catch {
        alert("This file doesn't look like a valid CEO Console case export.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 print:hidden">
      <div className="flex items-center justify-between px-6 h-11 gap-4">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 0 })}
          className="font-mono text-[11px] font-bold tracking-[0.15em] text-gray-900 hover:text-gray-600 transition-colors uppercase whitespace-nowrap shrink-0"
        >
          FED-DLR AUDIT
        </button>

        <div className="flex items-center gap-0.5 overflow-x-auto min-w-0">
          {STEPS.map((s, i) => {
            const idx = (i + 1) as ConsoleStep
            const active = state.step === idx
            const done = state.step > idx
            const reachable = idx <= state.step + 1 || done
            const label = compact ? s.short : s.label

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
                <span>{label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={exportCase}
            title="Save the current scan as a file — the only backup outside this browser."
            className="text-[10px] font-mono text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            Export
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Restore a previously exported scan"
            className="text-[10px] font-mono text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            Import
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
          <button
            onClick={onViewAuditLogic}
            className="text-[10px] font-mono text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            View Audit Logic
          </button>
          <button
            onClick={() => { if (confirm("Reset this scan? Current data will be cleared.")) dispatch({ type: "RESET" }) }}
            className="text-[10px] font-mono text-gray-500 hover:text-gray-700 transition-colors whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  )
}
