"use client"

import { useStore } from "@/lib/store"
import { Button, LevelBadge, PhilosophyBar, getLevelStyle } from "./ui"
import { calculateFinalDCR } from "@/lib/ddat/calculateDCR"
import { riskFlagDefinitions, RISK_KEYS } from "@/lib/ddat/riskFlags"
import { riskPenalties } from "@/lib/ddat/riskPenalties"
import { generativeRateDefinitions, RATE_KEYS } from "@/lib/ddat/generativeRates"
import type { RiskFlags, GenerativeRates } from "@/types/ddat"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts"

function rateColor(v: number) {
  if (v <= 1) return "#dc2626"
  if (v <= 2) return "#ea580c"
  if (v <= 3) return "#d97706"
  if (v <= 4) return "#16a34a"
  return "#1d4ed8"
}

function buildRecommendations(flags: RiskFlags, rates: GenerativeRates): string[] {
  const r: string[] = []
  if (flags.noAppealMechanism)      r.push("Establish a formal appeal process with human review and response deadlines.")
  if (flags.noReentryMechanism)     r.push("Design re-entry pathways that allow affected subjects to return after negative outcomes.")
  if (flags.noContextRecovery)      r.push("Introduce structured mechanisms for subjects to present contextual information.")
  if (flags.personhoodSubstitution) r.push("Redesign decision outputs to treat scores as contextual indicators, not identity substitutes.")
  if (flags.opaqueScoring)          r.push("Implement explainability requirements: decision rationale must be legible to affected parties.")
  if (flags.measurementAsOntology)  r.push("Separate measurement from ontological claims. Scores indicate — they do not define.")
  if (flags.proxyDiscrimination)    r.push("Audit all proxy variables for discriminatory correlation. Remove or correct biased features.")
  if (flags.responsibilityShift)    r.push("Redistribute accountability to institutional actors and structural conditions.")
  if (flags.historicalLockIn)       r.push("Introduce counter-historical weighting to break self-reinforcing cycles of exclusion.")
  if (flags.noHumanReview)          r.push("Mandate human review at all consequential decision points.")
  if (flags.futureClosure)          r.push("Redesign output categories to preserve future possibility rather than fix permanent status.")
  if (flags.surveillanceExpansion)  r.push("Restrict data collection to the minimum necessary for the stated purpose.")
  if (rates.RCR < 2)                r.push("Significantly strengthen return capability — the system currently provides minimal recovery pathways.")
  if (rates.FGR < 2)                r.push("Redesign to expand reachable states for subjects rather than narrow future options.")
  if (r.length === 0) r.push("No critical redesign requirements identified. Maintain re-audit schedule.")
  return r
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-[#f3f4f6] last:border-0">
      <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide">{label}</p>
      <p className="col-span-2 text-sm text-[#374151]">{value || "—"}</p>
    </div>
  )
}

