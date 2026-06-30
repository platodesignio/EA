import type { GenerativeRates } from "@/types/ddat"

export const generativeRateDefinitions: Record<
  keyof GenerativeRates,
  { shortName: string; fullName: string; definition: string }
> = {
  IGR: {
    shortName: "IGR",
    fullName: "Information Generation Rate",
    definition:
      "The degree to which the system increases meaningful access to relevant information rather than merely extracting, compressing, or monetizing data.",
  },
  PDFR: {
    shortName: "PDFR",
    fullName: "Pre-Difference Field Generation Rate",
    definition:
      "The degree to which the system preserves possibilities before premature classification, labeling, ranking, or diagnosis fixes the subject into a narrow category.",
  },
  MGR: {
    shortName: "MGR",
    fullName: "Meaning / Truth-Feeling Generation Rate",
    definition:
      "The degree to which the system supports interpretation, contextual understanding, and a credible sense of truth rather than producing opaque signals or arbitrary confidence.",
  },
  DRGR: {
    shortName: "D-RGR",
    fullName: "Division-of-Labor Relational Generation Rate",
    definition:
      "The degree to which the system reorganizes roles, burdens, support, cooperation, and institutional responsibility instead of isolating failure onto the individual.",
  },
  SRGR: {
    shortName: "SRGR",
    fullName: "Responsibility Generation Rate",
    definition:
      "The degree to which responsibility becomes traceable, contestable, and institutionally shared rather than displaced into automated judgment or anonymous procedure.",
  },
  TIGR: {
    shortName: "TIGR",
    fullName: "Temporal Integration Generation Rate",
    definition:
      "The degree to which the system preserves developmental history, temporal context, revision over time, and future re-entry rather than freezing a person at one scored moment.",
  },
  RCR: {
    shortName: "RCR",
    fullName: "Reality / Bodily Return Capacity Rate",
    definition:
      "The degree to which the system remains connected to embodied burden, lived context, material constraints, fatigue, care, labor, and practical reality.",
  },
  FGR: {
    shortName: "FGR",
    fullName: "Freedom Generation Rate",
    definition:
      "The degree to which the system expands practical pathways for appeal, support, role reallocation, re-entry, and future possibilities.",
  },
  HGR: {
    shortName: "HGR",
    fullName: "Historical Generation Rate",
    definition:
      "The degree to which the system allows institutions and subjects to learn historically rather than reproducing hidden patterns of exclusion, privilege, or inherited disadvantage.",
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
