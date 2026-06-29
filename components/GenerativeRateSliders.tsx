"use client"

import { useStore } from "@/lib/store"
import { Button, StepLabel, PhilosophyBar } from "./ui"
import type { GenerativeRates } from "@/types/ddat"
import { generativeRateDefinitions, RATE_KEYS } from "@/lib/ddat/generativeRates"
import { clamp } from "@/lib/ddat/calculateDCR"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts"

function rateColor(v: number): string {
  if (v <= 1) return "#dc2626"
  if (v <= 2) return "#ea580c"
  if (v <= 3) return "#d97706"
  if (v <= 4) return "#16a34a"
  return "#1d4ed8"
}

function rateLabel(v: number): string {
  if (v === 0) return "Severe closure"
  if (v <= 1) return "Weak"
  if (v <= 2) return "Limited"
  if (v <= 3) return "Moderate"
  if (v <= 4) return "Strong"
  return "Highly generative"
}

export function GenerativeRateSliders() {
  const { state, dispatch } = useStore()
  const rates = state.rates

  const radarData = RATE_KEYS.map((k) => ({
    subject: generativeRateDefinitions[k].shortName,
    value: rates[k],
    fullMark: 5,
  }))

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <StepLabel n={3} label="Nine Generative Rates" />

      <div className="grid grid-cols-3 gap-6 mb-10">
        {/* Radar chart */}
        <div className="col-span-1 border border-[#e5e7eb] p-5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-3">Vector</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 9, fill: "#6b7280", fontFamily: "JetBrains Mono, monospace" }}
              />
              <Radar
                dataKey="value"
                stroke="#1d4ed8"
                fill="#1d4ed8"
                fillOpacity={0.1}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>

          {/* Summary table */}
          <div className="mt-2 space-y-1">
            {RATE_KEYS.map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#9ca3af]">
                  {generativeRateDefinitions[k].shortName}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-[#f3f4f6]">
                    <div
                      className="h-full"
                      style={{ width: `${(rates[k] / 5) * 100}%`, backgroundColor: rateColor(rates[k]) }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold w-5 text-right"
                    style={{ color: rateColor(rates[k]) }}
                  >
                    {rates[k]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="col-span-2 space-y-0 divide-y divide-[#f3f4f6]">
          {RATE_KEYS.map((k) => {
            const def = generativeRateDefinitions[k]
            const val = rates[k]
            return (
              <div key={k} className="py-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold text-blue-600">
                        {def.shortName}
                      </span>
                      <span className="text-xs font-semibold text-gray-900">{def.fullName}</span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] leading-relaxed">{def.definition}</p>
                  </div>
                  <div className="text-right shrink-0 w-28">
                    <span
                      className="font-mono text-3xl font-bold"
                      style={{ color: rateColor(val) }}
                    >
                      {val}
                    </span>
                    <p className="text-[10px] text-[#9ca3af] mt-0.5">{rateLabel(val)}</p>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={val}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_RATE",
                      payload: { key: k, value: clamp(parseFloat(e.target.value), 0, 5) },
                    })
                  }
                />
                <div className="flex justify-between text-[9px] font-mono text-[#d1d5db] mt-1">
                  <span>0 severe</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5 generative</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <PhilosophyBar />

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}>← Back</Button>
        <Button onClick={() => dispatch({ type: "SET_STEP", payload: 4 })}>Risk Flags →</Button>
      </div>
    </div>
  )
}
