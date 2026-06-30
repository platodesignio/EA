import type {
  AuditAgent,
  AgentId,
  AgentMessage,
  AgentStatus,
  AuditScenario,
  GenerativeRateScore,
  AgentDisagreement,
} from "@/types/madan"

// ─── Network types ────────────────────────────────────────────────────────────

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
  type: AgentMessage["type"]
  id: string
}

// ─── Nine rate definitions ────────────────────────────────────────────────────

const NINE_RATES = [
  { key: "IGR",    label: "Information Generative Rate" },
  { key: "PDF-GR", label: "Pre-Difference Field Generative Rate" },
  { key: "MGR",    label: "Meaning / Truth-Feeling Generative Rate" },
  { key: "D-RGR",  label: "Division-of-Labor / Relation Generative Rate" },
  { key: "SRGR",   label: "Social Responsibility Generative Rate" },
  { key: "TIGR",   label: "Time Generative Rate" },
  { key: "RCR",    label: "Return Capacity Rate" },
  { key: "FGR",    label: "Freedom Generative Rate" },
  { key: "HGR",    label: "Historical Generative Rate" },
]

// ─── Deterministic signal extraction ─────────────────────────────────────────

interface ScenarioSignals {
  automationLevel: number        // 0–1: fully human → fully automated
  transparencyLevel: number      // 0–1: opaque → fully transparent
  reentryQuality: number         // 0–1: no path → structured appeal
  biasEvidence: number           // 0–1: none documented → extensive
  historicalBias: number         // 0–1: clean → heavily historical
  consequenceSeverity: number    // 0–1: minor → life-altering
  surveillanceLoad: number       // 0–1: none → pervasive
  transgressionSeverity: number  // 0–1: none → severe category crossing
  responsibilityAsymmetry: number // 0–1: symmetric → fully shifted to individual
  vulnerablePopulation: boolean
  appealExists: boolean
  feedbackProvided: boolean
  humanOversight: boolean
}

function countKeywords(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  return keywords.filter((k) => lower.includes(k)).length
}

function norm(count: number, max: number): number {
  return Math.min(1, count / max)
}

function clamp(v: number, min = -5, max = 5): number {
  return Math.min(max, Math.max(min, v))
}

function round1(v: number): number {
  return Math.round(v * 10) / 10
}

export function extractSignals(scenario: AuditScenario): ScenarioSignals {
  const all = [
    scenario.description,
    scenario.evaluationMechanism,
    scenario.dataSources,
    scenario.decisionConsequences,
    scenario.reentryMechanism,
    scenario.knownRisks,
    scenario.targetPopulation,
  ].join(" ")

  // Automation level
  const autoHigh = countKeywords(all, ["automated", "automatic", "no human", "ai scoring", "algorithm decides", "fully automated", "without human"])
  const autoLow = countKeywords(all, ["human review", "human panel", "reviewed by", "human oversight", "committee", "human judgment"])
  const automationLevel = norm(autoHigh, 4) * 0.8 + (1 - norm(autoLow, 4)) * 0.2

  // Transparency
  const opaqueKw = countKeywords(all, ["opaque", "no feedback", "not disclosed", "proprietary", "black box", "not informed", "no explanation", "confidential"])
  const clearKw = countKeywords(all, ["explainable", "transparent", "disclosed", "feedback provided", "reasons given", "open source", "auditable"])
  const transparencyLevel = norm(clearKw, 4) * 0.6 + (1 - norm(opaqueKw, 5)) * 0.4

  // Re-entry quality
  const noEntry = countKeywords(all, ["no appeal", "no mechanism", "cannot contest", "no re-entry", "flagged permanently", "no recourse", "no feedback", "no review"])
  const hasEntry = countKeywords(all, ["may reapply", "can contest", "appeal process", "structured appeal", "independent review", "human override", "right to challenge"])
  const reentryQuality = norm(hasEntry, 4) * 0.7 + (1 - norm(noEntry, 5)) * 0.3

  // Bias evidence
  const biasKw = countKeywords(all, ["bias", "discriminat", "racial", "gender", "disability", "systemic", "disproportion", "unfair", "inequit"])
  const biasEvidence = norm(biasKw, 6)

  // Historical data bias
  const histKw = countKeywords(all, ["historical", "legacy", "past decisions", "prior", "historical data", "past records", "historical hiring", "historical patterns"])
  const historicalBias = norm(histKw, 5)

  // Consequence severity
  const severeKw = countKeywords(all, ["automatic rejection", "denied", "excluded", "terminated", "incarcerated", "deported", "no second chance", "life-altering", "criminal", "benefits denied", "eliminated"])
  const mildKw = countKeywords(all, ["minor", "advisory", "recommendation only", "one factor", "informational"])
  const consequenceSeverity = norm(severeKw, 5) * 0.8 + (1 - norm(mildKw, 3)) * 0.2

  // Surveillance load
  const survKw = countKeywords(all, ["surveillance", "continuous monitoring", "tracked", "behavioral signals", "microexpression", "facial", "biometric", "social media", "location", "keystroke", "constant evaluation"])
  const surveillanceLoad = norm(survKw, 6)

  // Transgression severity (category crossing: using bio/behavioral measures for social decisions)
  const transKw = countKeywords(all, ["facial", "biometric", "genetic", "physiological", "personality test", "speech pattern", "psychological", "biological risk", "brain", "behavioral trait", "microexpression", "dna"])
  const transgressionSeverity = norm(transKw, 5)

  // Responsibility asymmetry (burden on individual vs institution)
  const indivBurden = countKeywords(all, ["individual must", "burden of proof", "must prove", "candidate must", "applicant must", "must contest", "own responsibility", "personal responsibility"])
  const instBurden = countKeywords(all, ["institution must", "system must review", "mandatory audit", "institutional accountability", "provider liable"])
  const responsibilityAsymmetry = norm(indivBurden, 4) * 0.7 + (1 - norm(instBurden, 3)) * 0.3

  // Booleans
  const appealExists = countKeywords(all, ["appeal", "contest", "challenge", "dispute", "review"]) > 0
  const feedbackProvided = countKeywords(all, ["feedback", "explanation", "reason", "rationale", "informed"]) > 0 &&
    countKeywords(all, ["no feedback", "not informed", "no explanation"]) === 0
  const humanOversight = countKeywords(all, ["human review", "human panel", "committee", "human oversight", "staff review"]) > 0
  const vulnerablePopulation = countKeywords(all, [
    "marginalized", "low-income", "disability", "refugee", "undocumented", "minority",
    "indigenous", "non-native", "adhd", "autism", "non-dominant", "caregiving", "non-linear"
  ]) > 0

  return {
    automationLevel, transparencyLevel, reentryQuality, biasEvidence, historicalBias,
    consequenceSeverity, surveillanceLoad, transgressionSeverity, responsibilityAsymmetry,
    vulnerablePopulation, appealExists, feedbackProvided, humanOversight,
  }
}

