"use client"

import { useMemo } from "react"
import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import { deriveMasterFunction, computeEvidenceConfidence, computeContradictionIndex, computeRiskDashboard } from "@/lib/scoring"
import { DECLARED_MASTER_FUNCTION_OPTIONS } from "@/lib/questions"
import { PageContainer, SectionTitle, SectionBanner, PrimaryButton, SecondaryButton, Card } from "@/components/evidence/shared"

function Row({ label, value, max = 4 }: { label: string; value: number; max?: number }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 text-xs">
      <span className="text-gray-600">{label.replace(/_/g, " ")}</span>
      <span className="font-mono text-gray-900">{value}/{max}</span>
    </div>
  )
}

export function RiskDashboard() {
  const { state, dispatch } = useCEOConsoleStore()
  const { audit_unit, decision_stages, chain_items, master_function } = state.auditCase

  const mf = useMemo(
    () => deriveMasterFunction(master_function.declared, master_function.answers),
    [master_function.declared, master_function.answers]
  )
  const confidence = useMemo(
    () => computeEvidenceConfidence(audit_unit.scan_basis, decision_stages, chain_items),
    [audit_unit.scan_basis, decision_stages, chain_items]
  )
  const contradiction = useMemo(
    () => computeContradictionIndex(decision_stages, chain_items, mf),
    [decision_stages, chain_items, mf]
  )
  const risk = useMemo(
    () => computeRiskDashboard(audit_unit, decision_stages, chain_items, mf, master_function.answers, confidence, contradiction),
    [audit_unit, decision_stages, chain_items, mf, master_function.answers, confidence, contradiction]
  )

  const declaredLabel = DECLARED_MASTER_FUNCTION_OPTIONS.find(o => o.value === mf.declared)?.label ?? mf.declared

  return (
    <PageContainer>
      <SectionTitle>Step 7 — Risk Dashboard</SectionTitle>

      <SectionBanner>
        All figures below are preliminary, evidence-dependent, and unverified. This is not a final certification
        of any kind.
      </SectionBanner>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">1. Overall Preliminary Risk</p>
          <p className="text-lg font-mono font-bold text-gray-900">{risk.preliminaryRisk.toFixed(1)}/4.0 — {risk.preliminaryRiskCategory}</p>
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">2. Evidence Confidence</p>
          <p className="text-lg font-mono font-bold text-gray-900">{confidence.level} ({confidence.percent}%)</p>
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">3. Declared Master Function</p>
          <p className="text-sm text-gray-900">{declaredLabel}</p>
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">4. Operational Master Function</p>
          <p className="text-sm text-gray-900">{mf.operational.join(", ")}</p>
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">5. Responsibility Clarity</p>
          <p className="text-lg font-mono font-bold text-gray-900">{risk.capacityDomains.responsibility_generation}/4</p>
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">6. Appealability</p>
          <p className="text-lg font-mono font-bold text-gray-900">{risk.capacityDomains.appealability}/4</p>
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">7. Re-entry Capacity</p>
          <p className="text-lg font-mono font-bold text-gray-900">{risk.capacityDomains.re_entry_capacity}/4</p>
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">8. Future Closure Risk</p>
          <p className="text-lg font-mono font-bold text-gray-900">{risk.riskDomains.future_closure}/4</p>
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">9. Primary Missing Evidence</p>
          {risk.primaryMissingEvidence.length > 0 ? (
            <ul className="space-y-0.5">
              {risk.primaryMissingEvidence.map(m => (
                <li key={m} className="text-xs text-gray-700">— {m}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">None entirely without evidence.</p>
          )}
        </Card>
        <Card>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">10. Recommended Immediate Action</p>
          <p className="text-sm text-gray-900">{risk.recommendedImmediateAction}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Risk Domains</p>
          {Object.entries(risk.riskDomains).map(([k, v]) => <Row key={k} label={k} value={v} />)}
        </Card>
        <Card>
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Positive Capacity Domains</p>
          {Object.entries(risk.capacityDomains).map(([k, v]) => <Row key={k} label={k} value={v} />)}
        </Card>
      </div>

      {risk.adjustmentsApplied.length > 0 && (
        <div className="mb-10">
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">Upward Adjustments Applied</p>
          <ul className="space-y-1.5">
            {risk.adjustmentsApplied.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-gray-300 shrink-0">—</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 6 })}>← Back</SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 8 })}>
          Next: Executive Report →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
