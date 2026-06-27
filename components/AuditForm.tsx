"use client"

import { useStore } from "@/lib/store"
import { Button, StepLabel, Field, Input, Textarea, Select, Card, GrayCard } from "./ui"
import type { AuditDomain, AuditTarget } from "@/types/ddat"

const DOMAINS: { value: AuditDomain; label: string }[] = [
  { value: "education",  label: "Education" },
  { value: "labor",      label: "Labor" },
  { value: "welfare",    label: "Welfare" },
  { value: "healthcare", label: "Healthcare" },
  { value: "research",   label: "Research" },
  { value: "finance",    label: "Finance" },
  { value: "governance", label: "Governance" },
  { value: "platform",   label: "Platform" },
  { value: "other",      label: "Other" },
]

export function AuditForm() {
  const { state, dispatch } = useStore()
  const t = state.target
  const set = (key: keyof AuditTarget) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      dispatch({ type: "SET_TARGET", payload: { [key]: e.target.value } })

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <StepLabel n={1} label="Audit Target" />

      <GrayCard className="mb-6 text-xs text-[#6b7280]">
        Define the system being audited. This tool does not evaluate persons — it audits systems, institutions, and decision architectures.
      </GrayCard>

      <div className="space-y-8">
        <Card>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Field label="Audit Title">
              <Input value={t.auditTitle} onChange={set("auditTitle")} placeholder="e.g. AI Hiring Score Audit" />
            </Field>
            <Field label="Domain">
              <Select value={t.domain} onChange={set("domain")}>
                {DOMAINS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="System Description">
            <Textarea value={t.systemDescription} onChange={set("systemDescription")} rows={4}
              placeholder="Describe the system being audited in concrete terms..." />
          </Field>
        </Card>

        <Card>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#6b7280] uppercase mb-5">Decision Architecture</p>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Field label="Evaluator">
              <Input value={t.evaluator} onChange={set("evaluator")} placeholder="Who operates the system?" />
            </Field>
            <Field label="Evaluated Subject">
              <Input value={t.evaluatedSubject} onChange={set("evaluatedSubject")} placeholder="Who is evaluated?" />
            </Field>
          </div>
          <div className="space-y-5">
            <Field label="Data Inputs">
              <Textarea value={t.dataInputs} onChange={set("dataInputs")} placeholder="What data is collected and used?" />
            </Field>
            <Field label="Scoring Method">
              <Textarea value={t.scoringMethod} onChange={set("scoringMethod")} placeholder="How are scores or classifications produced?" />
            </Field>
            <Field label="Decision Outputs">
              <Input value={t.decisionOutputs} onChange={set("decisionOutputs")} placeholder="e.g. Advance / Reject / Hold" />
            </Field>
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#6b7280] uppercase mb-5">Accountability Mechanisms</p>
          <div className="grid grid-cols-3 gap-5">
            <Field label="Explanation" sub="How are decisions explained?">
              <Textarea value={t.explanationMechanism} onChange={set("explanationMechanism")} rows={3} placeholder="None / Limited / Full" />
            </Field>
            <Field label="Appeal" sub="Can decisions be contested?">
              <Textarea value={t.appealMechanism} onChange={set("appealMechanism")} rows={3} placeholder="None / Informal / Formal" />
            </Field>
            <Field label="Re-entry" sub="Can subjects return after failure?">
              <Textarea value={t.reentryMechanism} onChange={set("reentryMechanism")} rows={3} placeholder="None / Timed / Open" />
            </Field>
          </div>
        </Card>

        <Card>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#6b7280] uppercase mb-5">Social Context</p>
          <div className="space-y-5">
            <Field label="Known Affected Groups">
              <Textarea value={t.affectedGroups} onChange={set("affectedGroups")} placeholder="Who is systematically affected?" />
            </Field>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Intended Benefit">
                <Textarea value={t.intendedBenefit} onChange={set("intendedBenefit")} placeholder="What benefit is claimed?" />
              </Field>
              <Field label="Possible Harm">
                <Textarea value={t.possibleHarm} onChange={set("possibleHarm")} placeholder="What harms are possible?" />
              </Field>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button variant="ghost" onClick={() => dispatch({ type: "SET_STEP", payload: 0 })}>← Back</Button>
        <Button onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}>System Architecture →</Button>
      </div>
    </div>
  )
}
