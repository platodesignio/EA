"use client"

import { useEvidenceStore } from "@/lib/evidence-store"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  Textarea, Toggle, NumberInput, PrimaryButton, SecondaryButton, ScoreSelect,
} from "./shared"

const SPECIFICITY_OPTIONS: { value: 0|1|2|3; label: string }[] = [
  { value: 0, label: "None" },
  { value: 1, label: "Generic" },
  { value: 2, label: "Category-level" },
  { value: 3, label: "Actionable and specific" },
]

export function ContestabilityForm() {
  const { state, dispatch } = useEvidenceStore()
  const ct = state.auditCase.contestability

  function set(data: Partial<typeof ct>) {
    dispatch({ type: "SET_CONTESTABILITY", payload: data })
  }

  return (
    <PageContainer>
      <SectionTitle>Step 3 — Explanation &amp; Contestability</SectionTitle>

      <SectionBanner>
        Record whether affected subjects can understand, challenge, and correct the system&apos;s decisions.
        Formal existence of an appeal mechanism is not the same as practical accessibility.
      </SectionBanner>

      {/* Explanation */}
      <div className="mb-8">
        <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider mb-4">
          Explanation
        </h3>

        <FieldGroup>
          <Toggle
            value={ct.explanation_provided}
            onChange={v => set({ explanation_provided: v })}
            label="Explanation is provided to affected subjects"
          />
        </FieldGroup>

        <FieldGroup>
          <ScoreSelect
            value={ct.explanation_specificity}
            onChange={v => set({ explanation_specificity: v })}
            options={SPECIFICITY_OPTIONS}
            label="Explanation Specificity"
          />
          <p className="text-[10px] text-gray-500 mt-2 font-mono">
            0 = No explanation provided · 1 = Generic ("your application was unsuccessful") ·
            2 = Category-level ("flagged for administrative anomalies") ·
            3 = Actionable and specific (names variables, indicates what could change)
          </p>
        </FieldGroup>

        <FieldGroup>
          <Toggle
            value={ct.explanation_actionable}
            onChange={v => set({ explanation_actionable: v })}
            label="Explanation enables the subject to understand what would change the outcome"
          />
        </FieldGroup>
      </div>

      {/* Appeal */}
      <div className="mb-8">
        <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider mb-4">
          Appeal and Correction
        </h3>

        <div className="space-y-4">
          <Toggle
            value={ct.appeal_available}
            onChange={v => set({ appeal_available: v })}
            label="Appeal pathway is available"
          />
          <Toggle
            value={ct.correction_available}
            onChange={v => set({ correction_available: v })}
            label="Subject can correct input variables or data errors"
          />
          <Toggle
            value={ct.human_review_available}
            onChange={v => set({ human_review_available: v })}
            label="Human review is available (with actual override authority)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <FieldGroup>
            <Label hint="null = no limit stated">Appeal Time Limit (days)</Label>
            <NumberInput
              value={ct.appeal_time_limit_days}
              onChange={v => set({ appeal_time_limit_days: v })}
              placeholder="days, or leave blank"
              min={0}
            />
          </FieldGroup>
          <FieldGroup>
            <Label hint="null = not stated">Response Time (days)</Label>
            <NumberInput
              value={ct.response_time_days}
              onChange={v => set({ response_time_days: v })}
              placeholder="days, or leave blank"
              min={0}
            />
          </FieldGroup>
        </div>
      </div>

      <FieldGroup>
        <Label hint="quality of human review, practical barriers, symbolic vs. real appeal">Notes</Label>
        <Textarea
          value={ct.notes}
          onChange={v => set({ notes: v })}
          placeholder="Is the appeal process practically accessible? Does human review have real override authority? Are there language, cost, or information barriers?"
          rows={4}
        />
      </FieldGroup>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}>
          ← Back
        </SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 4 })}>
          Next: Support &amp; Re-entry →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
