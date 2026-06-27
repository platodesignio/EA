import type { AuditAgent, AgentId, AgentMessage, AgentStatus, AuditScenario, GenerativeRateScore, MessageType } from "@/types/madan"

export interface NetworkNode {
  id: AgentId
  x: number
  y: number
  status: AgentStatus
  label: string
}

export interface NetworkEdge {
  from: AgentId
  to: AgentId
  type: MessageType
  id: string
}

const NINE_RATES = [
  { key: "IGR", label: "Information Generative Rate" },
  { key: "PDF-GR", label: "Pre-Difference Field Generative Rate" },
  { key: "MGR", label: "Meaning / Truth-Feeling Generative Rate" },
  { key: "D-RGR", label: "Division-of-Labor / Relation Generative Rate" },
  { key: "SRGR", label: "Social Responsibility Generative Rate" },
  { key: "TIGR", label: "Time Generative Rate" },
  { key: "RCR", label: "Return Capacity Rate" },
  { key: "FGR", label: "Freedom Generative Rate" },
  { key: "HGR", label: "Historical Generative Rate" },
]

function systemTypeRiskBias(systemType: string): number {
  const high = ["civic", "welfare", "healthcare"]
  const mid = ["labor", "education", "academic"]
  if (high.includes(systemType)) return -1.5
  if (mid.includes(systemType)) return -0.8
  return -0.3
}

function scoreFromRisks(risks: string, bias: number): number {
  const riskWords = ["bias", "no appeal", "opaque", "locked", "penalize", "exclusion", "surveillance", "discriminat"]
  const hits = riskWords.filter((w) => risks.toLowerCase().includes(w)).length
  const base = 1.5 - hits * 0.6 + bias
  return parseFloat(clampNum(base + (Math.random() * 1.2 - 0.6), -5, 5).toFixed(1))
}

