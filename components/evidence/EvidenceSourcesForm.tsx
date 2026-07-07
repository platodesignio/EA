"use client"

import { useState } from "react"
import { useEvidenceStore } from "@/lib/evidence-store"
import type { SourceType, EvidenceLevel } from "@/lib/ddat-evidence-schema"
import { evidenceLevelLabel } from "@/lib/ddat-judgment"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  TextInput, Textarea, Select, PrimaryButton, SecondaryButton, Card,
} from "./shared"

const SOURCE_TYPE_OPTIONS: { value: SourceType; label: string }[] = [
  { value: "theoretical_hypothesis", label: "Theoretical Hypothesis" },
  { value: "simulated_scenario",     label: "Simulated Scenario" },
  { value: "public_document",        label: "Public Document" },
  { value: "policy_document",        label: "Policy Document" },
  { value: "rejection_notice",       label: "Rejection Notice" },
  { value: "website_or_FAQ",         label: "Website / FAQ" },
  { value: "counterfactual_test",    label: "Counterfactual Test" },
  { value: "interview_record",       label: "Interview Record" },
  { value: "survey_record",          label: "Survey Record" },
  { value: "longitudinal_record",    label: "Longitudinal Record" },
  { value: "third_party_audit",      label: "Third-party Audit" },
  { value: "other",                  label: "Other" },
]

const EVIDENCE_LEVEL_OPTIONS: { value: string; label: string }[] = [
  { value: "0", label: "0 — Theoretical hypothesis" },
  { value: "1", label: "1 — Simulated scenario" },
  { value: "2", label: "2 — Public document evidence" },
  { value: "3", label: "3 — Counterfactual test" },
  { value: "4", label: "4 — Real case record" },
  { value: "5", label: "5 — Longitudinal record" },
  { value: "6", label: "6 — Third-party reproducible audit" },
]

function newSource() {
  return {
    id: crypto.randomUUID(),
    source_type: "theoretical_hypothesis" as SourceType,
    title: "",
    citation_or_url: "",
    date: "",
    reliability_notes: "",
    evidence_level: 0 as EvidenceLevel,
  }
}

export function EvidenceSourcesForm() {
  const { state, dispatch } = useEvidenceStore()
  const sources = state.auditCase.evidence_sources
  const [expanded, setExpanded] = useState<string | null>(null)

  const maxLevel = (sources.reduce<number>((m, s) => Math.max(m, s.evidence_level), 0)) as EvidenceLevel
  const minLevel: EvidenceLevel | null = sources.length
    ? (sources.reduce<number>((m, s) => Math.min(m, s.evidence_level), 6)) as EvidenceLevel
    : null

  return (
    <PageContainer>
      <SectionTitle>Step 6 — Evidence Sources &amp; Grade</SectionTitle>

      <SectionBanner>
        Evidence quality determines how much institutional weight the audit judgment can carry.
        A theoretical hypothesis and a third-party audit are not equivalent.
        Record all sources and their limitations.
      </SectionBanner>

      {/* Summary */}
      {sources.length > 0 && (
        <div className="border border-gray-200 p-4 mb-8 grid grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Sources</p>
            <p className="text-xl font-mono font-bold text-gray-900">{sources.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Highest Level</p>
            <p className="text-xl font-mono font-bold text-gray-900">{maxLevel}</p>
            <p className="text-[10px] text-gray-500">{evidenceLevelLabel(maxLevel)}</p>
          </div>
          {minLevel !== null && minLevel !== maxLevel && (
            <div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Weakest Source</p>
              <p className="text-xl font-mono font-bold text-gray-500">{minLevel}</p>
              <p className="text-[10px] text-gray-500">{evidenceLevelLabel(minLevel)}</p>
            </div>
          )}
        </div>
      )}

      {/* Evidence levels reference */}
      <div className="mb-6 text-[10px] font-mono text-gray-500 border border-gray-200 p-3">
        <p className="font-bold text-gray-700 mb-2">Evidence levels:</p>
        <div className="space-y-0.5">
          {EVIDENCE_LEVEL_OPTIONS.map(o => (
            <div key={o.value} className={Number(o.value) <= 1 ? "text-gray-300" : Number(o.value) >= 5 ? "text-gray-700" : ""}>
              {o.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">{sources.length} source{sources.length !== 1 ? "s" : ""} documented</p>
        <SecondaryButton
          onClick={() => {
            const s = newSource()
            dispatch({ type: "ADD_EVIDENCE", payload: s })
            setExpanded(s.id)
          }}
        >
          + Add Source
        </SecondaryButton>
      </div>

      {sources.length === 0 && (
        <p className="text-xs text-gray-500 font-mono py-6 border border-dashed border-gray-200 text-center">
          No evidence sources yet. Add at least one to ground the audit judgment.
        </p>
      )}

      <div className="space-y-2 mb-10">
        {sources.map(s => (
          <Card key={s.id} className={expanded === s.id ? "border-gray-400" : ""}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono border border-gray-200 px-1.5 py-0.5 text-gray-500">
                  Level {s.evidence_level}
                </span>
                <span className="text-sm text-gray-900">{s.title || "(untitled source)"}</span>
                <span className="text-[10px] text-gray-500">{s.source_type}</span>
              </div>
              <span className="text-gray-300 text-xs">{expanded === s.id ? "▲" : "▼"}</span>
            </div>

            {expanded === s.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                <FieldGroup>
                  <Label>Title</Label>
                  <TextInput
                    value={s.title}
                    onChange={v => dispatch({ type: "UPDATE_EVIDENCE", payload: { id: s.id, data: { title: v } } })}
                    placeholder="Source title or description"
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label>Source Type</Label>
                  <Select
                    value={s.source_type}
                    onChange={v => dispatch({ type: "UPDATE_EVIDENCE", payload: { id: s.id, data: { source_type: v } } })}
                    options={SOURCE_TYPE_OPTIONS}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label>Evidence Level</Label>
                  <select
                    value={s.evidence_level}
                    onChange={e => dispatch({ type: "UPDATE_EVIDENCE", payload: { id: s.id, data: { evidence_level: Number(e.target.value) as EvidenceLevel } } })}
                    className="w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors appearance-none"
                  >
                    {EVIDENCE_LEVEL_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup>
                    <Label>Citation or URL</Label>
                    <TextInput
                      value={s.citation_or_url}
                      onChange={v => dispatch({ type: "UPDATE_EVIDENCE", payload: { id: s.id, data: { citation_or_url: v } } })}
                      placeholder="URL or citation"
                    />
                  </FieldGroup>
                  <FieldGroup>
                    <Label>Date</Label>
                    <TextInput
                      value={s.date}
                      onChange={v => dispatch({ type: "UPDATE_EVIDENCE", payload: { id: s.id, data: { date: v } } })}
                      placeholder="YYYY-MM-DD"
                    />
                  </FieldGroup>
                </div>

                <FieldGroup>
                  <Label>Reliability Notes</Label>
                  <Textarea
                    value={s.reliability_notes}
                    onChange={v => dispatch({ type: "UPDATE_EVIDENCE", payload: { id: s.id, data: { reliability_notes: v } } })}
                    placeholder="What are the limitations of this source? Who produced it? Can it be independently verified?"
                    rows={2}
                  />
                </FieldGroup>

                <div className="flex justify-end">
                  <SecondaryButton onClick={() => dispatch({ type: "REMOVE_EVIDENCE", payload: s.id })}>
                    Remove
                  </SecondaryButton>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}>
          ← Back
        </SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 7 })}>
          Generate Judgment →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
