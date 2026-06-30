import type { AuditAgent, AgentMessage, AuditResult, AuditScenario } from "@/types/madan"

export function generateMarkdownReport(
  scenario: AuditScenario,
  agents: AuditAgent[],
  messages: AgentMessage[],
  result: AuditResult
): string {
  const now = new Date().toISOString().split("T")[0]
  const contradictions = messages.filter((m) => m.isContradiction)

  const nineRatesTable =
    `| Rate | Label | Score | Risk |\n` +
    `|------|-------|-------|------|\n` +
    result.nineRates.map((r) => `| ${r.key} | ${r.label} | ${r.score > 0 ? "+" : ""}${r.score} | ${r.riskTag ?? "—"} |`).join("\n")

  const agentSummaries = agents
    .filter((a) => a.status === "completed" && a.analysisOutput)
    .map((a) => `### ${a.name}\n**Confidence:** ${a.confidence}%  \n**Risk Flags:** ${a.riskFlags.length > 0 ? a.riskFlags.join("; ") : "None"}  \n\n${a.analysisOutput}`)
    .join("\n\n---\n\n")

  const dcrSign = result.dcr > 0 ? "+" : ""

  return `# DDAT Structured Audit Report — ${scenario.title}
**Generated:** ${now}
**System Type:** ${scenario.systemType}
**Directional Judgment:** ${result.finalJudgment}
**DCR — Directional Correctness Index:** ${dcrSign}${result.dcr.toFixed(2)} / ±5.00

---

## Executive Summary

The Multi-Perspective Audit Module conducted a full twelve-perspective structured audit of **${scenario.title}**. The audit produced a DCR — Directional Correctness Index of **${dcrSign}${result.dcr.toFixed(2)}**, yielding a directional judgment of **${result.finalJudgment}**.

The audit identified ${result.freedomClosureRisks.length} future-closure risks, ${result.mainContradictions.length} main contradictions across audit perspectives, and a reachable-state impact score of ${result.reachableStateImpact > 0 ? "+" : ""}${result.reachableStateImpact.toFixed(1)}.

---

## Scenario Description

**Title:** ${scenario.title}
**System Type:** ${scenario.systemType}
**Target Population:** ${scenario.targetPopulation}

${scenario.description}

**Evaluation Mechanism:** ${scenario.evaluationMechanism}

**Data Sources:** ${scenario.dataSources}

**Decision Consequences:** ${scenario.decisionConsequences}

**Re-entry Mechanism:** ${scenario.reentryMechanism}

**Known Risks:** ${scenario.knownRisks}

**Desired Future Direction:** ${scenario.desiredFutureDirection}

---

## Measurement-Form Audit

The Measurement-Form Auditor identified systematic exclusions in the data inputs and evaluation criteria. The following constructs are treated as non-existent within the scoring form:

- Structural and contextual factors affecting performance on evaluation criteria
- Historical and cumulative disadvantage not captured by point-in-time measurement
- Self-knowledge and practical expertise that falls outside the measurement vocabulary
- The somatic and cognitive costs of being evaluated (body-load effects)

---

## Audit Perspective Summaries

${agentSummaries}

---

## Nine Generative Rates

${nineRatesTable}

${result.nineRates.map((r) => `**${r.key} — ${r.label}** (${r.score > 0 ? "+" : ""}${r.score})\n${r.rationale}`).join("\n\n")}

---

## DCR Calculation

| Component | Value | Weight | Contribution |
|-----------|-------|--------|-------------|
| Base DCR (avg of nine rates) | ${(result.nineRates.reduce((s, r) => s + r.score, 0) / result.nineRates.length).toFixed(2)} | 1.00 | ${(result.nineRates.reduce((s, r) => s + r.score, 0) / result.nineRates.length).toFixed(2)} |
| Future-Closure Risk | −${result.futureClosureRisk.toFixed(2)} | 0.15 | −${(result.futureClosureRisk * 0.15).toFixed(2)} |
| Institution-Fixation Risk | −${result.institutionFixationRisk.toFixed(2)} | 0.15 | −${(result.institutionFixationRisk * 0.15).toFixed(2)} |
| Body-Load Risk | −${result.bodyLoadRisk.toFixed(2)} | 0.10 | −${(result.bodyLoadRisk * 0.1).toFixed(2)} |
| Transgression Risk | −${result.transgressionRisk.toFixed(2)} | 0.10 | −${(result.transgressionRisk * 0.1).toFixed(2)} |
| Re-entry Score | +${result.reentryScore.toFixed(2)} | 0.20 | +${(result.reentryScore * 0.2).toFixed(2)} |
| **Final DCR** | | | **${dcrSign}${result.dcr.toFixed(2)}** |

---

## Main Contradictions

${result.mainContradictions.map((c, i) => `${i + 1}. ${c}`).join("\n")}

**Agent Contradictions Flagged:** ${contradictions.length} messages across ${new Set(contradictions.map((m) => m.fromAgent)).size} agents

---

## Re-entry Conditions

${result.reentryConditions.map((c, i) => `${i + 1}. ${c}`).join("\n")}

---

## Freedom-Closure Risks

${result.freedomClosureRisks.map((r, i) => `${i + 1}. ${r}`).join("\n")}

---

## Design Corrections

${result.designCorrections.map((c, i) => `${i + 1}. ${c}`).join("\n")}

---

## Final Judgment

**Directional Verdict:** ${result.finalJudgment}
**DCR:** ${dcrSign}${result.dcr.toFixed(2)}
**Reachable-State Impact:** ${result.reachableStateImpact > 0 ? "Expanding" : "Reducing"} (${result.reachableStateImpact > 0 ? "+" : ""}${result.reachableStateImpact.toFixed(1)})

${result.finalJudgment.includes("Closing") || result.finalJudgment.includes("Ambiguous")
  ? `This system, as currently designed, ${result.finalJudgment.includes("Dangerously") ? "presents an urgent threat to the reachable futures of affected populations and must not continue operation without structural redesign" : "contracts the reachable state space of affected populations and requires structural intervention before continued deployment"}. The audit council recommends implementation of all design corrections prior to any further deployment.`
  : `This system shows positive generative potential but requires the implementation of the design corrections identified above to consolidate and expand its freedom-generative properties.`
}

---

*Generated by DDAT Studio — Multi-Perspective Audit Module*
*DDAT Studio | ${now}*
`
}

