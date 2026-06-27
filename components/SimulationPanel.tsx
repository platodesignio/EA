"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button, StepLabel, LevelBadge, SimulationNotice, PhilosophyBar, getLevelStyle } from "./ui"
import { simulateDDATInterventions } from "@/lib/ddat/simulateDDAT"
import { interventions } from "@/lib/ddat/interventions"
import { generativeRateDefinitions } from "@/lib/ddat/generativeRates"
import { OrbitDiagram } from "./ddat/OrbitDiagram"
import { TrajectoryChart } from "./ddat/TrajectoryChart"
import { StakeholderMatrix } from "./ddat/StakeholderMatrix"
import { ScenarioComparison } from "./ddat/ScenarioComparison"
import type { GenerativeRates } from "@/types/ddat"

type Tab = "overview" | "trajectory" | "stakeholders" | "scenarios"

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",     label: "Overview" },
  { id: "trajectory",   label: "Trajectory" },
  { id: "stakeholders", label: "Stakeholders" },
  { id: "scenarios",    label: "Scenarios" },
]

function rateColor(v: number) {
  if (v <= 1) return "#dc2626"
  if (v <= 2) return "#ea580c"
  if (v <= 3) return "#d97706"
  if (v <= 4) return "#16a34a"
  return "#1d4ed8"
}

