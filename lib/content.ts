// All UI copy lives here. Edit strings without touching component code.

export const CONTENT = {
  brand: {
    name: "Global Call for Startups",
    partners: ["Katapult", "Norrsken", "EAT Foundation"],
    cta: "Apply now →",
  },

  hero: {
    eyebrow: "Global Call for Startups · 2026 · Applications open",
    headline: "Apply here. Help us transform the food system at the scale",
    headlineAccent: "science demands",
    headlineEnd: ".",
    lede: "A competition for early-stage ventures, built on the 2025 EAT-Lancet Commission report — the global guardrails for healthy, sustainable, and socially just food systems. Winners pitch at Impact/Week Barcelona and gain tailored support from Katapult and Norrsken.",
    meta: [
      { label: "Stage", value: "Pre-seed → Series A" },
      { label: "Closing", value: "15 June 2026" },
      { label: "Framework", value: "EAT-Lancet 2.0" },
      { label: "Time to apply", value: "~15 minutes" },
    ],
  },

  criteria: {
    sectionNum: "§ 01 — Selection criteria",
    heading: "What we look for",
    aside:
      "Seven criteria applied across every round of evaluation — the EAT-Lancet 2.0 scientific framework with a commercial lens.",
    items: [
      {
        num: "01",
        title: "Impact",
        body: "At scale the innovation will make a significant contribution in alignment with the EAT Lancet 2.0 vision.",
      },
      {
        num: "02",
        title: "Innovation",
        body: "Innovation is based on a scalable technology with clear freedom to operate.",
      },
      {
        num: "03",
        title: "Technology",
        body: "Validated technology in laboratory or relevant environment.",
      },
      {
        num: "04",
        title: "Business Stage",
        body: "Seed to Series A — open for pre-seed with some traction.",
      },
      {
        num: "05",
        title: "Customer",
        body: "Benefits confirmed from primary market research or first customer testing.",
      },
      {
        num: "06",
        title: "Team",
        body: "Founder(s) with proven relevant experience and full-time commitment.",
      },
      {
        num: "07",
        title: "Benefit from support",
        body: "Support from Anchor Partners will bring a catalytic effect to winners.",
      },
    ],
  },

  applyDivider: {
    eyebrow: "§ 02 — Submit your idea",
    headline: "Apply here.",
    headlineItalic: "Six sections. Fifteen minutes.",
    meta: "Applications are reviewed by the EAT-Lancet jury and partners.",
    metaDeadline: "Closing 15 June 2026.",
  },

  form: {
    demoButton: "Fill demo data",
    resetButton: "Reset",
    backButton: "← Back",
    continueButton: "Continue →",
    reviewButton: "Review & submit →",
    stepperTitle: "Your application",
    progressSuffix: "% ready to review",
  },

  steps: [
    { id: "contact", num: "01", label: "Contact", hint: "Who we're talking to" },
    { id: "company", num: "02", label: "Company", hint: "About the venture" },
    { id: "stage", num: "03", label: "Stage & Team", hint: "Where you are" },
    { id: "solution", num: "04", label: "Problem & Solution", hint: "What you're building" },
    { id: "framework", num: "05", label: "EAT Alignment", hint: "Scientific fit" },
    { id: "deck", num: "06", label: "Pitch Deck", hint: "Upload materials" },
  ] as const,

  stepPanels: {
    contact: {
      title: "Who are we talking to?",
      sub: "One lead contact per application. We'll correspond here throughout the process.",
    },
    company: {
      title: "Tell us about your company",
      sub: "The basics. Keep the website URL current — reviewers visit.",
    },
    stage: {
      title: "Where are you on the journey?",
      sub: "Used to set the right peer group for evaluation. Pre-seed to Series A only.",
    },
    solution: {
      title: "The problem and your solution",
      sub: "Specificity wins here. Vague answers are the most common reason for a weak review.",
    },
    framework: {
      title: "Alignment with the scientific framework",
      sub: "Show us you understand EAT Lancet 2.0 and name the guardrails your solution moves.",
    },
    deck: {
      title: "Upload your pitch deck",
      sub: "One file. The deck is your primary artefact for round one.",
    },
  },

  fields: {
    contactName: { label: "Full name", placeholder: "Jane Doe" },
    contactRole: { label: "Role / title", placeholder: "Co-founder & CEO" },
    contactEmail: {
      label: "Work email",
      placeholder: "jane@yourco.com",
      help: "We'll send all review communications here.",
    },
    companyName: { label: "Company name", placeholder: "Your company" },
    website: { label: "Website", placeholder: "https://yourco.com" },
    country: { label: "HQ country" },
    stage: { label: "Current stage" },
    teamSize: { label: "Team size" },
    funding: { label: "Funding raised" },
    problem: {
      label: "The problem you're solving",
      placeholder: "E.g. Global pork production emits 800 Mt CO₂e annually…",
      help: "Describe who suffers, at what scale, and why existing solutions fall short. Include a data point.",
      maxWords: 180,
    },
    solution: {
      label: "Your solution",
      placeholder: "Name the tech, the mechanism, the data.",
      help: "Be specific about the technology, evidence it works, and current stage of validation.",
      maxWords: 260,
    },
    framework: {
      label: "How does your innovation align with the EAT Lancet scientific framework?",
      placeholder:
        "Our ingredient displaces soy and fishmeal — two drivers of land-use change flagged in EAT Lancet…",
      help: "Reference the specific guardrails you move. Quantify if you can.",
      maxWords: 240,
    },
    deck: {
      label: "Pitch deck",
      help: "The deck should cover: problem, solution, tech validation, team, traction, ask. 10–20 slides.",
      dropTitle: "Upload pitch deck",
      dropHint: "PDF, PPTX or KEY · up to 25 MB · max 20 slides recommended",
      removeButton: "Remove",
    },
  },

  frameworkCallout: {
    title: "EAT Lancet 2.0 framework",
    body: "Your solution should move one or more planetary-health boundaries — GHG emissions, land-system change, biosphere integrity, nitrogen & phosphorus flows, freshwater use — while supporting a healthy, socially just diet.",
  },

  deckLegal:
    "By submitting you confirm you have rights to all materials included and consent to evaluation by Katapult, Norrsken, and their review partners under the EAT Foundation scientific framework.",

  review: {
    loadingTitle: "Reviewing your application",
    loadingBody:
      "We're checking completeness and giving you feedback before it goes to the partners.",
    backToEdit: "Back to edit",
    submitButton: "Submit application →",
    submitAnywayButton: "Submit anyway",
    eyebrow: "Pre-submission review",
    verdictPass: "Ready to submit",
    verdictWarn: "Almost there",
    verdictFail: "Needs work",
    headlinePass: "Your application clears the bar.",
    headlineWarn: "A few things to strengthen.",
    thresholdLabel: "Threshold for this strictness level:",
  },

  submitted: {
    title: "Application received",
    body: "Thank you. Your submission has been logged and shared with the review panel at Katapult and Norrsken. You'll hear from us within four weeks.",
    refLabel: "Ref",
    scoreLabel: "Score",
    submittedLabel: "Submitted",
    doneButton: "← Back to top",
  },
};