// ─── Deterministic rate scoring ───────────────────────────────────────────────

function scoreIGR(s: ScenarioSignals): number {
  // Information Generative Rate: transparency, explainability, feedback
  let score = 0
  score += (s.transparencyLevel - 0.5) * 6   // transparency → +3 to -3
  score += s.feedbackProvided ? 1 : -1
  score += s.humanOversight ? 0.5 : -0.5
  score -= s.biasEvidence * 1.5
  return round1(clamp(score))
}

function scorePDFGR(s: ScenarioSignals): number {
  // Pre-Difference Field: space before classification, not already filtered
  let score = 0
  score -= s.automationLevel * 3             // full automation kills pre-diff space
  score -= s.transgressionSeverity * 2.5    // biometric/behavioral narrows pre-diff space
  score += s.transparencyLevel * 1.5
  score -= s.consequenceSeverity * 1.0
  return round1(clamp(score))
}

function scoreMGR(s: ScenarioSignals): number {
  // Meaning / Truth-Feeling: can subjects author their own meaning?
  let score = 0
  score -= s.automationLevel * 2
  score -= s.biasEvidence * 2
  score += s.feedbackProvided ? 1.5 : -1.5
  score -= s.surveillanceLoad * 1.5          // surveillance replaces self-meaning with performance
  score += s.humanOversight ? 0.5 : 0
  return round1(clamp(score))
}

function scoreDRGR(s: ScenarioSignals): number {
  // Division-of-Labor / Relation: cooperative relations, shared roles
  let score = 0
  score -= s.automationLevel * 2.5           // automation displaces relational work
  score -= s.responsibilityAsymmetry * 2.5
  score += s.humanOversight ? 1.5 : -0.5
  score -= s.consequenceSeverity * 0.5
  return round1(clamp(score))
}

function scoreSRGR(s: ScenarioSignals): number {
  // Social Responsibility: is responsibility distributed or shifted to individuals?
  let score = 0
  score -= s.responsibilityAsymmetry * 4    // primary driver
  score -= s.biasEvidence * 1.5
  score += s.appealExists ? 0.5 : -1
  score -= s.consequenceSeverity * 0.5
  score += s.humanOversight ? 0.5 : -0.5
  return round1(clamp(score))
}

function scoreTIGR(s: ScenarioSignals): number {
  // Time Generative Rate: trial-and-error, recovery, maturation time
  let score = 0
  score -= s.consequenceSeverity * 2.5      // severe consequences compress time horizons
  score += (s.reentryQuality - 0.5) * 3
  score -= s.historicalBias * 1.5           // past locks in future
  score -= s.automationLevel * 0.5
  return round1(clamp(score))
}

function scoreRCR(s: ScenarioSignals): number {
  // Return Capacity Rate: can subjects re-enter after failure?
  let score = 0
  score += (s.reentryQuality - 0.5) * 8    // primary driver: re-entry mechanism quality
  score += s.appealExists ? 1 : -2
  score -= s.biasEvidence * 1.0
  score -= s.consequenceSeverity * 0.5
  return round1(clamp(score))
}

function scoreFGR(s: ScenarioSignals): number {
  // Freedom Generative Rate: autonomy, choice space, behavioral freedom
  let score = 0
  score -= s.consequenceSeverity * 3        // primary driver: consequences reduce freedom
  score -= s.surveillanceLoad * 2
  score -= s.automationLevel * 1.0
  score += s.humanOversight ? 0.5 : 0
  score += (s.transparencyLevel - 0.5) * 1
  score -= s.vulnerablePopulation ? 0.5 : 0
  return round1(clamp(score))
}

function scoreHGR(s: ScenarioSignals): number {
  // Historical Generative Rate: corrects structural past damage, opens futures
  let score = 0
  score -= s.historicalBias * 4             // primary driver: historical data encodes past damage
  score -= s.biasEvidence * 2
  score += s.transparencyLevel * 0.5
  score -= s.vulnerablePopulation ? 1 : 0  // vulnerable pops carry more historical damage
  return round1(clamp(score))
}

const RATE_SCORERS: Record<string, (s: ScenarioSignals) => number> = {
  "IGR":    scoreIGR,
  "PDF-GR": scorePDFGR,
  "MGR":    scoreMGR,
  "D-RGR":  scoreDRGR,
  "SRGR":   scoreSRGR,
  "TIGR":   scoreTIGR,
  "RCR":    scoreRCR,
  "FGR":    scoreFGR,
  "HGR":    scoreHGR,
}

