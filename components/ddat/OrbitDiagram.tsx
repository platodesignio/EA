"use client"

import type { DCRResult } from "@/types/ddat"

interface Props {
  current: DCRResult
  simulated?: DCRResult
}

function orbitAngle(dcr: number): number {
  // Map DCR 0-100 to angle: 0=top-left(closed), 100=top-right(freedom)
  // Center = 50 = straight up (12 o'clock)
  // Range: -140deg (closed) to +140deg (freedom)
  return ((dcr - 50) / 50) * 140
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

const W = 560
const H = 420
const CX = W / 2
const CY = H / 2 + 20

const RINGS = [170, 140, 110, 80, 50]

export function OrbitDiagram({ current, simulated }: Props) {
  const curAngle = orbitAngle(current.finalDCR)
  const simAngle = simulated ? orbitAngle(simulated.finalDCR) : null

  const curPos = polarToXY(CX, CY, 155, curAngle)
  const simPos = simAngle !== null ? polarToXY(CX, CY, 155, simAngle) : null

  const isClosing = current.finalDCR < 50
  const isGenerative = current.finalDCR >= 60

  return (
    <div className="border border-[#e5e7eb] bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Title */}
      <div className="flex justify-between items-start mb-3 px-2">
        <div>
          <p className="text-[9px] font-bold tracking-[0.2em] text-[#6b7280] uppercase">Dialectical Direction Audit Theory</p>
          <p className="text-sm font-bold text-white tracking-tight">Orbit Position</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold" style={{
            color: current.finalDCR >= 80 ? "#4ade80" :
                   current.finalDCR >= 60 ? "#60a5fa" :
                   current.finalDCR >= 40 ? "#fbbf24" :
                   current.finalDCR >= 20 ? "#f97316" : "#f87171"
          }}>
            {Math.round(current.finalDCR)}
          </p>
          <p className="text-[9px] text-[#6b7280]">DCR</p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxHeight: 320 }}
      >
        <defs>
          <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="60%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>
          <radialGradient id="glowRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip to upper semi-circle for orbit arcs */}
          <clipPath id="upperHalf">
            <rect x="0" y="0" width={W} height={CY} />
          </clipPath>
        </defs>

        {/* Background atmosphere */}
        <rect width={W} height={H} fill="#0a0a0a" />

        {/* Left side glow - closed */}
        <ellipse cx={CX - 180} cy={CY} rx="120" ry="80" fill="url(#glowRed)" />

        {/* Right side glow - freedom */}
        <ellipse cx={CX + 180} cy={CY} rx="120" ry="80" fill="url(#glowGreen)" />

        {/* Orbit rings */}
        {RINGS.map((r, i) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="#1f2937"
            strokeWidth={i === 0 ? 1.5 : 0.75}
            strokeDasharray={i % 2 === 0 ? "none" : "4 4"}
          />
        ))}

        {/* Outer orbit arc - freedom side (right) */}
        <path
          d={`M ${CX - 165} ${CY} A 165 165 0 0 1 ${CX + 165} ${CY}`}
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          filter="url(#glow)"
        />

        {/* Outer orbit arc - closed side (left) */}
        <path
          d={`M ${CX - 165} ${CY} A 165 165 0 0 0 ${CX + 165} ${CY}`}
          fill="none"
          stroke="#4b5563"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Cross lines */}
        <line x1={CX} y1={CY - 175} x2={CX} y2={CY + 30} stroke="#1f2937" strokeWidth="0.75" />
        <line x1={CX - 175} y1={CY} x2={CX + 175} y2={CY} stroke="#1f2937" strokeWidth="0.75" />

        {/* Earth / Center */}
        <circle cx={CX} cy={CY} r={28} fill="url(#earthGrad)" />
        <circle cx={CX} cy={CY} r={28} fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
        <text x={CX} y={CY + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#93c5fd" fontWeight="bold">AUDIT</text>

        {/* Orbit labels */}
        <text x={CX - 210} y={CY - 30} textAnchor="middle" fontSize="7" fill="#6b7280" fontWeight="bold" letterSpacing="2">
          CLOSED
        </text>
        <text x={CX - 210} y={CY - 20} textAnchor="middle" fontSize="7" fill="#6b7280" letterSpacing="1">
          SCORE ORBIT
        </text>

        <text x={CX + 210} y={CY - 30} textAnchor="middle" fontSize="7" fill="#3b82f6" fontWeight="bold" letterSpacing="2">
          FREEDOM
        </text>
        <text x={CX + 210} y={CY - 20} textAnchor="middle" fontSize="7" fill="#3b82f6" letterSpacing="1">
          EVOLUTION ORBIT
        </text>

        {/* Simulated position (ghost) */}
        {simPos && simAngle !== null && Math.abs(simAngle - curAngle) > 2 && (
          <>
            <circle
              cx={simPos.x}
              cy={simPos.y}
              r={10}
              fill="#4ade80"
              fillOpacity="0.2"
              stroke="#4ade80"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            <circle cx={simPos.x} cy={simPos.y} r={4} fill="#4ade80" fillOpacity="0.5" />
            <text
              x={simPos.x + (simPos.x > CX ? 14 : -14)}
              y={simPos.y - 8}
              textAnchor={simPos.x > CX ? "start" : "end"}
              fontSize="7"
              fill="#4ade80"
              fontWeight="bold"
            >
              {Math.round(simulated!.finalDCR)} →
            </text>
          </>
        )}

        {/* Current position */}
        <circle
          cx={curPos.x}
          cy={curPos.y}
          r={14}
          fill={isClosing ? "#dc262620" : "#1d4ed820"}
          stroke={isClosing ? "#dc2626" : isGenerative ? "#3b82f6" : "#d97706"}
          strokeWidth="1.5"
          filter="url(#glowStrong)"
        />
        <circle
          cx={curPos.x}
          cy={curPos.y}
          r={6}
          fill={isClosing ? "#dc2626" : isGenerative ? "#3b82f6" : "#d97706"}
          filter="url(#glow)"
        />

        {/* Label: current score */}
        <text
          x={curPos.x + (curPos.x > CX ? 18 : -18)}
          y={curPos.y - 6}
          textAnchor={curPos.x > CX ? "start" : "end"}
          fontSize="9"
          fill="white"
          fontWeight="bold"
        >
          {Math.round(current.finalDCR)}
        </text>
        <text
          x={curPos.x + (curPos.x > CX ? 18 : -18)}
          y={curPos.y + 6}
          textAnchor={curPos.x > CX ? "start" : "end"}
          fontSize="7"
          fill="#9ca3af"
        >
          {current.riskLevel}
        </text>

        {/* Direction axis labels */}
        <text x={CX} y={CY - 185} textAnchor="middle" fontSize="7" fill="#4b5563" letterSpacing="3" fontWeight="bold">
          DIRECTION
        </text>
        <text x={CX + 182} y={CY + 5} textAnchor="start" fontSize="7" fill="#4b5563" letterSpacing="2">
          RATE
        </text>
        <text x={CX - 182} y={CY + 5} textAnchor="end" fontSize="7" fill="#4b5563" letterSpacing="2">
          AUDIT
        </text>

        {/* Bottom score scale */}
        {[0, 20, 40, 60, 80, 100].map((v) => {
          const a = orbitAngle(v)
          const pos = polarToXY(CX, CY, 172, a)
          return (
            <text
              key={v}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="6"
              fill={v >= 60 ? "#3b82f6" : v <= 20 ? "#dc2626" : "#4b5563"}
              fontFamily="monospace"
            >
              {v}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-between items-center px-2 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#dc2626] inline-block" />
          <span className="text-[9px] text-[#6b7280]">Current position</span>
        </div>
        {simPos && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] inline-block opacity-60" />
            <span className="text-[9px] text-[#6b7280]">After interventions</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-px bg-[#3b82f6] inline-block" />
          <span className="text-[9px] text-[#6b7280]">Freedom-evolution orbit</span>
        </div>
      </div>
    </div>
  )
}
