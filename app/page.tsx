"use client"

import { useState } from "react"
import { useEvidenceStore } from "@/lib/evidence-store"
import { useCEOConsoleStore } from "@/lib/ceo-console-store"

import { EvidenceNav } from "@/components/evidence/EvidenceNav"
import { OverviewSection } from "@/components/evidence/OverviewSection"
import { InstitutionProfileForm } from "@/components/evidence/InstitutionProfileForm"
import { ClassificationForm } from "@/components/evidence/ClassificationForm"
import { ContestabilityForm } from "@/components/evidence/ContestabilityForm"
import { SupportReentryForm } from "@/components/evidence/SupportReentryForm"
import { CounterfactualForm } from "@/components/evidence/CounterfactualForm"
import { EvidenceSourcesForm } from "@/components/evidence/EvidenceSourcesForm"
import { JudgmentReport } from "@/components/evidence/JudgmentReport"

import { ConsoleNav } from "@/components/ceo/ConsoleNav"
import { CEOConsoleHero } from "@/components/ceo/CEOConsoleHero"
import { AuditUnitSetup } from "@/components/ceo/AuditUnitSetup"
import { DecisionSystemMap } from "@/components/ceo/DecisionSystemMap"
import { MasterFunctionDetection } from "@/components/ceo/MasterFunctionDetection"
import { AccountabilityChainMap } from "@/components/ceo/AccountabilityChainMap"
import { EvidenceConfidence } from "@/components/ceo/EvidenceConfidence"
import { ContradictionIndex } from "@/components/ceo/ContradictionIndex"
import { RiskDashboard } from "@/components/ceo/RiskDashboard"
import { ExecutiveReport } from "@/components/ceo/ExecutiveReport"

// The underlying DDAT evidence audit wizard — preserved in full and reachable
// via "View Audit Logic," since it documents the methodology the console's
// scoring is built on.
function AuditLogicContent() {
  const { state } = useEvidenceStore()
  switch (state.step) {
    case 0: return <OverviewSection />
    case 1: return <InstitutionProfileForm />
    case 2: return <ClassificationForm />
    case 3: return <ContestabilityForm />
    case 4: return <SupportReentryForm />
    case 5: return <CounterfactualForm />
    case 6: return <EvidenceSourcesForm />
    case 7: return <JudgmentReport />
    default: return <OverviewSection />
  }
}

function ConsoleContent({ onViewAuditLogic }: { onViewAuditLogic: () => void }) {
  const { state } = useCEOConsoleStore()
  switch (state.step) {
    case 0: return <CEOConsoleHero onViewAuditLogic={onViewAuditLogic} />
    case 1: return <AuditUnitSetup />
    case 2: return <DecisionSystemMap />
    case 3: return <MasterFunctionDetection />
    case 4: return <AccountabilityChainMap />
    case 5: return <EvidenceConfidence />
    case 6: return <ContradictionIndex />
    case 7: return <RiskDashboard />
    case 8: return <ExecutiveReport />
    default: return <CEOConsoleHero onViewAuditLogic={onViewAuditLogic} />
  }
}

export default function Page() {
  const [view, setView] = useState<"console" | "logic">("console")

  if (view === "logic") {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200 bg-white">
          <button
            onClick={() => setView("console")}
            className="block px-6 py-2 text-[10px] font-mono text-gray-400 hover:text-gray-700 transition-colors uppercase tracking-wider"
          >
            ← Back to CEO AI Accountability Console
          </button>
        </div>
        <EvidenceNav />
        <main>
          <AuditLogicContent />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <ConsoleNav onViewAuditLogic={() => setView("logic")} />
      <main>
        <ConsoleContent onViewAuditLogic={() => setView("logic")} />
      </main>
    </div>
  )
}
