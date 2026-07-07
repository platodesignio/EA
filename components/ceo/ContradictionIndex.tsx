"use client"

import { useMemo } from "react"
import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import { deriveMasterFunction, computeContradictionIndex, NO_CONTRADICTION_TEXT, ASSUMED_CLAIMS_DISCLOSURE } from "@/lib/scoring"
import { PageContainer, SectionTitle, SectionBanner, PrimaryButton, SecondaryButton, Card } from "@/components/evidence/shared"

const INDEX_BORDER: Record<string, string> = {
  Low: "border-gray-200",
  Medium: "border-gray-400",
  High: "border-gray-900",
}

export function ContradictionIndex() {
  const { state, dispatch } = useCEOConsoleStore()
  const { decision_stages, chain_items, master_function } = state.auditCase

  const mf = useMemo(
    () => deriveMasterFunction(master_function.declared, master_function.answers),
    [master_function.declared, master_function.answers]
  )
  const contradiction = useMemo(
    () => computeContradictionIndex(decision_stages, chain_items, mf),
    [decision_stages, chain_items, mf]
  )

  return (
    <PageContainer>
      <SectionTitle>Step 6 — Contradiction Index</SectionTitle>

      <SectionBanner>
        Every organization implicitly claims to be human-centered, transparent, and accountable. This section
        checks that assumed position against the operational structure recorded in the previous steps.
      </SectionBanner>

      <div className={`border ${INDEX_BORDER[contradiction.index]} p-5 mb-8`}>
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
          Contradiction Index
        </p>
        <p className="text-[15px] font-mono font-bold text-gray-900 uppercase tracking-wide">
          {contradiction.index}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
            Assumed Institutional Position — Not Collected
          </p>
          <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{ASSUMED_CLAIMS_DISCLOSURE}</p>
          <ul className="space-y-1.5">
            {contradiction.assumedGovernancePosition.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-gray-300 shrink-0">—</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
            Findings
          </p>
          {contradiction.checks.some(c => c.violated) ? (
            <ul className="space-y-1.5">
              {contradiction.checks.filter(c => c.violated).map(c => (
                <li key={c.id} className="flex gap-2 text-sm text-gray-900">
                  <span className="text-gray-300 shrink-0">—</span>
                  <span>{c.plainFinding}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 font-mono border border-gray-200 px-3 py-2 leading-relaxed">
              {NO_CONTRADICTION_TEXT}
            </p>
          )}
        </div>
      </div>

      <Card className="mb-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
          Checks
        </p>
        <div className="space-y-2">
          {contradiction.checks.map(c => (
            <div key={c.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
              <span className={`text-[10px] font-mono font-bold border px-1.5 py-0.5 uppercase shrink-0 ${c.violated ? "border-gray-900 text-gray-900" : "border-gray-200 text-gray-400"}`}>
                {c.violated ? "Contradicted" : "Holds"}
              </span>
              <span className="text-sm text-gray-700">{c.claim}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}>← Back</SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 7 })}>
          Next: Risk Dashboard →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
