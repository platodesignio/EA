"use client"

import type { RiskFlags } from "@/types/ddat"
import { riskFlagDefinitions, RISK_KEYS } from "@/lib/ddat/riskFlags"
import { riskPenalties } from "@/lib/ddat/riskPenalties"

interface Props {
  risks: RiskFlags
  onToggle?: (key: keyof RiskFlags) => void
  readonly?: boolean
  highlightRemoved?: (keyof RiskFlags)[]
}

export function RiskFlagList({ risks, onToggle, readonly = false, highlightRemoved = [] }: Props) {
  const active = RISK_KEYS.filter((k) => risks[k])
  const inactive = RISK_KEYS.filter((k) => !risks[k])

  const RiskItem = ({ k, removed = false }: { k: keyof RiskFlags; removed?: boolean }) => {
    const isActive = risks[k]
    return (
      <div
        onClick={() => !readonly && onToggle?.(k)}
        className={`border rounded-sm px-4 py-3 transition-colors ${
          readonly
            ? isActive
              ? "border-red-200 bg-red-50"
              : removed
              ? "border-green-200 bg-green-50"
              : "border-gray-100 bg-gray-50"
            : isActive
            ? "border-red-300 bg-red-50 cursor-pointer"
            : "border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <div className="flex items-start gap-3">
          {!readonly && (
            <div
              className={`mt-0.5 w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center ${
                isActive ? "bg-red-600 border-red-600" : "border-gray-300"
              }`}
            >
              {isActive && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          )}
          {readonly && (
            <span
              className={`mt-1 w-2 h-2 shrink-0 rounded-full ${
                isActive ? "bg-red-500" : removed ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className={`text-sm font-medium ${
                isActive ? "text-red-800" : removed ? "text-green-700 line-through" : "text-gray-500"
              }`}>
                {riskFlagDefinitions[k].label}
                {removed && <span className="ml-2 text-xs text-green-600 no-underline not-italic font-normal">Removed</span>}
              </p>
              {isActive && (
                <span className="text-xs font-mono text-red-600 shrink-0">−{riskPenalties[k]}</span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
              {riskFlagDefinitions[k].description}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (readonly) {
    return (
      <div className="space-y-2">
        {active.map((k) => <RiskItem key={k} k={k} />)}
        {highlightRemoved.map((k) => <RiskItem key={k} k={k} removed />)}
        {active.length === 0 && highlightRemoved.length === 0 && (
          <p className="text-sm text-gray-400 italic">No active risk flags.</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {RISK_KEYS.map((k) => <RiskItem key={k} k={k} />)}
    </div>
  )
}
