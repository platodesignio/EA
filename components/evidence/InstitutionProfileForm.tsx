"use client"

import { useState } from "react"
import { useEvidenceStore } from "@/lib/evidence-store"
import type { InstitutionType, ClassifiedSubject, InstitutionProfile, GovernanceClaimCategory } from "@/lib/ddat-evidence-schema"
import { governanceClaimCategoryLabel } from "@/lib/ddat-judgment"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  TextInput, Textarea, Select, PrimaryButton, SecondaryButton, Card, Toggle,
} from "./shared"

const GOVERNANCE_CLAIM_CATEGORY_OPTIONS: { value: GovernanceClaimCategory; label: string }[] = (
  ["human_review", "appeal_rights", "data_correction", "non_discrimination", "transparency", "data_retention_limits", "re_entry_support", "accountability", "other"] as GovernanceClaimCategory[]
).map(value => ({ value, label: governanceClaimCategoryLabel(value) }))

function newClaim() {
  return {
    id: crypto.randomUUID(),
    category: "human_review" as GovernanceClaimCategory,
    claim_text: "",
    source: "",
    self_reported: true,
  }
}

const INSTITUTION_TYPE_OPTIONS: { value: InstitutionType; label: string }[] = [
  { value: "hiring_ai",         label: "Hiring AI" },
  { value: "credit_ai",         label: "Credit AI" },
  { value: "welfare_ai",        label: "Welfare AI" },
  { value: "housing_screening", label: "Housing Screening" },
  { value: "education_ai",      label: "Education AI" },
  { value: "medical_ai",        label: "Medical AI" },
  { value: "labor_platform",    label: "Labour Platform" },
  { value: "insurance_ai",      label: "Insurance AI" },
  { value: "other",             label: "Other" },
]

const SUBJECT_OPTIONS: { value: ClassifiedSubject; label: string }[] = [
  { value: "applicant",          label: "Applicant" },
  { value: "worker",             label: "Worker" },
  { value: "tenant",             label: "Tenant" },
  { value: "borrower",           label: "Borrower" },
  { value: "student",            label: "Student" },
  { value: "patient",            label: "Patient" },
  { value: "welfare_recipient",  label: "Welfare Recipient" },
  { value: "platform_worker",    label: "Platform Worker" },
  { value: "insured_person",     label: "Insured Person" },
  { value: "other",              label: "Other" },
]

