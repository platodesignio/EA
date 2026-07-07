"use client"

import { useState } from "react"
import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import type { DecisionStageKey } from "@/lib/types"
import {
  DECISION_STAGE_ORDER, DECISION_STAGE_LABEL, STAGE_EXISTS_OPTIONS,
  EVIDENCE_TIER_OPTIONS, RESPONSIBILITY_CLARITY_OPTIONS,
} from "@/lib/questions"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  TextInput, Toggle, ChoiceGroup, PrimaryButton, SecondaryButton, Card,
} from "@/components/evidence/shared"

export function DecisionSystemMap() {
  const { state, dispatch } = useCEOConsoleStore()
  const stages = state.auditCase.decision_stages
  const [expanded, setExpanded] = useState<DecisionStageKey | null>(DECISION_STAGE_ORDER[0])

  return (
    <PageContainer>
      <SectionTitle>Step 2 — AI Decision System Map</SectionTitle>

      <SectionBanner>
        Input Data → Model / Scoring Logic → Output → Human Review → Decision → Consequence → Appeal → Re-entry.
        For each stage: does it exist, who owns it, is it documented, and what evidence supports it?
      </SectionBanner>

      <div className="mb-6 flex flex-wrap gap-1.5 text-[11px] font-mono text-gray-500">
        {DECISION_STAGE_ORDER.map((key, i) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="border border-gray-200 px-2 py-0.5">{DECISION_STAGE_LABEL[key]}</span>
            {i < DECISION_STAGE_ORDER.length - 1 && <span className="text-gray-300">→</span>}
          </span>
        ))}
      </div>

      <div className="space-y-2 mb-10">
        {DECISION_STAGE_ORDER.map(key => {
          const s = stages[key]
          const isOpen = expanded === key
          return (
            <Card key={key} className={isOpen ? "border-gray-400" : ""}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(isOpen ? null : key)}>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono border border-gray-200 px-1.5 py-0.5 text-gray-500 uppercase">
                    {s.exists}
                  </span>
                  <span className="text-sm text-gray-900">{DECISION_STAGE_LABEL[key]}</span>
                  {s.owner && <span className="text-xs text-gray-500">{s.owner}</span>}
                </div>
                <span className="text-gray-300 text-xs">{isOpen ? "▲" : "▼"}</span>
              </div>

              {isOpen && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  <ChoiceGroup
                    label="Does This Stage Exist?"
                    value={s.exists}
                    onChange={v => dispatch({ type: "SET_STAGE", payload: { key, data: { exists: v } } })}
                    options={STAGE_EXISTS_OPTIONS}
                  />

                  <FieldGroup>
                    <Label htmlFor={`stage-owner-${key}`}>Who Owns It?</Label>
                    <TextInput
                      id={`stage-owner-${key}`}
                      value={s.owner}
                      onChange={v => dispatch({ type: "SET_STAGE", payload: { key, data: { owner: v } } })}
                      placeholder="Name or team, or '(not named)'"
                    />
                  </FieldGroup>

                  <Toggle
                    value={s.documented}
                    onChange={v => dispatch({ type: "SET_STAGE", payload: { key, data: { documented: v } } })}
                    label="This stage is documented"
                  />

                  <ChoiceGroup
                    label="What Evidence Supports It?"
                    value={s.evidence}
                    onChange={v => dispatch({ type: "SET_STAGE", payload: { key, data: { evidence: v } } })}
                    options={EVIDENCE_TIER_OPTIONS}
                  />

                  <ChoiceGroup
                    label="Responsibility Clarity"
                    value={s.responsibility_clarity}
                    onChange={v => dispatch({ type: "SET_STAGE", payload: { key, data: { responsibility_clarity: v } } })}
                    options={RESPONSIBILITY_CLARITY_OPTIONS}
                  />
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}>← Back</SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}>
          Next: Master Function Detection →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
