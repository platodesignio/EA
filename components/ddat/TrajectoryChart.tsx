"use client"

import type { AuditDomain, GenerativeRates, RiskFlags } from "@/types/ddat"
import { calculateFinalDCR } from "@/lib/ddat/calculateDCR"
import { simulateDDATInterventions } from "@/lib/ddat/simulateDDAT"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid, Legend,
} from "recharts"

// Model: without intervention, systems tend toward institutional inertia
// (slight negative drift per period). With intervention, the improvement
// is applied once then partially sustained based on remaining risks.
function projectTrajectory(
  baseDCR: number,
  remainingRiskCount: number,
  periods = 8
): number[] {
  const drift = -(remainingRiskCount * 0.4 + 0.5) // institutional closure pressure
  return Array.from({ length: periods }, (_, i) => {
    const v = baseDCR + drift * i
    return Math.max(0, Math.min(100, Math.round(v * 10) / 10))
  })
}

function projectInterventionTrajectory(
  baseDCR: number,
  simDCR: number,
  remainingRiskCount: number,
  periods = 8
): number[] {
  const drift = -(remainingRiskCount * 0.2 + 0.1) // much lower drift after intervention
  return Array.from({ length: periods }, (_, i) => {
    const v = simDCR + drift * i
    return Math.max(0, Math.min(100, Math.round(v * 10) / 10))
  })
}

interface Props {
  rates: GenerativeRates
  flags: RiskFlags
  domain: AuditDomain
  selectedInterventionIds: string[]
}

const PERIOD_LABELS = ["Now", "T+1", "T+2", "T+3", "T+4", "T+5", "T+6", "T+7"]

export function TrajectoryChart({ rates, flags, domain, selectedInterventionIds }: Props) {
  const current = calculateFinalDCR(rates, flags, domain)
  const sim = simulateDDATInterventions(rates, flags, selectedInterventionIds, domain)

  const noInterv = projectTrajectory(current.finalDCR, sim.remainingRisks.length + (Object.values(flags).filter(Boolean).length))
  const withInterv = selectedInterventionIds.length > 0
    ? projectInterventionTrajectory(current.finalDCR, sim.simulatedDCR.finalDCR, sim.remainingRisks.length)
    : null

  const data = PERIOD_LABELS.map((label, i) => ({
    period: label,
    "Without intervention": noInterv[i],
    ...(withInterv ? { "With interventions": withInterv[i] } : {}),
  }))

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="border border-[#374151] bg-[#111827] px-3 py-2">
        <p className="text-[10px] text-[#9ca3af] mb-1">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="w-2 h-px inline-block" style={{ backgroundColor: p.color }} />
            <span className="text-[10px] text-[#9ca3af]">{p.name}</span>
            <span className="font-mono text-xs font-bold" style={{ color: p.color }}>{p.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="border border-[#e5e7eb] bg-[#0f172a] p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#6b7280] uppercase mb-0.5">
            Trajectory Simulation
          </p>
          <p className="text-xs text-[#9ca3af]">
            Projected DCR over 8 institutional time periods
          </p>
        </div>
        <p className="text-[9px] text-[#4b5563] text-right leading-relaxed max-w-[180px]">
          Models institutional inertia pressure and intervention-sustained improvement
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: -10 }}>
          <CartesianGrid stroke="#1f2937" strokeDasharray="4 4" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 9, fill: "#4b5563", fontFamily: "monospace" }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: "#4b5563", fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Zone lines */}
          <ReferenceLine y={80} stroke="#16a34a" strokeWidth={0.5} strokeOpacity={0.4} strokeDasharray="3 3" label={{ value: "Generative", position: "insideTopRight", fontSize: 7, fill: "#16a34a", dy: -3 }} />
          <ReferenceLine y={60} stroke="#1d4ed8" strokeWidth={0.5} strokeOpacity={0.4} strokeDasharray="3 3" label={{ value: "Conditional", position: "insideTopRight", fontSize: 7, fill: "#1d4ed8", dy: -3 }} />
          <ReferenceLine y={40} stroke="#d97706" strokeWidth={0.5} strokeOpacity={0.4} strokeDasharray="3 3" label={{ value: "Unstable", position: "insideTopRight", fontSize: 7, fill: "#d97706", dy: -3 }} />
          <ReferenceLine y={20} stroke="#dc2626" strokeWidth={0.5} strokeOpacity={0.4} strokeDasharray="3 3" label={{ value: "Closing", position: "insideTopRight", fontSize: 7, fill: "#dc2626", dy: -3 }} />

          <Line
            type="monotone"
            dataKey="Without intervention"
            stroke="#6b7280"
            strokeWidth={1.5}
            dot={{ fill: "#6b7280", r: 2 }}
            strokeDasharray="5 3"
          />
          {withInterv && (
            <Line
              type="monotone"
              dataKey="With interventions"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 3 }}
              filter="url(#glow)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <p className="text-[9px] text-[#374151] mt-3 leading-relaxed">
        Note: Trajectory is a structured audit hypothesis, not a statistical prediction.
        It models known institutional pressures based on active risk flags.
      </p>
    </div>
  )
}
