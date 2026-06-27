"use client"

import { useState } from "react"
import { useMADAN } from "@/lib/madan/store"
import { generateMarkdownReport, generateJSONExport } from "@/lib/madan/reportGenerator"

export function FinalReport() {
  const { state } = useMADAN()
  const [activeTab, setActiveTab] = useState<"markdown" | "json">("markdown")
  const [copied, setCopied] = useState(false)

  if (!state.result) {
    return (
      <div className="flex items-center justify-center h-40 text-[11px] text-gray-400 italic">
        Audit report will appear here after simulation completes.
      </div>
    )
  }

  const markdownContent = generateMarkdownReport(state.scenario, state.agents, state.messages, state.result)
  const jsonContent = generateJSONExport(state.scenario, state.agents, state.messages, state.result)
  const content = activeTab === "markdown" ? markdownContent : jsonContent

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleDownload() {
    const blob = new Blob([content], {
      type: activeTab === "markdown" ? "text/markdown" : "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `madan-audit-${state.scenario.title.replace(/\s+/g, "-").toLowerCase()}.${activeTab === "markdown" ? "md" : "json"}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Sub-tab selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button
            className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold border transition-all ${
              activeTab === "markdown"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
            onClick={() => setActiveTab("markdown")}
          >
            Markdown Preview
          </button>
          <button
            className={`text-[10px] px-3 py-1.5 rounded-lg font-semibold border transition-all ${
              activeTab === "json"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
            onClick={() => setActiveTab("json")}
          >
            JSON Export
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="text-[10px] px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition-all"
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            className="text-[10px] px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-all font-semibold"
            onClick={handleDownload}
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Content */}
      <pre className="text-[10px] leading-relaxed font-mono whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-xl p-4 overflow-auto max-h-[500px] text-gray-800">
        {content}
      </pre>
    </div>
  )
}
