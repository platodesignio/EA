"use client"

import { useMemo } from "react"
import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import { deriveMasterFunction } from "@/lib/scoring"
import {
  DECLARED_MASTER_FUNCTION_OPTIONS, ANSWER_SCALE_OPTIONS,
  MASTER_FUNCTION_QUESTION_ORDER, MASTER_FUNCTION_QUESTION_TEXT,
} from "@/lib/questions"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  Select, ChoiceGroup, PrimaryButton, SecondaryButton, Card,
} from "@/components/evidence/shared"

export function MasterFunctionDetection() {
  const { state, dispatch } = useCEOConsoleStore()
  const mfState = state.auditCase.master_function

  const result = useMemo(
    () => deriveMasterFunction(mfState.declared, mfState.answers),
    [mfState.declared, mfState.answers]
  )

  return (
    <PageContainer>
      <SectionTitle>Step 3 — Master Function Detection</SectionTitle>

      <SectionBanner>
        The master function is the operational function that occupies practical authority over the evaluated
        human. It may differ from the function declared by the organization.
      </SectionBanner>

      <FieldGroup>
        <Label>Declared Function</Label>
        <Select
          value={mfState.declared}
          onChange={v => dispatch({ type: "SET_DECLARED_MASTER_FUNCTION", payload: v })}
          options={DECLARED_MASTER_FUNCTION_OPTIONS}
        />
      </FieldGroup>

      <div className="mb-8 pt-4 border-t border-gray-100 space-y-6">
        {MASTER_FUNCTION_QUESTION_ORDER.map((key, i) => (
          <ChoiceGroup
            key={key}
            label={`${i + 1}. ${MASTER_FUNCTION_QUESTION_TEXT[key]}`}
            value={mfState.answers[key]}
            onChange={v => dispatch({ type: "SET_MASTER_FUNCTION_ANSWER", payload: { key, value: v } })}
            options={ANSWER_SCALE_OPTIONS}
          />
        ))}
      </div>

      <Card className="mb-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
          Detection Output
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Declared Master Function</p>
            <p className="text-sm text-gray-900">
              {DECLARED_MASTER_FUNCTION_OPTIONS.find(o => o.value === result.declared)?.label}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">Operational Master Function</p>
            <p className="text-sm text-gray-900">{result.operational.join(", ")}</p>
          </div>
        </div>
        <p className="text-[11px] font-mono font-bold text-gray-900 uppercase tracking-wide mb-3">
          Function Mismatch Risk: {result.functionMismatchRisk}
        </p>
        <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
          This is separate from the Contradiction Index in Step 6, which tests different claims (human
          oversight, transparency, fairness) against the operational structure.
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          The operational master function is the function that appears to hold practical authority over the
          evaluated human, based on the answers and evidence provided.
        </p>
      </Card>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}>← Back</SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 4 })}>
          Next: Accountability Chain →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
