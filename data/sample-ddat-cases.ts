import type { EvidenceAuditCase } from "@/lib/ddat-evidence-schema"

export const sampleDDATCases: EvidenceAuditCase[] = [
  // ─── Case 1: Hiring AI ─────────────────────────────────────────────────────
  {
    id: "sample-hiring-ai",
    created_at: "2025-01-01",
    institution_profile: {
      institution_type: "hiring_ai",
      system_name: "TalentScreen Pro (simulated)",
      decision_domain: "Initial candidate screening and shortlisting",
      audited_institution: "Generic Large Employer — Simulated Research Example",
      classified_subject: "applicant",
      decision_context:
        "Automated CV screening system that ranks and filters candidates before any human review. Candidates who do not pass the algorithmic threshold are never seen by a recruiter.",
      audit_purpose:
        "Assess whether the system penalises career gaps, non-linear histories, and non-elite credentials in ways that close latent capacity and future employment access.",
      declared_master_function:
        "To identify the most qualified candidates fairly and efficiently, giving every applicant an equal opportunity to be considered.",
    },
    classification_map: {
      classification_terms: ["employability", "fit", "suitability", "reliability"],
      input_variables: [
        {
          id: "v1",
          name: "Employment continuity (no gaps > 3 months)",
          category: "historical_record",
          source: "CV / resume text parsing",
          contestable: false,
          correction_possible: false,
          notes: "System penalises any gap regardless of reason (caregiving, illness, education, layoff).",
        },
        {
          id: "v2",
          name: "Educational institution tier",
          category: "socioeconomic_proxy",
          source: "Degree certificate and institution ranking list",
          contestable: false,
          correction_possible: false,
          notes: "Proxies for class background and geographic origin rather than skill.",
        },
        {
          id: "v3",
          name: "Number of previous employers",
          category: "historical_record",
          source: "CV employment history",
          contestable: false,
          correction_possible: false,
          notes: "Penalises short tenures without distinguishing voluntary movement from structural precarity.",
        },
        {
          id: "v4",
          name: "Credential type and level",
          category: "credential",
          source: "CV qualification section",
          contestable: true,
          correction_possible: true,
          notes: "Formal credentials only; non-formal or accreditation-alternative qualifications are discounted.",
        },
      ],
    },
    closure_map: {
      closures: [
        {
          id: "c1",
          decision_result: "rejected",
          access_closed: ["employment"],
          severity: 3,
          duration: "Immediate and indefinite — no re-application window communicated",
          reversibility: "Unclear; rejected candidates receive no information about reapplying or changing outcome",
          notes:
            "Rejection occurs without human review. Candidates are never informed of the specific variables that caused rejection.",
        },
      ],
    },
    contestability: {
      explanation_provided: false,
      explanation_specificity: 0,
      explanation_actionable: false,
      appeal_available: false,
      correction_available: false,
      human_review_available: false,
      appeal_time_limit_days: null,
      response_time_days: null,
      notes:
        "Rejected candidates receive a generic rejection notice. No explanation of scoring variables, no appeal pathway, no human reviewer is named.",
    },
    support: {
      support_offered: false,
      training_offered: false,
      reassessment_date_given: false,
      case_worker_available: false,
      alternative_pathway_available: false,
      intervention_available: false,
      support_notes:
        "No support, redirection, or guidance is offered to rejected candidates. The system functions as a pure binary gate.",
    },
    reentry: {
      reapplication_allowed: true,
      waiting_period_days: 365,
      score_expiration_days: null,
      past_classification_persists: true,
      reassessment_available: false,
      reassessment_interval_days: null,
      reentry_conditions_clear: false,
      reentry_notes:
        "Candidates may reapply after one year, but the underlying score model is retained. Without understanding what caused rejection, re-entry is practically unavailable.",
    },
    responsibility: {
      classification_design_owner: "(not disclosed — vendor proprietary model)",
      decision_owner: "Human Resources Department (nominal)",
      system_operator: "Employer IT / Procurement",
      AI_vendor: "(not disclosed publicly)",
      data_provider: "Applicant (self-reported via CV)",
      appeal_owner: "(not named)",
      correction_owner: "(not named)",
      human_override_owner: "(not named)",
      audit_owner: "(not named)",
      governance_oversight_owner: "(not named)",
      responsible_contact_exists: false,
      override_authority_exists: false,
      responsibility_basis: "declared",
      responsibility_notes:
        "Formal responsibility rests with HR but the AI vendor's model is not disclosed. No contact exists for candidates to challenge a decision. Responsibility is practically displaced onto the system.",
    },
    counterfactuals: [
      {
        id: "cf1",
        changed_variable: "career_gap",
        baseline_value: "Continuous employment — no gap",
        modified_value: "18-month gap (caregiving)",
        baseline_outcome: "accepted",
        modified_outcome: "rejected",
        closure_delta: 3,
        notes:
          "Simulated test: identical candidate profile except for an 18-month employment gap attributed to caregiving. The gap alone changes outcome from accepted to rejected.",
      },
      {
        id: "cf2",
        changed_variable: "education_credential",
        baseline_value: "Elite-tier university degree",
        modified_value: "Community college degree (equivalent subject)",
        baseline_outcome: "accepted",
        modified_outcome: "rejected",
        closure_delta: 2,
        notes:
          "Simulated test: institution tier alone, not subject knowledge, drives difference in outcome.",
      },
    ],
    evidence_sources: [
      {
        id: "e1",
        source_type: "simulated_scenario",
        title: "Simulated audit scenario — Hiring AI",
        citation_or_url: "",
        date: "2025-01-01",
        reliability_notes: "This is a research prototype case. It does not represent a real institution.",
        evidence_level: 1,
      },
      {
        id: "e2",
        source_type: "counterfactual_test",
        title: "Counterfactual: career gap and credential tier",
        citation_or_url: "",
        date: "2025-01-01",
        reliability_notes: "Simulated counterfactual based on hypothetical model logic.",
        evidence_level: 3,
      },
    ],
    governance_claims: [
      {
        id: "g1",
        category: "human_review",
        claim_text: "Every applicant is given a fair and equal opportunity, with review available on request.",
        source: "Careers page FAQ (simulated)",
        self_reported: true,
      },
      {
        id: "g2",
        category: "appeal_rights",
        claim_text: "Candidates may request reconsideration of a decision.",
        source: "Careers page FAQ (simulated)",
        self_reported: true,
      },
    ],
  },

  // ─── Case 2: Credit / Housing Screening ───────────────────────────────────
  {
    id: "sample-credit-housing",
    created_at: "2025-01-01",
    institution_profile: {
      institution_type: "housing_screening",
      system_name: "RentScore Evaluator (simulated)",
      decision_domain: "Rental housing application screening",
      audited_institution: "Generic Property Management Platform — Simulated Research Example",
      classified_subject: "tenant",
      decision_context:
        "Automated tenant screening system used by landlords to approve or reject rental applications. Thin-file applicants, migrants, young people, and freelancers are systematically scored lower.",
      audit_purpose:
        "Assess whether the system confuses financial risk with personal worth, applies proxy discrimination, and closes housing access for structurally disadvantaged groups.",
      declared_master_function:
        "To provide an efficient, data-driven risk assessment that helps landlords make informed decisions while giving all applicants a fair chance.",
    },
    classification_map: {
      classification_terms: ["creditworthiness", "housing_risk", "eligibility", "reliability"],
      input_variables: [
        {
          id: "v1",
          name: "Credit score (thin file)",
          category: "socioeconomic_proxy",
          source: "Credit bureau",
          contestable: true,
          correction_possible: true,
          notes:
            "No credit history is treated as equivalent to bad credit. Migrants, young people, and recently arrived workers are systematically penalised.",
        },
        {
          id: "v2",
          name: "Income stability (employment type)",
          category: "socioeconomic_proxy",
          source: "Income verification document",
          contestable: false,
          correction_possible: false,
          notes:
            "Freelancers, platform workers, and self-employed persons are marked as higher risk regardless of income level.",
        },
        {
          id: "v3",
          name: "Rental history length",
          category: "historical_record",
          source: "Previous tenancy records",
          contestable: false,
          correction_possible: false,
          notes:
            "No rental history (first-time renters, recent migrants) is treated as a risk factor.",
        },
        {
          id: "v4",
          name: "Address history continuity",
          category: "location_proxy",
          source: "Address verification",
          contestable: false,
          correction_possible: false,
          notes:
            "Frequent address changes are penalised, even when caused by forced displacement or family transitions.",
        },
      ],
    },
    closure_map: {
      closures: [
        {
          id: "c1",
          decision_result: "rejected",
          access_closed: ["housing"],
          severity: 3,
          duration: "Until the applicant builds a credit and rental history — which requires being accepted first",
          reversibility: "Structurally low: the conditions for improvement require the access that is being denied",
          notes:
            "Circular closure: the system requires proof of tenancy history to grant tenancy. First-time and thin-file renters cannot break the cycle.",
        },
        {
          id: "c2",
          decision_result: "higher_price",
          access_closed: ["housing"],
          severity: 2,
          duration: "Ongoing",
          reversibility: "Conditional on credit improvement over 12–24 months",
          notes:
            "Borderline applicants may be accepted at higher deposit or with guarantor requirements, creating financial burden.",
        },
      ],
    },
    contestability: {
      explanation_provided: true,
      explanation_specificity: 1,
      explanation_actionable: false,
      appeal_available: false,
      correction_available: true,
      human_review_available: false,
      appeal_time_limit_days: null,
      response_time_days: null,
      notes:
        "A generic score report is provided. It does not specify which variables drove the outcome or how to improve the score. Credit file errors can be disputed through the credit bureau, but this does not trigger a re-evaluation.",
    },
    support: {
      support_offered: false,
      training_offered: false,
      reassessment_date_given: false,
      case_worker_available: false,
      alternative_pathway_available: false,
      intervention_available: false,
      support_notes:
        "No support, alternative pathway, or guidance is offered. The system is purely classificatory.",
    },
    reentry: {
      reapplication_allowed: true,
      waiting_period_days: 90,
      score_expiration_days: null,
      past_classification_persists: true,
      reassessment_available: false,
      reassessment_interval_days: null,
      reentry_conditions_clear: false,
      reentry_notes:
        "Applicants may reapply after 90 days. The score model is unchanged. Without building credit or tenancy history — which requires being accepted — improvement is structurally blocked.",
    },
    responsibility: {
      classification_design_owner: "RentScore Evaluator (simulated vendor) — model proprietary",
      decision_owner: "Landlord / Property Manager",
      system_operator: "Property Management Platform",
      AI_vendor: "RentScore Evaluator (simulated vendor)",
      data_provider: "Credit Bureau + applicant",
      appeal_owner: "(not named)",
      correction_owner: "Credit Bureau (for credit data only)",
      human_override_owner: "Landlord (informal, ad hoc)",
      audit_owner: "(not named)",
      governance_oversight_owner: "(not named)",
      responsible_contact_exists: false,
      override_authority_exists: false,
      responsibility_basis: "declared",
      responsibility_notes:
        "The landlord can informally override the score, but there is no formal process. The AI vendor's model logic is proprietary. The credit bureau handles corrections only for factual errors, not for structural thin-file status.",
    },
    counterfactuals: [
      {
        id: "cf1",
        changed_variable: "credit_history_length",
        baseline_value: "5-year credit history",
        modified_value: "Thin file (0 years credit history — recent arrival)",
        baseline_outcome: "accepted",
        modified_outcome: "rejected",
        closure_delta: 3,
        notes:
          "Identical income and rent-to-income ratio. Thin-file status alone changes outcome. The system cannot distinguish between 'has not had opportunity to build credit' and 'has poor credit'.",
      },
    ],
    evidence_sources: [
      {
        id: "e1",
        source_type: "simulated_scenario",
        title: "Simulated audit scenario — Credit/Housing Screening",
        citation_or_url: "",
        date: "2025-01-01",
        reliability_notes: "This is a research prototype case. It does not represent a real institution.",
        evidence_level: 1,
      },
      {
        id: "e2",
        source_type: "counterfactual_test",
        title: "Counterfactual: thin-file vs. established credit",
        citation_or_url: "",
        date: "2025-01-01",
        reliability_notes: "Simulated counterfactual.",
        evidence_level: 3,
      },
    ],
    governance_claims: [
      {
        id: "g1",
        category: "non_discrimination",
        claim_text: "Our scoring model does not discriminate based on protected characteristics.",
        source: "Vendor marketing material (simulated)",
        self_reported: true,
      },
      {
        id: "g2",
        category: "data_correction",
        claim_text: "Applicants can dispute inaccurate information in their file.",
        source: "Website FAQ (simulated)",
        self_reported: true,
      },
    ],
  },

  // ─── Case 3: Welfare AI ────────────────────────────────────────────────────
  {
    id: "sample-welfare-ai",
    created_at: "2025-01-01",
    institution_profile: {
      institution_type: "welfare_ai",
      system_name: "BenefitRisk Classifier (simulated)",
      decision_domain: "Welfare eligibility and fraud risk classification",
      audited_institution: "Generic Welfare Administration — Simulated Research Example",
      classified_subject: "welfare_recipient",
      decision_context:
        "Automated system that classifies welfare applicants by fraud risk and administrative suspicion. High-risk flags trigger additional review, documentation requirements, and delays. In some cases, applications are denied without human review.",
      audit_purpose:
        "Assess whether the system converts poverty conditions into data-suspicion, places undue burden of proof on applicants, and functions as a punitive rather than support-oriented classification.",
      declared_master_function:
        "To help ensure benefits reach those who are eligible while protecting public funds from fraud, and to support applicants throughout the process.",
    },
    classification_map: {
      classification_terms: ["fraud_suspicion", "eligibility", "reliability", "risk"],
      input_variables: [
        {
          id: "v1",
          name: "Address instability",
          category: "location_proxy",
          source: "Address history from public records",
          contestable: false,
          correction_possible: false,
          notes:
            "Frequent address changes (common in poverty and housing instability) are treated as fraud signals rather than as signs of precarity.",
        },
        {
          id: "v2",
          name: "Income variability",
          category: "socioeconomic_proxy",
          source: "Income tax and benefits records",
          contestable: false,
          correction_possible: false,
          notes:
            "Irregular income (gig work, informal employment) is marked as a risk factor even though it characterises many low-income applicants.",
        },
        {
          id: "v3",
          name: "Prior welfare claims",
          category: "institutional_record",
          source: "Internal benefit system records",
          contestable: true,
          correction_possible: true,
          notes:
            "Previous claims — even fully legitimate ones — are treated as risk elevators. The system penalises people who have needed support before.",
        },
        {
          id: "v4",
          name: "Application error history",
          category: "institutional_record",
          source: "Internal error and correction logs",
          contestable: false,
          correction_possible: false,
          notes:
            "Prior administrative errors (paperwork mistakes, missing documents) are logged as suspicion signals, even when caused by system complexity or language barriers.",
        },
      ],
    },
    closure_map: {
      closures: [
        {
          id: "c1",
          decision_result: "flagged",
          access_closed: ["welfare"],
          severity: 2,
          duration: "Until additional documentation is provided — no time limit specified",
          reversibility: "Conditional on applicant supplying documentation that may not exist",
          notes:
            "Flagged applicants face extended review with additional document requirements. Documentation may be impossible for informal workers, homeless applicants, or non-native speakers.",
        },
        {
          id: "c2",
          decision_result: "rejected",
          access_closed: ["welfare", "public_service"],
          severity: 3,
          duration: "Minimum 6 months before re-application",
          reversibility: "Formally available but requires clearing fraud flag — which may be impossible without legal assistance",
          notes:
            "Rejected applicants are referred to fraud investigation in some cases. The investigation process can take months and leaves a permanent record even if cleared.",
        },
      ],
    },
    contestability: {
      explanation_provided: true,
      explanation_specificity: 2,
      explanation_actionable: false,
      appeal_available: true,
      correction_available: true,
      human_review_available: true,
      appeal_time_limit_days: 28,
      response_time_days: 60,
      notes:
        "A category-level explanation is provided ('flagged for further review — administrative anomalies detected'). An appeal process formally exists but requires written submission and legal knowledge. Human review is available but takes 60 days and the applicant receives no support during this period.",
    },
    support: {
      support_offered: false,
      training_offered: false,
      reassessment_date_given: false,
      case_worker_available: true,
      alternative_pathway_available: false,
      intervention_available: false,
      support_notes:
        "A case worker is nominally assigned but caseloads are high and contact is difficult. No material support is offered during the review period. Applicants must survive without benefits while the appeal proceeds.",
    },
    reentry: {
      reapplication_allowed: true,
      waiting_period_days: 180,
      score_expiration_days: null,
      past_classification_persists: true,
      reassessment_available: true,
      reassessment_interval_days: 365,
      reentry_conditions_clear: false,
      reentry_notes:
        "Prior fraud flags persist permanently in the system. Even cleared flags remain visible to future caseworkers. Annual re-assessment is formal but uses the same underlying model.",
    },
    responsibility: {
      classification_design_owner: "(not disclosed — public procurement process)",
      decision_owner: "Welfare Administration (agency)",
      system_operator: "Government IT Department",
      AI_vendor: "(not disclosed — public procurement process)",
      data_provider: "Tax authority + internal benefits database",
      appeal_owner: "Welfare Appeals Tribunal",
      correction_owner: "Case Worker (limited authority)",
      human_override_owner: "Senior Caseworker (formal authority, rarely used)",
      audit_owner: "(not named — audit planned but not yet scheduled)",
      governance_oversight_owner: "(not named — audit planned but not yet scheduled)",
      responsible_contact_exists: true,
      override_authority_exists: true,
      responsibility_basis: "declared",
      responsibility_notes:
        "Override authority formally exists but is difficult to activate. The AI vendor's model logic is protected by procurement confidentiality. No external audit has been performed.",
    },
    counterfactuals: [
      {
        id: "cf1",
        changed_variable: "income_volatility",
        baseline_value: "Stable salaried income",
        modified_value: "Irregular gig-economy income (same annual total)",
        baseline_outcome: "accepted",
        modified_outcome: "flagged",
        closure_delta: 2,
        notes:
          "Same annual income, same need. Income irregularity alone triggers the fraud flag. The system cannot distinguish between financial precarity and financial fraud.",
      },
      {
        id: "cf2",
        changed_variable: "welfare_history",
        baseline_value: "First-time applicant",
        modified_value: "Previous legitimate claim 3 years ago",
        baseline_outcome: "accepted",
        modified_outcome: "flagged",
        closure_delta: 1,
        notes:
          "Having previously received legitimate support elevates risk score. The system penalises those who have needed help before.",
      },
    ],
    evidence_sources: [
      {
        id: "e1",
        source_type: "simulated_scenario",
        title: "Simulated audit scenario — Welfare AI",
        citation_or_url: "",
        date: "2025-01-01",
        reliability_notes: "This is a research prototype case. It does not represent a real institution.",
        evidence_level: 1,
      },
      {
        id: "e2",
        source_type: "counterfactual_test",
        title: "Counterfactual: income volatility and welfare history",
        citation_or_url: "",
        date: "2025-01-01",
        reliability_notes: "Simulated counterfactual.",
        evidence_level: 3,
      },
      {
        id: "e3",
        source_type: "website_or_FAQ",
        title: "Agency public documentation on appeal process",
        citation_or_url: "",
        date: "2025-01-01",
        reliability_notes: "Public document describing formal appeal procedure — does not confirm practical accessibility.",
        evidence_level: 2,
      },
    ],
    governance_claims: [
      {
        id: "g1",
        category: "appeal_rights",
        claim_text: "Applicants have the right to appeal any adverse decision within 28 days.",
        source: "Agency public documentation on appeal process (simulated)",
        self_reported: true,
      },
      {
        id: "g2",
        category: "data_retention_limits",
        claim_text: "Fraud flags are reviewed and cleared after resolution and do not affect future applications.",
        source: "Agency FAQ (simulated)",
        self_reported: true,
      },
      {
        id: "g3",
        category: "accountability",
        claim_text: "A dedicated caseworker is responsible for every applicant's case.",
        source: "Agency public documentation (simulated)",
        self_reported: true,
      },
    ],
  },
]
