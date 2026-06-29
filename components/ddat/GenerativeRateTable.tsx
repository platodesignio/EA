"use client"

import type { GenerativeRates } from "@/types/ddat"
import { generativeRateDefinitions, RATE_KEYS } from "@/lib/ddat/generativeRates"

function rateColor(v: number) {
  if (v <= 1) return "#dc2626"
  if (v <= 2) return "#f97316"
  if (v <= 3) return "#eab308"
  if (v <= 4) return "#22c55e"
  return "#1d4ed8"
}

function rateLabel(v: number) {
  if (v === 0) return "Severe closure"
  if (v <= 1) return "Weak"
  if (v <= 2) return "Limited"
  if (v <= 3) return "Moderate"
  if (v <= 4) return "Strong"
  return "Highly generative"
}

interface Props {
  rates: GenerativeRates
  compareRates?: GenerativeRates
  showDefinitions?: boolean
}

export function GenerativeRateTable({ rates, compareRates, showDefinitions = false }: Props) {
  return (
    <div className="space-y-2">
      {RATE_KEYS.map((key) => {
        const def = generativeRateDefinitions[key]
        const val = rates[key]
        const cmp = compareRates?.[key]
        const delta = cmp !== undefined ? cmp - val : undefined

        return (
          <div key={key} className="border border-gray-100 rounded-sm px-4 py-3 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm">
                    {def.shortName}
                  </span>
                  <span className="text-xs font-medium text-gray-800">{def.fullName}</span>
                </div>
                {showDefinitions && (
                  <p className="text-[11px] text-gray-500 leading-relaxed">{def.definition}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <span className="text-lg font-bold" style={{ color: rateColor(val) }}>{val}</span>
                {delta !== undefined && delta > 0 && (
                  <span className="text-xs font-semibold text-green-600 ml-1.5">+{delta.toFixed(1)}</span>
                )}
                <p className="text-[10px] text-gray-400">{rateLabel(val)}</p>
              </div>
            </div>
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(val / 5) * 100}%`, backgroundColor: rateColor(val) }}
              />
            </div>
            {delta !== undefined && delta > 0 && compareRates && (
              <div
                className="mt-0.5 h-1 rounded-full opacity-40"
                style={{
                  width: `${(compareRates[key] / 5) * 100}%`,
                  backgroundColor: "#16a34a",
                  marginTop: 2,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