// Selects and their options
export const OPTIONS = {
  countries: [
    "Select country…",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Iceland",
    "Netherlands",
    "Germany",
    "France",
    "United Kingdom",
    "Ireland",
    "Spain",
    "Portugal",
    "Italy",
    "Switzerland",
    "United States",
    "Canada",
    "Brazil",
    "Kenya",
    "Nigeria",
    "South Africa",
    "India",
    "Singapore",
    "Japan",
    "Australia",
    "Other",
  ],
  stages: ["Select stage…", "Pre-seed", "Seed", "Series A", "Series A+"],
  teamSizes: ["Select…", "1-2", "3-5", "6-10", "11-25", "26-50", "50+"],
  fundingBands: [
    "Select band…",
    "None yet",
    "Under $250k",
    "$250k–$1M",
    "$1M–$5M",
    "$5M–$15M",
    "$15M+",
  ],
};

// Demo data for the "Fill demo data" button
export const DEMO_DATA = {
  contactName: "Lina Bergström",
  contactEmail: "lina@mycelia.bio",
  contactRole: "Co-founder & CEO",
  companyName: "Mycelia Bio",
  website: "https://mycelia.bio",
  country: "Sweden",
  stage: "Seed",
  teamSize: "6-10",
  funding: "$1M–$5M",
  problem:
    "Global pork production emits over 800 Mt CO₂e annually and relies on soy feed that drives 40% of Amazon deforestation. Smallholder farmers in Southeast Asia, where 60% of global pork is consumed, lack access to feed alternatives that are both affordable and protein-dense.",
  solution:
    "We ferment agricultural side-streams using a proprietary Aspergillus strain (patent pending, EU application 23158972) to produce a protein ingredient with 62% crude protein content and 94% digestibility — benchmarked against fishmeal. Validated in two 8-week pig trials at SLU Uppsala with 8% better feed-conversion ratio. Current production cost is €1.40/kg at pilot scale; we hit price-parity with soy at 500-ton annual throughput.",
  framework:
    "Our ingredient displaces soy and fishmeal — two of the largest drivers of land-use change and ocean depletion flagged in EAT Lancet. By substituting 20% of European pig feed we would cut 18 Mt CO₂e and spare ~2.4M hectares of land annually, directly pulling two planetary-boundary indicators (biosphere integrity, land-system change) back toward safe operating space.",
  deck: null,
};
