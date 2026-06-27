export type AgentId =
  | "scenario-parser"
  | "measurement-auditor"
  | "transgression-auditor"
  | "reachable-state-auditor"
  | "nine-rates-auditor"
  | "reentry-auditor"
  | "body-load-auditor"
  | "institution-fixation-auditor"
  | "genealogy-auditor"
  | "red-team-auditor"
  | "synthesis-agent"
  | "ddat-judge"

export type AgentStatus = "idle" | "analyzing" | "replying" | "completed"

export type MessageType =
  | "question"
  | "critique"
  | "support"
  | "evidence-request"
  | "synthesis"
  | "contradiction"
  | "analysis"
  | "judgment"

export type SimulationPhase =
  | "input"
  | "parsing"
  | "parallel-analysis"
  | "inter-agent-debate"
  | "red-team"
  | "synthesis"
  | "judgment"
  | "complete"

export type AuditAgent = {
  id: AgentId
  name: string
  role: string
  description: string
  status: AgentStatus
  confidence: number
  riskFlags: string[]
  messages: AgentMessage[]
  scores: Record<string, number>
  analysisOutput?: string
}

export type AgentMessage = {
  id: string
  fromAgent: AgentId
  toAgent: AgentId | "all"
  type: MessageType
  content: string
  referencedMetric?: string
  isContradiction: boolean
  timestamp: number
}

export type AuditScenario = {
  title: string
  systemType: string
  description: string
  targetPopulation: string
  evaluationMechanism: string
  dataSources: string
  decisionConsequences: string
  reentryMechanism: string
  knownRisks: string
  desiredFutureDirection: string
}

export type GenerativeRateScore = {
  key: string
  label: string
  score: number
  rationale: string
  riskTag?: string
}

export type AuditResult = {
  nineRates: GenerativeRateScore[]
  dcr: number
  finalJudgment: string
  reentryScore: number
  bodyLoadRisk: number
  institutionFixationRisk: number
  transgressionRisk: number
  futureClosureRisk: number
  reachableStateImpact: number
  mainContradictions: string[]
  reentryConditions: string[]
  freedomClosureRisks: string[]
  designCorrections: string[]
  agentDisagreements: AgentDisagreement[]
}

export type AgentDisagreement = {
  agentA: AgentId
  agentB: AgentId
  topic: string
  positionA: string
  positionB: string
  severity: number
}

export type MADANState = {
  scenario: AuditScenario
  phase: SimulationPhase
  agents: AuditAgent[]
  messages: AgentMessage[]
  result: AuditResult | null
  activeAgentId: AgentId | null
  selectedEdge: [AgentId, AgentId] | null
}
