"use client"

import { useState } from "react"
import { useEvidenceStore } from "@/lib/evidence-store"
import type { VariableCategory, DecisionResult, AccessType } from "@/lib/ddat-evidence-schema"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  TextInput, Textarea, Select, Toggle, PrimaryButton, SecondaryButton,
  Card, ScoreSelect, TagInput,
} from "./shared"

const VAR_CATEGORY_OPTIONS: { value: VariableCategory; label: string }[] = [
  { value: "historical_record",   label: "Historical Record" },
  { value: "behavioral_data",     label: "Behavioural Data" },
  { value: "biometric_data",      label: "Biometric Data" },
  { value: "socioeconomic_proxy", label: "Socioeconomic Proxy" },
  { value: "institutional_record",label: "Institutional Record" },
  { value: "recommendation",      label: "Recommendation" },
  { value: "credential",          label: "Credential" },
  { value: "platform_metric",     label: "Platform Metric" },
  { value: "location_proxy",      label: "Location Proxy" },
  { value: "medical_marker",      label: "Medical Marker" },
  { value: "other",               label: "Other" },
]

const DECISION_RESULT_OPTIONS: { value: DecisionResult; label: string }[] = [
  { value: "accepted",      label: "Accepted" },
  { value: "rejected",      label: "Rejected" },
  { value: "flagged",       label: "Flagged" },
  { value: "downgraded",    label: "Downgraded" },
  { value: "delayed",       label: "Delayed" },
  { value: "suspended",     label: "Suspended" },
  { value: "surveilled",    label: "Under Surveillance" },
  { value: "higher_price",  label: "Higher Price / Terms" },
  { value: "lower_priority",label: "Lower Priority" },
  { value: "other",         label: "Other" },
]

const ACCESS_TYPE_OPTIONS: { value: AccessType; label: string }[] = [
  { value: "employment",    label: "Employment" },
  { value: "housing",       label: "Housing" },
  { value: "credit",        label: "Credit" },
  { value: "welfare",       label: "Welfare" },
  { value: "education",     label: "Education" },
  { value: "medical_care",  label: "Medical Care" },
  { value: "insurance",     label: "Insurance" },
  { value: "platform_access",label: "Platform Access" },
  { value: "mobility",      label: "Mobility" },
  { value: "public_service",label: "Public Service" },
  { value: "re_entry",      label: "Re-entry" },
  { value: "other",         label: "Other" },
]

const SEVERITY_OPTIONS: { value: 0|1|2|3; label: string }[] = [
  { value: 0, label: "No closure" },
  { value: 1, label: "Minor friction" },
  { value: 2, label: "Significant restriction" },
  { value: 3, label: "Severe access closure" },
]

function newVariable() {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: "other" as VariableCategory,
    source: "",
    contestable: false,
    correction_possible: false,
    notes: "",
  }
}

function newClosure() {
  return {
    id: crypto.randomUUID(),
    decision_result: "rejected" as DecisionResult,
    access_closed: [] as AccessType[],
    severity: 0 as 0|1|2|3,
    duration: "",
    reversibility: "",
    notes: "",
  }
}

