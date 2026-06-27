"use client"

import type { DCRResult } from "@/types/ddat"

const LEVEL_COLOR: Record<string, string> = {
  "Freedom-generative":       "#16a34a",
  "Conditionally generative": "#1d4ed8",
  "Ambivalent / unstable":    "#d97706",
  "Freedom-closing":          "#ea580c",
  "Severe closure":           "#dc2626",
}

function color(level: string) {
  return LEVEL_COLOR[level] ?? "#6b7280"
}

interface Props {
  result: DCRResult
  label?: string
  compact?: boolean
}

export function DCRScoreCard({ result, label, compact = false }: Props) {
  const c = color(result.riskLevel)

  if (compact) {
    return (
      <div className="flex items-center gap-3 border border-gray-200 rounded-sm px-4 py-2 bg-white">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">DCR{label ? ` — ${label}` : ""}</p>
          <p className="text-xl font-bold leading-none" style={{ color: c }}>
            {Math.round(result.finalDCR)}
          </p>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div>
          <p className="text-[10px] text-gray-400">Level</p>
          <p className="text-xs font-medium leading-tight" style={{ color: c }}>{result.riskLevel}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 bg-white rounded-sm p-6 space-y-4">
      {label && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      )}
      <div className="flex items-end gap-6">
        <div>
          <p className="text-5xl font-bold" style={{ color: c }}>
            {Math.round(result.finalDCR)}
          </p>
          <p className="text-xs text-gray-400 mt-1">/ 100</p>
        </div>
        <div className="flex-1 space-y-1.5 pb-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Raw DCR</span>
            <span className="font-mono">{result.rawDCR}</span>
          </div>
          <div className="flex justify-between text-xs text-red-600">
            <span>Penalty</span>
            <span className="font-mono">−{result.totalPenalty}</span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-between text-sm font-semibold" style={{ color: c }}>
            <span>Final DCR</span>
            <span className="font-mono">{Math.round(result.finalDCR)}</span>
          </div>
        </div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${result.finalDCR}%`, backgroundColor: c }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>0 — Severe closure</span>
        <span>100 — Freedom-generative</span>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs font-semibold mb-1" style={{ color: c }}>{result.riskLevel}</p>
        <p className="text-xs text-gray-600 leading-relaxed">{result.directionalJudgment}</p>
      </div>
    </div>
  )
}
