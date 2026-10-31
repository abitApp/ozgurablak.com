export type CaseStudyMenuChild = {
  id: string;
  label: string;
};

export type CaseStudyMenuItem = {
  id: string;
  number: string;
  label: string;
  children?: CaseStudyMenuChild[];
  /** When true, children only render while this menu item is active. */
  childrenOnlyWhenActive?: boolean;
};

export type CaseStudyMetaItem = {
  label: string;
  value: string;
};

export type CaseStudyChip = {
  label: string;
  tone: "outline" | "fill";
};

export type CaseStudyImageSlot = {
  id: string;
  aspectRatio: string;
  description: string;
  src?: string;
  alt?: string;
};

export type CaseStudyOverviewBodyLink = {
  /** Exact linked phrase, rendered in accent colour. */
  text: string;
  /** Optional study slug to open — wire later if cross-modal open is available. */
  openStudyId?: string;
};

export type CaseStudyOverviewContent = {
  kind: "overview";
  heading: string;
  /** Muted one-liner under the headline. Optional — omit on other entries. */
  subline?: string;
  meta: CaseStudyMetaItem[];
  hero: CaseStudyImageSlot;
  /** Caption under the hero (Design System). Optional. */
  caption?: string;
  /**
   * Body under the hero. `link` marks an accent-coloured phrase inside `text`
   * (exact substring match).
   */
  body?: {
    text: string;
    link?: CaseStudyOverviewBodyLink;
  };
  chips: CaseStudyChip[];
};

export type CaseStudyStorySegment =
  | { type: "paragraph"; text: string }
  | { type: "bold"; text: string }
  | { type: "bullets"; items: string[] };

export type CaseStudyStoryBlock = {
  id: string;
  label: string;
  highlight?: boolean;
  segments: CaseStudyStorySegment[];
  /** Optional stat card rendered above this block's body (e.g. Impact). */
  stat?: {
    value: string;
    label: string;
  };
};

export type CaseStudyStoryContent = {
  kind: "story";
  heading: string;
  blocks: CaseStudyStoryBlock[];
  /** Images below the last block. */
  images?: CaseStudyImageSlot[];
  /** Default stack. Side-by-side rows on sm+, stacked on narrow screens. */
  imagesLayout?: "stack" | "side-by-side";
};

export type CaseStudyProblemContent = {
  kind: "problem-hypothesis";
  heading: string;
  /** Body text before the bold suffix. */
  bodyBeforeBold: string;
  /** Exact phrase rendered bold at the end of the body. */
  bodyBold: string;
  stat: {
    value: string;
    label: string;
  };
  image: CaseStudyImageSlot;
  hypothesis: {
    label: string;
    text: string;
  };
};

export type CaseStudyDecisionBlock = {
  id: string;
  title: string;
  body: string;
  highlighted: boolean;
};

export type CaseStudyWhatIDidContent = {
  kind: "what-i-did";
  heading: string;
  intro: string;
  blocks: CaseStudyDecisionBlock[];
  /** Image placed directly under this block id (before the next block). */
  imageAfterBlockId: string;
  image: CaseStudyImageSlot;
};

export type CaseStudyResultContent = {
  kind: "result";
  heading: string;
  body: string;
  image: CaseStudyImageSlot;
};

export type CaseStudyResearchCard = {
  id: string;
  title: string;
  body: string;
  /**
   * Optional study link. Rendered only when `studyId` is set
   * (METRO cards omit this until studies land in a later part).
   */
  link?: {
    label: string;
    /** Opens the matching in-modal study view. */
    studyId: string;
  };
};

export type CaseStudyResearchStudyBlock = {
  id: string;
  label: string;
  body: string;
};

export type CaseStudyResearchStudy = {
  id: string;
  sidebarLabel: string;
  title: string;
  blocks: CaseStudyResearchStudyBlock[];
  imageSlot: CaseStudyImageSlot;
};

export type CaseStudyResearchContent = {
  kind: "research";
  heading: string;
  /** Muted one-liner under the headline. Optional. */
  subline?: string;
  /** Required when any study views exist (Vodafone App §06). */
  backLabel?: string;
  cards: CaseStudyResearchCard[];
  studies?: CaseStudyResearchStudy[];
  /** Images below the cards on the overview. */
  images?: CaseStudyImageSlot[];
  /** Default stack. Side-by-side rows on sm+, stacked on narrow screens. */
  imagesLayout?: "stack" | "side-by-side";
};

export type CaseStudyEmptyContent = {
  kind: "empty";
};

export type CaseStudySectionContent =
  | CaseStudyOverviewContent
  | CaseStudyProblemContent
  | CaseStudyWhatIDidContent
  | CaseStudyResultContent
  | CaseStudyStoryContent
  | CaseStudyResearchContent
  | CaseStudyEmptyContent;

export type CaseStudySection = {
  id: string;
  number: string;
  name: string;
  content: CaseStudySectionContent;
};

export type CaseStudy = {
  title: string;
  subtitle: string;
  footerNote: string;
  menu: CaseStudyMenuItem[];
  sections: CaseStudySection[];
};

/**
 * Portfolio case studies keyed by project slug.
 * Cards without an entry keep using the GlowGo dummy.
 */