export function generateJSONExport(
  scenario: AuditScenario,
  agents: AuditAgent[],
  messages: AgentMessage[],
  result: AuditResult
): string {
  const exportData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      auditSystem: "DDAT Studio — Multi-Perspective Audit Module",
      version: "1.0.0",
    },
    scenario,
    auditResult: {
      dcr: result.dcr,
      finalJudgment: result.finalJudgment,
      nineRates: result.nineRates,
      riskIndicators: {
        reentryScore: result.reentryScore,
        bodyLoadRisk: result.bodyLoadRisk,
        institutionFixationRisk: result.institutionFixationRisk,
        transgressionRisk: result.transgressionRisk,
        futureClosureRisk: result.futureClosureRisk,
        reachableStateImpact: result.reachableStateImpact,
      },
      mainContradictions: result.mainContradictions,
      reentryConditions: result.reentryConditions,
      freedomClosureRisks: result.freedomClosureRisks,
      designCorrections: result.designCorrections,
      agentDisagreements: result.agentDisagreements,
    },
    agentOutputs: agents.map((a) => ({
      id: a.id,
      name: a.name,
      confidence: a.confidence,
      riskFlags: a.riskFlags,
      scores: a.scores,
      analysisOutput: a.analysisOutput,
    })),
    messageLog: {
      total: messages.length,
      contradictions: messages.filter((m) => m.isContradiction).length,
      byType: Object.fromEntries(
        ["question", "critique", "support", "evidence-request", "synthesis", "contradiction", "analysis", "judgment"].map(
          (t) => [t, messages.filter((m) => m.type === t).length]
        )
      ),
      messages: messages.map((m) => ({
        id: m.id,
        from: m.fromAgent,
        to: m.toAgent,
        type: m.type,
        content: m.content,
        referencedMetric: m.referencedMetric,
        isContradiction: m.isContradiction,
        timestamp: m.timestamp,
      })),
    },
  }

  return JSON.stringify(exportData, null, 2)
}
