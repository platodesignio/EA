import type { GenerativeRates } from "@/types/ddat"

export const generativeRateDefinitions: Record<
  keyof GenerativeRates,
  { shortName: string; fullName: string; definition: string }
> = {
  IGR: {
    shortName: "IGR",
    fullName: "Information Generation Rate",
    definition:
      "The degree to which the system increases meaningful access to relevant information rather than merely extracting data.",
  },
  PDFR: {
    shortName: "PDFR",
    fullName: "Pre-Difference Field Generation Rate",
    definition:
      "The degree to which the system preserves possibilities before premature classification, labeling, or ranking fixes the subject.",
  },
  MGR: {
    shortName: "MGR",
    fullName: "Meaning / Truth-Feeling Generation Rate",
    definition:
      "The degree to which the system supports interpretation, contextual understanding, and a credible sense of truth rather than producing opaque signals.",
  },
  DRGR: {
    shortName: "D-RGR",
    fullName: "Division-of-Labor Relational Generation Rate",
    definition:
      "The degree to which the system reorganizes roles, burdens, support, and cooperation instead of isolating responsibility onto the individual.",
  },
  SRGR: {
    shortName: "SRGR",
    fullName: "Responsibility Generation Rate",
    definition:
      "The degree to which the system makes responsibility traceable, contestable, and institutionally shared rather than displaced into automated judgment.",
  },
  TIGR: {
    shortName: "TIGR",
    fullName: "Temporal Integration Generation Rate",
    definition:
      "The degree to which the system preserves historical context, developmental time, and future revision rather than freezing a person at one scored moment.",
  },
  RCR: {
    shortName: "RCR",
    fullName: "Reality / Bodily Return Capacity Rate",
    definition:
      "The degree to which the system remains connected to embodied burden, lived context, material constraints, and practical reality.",
  },
  FGR: {
    shortName: "FGR",
    fullName: "Freedom Generation Rate",
    definition:
      "The degree to which the system expands practical pathways for appeal, support, role reallocation, re-entry, and future possibility.",
  },
  HGR: {
    shortName: "HGR",
    fullName: "Historical Generation Rate",
    definition:
      "The degree to which the system allows institutions and subjects to learn historically rather than repeating hidden patterns of exclusion.",
  },
}

export const RATE_SCALE = [
  { value: 0, label: "Severe closure" },
  { value: 1, label: "Weak" },
  { value: 2, label: "Limited" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Strong" },
  { value: 5, label: "Highly generative" },
]

export const RATE_KEYS = Object.keys(generativeRateDefinitions) as (keyof GenerativeRates)[]