// ─── Rate rationale ───────────────────────────────────────────────────────────

function rateRationale(key: string, score: number, s: ScenarioSignals, scenario: AuditScenario): string {
  const pop = scenario.targetPopulation.split(",")[0].trim().slice(0, 50)
  const mech = scenario.evaluationMechanism.slice(0, 80)

  const pos = score >= 0
  switch (key) {
    case "IGR":
      return s.transparencyLevel < 0.3
        ? `Scoring rationale is not disclosed to ${pop}. The mechanism (${mech}) operates as a black box, preventing informed response or challenge.`
        : s.feedbackProvided
        ? `Feedback provision partially supports information flow. However, proprietary data inputs limit full verification by affected populations.`
        : `Information generation is constrained by the absence of feedback mechanisms. ${pop} cannot access scoring rationale or data used.`
    case "PDF-GR":
      return s.automationLevel > 0.7
        ? `High automation level pre-classifies ${pop} before human judgment can operate. The pre-difference field — possibilities before assessment — is structurally narrowed by the evaluation pipeline.`
        : s.transgressionSeverity > 0.5
        ? `Biometric and behavioral measures applied to ${pop} collapse the pre-difference space by treating as already-differentiated what is contingent and open.`
        : `The evaluation mechanism partially preserves pre-difference space but standardization constrains emergent difference among ${pop}.`
    case "MGR":
      return s.surveillanceLoad > 0.5
        ? `Continuous behavioral monitoring replaces ${pop}'s self-authored meaning with compliance performance. Authentic expression is suppressed by evaluation pressure.`
        : !s.feedbackProvided
        ? `Absence of feedback denies ${pop} any interpretive frame for their scores. Meaning is assigned institutionally rather than co-generated.`
        : `Meaning generation is partially present through feedback mechanisms, but score authority remains institutionally located rather than contestable.`
    case "D-RGR":
      return s.responsibilityAsymmetry > 0.6
        ? `Decision authority is concentrated in the evaluation institution while ${pop} bear the burden of consequence. This asymmetric structure does not generate division-of-labor relations — it reinforces hierarchy.`
        : s.automationLevel > 0.7
        ? `Automated processing displaces the relational work of assessment. Collaborative evaluation structures are replaced by algorithmic classification.`
        : `Human oversight elements support relational structure, but institutional-individual accountability gaps persist.`
    case "SRGR":
      return s.responsibilityAsymmetry > 0.6
        ? `The system places the entire burden of contesting errors on ${pop}. The institution bears no analogous scoring burden. Social responsibility generation is blocked by this asymmetric accountability structure.`
        : s.biasEvidence > 0.4
        ? `Documented bias evidence (${scenario.knownRisks.slice(0, 60)}) indicates that social responsibility has not been structurally implemented in system design.`
        : `Social responsibility generation is limited. Individual-level consequences exist without commensurate institutional accountability mechanisms.`
    case "TIGR":
      return s.reentryQuality < 0.3
        ? `Re-entry pathways as described are inadequate. ${pop} who receive adverse outcomes cannot recover their temporal position — the time for trial, failure, and re-learning is foreclosed.`
        : s.consequenceSeverity > 0.6
        ? `Severe decision consequences (${scenario.decisionConsequences.slice(0, 70)}) compress time horizons for ${pop}, eliminating the developmental time needed for maturation and recovery.`
        : `Time generative capacity is partially available but constrained by path-dependent scoring effects and limited re-entry flexibility.`
    case "RCR":
      return s.reentryQuality < 0.3
        ? `Return capacity is critically compromised. The re-entry mechanism as described — "${scenario.reentryMechanism.slice(0, 80)}" — does not constitute genuine re-entry. It is procedural formality without material efficacy.`
        : s.appealExists
        ? `An appeal mechanism exists but its structural adequacy is constrained by: absence of independent review, placement of evidence burden on ${pop}, and lack of binding obligation on the institution.`
        : `No effective appeal or return mechanism is identified. ${pop} who receive adverse decisions have no institutional pathway for restoration.`
    case "FGR":
      return s.consequenceSeverity > 0.7
        ? `Decision consequences — "${scenario.decisionConsequences.slice(0, 80)}" — substantially reduce the behavioral autonomy and life-choice space of ${pop}. Freedom generation is negative: the system closes more options than it opens.`
        : s.surveillanceLoad > 0.5
        ? `Pervasive monitoring creates compliance pressure that substitutes for genuine freedom. ${pop} modify behavior to optimize scores rather than pursue authentic life directions.`
        : `Freedom generation is constrained but not abolished. Limited choice preservation exists within the system's evaluation scope.`
    case "HGR":
      return s.historicalBias > 0.5
        ? `The data sources (${scenario.dataSources.slice(0, 80)}) encode historical patterns of exclusion. Training on historical decisions perpetuates structural inequities rather than correcting them. Historical generativity is negative.`
        : s.biasEvidence > 0.5
        ? `Documented bias evidence indicates that the system's outputs reflect historical structural damage to ${pop} rather than current potential. HGR is reduced by this perpetuation.`
        : s.vulnerablePopulation
        ? `${pop} carry accumulated historical disadvantage. The system's current design does not include mechanisms to compensate for differential historical starting conditions.`
        : `Historical generativity is partially present. The system does not explicitly correct for structural historical disadvantages affecting its target population.`
    default:
      return `Score of ${score} reflects ${scenario.title}'s impact on this generative rate.`
  }
}

// ─── Agent analysis ───────────────────────────────────────────────────────────

