import { MADANProvider } from "@/lib/madan/store"
import { AgentCouncilPage } from "@/components/madan/AgentCouncilPage"

export default function Page() {
  return (
    <MADANProvider>
      <AgentCouncilPage />
    </MADANProvider>
  )
}
