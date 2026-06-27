"use client"

import { useStore } from "@/lib/store"
import { TopNav } from "@/components/TopNav"
import { HomeSection } from "@/components/HomeSection"
import { AuditForm } from "@/components/AuditForm"
import { SystemMap } from "@/components/SystemMap"
import { GenerativeRateSliders } from "@/components/GenerativeRateSliders"
import { RiskFlagChecklist } from "@/components/RiskFlagChecklist"
import { SimulationPanel } from "@/components/SimulationPanel"
import { AuditReport } from "@/components/AuditReport"

function Content() {
  const { state } = useStore()
  switch (state.step) {
    case 0: return <HomeSection />
    case 1: return <AuditForm />
    case 2: return <SystemMap />
    case 3: return <GenerativeRateSliders />
    case 4: return <RiskFlagChecklist />
    case 5: return <SimulationPanel />
    case 6: return <AuditReport />
    default: return <HomeSection />
  }
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <TopNav />
      <main>
        <Content />
      </main>
    </div>
  )
}