function clampNum(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

export function runAgentAnalysis(agent: AuditAgent, scenario: AuditScenario): Partial<AuditAgent> {
  const bias = systemTypeRiskBias(scenario.systemType)
  const baseScore = scoreFromRisks(scenario.knownRisks, bias)

  const riskFlags: string[] = []
  const scores: Record<string, number> = {}

  if (scenario.reentryMechanism.toLowerCase().includes("no") || scenario.reentryMechanism.toLowerCase().includes("cannot")) {
    riskFlags.push("No effective re-entry pathway")
  }
  if (scenario.knownRisks.toLowerCase().includes("bias")) {
    riskFlags.push("Documented bias in evaluation mechanism")
  }
  if (scenario.evaluationMechanism.toLowerCase().includes("automat")) {
    riskFlags.push("Fully automated consequential decisions")
  }
  if (scenario.dataSources.toLowerCase().includes("historic")) {
    riskFlags.push("Historical data encoding structural inequity")
  }

  const agentOutputs: Record<AgentId, { output: string; scores: Record<string, number>; confidence: number }> = {
    "scenario-parser": {
      output: `Structural decomposition complete. The ${scenario.title} operates across the ${scenario.systemType} domain, targeting ${scenario.targetPopulation.slice(0, 80)}. The evaluation mechanism is ${scenario.evaluationMechanism.slice(0, 100)}. Decision consequences include: ${scenario.decisionConsequences.slice(0, 100)}.`,
      scores: { structuralComplexity: clampNum(3 + bias, 0, 5), layerCount: 4 },
      confidence: 78,
    },
    "measurement-auditor": {
      output: `Measurement audit reveals significant ontological exclusions. The system measures ${scenario.evaluationMechanism.slice(0, 80)} while treating as non-existent: contextual factors, structural barriers, and the lived experience of ${scenario.targetPopulation.slice(0, 60)}. Data sources (${scenario.dataSources.slice(0, 60)}) encode historical patterns of exclusion.`,
      scores: { measurementValidity: clampNum(baseScore - 0.5, -5, 5), exclusionIndex: clampNum(3 + bias * -0.8, 0, 5) },
      confidence: 82,
    },
    "transgression-auditor": {
      output: `Category violations detected. The system applies ${scenario.systemType === "healthcare" || scenario.systemType === "labor" ? "biological or behavioral" : "institutional"} metrics to draw conclusions that operate at the sociological and biographical level. The evaluation mechanism confuses measurement validity for ontological status — a category transgression that naturalizes social outcomes as individual properties.`,
      scores: { transgressionSeverity: clampNum(3.2 + bias, 0, 5), categoryViolations: riskFlags.length },
      confidence: 75,
    },
    "reachable-state-auditor": {
      output: `R(x) impact assessment: the ${scenario.title} substantially contracts the reachable state space for ${scenario.targetPopulation.slice(0, 80)}. Decision consequences (${scenario.decisionConsequences.slice(0, 100)}) create path-dependent closures that persist beyond the immediate evaluation moment. Re-entry mechanism quality is critically low.`,
      scores: { futureClosureRisk: clampNum(4 + bias * -1, 0, 5), reachableStateImpact: clampNum(baseScore - 1, -5, 5) },
      confidence: 80,
    },
    "nine-rates-auditor": {
      output: `Full nine-rate profile generated. IGR is suppressed by information opacity in ${scenario.evaluationMechanism.slice(0, 60)}. FGR shows strong negative values due to documented decision consequences. RCR is critically compromised by re-entry barriers.`,
      scores: Object.fromEntries(NINE_RATES.map((r) => [r.key, parseFloat(clampNum(baseScore + (Math.random() * 2 - 1), -5, 5).toFixed(1))])),
      confidence: 88,
    },
    "reentry-auditor": {
      output: `Re-entry pathway analysis: ${scenario.reentryMechanism}. This mechanism is assessed as ${scenario.reentryMechanism.toLowerCase().includes("no") || scenario.reentryMechanism.toLowerCase().includes("cannot") ? "critically inadequate — no effective structural re-entry exists for those penalized" : "partially functional but structurally burdened on affected individuals rather than the institution"}. Procedural re-entry without substantive re-entry represents a formal right without material efficacy.`,
      scores: { reentryScore: clampNum(baseScore + 1.5, -5, 5), proceduralQuality: clampNum(2 + bias, 0, 5) },
      confidence: 84,
    },
    "body-load-auditor": {
      output: `Body-load assessment: continuous evaluation under ${scenario.title} generates chronic anticipatory stress for ${scenario.targetPopulation.slice(0, 60)}. The behavioral modification incentives embedded in ${scenario.evaluationMechanism.slice(0, 80)} create somatic attrition. Self-censorship, performance fatigue, and identity threat responses are structurally induced.`,
      scores: { bodyLoadRisk: clampNum(3.5 + bias * -0.8, 0, 5), selfCensorshipIndex: clampNum(3 + bias, 0, 5) },
      confidence: 71,
    },
    "institution-fixation-auditor": {
      output: `Ontological reification detected. Scores produced by ${scenario.title} are being treated as facts about the inherent capacity or character of ${scenario.targetPopulation.slice(0, 60)}, rather than as institutional measurements with known limitations. The lack of transparency (${scenario.evaluationMechanism.slice(0, 60)}) prevents subjects from contesting this reification.`,
      scores: { institutionFixationRisk: clampNum(3.8 + bias * -0.5, 0, 5), reificationIndex: clampNum(4 + bias, 0, 5) },
      confidence: 79,
    },
    "genealogy-auditor": {
      output: `Genealogical audit: The core assumptions of ${scenario.title} derive from measurement traditions with well-documented ideological commitments — specifically the conflation of individual quantification with social optimization that emerged from ${scenario.systemType === "academic" || scenario.systemType === "education" ? "psychometric movements of the early 20th century" : scenario.systemType === "labor" ? "scientific management traditions and Taylorist labor discipline" : "actuarial and risk management traditions serving capital accumulation"}. These lineages carry normative commitments that are invisible within the system's self-presentation as neutral measurement.`,
      scores: { historicalBias: clampNum(3.5 + bias, 0, 5), ideologicalTransparency: clampNum(1 + bias * -1, 0, 5) },
      confidence: 76,
    },
    "red-team-auditor": {
      output: `Red team findings: The claim that ${scenario.evaluationMechanism.slice(0, 80)} constitutes valid measurement of ${scenario.targetPopulation.split(",")[0]}'s relevant capacities is UNSUBSTANTIATED. Training data provenance is insufficient to support causal claims. The desired future direction (${scenario.desiredFutureDirection.slice(0, 80)}) is achievable but requires structural rather than technical reform. Advocates of this system would claim predictive validity — this claim requires independent replication in conditions matching actual deployment populations.`,
      scores: { evidenceStrength: clampNum(1.5 + bias, 0, 5), overclaiming: clampNum(3.5 + bias * -0.5, 0, 5) },
      confidence: 91,
    },
    "synthesis-agent": {
      output: `Synthesis: The agent council converges on three structural findings about ${scenario.title}: (1) The measurement form encodes exclusions that are invisible to its own evaluation criteria; (2) Re-entry pathways are procedurally present but materially insufficient; (3) The system's design choices disproportionately allocate risk to ${scenario.targetPopulation.slice(0, 60)} while concentrating decision authority at the institutional level. Substantive disagreements remain between the nine-rates assessment and the red-team's evidentiary challenges.`,
      scores: { synthesisCoherence: 4.2, contradictionsResolved: 3 },
      confidence: 85,
    },
    "ddat-judge": {
      output: `DDAT Judgment on ${scenario.title}: Based on the full council audit, this system is assessed as generating a net negative impact on the reachable futures of ${scenario.targetPopulation.slice(0, 60)}. The absence of adequate re-entry mechanisms, the documented measurement biases, and the ontological reification of institutional scores are structural features, not implementation errors. Remediation requires institutional redesign, not parameter adjustment. Directional verdict pending DCR calculation.`,
      scores: { judgmentConfidence: 87 },
      confidence: 87,
    },
  }

  const agentData = agentOutputs[agent.id]

  return {
    status: "completed" as AgentStatus,
    confidence: agentData.confidence,
    riskFlags: agent.id === "red-team-auditor" || agent.id === "measurement-auditor" ? riskFlags : riskFlags.slice(0, 2),
    scores: { ...scores, ...agentData.scores },
    analysisOutput: agentData.output,
  }
}

const MESSAGE_TEMPLATES: Record<AgentId, Record<string, string>> = {
  "scenario-parser": {
    analysis: "Structural decomposition identifies {pop} as the primary affected population with {mech} as the core evaluation pathway. The system architecture reveals {count} distinct decision layers, each with independent failure modes.",
    question: "To complete structural decomposition: what oversight mechanisms exist between the automated scoring output and the final decision binding on {pop}?",
  },
  "measurement-auditor": {
    critique: "The measurement form in {title} treats {mech} as a valid proxy for {target} but this conflates measurable behavioral output with the underlying capacity being claimed to evaluate. This is a measurement-validity violation.",
    "evidence-request": "What validation studies exist for {mech} when applied to {pop}? Specifically: validation against outcomes relevant to {target}, not internal consistency metrics.",
  },
  "transgression-auditor": {
    contradiction: "{title} applies {sysType}-domain metrics to generate conclusions that operate at the individual biographical level. This cross-layer transgression naturalizes structural outcomes as individual deficits — a category error with material consequences.",
    critique: "The evaluation mechanism imports assumptions from {sysType} science into a social-decision context without epistemic justification. Each layer boundary crossed without warrant amplifies measurement error.",
  },
  "reachable-state-auditor": {
    analysis: "R(x) modeling for {pop}: the decision consequences described create at minimum {count} category of future-state closure that compounds over time. Re-entry mechanisms as described are insufficient to restore the contracted reachable state space.",
    critique: "Future-closure risk is not merely a feature of bad outcomes — it is structurally embedded in the evaluation design. Even 'correct' scores under this system reduce R(x) by locking in a single institutional assessment of an individual's possibilities.",
  },
  "nine-rates-auditor": {
    analysis: "Nine-rate profile: FGR is negative due to documented consequences constraining behavioral autonomy. IGR is suppressed by measurement opacity. RCR requires urgent attention given re-entry pathway inadequacy in {title}.",
    synthesis: "Integrating rate scores: the weakest rates are RCR (-{score}) and FGR (-{score2}), suggesting that the system is most damaging precisely where recovery and future-orientation capacity are most needed.",
  },
  "reentry-auditor": {
    critique: "The re-entry mechanism as described places the full burden of contesting institutional error on {pop}. This is an asymmetric accountability structure: the institution scores, the individual must disprove. This is not re-entry — it is procedural theater.",
    question: "Does any mechanism exist for the system itself to flag and review cases where its outputs may have been erroneous? Or is error-detection entirely dependent on individual challenge capacity?",
  },
  "body-load-auditor": {
    analysis: "Chronic evaluation exposure in {title} generates somatic and cognitive costs that are not measured by the evaluation system itself. The body-load from anticipatory compliance behavior, identity threat responses, and self-censorship constitutes a hidden tax on {pop}.",
    evidence: "Body-load effects are documented in analogous systems: continuous assessment environments produce measurable increases in cortisol, reduced creative risk-taking, and increased self-suppression of authentic expression. These costs are externalized onto individuals.",
  },
  "institution-fixation-auditor": {
    critique: "Scores produced by {title} have migrated from instrumental tool to ontological descriptor. When {pop} are described as 'low-scoring' rather than 'scored low by this system,' reification is complete. This migration is irreversible without explicit institutional intervention.",
    contradiction: "The system's defenders cannot simultaneously claim that scores are objective measurements AND that individual circumstances explain score variation. These positions are mutually exclusive within a single epistemic frame.",
  },
  "genealogy-auditor": {
    analysis: "The intellectual genealogy of {title} traces to {lineage}. These origins embed normative commitments that are invisible within the system's self-presentation as technical measurement. The question of whose interests were served by the original framework remains unasked within the system's design logic.",
    "evidence-request": "What is the documented institutional history of the scoring criteria development? Were affected populations included in design? Were dissenting researchers consulted or marginalized in the development process?",
  },
  "red-team-auditor": {
    critique: "CHALLENGE: The claim that {mech} predicts {target} with sufficient validity to justify binding decisions on {pop} is unsubstantiated at the required evidentiary standard. Predictive validity studies, if they exist, must be replicated in deployment conditions.",
    contradiction: "The efficiency argument for {title} assumes that current outcomes without the system are worse. This counterfactual is never tested. The comparison class is always the system vs. nothing — never the system vs. better-designed alternatives.",
  },
  "synthesis-agent": {
    synthesis: "Synthesizing agent council outputs: convergence on three findings — measurement exclusion, re-entry inadequacy, and ontological reification. Remaining disagreement between red-team evidentiary challenge and nine-rates assessment is productive tension requiring further audit rather than resolution.",
    analysis: "The audit reveals a system architecture where individual technical fixes cannot address structural problems. The council recommends against treating this as a calibration problem.",
  },
  "ddat-judge": {
    judgment: "Preliminary judgment: {title} presents as a technical measurement system while functioning as a structural sorting mechanism that allocates futures to {pop} based on metrics that confound measurement validity with social authority. This is an institutional design choice, not a technical inevitability.",
    synthesis: "Final integrative assessment: the weight of agent council evidence supports a Freedom-Closing directional verdict unless structural redesign conditions specified in the synthesis are implemented prior to continued deployment.",
  },
}

export function generateAgentMessage(
  fromAgent: AuditAgent,
  toAgentId: AgentId | "all",
  type: MessageType,
  scenario: AuditScenario
): AgentMessage {
  const templates = MESSAGE_TEMPLATES[fromAgent.id]
  const templateKey = Object.keys(templates).find((k) => k === type) ?? Object.keys(templates)[0]
  const template = templates[templateKey] ?? templates[Object.keys(templates)[0]]

  const lineage =
    scenario.systemType === "academic" || scenario.systemType === "education"
      ? "psychometric movements of the early 20th century"
      : scenario.systemType === "labor"
      ? "scientific management and Taylorist labor discipline"
      : scenario.systemType === "healthcare"
      ? "actuarial risk traditions serving insurance capital"
      : "technocratic governance frameworks of the 1990s"

  const content = template
    .replace(/{title}/g, scenario.title)
    .replace(/{pop}/g, scenario.targetPopulation.split(",")[0].trim().slice(0, 50))
    .replace(/{mech}/g, scenario.evaluationMechanism.slice(0, 70))
    .replace(/{target}/g, scenario.targetPopulation.slice(0, 50))
    .replace(/{sysType}/g, scenario.systemType)
    .replace(/{count}/g, String(Math.floor(Math.random() * 3) + 2))
    .replace(/{score}/g, (Math.random() * 2 + 1).toFixed(1))
    .replace(/{score2}/g, (Math.random() * 2 + 1).toFixed(1))
    .replace(/{lineage}/g, lineage)

  const isContradiction = type === "contradiction" || (type === "critique" && Math.random() > 0.6)
  const metrics = ["IGR", "FGR", "RCR", "SRGR", "MGR", "futureClosureRisk", "bodyLoadRisk", "reentryScore"]
  const referencedMetric = Math.random() > 0.5 ? metrics[Math.floor(Math.random() * metrics.length)] : undefined

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    fromAgent: fromAgent.id,
    toAgent: toAgentId,
    type,
    content,
    referencedMetric,
    isContradiction,
    timestamp: Date.now(),
  }
}

