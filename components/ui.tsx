"use client"

import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react"

// ── Layout ──────────────────────────────────────────────

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  )
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`max-w-4xl mx-auto px-8 py-12 ${className}`}>
      {children}
    </section>
  )
}

// ── Cards ──────────────────────────────────────────────

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-[#e5e7eb] bg-white p-6 ${className}`}>
      {children}
    </div>
  )
}

export function GrayCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border border-[#e5e7eb] bg-[#f9fafb] p-5 ${className}`}>
      {children}
    </div>
  )
}

// ── Typography ──────────────────────────────────────────

export function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold tracking-[0.15em] text-[#1d4ed8] uppercase mb-1">
        Step {n}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-[#0a0a0a]">{label}</h2>
    </div>
  )
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.12em] text-[#6b7280] uppercase mb-3">
      {children}
    </p>
  )
}

// ── Form ──────────────────────────────────────────────

export function Field({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wide">
        {label}
      </label>
      {sub && <p className="text-[11px] text-[#9ca3af]">{sub}</p>}
      {children}
    </div>
  )
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white text-[#0a0a0a] placeholder-[#9ca3af] focus:outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition-colors ${className}`}
      {...props}
    />
  )
}

export function Textarea({ className = "", rows = 3, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={rows}
      className={`w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white text-[#0a0a0a] placeholder-[#9ca3af] focus:outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition-colors resize-none ${className}`}
      {...props}
    />
  )
}

export function Select({ children, className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={`w-full border border-[#e5e7eb] px-3 py-2 text-sm bg-white text-[#0a0a0a] focus:outline-none focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

// ── Buttons ──────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

const BTN_BASE = "inline-flex items-center justify-center font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary:   "bg-[#1e3a8a] text-white hover:bg-[#1d4ed8]",
  secondary: "bg-[#0a0a0a] text-white hover:bg-[#374151]",
  ghost:     "border border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]",
  danger:    "bg-[#dc2626] text-white hover:bg-[#b91c1c]",
}

const BTN_SIZE: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2",
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

// ── Notices ──────────────────────────────────────────────

export function PhilosophyBar() {
  return (
    <div className="border-l-[3px] border-[#1d4ed8] bg-[#eff6ff] px-4 py-3">
      <p className="text-xs font-semibold text-[#1e3a8a]">
        Measurement is not ontology. A score is not a person. An audit is not a verdict.
      </p>
    </div>
  )
}

export function SystemNotice() {
  return (
    <div className="border border-[#fbbf24] bg-[#fffbeb] px-4 py-3">
      <p className="text-xs font-semibold text-[#92400e] mb-0.5">Notice</p>
      <p className="text-sm text-[#78350f]">
        DDAT scores are not judgments of persons. They are audit indicators of systems, institutions, and decision architectures.
      </p>
    </div>
  )
}

export function SimulationNotice() {
  return (
    <div className="border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
      <p className="text-xs text-[#6b7280] leading-relaxed">
        Simulation results are not predictions. They are structured audit hypotheses based on DDAT criteria and entered assumptions.
      </p>
    </div>
  )
}

// ── DCR Level ──────────────────────────────────────────────

const LEVEL_STYLES: Record<string, { color: string; bg: string; text: string }> = {
  "Freedom-generative":       { color: "#15803d", bg: "#f0fdf4", text: "text-green-700" },
  "Conditionally generative": { color: "#1d4ed8", bg: "#eff6ff", text: "text-blue-700" },
  "Ambivalent / unstable":    { color: "#d97706", bg: "#fffbeb", text: "text-yellow-700" },
  "Freedom-closing":          { color: "#ea580c", bg: "#fff7ed", text: "text-orange-700" },
  "Severe closure":           { color: "#dc2626", bg: "#fef2f2", text: "text-red-700" },
}

export function getLevelStyle(level: string) {
  return LEVEL_STYLES[level] ?? { color: "#6b7280", bg: "#f9fafb", text: "text-gray-600" }
}

export function LevelBadge({ level }: { level: string }) {
  const s = getLevelStyle(level)
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      {level}
    </span>
  )
}
