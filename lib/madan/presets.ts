import type { AuditScenario } from "@/types/madan"

export const PRESET_SCENARIOS: AuditScenario[] = [
  {
    title: "AI Hiring Score System",
    systemType: "labor",
    description:
      "A large-scale automated hiring platform used by Fortune 500 companies that scores job applicants across behavioral signals extracted from video interviews, résumé parsing, and social media footprint analysis. Scores range from 0–100 and determine whether a candidate advances to human review.",
    targetPopulation:
      "Working-age job seekers, disproportionately affecting those from non-dominant linguistic backgrounds, career-changers, people with disabilities, and individuals with non-linear employment histories.",
    evaluationMechanism:
      "Multimodal machine learning scoring of facial microexpressions, speech cadence, vocabulary complexity, and keyword alignment between résumé and job description. Trained on historical hiring decisions from companies with documented demographic imbalances.",
    dataSources:
      "Video interview recordings, résumé text, LinkedIn profile data, public social media posts, and proprietary 'trait libraries' derived from behavioral psychology literature from the 1980s–2000s.",
    decisionConsequences:
      "Scores below 60 result in automatic rejection with no human review. Scores between 60–74 enter a secondary queue reviewed only on high-demand days. Only scores above 75 guarantee a human hiring manager conversation.",
    reentryMechanism:
      "Candidates may reapply after 6 months but are flagged in the system as 'previously scored.' No appeal mechanism exists. Candidates are not informed of their score or the criteria used.",
    knownRisks:
      "Documented racial and gender bias in microexpression analysis. ADHD, autism spectrum, and non-native speakers systematically score lower on 'communication coherence' metrics. The system has never been externally audited.",
    desiredFutureDirection:
      "Replace with structured human interview panels supported by anonymized skills assessments. Require explainability for all rejections. Mandate third-party bias audits annually.",
  },
  {
    title: "Educational Ranking Algorithm",
    systemType: "education",
    description:
      "A national education ministry has deployed an AI ranking system that assigns students aged 14–18 a composite 'academic potential score' used to stream students into vocational, standard, or advanced academic tracks. The algorithm incorporates teacher behavioral ratings alongside standardized test results.",
    targetPopulation:
      "Secondary school students nationwide, with evidence of disparate impact on students from rural areas, low-income households, students with chronic illness, and students from ethnic minority backgrounds.",
    evaluationMechanism:
      "Weighted average of standardized test scores (40%), teacher behavioral assessments submitted quarterly (35%), and attendance/punctuality records (25%). Track assignments made at age 14 are legally binding until age 18.",
    dataSources:
      "National standardized test databases, teacher-submitted behavioral assessments via a proprietary platform, attendance systems integrated with municipal public transport data.",
    decisionConsequences:
      "Track assignment at 14 determines eligibility for university entrance examinations, type of secondary school funding received, and access to advanced STEM or humanities programs. Vocational track students cannot switch to academic track without repeating two full school years.",
    reentryMechanism:
      "A formal appeal requires a parent or guardian to petition the school board in writing. Fewer than 3% of appeals succeed. No mechanism exists to contest teacher behavioral ratings. Re-scoring is permitted only once per academic career.",
    knownRisks:
      "Teacher behavioral ratings contain well-documented bias against students diagnosed with ADHD, anxiety disorders, or those from ethnic minority backgrounds. Rural students score lower on standardized tests due to unequal resource distribution, not academic potential.",
    desiredFutureDirection:
      "Abolish binding track assignment before age 16. Replace teacher behavioral ratings with portfolio-based assessment. Require annual algorithmic bias reporting disaggregated by demographic group.",
  },
  {
    title: "Welfare Eligibility Scoring",
    systemType: "welfare",
    description:
      "A municipal social services department uses a predictive risk-scoring system to triage welfare benefit applications. The system assigns a 'vulnerability priority score' that determines processing speed, benefit generosity, and the assignment of caseworkers.",
    targetPopulation:
      "Adults and families applying for housing assistance, food support, disability benefits, and emergency income support. The system processes approximately 40,000 applications per year.",
    evaluationMechanism:
      "Logistic regression model trained on five years of historical caseload data. Inputs include declared income, household composition, prior benefit history, postcode deprivation index, and 'engagement history' tracking interactions with caseworkers.",
    dataSources:
      "Municipal tax and benefits databases, housing authority records, criminal justice interface data (shared under a data-sharing agreement), prior welfare claim records going back 15 years.",
    decisionConsequences:
      "High-risk scores (>70) receive priority processing within 3 days. Medium scores (40–70) wait 3–6 weeks. Low scores (<40) enter a standard 8-week queue with reduced caseworker attention. Housing applications below 40 are deprioritized regardless of declared urgency.",
    reentryMechanism:
      "Applicants may request a manual review after 30 days. Manual review capacity is limited to 200 cases per month against a backlog of 2,000. No mechanism exists to challenge the model's inputs or outputs.",
    knownRisks:
      "Criminal justice data contamination causes systematic underscoring for individuals with past charges but no convictions. Postcode data encodes historical redlining and ethnic segregation. The model reproduces poverty traps by penalizing repeated applications.",
    desiredFutureDirection:
      "Replace predictive scoring with needs-based triage. Provide applicants with written explanations of processing tier. Prohibit use of criminal justice data in benefit eligibility decisions.",
  },
  {
    title: "Research Paper Evaluation AI",
    systemType: "academic",
    description:
      "A major academic funding body has deployed an AI system to pre-screen grant applications and research proposals. The system assigns a 'research impact score' used to shortlist applications before human review panels, reducing the panel's workload by approximately 60%.",
    targetPopulation:
      "Academic researchers at all career stages, particularly early-career researchers without extensive publication records, researchers from non-Anglophone institutions, and those working in emerging or interdisciplinary fields.",
    evaluationMechanism:
      "Natural language processing analysis of proposal abstracts and full texts scored against a corpus of highly-cited funded research from the past 15 years. Citation network centrality of named investigators is weighted at 30% of the final score.",
    dataSources:
      "Published paper databases (Scopus, Web of Science), prior grant award records, institutional h-index rankings, and a proprietary 'innovation vocabulary' index derived from tech industry patent language.",
    decisionConsequences:
      "Proposals scoring below 55 are removed from human review entirely. Proposals above 55 are reviewed by panels; above 75 receive priority panel time and are fast-tracked to full review. Applications removed by the AI receive no explanation.",
    reentryMechanism:
      "Researchers may resubmit in the next funding cycle. No feedback is provided regarding the AI's rejection. Researchers from institutions not in the system's training corpus have no documented pathway to contest a rejection.",
    knownRisks:
      "Citation network weighting systematically advantages researchers from highly-funded English-language institutions. The 'innovation vocabulary' index is biased toward technology and biomedical fields. Qualitative and humanistic research is structurally underscored.",
    desiredFutureDirection:
      "Restrict AI to administrative completeness checks only. Require diverse interdisciplinary human panels for all scoring. Mandate annual reporting on demographic distribution of funded vs. rejected applicants.",
  },
  {
    title: "Urban Surveillance Credit Network",
    systemType: "civic",
    description:
      "A metropolitan government has implemented a civic behavior scoring system that assigns residents a 'community contribution index' based on behavioral monitoring in public spaces, digital civic engagement records, and compliance with municipal regulations. The score affects access to public services and housing priority.",
    targetPopulation:
      "All registered residents of the metropolitan area (population 4.2 million), with documented disparate impact on informal workers, migrants, homeless individuals, and residents of historically under-resourced neighborhoods.",
    evaluationMechanism:
      "Sensor-integrated urban surveillance network combining facial recognition in transit systems, commercial zones, and public parks with digital records of civic participation (voting, public comment submissions, voluntary service). Compliance deductions for minor infractions tracked via smart city infrastructure.",
    dataSources:
      "CCTV and facial recognition databases, transit card usage, municipal court records, voluntary civic participation registries, smart meter usage data, and social media monitoring for 'anti-social sentiment.'",
    decisionConsequences:
      "Scores above 750 grant priority access to public housing applications, business licenses, and school enrollment. Scores below 600 result in restricted access to subsidized transit, reduced priority in emergency services queue, and flagging for 'enhanced monitoring.'",
    reentryMechanism:
      "Score recovery requires demonstrable 'positive behavioral events' over 12 consecutive months. No formal appeals process exists. Individuals flagged for enhanced monitoring cannot view their own detailed score breakdown.",
    knownRisks:
      "Facial recognition systems have documented error rates 10–34x higher for darker-skinned individuals. Civic participation metrics favor formal employment and stable housing. Informal workers and migrants are structurally unable to accumulate score through standard channels.",
    desiredFutureDirection:
      "Abolish behavioral scoring for public service access. Restrict facial recognition to targeted law enforcement with judicial oversight. Implement participatory governance structures for all civic infrastructure decisions.",
  },
  {
    title: "Biological Risk Score in Insurance",
    systemType: "healthcare",
    description:
      "A major health and life insurance consortium has implemented a polygenic risk score combined with wearable device behavioral data to adjust insurance premiums and coverage eligibility. The system claims to offer 'personalized actuarial fairness' by pricing risk at the individual genomic and behavioral level.",
    targetPopulation:
      "Insurance applicants and existing policyholders who consent to genomic testing and continuous wearable monitoring as a condition of receiving 'standard' rather than 'enhanced-rate' coverage.",
    evaluationMechanism:
      "Polygenic risk scores calculated from genome-wide association study (GWAS) data covering 47 disease categories combined with behavioral risk indices from wearable device data (sleep, activity, heart rate variability). Composite score adjusts premiums quarterly.",
    dataSources:
      "Saliva-based DNA samples, wearable device streams (Fitbit, Apple Watch, proprietary device), prescription medication records (via pharmacy data agreements), and BMI/clinical biomarker records from insurer-contracted clinics.",
    decisionConsequences:
      "Premium adjustments range from -20% to +85% based on composite score. Scores in the highest risk decile trigger automatic referral for 'risk counseling' as a coverage condition. Genetic predispositions for depression and schizophrenia directly affect premiums in the current model.",
    reentryMechanism:
      "Policyholders may contest a score adjustment by providing counter-evidence from an independent physician, at their own expense. Genomic score components cannot be altered. No third-party arbitration exists for contested score changes.",
    knownRisks:
      "GWAS training data is 78% European-ancestry, producing higher false-positive risk signals for non-European ancestry individuals. Psychiatric genetic risk factors are weaponized for financial penalty. Behavioral monitoring creates pervasive self-modification pressure.",
    desiredFutureDirection:
      "Prohibit use of genetic data in insurance pricing. Mandate community-rated premiums by law. Establish an independent genomic ethics board with binding enforcement authority over actuarial practices.",
  },
  {
    title: "Creator Reputation Score Platform",
    systemType: "platform",
    description:
      "A major content platform has implemented a 'Creator Trust Score' that algorithmically rates all content producers on a 0–100 scale and uses this score to determine content distribution, monetization eligibility, and advertiser matching. The score is visible to advertisers but not fully disclosed to creators.",
    targetPopulation:
      "Approximately 2 million content creators globally, with particular impact on independent journalists, political commentators, health and wellness creators, and creators producing content in minority languages.",
    evaluationMechanism:
      "Ensemble model combining viewer engagement metrics, content moderation flag rates (including automated flags), third-party 'brand safety' ratings, advertiser complaint volume, and a proprietary 'authenticity index' derived from posting pattern analysis.",
    dataSources:
      "Platform engagement analytics, automated content moderation outputs, brand safety vendor scores (DoubleVerify, IAS), advertiser self-report complaint data, posting metadata, and off-platform cross-referencing via IP and device fingerprinting.",
    decisionConsequences:
      "Scores below 45 result in demonetization, algorithmic suppression (content shown to 15% of normal audience), and exclusion from the Creator Partner Program. Scores below 25 trigger account suspension review. Creators are not informed of specific deductions.",
    reentryMechanism:
      "Creators may appeal account actions via a web form with a median response time of 34 days. Score breakdowns are not available to creators. Automated flag disputes require creators to provide evidence that the platform's own AI was wrong, with no human review guaranteed.",
    knownRisks:
      "Brand safety vendors systematically down-rate content discussing race, LGBTQ+ topics, mental health, and political conflict — regardless of journalistic or artistic merit. Automated moderation flags disproportionately target minority-language content. Score opacity prevents structural accountability.",
    desiredFutureDirection:
      "Require full score transparency to affected creators. Establish an independent content moderation appeals body with binding authority. Prohibit brand safety scores from affecting news and journalism content distribution.",
  },
  {
    title: "Post-AI Labor Allocation System",
    systemType: "labor",
    description:
      "Following large-scale automation of administrative, creative, and logistics roles, a national government has implemented an AI-managed labor reallocation system. The system assigns displaced workers to retraining programs, public sector roles, or income support tiers based on an 'adaptability index' and 'reallocation probability score.'",
    targetPopulation:
      "Workers displaced by automation across manufacturing, administrative, creative, and service sectors — approximately 3.4 million individuals in the first deployment phase, with 70% over age 40.",
    evaluationMechanism:
      "Composite 'adaptability index' drawn from age, prior educational attainment, performance on a standardized digital literacy assessment, psychometric personality inventory, and analysis of social network digital activity as a proxy for 'openness to change.'",
    dataSources:
      "National employment registry, educational credential databases, tax records, standardized digital literacy test administered via government portal, proprietary psychometric platform data, and anonymized mobile phone behavioral data purchased from telecom partners.",
    decisionConsequences:
      "High-adaptability scorers (top 25%) are offered funded university retraining with full income replacement. Mid-tier scorers (middle 50%) receive 18-month vocational programs with 60% income replacement. Low scorers (bottom 25%) receive 12 months of income support only, after which they enter a residual 'basic income review' process with no guaranteed outcome.",
    reentryMechanism:
      "Workers in the bottom tier may re-take the digital literacy assessment once per year. Psychometric scores are locked for 3 years. No mechanism exists to contest the social network digital activity component of the adaptability index.",
    knownRisks:
      "The psychometric personality inventory has documented lower 'openness' scores for older workers, workers with disabilities, and individuals from cultures with different orientations to institutional authority. Social network behavioral data is inaccessible to workers who do not use smartphones. Age is directly embedded as a scoring variable.",
    desiredFutureDirection:
      "Replace adaptability scoring with universal retraining entitlements. Establish democratic worker governance of reallocation program design. Prohibit age, social media behavior, and psychometric traits from determining public benefit access.",
  },
]