export function ClassificationForm() {
  const { state, dispatch } = useEvidenceStore()
  const cm = state.auditCase.classification_map
  const closures = state.auditCase.closure_map.closures

  const [expandedVar, setExpandedVar] = useState<string | null>(null)
  const [expandedClosure, setExpandedClosure] = useState<string | null>(null)

  return (
    <PageContainer>
      <SectionTitle>Step 2 — Classification &amp; Closure Map</SectionTitle>

      <SectionBanner>
        Record how the system classifies subjects and what access it closes. Variables and closures belong to the institution&apos;s architecture, not to the person&apos;s character.
      </SectionBanner>

      {/* ─── Classification Terms ─────────────────────────── */}
      <div className="mb-8">
        <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider mb-1">
          Classification Terms
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          What labels does the system produce? (e.g. employability, risk, creditworthiness, fraud suspicion)
        </p>
        <TagInput
          values={cm.classification_terms}
          onChange={v => dispatch({ type: "SET_CLASSIFICATION", payload: { classification_terms: v } })}
          placeholder="e.g. employability — press Enter"
        />
      </div>

      {/* ─── Input Variables ──────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider">
            Input Variables ({cm.input_variables.length})
          </h3>
          <SecondaryButton
            onClick={() => {
              const v = newVariable()
              dispatch({ type: "ADD_VARIABLE", payload: v })
              setExpandedVar(v.id)
            }}
          >
            + Add Variable
          </SecondaryButton>
        </div>

        {cm.input_variables.length === 0 && (
          <p className="text-xs text-gray-500 font-mono py-4 border border-dashed border-gray-200 text-center">
            No input variables documented yet.
          </p>
        )}

        <div className="space-y-2">
          {cm.input_variables.map(v => (
            <Card key={v.id} className={expandedVar === v.id ? "border-gray-400" : ""}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedVar(expandedVar === v.id ? null : v.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-500 border border-gray-200 px-1.5 py-0.5">
                    {v.category}
                  </span>
                  <span className="text-sm text-gray-900">{v.name || "(unnamed variable)"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono ${v.contestable ? "text-gray-500" : "text-gray-300"}`}>
                    {v.contestable ? "contestable" : "not contestable"}
                  </span>
                  <span className="text-gray-300 text-xs">{expandedVar === v.id ? "▲" : "▼"}</span>
                </div>
              </div>

              {expandedVar === v.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  <FieldGroup>
                    <Label>Variable Name</Label>
                    <TextInput
                      value={v.name}
                      onChange={val => dispatch({ type: "UPDATE_VARIABLE", payload: { id: v.id, data: { name: val } } })}
                      placeholder="e.g. Employment continuity, Credit score"
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Category</Label>
                    <Select
                      value={v.category}
                      onChange={val => dispatch({ type: "UPDATE_VARIABLE", payload: { id: v.id, data: { category: val } } })}
                      options={VAR_CATEGORY_OPTIONS}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Data Source</Label>
                    <TextInput
                      value={v.source}
                      onChange={val => dispatch({ type: "UPDATE_VARIABLE", payload: { id: v.id, data: { source: val } } })}
                      placeholder="e.g. Credit bureau, CV text parsing, Internal records"
                    />
                  </FieldGroup>

                  <div className="grid grid-cols-2 gap-4">
                    <Toggle
                      value={v.contestable}
                      onChange={val => dispatch({ type: "UPDATE_VARIABLE", payload: { id: v.id, data: { contestable: val } } })}
                      label="Contestable by subject"
                    />
                    <Toggle
                      value={v.correction_possible}
                      onChange={val => dispatch({ type: "UPDATE_VARIABLE", payload: { id: v.id, data: { correction_possible: val } } })}
                      label="Correction possible"
                    />
                  </div>

                  <FieldGroup>
                    <Label hint="proxy effects, known harms, contestability notes">Notes</Label>
                    <Textarea
                      value={v.notes}
                      onChange={val => dispatch({ type: "UPDATE_VARIABLE", payload: { id: v.id, data: { notes: val } } })}
                      rows={2}
                    />
                  </FieldGroup>

                  <div className="flex justify-end">
                    <SecondaryButton
                      onClick={() => dispatch({ type: "REMOVE_VARIABLE", payload: v.id })}
                    >
                      Remove
                    </SecondaryButton>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* ─── Closure Map ─────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider">
              Closure Map ({closures.length})
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">What access does the system close or restrict?</p>
          </div>
          <SecondaryButton
            onClick={() => {
              const cl = newClosure()
              dispatch({ type: "ADD_CLOSURE", payload: cl })
              setExpandedClosure(cl.id)
            }}
          >
            + Add Closure
          </SecondaryButton>
        </div>

        {closures.length === 0 && (
          <p className="text-xs text-gray-500 font-mono py-4 border border-dashed border-gray-200 text-center">
            No closures documented yet.
          </p>
        )}

        <div className="space-y-2">
          {closures.map(cl => (
            <Card key={cl.id} className={expandedClosure === cl.id ? "border-gray-400" : ""}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedClosure(expandedClosure === cl.id ? null : cl.id)}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono border px-1.5 py-0.5 ${
                    cl.severity === 3 ? "border-gray-900 text-gray-900" :
                    cl.severity === 2 ? "border-gray-600 text-gray-600" :
                    "border-gray-300 text-gray-500"
                  }`}>
                    severity {cl.severity}
                  </span>
                  <span className="text-sm text-gray-900">{cl.decision_result}</span>
                  {cl.access_closed.length > 0 && (
                    <span className="text-xs text-gray-500">→ {cl.access_closed.join(", ")}</span>
                  )}
                </div>
                <span className="text-gray-300 text-xs">{expandedClosure === cl.id ? "▲" : "▼"}</span>
              </div>

              {expandedClosure === cl.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  <FieldGroup>
                    <Label>Decision Result</Label>
                    <Select
                      value={cl.decision_result}
                      onChange={v => dispatch({ type: "UPDATE_CLOSURE", payload: { id: cl.id, data: { decision_result: v } } })}
                      options={DECISION_RESULT_OPTIONS}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Access Closed</Label>
                    <div className="flex flex-wrap gap-2">
                      {ACCESS_TYPE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            const current = cl.access_closed
                            const next = current.includes(opt.value)
                              ? current.filter(x => x !== opt.value)
                              : [...current, opt.value]
                            dispatch({ type: "UPDATE_CLOSURE", payload: { id: cl.id, data: { access_closed: next } } })
                          }}
                          className={`px-2.5 py-1 text-[11px] font-mono border transition-colors ${
                            cl.access_closed.includes(opt.value)
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </FieldGroup>

                  <ScoreSelect
                    value={cl.severity}
                    onChange={v => dispatch({ type: "UPDATE_CLOSURE", payload: { id: cl.id, data: { severity: v } } })}
                    options={SEVERITY_OPTIONS}
                    label="Severity"
                  />

                  <FieldGroup>
                    <Label>Duration</Label>
                    <TextInput
                      value={cl.duration}
                      onChange={v => dispatch({ type: "UPDATE_CLOSURE", payload: { id: cl.id, data: { duration: v } } })}
                      placeholder="e.g. Indefinite, 6 months, Until re-assessment"
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Reversibility</Label>
                    <TextInput
                      value={cl.reversibility}
                      onChange={v => dispatch({ type: "UPDATE_CLOSURE", payload: { id: cl.id, data: { reversibility: v } } })}
                      placeholder="e.g. Appeal available, Formally available but unclear in practice"
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Notes</Label>
                    <Textarea
                      value={cl.notes}
                      onChange={v => dispatch({ type: "UPDATE_CLOSURE", payload: { id: cl.id, data: { notes: v } } })}
                      rows={2}
                    />
                  </FieldGroup>

                  <div className="flex justify-end">
                    <SecondaryButton onClick={() => dispatch({ type: "REMOVE_CLOSURE", payload: cl.id })}>
                      Remove
                    </SecondaryButton>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}>
          ← Back
        </SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}>
          Next: Contestability →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
