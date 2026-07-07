"use client"

import { useMemo, useState } from "react"
import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import { deriveMasterFunction, computeEvidenceConfidence, computeContradictionIndex, computeRiskDashboard } from "@/lib/scoring"
import { generateExecutiveReport, DISCLAIMER_TEXT } from "@/lib/report"
import { PageContainer, SectionTitle, SectionBanner, SecondaryButton } from "@/components/evidence/shared"

export function ExecutiveReport() {
  const { state, dispatch } = useCEOConsoleStore()
  const [copied, setCopied] = useState(false)
  const c = state.auditCase

  const mf = useMemo(
    () => deriveMasterFunction(c.master_function.declared, c.master_function.answers),
    [c.master_function.declared, c.master_function.answers]
  )
  const confidence = useMemo(
    () => computeEvidenceConfidence(c.audit_unit.scan_basis, c.decision_stages, c.chain_items),
    [c.audit_unit.scan_basis, c.decision_stages, c.chain_items]
  )
  const contradiction = useMemo(
    () => computeContradictionIndex(c.decision_stages, c.chain_items, mf),
    [c.decision_stages, c.chain_items, mf]
  )
  const riskDashboard = useMemo(
    () => computeRiskDashboard(c.audit_unit, c.decision_stages, c.chain_items, mf, c.master_function.answers, confidence, contradiction),
    [c, mf, confidence, contradiction]
  )
  const report = useMemo(
    () => generateExecutiveReport(c, { masterFunction: mf, confidence, contradiction, riskDashboard }),
    [c, mf, confidence, contradiction, riskDashboard]
  )

  function copyReport() {
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function printReport() {
    window.print()
  }

  // Clipboard access can be blocked (permissions, focus, embedded webviews).
  // A file download always works and is the only copy of this report that
  // survives outside this browser tab's storage — important since the app
  // has no backend and no login.
  function downloadReport() {
    const fileName = `ceo-ai-accountability-scan-${c.audit_unit.organization_name.trim().replace(/\s+/g, "-").toLowerCase() || "report"}.txt`
    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  async function shareReport() {
    const fileName = "ceo-ai-accountability-scan.txt"
    const file = new File([report], fileName, { type: "text/plain" })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "CEO AI Accountability Console — Preliminary Executive Scan" })
        return
      } catch {
        // user cancelled or share failed — fall through to download
      }
    }
    downloadReport()
  }

  return (
    <PageContainer>
      <div className="print:hidden">
        <SectionTitle>Step 8 — Executive Report</SectionTitle>

        <SectionBanner>
          This preliminary scan does not measure private belief. It reviews how an AI-enabled decision system
          appears to distribute evaluation, responsibility, appealability, re-entry, and future possibility
          based on the information provided.
        </SectionBanner>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={copyReport}
            className="px-4 py-2 bg-gray-900 text-white text-[11px] font-mono tracking-wider uppercase hover:bg-gray-700 transition-colors"
          >
            Copy Report
          </button>
          <button
            onClick={printReport}
            className="px-4 py-2 border border-gray-300 text-[11px] font-mono text-gray-700 hover:border-gray-600 transition-colors"
          >
            Print Report
          </button>
          <button
            onClick={shareReport}
            className="px-4 py-2 border border-gray-300 text-[11px] font-mono text-gray-700 hover:border-gray-600 transition-colors"
          >
            Save / Share Report
          </button>
          <button
            onClick={() => { if (confirm("Reset this scan? Current data will be cleared.")) dispatch({ type: "RESET" }) }}
            className="px-4 py-2 border border-gray-300 text-[11px] font-mono text-gray-700 hover:border-gray-600 transition-colors"
          >
            Reset Scan
          </button>
          <a
            href="/contact"
            className="px-4 py-2 border border-gray-900 text-gray-900 text-[11px] font-mono tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-colors"
          >
            Request Institutional Audit
          </a>
          {copied && <span className="text-[11px] font-mono text-gray-500">Report copied.</span>}
        </div>
      </div>

      <pre className="text-[11px] font-mono text-gray-800 bg-gray-50 border border-gray-200 p-5 overflow-auto leading-relaxed whitespace-pre-wrap print:border-0 print:bg-white print:p-0">
        {report}
      </pre>

      <div className="mt-10 pt-6 border-t border-gray-200 text-[10px] text-gray-500 leading-relaxed print:hidden">
        {DISCLAIMER_TEXT}
      </div>

      <div className="pt-6 mt-4 border-t border-gray-100 flex justify-between print:hidden">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 7 })}>← Back to Risk Dashboard</SecondaryButton>
      </div>
    </PageContainer>
  )
}