export function calculateNineRates(agentOutputs: AuditAgent[], scenario: AuditScenario): GenerativeRateScore[] {
  const nineRatesAgent = agentOutputs.find((a) => a.id === "nine-rates-auditor")
  const bias = systemTypeRiskBias(scenario.systemType)

  return NINE_RATES.map((rate) => {
    const agentScore = nineRatesAgent?.scores[rate.key]
    const score =
      typeof agentScore === "number"
        ? agentScore
        : parseFloat(clampNum(bias + (Math.random() * 3 - 1.5), -5, 5).toFixed(1))

    const rationale = generateRateRationale(rate.key, score, scenario)
    const riskTag = score < -1.5 ? "High Risk" : score < 0 ? "Elevated Risk" : undefined

    return {
      key: rate.key,
      label: rate.label,
      score,
      rationale,
      riskTag,
    }
  })
}

function generateRateRationale(key: string, score: number, scenario: AuditScenario): string {
  const pop = scenario.targetPopulation.split(",")[0].trim().slice(0, 40)
  const rationales: Record<string, string> = {
    IGR: `Information flow within ${scenario.title} is ${score < 0 ? "suppressed" : "present but constrained"} — ${pop} lack access to scoring rationale, preventing informed response or adaptation.`,
    "PDF-GR": `The pre-difference field for ${pop} is ${score < 0 ? "narrowed" : "partially preserved"} — the evaluation mechanism ${score < 0 ? "forecloses" : "partially constrains"} the space of possible differences before they can emerge.`,
    MGR: `Meaning-generation for ${pop} is ${score < 0 ? "distorted" : "partially intact"} — the scoring system ${score < 0 ? "replaces self-authored meaning with institutional attribution" : "creates tension between self-understanding and institutional assessment"}.`,
    "D-RGR": `Division of labor relations are ${score < 0 ? "worsened" : "ambiguously affected"} — ${scenario.title} ${score < 0 ? "entrenches existing hierarchies" : "creates new stratifications"} that persist beyond the evaluation moment.`,
    SRGR: `Social responsibility generation is ${score < 0 ? "undermined" : "weakly present"} — the system ${score < 0 ? "shifts accountability to individuals while institutional actors bear no analogous scoring burden" : "creates asymmetric accountability"}.`,
    TIGR: `Temporal generativity for ${pop} is ${score < 0 ? "sharply reduced" : "constrained"} — ${score < 0 ? "long-term planning horizons are disrupted by score-dependent futures" : "uncertainty about score trajectories limits forward planning"}.`,
    RCR: `Return capacity is ${score < -1 ? "critically compromised" : score < 0 ? "reduced" : "marginally present"} — re-entry pathways as described ${score < 0 ? "are procedurally present but materially insufficient" : "offer limited but real recovery options"}.`,
    FGR: `Freedom generation is ${score < -2 ? "severely negative" : score < 0 ? "negative" : "constrained"} — decision consequences (${scenario.decisionConsequences.slice(0, 60)}) ${score < 0 ? "reduce autonomous choice space" : "create compliance pressure"}.`,
    HGR: `Historical generativity is ${score < 0 ? "blocked" : "partially available"} — the system ${score < 0 ? "severs affected individuals from accumulated historical capacities and community knowledge" : "partially preserves historical knowledge but constrains its application"}.`,
  }
  return rationales[key] ?? `${key} score of ${score} reflects the system's overall impact on affected populations.`
}

