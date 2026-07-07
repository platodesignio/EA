"use client"

import { useEvidenceStore } from "@/lib/evidence-store"
import { sampleDDATCases } from "@/data/sample-ddat-cases"
import { PageContainer, PrimaryButton, SecondaryButton, Card } from "./shared"

export function OverviewSection() {
  const { dispatch } = useEvidenceStore()

  return (
    <PageContainer>
      {/* Title */}
      <div className="mb-12">
        <p className="text-[10px] font-mono font-bold tracking-[0.3em] text-gray-500 uppercase mb-3">
          DDAT Evidence Simulator
        </p>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
          Audit the institution.<br />Not the person.
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
          DDAT (Dialectical Direction Audit Theory) is a research framework for evaluating
          whether AI-scored decision systems generate or close future possibilities for the
          people they classify. This simulator converts audit evidence into a structured
          institutional judgment.
        </p>
      </div>

      {/* Core principle */}
      <div className="border-l-2 border-gray-900 pl-5 mb-6">
        <p className="text-sm font-mono text-gray-900 leading-relaxed">
          &ldquo;The object of audit is the institution, not the individual.&rdquo;
        </p>
        <p className="text-xs text-gray-500 mt-1">DDAT Evidence Standard</p>
      </div>

      <div className="border-l-2 border-gray-900 pl-5 mb-12">
        <p className="text-sm font-mono text-gray-900 leading-relaxed">
          &ldquo;We do not measure private belief. We audit institutionalized commitments.&rdquo;
        </p>
        <p className="text-xs text-gray-500 mt-1">DDAT Evidence Standard</p>
      </div>

      {/* What DDAT audits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {[
          {
            title: "What gets audited",
            items: [
              "Classification regimes and input variables",
              "Access closures and their severity",
              "Explanation and contestability mechanisms",
              "Support conversion vs. punitive classification",
              "Re-entry timelines and temporal recovery",
              "Responsibility structure and gaps",
            ],
          },
          {
            title: "What does not get scored",
            items: [
              "The moral worth of the classified person",
              "The ability or effort of the individual",
              "The personal responsibility for systemic conditions",
              "Whether a person deserves their classification outcome",
              "Single aggregate 'person scores'",
            ],
          },
        ].map(col => (
          <div key={col.title}>
            <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
              {col.title}
            </p>
            <ul className="space-y-1.5">
              {col.items.map(item => (
                <li key={item} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-gray-300 mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Audit flow */}
      <div className="mb-12">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">
          Audit flow
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-gray-600">
          {[
            "Institution Profile",
            "Classification Map",
            "Closure Map",
            "Contestability",
            "Support Conversion",
            "Re-entry Timeline",
            "Responsibility Map",
            "Counterfactual Test",
            "Evidence Grade",
            "DDAT Judgment",
          ].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className="border border-gray-200 px-2 py-0.5">{step}</span>
              {i < arr.length - 1 && <span className="text-gray-300">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 mb-16">
        <PrimaryButton onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}>
          Start New Audit
        </PrimaryButton>
      </div>

      {/* Sample cases */}
      <div>
        <p className="text-[10px] font-mono font-bold tracking-[0.3em] text-gray-500 uppercase mb-5">
          Sample Audit Cases
        </p>
        <p className="text-xs text-gray-500 mb-5 font-mono border border-gray-200 px-3 py-2">
          ⚠ These are simulated research examples. They do not represent real institutions or constitute accusations against any named organisation.
        </p>
        <div className="space-y-3">
          {sampleDDATCases.map(c => (
            <Card key={c.id} className="hover:border-gray-400 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">
                    {c.institution_profile.institution_type.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mb-1">{c.institution_profile.system_name}</p>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-lg">
                    {c.institution_profile.decision_context.slice(0, 180)}…
                  </p>
                </div>
                <SecondaryButton
                  onClick={() => dispatch({ type: "LOAD_CASE", payload: c })}
                  className="shrink-0"
                >
                  Load
                </SecondaryButton>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="mt-16 pt-8 border-t border-gray-100">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
          About DDAT
        </p>
        <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
          DDAT (Dialectical Direction Audit Theory) is a methodological framework for evaluating
          algorithmic and institutional decision systems. It produces an evidence-based audit
          judgment — not a person score. The framework applies to hiring AI, credit scoring,
          welfare classification, housing screening, education placement, medical triage, and
          any other system in which automated judgment affects identifiable persons or groups.
          This prototype is a research tool, not a legal compliance instrument.
        </p>
      </div>
    </PageContainer>
  )
}
