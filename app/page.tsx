"use client"

import { useEvidenceStore } from "@/lib/evidence-store"
import { EvidenceNav } from "@/components/evidence/EvidenceNav"
import { OverviewSection } from "@/components/evidence/OverviewSection"
import { InstitutionProfileForm } from "@/components/evidence/InstitutionProfileForm"
import { ClassificationForm } from "@/components/evidence/ClassificationForm"
import { ContestabilityForm } from "@/components/evidence/ContestabilityForm"
import { SupportReentryForm } from "@/components/evidence/SupportReentryForm"
import { CounterfactualForm } from "@/components/evidence/CounterfactualForm"
import { EvidenceSourcesForm } from "@/components/evidence/EvidenceSourcesForm"
import { JudgmentReport } from "@/components/evidence/JudgmentReport"

function Content() {
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

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <EvidenceNav />
      <main>
        <Content />
      </main>
    </div>
  )
}