const AGENT_POSITIONS: Record<AgentId, { x: number; y: number }> = {
  "scenario-parser": { x: 300, y: 100 },
  "measurement-auditor": { x: 450, y: 140 },
  "transgression-auditor": { x: 540, y: 250 },
  "reachable-state-auditor": { x: 520, y: 380 },
  "nine-rates-auditor": { x: 420, y: 470 },
  "reentry-auditor": { x: 300, y: 510 },
  "body-load-auditor": { x: 180, y: 470 },
  "institution-fixation-auditor": { x: 80, y: 380 },
  "genealogy-auditor": { x: 60, y: 250 },
  "red-team-auditor": { x: 150, y: 140 },
  "synthesis-agent": { x: 300, y: 280 },
  "ddat-judge": { x: 300, y: 200 },
}

export function buildAgentNetwork(
  agents: AuditAgent[],
  messages: AgentMessage[]
): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  const nodes: NetworkNode[] = agents.map((agent) => ({
    id: agent.id,
    x: AGENT_POSITIONS[agent.id]?.x ?? 300,
    y: AGENT_POSITIONS[agent.id]?.y ?? 280,
    status: agent.status,
    label: agent.name.split(" ")[0],
  }))

  const edges: NetworkEdge[] = messages
    .filter((m) => m.toAgent !== "all")
    .slice(-30)
    .map((m) => ({
      from: m.fromAgent,
      to: m.toAgent as AgentId,
      type: m.type,
      id: m.id,
    }))

  return { nodes, edges }
}

