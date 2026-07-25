import type {
  Agent,
  Goal,
  Idea,
  IncomeStream,
  LearningTrack,
  RoadmapStage,
} from "@/types";

export const profile = {
  name: "Duke Fred",
  subtitle: "Building My Legacy",
  initials: "DF",
};

export const heroCopy = {
  title: "Master Plan of Financial Freedom",
  subtitle:
    "Build multiple income streams. Automate your money. Create a life where work becomes optional.",
};

export const roadmap: RoadmapStage[] = [
  {
    id: "skills",
    label: "Build Skills",
    detail: "Compounding leverage before capital.",
    complete: true,
  },
  {
    id: "first-income",
    label: "Launch First Income",
    detail: "First pound earned outside a payslip.",
    complete: true,
  },
  {
    id: "scale",
    label: "Scale Systems",
    detail: "Repeatable process, not repeated effort.",
    complete: true,
  },
  {
    id: "automate",
    label: "Automate Business",
    detail: "Agents and operators run the day.",
    complete: false,
  },
  {
    id: "multiple",
    label: "Multiple Income Streams",
    detail: "No single point of failure.",
    complete: false,
  },
  {
    id: "freedom",
    label: "Financial Freedom",
    detail: "Work becomes optional.",
    complete: false,
  },
];

export const goals: Goal[] = [
  {
    id: "monthly-income",
    title: "Monthly Income",
    current: 3200,
    goal: 10000,
    icon: "wallet",
    accent: "gold",
    cadence: "Realised this month",
  },
  {
    id: "net-worth",
    title: "Net Worth",
    current: 85000,
    goal: 1000000,
    icon: "trending-up",
    accent: "success",
    cadence: "Total assets less liabilities",
  },
  {
    id: "emergency-fund",
    title: "Emergency Fund",
    current: 5000,
    goal: 10000,
    icon: "shield",
    accent: "info",
    cadence: "Six months of runway",
  },
];

/**
 * Twelve-month history per stream. Shaped to match each stream's status —
 * "Growing" trends up, "Passive" stays flat, "Planning" is still at zero —
 * so the charts tell the same story as the badges.
 */
const history = {
  digital: [1400, 1600, 1750, 1900, 2100, 2200, 2450, 2600, 2750, 2900, 3050, 3200],
  tiktok: [900, 1100, 1350, 1500, 1700, 1850, 2050, 2200, 2400, 2550, 2700, 2800],
  youtube: [400, 700, 1100, 1500, 1900, 2300, 2700, 3100, 3500, 3900, 4200, 4500],
  agency: [3200, 3600, 3900, 4200, 4400, 4700, 4900, 5100, 5400, 5600, 5800, 6000],
  shopify: [800, 1200, 1600, 1900, 2200, 2500, 2800, 3050, 3300, 3550, 3750, 3900],
  shirts: [0, 0, 200, 450, 700, 950, 1200, 1450, 1650, 1850, 2050, 2200],
  skills: [1500, 1550, 1600, 1620, 1680, 1700, 1720, 1750, 1760, 1780, 1790, 1800],
  affiliate: [200, 320, 450, 560, 680, 790, 900, 1010, 1120, 1230, 1320, 1400],
  saas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  investments: [720, 735, 750, 765, 780, 795, 810, 825, 845, 865, 880, 900],
} satisfies Record<string, number[]>;