export function AuditReport() {
  const { state, dispatch } = useStore()
  const { target, rates, flags } = state
  const result = calculateFinalDCR(rates, flags, target.domain)
  const { finalDCR, rawDCR, totalPenalty, riskLevel, directionalJudgment } = result
  const recommendations = buildRecommendations(flags, rates)
  const activeFlags = RISK_KEYS.filter((k) => flags[k])
  const ls = getLevelStyle(riskLevel)

  const radarData = RATE_KEYS.map((k) => ({
    subject: generativeRateDefinitions[k].shortName,
    value: rates[k],
    fullMark: 5,
  }))

  const handleExportJSON = () => {
    const data = {
      auditTarget: target,
      generativeRates: rates,
      riskFlags: flags,
      result: { rawDCR, totalPenalty, finalDCR, riskLevel, directionalJudgment, recommendations },
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ddat-${target.auditTitle.replace(/\s+/g, "-").toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#1d4ed8] uppercase mb-2">Audit Report</p>
          <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a] mb-1">
            {target.auditTitle || "Untitled Audit"}
          </h2>
          <p className="text-sm text-[#9ca3af] capitalize">Domain: {target.domain}</p>
        </div>
        <div className="flex gap-2 no-print">
          <Button variant="ghost" size="sm" onClick={handleExportJSON}>JSON</Button>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>PDF</Button>
        </div>
      </div>

      {/* DCR Score hero */}
      <div className="border border-[#1f2937] bg-[#0d0d0d] p-8 mb-8">
        <div className="flex items-end gap-8 mb-5">
          <div>
            <p className="font-mono text-7xl font-bold leading-none" style={{ color: ls.color }}>
              {Math.round(finalDCR)}
            </p>
            <p className="text-xs text-[#9ca3af] mt-1 font-mono">/ 100</p>
          </div>
          <div className="flex-1 pb-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">Raw DCR</span>
              <span className="font-mono text-[#0a0a0a]">{rawDCR}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#dc2626]">Penalty</span>
              <span className="font-mono text-[#dc2626]">−{totalPenalty}</span>
            </div>
            <div className="h-px bg-[#e5e7eb]" />
            <div className="flex justify-between text-sm font-bold">
              <span style={{ color: ls.color }}>Final DCR</span>
              <span className="font-mono" style={{ color: ls.color }}>{Math.round(finalDCR)}</span>
            </div>
          </div>
        </div>
        <div className="h-1.5 bg-white/60 mb-3">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${finalDCR}%`, backgroundColor: ls.color }}
          />
        </div>
        <LevelBadge level={riskLevel} />
      </div>

      {/* Judgment */}
      <div className="border-l-[3px] border-[#0a0a0a] pl-5 py-2 mb-8">
        <p className="text-sm text-[#374151] leading-relaxed">{directionalJudgment}</p>
      </div>

      {/* Target */}
      <div className="border border-[#e5e7eb] p-6 mb-6">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-4">Target System</p>
        <Row label="Evaluator" value={target.evaluator} />
        <Row label="Subject" value={target.evaluatedSubject} />
        <Row label="Description" value={target.systemDescription} />
        <Row label="Affected Groups" value={target.affectedGroups} />
        <Row label="Possible Harm" value={target.possibleHarm} />
      </div>

      {/* Rates + Radar */}
      <div className="border border-[#e5e7eb] p-6 mb-6">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-5">Nine Generative Rates</p>
        <div className="grid grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "#9ca3af", fontFamily: "monospace" }} />
              <Radar dataKey="value" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.1} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="space-y-2 self-center">
            {RATE_KEYS.map((k) => (
              <div key={k} className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#9ca3af] w-10 shrink-0">
                  {generativeRateDefinitions[k].shortName}
                </span>
                <div className="flex-1 h-1 bg-[#f3f4f6]">
                  <div
                    className="h-full"
                    style={{ width: `${(rates[k] / 5) * 100}%`, backgroundColor: rateColor(rates[k]) }}
                  />
                </div>
                <span className="font-mono text-xs font-bold w-5 text-right" style={{ color: rateColor(rates[k]) }}>
                  {rates[k]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Flags */}
      <div className="border border-[#e5e7eb] p-6 mb-6">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-4">Risk Flags</p>
        {activeFlags.length === 0 ? (
          <p className="text-sm text-[#16a34a]">No risk flags active.</p>
        ) : (
          <div className="space-y-2">
            {activeFlags.map((k) => (
              <div key={k} className="flex items-center justify-between py-1 border-b border-[#f9fafb] last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#dc2626] rounded-full shrink-0" />
                  <span className="text-sm text-[#374151]">{riskFlagDefinitions[k].label}</span>
                </div>
                <span className="font-mono text-xs text-[#dc2626]">−{riskPenalties[k]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="border border-[#e5e7eb] p-6 mb-6">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-4">Recommended Reconfiguration</p>
        <ol className="space-y-3">
          {recommendations.map((r, i) => (
            <li key={i} className="flex gap-4 text-sm text-[#374151]">
              <span className="font-mono text-[#9ca3af] shrink-0 w-5">{i + 1}.</span>
              {r}
            </li>
          ))}
        </ol>
      </div>

      {/* Ethical limitation */}
      <div className="border border-[#e5e7eb] bg-[#f9fafb] p-6 mb-6">
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-3">Ethical Limitation</p>
        <p className="text-sm text-[#6b7280] leading-relaxed">
          This report is not a certification of moral legitimacy. It is an audit simulation based on
          entered assumptions, selected risk flags, and DDAT criteria. It must be reviewed by human
          evaluators, affected communities, domain experts, and institutional decision-makers.
        </p>
      </div>

      <PhilosophyBar />

      {/* Actions */}
      <div className="flex justify-between items-center mt-8 no-print">
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Reset all audit data?")) {
              dispatch({ type: "RESET" })
              dispatch({ type: "SET_STEP", payload: 0 })
              localStorage.removeItem("ddat-studio-v2")
            }
          }}
        >
          Reset
        </Button>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}>← Back</Button>
          <Button variant="ghost" onClick={handleExportJSON}>Export JSON</Button>
          <Button variant="secondary" onClick={() => window.print()}>Export PDF</Button>
        </div>
      </div>
    </div>
  )
}
