"use client"

import { useMemo } from "react"
import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import { computeEvidenceConfidence } from "@/lib/scoring"
import { DECISION_STAGE_ORDER, DECISION_STAGE_LABEL, CHAIN_ITEM_ORDER, CHAIN_ITEM_LABEL, EVIDENCE_TIER_OPTIONS } from "@/lib/questions"
import { PageContainer, SectionTitle, SectionBanner, PrimaryButton, SecondaryButton, Card } from "@/components/evidence/shared"

const LEVEL_BORDER: Record<string, string> = {
  Low: "border-gray-900",
  Medium: "border-gray-400",
  High: "border-gray-200",
}

export function EvidenceConfidence() {
  const { state, dispatch } = useCEOConsoleStore()
  const { audit_unit, decision_stages, chain_items } = state.auditCase

  const confidence = useMemo(
    () => computeEvidenceConfidence(audit_unit.scan_basis, decision_stages, chain_items),
    [audit_unit.scan_basis, decision_stages, chain_items]
  )

  const evidenceLabel = (v: string) => EVIDENCE_TIER_OPTIONS.find(o => o.value === v)?.label ?? v

  return (
    <PageContainer>
      <SectionTitle>Step 5 — Evidence Confidence</SectionTitle>

      <SectionBanner>
        Evidence confidence is kept separate from risk. It describes how well the accountability structure
        recorded above is actually supported by evidence — not how risky that structure is.
      </SectionBanner>

      <div className={`border ${LEVEL_BORDER[confidence.level]} p-5 mb-8`}>
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
          Evidence Confidence — separate from risk
        </p>
        <p className="text-[15px] font-mono font-bold text-gray-900 uppercase tracking-wide mb-1">
          {confidence.level} ({confidence.percent}%)
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Strongest evidence tier recorded: {evidenceLabel(confidence.strongestTier)}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{confidence.explanation}</p>
      </div>

      <Card className="mb-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
          Evidence by Stage and Chain Item
        </p>
        <div className="space-y-1.5">
          {DECISION_STAGE_ORDER.map(key => (
            <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 text-xs">
              <span className="text-gray-600">{DECISION_STAGE_LABEL[key]}</span>
              <span className="font-mono text-gray-900">{evidenceLabel(decision_stages[key].evidence)}</span>
            </div>
          ))}
          {CHAIN_ITEM_ORDER.map(key => (
            <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 text-xs">
              <span className="text-gray-600">{CHAIN_ITEM_LABEL[key]}</span>
              <span className="font-mono text-gray-900">{evidenceLabel(chain_items[key].evidence)}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 4 })}>← Back</SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 6 })}>
          Next: Contradiction Index →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
