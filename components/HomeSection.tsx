"use client"

import { useStore } from "@/lib/store"
import { Button } from "./ui"

// Mini orbit SVG for hero decoration
function HeroOrbit() {
  const size = 320
  const cx = size / 2
  const cy = size / 2
  const r = 110

  // Generate orbit ring points
  const points = Array.from({ length: 120 }, (_, i) => {
    const angle = (i / 120) * Math.PI * 2 - Math.PI / 2
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"

  // Current position: DCR ~24 (closure zone)
  const currentAngle = -2.0
  const currentX = cx + r * Math.cos(currentAngle)
  const currentY = cy + r * Math.sin(currentAngle)

  // Simulated position: DCR ~58 (ambivalent)
  const simAngle = -0.2
  const simX = cx + r * Math.cos(simAngle)
  const simY = cy + r * Math.sin(simAngle)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      {/* Background glow */}
      <radialGradient id="hglow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
      </radialGradient>
      <circle cx={cx} cy={cy} r={r + 30} fill="url(#hglow)" />

      {/* Outer guide ring */}
      <circle cx={cx} cy={cy} r={r + 20} fill="none" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="2,6" opacity="0.4" />

      {/* Main orbit path */}
      <path d={pathD} fill="none" stroke="#374151" strokeWidth="1.5" opacity="0.6" />

      {/* Left half: closure (red-tinted) */}
      <path
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r}`}
        fill="none"
        stroke="#ef4444"
        strokeWidth="2"
        opacity="0.5"
        strokeDasharray="4,2"
      />

      {/* Right half: freedom (blue-tinted) */}
      <path
        d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r}`}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        opacity="0.5"
        strokeDasharray="4,2"
      />

      {/* Center Earth dot */}
      <circle cx={cx} cy={cy} r={6} fill="#1d4ed8" opacity="0.9" />
      <circle cx={cx} cy={cy} r={10} fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.4" />

      {/* Spoke to current */}
      <line x1={cx} y1={cy} x2={currentX} y2={currentY} stroke="#6b7280" strokeWidth="0.8" opacity="0.5" strokeDasharray="3,3" />

      {/* Spoke to sim */}
      <line x1={cx} y1={cy} x2={simX} y2={simY} stroke="#3b82f6" strokeWidth="0.8" opacity="0.5" strokeDasharray="3,3" />

      {/* Sim position (ghost) */}
      <circle cx={simX} cy={simY} r={7} fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7" />
      <circle cx={simX} cy={simY} r={3} fill="#3b82f6" opacity="0.5" />

      {/* Current position */}
      <circle cx={currentX} cy={currentY} r={9} fill="#ef4444" opacity="0.9" />
      <circle cx={currentX} cy={currentY} r={14} fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.4" />

      {/* Labels */}
      <text x={cx - 60} y={cy + r + 22} fontSize="8" fill="#ef4444" opacity="0.7" textAnchor="middle" fontFamily="monospace">CLOSED SCORE ORBIT</text>
      <text x={cx + 60} y={cy + r + 22} fontSize="8" fill="#3b82f6" opacity="0.7" textAnchor="middle" fontFamily="monospace">FREEDOM-EVOLUTION ORBIT</text>
      <text x={currentX + 14} y={currentY - 4} fontSize="8" fill="#ef4444" opacity="0.9" fontFamily="monospace">DCR 24</text>
      <text x={simX + 12} y={simY - 4} fontSize="8" fill="#3b82f6" opacity="0.9" fontFamily="monospace">SIM 58</text>
    </svg>
  )
}

const STATS = [
  { n: "9", label: "Generative Rates", sub: "IGR · PDFR · MGR · DRGR · SRGR · TIGR · RCR · FGR · HGR" },
  { n: "20", label: "Risk Flags", sub: "Structural closure indicators with weighted penalties" },
  { n: "DCR", label: "Direction Score 0–100", sub: "cosine similarity × domain ideal vector" },
]

const RATE_NAMES = [
  ["IGR", "Information Generation Rate"],
  ["PDFR", "Possibility Distribution Formation Rate"],
  ["MGR", "Meaning Generation Rate"],
  ["DRGR", "Deliberation-Reflection Generation Rate"],
  ["SRGR", "Self-Revision Generation Rate"],
  ["TIGR", "Temporal Integration Generation Rate"],
  ["RCR", "Relational Connection Rate"],
  ["FGR", "Freedom Generation Rate"],
  ["HGR", "Historicity Generation Rate"],
]

