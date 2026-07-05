"use client"

import { useEvidenceStore } from "@/lib/evidence-store"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  TextInput, Textarea, Toggle, NumberInput, PrimaryButton, SecondaryButton, Select,
} from "./shared"

export function SupportReentryForm() {
  const { state, dispatch } = useEvidenceStore()
  const sp = state.auditCase.support
  const re = state.auditCase.reentry
  const rs = state.auditCase.responsibility

  return (
    <PageContainer>
      <SectionTitle>Step 4 — Support, Re-entry &amp; Responsibility</SectionTitle>

      <SectionBanner>
        A system that classifies without offering support, re-entry, or named responsibility
        functions as durable exclusion. Record what the institution offers and who is accountable.
      </SectionBanner>

      {/* ─── Support Conversion ────────────────────────────── */}
      <div className="mb-10">
        <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider mb-1">
          Support Conversion
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          What does the system offer after an adverse classification? Distinguish formal support from practically available support.
        </p>

        <div className="space-y-3 mb-5">
          {[
            { key: "support_offered" as const,                label: "Support is offered after adverse classification" },
            { key: "training_offered" as const,               label: "Training or development pathway is offered" },
            { key: "reassessment_date_given" as const,        label: "Reassessment date is given" },
            { key: "case_worker_available" as const,          label: "Case worker or advisor is available" },
            { key: "alternative_pathway_available" as const,  label: "Alternative access pathway is available" },
            { key: "intervention_available" as const,         label: "Active intervention is available" },
          ].map(({ key, label }) => (
            <Toggle
              key={key}
              value={sp[key]}
              onChange={v => dispatch({ type: "SET_SUPPORT", payload: { [key]: v } })}
              label={label}
            />
          ))}
        </div>

        <FieldGroup>
          <Label>Support Notes</Label>
          <Textarea
            value={sp.support_notes}
            onChange={v => dispatch({ type: "SET_SUPPORT", payload: { support_notes: v } })}
            placeholder="Is the support formal or practically accessible? Is there evidence it is effective? Does it require the subject to seek it out?"
            rows={3}
          />
        </FieldGroup>
      </div>

      {/* ─── Re-entry Timeline ─────────────────────────────── */}
      <div className="mb-10">
        <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider mb-1">
          Re-entry Timeline
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Does the system allow future transformation? Do past classifications expire? Is re-entry real or formal?
        </p>

        <div className="space-y-3 mb-5">
          <Toggle
            value={re.reapplication_allowed}
            onChange={v => dispatch({ type: "SET_REENTRY", payload: { reapplication_allowed: v } })}
            label="Reapplication is allowed"
          />
          <Toggle
            value={re.past_classification_persists}
            onChange={v => dispatch({ type: "SET_REENTRY", payload: { past_classification_persists: v } })}
            label="Past classification persists indefinitely"
          />
          <Toggle
            value={re.reassessment_available}
            onChange={v => dispatch({ type: "SET_REENTRY", payload: { reassessment_available: v } })}
            label="Reassessment is available"
          />
          <Toggle
            value={re.reentry_conditions_clear}
            onChange={v => dispatch({ type: "SET_REENTRY", payload: { reentry_conditions_clear: v } })}
            label="Re-entry conditions are clearly stated"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <FieldGroup>
            <Label hint="days">Waiting Period</Label>
            <NumberInput
              value={re.waiting_period_days}
              onChange={v => dispatch({ type: "SET_REENTRY", payload: { waiting_period_days: v } })}
              placeholder="days"
              min={0}
            />
          </FieldGroup>
          <FieldGroup>
            <Label hint="null = never expires">Score Expiration</Label>
            <NumberInput
              value={re.score_expiration_days}
              onChange={v => dispatch({ type: "SET_REENTRY", payload: { score_expiration_days: v } })}
              placeholder="days"
              min={0}
            />
          </FieldGroup>
          <FieldGroup>
            <Label hint="days between re-assessments">Reassessment Interval</Label>
            <NumberInput
              value={re.reassessment_interval_days}
              onChange={v => dispatch({ type: "SET_REENTRY", payload: { reassessment_interval_days: v } })}
              placeholder="days"
              min={0}
            />
          </FieldGroup>
        </div>

        <FieldGroup>
          <Label>Re-entry Notes</Label>
          <Textarea
            value={re.reentry_notes}
            onChange={v => dispatch({ type: "SET_REENTRY", payload: { reentry_notes: v } })}
            placeholder="Is re-entry practically achievable? Does the system require the subject to resolve conditions they cannot control?"
            rows={3}
          />
        </FieldGroup>
      </div>

      {/* ─── Responsibility Map ─────────────────────────────── */}
      <div className="mb-10">
        <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider mb-1">
          Responsibility Map
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Who is accountable? Responsibility displacement — onto the AI, onto the vendor, onto the subject — is itself an audit finding.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {[
            { key: "classification_design_owner" as const, label: "Classification Design Owner" },
            { key: "decision_owner" as const,        label: "Decision Owner" },
            { key: "system_operator" as const,       label: "System Operator" },
            { key: "AI_vendor" as const,             label: "AI Vendor" },
            { key: "data_provider" as const,         label: "Data Provider" },
            { key: "appeal_owner" as const,          label: "Appeal Owner" },
            { key: "correction_owner" as const,      label: "Correction Owner" },
            { key: "human_override_owner" as const,  label: "Human Override Owner" },
            { key: "governance_oversight_owner" as const, label: "Governance Oversight Owner" },
            { key: "audit_owner" as const,           label: "Audit Owner" },
          ].map(({ key, label }) => (
            <FieldGroup key={key}>
              <Label>{label}</Label>
              <TextInput
                value={rs[key]}
                onChange={v => dispatch({ type: "SET_RESPONSIBILITY", payload: { [key]: v } })}
                placeholder="Name or '(not named)'"
              />
            </FieldGroup>
          ))}
        </div>

        <div className="space-y-3 mb-4">
          <Toggle
            value={rs.responsible_contact_exists}
            onChange={v => dispatch({ type: "SET_RESPONSIBILITY", payload: { responsible_contact_exists: v } })}
            label="A responsible contact exists and is reachable by affected subjects"
          />
          <Toggle
            value={rs.override_authority_exists}
            onChange={v => dispatch({ type: "SET_RESPONSIBILITY", payload: { override_authority_exists: v } })}
            label="Override authority exists and can reverse decisions"
          />
        </div>

        <FieldGroup>
          <Label hint="Was this accountability chain confirmed independently, or taken from the institution's own account?">Responsibility Basis</Label>
          <Select
            value={rs.responsibility_basis}
            onChange={v => dispatch({ type: "SET_RESPONSIBILITY", payload: { responsibility_basis: v } })}
            options={[
              { value: "declared", label: "Declared — institution's own account" },
              { value: "independently_verified", label: "Independently Verified" },
            ]}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>Responsibility Notes</Label>
          <Textarea
            value={rs.responsibility_notes}
            onChange={v => dispatch({ type: "SET_RESPONSIBILITY", payload: { responsibility_notes: v } })}
            placeholder="Is responsibility displaced onto the AI system? Is the vendor's model logic disclosed? Are there structural gaps between formal and real accountability?"
            rows={3}
          />
        </FieldGroup>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-between">
        <SecondaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}>
          ← Back
        </SecondaryButton>
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 5 })}>
          Next: Counterfactual Test →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
