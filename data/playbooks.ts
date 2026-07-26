/**
 * Launch playbooks — one per income stream.
 *
 * Each answers the same question: what is the unit, how many of them reach
 * the target, and what do you actually do on Monday morning.
 */

export interface UnitMaths {
  unitPrice: number;
  unitNoun: string;
  unitsToTarget: number;
  target: number;
  /**
   * Display override for unit price. Needed where the real figure rounds to
   * nothing as currency — YouTube earns $0.005 a view, which formats as "$0".
   */
  unitPriceLabel?: string;
  /** Net margin as a fraction, where gross and net differ materially. */
  margin?: number;
  note?: string;
}

export interface PhasePlan {
  year: string;
  focus: string;
  revenue: number;
}

export interface Suggestion {
  title: string;
  detail: string;
}

export interface Playbook {
  streamId: string;
  /** One line on what this stream actually is. */
  premise: string;
  /** Why it is worth doing, stated without salesmanship. */
  thesis: string;
  maths: UnitMaths;
  phases: PhasePlan[];
  launchSteps: string[];
  platforms: string[];
  /** Concrete product / creative suggestions where the user asked for them. */
  suggestions?: { heading: string; items: Suggestion[] };
  audiences?: string[];
  risk: string;
}

export const playbooks: Playbook[] = [
  /* ------------------------------ digital ------------------------------ */
  {
    streamId: "digital-products",
    premise:
      "Write or build something once, sell it repeatedly at a price low enough to be an impulse purchase.",
    thesis:
      "The only stream where the marginal cost of the next sale is zero. That makes it the cleanest path to the target, and the slowest to start.",
    maths: {
      unitPrice: 20,
      unitNoun: "copies",
      unitsToTarget: 250_000,
      target: 5_000_000,
      margin: 0.92,
      note: "228 sales a day for three years. Reachable with a catalogue of 6–10 titles, not one hero product.",
    },
    phases: [
      { year: "Year 1", focus: "Two titles shipped, audience built to 10,000", revenue: 200_000 },
      { year: "Year 2", focus: "Catalogue to six titles, bundles and upsells", revenue: 1_300_000 },
      { year: "Year 3", focus: "Affiliates and licensing carry distribution", revenue: 3_500_000 },
    ],
    launchSteps: [
      "Pick the one problem you have already solved for someone else",
      "Pre-sell it before building — 50 buyers validates it, silence saves you months",
      "Ship a rough version to those 50 and rewrite it from their questions",
      "Set the price at $20 and never discount; run bundles instead",
      "Add one title a quarter; the catalogue is the asset, not any single item",
      "Recruit affiliates at 40% once conversion is proven",
    ],
    platforms: ["Gumroad", "Lemon Squeezy", "Stan Store", "Payhip", "Own site via Stripe"],
    suggestions: {
      heading: "Titles worth building",
      items: [
        {
          title: "The One-Person Agency",
          detail: "How to bill $10k/month without hiring. Sells to freelancers already earning.",
        },
        {
          title: "Faceless Content Engine",
          detail: "A system for publishing daily without appearing on camera. Broadest audience.",
        },
        {
          title: "The Offer Ladder",
          detail: "Pricing and packaging services so clients upgrade themselves.",
        },
        {
          title: "From Skill to Product",
          detail: "Turning what you already do into something that sells while you sleep.",
        },
        {
          title: "Cold Outreach That Doesn't Feel Cold",
          detail: "Scripts and sequences. Highest-converting topic in the B2B space.",
        },
        {
          title: "Automate Your Back Office",
          detail: "Removing yourself from invoicing, onboarding and fulfilment.",
        },
      ],
    },
    risk: "Distribution, not creation. A good product with no audience sells nothing — build the list before the second title.",
  },

  /* ---------------------------- print on demand ---------------------------- */
  {
    streamId: "shirt-production",
    premise:
      "Sell apparel carrying a message people want to be seen wearing. Print only after the sale.",
    thesis:
      "Identity sells faster than design. The winning items are statements someone already makes about themselves — you are supplying the garment, not the belief.",
    maths: {
      unitPrice: 50,
      unitNoun: "hoodies",
      unitsToTarget: 100_000,
      target: 5_000_000,
      margin: 0.32,
      note: "$50 gross per unit, roughly $16 net after print and shipping. Reaching $5M net needs closer to 310,000 units, or a higher price point — plan for both.",
    },
    phases: [
      { year: "Year 1", focus: "Three designs validated by pre-order, no inventory", revenue: 250_000 },
      { year: "Year 2", focus: "Paid acquisition on the two winners only", revenue: 1_400_000 },
      { year: "Year 3", focus: "Wholesale, church and campus bulk orders", revenue: 3_350_000 },
    ],
    launchSteps: [
      "Pick three statements, not three designs — the words do the selling",
      "Run each as a 7-day pre-order at $50; ship only what sells",
      "Kill anything under 50 pre-orders without sentiment",
      "Put the survivor on paid ads with a lookalike from your buyer list",
      "Add colourways before adding new slogans — winners have depth",
      "Approach bulk buyers: churches, campus groups, diaspora associations",
    ],
    platforms: ["Printful + Shopify", "Printify", "TikTok Shop", "Etsy", "Instagram Shopping"],
    suggestions: {
      heading: "Statements that pre-sell",
      items: [
        {
          title: "Jesus Must Be Heard Across The World",
          detail: "Faith apparel is the most reliable repeat category. Church bulk orders convert without ads.",
        },
        {
          title: "African And Proud",
          detail: "Diaspora identity travels globally. Strongest in the US, UK and Canada.",
        },
        {
          title: "Women Are Queens",
          detail: "Gift-driven — peaks at Mother's Day, birthdays and December.",
        },
        {
          title: "Built, Not Born",
          detail: "Self-made framing. Sells to the same audience buying your digital products.",
        },
        {
          title: "First Generation Everything",
          detail: "For first-in-family graduates and founders. Very high emotional pull.",
        },
        {
          title: "Faith Over Fear",
          detail: "Short, legible across a room, works on hoodie and cap alike.",
        },
      ],
    },
    audiences: [
      "Church congregations and youth groups — bulk pre-orders, minimal ad spend",
      "African diaspora in the US, UK and Canada — highest willingness to pay",
      "University associations and alumni bodies — predictable seasonal volume",
      "Gift buyers, mid-November to late December — half the year's revenue",
    ],
    risk: "Margin, not demand. At 32% net, revenue targets flatter the reality — track net per unit, never gross.",
  },

  /* -------------------------------- youtube -------------------------------- */
  {
    streamId: "youtube",
    premise:
      "Publish video that earns from advertising, and use the audience to sell everything else.",
    thesis:
      "The worst stream for direct revenue per hour and the best for making every other stream cheaper. Views are distribution you stop renting.",
    maths: {
      unitPrice: 0.005,
      unitPriceLabel: "$5 RPM",
      unitNoun: "views",
      unitsToTarget: 1_000_000_000,
      target: 5_000_000,
      note: "$5 RPM against a billion views — roughly 913,000 views a day for three years. Treat this as a network of channels, not one.",
    },
    phases: [
      { year: "Year 1", focus: "One channel, 3 uploads a week, format found", revenue: 150_000 },
      { year: "Year 2", focus: "Three channels, editors hired, 100M cumulative", revenue: 1_200_000 },
      { year: "Year 3", focus: "Network of 5, sponsorships priced separately", revenue: 3_650_000 },
    ],
    launchSteps: [
      "Choose a niche by RPM, not by interest — finance and software pay 5–10× lifestyle",
      "Commit to one format for 30 videos before judging it",
      "Hire an editor at video 20; you should be scripting, not cutting",
      "Study retention graphs weekly and cut whatever loses viewers at 30 seconds",
      "Clone the format into a second channel once one works",
      "Sell sponsorships directly at a CPM you set, not through a network",
    ],
    platforms: ["YouTube", "YouTube Shorts", "TikTok", "Instagram Reels", "X"],
    risk: "Time to first dollar. Expect twelve months of unpaid publishing — fund it from the agency, never from savings.",
  },

  /* ----------------------------- freelance agency ----------------------------- */
  {
    streamId: "freelancer-agency",
    premise:
      "Sell outcomes to businesses, delivered by a bench of freelancers rather than by you.",
    thesis:
      "Fastest route from skill to cash, and the stream that funds every other one. Its ceiling is lower, which is exactly why it goes first.",
    maths: {
      unitPrice: 1_000,
      unitNoun: "engagements",
      unitsToTarget: 5_000,
      target: 5_000_000,
      margin: 0.4,
      note: "Five engagements a day at $1,000, or far fewer at retainer pricing — 40 retained clients at $4,000/mo reaches the same place with less churn.",
    },
    phases: [
      { year: "Year 1", focus: "Ten retained clients, delivery documented", revenue: 600_000 },
      { year: "Year 2", focus: "Thirty clients, account manager hired", revenue: 1_700_000 },
      { year: "Year 3", focus: "Productised tiers, founder out of delivery", revenue: 2_700_000 },
    ],
    launchSteps: [
      "Sell one service to one industry — specificity is what lets you charge",
      "Price monthly retainers, never hourly; hourly caps you at your own time",
      "Deliver the first five yourself and write down every step as you go",
      "Hire freelancers against that written process, not against a job title",
      "Move yourself to sales only once delivery survives a week without you",
      "Raise prices 20% every ten clients until conversion visibly drops",
    ],
    platforms: ["Upwork", "Contra", "LinkedIn outbound", "Cold email", "Referral partners"],
    risk: "Becoming the bottleneck. If you are still delivering in year two, this stops being a business and becomes a job.",
  },

  /* --------------------------------- saas --------------------------------- */
  {
    streamId: "saas",
    premise: "Charge monthly for software that removes a recurring, expensive chore.",
    thesis:
      "The only stream where last year's work still pays this year. Slowest to start, and the one that makes the $50k/mo target durable rather than fragile.",
    maths: {
      unitPrice: 50,
      unitNoun: "subscriber-months",
      unitsToTarget: 100_000,
      target: 5_000_000,
      note: "About 2,800 subscribers held across three years. Retention does the work — a 5% monthly churn halves the outcome.",
    },
    phases: [
      { year: "Year 1", focus: "MVP to 100 paying users, churn understood", revenue: 60_000 },
      { year: "Year 2", focus: "1,000 users, onboarding self-serve", revenue: 700_000 },
      { year: "Year 3", focus: "2,800 users, annual plans, expansion revenue", revenue: 4_240_000 },
    ],
    launchSteps: [
      "Build for the agency's own bottleneck first — you are user zero",
      "Charge from the first user; free tiers teach you nothing about willingness to pay",
      "Watch cancellations more closely than signups",
      "Sell annual plans at ten months' price to fix cash flow",
      "Only add features that reduce churn or raise price",
    ],
    platforms: ["Own app", "Vercel", "Stripe Billing", "AppSumo for the first 500", "Product Hunt"],
    risk: "Building before selling. Ship the smallest version that someone pays for, or this becomes an expensive hobby.",
  },

  /* ------------------------------ tiktok shop ------------------------------ */
  {
    streamId: "tiktok-shop",
    premise: "Sell physical product natively inside short-form video, where the buying happens.",
    thesis:
      "Distribution is granted rather than earned — the algorithm hands reach to good creative regardless of follower count.",
    maths: {
      unitPrice: 35,
      unitNoun: "orders",
      unitsToTarget: 143_000,
      target: 5_000_000,
      margin: 0.3,
      note: "Volume game. Creative output matters more than ad spend — plan for 3–5 new videos a day.",
    },
    phases: [
      { year: "Year 1", focus: "Find one product that converts on organic video", revenue: 300_000 },
      { year: "Year 2", focus: "Affiliate creators paid on performance", revenue: 1_500_000 },
      { year: "Year 3", focus: "Catalogue of 10 SKUs, live selling", revenue: 3_200_000 },
    ],
    launchSteps: [
      "Pick a product that demonstrates visibly in under 5 seconds",
      "Post 3–5 videos a day; treat each as a test, not a publication",
      "Recruit affiliate creators once one video converts",
      "Run live sessions during your audience's evening",
      "Keep 20+ SKU variants ready so winners can be scaled instantly",
    ],
    platforms: ["TikTok Shop", "Instagram Reels", "YouTube Shorts", "Shopify backend"],
    risk: "Platform dependence. One policy change removes the whole stream — mirror the audience to email from day one.",
  },

  /* ------------------------------ shopify store ------------------------------ */
  {
    streamId: "shopify-store",
    premise: "A branded storefront you own, where repeat buyers cost nothing to reach again.",
    thesis:
      "The place every other stream should eventually send traffic. Owned audience, owned margin, no algorithm in between.",
    maths: {
      unitPrice: 60,
      unitNoun: "orders",
      unitsToTarget: 83_000,
      target: 5_000_000,
      margin: 0.45,
      note: "Repeat purchase rate is the whole model — a second order from an existing buyer costs nothing to acquire.",
    },
    phases: [
      { year: "Year 1", focus: "Brand, 5 SKUs, email list to 10,000", revenue: 400_000 },
      { year: "Year 2", focus: "Paid acquisition with positive first-order margin", revenue: 1_600_000 },
      { year: "Year 3", focus: "Subscriptions and wholesale", revenue: 3_000_000 },
    ],
    launchSteps: [
      "Build the email list before the catalogue",
      "Launch with five products, not fifty",
      "Get first-order margin positive before spending on ads",
      "Add a subscription option to whatever gets reordered",
      "Introduce wholesale once you have a proven seller",
    ],
    platforms: ["Shopify", "Klaviyo", "Meta Ads", "Google Shopping"],
    risk: "Paid acquisition costs rising faster than margin. Watch contribution margin per order, not revenue.",
  },

  /* ------------------------------- skills uber ------------------------------- */
  {
    streamId: "skills-uber",
    premise: "On-demand access to your time at a premium hourly rate.",
    thesis:
      "Caps out by definition — you only have so many hours. Its job is cash flow and lead generation, not the target.",
    maths: {
      unitPrice: 250,
      unitNoun: "sessions",
      unitsToTarget: 20_000,
      target: 5_000_000,
      note: "20,000 sessions is 18 a day for three years — not achievable solo. This stream funds the others and feeds the agency; it is not a route to $5M on its own.",
    },
    phases: [
      { year: "Year 1", focus: "$250/hr, calendar full two weeks out", revenue: 120_000 },
      { year: "Year 2", focus: "Raise to $500/hr, halve the volume", revenue: 180_000 },
      { year: "Year 3", focus: "Convert callers into agency retainers", revenue: 200_000 },
    ],
    launchSteps: [
      "Publish a booking link with a fixed price and no negotiation",
      "Record every call; the repeated questions become your next product",
      "Raise the price whenever you are booked more than two weeks out",
      "Route anyone who needs ongoing help into an agency retainer",
    ],
    platforms: ["Intro", "Calendly + Stripe", "Clarity.fm", "LinkedIn"],
    risk: "It is a job with better margins. Keep it capped and use it as a funnel, not a business.",
  },

  /* ---------------------------- affiliate marketing ---------------------------- */
  {
    streamId: "affiliate-marketing",
    premise: "Earn commission recommending products you would recommend anyway.",
    thesis:
      "Zero fulfilment and zero support. Pairs with content — the same view that earns $0.005 in ad revenue can earn far more as a referral.",
    maths: {
      unitPrice: 80,
      unitNoun: "conversions",
      unitsToTarget: 62_500,
      target: 5_000_000,
      note: "Recurring-commission software beats one-off physical goods by an order of magnitude on lifetime value.",
    },
    phases: [
      { year: "Year 1", focus: "Reviews and comparisons ranking organically", revenue: 150_000 },
      { year: "Year 2", focus: "Recurring-commission software partnerships", revenue: 900_000 },
      { year: "Year 3", focus: "Negotiated private rates on top performers", revenue: 2_100_000 },
    ],
    launchSteps: [
      "Only promote what you actually use — one bad recommendation costs the audience",
      "Prioritise recurring commissions over one-off payouts",
      "Write comparison content; it catches buyers at the decision point",
      "Negotiate private rates once you are a top-ten affiliate",
    ],
    platforms: ["Impact", "PartnerStack", "Amazon Associates", "Direct partnerships"],
    risk: "Trust is the inventory. Promote badly once and the audience stops converting permanently.",
  },

  /* ------------------------------- investments ------------------------------- */
  {
    streamId: "investments",
    premise:
      "Where the $3M eventually goes. Until then, the discipline of moving profit out of the business every month.",
    thesis:
      "This is the destination, not a stream. Every other stream exists to fund this one.",
    maths: {
      unitPrice: 1,
      unitPriceLabel: "$1",
      unitNoun: "dollars deployed",
      unitsToTarget: 3_000_000,
      target: 3_000_000,
      note: "At a 20% annual return, $3M pays $600,000 a year — $50,000 a month, indefinitely, without your involvement.",
    },
    phases: [
      { year: "Year 1", focus: "Move 20% of profit out monthly, no exceptions", revenue: 100_000 },
      { year: "Year 2", focus: "First $500k deployed", revenue: 600_000 },
      { year: "Year 3", focus: "$3M deployed, income crosses $50k/mo", revenue: 3_000_000 },
    ],
    launchSteps: [
      "Automate the transfer the day revenue lands, before it can be spent",
      "Deploy as capital accumulates rather than waiting for the full $3M",
      "Write down the target return and the risk it implies, honestly",
      "Keep 12 months of living costs entirely outside the strategy",
    ],
    platforms: ["Index funds", "Private credit", "Real estate", "Own business equity"],
    risk: "A sustained 20% annual return is well above the long-run market average of roughly 7–10%. At 10% the same $3M pays $25,000 a month, not $50,000. Either the capital target rises to $6M or the income target comes down — decide which before relying on it.",
  },
];

export function playbookFor(streamId: string) {
  return playbooks.find((playbook) => playbook.streamId === streamId);
}
