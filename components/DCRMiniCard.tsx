"use client"

import { calculateFinalDCR } from "@/lib/ddat/calculateDCR"
import type { AuditDomain, GenerativeRates, RiskFlags } from "@/types/ddat"

export function DCRMiniCard({
  rates,
  flags,
  domain,
}: {
  rates: GenerativeRates
  flags: RiskFlags
  domain: AuditDomain
}) {
  const { finalDCR, riskLevel } = calculateFinalDCR(rates, flags, domain)

  const color =
    finalDCR >= 80 ? "#16a34a" :
    finalDCR >= 60 ? "#1d4ed8" :
    finalDCR >= 40 ? "#d97706" :
    finalDCR >= 20 ? "#ea580c" : "#dc2626"

  return (
    <div className="flex items-center gap-3 border border-gray-200 rounded-sm px-4 py-2 bg-white shrink-0">
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">DCR</p>
        <p className="text-xl font-bold leading-none" style={{ color }}>{Math.round(finalDCR)}</p>
      </div>
      <div className="w-px h-8 bg-gray-200" />
      <div>
        <p className="text-[10px] text-gray-400">Level</p>
        <p className="text-xs font-medium leading-tight" style={{ color }}>{riskLevel}</p>
      </div>
    </div>
  )
}
