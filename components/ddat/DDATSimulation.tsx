"use client"

import { useState } from "react"
import type { GenerativeRates, RiskFlags, AuditDomain } from "@/types/ddat"
import { simulateDDATInterventions } from "@/lib/ddat/simulateDDAT"
import { InterventionSelector } from "./InterventionSelector"
import { SimulationComparison } from "./SimulationComparison"

interface Props {
  currentRates: GenerativeRates
  currentRisks: RiskFlags
  domain: AuditDomain
  onBack?: () => void
  onNext?: () => void
}

export function DDATSimulation({ currentRates, currentRisks, domain, onBack, onNext }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const sim = simulateDDATInterventions(currentRates, currentRisks, selectedIds, domain)

  return (
    <div className="max-w-5xl mx-auto py-12 px-8 space-y-8">
      <div>
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-1">Step 6</p>
        <h2 className="text-2xl font-bold text-gray-900">DDAT Simulation</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select institutional interventions to simulate directional change in the system.
        </p>
      </div>

      {/* Core equation display */}
      <div className="border border-gray-200 rounded-sm px-5 py-4 bg-gray-50 font-mono text-xs text-gray-600 space-y-1">
        <p>currentSystem = {"{ V: currentRates, R: currentRisks }"}</p>
        <p>simulatedSystem = applyInterventions(currentSystem, selectedInterventions)</p>
        <p className="text-blue-700 font-semibold">
          ΔDCR = DCR(simulatedSystem) − DCR(currentSystem) ={" "}
          <span className={sim.dcrDelta > 0 ? "text-green-600" : sim.dcrDelta < 0 ? "text-red-600" : "text-gray-500"}>
            {sim.dcrDelta > 0 ? "+" : ""}{sim.dcrDelta}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left: Intervention selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Interventions
            </p>
            <span className="text-xs text-gray-400">{selectedIds.length} selected</span>
          </div>
          <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-0">
            <InterventionSelector selectedIds={selectedIds} onToggle={toggle} />
          </div>
        </div>

        {/* Right: Comparison */}
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Results
          </p>
          <SimulationComparison sim={sim} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-4 border-t border-gray-200">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-sm"
          >
            ← Back
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="px-4 py-2 text-sm bg-blue-700 text-white hover:bg-blue-800 rounded-sm ml-auto"
          >
            View Audit Report →
          </button>
        )}
      </div>
    </div>
  )
}
