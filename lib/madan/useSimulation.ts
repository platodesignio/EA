"use client"

import { useMADAN } from "@/lib/madan/store"
import { runAgentAnalysis, generateAgentMessage, calculateNineRates, generateAgentDisagreements } from "@/lib/madan/engine"
import { calculateMADANDCR, getFinalJudgment } from "@/lib/madan/calculateMADANDCR"
import type { AgentId, AgentMessage, AuditAgent, MessageType } from "@/types/madan"

const AGENT_ORDER: AgentId[] = [
  "scenario-parser",
  "measurement-auditor",
  "transgression-auditor",
  "reachable-state-auditor",
  "nine-rates-auditor",
  "reentry-auditor",
  "body-load-auditor",
  "institution-fixation-auditor",
  "genealogy-auditor",
  "red-team-auditor",
  "synthesis-agent",
  "ddat-judge",
]

const DEBATE_PAIRS: Array<[AgentId, AgentId, MessageType]> = [
  ["measurement-auditor", "nine-rates-auditor", "evidence-request"],
  ["transgression-auditor", "measurement-auditor", "contradiction"],
  ["reachable-state-auditor", "reentry-auditor", "critique"],
  ["body-load-auditor", "institution-fixation-auditor", "analysis"],
  ["genealogy-auditor", "transgression-auditor", "support"],
  ["nine-rates-auditor", "reachable-state-auditor", "synthesis"],
  ["reentry-auditor", "body-load-auditor", "question"],
  ["institution-fixation-auditor", "genealogy-auditor", "evidence-request"],
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useSimulation() {
  const { state, dispatch } = useMADAN()

  async function runSimulation() {
    const { scenario } = state

    // Phase: parsing
    dispatch({ type: "SET_PHASE", payload: "parsing" })
    dispatch({ type: "UPDATE_AGENT", payload: { id: "scenario-parser", update: { status: "analyzing" } } })
    await delay(600)

    const parserResult = runAgentAnalysis(state.agents.find((a) => a.id === "scenario-parser")!, scenario)
    dispatch({ type: "UPDATE_AGENT", payload: { id: "scenario-parser", update: parserResult } })
    const parserMsg = generateAgentMessage(
      { ...state.agents.find((a) => a.id === "scenario-parser")!, ...parserResult },
      "all",
      "analysis",
      scenario
    )
    dispatch({ type: "ADD_MESSAGE", payload: parserMsg })
    await delay(400)

    // Phase: parallel analysis
    dispatch({ type: "SET_PHASE", payload: "parallel-analysis" })

    const analysisAgents = AGENT_ORDER.filter((id) => id !== "scenario-parser" && id !== "synthesis-agent" && id !== "ddat-judge")

    const updatedAgents: AuditAgent[] = [...state.agents]

    for (const agentId of analysisAgents) {
      dispatch({ type: "UPDATE_AGENT", payload: { id: agentId, update: { status: "analyzing" } } })
      await delay(280)

      const agent = state.agents.find((a) => a.id === agentId)!
      const agentResult = runAgentAnalysis(agent, scenario)
      dispatch({ type: "UPDATE_AGENT", payload: { id: agentId, update: agentResult } })

      const updatedAgent = { ...agent, ...agentResult }
      updatedAgents[updatedAgents.findIndex((a) => a.id === agentId)] = updatedAgent

      const msgType: MessageType = agentId === "red-team-auditor" ? "critique" : "analysis"
      const msg = generateAgentMessage(updatedAgent, "all", msgType, scenario)
      dispatch({ type: "ADD_MESSAGE", payload: msg })
      await delay(150)
    }

    // Phase: inter-agent debate
    dispatch({ type: "SET_PHASE", payload: "inter-agent-debate" })

    for (const [fromId, toId, msgType] of DEBATE_PAIRS) {
      const fromAgent = updatedAgents.find((a) => a.id === fromId)
      if (!fromAgent) continue

      dispatch({ type: "UPDATE_AGENT", payload: { id: fromId, update: { status: "replying" } } })
      await delay(200)

      const msg = generateAgentMessage({ ...fromAgent, status: "replying" }, toId, msgType, scenario)
      dispatch({ type: "ADD_MESSAGE", payload: msg })

      dispatch({ type: "UPDATE_AGENT", payload: { id: fromId, update: { status: "completed" } } })
      await delay(160)
    }

    // Phase: red-team
    dispatch({ type: "SET_PHASE", payload: "red-team" })
    dispatch({ type: "UPDATE_AGENT", payload: { id: "red-team-auditor", update: { status: "replying" } } })
    await delay(500)

    const rtAgent = updatedAgents.find((a) => a.id === "red-team-auditor")!
    const rtMsg1 = generateAgentMessage({ ...rtAgent, status: "replying" }, "nine-rates-auditor", "contradiction", scenario)
    dispatch({ type: "ADD_MESSAGE", payload: rtMsg1 })
    await delay(250)

    const rtMsg2 = generateAgentMessage({ ...rtAgent, status: "replying" }, "synthesis-agent", "critique", scenario)
    dispatch({ type: "ADD_MESSAGE", payload: rtMsg2 })
    dispatch({ type: "UPDATE_AGENT", payload: { id: "red-team-auditor", update: { status: "completed" } } })
    await delay(300)

    // Phase: synthesis
    dispatch({ type: "SET_PHASE", payload: "synthesis" })
    dispatch({ type: "UPDATE_AGENT", payload: { id: "synthesis-agent", update: { status: "analyzing" } } })
    await delay(400)

    const synthAgent = state.agents.find((a) => a.id === "synthesis-agent")!
    const synthResult = runAgentAnalysis(synthAgent, scenario)
    dispatch({ type: "UPDATE_AGENT", payload: { id: "synthesis-agent", update: synthResult } })

    const synthMsg = generateAgentMessage({ ...synthAgent, ...synthResult }, "all", "synthesis", scenario)
    dispatch({ type: "ADD_MESSAGE", payload: synthMsg })
    await delay(350)

    // Phase: judgment
    dispatch({ type: "SET_PHASE", payload: "judgment" })
    dispatch({ type: "UPDATE_AGENT", payload: { id: "ddat-judge", update: { status: "analyzing" } } })
    await delay(500)

    const judgeAgent = state.agents.find((a) => a.id === "ddat-judge")!
    const judgeResult = runAgentAnalysis(judgeAgent, scenario)
    dispatch({ type: "UPDATE_AGENT", payload: { id: "ddat-judge", update: judgeResult } })

    const allCompletedAgents = updatedAgents.map((a) => {
      if (a.id === "synthesis-agent") return { ...a, ...synthResult }
      if (a.id === "ddat-judge") return { ...a, ...judgeResult }
      return a
    })

    const nineRates = calculateNineRates(allCompletedAgents, scenario)
    const disagreements = generateAgentDisagreements(allCompletedAgents, scenario)

    const rtAuditor = allCompletedAgents.find((a) => a.id === "red-team-auditor")
    const bodyAuditor = allCompletedAgents.find((a) => a.id === "body-load-auditor")
    const instAuditor = allCompletedAgents.find((a) => a.id === "institution-fixation-auditor")
    const transAuditor = allCompletedAgents.find((a) => a.id === "transgression-auditor")
    const rsAuditor = allCompletedAgents.find((a) => a.id === "reachable-state-auditor")
    const reentryAuditor = allCompletedAgents.find((a) => a.id === "reentry-auditor")

    const futureClosureRisk = parseFloat(((rsAuditor?.scores["futureClosureRisk"] ?? 3.0) as number).toFixed(2))
    const institutionFixationRisk = parseFloat(((instAuditor?.scores["institutionFixationRisk"] ?? 3.5) as number).toFixed(2))
    const bodyLoadRisk = parseFloat(((bodyAuditor?.scores["bodyLoadRisk"] ?? 3.0) as number).toFixed(2))
    const transgressionRisk = parseFloat(((transAuditor?.scores["transgressionSeverity"] ?? 2.8) as number).toFixed(2))
    const reentryScore = parseFloat(((reentryAuditor?.scores["reentryScore"] ?? -1.5) as number).toFixed(2))
    const reachableStateImpact = parseFloat(((rsAuditor?.scores["reachableStateImpact"] ?? -2.0) as number).toFixed(2))

    const riskInputs = { nineRates, reentryScore, bodyLoadRisk, institutionFixationRisk, transgressionRisk, futureClosureRisk }
    const dcr = parseFloat(calculateMADANDCR(riskInputs).toFixed(2))
    const finalJudgment = getFinalJudgment(dcr)

    const judgeMsg = generateAgentMessage({ ...judgeAgent, ...judgeResult }, "all", "judgment", scenario)
    dispatch({ type: "ADD_MESSAGE", payload: judgeMsg })

    const mainContradictions = [
      `The evaluation mechanism (${scenario.evaluationMechanism.slice(0, 70)}...) is claimed to be objective but embeds historical bias from its training data.`,
      `Re-entry is procedurally available but materially inaccessible to the populations most affected by low scores.`,
      `The system's efficiency justification cannot be sustained against documented disparate impact on ${scenario.targetPopulation.split(",")[0]}.`,
      `Measurement validity has been conflated with ontological status — scores describe institutional outputs, not individual capacities.`,
    ]

    const reentryConditions = [
      `All score-based decisions must include written rationale accessible to the affected individual.`,
      `Re-entry pathways must be funded by the institution, not the individual being evaluated.`,
      `Independent appeals bodies with binding authority must be established before continued deployment.`,
      `Scores must be time-limited and subject to mandatory periodic reassessment with changed circumstances accounted for.`,
    ]

    const freedomClosureRisks = [
      `Path-dependent future-state closure: low scores at one evaluation point constrain accessible futures across multiple subsequent decision domains.`,
      `Reification risk: institutional scores migrate from measurement tools to identity descriptors within administrative and social discourse.`,
      `Self-censorship and behavioral modification: chronic anticipatory evaluation pressure reshapes behavior away from authentic expression.`,
      `Compound exclusion: populations already disadvantaged by prior structural conditions receive compounded disadvantage through score mechanisms.`,
    ]

    const designCorrections = [
      scenario.desiredFutureDirection.slice(0, 150),
      `Mandate third-party bias auditing with demographic disaggregation before any further deployment.`,
      `Replace binary scoring outputs with structured human review supported by algorithmic tools, not replaced by them.`,
      `Establish participatory governance structures that include affected populations in ongoing design and revision.`,
    ]

    dispatch({
      type: "SET_RESULT",
      payload: {
        nineRates,
        dcr,
        finalJudgment,
        reentryScore,
        bodyLoadRisk,
        institutionFixationRisk,
        transgressionRisk,
        futureClosureRisk,
        reachableStateImpact,
        mainContradictions,
        reentryConditions,
        freedomClosureRisks,
        designCorrections,
        agentDisagreements: disagreements,
      },
    })

    await delay(300)
    dispatch({ type: "SET_PHASE", payload: "complete" })
  }

  const isRunning = state.phase !== "input" && state.phase !== "complete"

  return { runSimulation, isRunning }
}
