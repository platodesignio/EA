"use client"

import { useMemo, useState } from "react"
import { useEvidenceStore } from "@/lib/evidence-store"
import { computeJudgment, evidenceLevelLabel, judgmentDescription, scoreLabel, governanceClaimCategoryLabel } from "@/lib/ddat-judgment"
import { generateMarkdownReport } from "@/lib/ddat-report"
import type { DDATJudgmentLabel, ConfidenceLabel, MasterFunctionAlignment } from "@/lib/ddat-evidence-schema"
import {
  PageContainer, SectionTitle, SecondaryButton, Card,
} from "./shared"

const JUDGMENT_STYLE: Record<DDATJudgmentLabel, { border: string; label: string }> = {
  "support-generative":     { border: "border-l-gray-900", label: "Support-Generative" },
  "ambiguous":              { border: "border-l-gray-400", label: "Ambiguous" },
  "closure-generative":     { border: "border-l-gray-600", label: "Closure-Generative" },
  "institutionally-dangerous": { border: "border-l-gray-900", label: "Institutionally Dangerous" },
  "insufficient-evidence":  { border: "border-l-gray-200", label: "Insufficient Evidence" },
}

const CONFIDENCE_BORDER: Record<ConfidenceLabel, string> = {
  "Unverified": "border-gray-900",
  "Self-Reported Only": "border-gray-900",
  "Partially Verified": "border-gray-400",
  "Verified": "border-gray-200",
}

const ALIGNMENT_LABEL: Record<MasterFunctionAlignment, string> = {
  aligned: "Aligned",
  unclear: "Unclear",
  contradicted: "Contradicted",
}

// ─── ScoreRow — plain numeric row, no fill bar ────────────────────────────
function ScoreRow({
  label,
  score,
  max = 3,
  invert = false,
}: {
  label: string
  score: number
  max?: number
  invert?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-600">{label}</span>
      <span className="text-[11px] font-mono text-gray-900 shrink-0">
        {score}/{max} — {max === 6 ? evidenceLevelLabel(score as 0|1|2|3|4|5|6) : scoreLabel(score as 0|1|2|3, invert)}
      </span>
    </div>
  )
}

