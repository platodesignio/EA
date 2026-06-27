"use client"

import type { SimulationState } from "@/types/ddat"
import { DCRScoreCard } from "./DCRScoreCard"
import { generativeRateDefinitions } from "@/lib/ddat/generativeRates"
import type { GenerativeRates } from "@/types/ddat"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts"

interface Props {
  sim: SimulationState
}

export function SimulationComparison({ sim }: Props) {
  const { dcrDelta } = sim

  const chartData = [
    { name: "Current", dcr: Math.round(sim.currentDCR.finalDCR), fill: "#6b7280" },
    { name: "Simulated", dcr: Math.round(sim.simulatedDCR.finalDCR), fill: "#1d4ed8" },
  ]

  return (
    <div className="space-y-6">
      {/* Delta Banner */}
      <div className={`border rounded-sm px-5 py-4 ${
        dcrDelta > 0 ? "border-green-200 bg-green-50" :
        dcrDelta < 0 ? "border-red-200 bg-red-50" :
        "border-gray-200 bg-gray-50"
      }`}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Directional Change</p>
        {dcrDelta > 0 ? (
          <p className="text-lg font-bold text-green-700">DCR Improvement: +{dcrDelta}</p>
        ) : dcrDelta < 0 ? (
          <p className="text-lg font-bold text-red-700">Directional degradation detected. ({dcrDelta})</p>
        ) : (
          <p className="text-lg font-bold text-gray-500">No directional improvement detected.</p>
        )}
      </div>

      {/* Score Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <DCRScoreCard result={sim.currentDCR} label="Current System" />
        <DCRScoreCard result={sim.simulatedDCR} label="After Interventions" />
      </div>

      {/* Bar Chart */}
      <div className="border border-gray-200 rounded-sm p-5 bg-white">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Comparison</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 2, fontSize: 12 }} />
            <Bar dataKey="dcr" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Improved Rates */}
      {Object.keys(sim.improvedRates).length > 0 && (
        <div className="border border-gray-200 rounded-sm p-5 bg-white">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Improved Generative Rates</p>
          <div className="space-y-1.5">
            {(Object.entries(sim.improvedRates) as [keyof GenerativeRates, number][]).map(([k, delta]) => (
              <div key={k} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {generativeRateDefinitions[k].shortName}
                  <span className="text-gray-400 text-xs ml-2">{generativeRateDefinitions[k].fullName}</span>
                </span>
                <span className="font-semibold text-green-600">+{delta.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed Risks */}
      {sim.removedRisks.length > 0 && (
        <div className="border border-green-200 rounded-sm p-5 bg-green-50">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">Removed Risks</p>
          <div className="space-y-1.5">
            {sim.removedRisks.map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm text-green-800">
                <span className="text-green-600">✓</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Risks */}
      {sim.remainingRisks.length > 0 && (
        <div className="border border-red-200 rounded-sm p-5 bg-red-50">
          <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-3">Remaining Risks</p>
          <div className="space-y-1.5">
            {sim.remainingRisks.map((label) => (
              <div key={label} className="flex items-center gap-2 text-sm text-red-800">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Philosophical notices */}
      <div className="space-y-2">
        <div className="border-l-4 border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-600">
          Simulation results are not predictions. They are structured audit hypotheses based on DDAT criteria and entered assumptions.
        </div>
        <div className="border-l-4 border-blue-700 bg-blue-50 px-4 py-3 text-xs text-blue-900 font-medium">
          Measurement is not ontology. A score is not a person. An audit is not a verdict.
        </div>
      </div>
    </div>
  )
}