export function InstitutionProfileForm() {
  const { state, dispatch } = useEvidenceStore()
  const p = state.auditCase.institution_profile
  const claims = state.auditCase.governance_claims
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null)

  function set(data: Partial<InstitutionProfile>) {
    dispatch({ type: "SET_PROFILE", payload: data })
  }

  return (
    <PageContainer>
      <SectionTitle>Step 1 — Institution Profile</SectionTitle>

      <SectionBanner>
        This profile describes the institution and its decision architecture, not the moral worth or ability of any person.
      </SectionBanner>

      <FieldGroup>
        <Label>Institution Type</Label>
        <Select
          value={p.institution_type}
          onChange={v => set({ institution_type: v })}
          options={INSTITUTION_TYPE_OPTIONS}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>System Name</Label>
        <TextInput
          value={p.system_name}
          onChange={v => set({ system_name: v })}
          placeholder="e.g. TalentScreen Pro, RentScore Evaluator"
        />
      </FieldGroup>

      <FieldGroup>
        <Label>Audited Institution</Label>
        <TextInput
          value={p.audited_institution}
          onChange={v => set({ audited_institution: v })}
          placeholder="Organisation name or description"
        />
      </FieldGroup>

      <FieldGroup>
        <Label>Decision Domain</Label>
        <TextInput
          value={p.decision_domain}
          onChange={v => set({ decision_domain: v })}
          placeholder="e.g. Initial candidate screening, Welfare eligibility assessment"
        />
      </FieldGroup>

      <FieldGroup>
        <Label>Classified Subject</Label>
        <Select
          value={p.classified_subject}
          onChange={v => set({ classified_subject: v })}
          options={SUBJECT_OPTIONS}
        />
      </FieldGroup>

      <FieldGroup>
        <Label hint="How and why does the system make decisions?">Decision Context</Label>
        <Textarea
          value={p.decision_context}
          onChange={v => set({ decision_context: v })}
          placeholder="Describe the decision-making process, what the system does, who is affected, and under what conditions decisions are made."
          rows={4}
        />
      </FieldGroup>

      <FieldGroup>
        <Label hint="What is this audit trying to find out?">Audit Purpose</Label>
        <Textarea
          value={p.audit_purpose}
          onChange={v => set({ audit_purpose: v })}
          placeholder="State the specific audit question. What risks, failures, or patterns are you investigating?"
          rows={3}
        />
      </FieldGroup>

      <FieldGroup>
        <Label hint="What the institution states this system is for, in its own words">Declared Master Function</Label>
        <Textarea
          value={p.declared_master_function}
          onChange={v => set({ declared_master_function: v })}
          placeholder="Quote or paraphrase the institution's own stated purpose for this system, e.g. 'to support fair and consistent evaluation of all applicants'."
          rows={3}
        />
        <p className="text-[10px] text-gray-500 mt-2 font-mono">
          This is the institution&apos;s declared function. It is compared against the operational function derived from evidence recorded later in this audit — the audit does not assume the two match.
        </p>
      </FieldGroup>

      {/* ─── Declared Governance Claims ────────────────────────── */}
      <div className="mb-10 pt-6 border-t border-gray-100">
        <h3 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider mb-1">
          Declared Governance Claims
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Record specific commitments the institution makes about this system — in policy documents, its website, or public statements.
          Each claim is checked later against the operational structure recorded in this audit; a mismatch is reported as a contradiction finding.
        </p>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-600">{claims.length} claim{claims.length !== 1 ? "s" : ""} recorded</p>
          <SecondaryButton
            onClick={() => {
              const c = newClaim()
              dispatch({ type: "ADD_GOVERNANCE_CLAIM", payload: c })
              setExpandedClaim(c.id)
            }}
          >
            + Add Claim
          </SecondaryButton>
        </div>

        {claims.length === 0 && (
          <p className="text-xs text-gray-500 font-mono py-4 border border-dashed border-gray-200 text-center">
            No governance claims recorded yet.
          </p>
        )}

        <div className="space-y-2">
          {claims.map(c => (
            <Card key={c.id} className={expandedClaim === c.id ? "border-gray-400" : ""}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedClaim(expandedClaim === c.id ? null : c.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono border border-gray-200 px-1.5 py-0.5 text-gray-500">
                    {governanceClaimCategoryLabel(c.category)}
                  </span>
                  <span className="text-sm text-gray-900">{c.claim_text || "(claim not yet written)"}</span>
                </div>
                <span className="text-gray-300 text-xs">{expandedClaim === c.id ? "▲" : "▼"}</span>
              </div>

              {expandedClaim === c.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  <FieldGroup>
                    <Label>Category</Label>
                    <Select
                      value={c.category}
                      onChange={v => dispatch({ type: "UPDATE_GOVERNANCE_CLAIM", payload: { id: c.id, data: { category: v } } })}
                      options={GOVERNANCE_CLAIM_CATEGORY_OPTIONS}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Claim Text</Label>
                    <Textarea
                      value={c.claim_text}
                      onChange={v => dispatch({ type: "UPDATE_GOVERNANCE_CLAIM", payload: { id: c.id, data: { claim_text: v } } })}
                      placeholder="e.g. 'All applicants receive a human review of any adverse decision.'"
                      rows={2}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Source</Label>
                    <TextInput
                      value={c.source}
                      onChange={v => dispatch({ type: "UPDATE_GOVERNANCE_CLAIM", payload: { id: c.id, data: { source: v } } })}
                      placeholder="e.g. Public policy page, terms of service, press statement"
                    />
                  </FieldGroup>

                  <Toggle
                    value={c.self_reported}
                    onChange={v => dispatch({ type: "UPDATE_GOVERNANCE_CLAIM", payload: { id: c.id, data: { self_reported: v } } })}
                    label="This claim is self-reported by the institution (no independent corroboration)"
                  />

                  <div className="flex justify-end">
                    <SecondaryButton onClick={() => dispatch({ type: "REMOVE_GOVERNANCE_CLAIM", payload: c.id })}>
                      Remove
                    </SecondaryButton>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}>
          Next: Classification Map →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
