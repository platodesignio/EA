import type { GenerativeRates } from "@/types/ddat"

export const generativeRateDefinitions: Record<
  keyof GenerativeRates,
  { shortName: string; fullName: string; japaneseName: string; definition: string }
> = {
  IGR: {
    shortName: "IGR",
    fullName: "Information Generative Rate",
    japaneseName: "情報生成率",
    definition:
      "Does the system generate richer, more accurate, more contextual information about the situation, or does it reduce reality into a thin score?",
  },
  PDFR: {
    shortName: "PDFR",
    fullName: "Pre-Difference Field Rate",
    japaneseName: "差異以前界生成率",
    definition:
      "Does the system preserve unclassified potential before fixed categories are imposed, or does it prematurely classify people and cases?",
  },
  MGR: {
    shortName: "MGR",
    fullName: "Meaning Generative Rate",
    japaneseName: "意味生成率",
    definition:
      "Does the system produce understandable, contestable, meaningful reasons, or does it create opaque truth-feeling without accountability?",
  },
  DRGR: {
    shortName: "D-RGR",
    fullName: "Division-Relation Generative Rate",
    japaneseName: "分業・関係生成率",
    definition:
      "Does the system improve relational coordination and division of labor, or does it isolate subjects and intensify hierarchy?",
  },
  SRGR: {
    shortName: "SRGR",
    fullName: "Social Responsibility Generative Rate",
    japaneseName: "社会責任生成率",
    definition:
      "Does the system distribute responsibility across institutions, environments, and social conditions, or does it shift all responsibility onto the individual?",
  },
  TIGR: {
    shortName: "TIGR",
    fullName: "Time Generative Rate",
    japaneseName: "時間生成率",
    definition:
      "Does the system preserve time for learning, repair, delay, maturation, and change, or does it freeze the subject in a present score?",
  },
  RCR: {
    shortName: "RCR",
    fullName: "Return Capability Rate",
    japaneseName: "帰還能力率",
    definition:
      "Does the system provide routes for appeal, re-entry, retraining, correction, or recovery after failure?",
  },
  FGR: {
    shortName: "FGR",
    fullName: "Freedom Generative Rate",
    japaneseName: "自由生成率",
    definition:
      "Does the system expand reachable states and real possibilities, or does it narrow future options?",
  },
  HGR: {
    shortName: "HGR",
    fullName: "Historical Generative Rate",
    japaneseName: "歴史生成率",
    definition:
      "Does the system preserve long-term historical development and collective transformation, or does it lock society into past patterns?",
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
