"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"

type Tab = "overview" | "methodology" | "case" | "research" | "limitations" | "template"

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",     label: "Overview" },
  { id: "methodology",  label: "Methodology" },
  { id: "case",         label: "Case Report" },
  { id: "research",     label: "Research Basis" },
  { id: "limitations",  label: "Limitations" },
  { id: "template",     label: "Report Template" },
]

// ─── Tab panels ──────────────────────────────────────────────────────────────

function OverviewTab() {
  const { dispatch } = useStore()
  return (
    <div className="max-w-3xl">
      {/* What DDAT is */}
      <div className="mb-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase mb-4">
          What DDAT Audits
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          DDAT (Dialectical Direction Audit Theory) is a methodological framework for evaluating
          whether a decision system tends to generate or close future possibilities for affected persons
          and communities. It is not a tool for scoring persons, assessing moral worth, or issuing legal
          compliance judgments.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          The framework applies to any system in which algorithmic scoring, institutional classification,
          or automated judgment produces consequences that alter the opportunities, rights, burdens, or
          developmental trajectories of identifiable persons or groups.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Applicable domains include: hiring and labor, education placement, welfare eligibility, credit
          risk, criminal justice risk assessment, medical triage, academic evaluation, and public
          decision architectures.
        </p>
      </div>

      {/* DCR Formula */}
      <div className="border border-gray-200 p-6 mb-6">
        <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase mb-4">
          Directional Correctness Rating (DCR)
        </p>
        <div className="font-mono text-sm text-gray-800 bg-gray-50 border border-gray-100 px-4 py-3 mb-5">
          DCR = cos(V, F*) × 100 − Σ penalties · λ
        </div>
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>
            <span className="font-mono text-gray-800">V</span> is the audit vector consisting of nine
            generative rate scores, each evaluated on a 0–5 scale.
          </p>
          <p>
            <span className="font-mono text-gray-800">F*</span> is the reference vector representing a
            fully freedom-generating institutional design, derived from capability theory and
            institutional design principles.
          </p>
          <p>
            <span className="font-mono text-gray-800">Σ penalties · λ</span> represents weighted
            deductions for identified structural risk flags such as absence of appeal, proxy discrimination,
            personhood substitution, and future closure.
          </p>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-100 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>
            DCR is not a score of a person, institution, or moral worth. It is an audit index for
            estimating whether a decision system tends to generate or close future possibilities.
          </p>
          <p>
            The index identifies where re-entry, responsibility, contextual recovery, and support design
            are absent or structurally blocked.
          </p>
        </div>
      </div>

      {/* Warning box */}
      <div className="border border-gray-300 bg-gray-50 p-5 mb-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-500 uppercase mb-3">
          Interpretive Caution
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>DDAT does not replace judgment with another score.</li>
          <li>It audits the directional tendency of a scoring system.</li>
          <li>A high DCR does not mean a system is ethically perfect.</li>
          <li>
            A low DCR indicates that the system may be closing future possibility through classification,
            opacity, proxy discrimination, or lack of re-entry pathways.
          </li>
        </ul>
      </div>

      {/* Nine rates summary */}
      <div className="mb-10">
        <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase mb-4">
          Nine Generative Rates — Audit Vector V ∈ ℝ⁹
        </p>
        <div className="border border-gray-200 divide-y divide-gray-100">
          {[
            { abbr: "IGR",   name: "Information Generation Rate",                  desc: "Meaningful access to relevant information, not mere data extraction." },
            { abbr: "PDFR",  name: "Pre-Difference Field Generation Rate",         desc: "Preservation of possibility before premature classification fixes the subject." },
            { abbr: "MGR",   name: "Meaning / Truth-Feeling Generation Rate",      desc: "Interpretive transparency and contestable sense of truth, not opaque signals." },
            { abbr: "D-RGR", name: "Division-of-Labor Relational Generation Rate", desc: "Reorganization of roles, burdens, and cooperation rather than isolated individual responsibility." },
            { abbr: "SRGR",  name: "Responsibility Generation Rate",               desc: "Traceable, contestable, institutionally shared responsibility rather than displaced automated judgment." },
            { abbr: "TIGR",  name: "Temporal Integration Generation Rate",         desc: "Preservation of historical context and future revision, not a frozen scored moment." },
            { abbr: "RCR",   name: "Reality / Bodily Return Capacity Rate",        desc: "Connection to embodied burden, material constraints, and lived context." },
            { abbr: "FGR",   name: "Freedom Generation Rate",                      desc: "Expansion of practical pathways for appeal, re-entry, and future possibility." },
            { abbr: "HGR",   name: "Historical Generation Rate",                   desc: "Institutional and collective learning rather than reproduction of hidden exclusion patterns." },
          ].map((r) => (
            <div key={r.abbr} className="grid grid-cols-[56px_180px_1fr] gap-4 px-4 py-3 items-start">
              <span className="font-mono text-[10px] font-bold text-blue-600">{r.abbr}</span>
              <span className="text-xs font-semibold text-gray-800 leading-tight">{r.name}</span>
              <span className="text-xs text-gray-500 leading-relaxed">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
          className="bg-gray-900 text-white text-sm font-semibold px-6 py-3 hover:bg-gray-700 transition-colors tracking-wide"
        >
          Begin Audit →
        </button>
        <a
          href="/agent-council"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-mono"
        >
          → Multi-Agent Audit Network
        </a>
      </div>
    </div>
  )
}

function MethodologyTab() {
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase mb-6">
        Audit Methodology — Seven Steps
      </p>
      <div className="space-y-0 divide-y divide-gray-100 border border-gray-200">
        {[
          {
            n: "1",
            title: "System Identification",
            body: "Identify the type of decision system being audited. Examples include: automated hiring score, education placement algorithm, welfare eligibility classifier, credit risk model, criminal justice risk assessment, medical triage model, academic evaluation system.",
          },
          {
            n: "2",
            title: "Affected Persons and Consequences",
            body: "Specify who is affected by the system's outputs. Document what opportunities, rights, burdens, or future pathways are altered by the decision. Consider direct and indirect effects, including populations excluded from the design process.",
          },
          {
            n: "3",
            title: "Generative Rate Evaluation",
            body: "Evaluate each of the nine generative rates on a scale from 0 to 5. Each score must be accompanied by a textual justification based on the system's documented design, data inputs, and decision logic. Scores are not computed automatically; they reflect structured evaluative judgment.",
          },
          {
            n: "4",
            title: "Penalty Evaluation",
            body: "Apply weighted penalties for identified structural risk flags: personhood substitution, proxy discrimination, absence of appeal mechanism, absence of re-entry pathway, opaque reasoning, institutional responsibility displacement, future possibility closure, invisibility of bodily or temporal burden.",
          },
          {
            n: "5",
            title: "DCR Calculation",
            body: "Calculate the Directional Correctness Rating from the cosine alignment of the nine-rate vector V with the reference vector F*, adjusted by the penalty total. The result is an audit index, not an ethical verdict.",
          },
          {
            n: "6",
            title: "Intervention Simulation",
            body: "Simulate which institutional changes would raise the DCR. Examples include: formal appeal mechanism, mandatory human review, structured context recovery, periodic re-audit, support pathway design, role reallocation, burden redistribution, transparent explanation layer, historical bias review.",
          },
          {
            n: "7",
            title: "Report Generation",
            body: "Generate a structured audit report documenting the system description, affected persons, rate evaluations with justifications, penalty factors, DCR before and after intervention, residual risks, and final directional judgment. The report is not a certification. It must be reviewed by affected parties and domain experts.",
          },
        ].map((step) => (
          <div key={step.n} className="grid grid-cols-[48px_1fr] gap-4 px-5 py-5 items-start">
            <span className="font-mono text-lg font-bold text-gray-300">{step.n}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">{step.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CaseTab() {
  const { dispatch } = useStore()
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase mb-1">
        Case Report
      </p>
      <h3 className="text-lg font-bold text-gray-900 mb-6">AI Hiring Score</h3>

      <div className="space-y-6">
        <Section title="System">
          <p className="text-sm text-gray-600 leading-relaxed">
            An automated hiring score ranks applicants based on past employment history, educational
            prestige, productivity proxies, and behavioral prediction models. Outputs determine which
            applicants advance to human review or are eliminated at the screening stage.
          </p>
        </Section>

        <Section title="Initial Diagnosis">
          <p className="text-sm text-gray-600 leading-relaxed">
            The system may improve administrative throughput, but it risks substituting a compressed
            score for the person being evaluated. It converts developmental history, embodied burden,
            social context, and future possibility into a single ranked output without mechanism for
            appeal, contextual recovery, or institutional accountability.
          </p>
        </Section>

        <Section title="Risk Flags Identified">
          <ul className="space-y-1.5">
            {[
              "Personhood substitution",
              "Proxy discrimination",
              "Future closure",
              "Absence of re-entry mechanism",
              "Institutional responsibility displaced to individuals",
              "Opaque scoring logic",
              "Historical bias reproduction",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-gray-400 mt-0.5 shrink-0">—</span>
                {f}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Why the DCR Is Low">
          <p className="text-sm text-gray-600 leading-relaxed">
            The DCR is low not because the system is technically inaccurate, but because it changes
            applicants' access to future opportunity while providing no appeal, no context recovery, and
            no institutional accountability. The system operates as a gatekeeping score that closes
            futures without generating pathways for return, revision, or support.
          </p>
        </Section>

        <Section title="Recommended Interventions">
          <ul className="space-y-1.5">
            {[
              "Establish a formal appeal pathway with human review and response deadlines.",
              "Introduce structured contextual review allowing applicants to present relevant circumstances.",
              "Design a re-entry mechanism permitting reapplication after a defined period.",
              "Conduct periodic bias audit of all proxy variables used in the model.",
              "Implement an explanation layer: decision rationale must be legible to affected applicants.",
              "Add a support-based role-matching function connecting applicants to relevant development pathways.",
            ].map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="font-mono text-gray-400 shrink-0">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Post-Intervention Assessment">
          <p className="text-sm text-gray-600 leading-relaxed">
            When the interventions above are implemented, the DCR increases because the system no longer
            functions solely as a gatekeeping score. It becomes part of a broader institutional process
            that allows revision, contextual recovery, responsibility distribution, and support. The
            change does not make the system ethically perfect; it shifts its directional tendency from
            future closure toward future generation.
          </p>
        </Section>

        <div className="pt-2">
          <button
            onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
            className="text-sm border border-gray-300 text-gray-700 px-5 py-2.5 hover:border-gray-500 transition-colors"
          >
            Run this audit yourself →
          </button>
        </div>
      </div>
    </div>
  )
}

function ResearchTab() {
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase mb-6">
        Research Basis
      </p>
      <div className="border border-gray-200 divide-y divide-gray-100">
        {[
          {
            ref: "Capability Approach (Sen, Nussbaum)",
            note: "DDAT treats freedom not as abstract choice but as practical access to real future pathways. The generative rate vector operationalizes capability as institutional design criterion.",
          },
          {
            ref: "NIST AI Risk Management Framework",
            note: "DDAT complements risk-management frameworks by asking whether reliability, transparency, and fairness actually expand or close future possibility — a question RMF categories do not directly address.",
          },
          {
            ref: "EU AI Act (High-Risk AI Systems)",
            note: "DDAT is especially applicable to the high-impact systems enumerated in Annex III: employment, education, welfare, credit, health, and public decision architectures.",
          },
          {
            ref: "Algorithmic Accountability Research",
            note: "DDAT extends audit frameworks by adding directional assessment: not merely whether a system is biased, but whether it generates or closes the future possibility of affected subjects.",
          },
          {
            ref: "Critical Theory of Institutions",
            note: "DDAT treats scoring systems as institutional actors with directional effects on social reproduction, drawing on institutional critique traditions in political philosophy and sociology.",
          },
          {
            ref: "Canguilhem — Normativity and the Normal",
            note: "DDAT incorporates Canguilhem's distinction between statistical normality and normative capacity: a system that normalizes does not necessarily generate health, capability, or possibility.",
          },
          {
            ref: "Foucault — Classification and Governance",
            note: "DDAT applies Foucauldian analysis of classification as power: scoring systems do not merely describe populations; they produce administrative subjectivities with durable social effects.",
          },
          {
            ref: "Bourdieu — Social Reproduction",
            note: "The Historical Generation Rate (HGR) draws on Bourdieu's analysis of how institutional systems reproduce structural inequality through apparently neutral categorization.",
          },
          {
            ref: "Philosophy of Technology and AI Ethics",
            note: "DDAT situates AI systems within the philosophy of technology tradition, treating algorithmic systems as social artifacts with embedded values, directional tendencies, and institutional effects.",
          },
        ].map((item) => (
          <div key={item.ref} className="grid grid-cols-[220px_1fr] gap-6 px-5 py-4 items-start">
            <span className="text-xs font-semibold text-gray-800 leading-tight">{item.ref}</span>
            <span className="text-xs text-gray-500 leading-relaxed">{item.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LimitationsTab() {
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase mb-6">
        Limitations
      </p>
      <div className="border border-gray-200 bg-gray-50 p-6 mb-6">
        <ul className="space-y-3 text-sm text-gray-700 leading-relaxed">
          {[
            "DDAT is not a legal compliance certification and does not determine whether a system is lawful under any specific jurisdiction.",
            "DDAT does not provide medical, financial, employment, or legal decisions.",
            "DDAT does not rank or score persons.",
            "DDAT does not claim that all scoring or evaluation is harmful.",
            "DDAT does not produce a definitive ethical verdict. Its output is an audit index requiring human interpretation.",
            "The nine generative rates are evaluated through structured human judgment, not automated computation. Results reflect the quality of the evaluator's analysis and available documentation.",
            "DCR values are not comparable across audits conducted by different evaluators without standardized calibration.",
            "DDAT evaluates whether a scoring or evaluation system preserves appeal, re-entry, contextual recovery, distributed responsibility, and future possibility. It does not evaluate all possible dimensions of harm or fairness.",
            "This is a research prototype. It is not validated for regulatory or legal use.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-mono text-gray-400 shrink-0">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TemplateTab() {
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-gray-400 uppercase mb-6">
        Report Output Template
      </p>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Generated audit reports follow this structure. All fields are populated from the audit workflow.
        Reports can be exported as JSON or printed to PDF.
      </p>
      <div className="border border-gray-200 divide-y divide-gray-100">
        {[
          { n: "1",  field: "System Description",                detail: "Formal description of the system type, operator, and operational context." },
          { n: "2",  field: "Decision Domain",                   detail: "Labor / Education / Welfare / Healthcare / Finance / Governance / Other." },
          { n: "3",  field: "Affected Persons",                  detail: "Identification of all groups whose opportunities, rights, or futures are altered." },
          { n: "4",  field: "Decision Consequences",             detail: "Enumeration of what is lost, restricted, or reallocated as a result of system outputs." },
          { n: "5",  field: "Nine Generative Rate Evaluation",   detail: "Scores (0–5) for each rate with evaluator's textual justification for each score." },
          { n: "6",  field: "Penalty Factors",                   detail: "Active risk flags, their definitions, and weighted penalty values." },
          { n: "7",  field: "DCR Before Intervention",           detail: "Raw DCR, total penalty, and final DCR with directional classification." },
          { n: "8",  field: "Primary Closure Mechanisms",        detail: "Enumeration of the structural factors most responsible for a low DCR." },
          { n: "9",  field: "Recommended Institutional Changes",  detail: "Ordered list of design interventions with projected DCR impact." },
          { n: "10", field: "DCR After Intervention",            detail: "Simulated post-intervention DCR with rate-level changes documented." },
          { n: "11", field: "Residual Risks",                    detail: "Risk flags that remain after intervention, with brief explanation." },
          { n: "12", field: "Limitations",                       detail: "Statement that this report is not a legal, medical, or moral certification." },
          { n: "13", field: "Final Directional Judgment",        detail: "Qualitative summary of whether the system tends toward generation or closure of future possibility." },
        ].map((row) => (
          <div key={row.n} className="grid grid-cols-[32px_200px_1fr] gap-4 px-4 py-3 items-start">
            <span className="font-mono text-xs text-gray-300">{row.n}</span>
            <span className="text-xs font-semibold text-gray-800">{row.field}</span>
            <span className="text-xs text-gray-500 leading-relaxed">{row.detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Small helper ─────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 p-5">
      <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">{title}</p>
      {children}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function HomeSection() {
  const [tab, setTab] = useState<Tab>("overview")

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto" style={{ padding: "56px 48px 80px" }}>

        {/* ── Page header ─────────────────────────────────────── */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-3">
                Research Prototype · Independent
              </p>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                DDAT — Dialectical Direction Audit Theory
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                A methodological framework for auditing whether a decision system tends to generate
                or close future possibilities for affected persons and communities.
              </p>
            </div>
          </div>
          <div className="mt-5 border border-gray-200 bg-gray-50 inline-flex px-4 py-2">
            <p className="font-mono text-[11px] text-gray-600">
              DDAT audits generative direction, not persons.
            </p>
          </div>
        </div>

        {/* ── Tab bar ─────────────────────────────────────────── */}
        <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
                tab === t.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ─────────────────────────────────────── */}
        {tab === "overview"    && <OverviewTab />}
        {tab === "methodology" && <MethodologyTab />}
        {tab === "case"        && <CaseTab />}
        {tab === "research"    && <ResearchTab />}
        {tab === "limitations" && <LimitationsTab />}
        {tab === "template"    && <TemplateTab />}

      </div>
    </div>
  )
}