function extractRiskFlags(s: ScenarioSignals, scenario: AuditScenario): string[] {
  const flags: string[] = []
  if (s.automationLevel > 0.7)           flags.push("Fully automated consequential decisions")
  if (s.reentryQuality < 0.25)           flags.push("No effective re-entry pathway")
  if (s.biasEvidence > 0.4)             flags.push("Documented bias in evaluation mechanism")
  if (s.historicalBias > 0.5)           flags.push("Historical data encoding structural inequity")
  if (s.transgressionSeverity > 0.4)    flags.push("Cross-layer category transgression (biometric → social)")
  if (s.surveillanceLoad > 0.5)         flags.push("Pervasive surveillance load on affected population")
  if (s.responsibilityAsymmetry > 0.6)  flags.push("Responsibility asymmetry: burden shifted to individuals")
  if (!s.appealExists)                   flags.push("Absence of appeal mechanism")
  if (!s.feedbackProvided)              flags.push("No scoring feedback to affected subjects")
  if (s.vulnerablePopulation && s.biasEvidence > 0.3) flags.push("Vulnerable population with documented bias exposure")
  if (scenario.dataSources.toLowerCase().includes("proprietary")) flags.push("Proprietary data sources — not independently verifiable")
  return flags
}

const AGENT_ANALYSIS_BUILDERS: Record<AgentId, (s: ScenarioSignals, scenario: AuditScenario, flags: string[]) => string> = {
  "scenario-parser": (s, sc) =>
    `Structural decomposition of "${sc.title}": System type — ${sc.systemType}. Target population — ${sc.targetPopulation.slice(0, 100)}. The evaluation mechanism is "${sc.evaluationMechanism.slice(0, 120)}". Decision consequences: "${sc.decisionConsequences.slice(0, 120)}". Automation level detected: ${Math.round(s.automationLevel * 100)}%. Transparency level: ${Math.round(s.transparencyLevel * 100)}%. Re-entry quality index: ${Math.round(s.reentryQuality * 100)}%.`,

  "measurement-auditor": (s, sc) =>
    `Measurement-form audit: The system measures "${sc.evaluationMechanism.slice(0, 100)}" while treating as non-existent: contextual barriers, structural starting-condition differences, and the situated experience of ${sc.targetPopulation.slice(0, 60)}. Data sources (${sc.dataSources.slice(0, 80)}) ${s.historicalBias > 0.4 ? "encode historical exclusion patterns" : "contain implicit selection biases"}. ${!s.feedbackProvided ? "Critically: subjects cannot access the measurement logic applied to them." : "Feedback mechanisms partially mitigate information asymmetry."} Measurement validity cannot be assumed without independent validation against deployment-population outcomes.`,

  "transgression-auditor": (s, sc) =>
    s.transgressionSeverity > 0.4
      ? `Category transgression CONFIRMED. The system applies ${sc.systemType}-domain metrics including ${sc.evaluationMechanism.toLowerCase().includes("facial") ? "facial/microexpression analysis" : sc.evaluationMechanism.toLowerCase().includes("biometric") ? "biometric assessment" : "behavioral signal extraction"} to generate conclusions that operate at the biographical and social-sorting level. This confuses measurement validity (can we measure X?) with ontological status (does X constitute Y?). The transgression is not correctable by improving measurement accuracy — it is structural to the system's design logic.`
      : `Transgression audit: The system crosses from institutional measurement to social-ontological judgment. "${sc.evaluationMechanism.slice(0, 100)}" produces outputs framed as facts about individuals' inherent capacities rather than as institutional measurements with known limitations and scope conditions. The category violation is: measurement form → biographical conclusion, without the epistemological warrant this move requires.`,

  "reachable-state-auditor": (s, sc) =>
    `R(x) impact assessment for "${sc.title}": The reachable state space for ${sc.targetPopulation.slice(0, 80)} is ${s.consequenceSeverity > 0.6 ? "substantially contracted" : "moderately reduced"}. Decision consequences — "${sc.decisionConsequences.slice(0, 100)}" — create path-dependent closures that compound over time. Re-entry quality index: ${Math.round(s.reentryQuality * 100)}% — ${s.reentryQuality < 0.3 ? "critically inadequate" : s.reentryQuality < 0.6 ? "partially functional" : "present but structurally burdened"}. Estimated reachable-state impact: ${s.consequenceSeverity > 0.6 ? "significant reduction in accessible futures" : "moderate reduction with some preservation of alternatives"}.`,

  "nine-rates-auditor": (s, sc) =>
    `Nine-rate profile for "${sc.title}": Critical rates — RCR: ${Math.round(s.reentryQuality * 10 - 5)} (re-entry), FGR: ${Math.round((1 - s.consequenceSeverity) * 10 - 5)} (freedom), IGR: ${Math.round((s.transparencyLevel - 0.5) * 6)} (information). Structural weaknesses: ${[
      s.automationLevel > 0.6 ? "automation suppresses PDF-GR and MGR" : null,
      s.surveillanceLoad > 0.5 ? "surveillance load depresses FGR and MGR" : null,
      s.responsibilityAsymmetry > 0.5 ? "responsibility asymmetry blocks SRGR" : null,
      s.historicalBias > 0.4 ? "historical data bias inverts HGR" : null,
    ].filter(Boolean).join("; ")}. All nine rates computed deterministically from scenario analysis.`,

  "reentry-auditor": (s, sc) =>
    `Re-entry pathway analysis: "${sc.reentryMechanism}". Assessment: ${
      s.reentryQuality < 0.25
        ? "Critically inadequate. No effective structural re-entry exists. The described mechanism is procedurally formal but materially empty."
        : s.reentryQuality < 0.55
        ? "Partially functional. A mechanism exists but places the full burden of proof and action on the individual, while the institution retains classification authority without analogous accountability."
        : "Present with structural limitations. The mechanism provides formal right of re-entry but requires the individual to navigate institutional barriers without equivalent institutional obligation."
    } ${!s.feedbackProvided ? "Without feedback, individuals cannot identify the grounds for challenge, making re-entry procedurally impossible even where nominally available." : ""}`,

  "body-load-auditor": (s, sc) =>
    `Body-load assessment for "${sc.title}": Chronic evaluation exposure generates somatic and cognitive costs not measured by the system itself. ${s.surveillanceLoad > 0.5 ? `The continuous monitoring environment (${sc.evaluationMechanism.slice(0, 60)}) creates anticipatory stress, self-censorship, and identity threat responses. ` : ""}${s.vulnerablePopulation ? `Vulnerable populations — ${sc.targetPopulation.slice(0, 60)} — carry additional body-load from prior structural damage. ` : ""}Body-load effects are externalized onto individuals while the institution bears no analogous cost. The behavioral modification incentives embedded in the scoring system convert authentic action into compliance performance — a form of invisible labor charged to those evaluated.`,

  "institution-fixation-auditor": (s, sc) =>
    `Institution-fixation audit: Scores produced by "${sc.title}" have ${s.transparencyLevel < 0.4 ? "migrated fully" : "partially migrated"} from instrumental tool to ontological descriptor. When ${sc.targetPopulation.split(",")[0].trim().slice(0, 50)} are described as "low-scoring individuals" rather than "individuals scored low by this particular system with known limitations," reification is complete. ${s.responsibilityAsymmetry > 0.6 ? "The absence of institutional accountability for scores reinforces this reification — the system scores, but is not itself scored for accuracy, fairness, or downstream effects." : ""}  ${!sc.reentryMechanism.toLowerCase().includes("appeal") ? "The absence of a meaningful appeal mechanism makes this ontological status functionally permanent." : ""}`,

  "genealogy-auditor": (_, sc) =>
    `Genealogical audit: The core assumptions of "${sc.title}" connect to ${
      sc.systemType === "academic" || sc.systemType === "education"
        ? "psychometric traditions of the early 20th century (Binet, Spearman, Terman) — a lineage that embedded class, colonial, and ableist assumptions into measurement frameworks subsequently institutionalized as neutral."
        : sc.systemType === "labor"
        ? "scientific management traditions (Taylor, Ford) and actuarial labor-discipline frameworks that reduced workers to measured-output units. The contemporary AI form inherits these efficiency commitments without inheriting their institutional critique."
        : sc.systemType === "healthcare" || sc.systemType === "finance"
        ? "actuarial risk-management traditions developed primarily to serve capital accumulation rather than individual welfare. Risk prediction in this lineage was always simultaneously a mechanism for cost externalization."
        : sc.systemType === "civic" || sc.systemType === "welfare"
        ? "technocratic governance frameworks of the 1990s–2000s that reframed political questions as technical optimization problems, displacing democratic accountability with algorithmic authority."
        : "quantification traditions that embed normative commitments within the appearance of technical neutrality — a recurrent structure across measurement history."
    } These lineages carry normative commitments that are invisible within the system's self-presentation as objective measurement.`,

  "red-team-auditor": (s, sc) =>
    `RED TEAM FINDINGS for "${sc.title}": (1) EVIDENTIARY CHALLENGE — The claim that "${sc.evaluationMechanism.slice(0, 80)}" constitutes valid measurement of the capacities claimed requires independent replication in deployment conditions matching actual affected populations. Validation against historical decisions circularity-validates bias. (2) COUNTERFACTUAL CHALLENGE — Efficiency arguments compare this system against nothing, never against better-designed alternatives. (3) OVERCLAIMING — ${s.transgressionSeverity > 0.3 ? "Biometric/behavioral inputs are used to generate social-sorting conclusions with epistemic reach that exceeds what the measurement form can support." : "The system's claimed predictive reach exceeds what its data sources and mechanism design can epistemically support."} (4) STRUCTURAL CRITIQUE — The desired future direction ("${sc.desiredFutureDirection.slice(0, 80)}") requires institutional redesign, not parameter adjustment.`,

  "synthesis-agent": (s, sc) =>
    `Synthesis: Cross-perspective review converges on three structural findings about "${sc.title}": (1) Measurement exclusion — the system treats as non-existent what it cannot measure, generating a false completeness effect; (2) Re-entry inadequacy — ${s.reentryQuality < 0.4 ? "re-entry pathways are procedurally present but materially empty" : "re-entry pathways exist but shift the burden of institutional error correction entirely onto affected individuals"}; (3) Responsibility asymmetry — ${sc.targetPopulation.slice(0, 60)} bear the costs of system errors while the institution retains classification authority without analogous accountability. The adversarial check and nine-rate evaluation agree on: FGR, SRGR, and RCR as most critically affected rates. Unresolved: whether re-entry reform is sufficient for remediation, or whether structural abolition of automated consequential decision-making is required.`,

  "ddat-judge": (s, sc) =>
    `DDAT Directional Assessment of "${sc.title}": Based on full structured audit, this system generates a net ${s.consequenceSeverity > 0.6 || s.reentryQuality < 0.3 ? "negative" : "ambiguous"} impact on the reachable futures of ${sc.targetPopulation.slice(0, 60)}. Key findings: automation level ${Math.round(s.automationLevel * 100)}%, transparency ${Math.round(s.transparencyLevel * 100)}%, re-entry quality ${Math.round(s.reentryQuality * 100)}%, bias evidence index ${Math.round(s.biasEvidence * 100)}%. ${s.biasEvidence > 0.4 && s.reentryQuality < 0.4 ? "The combination of documented bias and inadequate re-entry constitutes structural closure, not implementation error." : "Remediation conditions exist but require institutional redesign, not calibration."} Directional assessment follows DCR — Directional Correctness Index calculation.`,
}

