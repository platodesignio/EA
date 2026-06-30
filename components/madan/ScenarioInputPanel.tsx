"use client"

import { useMADAN } from "@/lib/madan/store"
import { PRESET_SCENARIOS } from "@/lib/madan/presets"
import { useSimulation } from "@/lib/madan/useSimulation"

const SYSTEM_TYPES = [
  "labor",
  "education",
  "welfare",
  "healthcare",
  "academic",
  "civic",
  "platform",
  "governance",
  "finance",
  "insurance",
  "other",
]

function Field({
  label,
  sub,
  children,
}: {
  label: string
  sub?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">{label}</label>
      {sub && <p className="text-[10px] text-gray-400 mb-1">{sub}</p>}
      {children}
    </div>
  )
}

const INPUT_CLS =
  "w-full border border-gray-200 px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-500 placeholder:text-gray-300 resize-none"

export function ScenarioInputPanel() {
  const { state, dispatch } = useMADAN()
  const { runSimulation, isRunning } = useSimulation()
  const s = state.scenario

  function set(key: keyof typeof s, value: string) {
    dispatch({ type: "SET_SCENARIO", payload: { [key]: value } })
  }

  function loadPreset(idx: number) {
    dispatch({ type: "SET_SCENARIO", payload: PRESET_SCENARIOS[idx] })
  }

  const canStart =
    s.title.trim().length > 0 &&
    s.description.trim().length > 0 &&
    s.systemType.trim().length > 0

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6 border-b border-gray-200 pb-5">
        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">
          Structured DDAT Audit — Scenario Input
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Define the decision architecture to be audited. This module examines how a system affects
          appeal, re-entry, responsibility, context recovery, bodily burden, and future possibilities.
          DDAT does not evaluate persons — it audits decision architectures.
        </p>
      </div>

      {/* Presets */}
      <div className="mb-7">
        <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-2">
          Load Preset Scenario
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_SCENARIOS.map((preset, i) => (
            <button
              key={i}
              onClick={() => loadPreset(i)}
              className={`text-[10px] px-3 py-1.5 border font-medium transition-all ${
                s.title === preset.title
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-600"
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {/* Title + Domain */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Audit Title *">
            <input
              type="text"
              value={s.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. AI Hiring System Audit"
              className={INPUT_CLS}
            />
          </Field>
          <Field label="Decision Domain *">
            <select
              value={s.systemType}
              onChange={(e) => set("systemType", e.target.value)}
              className={INPUT_CLS + " bg-white"}
            >
              <option value="">Select domain…</option>
              {SYSTEM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* System Description */}
        <Field
          label="System Description *"
          sub="Describe the decision architecture, its purpose, and how it operates."
        >
          <textarea
            value={s.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            placeholder="Describe the system, its purpose, and operational context…"
            className={INPUT_CLS}
          />
        </Field>

        {/* Affected Persons */}
        <Field
          label="Affected Persons"
          sub="Who is affected, and what groups bear disproportionate consequences?"
        >
          <textarea
            value={s.targetPopulation}
            onChange={(e) => set("targetPopulation", e.target.value)}
            rows={2}
            placeholder="Who is evaluated or affected by this system?"
            className={INPUT_CLS}
          />
        </Field>

        {/* Evaluation Mechanism */}
        <Field
          label="Evaluation Mechanism"
          sub="How does the system generate scores, classifications, or decisions?"
        >
          <textarea
            value={s.evaluationMechanism}
            onChange={(e) => set("evaluationMechanism", e.target.value)}
            rows={3}
            placeholder="How are outputs produced? What logic, model, or procedure is used?"
            className={INPUT_CLS}
          />
        </Field>

        {/* Data Sources */}
        <Field label="Data Sources" sub="What data inputs does the system rely on?">
          <textarea
            value={s.dataSources}
            onChange={(e) => set("dataSources", e.target.value)}
            rows={2}
            placeholder="What data is collected, from whom, and under what conditions?"
            className={INPUT_CLS}
          />
        </Field>

        {/* Decision Consequences */}
        <Field
          label="Decision Consequences"
          sub="What rights, opportunities, burdens, or future pathways are altered?"
        >
          <textarea
            value={s.decisionConsequences}
            onChange={(e) => set("decisionConsequences", e.target.value)}
            rows={2}
            placeholder="What happens to affected persons based on the system's outputs?"
            className={INPUT_CLS}
          />
        </Field>

        {/* Appeal Mechanism */}
        <Field
          label="Appeal Mechanism"
          sub="Can affected persons formally contest decisions? What process exists?"
        >
          <textarea
            value={s.appealMechanism}
            onChange={(e) => set("appealMechanism", e.target.value)}
            rows={2}
            placeholder="None / informal / formal appeal process with defined timelines…"
            className={INPUT_CLS}
          />
        </Field>

        {/* Re-entry Mechanism */}
        <Field
          label="Re-entry Mechanism"
          sub="Can affected persons recover, reapply, or return after a negative outcome?"
        >
          <textarea
            value={s.reentryMechanism}
            onChange={(e) => set("reentryMechanism", e.target.value)}
            rows={2}
            placeholder="None / timed / structured re-entry pathway…"
            className={INPUT_CLS}
          />
        </Field>

        {/* Context Recovery */}
        <Field
          label="Context Recovery Mechanism"
          sub="Can affected persons present contextual circumstances that the system does not capture?"
        >
          <textarea
            value={s.contextRecovery}
            onChange={(e) => set("contextRecovery", e.target.value)}
            rows={2}
            placeholder="None / structured mechanism for contextual explanation…"
            className={INPUT_CLS}
          />
        </Field>

        {/* Responsibility Allocation */}
        <Field
          label="Responsibility Allocation"
          sub="Who is accountable when the system produces harmful or erroneous outputs?"
        >
          <textarea
            value={s.responsibilityAllocation}
            onChange={(e) => set("responsibilityAllocation", e.target.value)}
            rows={2}
            placeholder="Operator / developer / procurement body / undefined…"
            className={INPUT_CLS}
          />
        </Field>

        {/* Bodily / Temporal Burden */}
        <Field
          label="Bodily / Temporal Burden"
          sub="Does the system impose costs on subjects' time, energy, health, or embodied capacity?"
        >
          <textarea
            value={s.bodilyBurden}
            onChange={(e) => set("bodilyBurden", e.target.value)}
            rows={2}
            placeholder="Compliance demands, self-modification pressure, time costs, fatigue…"
            className={INPUT_CLS}
          />
        </Field>

        {/* Known Risks */}
        <Field
          label="Known Risks"
          sub="Document known biases, failure modes, or institutional concerns."
        >
          <textarea
            value={s.knownRisks}
            onChange={(e) => set("knownRisks", e.target.value)}
            rows={2}
            placeholder="Documented biases, historical patterns, structural exclusions…"
            className={INPUT_CLS}
          />
        </Field>

        {/* Desired Institutional Direction */}
        <Field
          label="Desired Institutional Direction"
          sub="What reforms, alternatives, or safeguards does this audit aim toward?"
        >
          <textarea
            value={s.desiredFutureDirection}
            onChange={(e) => set("desiredFutureDirection", e.target.value)}
            rows={2}
            placeholder="What changes would reduce future-closure risk in this system?"
            className={INPUT_CLS}
          />
        </Field>

        {/* Start button */}
        <div className="pt-2">
          <button
            onClick={runSimulation}
            disabled={!canStart || isRunning}
            className={`w-full py-3 text-[13px] font-semibold tracking-wide transition-all ${
              canStart && !isRunning
                ? "bg-gray-900 text-white hover:bg-gray-700 cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Begin Structured Audit →
          </button>
          {!canStart && (
            <p className="text-[10px] text-gray-400 text-center mt-1.5">
              Title, decision domain, and system description are required.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
