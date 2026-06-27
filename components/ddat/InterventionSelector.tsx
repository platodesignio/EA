"use client"

import { interventions } from "@/lib/ddat/interventions"
import { generativeRateDefinitions } from "@/lib/ddat/generativeRates"
import { riskFlagDefinitions } from "@/lib/ddat/riskFlags"
import type { GenerativeRates, RiskFlags } from "@/types/ddat"

interface Props {
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function InterventionSelector({ selectedIds, onToggle }: Props) {
  return (
    <div className="space-y-2">
      {interventions.map((intv) => {
        const active = selectedIds.includes(intv.id)
        return (
          <div
            key={intv.id}
            onClick={() => onToggle(intv.id)}
            className={`border rounded-sm px-4 py-3 cursor-pointer transition-colors ${
              active
                ? "border-blue-300 bg-blue-50"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center ${
                  active ? "bg-blue-700 border-blue-700" : "border-gray-300"
                }`}
              >
                {active && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${active ? "text-blue-800" : "text-gray-800"}`}>
                  {intv.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{intv.description}</p>
                {active && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(intv.rateChanges).map(([k, v]) => (
                      <span key={k} className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-sm font-mono">
                        {generativeRateDefinitions[k as keyof GenerativeRates]?.shortName ?? k} +{v}
                      </span>
                    ))}
                    {Object.keys(intv.removeRisks).map((k) => (
                      <span key={k} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-sm">
                        ✓ {riskFlagDefinitions[k as keyof RiskFlags]?.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
