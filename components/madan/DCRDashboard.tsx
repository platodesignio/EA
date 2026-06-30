"use client"

import { useMADAN } from "@/lib/madan/store"

function clampPct(score: number): number {
  return Math.max(0, Math.min(100, ((score + 5) / 10) * 100))
}

function dcrColor(dcr: number): string {
  if (dcr >= 3.5) return "#16a34a"
  if (dcr >= 1.5) return "#65a30d"
  if (dcr >= -1.49) return "#ca8a04"
  if (dcr >= -3.49) return "#ea580c"
  return "#dc2626"
}

function riskColor(v: number): string {
  if (v <= 1.5) return "#16a34a"
  if (v <= 3) return "#ca8a04"
  return "#dc2626"
}

export function DCRDashboard() {
  const { state } = useMADAN()
  const result = state.result
  if (!result) return null

  const mainColor = dcrColor(result.dcr)
  const dcrSign = result.dcr > 0 ? "+" : ""

  return (
    <div className="border-t border-gray-200 bg-white mt-4 pt-4">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">Directional Correctness Index (DCR)</p>

      {/* Row 1: DCR + Judgment */}
      <div className="flex items-start gap-6 mb-6">
        <div className="text-center">
          <div
            className="text-5xl font-black font-mono leading-none"
            style={{ color: mainColor }}
          >
            {dcrSign}{result.dcr.toFixed(2)}
          </div>
          <div className="text-[9px] text-gray-400 mt-1 font-mono">DCR / ±5.00</div>
        </div>
        <div className="flex-1">
          <div
            className="text-xl font-bold leading-tight mb-1"
            style={{ color: mainColor }}
          >
            {result.finalJudgment}
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span>Re-entry: <span className="font-semibold" style={{ color: result.reentryScore < 0 ? "#dc2626" : "#16a34a" }}>{result.reentryScore > 0 ? "+" : ""}{result.reentryScore.toFixed(1)}</span></span>
            <span>Reachable-State: <span className="font-semibold" style={{ color: result.reachableStateImpact < 0 ? "#dc2626" : "#16a34a" }}>{result.reachableStateImpact > 0 ? "+" : ""}{result.reachableStateImpact.toFixed(1)}</span></span>
          </div>
        </div>
      </div>

      {/* Row 2: Nine Rates */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold text-gray-500 mb-2">Nine Generative Rates</p>
        <div className="grid grid-cols-1 gap-1.5">
          {result.nineRates.map((rate) => {
            const pct = clampPct(rate.score)
            const midPct = 50
            const isNeg = rate.score < 0
            const barLeft = isNeg ? pct : midPct
            const barWidth = Math.abs(pct - midPct)
            const barColor = rate.score >= 0 ? "#16a34a" : "#dc2626"

            return (
              <div key={rate.key} className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-gray-600 w-14 shrink-0">{rate.key}</span>
                <div className="flex-1 relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-px bg-gray-400" style={{ left: "50%" }} />
                  <div
                    className="absolute top-0 bottom-0 rounded-sm"
                    style={{
                      left: `${barLeft}%`,
                      width: `${barWidth}%`,
                      backgroundColor: barColor,
                      opacity: 0.85,
                    }}
                  />
                </div>
                <span
                  className="text-[9px] font-mono font-bold w-8 text-right"
                  style={{ color: barColor }}
                >
                  {rate.score > 0 ? "+" : ""}{rate.score.toFixed(1)}
                </span>
                {rate.riskTag && (
                  <span className="text-[7px] bg-red-100 text-red-700 px-1 py-0.5 rounded font-semibold whitespace-nowrap">
                    {rate.riskTag}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 3: Risk Indicators */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold text-gray-500 mb-2">Risk Indicators (0–5)</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Future-Closure Risk", value: result.futureClosureRisk },
            { label: "Institution-Fixation Risk", value: result.institutionFixationRisk },
            { label: "Body-Load Risk", value: result.bodyLoadRisk },
            { label: "Transgression Risk", value: result.transgressionRisk },
          ].map(({ label, value }) => {
            const color = riskColor(value)
            return (
              <div key={label} className="border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-black font-mono" style={{ color }}>
                  {value.toFixed(1)}
                </div>
                <div className="text-[8px] text-gray-500 mt-1 leading-tight">{label}</div>
                <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1">
                  <div
                    className="h-1 rounded-full"
                    style={{ width: `${(value / 5) * 100}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 4: Agent Disagreements */}
      {result.agentDisagreements && result.agentDisagreements.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-gray-500 mb-2">Agent Disagreements ({result.agentDisagreements.length})</p>
          <div className="flex flex-col gap-2">
            {result.agentDisagreements.map((d, i) => (
              <div key={i} className="border border-orange-200 bg-orange-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-mono font-bold text-orange-700">{d.agentA}</span>
                  <span className="text-[8px] text-orange-400">⇄</span>
                  <span className="text-[9px] font-mono font-bold text-orange-700">{d.agentB}</span>
                  <span className="ml-auto text-[8px] text-orange-600 font-bold">severity {d.severity.toFixed(1)}</span>
                </div>
                <p className="text-[10px] text-gray-700 leading-relaxed">{d.topic}</p>
                <div className="mt-1.5 grid grid-cols-2 gap-1">
                  <p className="text-[9px] text-gray-500 bg-white border border-orange-100 rounded p-1"><span className="font-semibold">A:</span> {d.positionA}</p>
                  <p className="text-[9px] text-gray-500 bg-white border border-orange-100 rounded p-1"><span className="font-semibold">B:</span> {d.positionB}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 5: Contradictions + Design Corrections */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[10px] font-semibold text-gray-500 mb-2">Main Contradictions</p>
          <ol className="flex flex-col gap-1.5">
            {result.mainContradictions.map((c, i) => (
              <li key={i} className="flex gap-2 text-[10px] text-gray-700 border border-red-100 bg-red-50 rounded p-2 leading-relaxed">
                <span className="text-[9px] font-mono text-red-400 shrink-0">{i + 1}.</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-500 mb-2">Design Corrections</p>
          <ol className="flex flex-col gap-1.5">
            {result.designCorrections.map((c, i) => (
              <li key={i} className="flex gap-2 text-[10px] text-gray-700 border border-blue-100 bg-blue-50 rounded p-2 leading-relaxed">
                <span className="text-[9px] font-mono text-blue-400 shrink-0">{i + 1}.</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Row 6: Freedom Closure Risks */}
      {result.freedomClosureRisks.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] font-semibold text-gray-500 mb-2">Freedom-Closure Risks</p>
          <div className="flex flex-col gap-1">
            {result.freedomClosureRisks.map((r, i) => (
              <div key={i} className="flex gap-2 text-[10px] text-gray-700 border border-yellow-200 bg-yellow-50 rounded p-2 leading-relaxed">
                <span className="text-[9px] text-yellow-500">⚠</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 7: Reachable-State Impact */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 mb-0.5">Reachable-State Impact</p>
            <p className="text-[9px] text-gray-400">Impact on R(x): the set of futures accessible to affected subjects</p>
          </div>
          <div className="ml-auto text-right">
            <div
              className="text-2xl font-black font-mono"
              style={{ color: result.reachableStateImpact >= 0 ? "#16a34a" : "#dc2626" }}
            >
              {result.reachableStateImpact > 0 ? "+" : ""}{result.reachableStateImpact.toFixed(1)}
            </div>
            <div
              className="text-[9px] font-semibold mt-0.5"
              style={{ color: result.reachableStateImpact >= 0 ? "#16a34a" : "#dc2626" }}
            >
              {result.reachableStateImpact >= 0 ? "▲ Expanding R(x)" : "▼ Reducing R(x)"}
            </div>
          </div>
        </div>
        <div className="mt-3 relative h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute top-0 bottom-0 w-px bg-gray-400" style={{ left: "50%" }} />
          <div
            className="absolute top-0 bottom-0 rounded-sm transition-all duration-700"
            style={{
              left: result.reachableStateImpact < 0 ? `${clampPct(result.reachableStateImpact)}%` : "50%",
              width: `${Math.abs(clampPct(result.reachableStateImpact) - 50)}%`,
              backgroundColor: result.reachableStateImpact >= 0 ? "#16a34a" : "#dc2626",
              opacity: 0.8,
            }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-gray-400 mt-1">
          <span>−5 Severely Reducing</span>
          <span>0 Neutral</span>
          <span>+5 Strongly Expanding</span>
        </div>
      </div>
    </div>
  )
}
