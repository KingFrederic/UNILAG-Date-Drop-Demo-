/**
 * Personal objectives — the non-financial half of the plan.
 *
 * Researched August 2026. Where a fact is load-bearing (a licensing rule, an
 * alumni-status quirk, a citizenship gate) it carries a source, because these
 * are the details that decide whether a path is open at all.
 */

export interface Move {
  title: string;
  detail: string;
  /** Conventional = the published route. Unconventional = the faster door. */
  kind: "conventional" | "unconventional";
  horizon: string;
}

export interface Gate {
  label: string;
  detail: string;
  /** Blocking gates stop the path entirely until resolved. */
  blocking: boolean;
}

export interface Source {
  label: string;
  url: string;
}

export interface Objective {
  id: string;
  n: number;
  title: string;
  icon: string;
  /** One line on what winning looks like. */
  outcome: string;
  premise: string;
  gates: Gate[];
  moves: Move[];
  firstAction: string;
  sources?: Source[];
}

export const objectives: Objective[] = [
  /* ----------------------------- 1. diplomacy ----------------------------- */
  {
    id: "diplomatic-ladder",
    n: 1,
    title: "Climb the diplomatic ladder in Canada",
    icon: "landmark",
    outcome:
      "A posting, or a seat close enough to the table that postings come to you.",
    premise:
      "Canada's foreign service has one narrow front door and several unlocked side doors. The front door is a periodic, heavily oversubscribed recruitment campaign. The side doors — missions hiring locally, international organisations headquartered on Canadian soil, and the wider federal public service — hire continuously and are how a large share of people actually end up inside the tent.",
    gates: [
      {
        label: "Canadian citizenship",
        detail:
          "Rotational foreign service officer roles are open to Canadian citizens. Permanent residence is not enough for the FSO stream, though it is often enough for locally engaged and adjacent roles. If citizenship is not yet in hand, its timeline is the real critical path for this objective — everything else can be built in parallel.",
        blocking: true,
      },
      {
        label: "Security clearance",
        detail:
          "Secret or Top Secret depending on the role. Long lead time and it looks at foreign travel, finances and associations. Nothing to fear, but start early and keep your affairs tidy.",
        blocking: false,
      },
      {
        label: "French",
        detail:
          "The single highest-leverage skill on this entire path. Bilingual-imperative postings shrink the applicant pool dramatically, and a CBC-level profile changes which competitions you can even enter. Treat French as infrastructure, not a nice-to-have.",
        blocking: false,
      },
      {
        label: "Rotationality",
        detail:
          "Moving every 2–4 years is a condition of employment, not a perk you opt into. Decide now whether that fits the life you are building, because it shapes everything else on this list.",
        blocking: false,
      },
    ],
    moves: [
      {
        title: "Set the recruitment alert and treat the campaign as an exam",
        detail:
          "Foreign service recruitment runs periodically rather than continuously. Create a GC Jobs account, set alerts, and follow Global Affairs on LinkedIn. When a campaign opens the window is short and the screening is standardised — people who prepared for the assessments beat people who merely applied.",
        kind: "conventional",
        horizon: "This week, then whenever the campaign opens",
      },
      {
        title: "Get into the federal public service anywhere, then deploy across",
        detail:
          "The hardest boundary is outside-to-inside, not department-to-department. Once you hold a substantive federal position, internal deployments, secondments and Interchange Canada assignments open up that are invisible from outside. Policy analyst roles in any department are a legitimate on-ramp.",
        kind: "unconventional",
        horizon: "6–18 months",
      },
      {
        title: "Work a mission as locally engaged staff",
        detail:
          "Missions hire locally engaged staff through their own postings, separately from the national FSO campaign, and the competition is a fraction of the size. It is real diplomatic work, real references, and a real view of how the machine operates.",
        kind: "unconventional",
        horizon: "3–12 months",
      },
      {
        title: "Use the international organisations already on Canadian soil",
        detail:
          "Montreal hosts ICAO. Canada is an active member of the Commonwealth and la Francophonie. You do not have to leave the country to hold a multilateral role, and multilateral experience reads extremely well on a foreign-service file.",
        kind: "unconventional",
        horizon: "6–24 months",
      },
      {
        title: "Become publishable on one region or one file",
        detail:
          "Pick a narrow lane — Nigeria–Canada trade, West African security, diaspora remittance policy — and publish in it consistently. The Canadian International Council, CIGI and the Canadian Global Affairs Institute all take outside contributors. A search for your name returning three serious pieces on one file is worth more than a general-purpose CV.",
        kind: "unconventional",
        horizon: "3–12 months, compounding",
      },
      {
        title: "Get adjacent to political staff",
        detail:
          "Ministerial exempt staff, constituency work and party policy committees sit beside the appointment process and are entered on relationships rather than competitions. This is a genuinely faster ladder, and an openly political one — go in clear-eyed that it ties your trajectory to a party's fortunes.",
        kind: "unconventional",
        horizon: "12–36 months",
      },
      {
        title: "Take an honorary consul appointment for a smaller state",
        detail:
          "Honorary consuls are typically established local figures appointed by a sending state with light representation needs. It confers genuine standing in the diplomatic corps and an invitation list that is otherwise closed. It is a later-stage move that requires you to already be someone worth appointing.",
        kind: "unconventional",
        horizon: "3–7 years",
      },
    ],
    firstAction:
      "Resolve the citizenship timeline in writing this week — it gates the front door and nothing else on this list can substitute for it. Then book a French assessment to find your true baseline rather than your assumed one.",
    sources: [
      {
        label: "A career in the Canadian Foreign Service — Global Affairs Canada",
        url: "https://international.canada.ca/en/global-affairs/corporate/jobs/careers-foreign-service",
      },
      {
        label: "Job opportunities — Global Affairs Canada",
        url: "https://international.canada.ca/en/global-affairs/corporate/jobs/opportunities",
      },
    ],
  },

  /* -------------------------------- 2. law -------------------------------- */
  {
    id: "law-program",
    n: 2,
    title: "Study law — to practise, or to get into the rooms",
    icon: "scale",
    outcome:
      "Either a licence to practise, or a credential that makes legal rooms open to you.",
    premise:
      "These are two different objectives and they take completely different routes. Deciding which one you actually want collapses a confusing landscape into a single obvious path. I could not read your credentials, so this is a fork rather than a recommendation — answer the first question and the rest follows.",
    gates: [
      {
        label: "Do you already hold a law degree from outside Canada?",
        detail:
          "If yes, your route is the NCA. If no, you cannot enter it — the NCA assesses legal education obtained abroad, it is not an entry route for non-lawyers.",
        blocking: true,
      },
      {
        label: "New as of March 2026",
        detail:
          "The NCA added mandatory language screening and a standalone Indigenous Law and Peoples knowledge requirement. Anyone working from pre-2026 guidance is planning against rules that no longer apply.",
        blocking: false,
      },
      {
        label: "An LLM is not a licence",
        detail:
          "Osgoode states plainly that completing its Professional LLM in Canadian Common Law does not by itself entitle you to practise or to be called to the bar. It is a way to satisfy NCA subject requirements with teaching and support attached — valuable, but not the finish line.",
        blocking: false,
      },
    ],
    moves: [
      {
        title: "Route A — foreign law degree, want to practise: the NCA",
        detail:
          "Apply to the National Committee on Accreditation for assessment. You receive a set of subject requirements, satisfy them by challenge exam or coursework, obtain the Certificate of Qualification, then enter a provincial licensing process — articling and bar exams. Realistic end to end: two to four years part-time.",
        kind: "conventional",
        horizon: "2–4 years",
      },
      {
        title: "Route A+ — the same route with scaffolding",
        detail:
          "Osgoode's Professional LLM in Canadian Common Law is built around NCA subject requirements and adds career and cultural support for internationally trained lawyers. It requires at least two years of professional experience. Faster and far less lonely than self-studying for challenge exams, and it puts you in a cohort that becomes a network.",
        kind: "conventional",
        horizon: "1 year full-time",
      },
      {
        title: "Route B — no law degree, want to practise: paralegal licence",
        detail:
          "Ontario is the only province that licenses paralegals as independent practitioners. Complete a Law Society-accredited paralegal programme, pass the licensing exam, meet the good character requirement. This is by a wide margin the fastest legitimate route to actually practising, within a defined scope.",
        kind: "unconventional",
        horizon: "18 months–2 years",
      },
      {
        title: "Route C — you want the rooms, not the licence",
        detail:
          "Queen's Certificate in Law is online, designed explicitly for people with no legal background, and covers constitutional, criminal, tort, contract, property, corporate, workplace, IP and international law across seven courses at your own pace. For credibility in policy and diplomatic rooms this is the highest return per hour on this entire page — and it is the route most people overlook because it does not end in a title.",
        kind: "unconventional",
        horizon: "8 months–2 years, part-time",
      },
      {
        title: "Route D — the full JD",
        detail:
          "Three years, full-time, expensive, and the strongest possible signal. Only rational if practising law is the actual goal rather than the credential. If the objective is access, Route C buys most of the benefit for a fraction of the cost.",
        kind: "conventional",
        horizon: "3 years",
      },
    ],
    firstAction:
      "Answer one question — do you want to practise, or do you want the room? If the room: enrol in Queen's Introduction to Canadian Law; applications for the autumn intake open 1 June with registration in late July. If practise: request an NCA assessment and let its report tell you the actual gap instead of guessing at it.",
    sources: [
      {
        label: "Certifying internationally educated lawyers — Federation of Law Societies of Canada",
        url: "https://flsc.ca/what-we-do/nca/",
      },
      {
        label: "Professional LLM in Canadian Common Law — Osgoode PD",
        url: "https://osgoodepd.ca/academic-programs/professional-llms/canadian-common-law/",
      },
      {
        label: "Queen's Certificate in Law",
        url: "https://certificate.queenslaw.ca/",
      },
      {
        label: "Canada adds knowledge criteria and language testing for foreign-trained lawyers (March 2026)",
        url: "https://www.cicnews.com/2026/03/canada-adds-knowledge-criteria-language-testing-for-foreign-trained-lawyers-0373282.html",
      },
    ],
  },

  /* ------------------------------- 3. clubs ------------------------------- */
  {
    id: "clubs",
    n: 3,
    title: "Join exclusive clubs and memberships",
    icon: "users",
    outcome:
      "Standing membership in rooms where the other members are the reason you are there.",
    premise:
      "Serious clubs are not bought, they are sponsored. Most require a proposer and a seconder who already belong and who are staking their own reputation on you. That makes this a two-year relationship project with a membership form at the end, not a decision you make on a Tuesday. Work the tiers in order — each one produces the sponsors for the next.",
    gates: [
      {
        label: "You need proposers before you need money",
        detail:
          "Turning up with the fee and no relationships is the one approach that reliably fails. Enter at the open tier, become known, and let the invitation come to you.",
        blocking: false,
      },
    ],
    moves: [
      {
        title: "Tier 1 — open to anyone, join this month",
        detail:
          "Toastmasters for the speaking reps. Rotary for the civic network and the service record that reads well later. The Empire Club of Canada and the Canadian Club run ticketed speaker luncheons that anyone can attend — the Empire Club has been a national speakers' forum since 1903. The Economic Club of Canada is the same model. Attend, sit at a different table each time, and follow up.",
        kind: "conventional",
        horizon: "Immediately",
      },
      {
        title: "Tier 2 — professional bodies where you can hold office",
        detail:
          "The Canadian International Council has chapters and is the natural home for the foreign policy objective. Sector associations, diaspora chambers of commerce and bilateral business councils all matter more than their websites suggest. The move is not to join — it is to take a committee seat nobody wants. Committee work is where sponsors are made.",
        kind: "unconventional",
        horizon: "3–12 months",
      },
      {
        title: "Tier 3 — athletic and social clubs with a real bar",
        detail:
          "City athletic clubs sit at a lower barrier than the historic social clubs while drawing a similar membership, and a standing squash or gym slot manufactures the repeated informal contact that formal networking cannot. Cheaper, faster, and it solves the fitness objective at the same time.",
        kind: "unconventional",
        horizon: "6–18 months",
      },
      {
        title: "Tier 4 — the historic private clubs",
        detail:
          "The Rideau Club in Ottawa was founded in 1865 by Macdonald and Cartier and has been populated largely by parliamentarians ever since — for a diplomatic objective it is arguably the single most relevant room in the country. Membership also carries reciprocal privileges at more than 200 clubs worldwide, which quietly solves travel access. Toronto's equivalents sit alongside it. All are sponsored entry.",
        kind: "conventional",
        horizon: "2–4 years",
      },
      {
        title: "The alumni shortcut",
        detail:
          "Harvard Clubs admit on alumni status rather than sponsorship. This is why objective 5 and objective 3 are the same objective wearing different clothes — a Harvard degree converts directly into club access that would otherwise take years of sponsorship to earn.",
        kind: "unconventional",
        horizon: "Follows objective 5",
      },
    ],
    firstAction:
      "Book one Empire Club or Economic Club luncheon in the next thirty days and go alone. Going alone is the point — with a companion you will talk to them.",
    sources: [
      { label: "Rideau Club — reciprocal clubs", url: "https://rideauclub.ca/membership/reciprocal-clubs/" },
      { label: "Empire Club of Canada", url: "https://en.wikipedia.org/wiki/Empire_Club_of_Canada" },
    ],
  },

  /* ------------------------------- 4. hosting ------------------------------- */
  {
    id: "hosting",
    n: 4,
    title: "Host dinners, studies and salons",
    icon: "utensils",
    outcome:
      "A standing invitation list where being included is worth something.",
    premise:
      "Attending events makes you a guest. Hosting them makes you the reason the room exists — and the host is the only person in the room who is automatically connected to everyone else in it. This is the highest-leverage item on this entire page, it costs the least, and you can start in three weeks.",
    gates: [
      {
        label: "Consistency beats production value",
        detail:
          "A modest dinner on the first Thursday of every month beats a spectacular one-off every time. The value is in the recurrence, because that is what makes it a thing people plan around.",
        blocking: false,
      },
    ],
    moves: [
      {
        title: "The Jeffersonian dinner — one table, one conversation",
        detail:
          "Eight to twelve people, phones away, one conversation at a time with no side chatter, and one question you pose at the start that everyone answers in turn. It manufactures the depth that a standing reception structurally cannot, and guests remember it for years. This is the format to build everything else around.",
        kind: "unconventional",
        horizon: "Start within 3 weeks",
      },
      {
        title: "Get the guest ratio right",
        detail:
          "Roughly a third people you know well, a third acquaintances you want to deepen, a third strangers introduced by the first third. All friends and it is a dinner party. All strangers and it is work. The mix is what produces the introductions.",
        kind: "unconventional",
        horizon: "Every time",
      },
      {
        title: "Host the bible study rather than only attending",
        detail:
          "Offer your home, keep it to one book studied slowly, and be ruthlessly on time about finishing. Hosting a study creates a depth of relationship that no professional format reaches — these become the people who show up when something goes wrong. Do not run it as a networking function; the moment it is instrumental it stops working and people can tell.",
        kind: "conventional",
        horizon: "Start within 6 weeks",
      },
      {
        title: "Run a breakfast series instead of another evening drinks",
        detail:
          "07:30, ninety minutes, one guest speaking for fifteen minutes then questions. Breakfast is cheaper, senior people are more likely to be free, nobody is drinking, and it ends with everyone going to work energised rather than home tired. Chronically underused.",
        kind: "unconventional",
        horizon: "Quarterly",
      },
      {
        title: "Use the Chatham House rule for the serious ones",
        detail:
          "Participants may use what was said but not attribute it. Stating it explicitly at the start changes the candour of the room immediately, and it is the convention that policy and diplomatic people already expect. It signals you know how these rooms work.",
        kind: "unconventional",
        horizon: "When the guest list warrants it",
      },
      {
        title: "Write the invitation like it matters",
        detail:
          "Personal, addressed to one person, saying why them specifically and who else is coming. Never a group email with everyone visible. The invitation is the first impression of the evening and most people waste it.",
        kind: "conventional",
        horizon: "Every time",
      },
    ],
    firstAction:
      "Pick a date six weeks out, book nothing, and invite eight people by personal message today. The venue can be your kitchen table. The date existing is what makes it real.",
  },

  /* ------------------------------- 5. harvard ------------------------------- */
  {
    id: "harvard",
    n: 5,
    title: "Take a high-value Harvard programme",
    icon: "graduation-cap",
    outcome:
      "A Harvard credential that carries lifetime alumni standing — not a certificate that does not.",
    premise:
      "You asked specifically about the alumni body, and that is the right question, because it is where most of the money in this category is wasted. Harvard's short executive courses give you a certificate and no alumni status. A degree gives you the Harvard Alumni Association for life. The price difference is far smaller than the difference in what you receive.",
    gates: [
      {
        label: "Short executive education does not make you an alumnus",
        detail:
          "This is the trap. Short courses grant a certificate and no alumni status. Some longer flagship programmes such as HBS's Advanced Management Program do confer full alumni status — but you have to check programme by programme, and the marketing will not make the distinction for you.",
        blocking: true,
      },
      {
        label: "A PhD is probably the wrong instrument",
        detail:
          "Four to six years, research-based, and it trains you to produce original scholarship. If the objective is standing, access and an alumni body, a PhD is an extraordinarily expensive way to buy them and it delays every other objective on this page.",
        blocking: false,
      },
    ],
    moves: [
      {
        title: "Harvard Extension School ALM — the access route nobody talks about",
        detail:
          "A genuine Harvard master's degree. Graduates automatically become members of the Harvard Extension Alumni Association and, through it, of the Harvard Alumni Association — free for life, no dues. That carries Harvard Club access, career services and the alumni directory. Admission is earn-your-way rather than apply-and-pray, and it can be done part-time from Canada. On alumni standing per dollar and per unit of risk, nothing else here is close.",
        kind: "unconventional",
        horizon: "2–4 years part-time",
      },
      {
        title: "Harvard Kennedy School Mid-Career MPA — the one aimed at your objective",
        detail:
          "Built for people with substantial professional experience, typically seven years or more, and it is the standard credential in senior public service and diplomatic circles worldwide. If the diplomatic ladder is the real goal, this is the programme that most directly serves it. One year, full-time, in residence.",
        kind: "conventional",
        horizon: "1 year, apply 12–18 months ahead",
      },
      {
        title: "HBS Advanced Management Program — if the money is already there",
        detail:
          "One of the flagship executive programmes that does confer full alumni status. Weeks rather than years, and priced accordingly. Sensible once the income streams are producing; premature before then.",
        kind: "conventional",
        horizon: "7 weeks",
      },
      {
        title: "Whatever you choose, join the club and work it",
        detail:
          "The degree is the entry ticket, not the benefit. The benefit is the Harvard Club in your city, the regional alumni chapter, and showing up often enough that people know your name. Alumni who never attend anything get precisely nothing for their fees.",
        kind: "unconventional",
        horizon: "From graduation, forever",
      },
    ],
    firstAction:
      "Decide which you are buying — the education or the alumni body. If it is the alumni body, start an Extension School course this term; admission is earned through performance in the courses themselves, so beginning is the application. If it is the diplomatic credential, put the Kennedy School Mid-Career MPA on an 18-month application clock.",
    sources: [
      {
        label: "Harvard Extension Alumni Association — membership",
        url: "https://alumni.extension.harvard.edu/about-us",
      },
      {
        label: "Executive education alumni status — what confers it",
        url: "https://www.gogradia.com/guides/executive-education-alumni-status",
      },
    ],
  },

  /* ------------------------------- 6. church ------------------------------- */
  {
    id: "church",
    n: 6,
    title: "Join a church and serve elegantly and diligently",
    icon: "church",
    outcome:
      "A community you belong to, and a record of service that was never about being seen.",
    premise:
      "You marked this important twice, so it goes on the page as its own objective rather than as a line under something else. It is also the one item here that is undermined by treating it strategically. Everything else on this page is a ladder; this one is not, and the moment it becomes one it stops delivering even the incidental benefits.",
    gates: [
      {
        label: "Do not farm the congregation",
        detail:
          "People can tell, quickly, and the reputational damage is permanent in exactly the community where reputation travels fastest. Serve because you mean it. The relationships that follow are real precisely because they were not the objective.",
        blocking: true,
      },
    ],
    moves: [
      {
        title: "Visit three, then commit to one for a year",
        detail:
          "Church-shopping indefinitely is its own avoidance. Visit three, pick one, and commit for twelve months before re-evaluating. Depth in one congregation beats breadth across four.",
        kind: "conventional",
        horizon: "6 weeks to decide",
      },
      {
        title: "Start with the unglamorous service",
        detail:
          "Set-up, parking, chairs, children's ministry, the sound desk. Not the platform. Everyone can see who volunteers for the visible roles first, and everyone notices who took the early shift for a year without being asked. That is what elegantly and diligently actually looks like.",
        kind: "conventional",
        horizon: "Month one",
      },
      {
        title: "Be reliable before you are impressive",
        detail:
          "Turn up every week for a year. Reliability over eighteen months earns more standing in a congregation than any talent does — and it is the one qualification you can simply decide to have.",
        kind: "conventional",
        horizon: "Ongoing",
      },
      {
        title: "Offer the skill you actually have",
        detail:
          "Once you are known and trusted, the skills from everything else on this page — systems, communications, finance, technology — are genuinely useful to a church and usually in short supply. Offer them after you have served without them, never as your entry.",
        kind: "unconventional",
        horizon: "After 12 months",
      },
      {
        title: "Let the hosting and the church meet naturally",
        detail:
          "The bible study in objective 4 belongs here. Same people, same table, no agenda. This is where the two objectives genuinely reinforce each other without either being used.",
        kind: "conventional",
        horizon: "Month 3 onward",
      },
    ],
    firstAction:
      "Choose the three churches you will visit and put the first Sunday in the calendar now. Then sign up for one serving rota within your first month — before you feel settled, not after.",
  },
];

export const objectiveTotals = {
  count: objectives.length,
  moves: objectives.reduce((sum, o) => sum + o.moves.length, 0),
};
