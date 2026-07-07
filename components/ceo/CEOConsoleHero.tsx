"use client"

import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import { PageContainer, PrimaryButton, SecondaryButton } from "@/components/evidence/shared"

const PRINCIPLES = [
  "Audit the institution. Not the person.",
  "Preliminary scan. Not certification.",
  "Evidence-dependent. Not self-report only.",
]

export function CEOConsoleHero({ onViewAuditLogic }: { onViewAuditLogic: () => void }) {
  const { dispatch } = useCEOConsoleStore()

  return (
    <PageContainer>
      <p className="text-[10px] font-mono font-bold tracking-[0.3em] text-gray-500 uppercase mb-3">
        Powered by the DDAT Evidence Standard
      </p>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-1">
        FED-DLR Audit
      </h1>
      <p className="text-xs font-mono text-gray-500 uppercase tracking-wide mb-3">
        CEO AI Accountability Console
      </p>
      <p className="text-lg text-gray-800 leading-snug max-w-2xl mb-3">
        Can your organization account for the future your AI system creates?
      </p>
      <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mb-2">
        Map the accountability chain behind AI scoring, ranking, prediction, exclusion, appeal, and re-entry.
      </p>
      <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mb-8">
        Private belief cannot be measured here. This console reviews how institutional commitments appear in
        decision flows, responsibility ownership, evidence quality, and affected-subject safeguards.
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-1.5 border-y border-gray-100 py-3 mb-8">
        {PRINCIPLES.map(p => (
          <span key={p} className="text-xs font-mono text-gray-600">{p}</span>
        ))}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed max-w-2xl mb-8">
        Not a personality quiz, psychological diagnosis, legal certification, compliance certification, or AI
        safety certification.
      </p>

      <div className="flex gap-3">
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}>
          Start Executive Scan
        </PrimaryButton>
        <SecondaryButton onClick={onViewAuditLogic}>
          View Audit Logic
        </SecondaryButton>
      </div>
    </PageContainer>
  )
}
