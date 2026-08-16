/**
 * The networking curriculum.
 *
 * Written to be used rather than admired: every module ends in something you
 * can do this week, and the scripts are verbatim on purpose. Vague advice is
 * the reason most networking material fails — "be genuinely interested" is
 * true and useless without the sentence that follows it.
 */

export interface Script {
  situation: string;
  say: string;
  why: string;
}

export interface Module {
  id: string;
  n: number;
  title: string;
  subtitle: string;
  icon: string;
  /** The single idea the module turns on. */
  principle: string;
  body: string[];
  tactics: string[];
  scripts?: Script[];
  /** The way people most commonly get this wrong. */
  failure: string;
  drill: string;
}

export const networkingIntro = {
  title: "How to network, make friends, and connect with anyone",
  standfirst:
    "From where to meet people, to what to say first, to how to follow up, to how to reach their network — and how to do it upward without being the person everyone avoids.",
  premise:
    "Networking has a bad name because most of it is transactional people collecting contacts they never speak to again. The version that works is closer to friendship with better record-keeping: be useful, be memorable, be consistent, and ask for things only after you have given some. This curriculum assumes you are willing to do the unglamorous part — the follow-up — because that is where essentially all the value is and it is where essentially everyone quits.",
};

export const modules: Module[] = [
  {
    id: "premise",
    n: 1,
    title: "The premise",
    subtitle: "Why most networking produces nothing",
    icon: "compass",
    principle:
      "A network is not people who know your name. It is people who would take your call and spend their credibility on you.",
    body: [
      "Contacts are worthless and relationships are valuable, and the gap between the two is entirely made of follow-up. Most people optimise the wrong half — they work hard at meeting people and then do nothing for six months.",
      "The asymmetry to exploit: almost everyone is bad at this. If you follow up within 48 hours with something specific, you are already in the top few percent of everyone that person met that month. The bar is on the floor.",
      "Reframe the objective. You are not trying to meet many people. You are trying to become someone that thirty people think of unprompted when an opportunity crosses their desk. Thirty is enough. Thirty is a career.",
    ],
    tactics: [
      "Count relationships, never contacts. If you cannot recall something specific about their life, they are not in the network.",
      "Aim for thirty strong over three hundred weak. Depth is what gets you referred; breadth only gets you invited.",
      "Give three times before you ask once. Track it honestly — most people badly overestimate their giving.",
      "Assume every relationship is a decade long. It changes what you do in month one.",
    ],
    failure:
      "Treating an event as the finish line. The event is the cheapest, easiest part; people who love events and hate follow-up build nothing and cannot understand why.",
    drill:
      "List everyone you met in the last ninety days. Next to each, write one specific non-professional fact you remember. The blanks are your real conversion rate — and it will be worse than you expect.",
  },

  {
    id: "where",
    n: 2,
    title: "Where to actually meet people",
    subtitle: "Rooms ranked by what they return",
    icon: "map-pin",
    principle:
      "Repeated exposure to the same small group beats one-off exposure to a large one. Choose rooms you will re-enter.",
    body: [
      "The best rooms have three properties: the same people return, there is a shared activity so you are not just standing there, and there is a reason to speak that is not networking. Anything with all three outperforms a conference by an order of magnitude.",
      "Conferences and large mixers are the worst-value rooms in existence and the ones everyone defaults to. Everyone is a stranger, nobody returns, and the conversation dies at the door. Use them only when you have pre-booked specific meetings.",
      "The cheat: stop attending and start convening. Hosting inverts the entire dynamic — the host meets everyone by definition, and nobody has to work up the courage to approach you.",
    ],
    tactics: [
      "Rank any room by return rate: will these same faces be here next month? If no, discount it heavily.",
      "Recurring beats prestigious. A monthly meetup of twenty beats an annual gala of eight hundred.",
      "Take a role — volunteer, committee, registration desk. A role gives you a legitimate reason to speak to everyone and removes the approach problem entirely.",
      "Pick rooms with a shared activity: sport, service, study, a working group. Side-by-side beats face-to-face for building trust.",
      "Sit with strangers deliberately. The cost of sitting with people you know is invisible and enormous.",
      "Arrive early, not fashionably late. Early rooms are half-full, quiet, and everyone talks to everyone. By peak time the groups have closed.",
    ],
    scripts: [
      {
        situation: "Joining a closed group of three already talking",
        say: "Mind if I join you? I'm Fred — I don't know anybody here yet.",
        why: "Naming that you are new is disarming and gives them an easy job: welcoming you. Almost nobody refuses.",
      },
      {
        situation: "Someone standing alone at the edge",
        say: "You look like you're hiding from the same thing I am. Fred.",
        why: "Solo attendees are the highest-value and least-approached people in the room. Light, shared complicity, no pressure.",
      },
    ],
    failure:
      "Attending high-prestige one-off events and skipping the unglamorous recurring one. Prestige feels like progress; recurrence produces it.",
    drill:
      "Find three recurring rooms that meet monthly and commit to six months of all three. Six months, not two — the returns arrive around month four, which is exactly when most people quit.",
  },

  {
    id: "opening",
    n: 3,
    title: "Starting the conversation",
    subtitle: "The first ninety seconds",
    icon: "message-circle",
    principle:
      "Openers do not need to be clever. They need to be easy to answer. Lower the cost of the reply and almost anyone will talk to you.",
    body: [
      "Every good opener does one thing: it hands the other person an easy, low-risk reply. Clever openers fail because they put the burden on them to match your energy.",
      "'What do you do?' is not forbidden, it is just weak — it produces a title and a dead end. Ask instead about what brought them here, what they are working on, or what they think about the thing you are both currently inside.",
      "The shared situation is always available and always works. You are both in the same room, at the same talk, in the same queue. Comment on that and you have started without needing a pretext.",
    ],
    tactics: [
      "Lead with your name; it obliges them to give theirs and skips the awkward twenty minutes of not knowing.",
      "Ask about the present situation before the biography. Present tense is easier to answer than a life summary.",
      "Use the two-second pause after their answer. Most people rush to fill it; the pause invites them to keep going, and what comes after the pause is the interesting half.",
      "Never open with an ask. Not the first time, not the second.",
      "Have three openers ready so you are not composing under pressure. Rehearsed is not the same as insincere.",
    ],
    scripts: [
      {
        situation: "Cold open, no context",
        say: "I'm Fred. What brought you here tonight?",
        why: "Present tense, one sentence to answer, and it surfaces motive rather than job title — motive is where the actual conversation lives.",
      },
      {
        situation: "After a talk or panel",
        say: "I'm still chewing on what she said about X. Did you buy it?",
        why: "Shared reference, invites an opinion rather than a fact, and opinions create rapport far faster than information.",
      },
      {
        situation: "They gave a title, and you want past it",
        say: "What does that actually look like day to day? People always picture it wrong.",
        why: "Gives them permission to be real instead of reciting their LinkedIn, and flatters the complexity of their work.",
      },
      {
        situation: "Meeting someone considerably more senior",
        say: "I won't keep you — I just wanted to say your point about X changed how I'm thinking about Y. That's all.",
        why: "Time-bounded, specific, and asks for nothing. Very often they are the one who continues it, and now the conversation is on their initiative.",
      },
    ],
    failure:
      "Waiting for the perfect moment to approach. There isn't one, and the waiting is visible from across the room.",
    drill:
      "This week, open three conversations with strangers outside any professional setting — a queue, a gym, a bookshop. The stakes are zero and it removes the flinch.",
  },

  {
    id: "conversation",
    n: 4,
    title: "Holding the conversation",
    subtitle: "Being worth talking to",
    icon: "messages-square",
    principle:
      "Talk thirty percent of the time, and make your thirty percent count. Being interested works — but only if you are also, occasionally, interesting.",
    body: [
      "The standard advice is to listen more, and it is right but incomplete. Pure listeners are pleasant and forgettable. You need a small number of genuine positions on things — opinions are what make you memorable, and agreement with everything makes you furniture.",
      "Depth comes from the question ladder: fact, then opinion, then story. Most conversations never leave the first rung, which is exactly why they are boring and forgotten by morning.",
      "Find the thing they could talk about for an hour. Everyone has one. When you hit it the energy visibly changes — follow that, and abandon whatever you were planning to say next.",
    ],
    tactics: [
      "Climb the ladder: 'what do you work on' → 'what do you make of it' → 'what happened when'. Stories are what get remembered.",
      "Ask the second question. Almost nobody does, and it is the single clearest signal that you were actually listening.",
      "Offer a real opinion once per conversation. Mild disagreement, held pleasantly, is memorable and respected.",
      "Say the specific thing you know. Vague competence is invisible; one concrete detail establishes you instantly.",
      "Watch for energy, not politeness. People are polite about everything and animated about very little — steer toward the animation.",
      "Remember one non-work fact. It is the entire basis of the follow-up.",
    ],
    scripts: [
      {
        situation: "The conversation is stalling on facts",
        say: "What's the part of it people outside it always get wrong?",
        why: "Invites a small correction, which people enjoy giving, and it reliably produces an opinion and often a story.",
      },
      {
        situation: "You want to go one level deeper",
        say: "How did you end up in that? It's not an obvious path.",
        why: "Origin stories are the most reliably interesting thing anyone has, and people are rarely asked for theirs.",
      },
      {
        situation: "You disagree with them",
        say: "That's interesting — I'd have guessed the opposite, because X. What am I missing?",
        why: "Disagreement framed as curiosity. You are memorable for having a view and generous for assuming they have the better one.",
      },
    ],
    failure:
      "Waiting for your turn to talk instead of listening — and doing it so obviously that they can see you loading your next sentence.",
    drill:
      "In your next five conversations, ask the second question every single time. Notice how often you are the first person that day to have done it.",
  },

  {
    id: "exit",
    n: 5,
    title: "Leaving well",
    subtitle: "The most underrated skill here",
    icon: "door-open",
    principle:
      "End the conversation slightly before it runs out. The last thirty seconds decide whether there is a next one.",
    body: [
      "Most conversations do not end, they decay — into small talk, then silence, then an awkward drift apart. Everyone remembers the decay, and it colours the whole exchange retroactively.",
      "Leaving first, warmly, while it is still good, reads as confident and considerate. It also leaves them slightly wanting more, which is precisely the state you want them in.",
      "The exit is where you set up the follow-up. If you leave without a reason to make contact again, the conversation produced nothing regardless of how well it went.",
    ],
    tactics: [
      "Leave on a high, not on a lull. Roughly ten to fifteen minutes is plenty for a first conversation.",
      "Name the next step out loud before you go, or there won't be one.",
      "Make the ask tiny — a link, an article, an introduction you are offering them. Small asks get said yes to.",
      "Never let them watch you scan the room. It is the rudest thing you can do while still technically listening.",
      "Introduce them onward as you leave. Handing someone to another person is a gift and they remember who gave it.",
    ],
    scripts: [
      {
        situation: "Clean exit with a hook",
        say: "I'm going to let you talk to other people — but send me that thing on X, I genuinely want to read it. What's the best way to reach you?",
        why: "You leave first, you make the request about their expertise, and you have a reason to appear in their inbox tomorrow.",
      },
      {
        situation: "Exit by introducing them to someone else",
        say: "Before I go — you should meet Sarah, she's dealing with exactly the thing you just described. Let me introduce you.",
        why: "You end as the person who gave them something. That is the strongest possible last impression.",
      },
      {
        situation: "Nothing in common, ending gracefully",
        say: "Good to meet you — enjoy the rest of it.",
        why: "Not every conversation should continue. A clean, warm, short ending costs nothing and leaves no bad taste.",
      },
    ],
    failure:
      "Staying too long out of politeness until the conversation dies, then both of you escaping. Now the memory is the awkwardness.",
    drill:
      "Practise leaving three conversations while they are still going well. It will feel wrong the first time and correct by the third.",
  },

  {
    id: "followup",
    n: 6,
    title: "The follow-up",
    subtitle: "Where ninety percent of the value is",
    icon: "send",
    principle:
      "Within 48 hours, specific, and asking for nothing. This one habit outperforms everything else on this page combined.",
    body: [
      "This is the whole game. Not the opener, not the charm — the fact that you sent something specific two days later and almost nobody else did.",
      "Specific means it could not have been sent to anyone else. 'Great to meet you' is worthless and slightly insulting. Reference the actual thing they said, the thing you promised, the thing you thought about afterwards.",
      "Ask for nothing in the first follow-up. Nothing. The message that gives and does not take is the one that establishes what kind of person you are.",
    ],
    tactics: [
      "48 hours. Not a week. After a week you are a stranger who is slightly embarrassing to reply to.",
      "Send the thing you promised, and send it first, before the pleasantries.",
      "Reference one specific detail from the conversation so it is unmistakably them.",
      "Keep it under five sentences. Long follow-ups feel like work to answer and get postponed into oblivion.",
      "No ask in message one. Give it three exchanges minimum.",
      "Connect on one platform only, and add a note. Bare connection requests are barely better than nothing.",
    ],
    scripts: [
      {
        situation: "Standard 48-hour follow-up",
        say: "Fred here — we talked about [specific thing] at [event] on Tuesday. Here's that piece I mentioned: [link]. Your point about [their specific point] has been rattling around my head since. No need to reply — just wanted to send it over.",
        why: "Specific, delivers first, releases them from the obligation to answer. 'No need to reply' reliably increases replies.",
      },
      {
        situation: "You have nothing to send",
        say: "Fred — good to meet you at [event]. I went and looked up [thing they mentioned] afterwards and you were right about [detail]. Filing that away. Hope the [specific thing they had coming up] goes well.",
        why: "Proves you listened and did something with it, and remembering their upcoming thing is disproportionately powerful.",
      },
      {
        situation: "Second touch, three to four weeks later",
        say: "Saw this and thought of you — [link]. Related to what you said about [thing]. How did [their thing] end up going?",
        why: "Give first, then one easy question. This is the message that converts a contact into a relationship.",
      },
    ],
    failure:
      "'Great meeting you, let's stay in touch!' — the message that is technically a follow-up and functionally nothing. It generates no reply and no memory.",
    drill:
      "Send follow-ups to everyone you met in the last month, even if it is now embarrassingly late. Late is recoverable; never is not.",
  },

  {
    id: "orbit",
    n: 7,
    title: "Staying in orbit",
    subtitle: "The long game most people never play",
    icon: "repeat",
    principle:
      "Four light, useful touches a year keeps a relationship alive indefinitely. That is all it takes, and almost nobody does it.",
    body: [
      "Relationships do not need constant contact, they need reliable contact. Four times a year with something genuinely useful and you will be top of mind when it matters — which is always at a moment you could not have predicted.",
      "The content of the touch matters less than the fact that it costs them nothing. Send things, congratulate things, remember things. Never open with a request.",
      "This is a systems problem, not a memory problem. You will not remember; the system has to.",
    ],
    tactics: [
      "Keep a simple list with name, where you met, one personal fact, last contact date, next touch date.",
      "Four touches a year for the strong thirty. Once a year for the wider ring.",
      "Congratulate promotions, launches and moves within 24 hours. Highest return per unit of effort of anything here.",
      "Forward things with one line of why it made you think of them. The line is what makes it personal.",
      "Ask about the thing they told you last time. This is the single strongest signal that you are actually paying attention.",
      "Do a monthly review: who have I not spoken to in six months and should have?",
    ],
    scripts: [
      {
        situation: "Congratulating a move",
        say: "Congratulations on the new role — genuinely pleased for you. [One specific reason they're right for it.] Would love to hear how the first months go.",
        why: "Specific praise reads as sincere; generic praise reads as an alert notification, which is what it usually is.",
      },
      {
        situation: "Reviving a relationship after a long silence",
        say: "It's been far too long — entirely my fault. I saw [thing] and thought of our conversation about [topic]. How are things at [place]?",
        why: "Owning the silence removes the awkwardness instantly. Almost everyone responds warmly to it.",
      },
    ],
    failure:
      "Going quiet for two years and then reappearing with a request. Everyone recognises that message for exactly what it is.",
    drill:
      "Build the list this week. Thirty names, five columns. A spreadsheet is entirely sufficient — the tool is not the hard part.",
  },

  {
    id: "their-network",
    n: 8,
    title: "Reaching their network",
    subtitle: "How to ask for an introduction",
    icon: "share-2",
    principle:
      "Make the introduction effortless to make and easy to refuse. Every friction you remove raises the yes rate.",
    body: [
      "When someone introduces you, they lend you their credibility. Understanding that changes how you ask — you are asking them to take a small risk, so make the risk small and make the work zero.",
      "The forwardable email is the whole technique. Write the message they can forward without editing, so the entire cost to them is pressing a button.",
      "Give them a graceful exit. 'No problem at all if it's not the right time' makes it easy to say no, which counterintuitively makes it far easier to say yes.",
    ],
    tactics: [
      "Ask by name. 'Do you know anyone in policy' produces nothing; 'could you introduce me to X' produces an answer.",
      "Write the forwardable paragraph and hand it over. Never make them compose it.",
      "Say exactly what you want from the introduction and how long it will take.",
      "Use double opt-in — ask them to check with the other person first. It is the courteous convention and senior people notice you knew it.",
      "Report back afterwards, always. People introduce repeatedly to those who tell them how it went, and once to those who don't.",
      "Never go around them. Using someone's name without permission ends the relationship.",
    ],
    scripts: [
      {
        situation: "Asking for the introduction",
        say: "Would you be willing to introduce me to [name]? I'm trying to understand [specific thing] and she's the obvious person. Happy to write something forwardable so it's no work for you — and genuinely no problem if it's not the right time.",
        why: "Named, purposeful, zero-effort, and pre-forgiven. Removes every reason to say no except an actual one.",
      },
      {
        situation: "The forwardable paragraph you hand them",
        say: "Fred is working on [one line]. He's trying to understand [specific question] and I thought of you because [reason]. He's asked for 20 minutes and is easy to talk to. Worth a conversation if you have the time.",
        why: "Third person, specific, time-bounded. They forward it unedited, which is exactly the point.",
      },
      {
        situation: "Reporting back",
        say: "Spoke to [name] yesterday — really useful, particularly on [specific]. Thank you for making it happen. I'll keep you posted on [outcome].",
        why: "Closes the loop, proves the introduction was well spent, and is the reason they will do it again.",
      },
    ],
    failure:
      "The vague ask — 'let me know if you know anyone who could help'. It puts all the work on them and reliably produces silence.",
    drill:
      "Ask for one introduction this month, with a forwardable paragraph attached. Then report back within 48 hours of the meeting.",
  },

  {
    id: "upward",
    n: 9,
    title: "Networking upward",
    subtitle: "Being worth a senior person's time",
    icon: "trending-up",
    principle:
      "Senior people are not short of admirers. They are short of time, good information, and people who follow through.",
    body: [
      "The status gap is real and pretending it is not is the fastest way to be dismissed. Acknowledge it lightly, take less of their time than they offered, and be useful in a way that matches your actual position.",
      "You cannot offer a senior person money or opportunity. You can offer specificity, ground truth from a level they no longer see, genuine attention, and flawless follow-through — that last one is rarer at every level than anyone expects.",
      "Proximity beats introduction. Being reliably in the same rooms over a year produces a warmer relationship than any single well-crafted email, which is the real argument for objectives 3 and 4.",
    ],
    tactics: [
      "Ask for fifteen minutes and finish in twelve. It gets remembered and it gets you the next meeting.",
      "Come with a specific question, never 'pick your brain'. That phrase signals you have not prepared.",
      "Bring ground truth — what is actually happening at your level that they cannot see from theirs. It is genuinely valuable and you are the only one who has it.",
      "Follow through on every single thing you say you will do. At this level, one miss is disqualifying.",
      "Do not ask for a job. Ask for their read on a decision. The job conversation happens later, and it happens because they offered.",
      "Be patient on a scale of years. The relationship that matters at 45 was started at 30.",
    ],
    scripts: [
      {
        situation: "The cold approach to someone senior",
        say: "I've followed your work on [specific]. I'm [one line on you], and I'm trying to decide [specific decision]. Could I ask you one question about it — 15 minutes, or by email if that's easier?",
        why: "Specific, credits their work properly, offers the low-cost option, and asks for a bounded thing.",
      },
      {
        situation: "In the meeting",
        say: "I've got three questions but the one that matters most is [X]. If we only get to that one, that's a good use of the time.",
        why: "Signals preparation and respect for their clock, and guarantees you get the answer you actually needed.",
      },
      {
        situation: "Offering something back",
        say: "One thing you might find useful — [specific observation from your level]. It's not what I'd have expected either.",
        why: "Ground truth is the one currency you genuinely hold. Offer it without overclaiming.",
      },
    ],
    failure:
      "'I'd love to pick your brain' with no question attached. It asks them to do the work of designing the meeting, and senior people have learned to decline it automatically.",
    drill:
      "Identify five people two levels above you. Write the one specific question you would ask each. Send one this month.",
  },

  {
    id: "system",
    n: 10,
    title: "The system",
    subtitle: "Because you will not remember",
    icon: "workflow",
    principle:
      "Everything above fails without a system. Not because the advice is wrong, but because memory is.",
    body: [
      "Every person who is good at this has a system, and almost none of them mention it because it sounds calculating. It is not calculating; it is the difference between meaning to stay in touch and actually doing it.",
      "It can be a spreadsheet. It does not need to be a CRM, and the time spent choosing a tool is time not spent sending follow-ups.",
      "Thirty minutes a week is the whole cost. Fifteen on Friday to log the week and send follow-ups, fifteen on Monday to look at who is due.",
    ],
    tactics: [
      "Five columns: name, where you met, one personal fact, last contact, next touch.",
      "Log within 24 hours of meeting someone, while the detail is still there. The detail is the entire asset.",
      "Friday: log the week, send every outstanding follow-up. Non-negotiable, thirty minutes.",
      "Monday: look at who is due a touch this week. Send two or three.",
      "Quarterly: reread the whole list. You will find three people you meant to contact and forgot.",
      "Track your giving as well as your asking. If the ledger is lopsided toward asking, correct it before you need anything.",
    ],
    failure:
      "Building an elaborate system, using it for two weeks, and abandoning it. A crude system you actually maintain beats a sophisticated one you don't by an infinite margin.",
    drill:
      "Create the spreadsheet today with five columns. Add everyone you can remember from the last ninety days. Put the Friday slot in your calendar as a recurring event.",
  },
];

export const networkingTotals = {
  modules: modules.length,
  scripts: modules.reduce((sum, m) => sum + (m.scripts?.length ?? 0), 0),
  drills: modules.length,
};

/** The one-page version, for when the full curriculum is too much. */
export const networkingRules = [
  "Follow up within 48 hours, specifically, asking for nothing.",
  "Choose recurring rooms over prestigious ones.",
  "Host rather than attend whenever you can.",
  "Ask the second question.",
  "Leave the conversation while it is still good.",
  "Give three times before asking once.",
  "Make introductions effortless to make and easy to refuse.",
  "Ask senior people one specific question, not for their brain.",
  "Keep the list. You will not remember.",
  "Assume every relationship is a decade long.",
];
