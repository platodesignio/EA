"use client"

import type { GenerativeRates, RiskFlags, AuditTarget } from "@/types/ddat"
import { generativeRateDefinitions, RATE_KEYS } from "@/lib/ddat/generativeRates"

// Maps which generative rates most affect each stakeholder group
const STAKEHOLDER_RATE_WEIGHTS: Record<string, Partial<Record<keyof GenerativeRates, number>>> = {
  "Non-linear career":   { RCR: 1.5, TIGR: 1.5, FGR: 1.2, PDFR: 1.2, MGR: 1.0 },
  "Disability":          { PDFR: 1.5, SRGR: 1.5, RCR: 1.2, FGR: 1.2, MGR: 1.0 },
  "Caregiving gap":      { TIGR: 1.5, SRGR: 1.5, RCR: 1.2, HGR: 1.0, FGR: 1.0 },
  "Low-credential":      { PDFR: 1.5, IGR: 1.2, MGR: 1.2, FGR: 1.2, DRGR: 1.0 },
  "Accent/language":     { IGR: 1.5, PDFR: 1.5, MGR: 1.2, SRGR: 1.0, RCR: 1.0 },
  "Low-income":          { SRGR: 1.5, DRGR: 1.2, FGR: 1.2, HGR: 1.2, RCR: 1.0 },
}

function computeGroupScore(rates: GenerativeRates, weights: Partial<Record<keyof GenerativeRates, number>>): number {
  let weighted = 0
  let totalW = 0
  for (const [k, w] of Object.entries(weights) as [keyof GenerativeRates, number][]) {
    weighted += rates[k] * w
    totalW += w
  }
  // Base rates count too
  for (const k of RATE_KEYS) {
    if (!weights[k]) {
      weighted += rates[k] * 0.5
      totalW += 0.5
    }
  }
  return totalW > 0 ? (weighted / totalW / 5) * 100 : 0
}

function barColor(v: number) {
  if (v <= 20) return "#dc2626"
  if (v <= 40) return "#ea580c"
  if (v <= 60) return "#d97706"
  if (v <= 80) return "#16a34a"
  return "#1d4ed8"
}

interface Props {
  rates: GenerativeRates
  flags: RiskFlags
  target: AuditTarget
}

export function StakeholderMatrix({ rates, flags, target }: Props) {
  const groups = Object.entries(STAKEHOLDER_RATE_WEIGHTS)
  const affectedText = target.affectedGroups?.toLowerCase() || ""

  // Highlight groups mentioned in affected groups field
  const isHighlighted = (name: string) => {
    const key = name.toLowerCase().split("/")[0].trim()
    return affectedText.includes(key)
  }

  return (
    <div className="border border-[#e5e7eb] bg-[#0f172a] p-5">
      <div className="mb-4">
        <p className="text-[9px] font-bold tracking-[0.15em] text-[#6b7280] uppercase mb-0.5">
          Stakeholder Impact Matrix
        </p>
        <p className="text-xs text-[#9ca3af]">
          Weighted experience of generative rates by affected group
        </p>
      </div>

      <div className="space-y-3">
        {groups.map(([name, weights]) => {
          const score = computeGroupScore(rates, weights)
          const highlighted = isHighlighted(name)
          return (
            <div key={name} className={`${highlighted ? "opacity-100" : "opacity-50"}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {highlighted && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] inline-block shrink-0" />
                  )}
                  <span className="text-[10px] font-semibold text-white">{name}</span>
                </div>
                <span className="font-mono text-xs" style={{ color: barColor(score) }}>
                  {Math.round(score)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 h-1.5 bg-[#1f2937]">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: barColor(score) }}
                  />
                </div>
              </div>
              {/* Rate breakdown */}
              <div className="flex gap-1 mt-1">
                {(Object.keys(weights) as (keyof GenerativeRates)[]).slice(0, 5).map((k) => (
                  <div key={k} className="flex items-center gap-0.5">
                    <span className="font-mono text-[8px] text-[#4b5563]">
                      {generativeRateDefinitions[k].shortName}
                    </span>
                    <span className="font-mono text-[8px]" style={{ color: barColor((rates[k] / 5) * 100) }}>
                      {rates[k]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-[#1f2937] mt-4 pt-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] inline-block" />
        <p className="text-[9px] text-[#4b5563]">
          Highlighted groups match your Affected Groups input
        </p>
      </div>

      {/* Rate key most impactful */}
      <div className="mt-3 pt-3 border-t border-[#1f2937]">
        <p className="text-[9px] text-[#6b7280] mb-2">Rate impact by group (key dimensions)</p>
        <div className="grid grid-cols-3 gap-1">
          {RATE_KEYS.slice(0, 6).map((k) => (
            <div key={k} className="flex items-center gap-1">
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: barColor((rates[k] / 5) * 100) }}
              />
              <span className="font-mono text-[8px] text-[#6b7280]">
                {generativeRateDefinitions[k].shortName}: {rates[k]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
