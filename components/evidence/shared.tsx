"use client"

import React from "react"

// ─── Label ────────────────────────────────────────────────────────────────────
// Renders a real <label>, not a <span>: pass htmlFor matching the input's id
// so screen readers announce the label when the field receives focus, not
// just when read top-to-bottom.
export function Label({ children, hint, htmlFor }: { children: React.ReactNode; hint?: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block">
      <span className="text-[11px] font-mono font-bold tracking-[0.15em] text-gray-900 uppercase">
        {children}
      </span>
      {hint && <span className="ml-2 text-[10px] text-gray-500">{hint}</span>}
    </label>
  )
}

// ─── FieldGroup ───────────────────────────────────────────────────────────────
export function FieldGroup({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-5 ${className}`}>{children}</div>
}

// ─── TextInput ────────────────────────────────────────────────────────────────
export function TextInput({
  value,
  onChange,
  placeholder = "",
  mono = false,
  id,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  mono?: boolean
  id?: string
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors ${mono ? "font-mono" : ""}`}
    />
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({
  value,
  onChange,
  placeholder = "",
  rows = 3,
  id,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  id?: string
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors resize-none"
    />
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select<T extends string>({
  value,
  onChange,
  options,
  id,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  id?: string
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value as T)}
      className="w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors appearance-none"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

// ─── NumberInput ──────────────────────────────────────────────────────────────
export function NumberInput({
  value,
  onChange,
  placeholder = "",
  min,
  max,
}: {
  value: number | null
  onChange: (v: number | null) => void
  placeholder?: string
  min?: number
  max?: number
}) {
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={e => onChange(e.target.value === "" ? null : Number(e.target.value))}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 font-mono outline-none focus:border-gray-900 transition-colors"
    />
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 border transition-colors ${
          value ? "bg-gray-900 border-gray-900" : "bg-white border-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 mt-[3px] ml-[3px] bg-white transform transition-transform ${
            value ? "translate-x-4 bg-white" : "translate-x-0 bg-gray-400"
          }`}
          style={{ background: value ? "#fff" : "#9ca3af" }}
        />
      </button>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

// ─── Roving-tabindex radiogroup keyboard handling ─────────────────────────────
// Shared by ScoreSelect and ChoiceGroup: arrow keys move both focus and
// selection, Home/End jump to the ends — the behavior screen reader users
// expect from role="radiogroup", which a bare row of <button> elements
// does not provide on its own.
function useRovingRadioGroup<T extends string | number>(options: T[], value: T, onChange: (v: T) => void) {
  return (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = options.indexOf(value)
    let next = i
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % options.length
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + options.length) % options.length
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = options.length - 1
    else return
    e.preventDefault()
    onChange(options[next])
  }
}

// ─── ScoreSelect ──────────────────────────────────────────────────────────────
export function ScoreSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: 0 | 1 | 2 | 3
  onChange: (v: 0 | 1 | 2 | 3) => void
  options: { value: 0 | 1 | 2 | 3; label: string }[]
  label?: string
}) {
  const onKeyDown = useRovingRadioGroup(options.map(o => o.value), value, onChange)

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="flex gap-2 flex-wrap">
        {options.map(o => {
          const selected = value === o.value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={`px-3 py-1.5 text-[11px] font-mono border transition-colors ${
                selected
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {o.value} — {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── ChoiceGroup — generic labeled button-group over any string enum ──────────
export function ChoiceGroup<T extends string>({
  value,
  onChange,
  options,
  label,
  hint,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  label?: string
  hint?: string
}) {
  const onKeyDown = useRovingRadioGroup(options.map(o => o.value), value, onChange)

  return (
    <div>
      {label && <Label hint={hint}>{label}</Label>}
      <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="flex gap-2 flex-wrap">
        {options.map(o => {
          const selected = value === o.value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={`px-2.5 py-1.5 text-[11px] font-mono border transition-colors ${
                selected
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── SectionBanner ────────────────────────────────────────────────────────────
export function SectionBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-gray-900 pl-4 py-1 mb-8">
      <p className="text-[11px] font-mono text-gray-500 leading-relaxed">{children}</p>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-gray-200 p-5 ${className}`}>
      {children}
    </div>
  )
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
export function PrimaryButton({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-gray-900 text-white text-[12px] font-mono tracking-wider uppercase hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

// ─── SecondaryButton ──────────────────────────────────────────────────────────
export function SecondaryButton({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 border border-gray-300 text-[11px] font-mono text-gray-600 hover:border-gray-600 hover:text-gray-900 transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
// Each step is a distinct full-page view in a single-route SPA — CEOConsoleHero
// is the only other view with its own <h1>, and the two never render at the
// same time, so this can safely be the page's h1 rather than a orphaned h2
// with nothing above it. Focus moves here on mount so screen reader and
// keyboard users get a cue that the "page" changed — a plain step-forward
// button click leaves focus behind otherwise, with no indication anything
// happened at all for a non-visual user.
export function SectionTitle({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <h1
      ref={ref}
      tabIndex={-1}
      className="text-[10px] font-mono font-bold tracking-[0.3em] text-gray-500 uppercase mb-6 outline-none focus-visible:text-gray-900"
    >
      {children}
    </h1>
  )
}

// ─── PageContainer ────────────────────────────────────────────────────────────
export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">{children}</div>
  )
}

// ─── TagInput ─────────────────────────────────────────────────────────────────
export function TagInput({
  values,
  onChange,
  placeholder = "Type and press Enter",
}: {
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [input, setInput] = React.useState("")

  function add() {
    const trimmed = input.trim()
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed])
    }
    setInput("")
  }

  function remove(v: string) {
    onChange(values.filter(x => x !== v))
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add() } }}
          placeholder={placeholder}
          className="flex-1 border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
        />
        <SecondaryButton onClick={add}>Add</SecondaryButton>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map(v => (
            <span key={v} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-[11px] font-mono text-gray-700">
              {v}
              <button onClick={() => remove(v)} className="ml-1 text-gray-500 hover:text-gray-900">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
