"use client"

import { useStore } from "@/lib/store"
import { Button, SystemNotice, PhilosophyBar } from "./ui"

export function HomeSection() {
  const { dispatch } = useStore()

  return (
    <div className="max-w-3xl mx-auto px-8 py-20">
      <div className="mb-16">
        <p className="text-xs font-bold tracking-[0.2em] text-[#1d4ed8] uppercase mb-4">
          DDAT Studio
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-[#0a0a0a] leading-[1.1] mb-6">
          Simulate whether a system<br />expands freedom or<br />closes the future.
        </h1>
        <p className="text-lg text-[#4b5563] leading-relaxed max-w-xl">
          A dialectical audit simulator for AI scoring systems, institutions,
          evaluation structures, and social decision architectures.
        </p>
      </div>

      <div className="space-y-4 mb-12">
        <PhilosophyBar />
        <SystemNotice />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { n: "9", label: "Generative Rates", sub: "Multi-dimensional audit vector" },
          { n: "20", label: "Risk Flags", sub: "Structural closure indicators" },
          { n: "DCR", label: "Direction Score", sub: "Cosine similarity × domain vector" },
        ].map((item) => (
          <div key={item.label} className="border border-[#e5e7eb] p-5">
            <p className="font-mono text-3xl font-bold text-[#0a0a0a] mb-1">{item.n}</p>
            <p className="text-sm font-semibold text-[#0a0a0a] mb-0.5">{item.label}</p>
            <p className="text-[11px] text-[#9ca3af]">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="lg"
          onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
        >
          Start Audit →
        </Button>
        <p className="text-xs text-[#9ca3af]">
          Loaded with sample: AI Hiring Score Audit
        </p>
      </div>
    </div>
  )
}
