/**
 * The plan itself.
 *
 * Kept as data rather than JSX so the same numbers drive the blueprint page,
 * the stream playbooks and the dashboard without being retyped anywhere.
 */

export const CAPITAL_TARGET = 5_000_000;
export const DEPLOYED_CAPITAL = 3_000_000;
export const TARGET_RETURN = 0.2;
export const ANNUAL_INCOME = DEPLOYED_CAPITAL * TARGET_RETURN; // 600,000
export const MONTHLY_INCOME = ANNUAL_INCOME / 12; // 50,000
export const RESERVE = CAPITAL_TARGET - DEPLOYED_CAPITAL; // 2,000,000
export const HORIZON_YEARS = 3;

export const thesis = {
  title: "The Blueprint",
  standfirst:
    "Earn five million dollars across multiple income streams. Put three million of it to work. Live on what the capital produces, not on what you produce.",
  steps: [
    {
      id: "earn",
      label: "Earn $5,000,000",
      detail:
        "Across one stream or ten, over roughly three years. This is the only phase that requires your time.",
      figure: CAPITAL_TARGET,
    },
    {
      id: "deploy",
      label: "Deploy $3,000,000",
      detail:
        "Into assets targeting a 20% annual return. The remaining $2M stays as reserve, tax provision and living costs.",
      figure: DEPLOYED_CAPITAL,
    },
    {
      id: "live",
      label: "Live on $600,000 a year",
      detail:
        "$50,000 a month, produced by capital rather than labour. Work becomes optional at this point.",
      figure: ANNUAL_INCOME,
    },
  ],
};

/**
 * Each of these reaches $5M on its own. The point is not that any single one
 * is likely — it is that the target is reachable by several independent
 * routes, so no one of them has to carry the whole plan.
 */
export interface SoloRoute {
  streamId: string;
  label: string;
  unitPrice: number;
  units: number;
  unitNoun: string;
  /** How the maths reads in one line. */
  equation: string;
  reality: string;
}

export const soloRoutes: SoloRoute[] = [
  {
    streamId: "digital-products",
    label: "Digital Products",
    unitPrice: 20,
    units: 250_000,
    unitNoun: "copies",
    equation: "$20 × 250,000 copies",
    reality:
      "228 sales a day for three years. Achievable with a catalogue, not a single product.",
  },
  {
    streamId: "shirt-production",
    label: "Print on Demand",
    unitPrice: 50,
    units: 100_000,
    unitNoun: "units",
    equation: "$50 × 100,000 hoodies",
    reality:
      "91 units a day. Gross, not net — print-on-demand margin is roughly 30%, so this route needs volume or higher prices.",
  },
  {
    streamId: "youtube",
    label: "YouTube",
    unitPrice: 0.005,
    units: 1_000_000_000,
    unitNoun: "views",
    equation: "$5 RPM × 1,000,000,000 views",
    reality:
      "A billion views in three years is roughly 913,000 a day. Realistically this is a channel network, not one channel.",
  },
  {
    streamId: "freelancer-agency",
    label: "Freelancer Agency",
    unitPrice: 1_000,
    units: 5_000,
    unitNoun: "engagements",
    equation: "$1,000 × 5,000 engagements",
    reality:
      "Five a day. The most reachable of the five, and the one that funds the others first.",
  },
  {
    streamId: "saas",
    label: "SaaS",
    unitPrice: 50,
    units: 100_000,
    unitNoun: "subscription months",
    equation: "$50/mo × ~2,800 subscribers held for 3 years",
    reality:
      "Compounding rather than linear: retention does the work, so the last year earns more than the first two combined.",
  },
];

/** Phasing. What each year is actually for. */
export const phases = [
  {
    year: "Year 1",
    title: "Prove and fund",
    target: 500_000,
    detail:
      "Agency and services carry the load because they convert skill into cash fastest. Digital products and content start building in parallel but are not expected to pay yet.",
    milestones: [
      "Agency to $1M annual run-rate",
      "First digital product shipped and selling",
      "Content engine publishing weekly without you",
      "Emergency fund fully funded",
    ],
  },
  {
    year: "Year 2",
    title: "Scale and systematise",
    target: 1_500_000,
    detail:
      "Everything that worked in year one gets documented and handed to operators or agents. Content compounds. The catalogue widens rather than deepens.",
    milestones: [
      "Every repeated process written down and delegated",
      "Product catalogue at 5+ titles",
      "Channel network past 100M cumulative views",
      "First $1M banked",
    ],
  },
  {
    year: "Year 3",
    title: "Harvest and deploy",
    target: 3_000_000,
    detail:
      "The compounding streams carry the majority. Capital starts moving out of the business and into assets as it accumulates, rather than waiting for the full $5M.",
    milestones: [
      "Streams running without daily involvement",
      "$3M deployed into return-generating assets",
      "Passive income crosses $50,000/mo",
      "Work becomes optional",
    ],
  },
];

/**
 * The 20% assumption deserves stating plainly rather than buried. This is the
 * single number the whole plan is most sensitive to.
 */
export const returnScenarios = [
  { rate: 0.07, label: "Index average", monthly: (DEPLOYED_CAPITAL * 0.07) / 12 },
  { rate: 0.1, label: "Strong market", monthly: (DEPLOYED_CAPITAL * 0.1) / 12 },
  { rate: 0.15, label: "Aggressive", monthly: (DEPLOYED_CAPITAL * 0.15) / 12 },
  { rate: 0.2, label: "Plan target", monthly: MONTHLY_INCOME },
];
