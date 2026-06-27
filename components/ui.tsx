"use client"

import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react"

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`max-w-4xl mx-auto px-6 py-10 ${className}`}>
      {children}
    </section>
  )
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-[#1f2937] bg-[#0d0d0d] p-6 ${className}`}>
      {children}
    </div>
  )
}

export function GrayCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-[#1f2937] bg-[#111827] p-5 ${className}`}>
      {children}
    </div>
  )
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#0a0a0a]">{children}</div>
}

export function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="mb-8">
      <p className="font-mono text-[10px] tracking-[0.25em] text-[#3b82f6] uppercase mb-2">
        Step {n} / 6
      </p>
      <h2 className="text-3xl font-bold text-white tracking-tight">{label}</h2>
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-[#374151] uppercase mb-4">
      {children}
    </p>
  )
}

export function Field({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block font-mono text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.15em]">
        {label}
      </label>
      {sub && <p className="text-[11px] text-[#4b5563]">{sub}</p>}
      {children}
    </div>
  )
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border border-[#1f2937] bg-[#111827] px-3 py-2.5 text-sm text-[#e5e7eb] placeholder-[#374151] focus:outline-none focus:border-[#1d4ed8] transition-colors ${className}`}
      {...props}
    />
  )
}

export function Textarea({ className = "", rows = 3, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={`w-full border border-[#1f2937] bg-[#111827] px-3 py-2.5 text-sm text-[#e5e7eb] placeholder-[#374151] focus:outline-none focus:border-[#1d4ed8] transition-colors resize-none ${className}`}
      {...props}
    />
  )
}

export function Select({ children, className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={`w-full border border-[#1f2937] bg-[#111827] px-3 py-2.5 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#1d4ed8] transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

const BTN_BASE = "inline-flex items-center justify-center font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed tracking-wide"

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary:   "bg-[#1d4ed8] text-white hover:bg-[#2563eb]",
  secondary: "bg-[#1f2937] text-[#e5e7eb] hover:bg-[#374151]",
  ghost:     "border border-[#1f2937] text-[#6b7280] hover:border-[#374151] hover:text-[#9ca3af]",
  danger:    "bg-[#dc2626] text-white hover:bg-[#b91c1c]",
}

const BTN_SIZE: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-sm gap-2",
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}) {
  return (
    <button
      className={`${BTN_BASE} ${BTN_VARIANT[variant]} ${BTN_SIZE[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function PhilosophyBar() {
  return (
    <div className="border-l-2 border-[#1d4ed8] pl-4 py-1">
      <p className="text-xs text-[#4b5563] italic">
        Measurement is not ontology. A score is not a person. An audit is not a verdict.
      </p>
    </div>
  )
}

export function SystemNotice() {
  return (
    <div className="border border-[#1f2937] bg-[#0d1117] px-4 py-3">
      <p className="font-mono text-[10px] text-[#374151] mb-0.5 uppercase tracking-wide">Notice</p>
      <p className="text-xs text-[#4b5563]">
        DDAT scores are not judgments of persons. They audit the generative direction of systems, institutions, and decision architectures.
      </p>
    </div>
  )
}

export function SimulationNotice() {
  return (
    <div className="border border-[#1f2937] px-4 py-3">
      <p className="text-xs text-[#4b5563] leading-relaxed">
        Simulation results are structured audit hypotheses — not predictions. Results depend on entered assumptions and DDAT criteria.
      </p>
    </div>
  )
}

const LEVEL_STYLES: Record<string, { color: string; border: string }> = {
  "Freedom-generative":       { color: "#4ade80", border: "#14532d" },
  "Conditionally generative": { color: "#60a5fa", border: "#1e3a8a" },
  "Ambivalent / unstable":    { color: "#fbbf24", border: "#78350f" },
  "Freedom-closing":          { color: "#fb923c", border: "#7c2d12" },
  "Severe closure":           { color: "#f87171", border: "#7f1d1d" },
}

export function getLevelStyle(level: string) {
  return LEVEL_STYLES[level] ?? { color: "#6b7280", border: "#1f2937" }
}

export function LevelBadge({ level }: { level: string }) {
  const s = getLevelStyle(level)
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] border"
      style={{ color: s.color, borderColor: s.border }}
    >
      {level}
    </span>
  )
}
