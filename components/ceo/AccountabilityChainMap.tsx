"use client"

import { useState } from "react"
import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import type { ChainItemKey } from "@/lib/types"
import { CHAIN_ITEM_ORDER, CHAIN_ITEM_LABEL, EVIDENCE_TIER_OPTIONS, RESPONSIBILITY_CLARITY_OPTIONS } from "@/lib/questions"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  TextInput, Textarea, Toggle, ChoiceGroup, PrimaryButton, SecondaryButton, Card,
} from "@/components/evidence/shared"

export function AccountabilityChainMap() {
  const { state, dispatch } = useCEOConsoleStore()
  const items = state.auditCase.chain_items
  const [expanded, setExpanded] = useState<ChainItemKey | null>(CHAIN_ITEM_ORDER[0])

  return (
    <PageContainer>
      <SectionTitle>Step 4 — Ontological Accountability Chain</SectionTitle>

      <SectionBanner>
        Belief / Strategic Intent → Business Model → Data Collection → Model / Scoring Logic → Interface / UX →
        Policy / Terms → Human Oversight → Decision Execution → Appeal / Complaint Handling → Re-entry / Recovery
        → Affected Human Future.
      </SectionBanner>

      <div className="mb-6 flex flex-wrap gap-1.5 text-[11px] font-mono text-gray-500">
        {CHAIN_ITEM_ORDER.map((key, i) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="border border-gray-200 px-2 py-0.5">{CHAIN_ITEM_LABEL[key]}</span>
            {i < CHAIN_ITEM_ORDER.length - 1 && <span className="text-gray-300">→</span>}
          </span>
        ))}
      </div>

      <div className="space-y-2 mb-10">
        {CHAIN_ITEM_ORDER.map(key => {
          const item = items[key]
          const isOpen = expanded === key
          return (
            <Card key={key} className={isOpen ? "border-gray-400" : ""}>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(isOpen ? null : key)}>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-900">{CHAIN_ITEM_LABEL[key]}</span>
                  {item.owner && <span className="text-xs text-gray-400">{item.owner}</span>}
                  {item.missing_documentation && (
                    <span className="text-[10px] font-mono border border-gray-900 text-gray-900 px-1.5 py-0.5 uppercase">
                      missing docs
                    </span>
                  )}
                </div>
                <span className="text-gray-300 text-xs">{isOpen ? "▲" : "▼"}</span>
              </div>

              {isOpen && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  <FieldGroup>
                    <Label>Responsible Owner</Label>
                    <TextInput
                      value={item.owner}
                      onChange={v => dispatch({ type: "SET_CHAIN_ITEM", payload: { key, data: { owner: v } } })}
                      placeholder="Name, team, or '(not named)'"
                    />
                  </FieldGroup>

                  <ChoiceGroup
                    label="Evidence Level"
                    value={item.evidence}
                    onChange={v => dispatch({ type: "SET_CHAIN_ITEM", payload: { key, data: { evidence: v } } })}
                    options={EVIDENCE_TIER_OPTIONS}
                  />

                  <ChoiceGroup
                    label="Responsibility Clarity"
                    value={item.responsibility_clarity}
                    onChange={v => dispatch({ type: "SET_CHAIN_ITEM", payload: { key, data: { responsibility_clarity: v } } })}
                    options={RESPONSIBILITY_CLARITY_OPTIONS}
                  />

                  <Toggle
                    value={item.missing_documentation}
                    onChange={v => dispatch({ type: "SET_CHAIN_ITEM", payload: { key, data: { missing_documentation: v } } })}
                    label="Documentation is missing for this link in the chain"
                  />

                  <FieldGroup>
                    <Label hint="optional">Risk Note</Label>
                    <Textarea
                      value={item.risk_note}
                      onChange={v => dispatch({ type: "SET_CHAIN_ITEM", payload: { key, data: { risk_note: v } } })}
                      placeholder="Anything specific about this link worth flagging"
                      rows={2}
                    />
                  </FieldGroup>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}>← Back</SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}>
          Next: Evidence Confidence →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