export function runAgentAnalysis(agent: AuditAgent, scenario: AuditScenario): Partial<AuditAgent> {
  const s = extractSignals(scenario)
  const flags = extractRiskFlags(s, scenario)
  const builder = AGENT_ANALYSIS_BUILDERS[agent.id]
  const analysisOutput = builder ? builder(s, scenario, flags) : `${agent.name} analysis of "${scenario.title}" complete.`

  // Each agent contributes specific scores relevant to their domain
  const scores: Record<string, number> = {}
  if (agent.id === "nine-rates-auditor") {
    for (const rate of NINE_RATES) {
      scores[rate.key] = RATE_SCORERS[rate.key](s)
    }
  } else if (agent.id === "reachable-state-auditor") {
    scores.reachableStateImpact = round1(clamp((s.reentryQuality - 0.5) * 4 - s.consequenceSeverity * 3, -5, 5))
    scores.futureClosureRisk = round1(clamp(s.consequenceSeverity * 4 + (1 - s.reentryQuality) * 1, 0, 5))
  } else if (agent.id === "body-load-auditor") {
    scores.bodyLoadRisk = round1(clamp(s.surveillanceLoad * 4 + (s.vulnerablePopulation ? 1 : 0), 0, 5))
  } else if (agent.id === "institution-fixation-auditor") {
    scores.institutionFixationRisk = round1(clamp((1 - s.transparencyLevel) * 3 + s.responsibilityAsymmetry * 2, 0, 5))
  } else if (agent.id === "transgression-auditor") {
    scores.transgressionRisk = round1(clamp(s.transgressionSeverity * 5, 0, 5))
  } else if (agent.id === "reentry-auditor") {
    scores.reentryScore = round1(clamp((s.reentryQuality - 0.5) * 8, -5, 5))
  }

  // Confidence is also deterministic based on signal clarity
  const signalStrength = (
    Math.abs(s.automationLevel - 0.5) +
    Math.abs(s.transparencyLevel - 0.5) +
    Math.abs(s.reentryQuality - 0.5) +
    Math.abs(s.biasEvidence - 0.5)
  ) / 4

  const baseConfidence: Record<AgentId, number> = {
    "scenario-parser": 78,
    "measurement-auditor": 82,
    "transgression-auditor": 75,
    "reachable-state-auditor": 80,
    "nine-rates-auditor": 88,
    "reentry-auditor": 84,
    "body-load-auditor": 71,
    "institution-fixation-auditor": 79,
    "genealogy-auditor": 76,
    "red-team-auditor": 91,
    "synthesis-agent": 85,
    "ddat-judge": 87,
  }

  const confidence = Math.round(
    clamp(baseConfidence[agent.id] + signalStrength * 12 - (s.biasEvidence > 0.5 ? 3 : 0), 60, 97, )
  )

  const agentFlags = (agent.id === "red-team-auditor" || agent.id === "measurement-auditor")
    ? flags
    : flags.slice(0, 2)

  return {
    status: "completed" as AgentStatus,
    confidence,
    riskFlags: agentFlags,
    scores,
    analysisOutput,
  }
}

