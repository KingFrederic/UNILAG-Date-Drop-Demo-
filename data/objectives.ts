/**
 * Personal objectives — the non-financial half of the plan.
 *
 * Researched August 2026 and written against the actual credentials on
 * fredericidowu.com rather than a generic profile. Where a fact is
 * load-bearing (a licensing rule, an immigration cutoff, an alumni-status
 * quirk) it carries a source, because these are the details that decide
 * whether a path is open at all.
 */

/** Pulled from fredericidowu.com — the objectives below are keyed to these. */
export const profile = {
  name: "Frédéric Idowu Oluwasola",
  title: "Diplomatic Bilingual Communication Specialist",
  based: "Lagos · California",
  degree: "B.A. French Studies, University of Lagos",
  languages: [
    { name: "English", level: "Native" },
    { name: "French", level: "Fluent · B.A." },
    { name: "Yoruba", level: "Native" },
    { name: "Dioula", level: "Conversational" },
    { name: "Pidgin", level: "Native" },
  ],
  experience: "7+ years · 12+ nations",
  institutions: [
    "African Union",
    "GIZ",
    "Federal Ministry of Art, Culture & Creative Economy",
    "AfroAngle (California)",
  ],
  /** The assets that actually move these objectives, named plainly. */
  leverage: [
    "Fluent French with a degree in it — the single highest-value asset on this page",
    "Multilateral track record: AU and GIZ programme work across 12+ countries",
    "Professional bilingual MC, conference and ministerial interpreter",
    "Federal government flagship delivered (Reimagining Hope Residency)",
  ],
};

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
      "You are in Lagos and California, so the ladder is not the first problem — getting to Canada is. The good news is that your profile is close to the ideal case for the cheapest door into the country. Canada is short of French speakers outside Quebec and has built three separate programmes to fix that, all of which you qualify for and most applicants do not. Your B.A. in French Studies, your AU and GIZ programme record, and your interpreting work are not background colour here; they are the qualification.",
    gates: [
      {
        label: "Residency before the ladder — this is objective zero",
        detail:
          "Everything below assumes you are physically in Canada with status. You are not yet, so the immigration route is the critical path and nothing on this page moves until it does. Treat the next twelve months as an immigration project with a diplomacy objective attached, not the reverse.",
        blocking: true,
      },
      {
        label: "Citizenship gates the front door, not the country",
        detail:
          "Rotational foreign service officer roles at Global Affairs are open to Canadian citizens, which is roughly PR plus three years of physical presence. So the FSO competition is a five-to-six-year horizon from today. Everything else — locally engaged roles, the wider public service, multilateral bodies — opens far earlier, most of it at PR.",
        blocking: true,
      },
      {
        label: "Your French is the asset, not the gap",
        detail:
          "This is the correction that matters. Most people chasing this path spend years getting to a usable French level. You teach TEF, TCF and DELF preparation for a living. Sit a certified TEF Canada or TCF Canada test in the next ninety days and convert the fluency you already have into points on a file — untested, it is worth nothing to IRCC.",
        blocking: false,
      },
      {
        label: "Security clearance",
        detail:
          "Secret or Top Secret depending on the role, with a long lead time and scrutiny of foreign travel, finances and associations. Twelve nations of work history is not a problem, but it is a longer file to process. Keep records tidy from now.",
        blocking: false,
      },
      {
        label: "Rotationality",
        detail:
          "Moving every 2–4 years is a condition of employment, not a perk. Worth deciding against the church, clubs and hosting objectives, all of which reward staying put.",
        blocking: false,
      },
    ],
    moves: [
      {
        title: "Sit TEF Canada or TCF Canada — the highest-value 90 days available to you",
        detail:
          "In 2026 the French-language Express Entry category draws have been cutting off around CRS 391–399, against 514–525 for general draws. That is roughly a 120-point advantage, and it exists specifically for people like you. Untested French is worth zero on a file; a certified result converts a degree you already hold into the cheapest permanent residence route Canada offers. Nothing else on this page has this return per unit of effort.",
        kind: "conventional",
        horizon: "Book this month, sit within 90 days",
      },
      {
        title: "Francophone Community Immigration Pilot — direct PR, no CRS at all",
        detail:
          "Launched January 2026 as successor to the Rural and Northern pilot. Six designated francophone communities outside Quebec, direct permanent residence, no Express Entry pool and no CRS score involved. It is heavily under-used because few applicants have real French. You do. If a job offer in one of the six communities is obtainable, this is faster and more certain than the points system.",
        kind: "unconventional",
        horizon: "6–18 months",
      },
      {
        title: "Mobilité Francophone — an LMIA-exempt work permit",
        detail:
          "Exemption code C16 under the International Mobility Program. A French-speaking foreign national can be hired by an employer anywhere outside Quebec without that employer needing a Labour Market Impact Assessment — which removes the single biggest reason Canadian employers decline foreign candidates. It gets you into the country on a work permit while a PR application runs in parallel.",
        kind: "unconventional",
        horizon: "3–12 months",
      },
      {
        title: "Target la Francophonie and the bodies already on Canadian soil",
        detail:
          "Canada is an active member of the Organisation internationale de la Francophonie, and Montreal hosts ICAO. Your AU and GIZ programme experience plus working French is an unusually good fit for francophone multilateral work — and it is the same institutional world you already operate in, simply relocated. This is continuity, not a career change.",
        kind: "unconventional",
        horizon: "6–24 months",
      },
      {
        title: "Get into the federal public service anywhere, then deploy across",
        detail:
          "The hard boundary is outside-to-inside, not department-to-department. Once you hold a substantive federal position, internal deployments and secondments open up that are invisible from outside. Bilingual-imperative positions have a far smaller applicant pool, and you can enter those competitions on day one where most candidates cannot.",
        kind: "unconventional",
        horizon: "After landing, 6–18 months",
      },
      {
        title: "Publish on the file only you can write",
        detail:
          "Not general foreign policy — the intersection nobody else occupies: anglophone-francophone Africa, Canada–West Africa relations, the Ejigbo diaspora work you have already done. The Canadian International Council, CIGI and the Canadian Global Affairs Institute take outside contributors. You have primary field material from five nations; almost no one competing for these roles does.",
        kind: "unconventional",
        horizon: "Start now, compounding",
      },
      {
        title: "Keep MC-ing — it is diplomatic networking that pays you",
        detail:
          "You already host diplomatic galas, moderate ministerial roundtables and interpret at conferences. That is not adjacent to the objective, it is the objective performed at a lower altitude. Move that work toward Canada–Africa events, francophone business councils and diaspora forums, and you will be visible to exactly the right people while being paid to be in the room.",
        kind: "unconventional",
        horizon: "Immediately, ongoing",
      },
      {
        title: "Honorary consul, later",
        detail:
          "Sending states appoint established local figures with light representation needs — and a francophone West African state appointing a fluent Yoruba, French and Dioula speaker with AU credentials is a natural fit. It confers real standing in the diplomatic corps. A five-to-seven-year move that requires you to already be someone worth appointing.",
        kind: "unconventional",
        horizon: "5–7 years",
      },
    ],
    firstAction:
      "Book TEF Canada or TCF Canada this month. It is the one action that converts what you already are into what the system can score, and it unlocks a PR route running roughly 120 CRS points cheaper than the one most applicants are fighting over. Everything else on this objective waits behind it.",
    sources: [
      {
        label: "French-language Express Entry draw, CRS cutoff 391 (August 2026)",
        url: "https://immigration.ca/canada-invites-5000-french-speaking-candidates-express-entry-crs-391-august-6-2026/",
      },
      {
        label: "French-language draw cutoff dips below 400 — CIC News",
        url: "https://www.cicnews.com/2026/07/french-language-express-entry-draw-sees-crs-cutoff-dip-below-400-0778376.html",
      },
      {
        label: "Francophone Community Immigration Pilot 2026",
        url: "https://www.ansariimmigration.com/post/francophone-community-immigration-pilot-fcip-who-qualifies-and-how-to-apply-in-2026",
      },
      {
        label: "Francophone Mobility Program (C16) — LMIA-exempt work permit",
        url: "https://moving2canada.com/work/work-permits/francophone-mobility-program/",
      },
      {
        label: "A career in the Canadian Foreign Service — Global Affairs Canada",
        url: "https://international.canada.ca/en/global-affairs/corporate/jobs/careers-foreign-service",
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
      "Your degree is a B.A. in French Studies, which settles this: the NCA route is closed to you, because it assesses legal education obtained abroad and is not an entry point for non-lawyers. That is not a setback — it removes the slowest and most expensive option from the board. What remains are three genuinely different things, and only one of them is aimed at what you actually said you wanted, which was access to rooms.",
    gates: [
      {
        label: "The NCA route is not available to you",
        detail:
          "It assesses law degrees earned outside Canada. A B.A. in French Studies is not one, so this door — and the Osgoode LLM built around satisfying its requirements — is closed. Worth knowing before anyone sells you an LLM as a shortcut to practising.",
        blocking: true,
      },
      {
        label: "Practising means starting from scratch",
        detail:
          "A JD is three years full-time. An Ontario paralegal licence is 18 months to two years. Both are real routes, and both are a career change rather than an addition. Weigh that against the fact that your existing career is already in the rooms you say you want to enter.",
        blocking: false,
      },
      {
        label: "For context if it ever becomes relevant",
        detail:
          "As of March 2026 the NCA added mandatory language screening and a standalone Indigenous Law and Peoples requirement. Only relevant if you ever acquire a foreign law degree — noted so you are not planning from stale information later.",
        blocking: false,
      },
    ],
    moves: [
      {
        title: "The one I would actually do — Queen's Certificate in Law",
        detail:
          "Online, from a real law faculty, designed explicitly for people with no legal background. Seven courses covering constitutional, criminal, tort, contract, property, corporate, workplace, IP and international law, at your own pace. For someone who interprets at ministerial level and drafts institutional messaging, this is the missing vocabulary — and it is the credential that makes legal and policy rooms treat you as a peer rather than as the language support. Highest return per hour on this entire page.",
        kind: "unconventional",
        horizon: "8 months–2 years, part-time",
      },
      {
        title: "The credential nobody told you about — certified legal translator or court interpreter",
        detail:
          "This is the move that uses what you already have rather than starting over. Canada's courts and tribunals run in both official languages and are chronically short of certified French interpreters and legal translators. Certification through a provincial translators' association, or accreditation as a court interpreter, converts your existing skill into a regulated professional credential — one that puts you inside courtrooms, tribunals and ministries as a matter of routine. It is faster than any law programme, it pays, and it is a legitimate reason to be in the room rather than a reason to be admitted to it.",
        kind: "unconventional",
        horizon: "6–18 months",
      },
      {
        title: "Add the legal register to the French practice",
        detail:
          "You already sell high-profile French preparation. Legal and diplomatic French is a distinct, higher-priced register with far fewer competent teachers — juridical terminology, contract language, court formality. Studying it serves the credibility objective and monetises immediately through the business. The study pays for itself, which is rare.",
        kind: "unconventional",
        horizon: "3–9 months",
      },
      {
        title: "If you genuinely want to practise — Ontario paralegal licence",
        detail:
          "Ontario is the only province licensing paralegals as independent practitioners. Accredited programme, licensing exam, good character requirement. By a wide margin the fastest legitimate route to actually practising law within a defined scope. Only sensible if practising is the real goal.",
        kind: "conventional",
        horizon: "18 months–2 years",
      },
      {
        title: "The JD, for completeness",
        detail:
          "Three years, full-time, expensive, and a full career change. Given that you already work inside AU and ministerial rooms, this buys you a different profession rather than better access to the one you have. Named so it is a decision rather than an omission.",
        kind: "conventional",
        horizon: "3 years",
      },
    ],
    firstAction:
      "Enrol in Queen's Introduction to Canadian Law — autumn applications open 1 June with registration in late July. In parallel, look up the certification requirements for legal translation and court interpreting in the province you are targeting: that is the credential that turns what you can already do into something regulated, paid and room-opening, and almost nobody in your position realises it exists.",
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
      "Serious clubs are not bought, they are sponsored — a proposer and a seconder who already belong stake their reputation on you. That makes this a two-year relationship project with a form at the end. You have an unusual shortcut though: clubs constantly need people to host, moderate and MC their events, and you do that professionally. Being useful to a club is the fastest route to being invited into one.",
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
          "The Canadian International Council has chapters and is the natural home for the foreign policy objective. Francophone chambers of commerce, Canada–Africa business councils and diaspora associations matter more than their websites suggest — and in those rooms your French and AU record make you immediately senior rather than a newcomer. Take the committee seat nobody wants; committee work is where sponsors are made.",
        kind: "unconventional",
        horizon: "3–12 months",
      },
      {
        title: "Offer to MC their events — the shortcut you specifically have",
        detail:
          "Every club, chamber and association runs events and every one of them needs a competent bilingual host. Doing it once, well, for free, puts you in front of the entire membership in the most flattering possible position and makes the eventual proposer conversation trivial. Most candidates spend two years trying to get noticed; you can be the person at the podium within one event cycle.",
        kind: "unconventional",
        horizon: "1–6 months",
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
      "You already do this at the highest level — diplomatic galas, ministerial roundtables, continental forums — but always on someone else's mandate. The distinction that matters is between hosting as a service and convening on your own name. The MC is hired; the convener owns the room and the guest list. You have the entire skill set and none of the ownership, which makes this the shortest gap on the page.",
    gates: [
      {
        label: "Convene on your own name, not a client's",
        detail:
          "Hosting professionally builds someone else's institution. One dinner a month under your own name builds yours. Same skill, entirely different asset — and only one of them still belongs to you when the contract ends.",
        blocking: false,
      },
      {
        label: "Consistency beats production value",
        detail:
          "A modest dinner on the first Thursday of every month beats a spectacular one-off. You already know this from run-of-show work; the discipline transfers directly.",
        blocking: false,
      },
    ],
    moves: [
      {
        title: "The Jeffersonian dinner — one table, one conversation",
        detail:
          "Eight to twelve people, phones away, one conversation at a time with no side chatter, and one question posed at the start that everyone answers in turn. It manufactures depth that a reception structurally cannot. You already know how to hold a room to a format; this is that skill applied to your own table.",
        kind: "unconventional",
        horizon: "Start within 3 weeks",
      },
      {
        title: "Make it bilingual — the thing only you can convene",
        detail:
          "An anglophone-francophone table, run properly in both languages, is close to unique and immediately memorable. Nobody else in most Canadian cities can host it credibly. It is also the exact room where Canada–Africa business, diplomacy and diaspora interests overlap — which makes it useful to attend, not merely pleasant. This is your differentiated format; run it and it becomes known by your name.",
        kind: "unconventional",
        horizon: "From the first dinner",
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
        title: "Harvard Kennedy School Mid-Career MPA — and you already qualify",
        detail:
          "Built for people with substantial professional experience, typically seven years or more. You have 7+ years across 12+ nations with African Union, GIZ and federal ministry work on the file — that is not a borderline application, it is the profile the programme is designed for, and the international development and public-sector angle is exactly what they select on. It is the standard credential in senior diplomatic circles worldwide. One year, full-time, in residence. If the diplomatic ladder is the real objective, this is the single most direct instrument on the page.",
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
      "You are already eligible for the Mid-Career MPA, which most people at this stage are not — put it on an 18-month application clock and start assembling recommenders from the AU and GIZ side of your work now, because those references are what will carry the file. If the cost or the year in residence is the obstacle, start an Extension School course this term instead: admission there is earned by performing in the courses themselves, so beginning is the application, and the alumni body is identical.",
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
