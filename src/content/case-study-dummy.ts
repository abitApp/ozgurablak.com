export type CaseStudySectionId =
  | "overview"
  | "research"
  | "insights"
  | "design"
  | "validation"
  | "solution"
  | "impact";

export type CaseStudySection = {
  id: CaseStudySectionId;
  navLabel: string;
  heading: string;
  body: string;
  meta: Array<{ label: string; value: string }>;
  galleryCaption: string;
  badges: Array<{ label: string; tone: "outline" | "fill" }>;
  cards: Array<{ title: string; body: string }>;
};

export type CaseStudyDoc = {
  name: string;
  blurb: string;
  footer: string;
  sections: CaseStudySection[];
};

/** Shared dummy case-study shell — structure matches the GlowGo reference. */
export const dummyCaseStudy: CaseStudyDoc = {
  name: "GlowGo",
  blurb: "Mobile app · At-home beauty and wellness",
  footer: "Solo end-to-end project within the Coderhouse UX/UI course, 2026.",
  sections: [
    {
      id: "overview",
      navLabel: "Overview",
      heading: "Booking at-home beauty shouldn't cost more time than it saves.",
      body: "A mobile app that connects users with at-home beauty and wellness professionals — search, book, and pay in one guided flow, without the usual back-and-forth.",
      meta: [
        { label: "Type", value: "New product · mobile app" },
        { label: "Context", value: "Coderhouse · solo project" },
        { label: "Role", value: "UX/UI Designer · end to end" },
        { label: "Tools", value: "Figma · UXtweak · A11y (Figma)" },
      ],
      galleryCaption: "Final result: a guided booking, from search to payment.",
      badges: [
        { label: "5 de 5 completed the 4 tasks", tone: "outline" },
        { label: "Avg. time on task −28%", tone: "fill" },
      ],
      cards: [
        {
          title: "Measured · test with 5 users",
          body: "Task success, time-on-task, and SUS captured after the mid-fidelity prototype round.",
        },
        {
          title: "Design decision after the test",
          body: "Collapsed payment into the booking summary; users no longer abandoned at checkout.",
        },
      ],
    },
    {
      id: "research",
      navLabel: "Research",
      heading: "People already knew who they wanted — the booking was the friction.",
      body: "Interviews and diary snippets showed the same pattern: trust in the professional was high, but coordinating time, price, and location still lived in WhatsApp threads.",
      meta: [
        { label: "Methods", value: "5 interviews · diary study" },
        { label: "Scope", value: "Urban users · 25–40" },
        { label: "Role", value: "Research · synthesis" },
        { label: "Tools", value: "Notion · FigJam" },
      ],
      galleryCaption: "Research board: quotes clustered around scheduling pain.",
      badges: [
        { label: "12 pain points ranked", tone: "outline" },
        { label: "3 opportunity areas", tone: "fill" },
      ],
      cards: [
        {
          title: "Primary insight",
          body: "Users compare 2–3 pros before booking — comparison must stay lightweight.",
        },
        {
          title: "Constraint",
          body: "Pros manage their own calendars; the app can’t invent availability.",
        },
      ],
    },
    {
      id: "insights",
      navLabel: "Insights \u2192 decisions",
      heading: "One booking path, three moments that needed trust.",
      body: "We narrowed the product to search → profile confidence → locked slot. Everything else became secondary or deferred.",
      meta: [
        { label: "Focus", value: "Booking path only" },
        { label: "Decisions", value: "4 product bets" },
        { label: "Role", value: "Product framing" },
        { label: "Tools", value: "FigJam · Figma" },
      ],
      galleryCaption: "Decision map: what ships in v1 vs. later.",
      badges: [
        { label: "v1 = guided booking", tone: "outline" },
        { label: "Social proof on profiles", tone: "fill" },
      ],
      cards: [
        {
          title: "Bet 01",
          body: "Show price and duration before the calendar — no bait-and-switch.",
        },
        {
          title: "Bet 02",
          body: "Reviews sit next to availability, not buried below the fold.",
        },
      ],
    },
    {
      id: "design",
      navLabel: "Design",
      heading: "A calm UI that keeps the next step obvious.",
      body: "Visual hierarchy prioritises the booking CTA and availability. Profiles are scannable in under ten seconds on a phone.",
      meta: [
        { label: "Fidelity", value: "Hi-fi · iOS first" },
        { label: "System", value: "8pt grid · Poppins" },
        { label: "Role", value: "UI · prototyping" },
        { label: "Tools", value: "Figma" },
      ],
      galleryCaption: "Key screens: search, profile, slot picker, payment.",
      badges: [
        { label: "18 screens in prototype", tone: "outline" },
        { label: "Dark + light variants", tone: "fill" },
      ],
      cards: [
        {
          title: "Component focus",
          body: "Reusable slot chips and review rows kept the system small and consistent.",
        },
        {
          title: "Accessibility",
          body: "Contrast checked on CTAs and badges; hit targets ≥ 44pt.",
        },
      ],
    },
    {
      id: "validation",
      navLabel: "Validation",
      heading: "Five users, four tasks — and a clearer checkout.",
      body: "Moderated tests on UXtweak confirmed the search → book path. Payment was the only step that still caused hesitation.",
      meta: [
        { label: "Sample", value: "5 participants" },
        { label: "Tasks", value: "4 scripted flows" },
        { label: "Role", value: "Test plan · synthesis" },
        { label: "Tools", value: "UXtweak · Notion" },
      ],
      galleryCaption: "Highlights reel from the validation sessions.",
      badges: [
        { label: "5 / 5 task completion", tone: "outline" },
        { label: "Checkout friction flagged", tone: "fill" },
      ],
      cards: [
        {
          title: "What worked",
          body: "Slot picker and price transparency needed almost no explanation.",
        },
        {
          title: "What changed",
          body: "Merged tip + payment confirmation into one screen.",
        },
      ],
    },
    {
      id: "solution",
      navLabel: "Final solution",
      heading: "From first search to paid booking in one sitting.",
      body: "The shipped concept is a single guided path with progress cues, saved pros, and a receipt that doubles as the visit reminder.",
      meta: [
        { label: "Outcome", value: "Clickable prototype" },
        { label: "Platform", value: "iOS · Android spec" },
        { label: "Role", value: "End-to-end delivery" },
        { label: "Tools", value: "Figma · prototype" },
      ],
      galleryCaption: "End-to-end flow montage.",
      badges: [
        { label: "Happy path ≤ 2 min", tone: "outline" },
        { label: "Zero dead ends in v1", tone: "fill" },
      ],
      cards: [
        {
          title: "Handoff",
          body: "Annotated flows and a slim component inventory for engineering.",
        },
        {
          title: "Next",
          body: "Pro-side calendar sync flagged as the follow-up epic.",
        },
      ],
    },
    {
      id: "impact",
      navLabel: "Impact & learnings",
      heading: "Clarity beat feature count — every time.",
      body: "Cutting scope early made validation useful. The biggest learning: users forgive a thin feature set if the booking feels trustworthy.",
      meta: [
        { label: "Course", value: "Coderhouse UX/UI 2026" },
        { label: "Score", value: "Course final · passed" },
        { label: "Role", value: "Reflection" },
        { label: "Tools", value: "Notion" },
      ],
      galleryCaption: "Before / after framing for the portfolio.",
      badges: [
        { label: "Scope cut ×2", tone: "outline" },
        { label: "Stronger narrative", tone: "fill" },
      ],
      cards: [
        {
          title: "Would repeat",
          body: "Test mid-fi earlier — saved a full redesign of payment.",
        },
        {
          title: "Would change",
          body: "Recruit one beauty professional earlier for supply-side realism.",
        },
      ],
    },
  ],
};

export function caseStudyForProject(project: {
  title: string;
  subtitle?: string;
  role: string;
}): CaseStudyDoc {
  return {
    ...dummyCaseStudy,
    name: project.title,
    blurb: project.subtitle?.split("\n")[0] ?? dummyCaseStudy.blurb,
    footer: `${project.role} · case study draft (dummy content).`,
  };
}