// ─── Inter-agent messages ─────────────────────────────────────────────────────

const MESSAGE_TEMPLATES: Partial<Record<AgentId, Record<string, string>>> = {
  "scenario-parser": {
    analysis: "Structural decomposition identifies {pop} as the primary affected population. The evaluation pathway uses {mech}. I count {count} distinct decision layers, each introducing independent failure modes. Flagging for parallel audit.",
    question: "To complete structural decomposition: what oversight mechanisms exist between automated scoring output and the binding decision on {pop}?",
  },
  "measurement-auditor": {
    critique: "The measurement form in {title} treats {mech} as a valid proxy for {target} capacities. This conflates measurable behavioral output with the underlying capacity claimed to be evaluated — a measurement-validity violation that no amount of calibration can correct.",
    "evidence-request": "What validation studies exist for {mech} when applied to {pop}? Required: validation against outcomes relevant to {target}, not internal consistency or historical hiring-decision agreement.",
  },
  "transgression-auditor": {
    contradiction: "{title} applies {sysType}-domain metrics to generate conclusions at the individual biographical and social-sorting level. This cross-layer transgression naturalizes structural outcomes as individual properties — a category error that amplifies with each automated step.",
    critique: "The evaluation mechanism imports assumptions across ontological layers without epistemic warrant. Each layer boundary crossed without justification increases the transgression debt of the system.",
  },
  "reachable-state-auditor": {
    analysis: "R(x) modeling for {pop}: the decision consequences create path-dependent closures that compound over time. I estimate {count} categories of future-state contraction. Re-entry mechanisms as described are insufficient to restore the contracted reachable-state space.",
    critique: "Future-closure risk is embedded in the evaluation design itself, not only in adverse outcomes. Even a 'correct' score under this system reduces R(x) by institutionally fixing a single snapshot assessment as a determining variable for future possibilities.",
  },
  "nine-rates-auditor": {
    analysis: "Nine-rate profile: RCR and FGR are most severely impacted. IGR is suppressed by information opacity in {title}. All scores are computed deterministically from scenario signal analysis — re-run produces identical results.",
    synthesis: "Rates most requiring immediate intervention: RCR (bodily return capacity), FGR (future possibilities), SRGR (institutional responsibility). These three rates co-vary with the re-entry mechanism quality and consequence severity.",
  },
  "reentry-auditor": {
    critique: "The re-entry mechanism places the full burden of contesting institutional error on {pop}. This is asymmetric accountability: the institution scores, the individual must disprove. Procedural re-entry without material re-entry is institutional theater.",
    question: "Does any mechanism exist for the system itself to flag and review cases where its outputs may have been erroneous? Or is error-detection entirely dependent on individual challenge capacity, which requires resources typically unavailable to those most adversely affected?",
  },
  "body-load-auditor": {
    analysis: "Chronic evaluation exposure in {title} generates somatic costs not measured by the system. The behavioral modification incentives in {mech} create self-censorship, anticipatory compliance, and identity-threat responses. These constitute an invisible tax externalized onto {pop}.",
    evidence: "Body-load effects in analogous continuous-assessment environments are documented: elevated chronic stress markers, reduced creative risk-taking, increased self-suppression of authentic expression. These costs are real, compounding, and entirely externalized.",
  },
  "institution-fixation-auditor": {
    critique: "Scores produced by {title} have migrated from instrumental tool to ontological descriptor. When {pop} are described as 'low-scoring' rather than 'scored low by this system with known limitations,' reification is complete. This migration is not correctable by disclosure — it requires structural counteraction.",
    contradiction: "The system's defenders cannot simultaneously claim that scores are objective measurements AND that individual circumstances explain score variation. These positions are mutually exclusive and the contradiction reveals the scores are functioning as social authority, not measurement.",
  },
  "genealogy-auditor": {
    analysis: "The intellectual genealogy of {title} traces to {lineage}. These origins carry normative commitments invisible within the system's self-presentation as technical measurement. The question of whose interests were served by the original framework remains structurally suppressed.",
    "evidence-request": "What is the documented institutional history of the scoring criteria development? Were affected populations included in design consultation? Were dissenting researchers marginalized in the development process?",
  },
  "red-team-auditor": {
    critique: "CHALLENGE: The claim that {mech} predicts {target} capacities with sufficient validity to justify binding decisions on {pop} is unsubstantiated at the required evidentiary standard. Predictive validity studies must be replicated under deployment conditions, not training conditions.",
    contradiction: "The efficiency argument for {title} assumes that current outcomes without the system are worse. This counterfactual is never tested. The comparison class is always 'this system vs. nothing' — never 'this system vs. better-designed alternatives.' This asymmetry is not an oversight; it is structural.",
  },
  "synthesis-agent": {
    synthesis: "Synthesizing audit perspective outputs: convergence on measurement exclusion, re-entry inadequacy, and responsibility asymmetry as structural findings. Productive disagreement between adversarial check and nine-rate evaluation remains unresolved. Recommendation: further audit conditions specified, not verdict closure.",
    analysis: "The audit reveals a system architecture where individual technical fixes cannot address structural problems. This is not a calibration problem.",
  },
  "ddat-judge": {
    judgment: "Preliminary judgment: {title} presents as a technical measurement system while functioning as a structural sorting mechanism allocating futures to {pop} based on metrics that confound measurement validity with social authority. This is a design choice, not a technical inevitability.",
    synthesis: "Final integrative assessment: the weight of structured audit evidence supports a high future-closure risk assessment unless the structural redesign conditions specified in the synthesis report are implemented prior to continued deployment.",
  },
}

