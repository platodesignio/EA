"use client"

import { useMADAN } from "@/lib/madan/store"
import { PRESET_SCENARIOS } from "@/lib/madan/presets"
import { useSimulation } from "@/lib/madan/useSimulation"

const SYSTEM_TYPES = ["labor", "education", "welfare", "healthcare", "academic", "civic", "platform", "governance", "finance", "other"]

export function ScenarioInputPanel() {
  const { state, dispatch } = useMADAN()
  const { runSimulation, isRunning } = useSimulation()
  const s = state.scenario

  function setField(key: keyof typeof s, value: string) {
    dispatch({ type: "SET_SCENARIO", payload: { [key]: value } })
  }

  function loadPreset(idx: number) {
    dispatch({ type: "SET_SCENARIO", payload: PRESET_SCENARIOS[idx] })
  }

  const canStart = s.title.trim().length > 0 && s.description.trim().length > 0 && s.systemType.trim().length > 0

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Configure Audit Scenario</h2>
      <p className="text-[12px] text-gray-500 mb-6">
        Define the system to audit, or load one of the preset scenarios below.
      </p>

      {/* Preset chips */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick-Load Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_SCENARIOS.map((preset, i) => (
            <button
              key={i}
              onClick={() => loadPreset(i)}
              className={`text-[10px] px-3 py-1.5 rounded-full border font-medium transition-all ${
                s.title === preset.title
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-50"
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Title + System Type row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">Audit Title *</label>
            <input
              type="text"
              value={s.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. AI Hiring Score System"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 placeholder:text-gray-300"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">System Type *</label>
            <select
              value={s.systemType}
              onChange={(e) => setField("systemType", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 bg-white"
            >
              <option value="">Select domain…</option>
              {SYSTEM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">System Description *</label>
          <textarea
            value={s.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            placeholder="Describe the system, its purpose, and how it operates…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Target Population */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Target Population</label>
          <textarea
            value={s.targetPopulation}
            onChange={(e) => setField("targetPopulation", e.target.value)}
            rows={2}
            placeholder="Who is evaluated or affected by this system?"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Evaluation Mechanism */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Evaluation Mechanism</label>
          <textarea
            value={s.evaluationMechanism}
            onChange={(e) => setField("evaluationMechanism", e.target.value)}
            rows={3}
            placeholder="How does the system generate scores or decisions?"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Data Sources */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Data Sources</label>
          <textarea
            value={s.dataSources}
            onChange={(e) => setField("dataSources", e.target.value)}
            rows={2}
            placeholder="What data inputs does the system use?"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Decision Consequences */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Decision Consequences</label>
          <textarea
            value={s.decisionConsequences}
            onChange={(e) => setField("decisionConsequences", e.target.value)}
            rows={2}
            placeholder="What happens to individuals based on the system's outputs?"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Re-entry Mechanism */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Re-entry Mechanism</label>
          <textarea
            value={s.reentryMechanism}
            onChange={(e) => setField("reentryMechanism", e.target.value)}
            rows={2}
            placeholder="Can individuals contest or recover from low scores? How?"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Known Risks */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Known Risks</label>
          <textarea
            value={s.knownRisks}
            onChange={(e) => setField("knownRisks", e.target.value)}
            rows={2}
            placeholder="Document known biases, failure modes, or ethical concerns…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Desired Future Direction */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1">Desired Future Direction</label>
          <textarea
            value={s.desiredFutureDirection}
            onChange={(e) => setField("desiredFutureDirection", e.target.value)}
            rows={2}
            placeholder="What reforms or alternatives does the audit aim toward?"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Start button */}
        <div className="pt-2">
          <button
            onClick={runSimulation}
            disabled={!canStart || isRunning}
            className={`w-full py-3 rounded-xl text-[13px] font-bold tracking-wide transition-all ${
              canStart && !isRunning
                ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Begin Audit →
          </button>
          {!canStart && (
            <p className="text-[10px] text-gray-400 text-center mt-1">
              Title, system type, and description are required.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