export function JudgmentReport() {
  const { state, dispatch } = useEvidenceStore()
  const [copied, setCopied] = useState(false)
  const [showRaw, setShowRaw] = useState(false)

  const judgment = useMemo(() => computeJudgment(state.auditCase), [state.auditCase])
  const report = useMemo(() => generateMarkdownReport(state.auditCase, judgment), [state.auditCase, judgment])

  const style = JUDGMENT_STYLE[judgment.label]
  const p = state.auditCase.institution_profile

  function copyReport() {
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function downloadReport() {
    const blob = new Blob([report], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ddat-audit-${p.system_name.replace(/\s+/g, "-").toLowerCase() || "report"}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageContainer>
      <SectionTitle>Judgment &amp; Report</SectionTitle>

      <div className="mb-4 text-[10px] font-mono border border-gray-200 px-3 py-2 text-gray-500 leading-relaxed">
        DDAT audits institutions, not persons. The judgment below evaluates the institution&apos;s
        classification regime, decision architecture, and responsibility structure.
        We do not measure private belief. We audit institutionalized commitments.
      </div>

      {/* ─── Evidence Confidence — kept separate from risk ───────── */}
      <div className={`border ${CONFIDENCE_BORDER[judgment.confidence.label]} p-4 mb-8`}>
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
          Evidence Confidence — separate from risk
        </p>
        <p className="text-[13px] font-mono font-bold text-gray-900 uppercase tracking-wide mb-2">
          {judgment.confidence.label}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          {judgment.confidence.independentSourceCount} independent source{judgment.confidence.independentSourceCount === 1 ? "" : "s"} · {judgment.confidence.selfReportedSourceCount} self-reported source{judgment.confidence.selfReportedSourceCount === 1 ? "" : "s"}
        </p>
        {(judgment.confidence.label === "Unverified" || judgment.confidence.label === "Self-Reported Only") && (
          <p className="text-sm text-gray-900 leading-relaxed mb-3">
            This audit is <span className="font-bold">UNVERIFIED</span> against independent evidence. The risk
            scores below describe institutional exposure if the recorded configuration is accurate — that
            configuration has not been independently confirmed.
          </p>
        )}
        {judgment.confidence.missingEvidenceWarnings.length > 0 && (
          <ul className="space-y-1">
            {judgment.confidence.missingEvidenceWarnings.map((w, i) => (
              <li key={i} className="flex gap-2 text-xs text-gray-600 leading-relaxed">
                <span className="text-gray-300 shrink-0">—</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ─── Declared vs. Operational Master Function ────────────── */}
      <Card className="mb-8">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
          Declared vs. Operational Master Function
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Declared</p>
            <p className="text-sm text-gray-900 leading-relaxed">{judgment.masterFunction.declared}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Operational</p>
            <p className="text-sm text-gray-900 leading-relaxed">{judgment.masterFunction.operational}</p>
          </div>
        </div>
        <p className="text-[11px] font-mono font-bold text-gray-900 uppercase tracking-wide mb-1">
          Alignment: {ALIGNMENT_LABEL[judgment.masterFunction.alignment]}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">{judgment.masterFunction.rationale}</p>
      </Card>

      {/* ─── Judgment ──────────────────────────────────────────── */}
      <div className={`border-l-4 ${style.border} pl-5 py-2 mb-8`}>
        <div className="flex items-start gap-4 mb-3">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
              DDAT Judgment
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono font-bold px-3 py-1 border border-gray-900 text-gray-900 uppercase tracking-wide">
                {style.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">
          {judgmentDescription(judgment.label)}
        </p>
      </div>

      {/* ─── Scores ──────────────────────────────────────────────── */}
      <Card className="mb-8">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
          Scores
        </p>

        <div className="mb-2">
          <p className="text-[9px] font-mono text-gray-300 uppercase tracking-wider mb-1">Risk dimensions (high = worse)</p>
          <ScoreRow label="Classification Risk" score={judgment.scores.classificationRisk} />
          <ScoreRow label="Closure Risk" score={judgment.scores.closureRisk} />
          <ScoreRow label="Responsibility Gap" score={judgment.scores.responsibilityGap} />
        </div>

        <div className="mt-4">
          <p className="text-[9px] font-mono text-gray-300 uppercase tracking-wider mb-1">Capacity dimensions (high = better)</p>
          <ScoreRow label="Contestability Capacity" score={judgment.scores.contestabilityCapacity} invert />
          <ScoreRow label="Support Conversion" score={judgment.scores.supportConversion} invert />
          <ScoreRow label="Re-entry Capacity" score={judgment.scores.reentryCapacity} invert />
          <ScoreRow label="Temporal Recovery" score={judgment.scores.temporalRecovery} invert />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <ScoreRow label="Evidence Level" score={judgment.scores.evidenceLevel} max={6} />
        </div>
      </Card>

      {/* ─── Reasoning Path ─────────────────────────────────────── */}
      {judgment.reasoningPath.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
            Reasoning Path
          </p>
          <div className="space-y-2">
            {judgment.reasoningPath.map((r, i) => (
              <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="text-gray-300 font-mono shrink-0 mt-0.5">{i + 1}.</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Improvement Requirements ───────────────────────────── */}
      {judgment.improvementRequirements.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
            Improvement Requirements
          </p>
          <ul className="space-y-1.5">
            {judgment.improvementRequirements.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-gray-300 shrink-0">—</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Evidence Gaps ──────────────────────────────────────── */}
      {judgment.evidenceGaps.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
            Evidence Gaps
          </p>
          <ul className="space-y-1.5">
            {judgment.evidenceGaps.map((g, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-gray-300 shrink-0">—</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Contradiction Findings ─────────────────────────────── */}
      <div className="mb-8">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
          Contradiction Findings
        </p>
        {judgment.contradictions.length > 0 ? (
          <div className="space-y-3">
            {judgment.contradictions.map(cx => (
              <div key={cx.id} className="border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold border border-gray-900 text-gray-900 px-1.5 py-0.5 uppercase">
                    {cx.severity}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {governanceClaimCategoryLabel(cx.category)}
                  </span>
                </div>
                <p className="text-sm text-gray-900 mb-1"><span className="text-gray-400">Declared:</span> {cx.claimText}</p>
                <p className="text-sm text-gray-700"><span className="text-gray-400">Operational finding:</span> {cx.operationalFinding}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 font-mono border border-gray-200 px-3 py-2">
            No contradictions identified between declared governance claims and the recorded operational structure.
          </p>
        )}
      </div>

      {/* ─── Report Export ──────────────────────────────────────── */}
      <div className="border-t border-gray-200 pt-6 mb-8">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
          Export Audit Report
        </p>
        <div className="flex gap-3 mb-4">
          <button
            onClick={copyReport}
            className="px-4 py-2 bg-gray-900 text-white text-[11px] font-mono tracking-wider uppercase hover:bg-gray-700 transition-colors"
          >
            {copied ? "Copied ✓" : "Copy Markdown"}
          </button>
          <button
            onClick={downloadReport}
            className="px-4 py-2 border border-gray-300 text-[11px] font-mono text-gray-700 hover:border-gray-600 transition-colors"
          >
            Download .md
          </button>
          <SecondaryButton onClick={() => setShowRaw(!showRaw)}>
            {showRaw ? "Hide" : "Preview"} Report
          </SecondaryButton>
        </div>

        {showRaw && (
          <pre className="text-[10px] font-mono text-gray-600 bg-gray-50 border border-gray-200 p-4 overflow-auto max-h-96 leading-relaxed whitespace-pre-wrap">
            {report}
          </pre>
        )}
      </div>

      {/* ─── Navigation ─────────────────────────────────────────── */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 6 })}>
          ← Back to Evidence
        </SecondaryButton>
        <button
          onClick={() => { if (confirm("Start a new audit? Current data will be saved in your browser.")) dispatch({ type: "SET_STEP", payload: 0 }) }}
          className="text-[11px] font-mono text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Return to Overview
        </button>
      </div>
    </PageContainer>
  )
}