export function generateAgentMessage(
  fromAgent: AuditAgent,
  toAgentId: AgentId | "all",
  type: AgentMessage["type"],
  scenario: AuditScenario
): AgentMessage {
  const s = extractSignals(scenario)
  const templates = MESSAGE_TEMPLATES[fromAgent.id] ?? {}
  const templateKey = (Object.keys(templates).find((k) => k === type) ?? Object.keys(templates)[0]) as string
  const template = templates[templateKey] ?? `${fromAgent.name} has completed analysis of ${scenario.title}.`

  const lineage =
    scenario.systemType === "academic" || scenario.systemType === "education"
      ? "psychometric movements of the early 20th century (Binet, Spearman)"
      : scenario.systemType === "labor"
      ? "scientific management and Taylorist labor-discipline traditions"
      : scenario.systemType === "healthcare"
      ? "actuarial risk traditions serving insurance capital"
      : "technocratic governance frameworks optimizing for institutional efficiency"

  const content = template
    .replace(/{title}/g, scenario.title)
    .replace(/{pop}/g, scenario.targetPopulation.split(",")[0].trim().slice(0, 55))
    .replace(/{mech}/g, scenario.evaluationMechanism.slice(0, 75))
    .replace(/{target}/g, scenario.targetPopulation.slice(0, 55))
    .replace(/{sysType}/g, scenario.systemType)
    .replace(/{count}/g, String(Math.floor(s.consequenceSeverity * 3) + 2))
    .replace(/{lineage}/g, lineage)

  const isContradiction = type === "contradiction" ||
    (type === "critique" && (fromAgent.id === "red-team-auditor" || fromAgent.id === "transgression-auditor"))

  const metrics = ["IGR", "FGR", "RCR", "SRGR", "MGR", "futureClosureRisk", "bodyLoadRisk", "reentryScore"]
  // Deterministic metric reference: based on agent id hash
  const metricIndex = fromAgent.id.length % metrics.length
  const referencedMetric = type !== "judgment" ? metrics[metricIndex] : undefined

  return {
    id: `msg-${fromAgent.id}-${toAgentId}-${type}`,
    fromAgent: fromAgent.id,
    toAgent: toAgentId,
    type,
    content,
    referencedMetric,
    isContradiction,
    timestamp: Date.now(),
  }
}

// ─── Nine rates calculation ───────────────────────────────────────────────────

