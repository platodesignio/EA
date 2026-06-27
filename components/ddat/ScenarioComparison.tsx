"use client"

import { useState } from "react"
import type { AuditDomain, GenerativeRates, RiskFlags } from "@/types/ddat"
import { simulateDDATInterventions } from "@/lib/ddat/simulateDDAT"
import { interventions as allInterventions } from "@/lib/ddat/interventions"
import { getLevelStyle } from "@/components/ui"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts"
import { generativeRateDefinitions, RATE_KEYS } from "@/lib/ddat/generativeRates"

type SavedScenario = {
  id: string
  name: string
  interventionIds: string[]
  dcr: number
  riskLevel: string
}

interface Props {
  rates: GenerativeRates
  flags: RiskFlags
  domain: AuditDomain
  currentDCR: number
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]

export function ScenarioComparison({ rates, flags, domain, currentDCR }: Props) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [name, setName] = useState("Scenario A")

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const saveScenario = () => {
    if (selected.length === 0) return
    const sim = simulateDDATInterventions(rates, flags, selected, domain)
    const newS: SavedScenario = {
      id: Date.now().toString(),
      name,
      interventionIds: [...selected],
      dcr: sim.simulatedDCR.finalDCR,
      riskLevel: sim.simulatedDCR.riskLevel,
    }
    setScenarios((prev) => [...prev.slice(-3), newS])
    // Auto-increment name
    const match = name.match(/([A-Z])$/)
    if (match) {
      const next = String.fromCharCode(match[1].charCodeAt(0) + 1)
      setName(name.replace(/[A-Z]$/, next))
    }
    setSelected([])
  }

  // Build radar data for comparison
  const scenarioRadarData = RATE_KEYS.map((k) => {
    const entry: Record<string, number | string> = {
      subject: generativeRateDefinitions[k].shortName,
      Baseline: rates[k],
    }
    scenarios.forEach((s) => {
      const sim = simulateDDATInterventions(rates, flags, s.interventionIds, domain)
      entry[s.name] = sim.simulatedRates[k]
    })
    return entry
  })

  return (
    <div className="border border-[#e5e7eb] bg-[#0f172a] p-5">
      <p className="text-[9px] font-bold tracking-[0.15em] text-[#6b7280] uppercase mb-4">
        Scenario Comparison
      </p>

      {/* Scenario builder */}
      <div className="bg-[#0a0a0a] border border-[#1f2937] p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#111827] border border-[#1f2937] text-white text-xs px-3 py-1.5 w-32 font-mono focus:outline-none focus:border-[#3b82f6]"
            placeholder="Name"
          />
          <p className="text-[9px] text-[#4b5563]">{selected.length} interventions selected</p>
          <button
            onClick={saveScenario}
            disabled={selected.length === 0}
            className="ml-auto px-3 py-1.5 text-xs bg-[#1d4ed8] text-white font-semibold disabled:opacity-30 hover:bg-[#1e40af] transition-colors"
          >
            Save Scenario
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto pr-1">
          {allInterventions.map((intv) => {
            const on = selected.includes(intv.id)
            return (
              <button
                key={intv.id}
                onClick={() => toggle(intv.id)}
                className={`text-left px-2 py-1.5 text-[9px] border transition-colors ${
                  on
                    ? "border-[#1d4ed8] bg-[#1e3a8a]/30 text-[#93c5fd]"
                    : "border-[#1f2937] text-[#6b7280] hover:border-[#374151]"
                }`}
              >
                {intv.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Saved scenarios */}
      {scenarios.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {/* Baseline */}
            <div className="border border-[#1f2937] p-3">
              <p className="text-[9px] text-[#4b5563] mb-1">Baseline</p>
              <p className="font-mono text-2xl font-bold text-[#6b7280]">
                {Math.round(currentDCR)}
              </p>
              <div className="h-0.5 bg-[#6b7280] mt-2" style={{ width: `${currentDCR}%` }} />
            </div>

            {scenarios.map((s, i) => {
              const ls = getLevelStyle(s.riskLevel)
              const delta = s.dcr - currentDCR
              return (
                <div
                  key={s.id}
                  className="border p-3 relative"
                  style={{ borderColor: COLORS[i % COLORS.length] + "40" }}
                >
                  <button
                    onClick={() => setScenarios((prev) => prev.filter((x) => x.id !== s.id))}
                    className="absolute top-1.5 right-1.5 text-[#374151] hover:text-white text-[10px]"
                  >
                    ×
                  </button>
                  <p className="text-[9px] font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                    {s.name}
                  </p>
                  <p className="font-mono text-2xl font-bold mt-0.5" style={{ color: COLORS[i % COLORS.length] }}>
                    {Math.round(s.dcr)}
                  </p>
                  <p className="font-mono text-[9px] text-[#4ade80] mt-0.5">
                    {delta > 0 ? `+${Math.round(delta)}` : Math.round(delta)}
                  </p>
                  <div
                    className="h-0.5 mt-2 transition-all"
                    style={{ width: `${s.dcr}%`, backgroundColor: COLORS[i % COLORS.length] }}
                  />
                </div>
              )
            })}
          </div>

          {/* Radar comparison */}
          <div className="bg-[#0a0a0a] border border-[#1f2937] p-4">
            <p className="text-[9px] text-[#6b7280] mb-3">Generative Rate Comparison</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={scenarioRadarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fill: "#4b5563", fontFamily: "monospace" }} />
                <Radar
                  dataKey="Baseline"
                  stroke="#374151"
                  fill="#374151"
                  fillOpacity={0.1}
                  strokeDasharray="3 3"
                />
                {scenarios.map((s, i) => (
                  <Radar
                    key={s.id}
                    dataKey={s.name}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.1}
                    strokeWidth={1.5}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {scenarios.length === 0 && (
        <p className="text-[10px] text-[#374151] text-center py-4">
          Select interventions and save a scenario to begin comparison
        </p>
      )}
    </div>
  )
}
