"use client"

import { useState } from "react"
import { useEvidenceStore } from "@/lib/evidence-store"
import type { DecisionResult } from "@/lib/ddat-evidence-schema"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  TextInput, Textarea, Select, PrimaryButton, SecondaryButton,
  Card, ScoreSelect,
} from "./shared"

const DECISION_RESULT_OPTIONS: { value: DecisionResult | ""; label: string }[] = [
  { value: "",             label: "(not recorded)" },
  { value: "accepted",     label: "Accepted" },
  { value: "rejected",     label: "Rejected" },
  { value: "flagged",      label: "Flagged" },
  { value: "downgraded",   label: "Downgraded" },
  { value: "delayed",      label: "Delayed" },
  { value: "suspended",    label: "Suspended" },
  { value: "surveilled",   label: "Under Surveillance" },
  { value: "higher_price", label: "Higher Price / Terms" },
  { value: "lower_priority", label: "Lower Priority" },
  { value: "other",        label: "Other" },
]

const CLOSURE_DELTA_OPTIONS: { value: 0|1|2|3; label: string }[] = [
  { value: 0, label: "No meaningful change" },
  { value: 1, label: "Minor friction increase" },
  { value: 2, label: "Significant access restriction" },
  { value: 3, label: "Severe access closure" },
]

const EXAMPLE_VARIABLES = [
  "career_gap", "education_credential", "employment_continuity",
  "credit_history_length", "address_proxy", "age_proxy",
  "platform_rating", "medical_marker", "welfare_history", "income_volatility",
]

function newTest() {
  return {
    id: crypto.randomUUID(),
    changed_variable: "",
    baseline_value: "",
    modified_value: "",
    baseline_outcome: "" as DecisionResult | "",
    modified_outcome: "" as DecisionResult | "",
    closure_delta: 0 as 0|1|2|3,
    notes: "",
  }
}

export function CounterfactualForm() {
  const { state, dispatch } = useEvidenceStore()
  const tests = state.auditCase.counterfactuals
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <PageContainer>
      <SectionTitle>Step 5 — Counterfactual Test</SectionTitle>

      <SectionBanner>
        The counterfactual test does not rank or score real persons. It tests whether the
        institution changes access when one variable changes — identifying what the system
        actually responds to.
      </SectionBanner>

      <div className="mb-6 text-xs text-gray-500 font-mono border border-gray-200 px-4 py-3">
        <p className="mb-2 font-bold text-gray-700">What to test:</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_VARIABLES.map(v => (
            <span key={v} className="border border-gray-200 px-1.5 py-0.5 text-[10px]">{v}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">{tests.length} test{tests.length !== 1 ? "s" : ""} recorded</p>
        <SecondaryButton
          onClick={() => {
            const t = newTest()
            dispatch({ type: "ADD_COUNTERFACTUAL", payload: t })
            setExpanded(t.id)
          }}
        >
          + Add Test
        </SecondaryButton>
      </div>

      {tests.length === 0 && (
        <p className="text-xs text-gray-500 font-mono py-6 border border-dashed border-gray-200 text-center">
          No counterfactual tests yet. Add a test to examine which variables drive access closure.
        </p>
      )}

      <div className="space-y-3 mb-10">
        {tests.map((t, i) => (
          <Card key={t.id} className={expanded === t.id ? "border-gray-400" : ""}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpanded(expanded === t.id ? null : t.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-500">Test {i + 1}</span>
                <span className="text-sm text-gray-900">
                  {t.changed_variable || "(unnamed variable)"}
                </span>
                {t.baseline_outcome && t.modified_outcome && (
                  <span className="text-[10px] font-mono text-gray-500">
                    {t.baseline_outcome} → {t.modified_outcome}
                  </span>
                )}
                {t.closure_delta > 0 && (
                  <span className={`text-[10px] font-mono border px-1.5 py-0.5 ${
                    t.closure_delta === 3 ? "border-gray-900 text-gray-900" :
                    t.closure_delta === 2 ? "border-gray-600 text-gray-600" :
                    "border-gray-300 text-gray-500"
                  }`}>
                    Δ{t.closure_delta}
                  </span>
                )}
              </div>
              <span className="text-gray-300 text-xs">{expanded === t.id ? "▲" : "▼"}</span>
            </div>

            {expanded === t.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                <FieldGroup>
                  <Label hint="what single variable changes between baseline and modified profile">Changed Variable</Label>
                  <TextInput
                    value={t.changed_variable}
                    onChange={v => dispatch({ type: "UPDATE_COUNTERFACTUAL", payload: { id: t.id, data: { changed_variable: v } } })}
                    placeholder="e.g. career_gap, credit_history_length"
                  />
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Label>Baseline Value</Label>
                    <TextInput
                      value={t.baseline_value}
                      onChange={v => dispatch({ type: "UPDATE_COUNTERFACTUAL", payload: { id: t.id, data: { baseline_value: v } } })}
                      placeholder="e.g. Continuous employment"
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label>Modified Value</Label>
                    <TextInput
                      value={t.modified_value}
                      onChange={v => dispatch({ type: "UPDATE_COUNTERFACTUAL", payload: { id: t.id, data: { modified_value: v } } })}
                      placeholder="e.g. 18-month career gap"
                    />
                  </FieldGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Label>Baseline Outcome</Label>
                    <Select
                      value={t.baseline_outcome}
                      onChange={v => dispatch({ type: "UPDATE_COUNTERFACTUAL", payload: { id: t.id, data: { baseline_outcome: v } } })}
                      options={DECISION_RESULT_OPTIONS}
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label>Modified Outcome</Label>
                    <Select
                      value={t.modified_outcome}
                      onChange={v => dispatch({ type: "UPDATE_COUNTERFACTUAL", payload: { id: t.id, data: { modified_outcome: v } } })}
                      options={DECISION_RESULT_OPTIONS}
                    />
                  </FieldGroup>
                </div>

                <ScoreSelect
                  value={t.closure_delta}
                  onChange={v => dispatch({ type: "UPDATE_COUNTERFACTUAL", payload: { id: t.id, data: { closure_delta: v } } })}
                  options={CLOSURE_DELTA_OPTIONS}
                  label="Closure Delta"
                />

                <FieldGroup>
                  <Label>Notes</Label>
                  <Textarea
                    value={t.notes}
                    onChange={v => dispatch({ type: "UPDATE_COUNTERFACTUAL", payload: { id: t.id, data: { notes: v } } })}
                    placeholder="What does this test reveal about the system? Does it punish temporal gaps, proxy conditions, or past records?"
                    rows={3}
                  />
                </FieldGroup>

                <div className="flex justify-end">
                  <SecondaryButton onClick={() => dispatch({ type: "REMOVE_COUNTERFACTUAL", payload: t.id })}>
                    Remove
                  </SecondaryButton>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 4 })}>
          ← Back
        </SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 6 })}>
          Next: Evidence Sources →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