export function HomeSection() {
  const { dispatch } = useStore()

  return (
    <div className="min-h-screen">
      {/* ── Dark hero ─────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        />

        <div className="relative max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.35em] text-[#3b82f6] uppercase mb-6">
              DDAT Studio — Dialectical Direction Audit Theory
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-8">
              Does this system<br />
              <span className="text-[#3b82f6]">generate freedom</span><br />
              or close the future?
            </h1>
            <p className="text-[#9ca3af] text-base leading-relaxed max-w-lg mb-10">
              A structural audit simulator for AI scoring systems, institutions,
              evaluation architectures, and social decision structures.
              DDAT does not evaluate persons — it audits the generative direction of systems.
            </p>

            <div className="flex items-center gap-4 mb-12">
              <button
                onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
                className="bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-semibold px-8 py-4 text-sm tracking-wide transition-colors"
              >
                START AUDIT →
              </button>
              <span className="text-[11px] text-[#4b5563]">
                Preloaded: AI Hiring Score Audit (Labor Domain)
              </span>
            </div>

            {/* Core axiom */}
            <div className="border-l-2 border-[#1d4ed8] pl-4">
              <p className="text-[11px] text-[#6b7280] italic leading-relaxed">
                "Measurement is not ontology. A score is not a person.<br />
                An audit is not a verdict."
              </p>
            </div>
          </div>

          {/* Right: orbit */}
          <div className="flex flex-col items-center">
            <HeroOrbit />
            <p className="text-[10px] text-[#4b5563] tracking-wider mt-2 text-center font-mono">
              ORBITAL POSITION DIAGRAM
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <section className="border-b border-[#e5e7eb] bg-[#f9fafb]">
        <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-3 divide-x divide-[#e5e7eb]">
          {STATS.map((s) => (
            <div key={s.label} className="px-8 first:pl-0 last:pr-0">
              <p className="font-mono text-4xl font-bold text-[#0a0a0a] mb-1">{s.n}</p>
              <p className="text-sm font-semibold text-[#0a0a0a] mb-1">{s.label}</p>
              <p className="text-[11px] text-[#9ca3af] leading-relaxed">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rate index ─────────────────────────────────────────── */}
      <section className="border-b border-[#e5e7eb]">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#9ca3af] uppercase mb-6">
            9 Generative Rates — Audit Vector Components
          </p>
          <div className="grid grid-cols-3 gap-px bg-[#e5e7eb]">
            {RATE_NAMES.map(([abbr, full], i) => (
              <div key={abbr} className="bg-white p-4 flex gap-3 items-start">
                <span className="font-mono text-xs font-bold text-[#1d4ed8] w-10 flex-shrink-0 pt-0.5">{abbr}</span>
                <span className="text-xs text-[#374151]">{full}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two orbit paths explanation ─────────────────────────── */}
      <section className="bg-[#0a0a0a] text-white">
        <div className="max-w-6xl mx-auto px-8 py-14 grid grid-cols-2 gap-px">
          <div className="border-r border-[#1f2937] pr-12">
            <div className="w-2 h-2 rounded-full bg-[#ef4444] mb-4" />
            <h3 className="text-lg font-bold mb-3 text-[#f87171]">Closed Score Orbit</h3>
            <p className="text-sm text-[#6b7280] leading-relaxed">
              Systems that substitute measurement for personhood, prevent re-entry,
              rely on proxy discrimination, and foreclose future development trajectories.
              DCR approaches 0. The system absorbs and does not return.
            </p>
          </div>
          <div className="pl-12">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6] mb-4" />
            <h3 className="text-lg font-bold mb-3 text-[#60a5fa]">Freedom-Evolution Orbit</h3>
            <p className="text-sm text-[#6b7280] leading-relaxed">
              Systems that support meaning generation, enable revision, maintain appeal mechanisms,
              distribute possibility across stakeholders, and preserve long-term development capacity.
              DCR approaches 100. The system returns more than it takes.
            </p>
          </div>
        </div>
      </section>

      {/* ── Begin CTA ──────────────────────────────────────────── */}
      <section className="border-t border-[#e5e7eb]">
        <div className="max-w-6xl mx-auto px-8 py-12 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-[#9ca3af] uppercase mb-2">
              Begin Structural Audit
            </p>
            <p className="text-2xl font-bold text-[#0a0a0a]">
              7 steps. No account required.
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
            className="bg-[#0a0a0a] hover:bg-[#1d4ed8] text-white font-semibold px-10 py-4 text-sm tracking-wide transition-colors"
          >
            AUDIT A SYSTEM →
          </button>
        </div>
      </section>
    </div>
  )
}