export function SimulationPanel() {
  const { state, dispatch } = useStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [tab, setTab] = useState<Tab>("overview")

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const setSelected = setSelectedIds

  const sim = simulateDDATInterventions(
    state.rates, state.flags, selectedIds, state.target.domain
  )

  const curStyle = getLevelStyle(sim.currentDCR.riskLevel)
  const simStyle = getLevelStyle(sim.simulatedDCR.riskLevel)

  return (
    <div className="px-8 py-12" style={{ maxWidth: "100vw" }}>
      <div className="max-w-6xl mx-auto">
        <StepLabel n={5} label="DDAT Simulation" />

        {/* Core equation */}
        <div className="border border-[#e5e7eb] bg-[#0a0a0a] px-5 py-3 mb-6 font-mono text-xs">
          <span className="text-[#6b7280]">S = {"{ V, R }"}  </span>
          <span className="text-[#6b7280]">S′ = I(S)  </span>
          <span className="font-bold" style={{
            color: sim.dcrDelta > 0 ? "#4ade80" : sim.dcrDelta < 0 ? "#f87171" : "#6b7280"
          }}>
            ΔDCR = DCR(S′) − DCR(S) = {sim.dcrDelta > 0 ? "+" : ""}{sim.dcrDelta}
          </span>
        </div>

        {/* Main 3-column layout */}
        <div className="grid grid-cols-[280px_1fr_320px] gap-6 mb-6">

          {/* LEFT: Intervention selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase">
                Interventions
              </p>
              <span className="font-mono text-[10px] text-[#6b7280]">{selectedIds.length} active</span>
            </div>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
              {interventions.map((intv) => {
                const active = selectedIds.includes(intv.id)
                return (
                  <button
                    key={intv.id}
                    onClick={() => toggle(intv.id)}
                    className={`w-full text-left border px-3 py-2.5 transition-colors ${
                      active
                        ? "border-[#1d4ed8] bg-[#eff6ff]"
                        : "border-[#e5e7eb] bg-white hover:bg-[#f9fafb]"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 w-3.5 h-3.5 shrink-0 border flex items-center justify-center ${
                        active ? "bg-[#1d4ed8] border-[#1d4ed8]" : "border-[#d1d5db]"
                      }`}>
                        {active && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 10 10">
                            <path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={`text-[11px] font-semibold ${active ? "text-[#1e3a8a]" : "text-[#374151]"}`}>
                          {intv.title}
                        </p>
                        {active && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(intv.rateChanges).map(([k, v]) => (
                              <span key={k} className="font-mono text-[8px] bg-[#dcfce7] text-[#15803d] px-1">
                                {generativeRateDefinitions[k as keyof GenerativeRates]?.shortName} +{v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* CENTER: Tabs + visualizations */}
          <div>
            {/* Tab bar */}
            <div className="flex border-b border-[#e5e7eb] mb-4">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                    tab === t.id
                      ? "border-[#1d4ed8] text-[#1d4ed8]"
                      : "border-transparent text-[#9ca3af] hover:text-[#374151]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "overview" && (
              <div className="space-y-4">
                <OrbitDiagram current={sim.currentDCR} simulated={selectedIds.length > 0 ? sim.simulatedDCR : undefined} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[#1f2937] bg-[#0d0d0d] p-4">
                    <p className="text-[9px] font-bold tracking-widest text-[#9ca3af] uppercase mb-2">Current</p>
                    <p className="font-mono text-4xl font-bold" style={{ color: curStyle.color }}>
                      {Math.round(sim.currentDCR.finalDCR)}
                    </p>
                    <LevelBadge level={sim.currentDCR.riskLevel} />
                    <p className="text-[10px] text-[#9ca3af] mt-2 leading-relaxed">
                      {sim.currentDCR.directionalJudgment.slice(0, 80)}…
                    </p>
                  </div>
                  <div className="border p-4 transition-all bg-[#0d0d0d]" style={{
                    borderColor: selectedIds.length > 0 ? curStyle.border : "#1f2937",
                  }}>
                    <p className="text-[9px] font-bold tracking-widest text-[#9ca3af] uppercase mb-2">After Interventions</p>
                    <p className="font-mono text-4xl font-bold" style={{ color: simStyle.color }}>
                      {Math.round(sim.simulatedDCR.finalDCR)}
                    </p>
                    <LevelBadge level={sim.simulatedDCR.riskLevel} />
                    <div className={`mt-2 px-2 py-1 font-mono text-xs font-bold ${
                      sim.dcrDelta > 0 ? "bg-[#f0fdf4] text-[#15803d]" :
                      sim.dcrDelta < 0 ? "bg-[#fef2f2] text-[#dc2626]" :
                      "bg-[#f9fafb] text-[#9ca3af]"
                    }`}>
                      {sim.dcrDelta > 0 ? `ΔDCR +${sim.dcrDelta}` :
                       sim.dcrDelta < 0 ? `ΔDCR ${sim.dcrDelta}` :
                       "No change"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "trajectory" && (
              <TrajectoryChart
                rates={state.rates}
                flags={state.flags}
                domain={state.target.domain}
                selectedInterventionIds={selectedIds}
              />
            )}

            {tab === "stakeholders" && (
              <StakeholderMatrix
                rates={state.rates}
                flags={state.flags}
                target={state.target}
              />
            )}

            {tab === "scenarios" && (
              <ScenarioComparison
                rates={state.rates}
                flags={state.flags}
                domain={state.target.domain}
                currentDCR={sim.currentDCR.finalDCR}
              />
            )}
          </div>

          {/* RIGHT: Results panel */}
          <div className="space-y-4">
            {/* Delta */}
            <div className={`border px-4 py-4 ${
              sim.dcrDelta > 0 ? "border-[#86efac] bg-[#f0fdf4]" :
              sim.dcrDelta < 0 ? "border-[#fca5a5] bg-[#fef2f2]" :
              "border-[#e5e7eb] bg-[#f9fafb]"
            }`}>
              {sim.dcrDelta > 0
                ? <p className="font-mono text-sm font-bold text-[#15803d]">DCR Improvement: +{sim.dcrDelta}</p>
                : sim.dcrDelta < 0
                ? <p className="font-mono text-sm font-bold text-[#dc2626]">Directional degradation detected.</p>
                : <p className="font-mono text-sm text-[#9ca3af]">No directional improvement detected.</p>
              }
            </div>

            {/* Improved rates */}
            {Object.keys(sim.improvedRates).length > 0 && (
              <div className="border border-[#e5e7eb] p-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-3">
                  Improved Generative Rates
                </p>
                <div className="space-y-2">
                  {(Object.entries(sim.improvedRates) as [keyof GenerativeRates, number][]).map(([k, delta]) => {
                    const base = state.rates[k]
                    const after = base + delta
                    return (
                      <div key={k}>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-[10px] text-[#374151]">
                            {generativeRateDefinitions[k].shortName}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-[#15803d]">+{delta.toFixed(1)}</span>
                        </div>
                        <div className="h-1 bg-[#f3f4f6] relative">
                          <div className="absolute h-full bg-[#d1d5db]" style={{ width: `${(base / 5) * 100}%` }} />
                          <div className="absolute h-full bg-[#16a34a] opacity-60" style={{ left: `${(base / 5) * 100}%`, width: `${(delta / 5) * 100}%` }} />
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-[#9ca3af] mt-0.5">
                          <span>{base}</span><span>→ {Math.min(5, after).toFixed(1)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Removed risks */}
            {sim.removedRisks.length > 0 && (
              <div className="border border-[#86efac] bg-[#f0fdf4] p-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-[#15803d] uppercase mb-2">
                  Removed Risks
                </p>
                {sim.removedRisks.map((label) => (
                  <p key={label} className="text-[10px] text-[#15803d] flex items-center gap-1.5 py-0.5">
                    <span className="font-mono text-[#15803d]">✓</span> {label}
                  </p>
                ))}
              </div>
            )}

            {/* Remaining risks */}
            {sim.remainingRisks.length > 0 && (
              <div className="border border-[#fca5a5] bg-[#fef2f2] p-4">
                <p className="text-[9px] font-bold tracking-[0.15em] text-[#991b1b] uppercase mb-2">
                  Remaining Risks
                </p>
                {sim.remainingRisks.map((label) => (
                  <p key={label} className="text-[10px] text-[#991b1b] flex items-center gap-1.5 py-0.5">
                    <span className="w-1 h-1 bg-[#dc2626] rounded-full inline-block shrink-0" />
                    {label}
                  </p>
                ))}
              </div>
            )}

            <SimulationNotice />
            <PhilosophyBar />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => dispatch({ type: "SET_STEP", payload: 4 })}>← Back</Button>
          <Button onClick={() => dispatch({ type: "SET_STEP", payload: 6 })}>Audit Report →</Button>
        </div>
      </div>
    </div>
  )
}
