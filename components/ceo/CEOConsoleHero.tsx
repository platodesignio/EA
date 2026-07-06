"use client"

import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import { PageContainer, PrimaryButton, SecondaryButton } from "@/components/evidence/shared"

const NOT_LIST = [
  "This is not a personality quiz.",
  "This is not a psychological diagnosis.",
  "This is not legal certification.",
  "This is not compliance certification.",
  "This is not an AI safety certification.",
]

export function CEOConsoleHero({ onViewAuditLogic }: { onViewAuditLogic: () => void }) {
  const { dispatch } = useCEOConsoleStore()

  return (
    <PageContainer>
      <div className="mb-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.3em] text-gray-400 uppercase mb-3">
          Powered by the DDAT Evidence Standard
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
          CEO AI Accountability Console
        </h1>
        <p className="text-base text-gray-700 leading-relaxed max-w-2xl mb-4">
          Can your organization account for the future your AI system creates?
        </p>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          Map the accountability chain behind AI scoring, ranking, prediction, exclusion, appeal, and re-entry.
          Before your AI system evaluates humans, identify who is responsible, who can contest, and whether
          affected people can re-enter after a negative decision.
        </p>
      </div>

      <div className="border-l-2 border-gray-900 pl-5 mb-4">
        <p className="text-sm font-mono text-gray-900 leading-relaxed">&ldquo;Audit the institution. Not the person.&rdquo;</p>
      </div>
      <div className="border-l-2 border-gray-900 pl-5 mb-10">
        <p className="text-sm font-mono text-gray-900 leading-relaxed">
          &ldquo;We do not measure private belief. We audit institutionalized commitments.&rdquo;
        </p>
      </div>

      <div className="border border-gray-200 p-4 mb-10 text-xs text-gray-600 leading-relaxed max-w-2xl">
        Private belief cannot be measured by this tool. The console reviews how organizational assumptions
        appear in decision flows, scoring mechanisms, responsibility ownership, appeal routes, and re-entry
        conditions.
      </div>

      <div className="mb-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
          What this console is
        </p>
        <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mb-4">
          This is an executive governance console for mapping how an AI-enabled decision system evaluates,
          ranks, predicts, classifies, excludes, allows appeal, allows re-entry, and distributes responsibility.
        </p>
        <ul className="space-y-1">
          {NOT_LIST.map(item => (
            <li key={item} className="flex gap-2 text-sm text-gray-500">
              <span className="text-gray-300 mt-0.5">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mb-4">
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