export function calculateNineRates(agentOutputs: AuditAgent[], scenario: AuditScenario): GenerativeRateScore[] {
  const s = extractSignals(scenario)
  return NINE_RATES.map((rate) => {
    // Prefer score from nine-rates-auditor if available
    const nineRatesAgent = agentOutputs.find((a) => a.id === "nine-rates-auditor")
    const agentScore = nineRatesAgent?.scores[rate.key]
    const score = typeof agentScore === "number" ? agentScore : RATE_SCORERS[rate.key](s)
    const rationale = rateRationale(rate.key, score, s, scenario)
    const riskTag = score < -1.5 ? "High Risk" : score < 0 ? "Elevated Risk" : score < 1.5 ? "Monitor" : undefined
    return { key: rate.key, label: rate.label, score, rationale, riskTag }
  })
}

// ─── Agent disagreements (from actual score divergence) ───────────────────────

export function generateAgentDisagreements(agents: AuditAgent[], scenario: AuditScenario): AgentDisagreement[] {
  const s = extractSignals(scenario)
  const completed = agents.filter((a) => a.status === "completed")
  if (completed.length < 4) return []

  const get = (id: AgentId) => agents.find((a) => a.id === id)

  const disagreements: AgentDisagreement[] = []

  // Disagreement 1: Red Team vs Nine-Rates (evidentiary standard)
  const rt = get("red-team-auditor")
  const nr = get("nine-rates-auditor")
  if (rt && nr) {
    disagreements.push({
      agentA: "red-team-auditor",
      agentB: "nine-rates-auditor",
      topic: "Evidentiary standard for generative-rate evaluation",
      positionA: rt.analysisOutput?.slice(0, 160) ?? "Adversarial Check: Evidentiary basis for rate evaluations is insufficiently rigorous.",
      positionB: "Nine-Rates Auditor: Evaluations are derived deterministically from scenario text analysis; the evidentiary challenge applies to the input scenario's self-description, not to the evaluation methodology.",
      severity: s.biasEvidence > 0.4 ? 4 : 3,
    })
  }

  // Disagreement 2: Re-Entry vs Institution-Fixation (reform vs abolition)
  const rea = get("reentry-auditor")
  const ifa = get("institution-fixation-auditor")
  if (rea && ifa && s.reentryQuality < 0.5) {
    disagreements.push({
      agentA: "reentry-auditor",
      agentB: "institution-fixation-auditor",
      topic: "Whether re-entry reform is sufficient or structural abolition required",
      positionA: rea.analysisOutput?.slice(0, 160) ?? "Re-Entry Auditor: Structured appeal mechanisms with adequate re-entry pathways represent the minimum viable remediation.",
      positionB: ifa.analysisOutput?.slice(0, 160) ?? "Institution-Fixation Auditor: Ontological reification cannot be corrected by re-entry pathways that leave the scoring authority intact. Structural abolition of automated consequential scoring is required.",
      severity: s.reentryQuality < 0.25 ? 5 : 3,
    })
  }

  // Disagreement 3: Body-Load vs Synthesis (quantifiability of somatic costs)
  const bla = get("body-load-auditor")
  const syn = get("synthesis-agent")
  if (bla && syn && s.surveillanceLoad > 0.3) {
    disagreements.push({
      agentA: "body-load-auditor",
      agentB: "synthesis-agent",
      topic: "Inclusion of somatic / body-load costs in formal audit framework",
      positionA: bla.analysisOutput?.slice(0, 160) ?? "Body-Load Auditor: Chronic stress, self-censorship, and anticipatory compliance costs are real and compounding but not captured in the DCR — Directional Correctness Index.",
      positionB: "Synthesis Agent: Body-load costs are acknowledged as structurally significant but are not currently reducible to a generative-rate evaluation without speculative assumptions. They should appear as a risk flag rather than a rated variable.",
      severity: 3,
    })
  }

  // Disagreement 4: Measurement vs Genealogy (technical vs historical framing)
  const ma = get("measurement-auditor")
  const ga = get("genealogy-auditor")
  if (ma && ga && s.historicalBias > 0.3) {
    disagreements.push({
      agentA: "measurement-auditor",
      agentB: "genealogy-auditor",
      topic: "Whether measurement problems are primarily technical or genealogical",
      positionA: ma.analysisOutput?.slice(0, 160) ?? "Measurement Auditor: The core problem is measurement validity — using an invalid proxy for the claimed construct. This is correctable through better measurement design.",
      positionB: ga.analysisOutput?.slice(0, 160) ?? "Genealogy Auditor: The measurement problem is not technical but genealogical. The choice of what to measure, how to validate, and who counts as a valid subject is determined by the institutional lineage of the system, not by neutral methodological criteria.",
      severity: s.historicalBias > 0.5 ? 4 : 2,
    })
  }

  return disagreements
}

// ─── Network graph ────────────────────────────────────────────────────────────

const AGENT_POSITIONS: Record<AgentId, { x: number; y: number }> = {
  "scenario-parser":            { x: 300, y: 80  },
  "measurement-auditor":        { x: 460, y: 130 },
  "transgression-auditor":      { x: 545, y: 255 },
  "reachable-state-auditor":    { x: 510, y: 390 },
  "nine-rates-auditor":         { x: 390, y: 480 },
  "reentry-auditor":            { x: 210, y: 480 },
  "body-load-auditor":          { x: 90,  y: 390 },
  "institution-fixation-auditor":{ x: 55, y: 255 },
  "genealogy-auditor":          { x: 140, y: 130 },
  "red-team-auditor":           { x: 300, y: 170 },
  "synthesis-agent":            { x: 300, y: 310 },
  "ddat-judge":                 { x: 300, y: 410 },
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
    .slice(-40)
    .map((m) => ({
      from: m.fromAgent,
      to: m.toAgent as AgentId,
      type: m.type,
      id: m.id,
    }))

  return { nodes, edges }
}
