"use client"

import { useCEOConsoleStore } from "@/lib/ceo-console-store"
import type { AuditUnit } from "@/lib/types"
import { ROLE_OPTIONS, CONSEQUENCE_OPTIONS, SCAN_BASIS_OPTIONS } from "@/lib/questions"
import {
  PageContainer, SectionTitle, SectionBanner, FieldGroup, Label,
  TextInput, Select, ChoiceGroup, PrimaryButton,
} from "@/components/evidence/shared"

export function AuditUnitSetup() {
  const { state, dispatch } = useCEOConsoleStore()
  const u = state.auditCase.audit_unit

  function set(data: Partial<AuditUnit>) {
    dispatch({ type: "SET_AUDIT_UNIT", payload: data })
  }

  return (
    <PageContainer>
      <SectionTitle>Step 1 — CEO Entry</SectionTitle>

      <SectionBanner>
        This section defines the audit unit: the organization, the AI-enabled decision system, and the
        consequence at stake. It does not ask what you believe — only what the system does.
      </SectionBanner>

      <FieldGroup>
        <Label htmlFor="organization-name">Organization Name</Label>
        <TextInput id="organization-name" value={u.organization_name} onChange={v => set({ organization_name: v })} placeholder="Organization name" />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="user-role">Role of User</Label>
        <Select id="user-role" value={u.user_role} onChange={v => set({ user_role: v })} options={ROLE_OPTIONS} />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="ai-system-name">AI System Name</Label>
        <TextInput id="ai-system-name" value={u.ai_system_name} onChange={v => set({ ai_system_name: v })} placeholder="e.g. Applicant Screening Model" />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="industry-domain">Industry / Domain</Label>
        <TextInput id="industry-domain" value={u.industry_domain} onChange={v => set({ industry_domain: v })} placeholder="e.g. Financial services, Healthcare, Retail" />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="primary-decision" hint="What does this AI system decide?">Primary Decision Affected by the AI System</Label>
        <TextInput id="primary-decision" value={u.primary_decision} onChange={v => set({ primary_decision: v })} placeholder="e.g. Which applicants are shortlisted for interview" />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="who-is-evaluated">Who Is Evaluated by the System?</Label>
        <TextInput id="who-is-evaluated" value={u.who_is_evaluated} onChange={v => set({ who_is_evaluated: v })} placeholder="e.g. Job applicants, borrowers, platform workers" />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="consequence">What Consequence Can Result from the System?</Label>
        <Select id="consequence" value={u.consequence} onChange={v => set({ consequence: v })} options={CONSEQUENCE_OPTIONS} />
      </FieldGroup>

      <FieldGroup>
        <ChoiceGroup
          label="Is This Scan Self-Reported, Document-Supported, or Evidence-Supported?"
          value={u.scan_basis}
          onChange={v => set({ scan_basis: v })}
          options={SCAN_BASIS_OPTIONS}
        />
      </FieldGroup>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}>
          Next: Decision System Map →
        </PrimaryButton>
      </div>
    </PageContainer>
  )
}