export const incomeStreams: IncomeStream[] = [
  {
    id: "digital-products",
    title: "Digital Products",
    icon: "package",
    monthly: 3200,
    status: "Active",
    history: history.digital,
  },
  {
    id: "tiktok-shop",
    title: "TikTok Shop",
    icon: "shopping-bag",
    monthly: 2800,
    status: "Active",
    history: history.tiktok,
  },
  {
    id: "youtube",
    title: "YouTube",
    icon: "square-play",
    monthly: 4500,
    status: "Growing",
    history: history.youtube,
  },
  {
    id: "freelancer-agency",
    title: "Freelancer Agency",
    icon: "briefcase",
    monthly: 6000,
    status: "Active",
    history: history.agency,
  },
  {
    id: "shopify-store",
    title: "Shopify Store",
    icon: "store",
    monthly: 3900,
    status: "Growing",
    history: history.shopify,
  },
  {
    id: "shirt-production",
    title: "Shirt Production",
    icon: "shirt",
    monthly: 2200,
    status: "Building",
    history: history.shirts,
  },
  {
    id: "skills-uber",
    title: "Skills Uber",
    icon: "zap",
    monthly: 1800,
    status: "Active",
    history: history.skills,
  },
  {
    id: "affiliate-marketing",
    title: "Affiliate Marketing",
    icon: "link",
    monthly: 1400,
    status: "Growing",
    history: history.affiliate,
  },
  {
    id: "saas",
    title: "SaaS",
    icon: "cloud",
    monthly: 0,
    status: "Planning",
    history: history.saas,
  },
  {
    id: "investments",
    title: "Investments",
    icon: "chart-line",
    monthly: 900,
    status: "Passive",
    history: history.investments,
  },
];

export const ideas: Idea[] = [
  { id: "idea-1", title: "Launch AI Agency", stage: "Committed", note: "Retainer model, 3 clients to start" },
  { id: "idea-2", title: "TikTok Automation", stage: "Exploring", note: "Faceless channel, batch produced" },
  { id: "idea-3", title: "Print on Demand Brand", stage: "Exploring" },
  { id: "idea-4", title: "Finance Newsletter", stage: "Spark", note: "Weekly, sponsor-funded" },
  { id: "idea-5", title: "Build SaaS MVP", stage: "Committed", note: "Ship something small first" },
  { id: "idea-6", title: "Create Premium Course", stage: "Spark" },
  { id: "idea-7", title: "Micro Consulting", stage: "Spark", note: "Paid strategy calls" },
];

export const agents: Agent[] = [
  {
    id: "market-researcher",
    name: "Market Researcher",
    role: "Finds demand before you build",
    status: "Active",
    load: 72,
    lastAction: "Scanned 41 niches for gaps",
  },
  {
    id: "content-creator",
    name: "Content Creator",
    role: "Turns one idea into ten posts",
    status: "Active",
    load: 88,
    lastAction: "Drafted 12 hooks for YouTube",
  },
  {
    id: "business-strategist",
    name: "Business Strategist",
    role: "Pressure-tests the plan",
    status: "Active",
    load: 45,
    lastAction: "Rebuilt the Q3 offer ladder",
  },
  {
    id: "seo-writer",
    name: "SEO Writer",
    role: "Compounding organic traffic",
    status: "Active",
    load: 63,
    lastAction: "Published 4 cluster articles",
  },
  {
    id: "automation-engineer",
    name: "Automation Engineer",
    role: "Removes you from the loop",
    status: "Active",
    load: 91,
    lastAction: "Wired fulfilment to Shopify",
  },
  {
    id: "financial-analyst",
    name: "Financial Analyst",
    role: "Watches margin, not vanity",
    status: "Active",
    load: 38,
    lastAction: "Flagged ad spend up 14%",
  },
];

export const learningTracks: LearningTrack[] = [
  {
    id: "systems",
    title: "Systems & Automation",
    provider: "Self-directed",
    progress: 68,
    hours: 42,
    icon: "workflow",
  },
  {
    id: "copy",
    title: "Direct Response Copywriting",
    provider: "Breakthrough Advertising",
    progress: 45,
    hours: 26,
    icon: "pen-line",
  },
  {
    id: "finance",
    title: "Capital Allocation",
    provider: "The Outsiders",
    progress: 30,
    hours: 18,
    icon: "landmark",
  },
  {
    id: "ai",
    title: "Applied AI Engineering",
    provider: "Build-along projects",
    progress: 82,
    hours: 57,
    icon: "cpu",
  },
];

export const monthLabels = [
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
];