export const caseStudies: Record<string, CaseStudy> = {
  "vodafone-design-system": {
    title: "Vodafone",
    subtitle: "Design system · native iOS & Android app",
    footerNote:
      "Most senior designer in a team of three. I led the system and built most of it myself.",
    menu: [
      { id: "overview", number: "01", label: "Overview" },
      {
        id: "problem-hypothesis",
        number: "02",
        label: "Problem & hypothesis",
      },
      {
        id: "what-i-did",
        number: "03",
        label: "What I did",
        children: [
          { id: "atomic-design", label: "Atomic design" },
          { id: "native-not-copied", label: "Native, not copied" },
          { id: "flows-that-branch", label: "Flows that branch" },
          { id: "documented-and-reviewed", label: "Documented and reviewed" },
          {
            id: "designer-sign-off-in-uat",
            label: "Designer sign-off in UAT",
          },
          { id: "variables", label: "Variables" },
        ],
      },
      { id: "result", number: "04", label: "Result" },
    ],
    sections: [
      {
        id: "overview",
        number: "01",
        name: "Overview",
        content: {
          kind: "overview",
          heading:
            "One source of truth for a native app in six European markets.",
          meta: [
            {
              label: "Context",
              value: "App taken over from an agency · ~7 months",
            },
            {
              label: "Role",
              value: "Senior Product Designer · team of three",
            },
            {
              label: "Tools",
              value:
                "Figma · After Effects · Adobe Illustrator · Lottie · Confluence · Jira",
            },
          ],
          hero: {
            id: "hero",
            aspectRatio: "2/1",
            description:
              "Hero visual: phone mockup of the Vodafone router app dashboard, with five design-token callouts around it (Font-size 32pt, Color #00697C, Space 20pt, Radius 20pt, Icon size 20pt). Same visual as on the carousel card.",
          },
          caption: "Three tools became one: Figma.",
          chips: [
            { label: "3 tools → 1", tone: "outline" },
            { label: "100+ components", tone: "fill" },
            {
              label: "50+ core screens, ~1,000 including states",
              tone: "fill",
            },
            { label: "13 flow categories", tone: "fill" },
          ],
        },
      },
      {
        id: "problem-hypothesis",
        number: "02",
        name: "Problem & hypothesis",
        content: {
          kind: "problem-hypothesis",
          heading:
            "Two apps in parallel: one in design, one in code, barely agreeing.",
          bodyBeforeBold:
            "We inherited an agency's work spread across Sketch, Zeplin and Overflow, with no component library, vague handovers and no defined interactions. Designs existed for iOS only, so developers adapted iOS components for Android on the fly: unfamiliar patterns for users, extra time for developers. Vodafone's global system was built for hybrid, not native. Comparing ~40 key screens with the live app: ",
          bodyBold: "~80% didn't match.",
          stat: {
            value: "~80%",
            label: "of ~40 key screens didn't match the live app",
          },
          image: {
            id: "problem",
            aspectRatio: "16/9",
            description:
              "Side-by-side of the Figma design and the live app for the same screen, with the differences highlighted.",
          },
          hypothesis: {
            label: "Hypothesis",
            text: "One shared design system in Figma would give us a faster handover and fewer differences between design and build. Vodafone chose Figma globally; we backed it.",
          },
        },
      },
      {
        id: "what-i-did",
        number: "03",
        name: "What I did",
        content: {
          kind: "what-i-did",
          heading: "Six decisions behind the system.",
          intro:
            "Most senior designer in a team of three. I led the system, the Figma migration and the developer dialogue, and built most of it myself, interactions included.",
          blocks: [
            {
              id: "atomic-design",
              title: "My call: atomic design.",
              body: "Smallest parts first, combined like puzzle pieces into one flexible system. Components before interactions, because behaviour depends on the component and the iOS and Android guidelines work the same way. 100+ components, tokens from day one, 7 macro and 11 micro interaction patterns.",
              highlighted: true,
            },
            {
              id: "native-not-copied",
              title: "Native, not copied.",
              body: "Typeface, colours and icons from Vodafone's global system; Android got its own pickers, buttons, back navigation, navigation bars and dialogs, so developers no longer had to improvise from iOS.",
              highlighted: false,
            },
            {
              id: "flows-that-branch",
              title: "Flows that branch.",
              body: "13 categories, 5–8 flows each, changing by market, device and events: add an extender and the whole journey changes. Hence ~1,000 screens, states included. Prototypes for the critical journeys, After Effects for interaction detail.",
              highlighted: false,
            },
            {
              id: "documented-and-reviewed",
              title: "Documented and reviewed.",
              body: "Every component documented in Figma and mirrored in Confluence, with the rules each market must follow and the edge cases developers need. Design reviews every three days: we showed each other what we did and how, and I played devil's advocate, like a stakeholder would, to steer the work.",
              highlighted: false,
            },
            {
              id: "designer-sign-off-in-uat",
              title: "The trade-off: designer sign-off in UAT.",
              body: "More review time for us, but a final gate that caught what slipped through earlier checks, including real bugs.",
              highlighted: true,
            },
            {
              id: "variables",
              title: "My call: Variables.",
              body: "Six months after delivery I decided to migrate the library to Figma Variables and did it alone in a month. Dark mode became easy and visual changes stopped costing hours.",
              highlighted: true,
            },
          ],
          imageAfterBlockId: "flows-that-branch",
          image: {
            id: "flow",
            aspectRatio: "16/9",
            description:
              "One single user flow that branches depending on the extender: add an extender and the whole journey changes. Flow diagram with the branches highlighted.",
          },
        },
      },
      {
        id: "result",
        number: "04",
        name: "Result",
        content: {
          kind: "result",
          heading:
            "Before: most screens had something wrong. After: no visible flaw left.",
          body: "What UAT surfaced were nice-to-haves and pixel-level spacing, the natural noise of implementation. Developers receive screens to a written standard, a checklist on every Jira ticket, ask very few questions and start building right away. Three tools became one: Figma.",
          image: {
            id: "result",
            aspectRatio: "16/9",
            description:
              "Three panels, Before / After / Implemented in App: the same screen in the old design, in the new design, and in the live app.",
          },
        },
      },
    ],
  },
  "vodafone-app": {
    title: "Vodafone",
    subtitle: "Router management app · native iOS & Android",
    footerNote:
      "Senior Product Designer on the in-house team that took this native app over from an agency.",
    menu: [
      { id: "overview", number: "01", label: "Overview" },
      { id: "rating-prompt", number: "02", label: "Rating prompt" },
      { id: "home-screen", number: "03", label: "Home screen" },
      { id: "illustrations", number: "04", label: "Illustrations" },
      {
        id: "ar-guide-concept",
        number: "05",
        label: "AR guide (concept)",
      },
      {
        id: "how-i-researched",
        number: "06",
        label: "How I researched",
        childrenOnlyWhenActive: true,
        children: [
          { id: "walkthrough", label: "Walkthrough or tooltips" },
          { id: "wifi-icon", label: "Wi-Fi password icon" },
          { id: "device-names", label: "Unknown device names" },
        ],
      },
    ],
    sections: [
      {
        id: "overview",
        number: "01",
        name: "Overview",
        content: {
          kind: "overview",
          heading:
            "Home Wi-Fi and extender management for customers in six European markets.",
          meta: [
            {
              label: "Context",
              value:
                "In-house team that took the app over from an agency · 6 markets",
            },
            {
              label: "Role",
              value: "Senior Product Designer",
            },
          ],
          hero: {
            id: "hero",
            aspectRatio: "2/1",
            description:
              "Hero visual: 3 to 4 main screens of the app, iOS and Android side by side.",
          },
          body: {
            text: "I was Senior Product Designer on the in-house team that took this native app over from an agency. There was no formal lead title, so I took the initiative where the product needed it. Four stories follow. Behind them sit the app's 13 flow categories, with 5–8 flows each, and the UI system built for them, covered in the design system case study →",
            link: {
              text: "design system case study →",
              openStudyId: "vodafone-design-system",
            },
          },
          chips: [
            { label: "Native iOS & Android", tone: "outline" },
            { label: "6 markets", tone: "fill" },
            { label: "10+ devices", tone: "fill" },
            { label: "Ireland Android rating ~1.4 → ~3.8", tone: "fill" },
          ],
        },
      },
      {
        id: "rating-prompt",
        number: "02",
        name: "Rating prompt",
        content: {
          kind: "story",
          heading: "Asking at the right moment, Ireland's rating",
          blocks: [
            {
              id: "problem",
              label: "Problem",
              segments: [
                {
                  type: "paragraph",
                  text: "In late 2022, Ireland was the app's lowest-rated market: about 2.65 on iOS and 1.4 on Android, flat at the start of tracking. The reviews weren't about the interface. They were about technical issues and pricing.",
                },
              ],
            },
            {
              id: "hypothesis",
              label: "Hypothesis",
              segments: [
                {
                  type: "paragraph",
                  text: "Unhappy customers, especially over pricing, review far more often than happy ones, so the rating reflects the loudest group, not the typical user. Asking at the moment of success would rebalance it.",
                },
              ],
            },
            {
              id: "what-i-did",
              label: "What I did",
              highlight: true,
              segments: [
                {
                  type: "bold",
                  text: "My call: ask at the moment of success, not on a timer.",
                },
                {
                  type: "paragraph",
                  text: " I chose three flows where users feel the best experience, and triggered the prompt right after each:",
                },
                {
                  type: "bullets",
                  items: [
                    "finishing the guest Wi-Fi setup",
                    "activating an extender (customers get one from Vodafone when their router's signal is weak, and the prompt appears the moment that problem is solved)",
                    "boosting or blocking a device",
                  ],
                },
                {
                  type: "paragraph",
                  text: "Released in Ireland only, in December 2022.",
                },
              ],
            },
            {
              id: "impact",
              label: "Impact",
              stat: {
                value: "~1.4 → ~3.8",
                label: "Ireland Android rating in about three months",
              },
              segments: [
                {
                  type: "paragraph",
                  text: "Within about three months, Ireland's Android rating went from ~1.4 to ~3.8. On iOS it went from ~2.65, the lowest market, to ~4.1, second only to the UK. No other market moved anywhere near as fast.",
                },
              ],
            },
          ],
          images: [
            {
              id: "rating",
              aspectRatio: "16/9",
              description:
                "Line chart of Ireland's iOS and Android store ratings over time (Ireland only).",
            },
          ],
        },
      },
      {
        id: "home-screen",
        number: "03",
        name: "Home screen",
        content: {
          kind: "story",
          heading: "The most-used feature, on the home screen",
          blocks: [
            {
              id: "problem",
              label: "Problem",
              segments: [
                {
                  type: "paragraph",
                  text: "Share Password was the app's most-used feature, but customers had to find it inside the app. And the team had been fixing bugs for a long time without shipping anything new.",
                },
              ],
            },
            {
              id: "hypothesis",
              label: "Hypothesis",
              segments: [
                {
                  type: "paragraph",
                  text: "A Wi-Fi QR code on the phone's home screen would remove the searching and typing: the host shows the screen, the guest scans it.",
                },
              ],
            },
            {
              id: "what-i-did",
              label: "What I did",
              highlight: true,
              segments: [
                {
                  type: "bold",
                  text: "My call: break the bug-fix cycle.",
                },
                {
                  type: "paragraph",
                  text: "I ran a one-week ideation session and we scored the ideas with ICE. It produced two widgets, for iOS and Android:",
                },
                {
                  type: "bullets",
                  items: [
                    "Share Password, with a QR code the guest scans to connect",
                    "A shortcut set of the most-used features, picked from analytics data",
                  ],
                },
              ],
            },
            {
              id: "impact",
              label: "Impact",
              segments: [
                {
                  type: "paragraph",
                  text: "In a Vodafone Group presentation, managers called it the first widget across Vodafone's mobile apps. It also earned positive feedback on both the App Store and Google Play.",
                },
              ],
            },
          ],
          imagesLayout: "side-by-side",
          images: [
            {
              id: "widget",
              aspectRatio: "4/3",
              description:
                "The widget with the Wi-Fi QR code on the phone's home screen (iOS and Android).",
            },
            {
              id: "review",
              aspectRatio: "4/3",
              description:
                "A store review with positive feedback about the widget.",
            },
          ],
        },
      },
      {
        id: "illustrations",
        number: "04",
        name: "Illustrations",
        content: {
          kind: "story",
          heading: "One illustration set instead of one per device",
          blocks: [
            {
              id: "problem",
              label: "Problem",
              segments: [
                {
                  type: "paragraph",
                  text: "The app supported over 10 devices, routers and extenders on sale today plus legacy ones, and every setup guide needed its own illustrations. Creating, updating and reviewing them was costing time and money.",
                },
              ],
            },
            {
              id: "hypothesis",
              label: "Hypothesis",
              segments: [
                {
                  type: "paragraph",
                  text: "If the device is named and a few questions confirm which one the customer has, a generic illustration is enough to guide setup, at a fraction of the effort.",
                },
              ],
            },
            {
              id: "what-i-did",
              label: "What I did",
              highlight: true,
              segments: [
                {
                  type: "bold",
                  text: "My call: generic illustrations, not one per device.",
                },
                {
                  type: "paragraph",
                  text: "I presented the idea to senior management and tested it with Vodafone customers on an interactive prototype.",
                },
                {
                  type: "paragraph",
                  text: "The device is shown by name, and a few questions match it to the one in the customer's contract. For each device we mark what matters, like where the power button is and what the lights mean, and pair it with the matching generic illustration.",
                },
                {
                  type: "bold",
                  text: "The trade-off: edge cases.",
                },
                {
                  type: "paragraph",
                  text: "A few remain. We judged that an acceptable risk, because those customers go to Vodafone's AI assistant first and to a live agent chat if it can't help.",
                },
              ],
            },
            {
              id: "impact",
              label: "Impact",
              stat: {
                value: "60",
                label: "illustrations cover the whole range",
              },
              segments: [
                {
                  type: "paragraph",
                  text: "60 illustrations cover the whole range. One set per device would have meant roughly ten times as many, impossible to manage. In the prototype test with 11 Vodafone customers, in two groups, 9 completed the onboarding without trouble. The two who struggled most likely felt the pressure of being tested, which is our reading. A new device now needs a key-points check, not new artwork.",
                },
              ],
            },
          ],
          images: [
            {
              id: "illustrations",
              aspectRatio: "16/9",
              description:
                "One generic illustration shown side by side with two different device names.",
            },
          ],
        },
      },
      {
        id: "ar-guide-concept",
        number: "05",
        name: "AR guide (concept)",
        content: {
          kind: "story",
          heading: "AR setup guide (concept)",
          blocks: [
            {
              id: "problem",
              label: "Problem",
              segments: [
                {
                  type: "paragraph",
                  text: "Analytics showed about 45% of customers dropping off at the cabling and service-setup step, one of the biggest drop-offs in the journey.",
                },
              ],
            },
            {
              id: "what-i-did",
              label: "What I did",
              segments: [
                {
                  type: "paragraph",
                  text: "I designed a video prototype of an augmented-reality guide. The customer points the camera at the cable and the sockets, the guide shows which socket each cable goes into, and when everything is connected, it tells them which button to press.",
                },
              ],
            },
            {
              id: "outcome",
              label: "Outcome",
              segments: [
                {
                  type: "paragraph",
                  text: "It stayed a concept, with no build and no data. But it showed the group a different vision for setup and sparked discussions about investing in innovation.",
                },
              ],
            },
          ],
          images: [
            {
              id: "ar",
              aspectRatio: "16/9",
              description:
                "Video prototype of the AR setup guide (the video will be added here).",
            },
          ],
        },
      },
      {
        id: "how-i-researched",
        number: "06",
        name: "How I researched",
        content: {
          kind: "research",
          heading: "Three questions I answered with users, not opinions.",
          backLabel: "← All studies",
          cards: [
            {
              id: "walkthrough-or-tooltips",
              title: "Walkthrough or tooltips?",
              body: 'Launch analytics showed 80% tapping "skip" on the walkthrough cards. In a click test, a five-step tooltip flow kept only 6 of 20 testers to the end, so we shipped three.',
              link: {
                label: "Read the study →",
                studyId: "walkthrough",
              },
            },
            {
              id: "which-icon-shares-wifi",
              title: "Which icon shares the Wi-Fi password?",
              body: "The three-dot icon scored a 5% success rate in a click test (20 responses). The OS share icon with an intro tooltip reached 30% on Android and 59% on iOS (20 and 22 responses).",
              link: {
                label: "Read the study →",
                studyId: "wifi-icon",
              },
            },
            {
              id: "how-to-name-unknown-devices",
              title: "How to name unknown devices?",
              body: "Two LinkedIn polls (64 and 98 votes) ranked which of the router's eight data points helps people recognise a device. The result shaped the logic flow we built with the developers.",
              link: {
                label: "Read the study →",
                studyId: "device-names",
              },
            },
          ],
          studies: [
            {
              id: "walkthrough",
              sidebarLabel: "Walkthrough or tooltips",
              title: "Walkthrough or tooltips?",
              blocks: [
                {
                  id: "question",
                  label: "Question",
                  body: 'Walkthrough cards were added upfront "to be safe". Launch analytics said otherwise: 80% tapped skip, 20% reached the second card, and nobody went past it. Two questions: do we need walkthroughs at all, and do users understand the dashboard tiles from their short titles?',
                },
                {
                  id: "what-i-tested",
                  label: "What I tested",
                  body: "Round 1: a click test on the dashboard tiles, six tasks, 10–11 responses each. Round 2: a five-step tooltip flow on the dashboard, tested in two launches (11 and 20 testers), ending with a task: find the iPhone and pause it for an hour.",
                },
                {
                  id: "result",
                  label: "Result",
                  body: "Task success on the tiles ranged from 36% to 73%: only we knew what they meant. Only 4 of 11 and 6 of 20 testers reached the end of the five-step flow. In the first launch 6 of 11 said they read all the tips, yet only 4 finished them.",
                },
                {
                  id: "what-shipped",
                  label: "What shipped",
                  body: "Tooltips instead of walkthrough cards, limited to three: network devices, guest Wi-Fi, broadband help.",
                },
              ],
              imageSlot: {
                id: "research-walkthrough",
                aspectRatio: "16/9",
                description:
                  "Five-step tooltip flow: where testers dropped out (two launches, n=11 and n=20)",
              },
            },
            {
              id: "wifi-icon",
              sidebarLabel: "Wi-Fi password icon",
              title: "Which icon shares the Wi-Fi password?",
              blocks: [
                {
                  id: "question",
                  label: "Question",
                  body: "My wife needed about 30 seconds to share our Wi-Fi password, and only with my help. How many users would spend more than 15 seconds finding a feature they know exists? A remote test with four friends backed up the doubt: none of them found the existing eye icon, which opens the password and a QR code.",
                },
                {
                  id: "what-i-tested",
                  label: "What I tested",
                  body: "The team voted for three dots on the Wi-Fi tile, so I click-tested it (20 responses). Then I surveyed a separate group of Vodafone customers on whether they recognise the Android and iOS share icons (24 and 19 responses). Finally two click tests on Android (20) and iOS (22): the OS share icon alone, and the OS share icon with an intro tooltip.",
                },
                {
                  id: "result",
                  label: "Result",
                  body: "Three dots: 5% success, users read them as a menu. Most customers recognised the share icon (96% on Android, 89% on iOS), yet the icon alone scored 0% on Android and 5% on iOS. With the intro tooltip it reached 30% on Android and 59% on iOS.",
                },
                {
                  id: "what-shipped",
                  label: "What shipped",
                  body: "First the eye icon was replaced with the OS share icon. When users still missed it, we added an intro tooltip. Both shipped. Share Password became the most used feature in the app, and the home-screen widget idea came out of this research.",
                },
              ],
              imageSlot: {
                id: "research-wifi-icon",
                aspectRatio: "16/9",
                description:
                  "The four versions and their click-test success: eye icon, three dots, share icon, share icon with tooltip",
              },
            },
            {
              id: "device-names",
              sidebarLabel: "Unknown device names",
              title: "How to name unknown devices?",
              blocks: [
                {
                  id: "question",
                  label: "Question",
                  body: 'Customers couldn\'t find the devices they had just added. One interview showed why: some devices arrived with empty or mismatching fingerprints, so the list showed names like "Unknown-a2:a5:96:7e:c8:7f". The router API returned eight attributes per device, and showing all eight would overload the list. Which ones help someone recognise a device?',
                },
                {
                  id: "what-i-tested",
                  label: "What I tested",
                  body: "Two LinkedIn polls (64 and 98 votes), because LinkedIn allows only four options per poll. Then a second round: the old list and the new design side by side in a LinkedIn post, with a real task: you have 20 devices on your router and only remember the device type, which design helps you find it?",
                },
                {
                  id: "result",
                  label: "Result",
                  body: "Across both polls, model (63%) and brand (32%) ranked highest, as we expected. Device type (29%) and visual clue (21%) came next; OS version (4%) ranked lowest. The new design, grouped by device type, received the most appreciation, and the comments went into the final version.",
                },
                {
                  id: "what-shipped",
                  label: "What shipped",
                  body: "A logic flow built with the developers over at least two meetings and FigJam sessions. It decides which attributes appear per device, so the list never overloads. The redesigned device list went live and got plenty of positive feedback.",
                },
              ],
              imageSlot: {
                id: "research-device-names",
                aspectRatio: "16/9",
                description:
                  "LinkedIn poll results and the device-name logic flow",
              },
            },
          ],
        },
      },
    ],
  },
  metro: {
    title: "METRO",
    subtitle: "Wholesale shopping app · iOS & Android",
    footerNote:
      "Senior UX/UI Designer on METRO's mobile app team for two and a half years.",
    menu: [
      { id: "overview", number: "01", label: "Overview" },
      { id: "humour", number: "02", label: "Humour" },
      { id: "paperless", number: "03", label: "Paperless" },
      {
        id: "how-we-worked",
        number: "04",
        label: "How we worked",
        childrenOnlyWhenActive: true,
        children: [
          { id: "design-sprint", label: "Design sprint" },
          { id: "guerrilla-testing", label: "Guerrilla testing" },
        ],
      },
    ],
    sections: [
      {
        id: "overview",
        number: "01",
        name: "Overview",
        content: {
          kind: "overview",
          heading: "A wholesale app that worked well but felt monotone.",
          subline:
            "Daily shopping companion app for METRO, an international wholesale company",
          meta: [
            {
              label: "Context",
              value: "Built from scratch · first version live in 6 months",
            },
            {
              label: "Role",
              value: "Senior UX/UI Designer · 2.5 years",
            },
            {
              label: "Tools",
              value:
                "Sketch · Overflow · Zeplin · Adobe Photoshop · Adobe Illustrator · Framer",
            },
          ],
          hero: {
            id: "hero",
            aspectRatio: "2/1",
            description:
              "Hero visual: two big UEQ numbers side by side, Stimulation 1.25 (Above Average) and Novelty −0.13 (Bad).",
          },
          body: {
            text: "I spent two and a half years as Senior UX/UI Designer on METRO's mobile app team. Two stories follow, then how we worked.",
          },
          chips: [
            { label: "UEQ Novelty −0.13 → 1.17", tone: "outline" },
            { label: "Built from scratch", tone: "fill" },
            { label: "First version live in 6 months", tone: "fill" },
            { label: "iOS & Android", tone: "fill" },
          ],
        },
      },
      {
        id: "humour",
        number: "02",
        name: "Humour",
        content: {
          kind: "story",
          heading: "Giving a wholesale app a sense of humour.",
          blocks: [
            {
              id: "problem",
              label: "Problem",
              segments: [
                {
                  type: "paragraph",
                  text: 'In continuous user interviews and usability sessions, participants filled in the UEQ questionnaire. They saw the app as a classic, monotonous enterprise UI, and the scores agreed: Novelty was −0.13, rated "Bad", in the worst 25% of benchmark results.',
                },
              ],
            },
            {
              id: "hypothesis",
              label: "Hypothesis",
              segments: [
                {
                  type: "paragraph",
                  text: "The gap was in feeling, not usability: the practical scales were already good to excellent. A little humour in the moments of waiting and emptiness would lift Novelty and Stimulation without touching functionality.",
                },
              ],
            },
            {
              id: "what-i-did",
              label: "What I did",
              highlight: true,
              segments: [
                {
                  type: "bold",
                  text: "My call: humour only where the app waits or has nothing to show.",
                },
                {
                  type: "paragraph",
                  text: " Lottie preloader animations when loading takes more than 3 seconds, and animated empty states, such as no search results or no promotions. Twelve METRO customers, in two cohorts of six, tested them. The results were positive, so we shipped them.",
                },
              ],
            },
            {
              id: "impact",
              label: "Impact",
              stat: {
                value: "−0.13 → 1.17",
                label: "UEQ Novelty after the animations",
              },
              segments: [
                {
                  type: "paragraph",
                  text: 'In the next UEQ round, which included the animations, Novelty rose from −0.13 ("Bad") to 1.17 ("Above Average") and Stimulation from 1.25 to 1.42, while the practical scales stayed high. In conversations with users, it was the change they liked most: people smiled and gave the most positive feedback.',
                },
              ],
            },
          ],
          images: [
            {
              id: "novelty",
              aspectRatio: "4/3",
              description:
                "Novelty before and after as simple bars: −0.13 to 1.17.",
            },
            {
              id: "animations",
              aspectRatio: "4/3",
              description:
                "Loader and empty-state animations (the existing GIFs).",
            },
          ],
          imagesLayout: "side-by-side",
        },
      },
      {
        id: "paperless",
        number: "03",
        name: "Paperless",
        content: {
          kind: "story",
          heading: "From paper leaflets to the app.",
          blocks: [
            {
              id: "problem",
              label: "Problem",
              segments: [
                {
                  type: "paragraph",
                  text: 'After COVID hit sales, METRO asked every department for ways to cut costs. Our app team\'s idea: print fewer leaflets. Our quick win was a "paperless" toggle on the promotions page, but customers overlooked it, so the leaflets kept coming.',
                },
              ],
            },
            {
              id: "hypothesis",
              label: "Hypothesis",
              segments: [
                {
                  type: "paragraph",
                  text: 'People ignore a plain switch, but respond to something they care about. Most people respect nature, so a tree could turn "stop the paper" into a small act worth doing.',
                },
              ],
            },
            {
              id: "what-i-did",
              label: "What I did",
              highlight: true,
              segments: [
                {
                  type: "bold",
                  text: "My call: use an emotional trigger instead of a plain toggle.",
                },
                {
                  type: "paragraph",
                  text: ' I researched e-invoices and paperless living, then designed a "save the trees" tree metaphor with animation to draw attention to the switch. I tested both versions across several rounds of user and guerrilla tests.',
                },
              ],
            },
            {
              id: "impact",
              label: "Impact",
              segments: [
                {
                  type: "paragraph",
                  text: "Across those tests, far more people switched to paperless with the tree version than with the plain toggle. I left METRO after it shipped, so I have no production data. The goal: fewer leaflets to print and mail, for METRO and for the environment.",
                },
              ],
            },
          ],
          images: [
            {
              id: "paperless",
              aspectRatio: "16/9",
              description:
                "The same promotions screen: plain toggle and the tree animation side by side.",
            },
          ],
        },
      },
      {
        id: "how-we-worked",
        number: "04",
        name: "How we worked",
        content: {
          kind: "research",
          heading: "Research ran through the whole project.",
          subline:
            "Every usability session ended with the UEQ questionnaire and a five-minute conversation.",
          backLabel: "← All studies",
          cards: [
            {
              id: "persona",
              title: "Persona",
              body: "METRO had no mobile-commerce persona. We started with the people who know the customers best: store staff, who told us who walks in and how they shop. From that we built a proto persona and validated it step by step through shadowing, in-depth interviews and usability sessions.",
            },
            {
              id: "design-sprint",
              title: "Design sprint",
              body: "Four days inside a METRO store in Italy, with an international team, on the gap between sales staff and bulk buyers. Six customers tested the prototype. It never shipped, but it taught us that customers wanted to reach staff on WhatsApp and were reluctant to leave their paper lists.",
              link: {
                label: "Read the study →",
                studyId: "design-sprint",
              },
            },
            {
              id: "guerrilla-testing",
              title: "Guerrilla testing",
              body: "No budget for formal tests, so I took a high-fidelity prototype of the new category menu to people where they were: METRO's canteen of about 200 people, and nearby markets and restaurants, with their staff. In one round, 7 of 11 found the right category, 4 struggled, and we refined the drill-down after another round.",
              link: {
                label: "Read the study →",
                studyId: "guerrilla-testing",
              },
            },
          ],
          studies: [
            {
              id: "design-sprint",
              sidebarLabel: "Design sprint",
              title: "Design sprint",
              blocks: [
                {
                  id: "question",
                  label: "Question",
                  body: "Sales staff and bulk buyers in METRO's Italian stores weren't communicating. On day one we mapped the customer journey with the sales representatives: bulk buyers wanted to ask about product availability, amounts and alternatives, and the worst moment was not finding a product from their shopping list on the shelf.",
                },
                {
                  id: "what-i-tested",
                  label: "What I tested",
                  body: "A four-day design sprint inside a METRO store in Italy, with an international team: map, sketch and decide, prototype, test. The prototype was a grocery-list feature. When an item on the list is unavailable, the app notifies the customer and shows alternative products, and if they decline, it offers a direct line to a salesperson. On day four, six customers matching our persona tested it.",
                },
                {
                  id: "result",
                  label: "Result",
                  body: "The usability tests went well. The interviews afterwards did not: customers just asked to reach staff on WhatsApp, and they refused to move from paper lists to digital ones.",
                },
                {
                  id: "what-came-of-it",
                  label: "What came of it",
                  body: "It never shipped. It left one lesson: talk to the target audience before testing, or you end up designing for yourself.",
                },
              ],
              imageSlot: {
                id: "research-sprint",
                aspectRatio: "16/9",
                description:
                  "Design sprint photos: the journey map session, the sticky-note wall and the solution sketches",
              },
            },
            {
              id: "guerrilla-testing",
              sidebarLabel: "Guerrilla testing",
              title: "Guerrilla testing",
              blocks: [
                {
                  id: "question",
                  label: "Question",
                  body: "No budget for formal usability tests, but the new menu still had to be tested. The filters were designed as chips below the navigation bar. Two questions: do users recognise the chips, and how do they drill down the menu items?",
                },
                {
                  id: "what-i-tested",
                  label: "What I tested",
                  body: 'A high-fidelity prototype of the new category menu, in guerrilla tests with 11 participants. The task: "Please list the various types of Wurst & Schinken products."',
                },
                {
                  id: "result",
                  label: "Result",
                  body: "9 of 11 preferred the search bar to list the products. 7 of 11 found the right category quickly. The other 4 struggled.",
                },
                {
                  id: "what-came-of-it",
                  label: "What came of it",
                  body: "After another round of testing, I refined the category drill-down and finalised the process in one sprint.",
                },
              ],
              imageSlot: {
                id: "research-guerrilla",
                aspectRatio: "16/9",
                description:
                  "Guerrilla testing: the chips prototype and the test sessions",
              },
            },
          ],
          images: [
            {
              id: "sprint",
              aspectRatio: "4/3",
              description:
                "Two to three photos from the design sprint in the METRO store in Italy.",
            },
            {
              id: "home-versions",
              aspectRatio: "4/3",
              description: "Three versions of the home screen.",
            },
          ],
          imagesLayout: "side-by-side",
        },
      },
    ],
  },
  sahibinden: {
    title: "sahibinden.com",
    subtitle: "Classifieds apps · iOS, Android & Apple Watch",
    footerNote:
      "Senior UX/UI Designer at sahibinden.com for four years.",
    menu: [
      { id: "overview", number: "01", label: "Overview" },
      { id: "voice-to-text", number: "02", label: "Voice-to-text" },
      { id: "post-button", number: "03", label: "Post button" },
      { id: "how-i-researched", number: "04", label: "How I researched" },
    ],
    sections: [
      {
        id: "overview",
        number: "01",
        name: "Overview",
        content: {
          kind: "overview",
          heading:
            "Native iOS, Android and Apple Watch apps for Turkey's largest classifieds platform.",
          meta: [
            {
              label: "Context",
              value: "iOS · Android · Apple Watch · 50M+ downloads on Google Play",
            },
            {
              label: "Role",
              value: "Senior UX/UI Designer · 4 years",
            },
          ],
          hero: {
            id: "hero",
            aspectRatio: "2/1",
            description:
              "Hero visual: 3 to 4 main screens of the app, iOS and Android side by side.",
          },
          body: {
            text: "I spent four years as Senior UX/UI Designer at sahibinden.com, hired in late 2013 to design its Android and iOS apps. I also built the design library for both platforms and designed the Apple Watch app. Two stories follow, then how I researched.",
          },
          chips: [
            { label: "+40% in all mobile ad postings", tone: "outline" },
            { label: "50M+ downloads on Google Play", tone: "fill" },
            { label: "4 years", tone: "fill" },
            { label: "iOS · Android · Apple Watch", tone: "fill" },
          ],
        },
      },
      {
        id: "voice-to-text",
        number: "02",
        name: "Voice-to-text",
        content: {
          kind: "story",
          heading: "Letting real estate agents speak their ads",
          blocks: [
            {
              id: "problem",
              label: "Problem",
              segments: [
                {
                  type: "paragraph",
                  text: "After the ad-posting feature launched, analytics showed that mobile ads from real estate agents, our most profitable segment, were low.",
                },
              ],
            },
            {
              id: "hypothesis",
              label: "Hypothesis",
              segments: [
                {
                  type: "paragraph",
                  text: "Something in the mobile flow made posting hard for real estate agents. Fixing it would bring their ads to mobile.",
                },
              ],
            },
            {
              id: "what-i-did",
              label: "What I did",
              highlight: true,
              segments: [
                {
                  type: "bold",
                  text: "My call: let agents speak their descriptions instead of typing them.",
                },
                {
                  type: "paragraph",
                  text: " Real estate agents told us in their feedback that posting an ad from mobile was hard, because they usually write very long descriptions. After a brainstorm, we added voice-to-text with a microphone icon for descriptions.",
                },
              ],
            },
            {
              id: "impact",
              label: "Impact",
              stat: {
                value: "+40%",
                label: "all mobile ad postings, after voice-to-text",
              },
              segments: [
                {
                  type: "paragraph",
                  text: "After voice-to-text shipped, our analytics team reported a 40% rise in all mobile ad postings. Within two years, mobile passed web as the main way to post ads, and the product went mobile-first.",
                },
              ],
            },
          ],
          images: [
            {
              id: "voice",
              aspectRatio: "16/9",
              description:
                "The microphone icon in the ad description field, as speech turns into text.",
            },
          ],
        },
      },
      {
        id: "post-button",
        number: "03",
        name: "Post button",
        content: {
          kind: "story",
          heading: 'Putting "post an ad" at the centre',
          blocks: [
            {
              id: "problem",
              label: "Problem",
              segments: [
                {
                  type: "paragraph",
                  text: "Posting ads is how sahibinden.com earns money, yet as an ordinary tab button it went unnoticed.",
                },
              ],
            },
            {
              id: "hypothesis",
              label: "Hypothesis",
              segments: [
                {
                  type: "paragraph",
                  text: "A button that stands out in the middle of the tab bar would get noticed and used.",
                },
              ],
            },
            {
              id: "what-i-did",
              label: "What I did",
              highlight: true,
              segments: [
                {
                  type: "bold",
                  text: 'My call: put "post an ad" in the centre of the tab bar, as a highlighted button.',
                },
                {
                  type: "paragraph",
                  text: " The pattern was rare then; I had read about it in a UX case study. We put it live and compared ad postings with the period before.",
                },
              ],
            },
            {
              id: "impact",
              label: "Impact",
              segments: [
                {
                  type: "paragraph",
                  text: "Ad postings rose compared with before. Years later, the button is still in the tab bar of an app with 50M+ downloads on Google Play.",
                },
              ],
            },
          ],
          images: [
            {
              id: "post-button",
              aspectRatio: "16/9",
              description:
                'The highlighted "post an ad" button in the centre of the tab bar (screenshot from the app).',
            },
          ],
        },
      },
      {
        id: "how-i-researched",
        number: "04",
        name: "How I researched",
        content: {
          kind: "research",
          heading: "Research ran through the four years.",
          cards: [
            {
              id: "user-interviews",
              title: "User interviews",
              body: "50+ over three years, plus one focus group.",
            },
            {
              id: "user-tests",
              title: "User tests",
              body: "We tested our changes and the requests users brought us.",
            },
            {
              id: "guerrilla-testing",
              title: "Guerrilla testing",
              body: "In the shared canteen of our office plaza, with people from other companies and roles, we tested parts of the app at random.",
            },
          ],
        },
      },
    ],
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}
