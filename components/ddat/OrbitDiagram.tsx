"use client"

import type { DCRResult } from "@/types/ddat"

interface Props {
  current: DCRResult
  simulated?: DCRResult
}

function dcrColor(v: number): string {
  if (v >= 80) return "#16a34a"
  if (v >= 60) return "#2563eb"
  if (v >= 40) return "#d97706"
  if (v >= 20) return "#ea580c"
  return "#dc2626"
}

const BANDS = [
  { from: 0,  to: 20,  label: "Severe future-closure risk",      color: "#fca5a5" },
  { from: 20, to: 40,  label: "Significant future-closure risk",  color: "#fdba74" },
  { from: 40, to: 60,  label: "High future-closure risk",         color: "#fcd34d" },
  { from: 60, to: 80,  label: "Conditionally acceptable",         color: "#93c5fd" },
  { from: 80, to: 100, label: "Directionally generative",         color: "#86efac" },
]

export function OrbitDiagram({ current, simulated }: Props) {
  const cur = Math.max(0, Math.min(100, current.finalDCR))
  const sim = simulated ? Math.max(0, Math.min(100, simulated.finalDCR)) : null
  const color = dcrColor(cur)
  const simColor = sim !== null ? dcrColor(sim) : null

  return (
    <div className="border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[9px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-0.5">
            DCR — Directional Correctness Index
          </p>
          <p className="text-xs text-gray-500">
            Position on the generative-closure spectrum
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold leading-none" style={{ color }}>
            {Math.round(cur)}
          </p>
          <p className="text-[9px] text-gray-400 mt-0.5 font-mono">/ 100</p>
        </div>
      </div>

      {/* Spectrum bar */}
      <div className="mb-3">
        <div className="relative h-5 flex" style={{ borderRadius: 0 }}>
          {BANDS.map((b) => (
            <div
              key={b.from}
              style={{
                width: `${b.to - b.from}%`,
                background: b.color,
                opacity: 0.35,
              }}
            />
          ))}
          {/* Current marker */}
          <div
            className="absolute top-0 bottom-0 flex flex-col items-center"
            style={{ left: `${cur}%`, transform: "translateX(-50%)" }}
          >
            <div style={{ width: 2, height: "100%", background: color }} />
          </div>
          {/* Simulated marker */}
          {sim !== null && Math.abs(sim - cur) > 1 && (
            <div
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${sim}%`, transform: "translateX(-50%)" }}
            >
              <div style={{ width: 2, height: "100%", background: simColor ?? "#6b7280", opacity: 0.6, borderStyle: "dashed" }} />
            </div>
          )}
        </div>

        {/* Scale ticks */}
        <div className="relative h-4 mt-0.5">
          {[0, 20, 40, 60, 80, 100].map((v) => (
            <span
              key={v}
              className="absolute font-mono text-[9px] text-gray-400"
              style={{ left: `${v}%`, transform: "translateX(-50%)" }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Current level badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[10px] font-mono font-bold px-2 py-1 border"
          style={{ color, borderColor: color }}
        >
          {current.riskLevel}
        </span>
        {sim !== null && Math.abs(sim - cur) > 1 && simColor && (
          <>
            <span className="text-[9px] text-gray-400">→ after interventions:</span>
            <span
              className="text-[10px] font-mono font-bold px-2 py-1 border"
              style={{ color: simColor, borderColor: simColor, opacity: 0.7 }}
            >
              {Math.round(sim)}
            </span>
          </>
        )}
      </div>

      {/* Band legend */}
      <div className="space-y-1 border-t border-gray-100 pt-3">
        {[...BANDS].reverse().map((b) => {
          const active = cur >= b.from && cur < b.to
          return (
            <div key={b.from} className="flex items-center gap-2">
              <div
                style={{
                  width: 10,
                  height: 10,
                  background: b.color,
                  opacity: active ? 1 : 0.4,
                  flexShrink: 0,
                }}
              />
              <span
                className="text-[9px] font-mono"
                style={{ color: active ? "#111827" : "#9ca3af", fontWeight: active ? 700 : 400 }}
              >
                {b.from}–{b.to} — {b.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-[9px] text-gray-400 mt-3 leading-relaxed border-t border-gray-100 pt-2">
        DCR is not a score of a person, institution, or moral worth. It estimates whether a decision
        architecture expands or closes future possibilities for affected persons.
      </p>
    </div>
  )
}