export function generateAgentDisagreements(agents: AuditAgent[]) {
  const pairs: Array<[AgentId, AgentId, string]> = [
    ["red-team-auditor", "nine-rates-auditor", "Evidentiary standard for rate scoring"],
    ["measurement-auditor", "genealogy-auditor", "Whether measurement problems are technical or genealogical"],
    ["reentry-auditor", "institution-fixation-auditor", "Whether re-entry reform is sufficient or structural abolition required"],
    ["body-load-auditor", "synthesis-agent", "Quantifiability of somatic costs in audit framework"],
  ]

  return pairs
    .filter(([a, b]) => {
      const agentA = agents.find((ag) => ag.id === a)
      const agentB = agents.find((ag) => ag.id === b)
      return agentA?.status === "completed" && agentB?.status === "completed"
    })
    .map(([a, b, topic]) => {
      const agentA = agents.find((ag) => ag.id === a)!
      const agentB = agents.find((ag) => ag.id === b)!
      return {
        agentA: a,
        agentB: b,
        topic,
        positionA: agentA.analysisOutput?.slice(0, 120) ?? "Position recorded during audit.",
        positionB: agentB.analysisOutput?.slice(0, 120) ?? "Counter-position recorded during audit.",
        severity: Math.floor(Math.random() * 3) + 2,
      }
    })
}
