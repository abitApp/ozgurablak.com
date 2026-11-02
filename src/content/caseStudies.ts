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
  /** Optional short label above the slot (e.g. Before / After). */
  caption?: string;
  /** Skip Next image optimizer — text-heavy specs stay sharp. */
  unoptimized?: boolean;
  /** Default cover; contain for full-frame documents / phone demos; fill stretches. */
  objectFit?: "cover" | "contain" | "fill";
  /** Frame border + radius. Default true; false when the asset has its own curves. */
  framed?: boolean;
  /** Frame outline colour. Default site ink border; white for light chrome. */
  frameBorder?: "default" | "white";
  /** Override frame corner radius (e.g. "rounded-[1.1rem]"). */
  roundedClassName?: string;
  /** Frame fill when framed. Default dark; white = light card matching story boxes. */
  frameFill?: "dark" | "white";
  /** Optional solid frame background (e.g. brand yellow "#fee800"). */
  frameColor?: string;
  /**
   * Optional width utility. With `frameFill: "white"`, applies to the media
   * inside the full-width white card (e.g. "mx-auto w-[60%]").
   */
  widthClassName?: string;
  /** Extra classes on the media element (e.g. "scale-90 origin-center"). */
  mediaClassName?: string;
  /** Soft ambient ellipse under the media (white-frame stills). */
  ambientShadow?: boolean;
  /** Force full row width in a side-by-side image grid. */
  fullWidth?: boolean;
  /** Extra classes on the outer wrapper around this slot (e.g. "my-[24px]"). */
  wrapperClassName?: string;
  /** Story body: render this slot after the block with this id (else below all). */
  afterBlockId?: string;
  /** When set, renders a Vimeo embed instead of a still image. */
  vimeoSrc?: string;
  /** Intrinsic Vimeo pixel aspect (e.g. "1544/1160") for object-fit: cover math. */
  vimeoAspectRatio?: string;
  /** Wrap the still in an Android handset chrome (overview phone demos). */
  phoneFrame?: "android";
  /** Handset chrome colour when `phoneFrame` is set. Default dark. */
  phoneFrameTone?: "dark" | "white";
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
  /** Single hero. Ignored when `heroImages` is set. */
  hero?: CaseStudyImageSlot;
  /** Multi-screen hero strip (e.g. phone row). */
  heroImages?: CaseStudyImageSlot[];
  /** Default stack. Side-by-side on sm+. */
  heroImagesLayout?: "stack" | "side-by-side";
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
  /** Optional App Store / Google Play download buttons under the body. */
  storeLinks?: {
    appStore?: string;
    googlePlay?: string;
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
  /** Optional image inside the card, right of the text on sm+. */
  image?: CaseStudyImageSlot;
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
  /** Images below all blocks, or after a block when `afterBlockId` is set. */
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
  /** Comparison screens (e.g. Before / After). */
  images: CaseStudyImageSlot[];
  /** Default stack. Side-by-side rows on sm+. */
  imagesLayout?: "stack" | "side-by-side";
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
  /** Optional media rendered directly under this decision card. */
  image?: CaseStudyImageSlot;
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
  /** Optional muted line under the heading (e.g. years). */
  subline?: string;
  body: string;
  /** Optional App Store / Google Play download buttons under the body. */
  storeLinks?: {
    appStore?: string;
    googlePlay?: string;
  };
  images: CaseStudyImageSlot[];
  /** Default stack. Side-by-side rows on sm+. */
  imagesLayout?: "stack" | "side-by-side";
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

export type CaseStudyResearchStudyInlineImage = {
  /** Insert the image after this block id. */
  afterBlockId: string;
  slot: CaseStudyImageSlot;
};

export type CaseStudyResearchStudy = {
  id: string;
  sidebarLabel: string;
  title: string;
  blocks: CaseStudyResearchStudyBlock[];
  /** Default image at the end of the study (or under `imageAfterBlockId`). */
  imageSlot?: CaseStudyImageSlot;
  /** When set with `imageSlot`, image renders under this block. */
  imageAfterBlockId?: string;
  /** Extra images inserted after specific blocks (e.g. above Result). */
  inlineImages?: CaseStudyResearchStudyInlineImage[];
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
  /** Images below the cards on the overview (or after `imagesAfterCardId`). */
  images?: CaseStudyImageSlot[];
  /** When set, overview images render after this card instead of below all. */
  imagesAfterCardId?: string;
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
            aspectRatio: "970/1024",
            description:
              "Design system overview: Phoenix Colors, Spacing and Typography cards from the Vodafone design system.",
            src: "/media/projects/design-system/overview-specs-v6.png",
            alt: "Vodafone design system overview showing Phoenix Colors, Spacing, and Typography specification cards.",
            unoptimized: true,
            objectFit: "contain",
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
          images: [],
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
              image: {
                id: "variables-demo",
                aspectRatio: "4/3",
                description:
                  "Figma Variables demo: alert components switching between dark and light modes as the group is dragged across a theme boundary.",
                src: "/media/projects/design-system/variables-demo-v1.mp4?v=1",
                alt: "Figma Variables demo showing alert cards adapting from dark mode to light mode.",
              },
            },
          ],
          imageAfterBlockId: "flows-that-branch",
          image: {
            id: "flow",
            aspectRatio: "840/513",
            description:
              "One single user flow that branches depending on the extender: add an extender and the whole journey changes.",
            alt: "Vodafone design system branching user flow video.",
            vimeoSrc: "https://player.vimeo.com/video/1010171567",
            vimeoAspectRatio: "1544/1160",
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
          imagesLayout: "side-by-side",
          images: [
            {
              id: "result-before",
              caption: "Before",
              aspectRatio: "576/1024",
              src: "/media/projects/design-system/problem-before-v2.png",
              alt: "Live app dashboard before the design system — Home router status with Main and Guest Wi-Fi cards.",
              description:
                "Live app dashboard (before): Home router status with Main and Guest Wi-Fi cards.",
              objectFit: "contain",
            },
            {
              id: "result-after",
              caption: "After",
              aspectRatio: "372/1024",
              src: "/media/projects/design-system/problem-after-v3.png",
              alt: "Redesigned Home dashboard after the design system — Main Wi-Fi, Guest Wi-Fi, SuperWiFi and connected devices.",
              description:
                "Design-system Home dashboard (after): Main Wi-Fi, Guest Wi-Fi, SuperWiFi and connected devices.",
              objectFit: "contain",
            },
          ],
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
          heroImagesLayout: "side-by-side",
          heroImages: [
            {
              id: "overview-home",
              aspectRatio: "372/1024",
              src: "/media/projects/vodafone-app/overview-home-v1.png",
              alt: "Vodafone router app Home dashboard with Main Wi-Fi, Guest Wi-Fi and network cards.",
              description: "Home dashboard with Main Wi-Fi, Guest Wi-Fi and network cards.",
              objectFit: "contain",
            },
            {
              id: "overview-device",
              aspectRatio: "460/1024",
              src: "/media/projects/vodafone-app/overview-device-v1.png",
              alt: "Device detail for TV Samsung with Boost and Blocked actions.",
              description: "Device detail for TV Samsung with Boost and Blocked actions.",
              objectFit: "contain",
            },
            {
              id: "overview-contacts",
              aspectRatio: "460/1024",
              src: "/media/projects/vodafone-app/overview-contacts-v1.png",
              alt: "Phone contacts screen with favourites and alphabetical list.",
              description: "Phone contacts screen with favourites and alphabetical list.",
              objectFit: "contain",
            },
          ],
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
              aspectRatio: "1024/579",
              src: "/media/projects/vodafone-app/rating-android-chart-v1.png",
              alt: "Weekly Activities chart: Phoenix Android app ratings by market, highlighting Ireland rising from about 1.4 toward 3.8.",
              description:
                "Line chart of Android store ratings by market over time, with Ireland rising from ~1.4 toward ~3.8.",
              objectFit: "contain",
              unoptimized: true,
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
              aspectRatio: "482/1024",
              src: "/media/projects/vodafone-app/home-widget-android-v1.jpg",
              alt: "Android home screen showing Phoenix widgets for Wi-Fi, Guest, Devices and Speed.",
              description:
                "Android home screen: Phoenix widgets for Wi-Fi, Guest, Devices and Speed.",
              objectFit: "cover",
              framed: false,
            },
            {
              id: "widget-video",
              // Match the sibling still so side-by-side columns share one height.
              aspectRatio: "482/1024",
              description:
                "Widget demo video: Wi-Fi QR code share on the phone home screen.",
              alt: "Vodafone Share Password widget demo on a phone home screen.",
              vimeoSrc: "https://player.vimeo.com/video/1048316890",
              vimeoAspectRatio: "360/694",
              objectFit: "cover",
              framed: false,
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
              aspectRatio: "1024/532",
              src: "/media/projects/vodafone-app/illustrations-set-v4.png",
              alt: "Grid of generic setup illustrations covering routers and extenders across the product range.",
              description:
                "The shared illustration set: one family of diagrams covering the whole device range.",
              objectFit: "fill",
              unoptimized: true,
              afterBlockId: "what-i-did",
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
              description: "Video prototype of the AR setup guide.",
              alt: "AR setup guide concept: pointing the camera at cables and sockets for guided installation.",
              vimeoSrc: "https://player.vimeo.com/video/1081762823",
              vimeoAspectRatio: "16/9",
              objectFit: "cover",
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
                  body: "Round 1: a click test on the dashboard tiles, six tasks, 10–11 responses each. Round 2: a five-step tooltip flow on the dashboard, tested in two launches (11 and 20 testers).",
                },
                {
                  id: "result",
                  label: "Result",
                  body: "Task success on the tiles ranged from 36% to 73%: the tile names made sense mostly to us. In the first launch, 5 of 11 testers dismissed the tour on the first screen. Only 4 of 11 and 6 of 20 reached the end of the five steps, although in the first launch 6 of 11 said they had read all the tips.",
                },
                {
                  id: "what-shipped",
                  label: "What shipped",
                  body: "Tooltips instead of walkthrough cards, cut from five to three.",
                },
              ],
              inlineImages: [
                {
                  afterBlockId: "result",
                  slot: {
                    id: "research-walkthrough-dropout",
                    aspectRatio: "1024/576",
                    src: "/media/projects/vodafone-app/walkthrough-dropout-v1.jpg",
                    alt: "First help-tip screen click maps from two launches: many users chose Not now or dismissed straight away.",
                    description:
                      "1st screen presented: drop-out on help tips across two launches (n=11 and n=20).",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
                {
                  afterBlockId: "result",
                  slot: {
                    id: "research-walkthrough-reading",
                    aspectRatio: "1024/576",
                    src: "/media/projects/vodafone-app/walkthrough-reading-v2.jpg",
                    alt: "Survey comparison: how much of the help tips testers read in the 1st launch (n=11) and 2nd launch (n=20).",
                    description:
                      "Survey: how much of the tips testers read (11 and 20 responses)",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
                {
                  afterBlockId: "what-shipped",
                  slot: {
                    id: "research-walkthrough-feature-tooltip",
                    aspectRatio: "720/1600",
                    src: "/media/projects/vodafone-app/walkthrough-feature-tooltip-v1.mp4",
                    alt: "Shipped feature tooltip on the Home Router dashboard.",
                    description: "Shipped feature tooltip demo.",
                    objectFit: "cover",
                    framed: false,
                    widthClassName: "mx-auto w-[90%]",
                  },
                },
                {
                  afterBlockId: "what-shipped",
                  slot: {
                    id: "research-walkthrough-tooltip",
                    aspectRatio: "720/1600",
                    src: "/media/projects/vodafone-app/walkthrough-tooltip-v1.mp4",
                    alt: "Shipped tooltip on the Home Router dashboard.",
                    description: "Shipped dashboard tooltip demo.",
                    objectFit: "cover",
                    framed: false,
                    widthClassName: "mx-auto w-[90%]",
                  },
                },
              ],
            },
            {
              id: "wifi-icon",
              sidebarLabel: "Wi-Fi password icon",
              title: "Which icon shares the Wi-Fi password?",
              blocks: [
                {
                  id: "question",
                  label: "Question",
                  body: "My wife needed about 30 seconds to share our Wi-Fi password, and only with my help. How many users would spend more than 15 seconds finding a feature they know exists? A guerrilla test with four people who had never used the app backed up the doubt: none of them found the existing eye icon, which opens the password and a QR code.",
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
                  body: "First the eye icon was replaced with the OS share icon. When users still missed it, we added an intro tooltip. Both shipped. Share Password was the app's most used feature, and the home-screen widget idea came out of this research.",
                },
              ],
              inlineImages: [
                {
                  afterBlockId: "what-i-tested",
                  slot: {
                    id: "research-wifi-icon-threedots",
                    aspectRatio: "1024/576",
                    src: "/media/projects/vodafone-app/wifi-icon-clicktest-threedots-v2.jpg",
                    alt: "Task – Click Test: Wi-Fi tile heatmap with 20 responses, 24s median, 5% success.",
                    description:
                      "Click test on the Wi-Fi control: heatmap and 5% success.",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
                {
                  afterBlockId: "result",
                  slot: {
                    id: "research-wifi-icon-task1",
                    aspectRatio: "1024/576",
                    src: "/media/projects/vodafone-app/wifi-icon-task1-v1.jpg",
                    alt: "Task -1 Android and iOS: share icon alone click test — Android 0% (n=20) and iOS 5% (n=22).",
                    description:
                      "Slide 20 — Task 1: share icon alone, Android 0% (n=20) and iOS 5% (n=22), with response count and time on task.",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
                {
                  afterBlockId: "result",
                  slot: {
                    id: "research-wifi-icon-task2",
                    aspectRatio: "1024/576",
                    src: "/media/projects/vodafone-app/wifi-icon-task2-v1.jpg",
                    alt: "Task -2 Android and iOS: share icon with intro tooltip — Android 30% (n=20) and iOS 59% (n=22).",
                    description:
                      "Slide 22 — Task 2: share icon with intro tooltip, Android 30% (n=20) and iOS 59% (n=22), with response count and time on task.",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
                {
                  afterBlockId: "what-shipped",
                  slot: {
                    id: "research-wifi-icon-shipped",
                    aspectRatio: "1024/574",
                    src: "/media/projects/vodafone-app/wifi-icon-shipped-v1.png",
                    alt: "Current vs Proposed: eye icon flow replaced by OS share icon with intro tooltip and a merged Wi-Fi credentials screen.",
                    description:
                      "Slide 28 — Current vs Proposed: eye icon → OS share icon + intro tooltip, and the combined screen.",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
              ],
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
                  body: "Two LinkedIn polls (64 and 98 votes), because LinkedIn allows only four options per poll. Then a second round: the old list and the new design side by side in LinkedIn posts and a Slack channel, with a real task: you have 20 devices on your router and only remember the device type, which design helps you find it?",
                },
                {
                  id: "result",
                  label: "Result",
                  body: "In the first poll, model led (67%) and OS version came last (3%). In the second, brand led (33%), then device type (29%) and visual clue (21%). The options differed, so the polls can't be ranked against each other. The new design, grouped by device type, got 271 applause votes against 145 thumbs-up for the current list, and the comments went into the final version.",
                },
                {
                  id: "what-shipped",
                  label: "What shipped",
                  body: "A logic flow built with the developers over at least two meetings and FigJam sessions. It decides which attributes appear per device, so the list never overloads. The redesigned device list went live.",
                },
              ],
              inlineImages: [
                {
                  afterBlockId: "what-i-tested",
                  slot: {
                    id: "research-device-names-question",
                    aspectRatio: "1024/576",
                    src: "/media/projects/vodafone-app/device-names-question-v1.png",
                    alt: "The LinkedIn question asking which of two device-list designs helps find a device by type.",
                    description:
                      "The question I asked: which design helps you find a device easily?",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
                {
                  afterBlockId: "result",
                  slot: {
                    id: "research-device-names",
                    aspectRatio: "1024/518",
                    src: "/media/projects/vodafone-app/device-names-polls-v1.png",
                    alt: "Two LinkedIn polls on what helps people recognise a device: Poll A (64 votes) and Poll B (98 votes).",
                    description:
                      "LinkedIn poll results: what helps you recognise a device (64 and 98 votes).",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
                {
                  afterBlockId: "result",
                  slot: {
                    id: "research-device-names-votes",
                    aspectRatio: "1024/576",
                    src: "/media/projects/vodafone-app/device-names-votes-v1.png",
                    alt: "Design vote: 145 thumbs-up for the current list vs 271 applause for the new grouped design.",
                    description:
                      "Which design helps you find a device? 145 thumbs-up vs 271 applause.",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
                {
                  afterBlockId: "what-shipped",
                  slot: {
                    id: "research-device-names-final",
                    aspectRatio: "1024/576",
                    src: "/media/projects/vodafone-app/device-names-final-v1.png",
                    alt: "Final device list designs: groups expanded, groups collapsed, and edit device details.",
                    description:
                      "Final designs: the device list grouped by type.",
                    objectFit: "contain",
                    unoptimized: true,
                    framed: false,
                  },
                },
              ],
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
            aspectRatio: "819/572",
            src: "/media/projects/metro/overview-hero-v1.png",
            alt: "Whiteboard planning for a Shopping List feature: Bernardo persona sheet and a sticky-note roadmap.",
            description:
              "Shopping List planning board — persona, feature stickies, and release milestones.",
            objectFit: "cover",
            unoptimized: true,
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
              id: "ueq-before",
              aspectRatio: "1024/794",
              src: "/media/projects/metro/ueq-before-v1.jpg",
              alt: "UEQ benchmark results for M:Companion on 17 May 2019, with Stimulation and Novelty underlined — Novelty at −0.13, Bad.",
              description:
                "UEQ before the humour work: Novelty −0.13 (Bad), Stimulation 1.25 (Above Average).",
              objectFit: "cover",
              unoptimized: true,
              afterBlockId: "problem",
            },
            {
              id: "ueq-after",
              aspectRatio: "1024/794",
              src: "/media/projects/metro/ueq-after-v1.jpg",
              alt: "UEQ benchmark results after the humour work, with Stimulation 1.42 and Novelty 1.17 underlined.",
              description:
                "UEQ after the animations: Novelty 1.17 (Above Average), Stimulation 1.42 (Good).",
              objectFit: "cover",
              unoptimized: true,
              afterBlockId: "what-i-did",
            },
            {
              id: "animations",
              aspectRatio: "800/952",
              src: "/media/projects/metro/humour-animations-v1.mp4",
              alt: "METRO app humour animations — Lottie preloaders and empty-state loops.",
              description:
                "Loader and empty-state animations shipped after the humour tests.",
              objectFit: "cover",
              frameFill: "white",
              widthClassName: "mx-auto w-[60%] min-w-0",
            },
          ],
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
              id: "paperless-solutions",
              aspectRatio: "1024/710",
              src: "/media/projects/metro/paperless-solutions-v1.png",
              alt: "Two paperless solutions compared: plain toggle at 1% conversion versus the tree modal.",
              description:
                "Solution 1 plain toggle vs Solution 2 tree modal on the promotions screen.",
              objectFit: "cover",
              unoptimized: true,
              afterBlockId: "what-i-did",
            },
            {
              id: "paperless",
              // Vimeo oEmbed 362×240 (padding-top ≈ 66.35%)
              aspectRatio: "362/240",
              vimeoSrc: "https://player.vimeo.com/video/1242161586",
              vimeoAspectRatio: "362/240",
              alt: "Paperless promotions switch with the save-the-trees animation.",
              description:
                "The same promotions screen: plain toggle and the tree animation side by side.",
              objectFit: "cover",
              frameFill: "white",
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
            {
              id: "shadowing",
              title: "Shadowing",
              body: "We visited a METRO store in Düsseldorf on three days to watch how customers shop. We were planning to add a Shopping List feature, so we looked at how people write their lists on paper, how they walk the aisles, and how they find the products on them.",
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
              inlineImages: [
                {
                  afterBlockId: "what-came-of-it",
                  slot: {
                    id: "research-sprint",
                    aspectRatio: "1024/490",
                    src: "/media/projects/metro/design-sprint-v1.jpg",
                    alt: "Design sprint collage: METRO workshop table, wall sketches, remote usability screens, and a sticky-note wall.",
                    description:
                      "Design sprint photos: the workshop, sketches, remote tests and sticky-note wall.",
                    objectFit: "cover",
                    framed: false,
                  },
                },
              ],
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
              inlineImages: [
                {
                  afterBlockId: "what-came-of-it",
                  slot: {
                    id: "guerrilla-01",
                    aspectRatio: "4/3",
                    src: "/media/projects/metro/guerrilla-testing-01.jpg",
                    alt: "Guerrilla test in the METRO canteen: two people reviewing a prototype on a phone.",
                    description:
                      "Canteen guerrilla session — reviewing the category-menu prototype on a phone.",
                    objectFit: "cover",
                    framed: false,
                  },
                },
              ],
            },
          ],
          imagesAfterCardId: "persona",
          images: [
            {
              id: "sprint",
              aspectRatio: "4/3",
              src: "/media/projects/metro/guerrilla-testing-02.png",
              alt: "Guerrilla recruitment stand for M:Companion — team at a METRO lobby table with snack posters and a QR code.",
              description:
                "Lobby guerrilla stand — recruiting METRO colleagues to test M:Companion.",
              objectFit: "cover",
              framed: false,
            },
            {
              id: "home-versions",
              aspectRatio: "4/3",
              src: "/media/projects/metro/how-we-worked-02.jpg",
              alt: "Field research collage: shopping carts with clipboards, a METRO aisle, a printed pick list, and a handwritten shopping list.",
              description:
                "Store research — carts, aisle, and shopping lists from the METRO field work.",
              objectFit: "cover",
              framed: false,
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
      {
        id: "a-redesign-built-to-last",
        number: "02",
        label: "A redesign built to last",
      },
      { id: "voice-to-text", number: "03", label: "Voice-to-text" },
      { id: "post-button", number: "04", label: "Post button" },
      { id: "how-i-researched", number: "05", label: "How I researched" },
      { id: "award-winning-app", number: "06", label: "Award-winning app" },
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
            aspectRatio: "1024/802",
            src: "/media/projects/sahibinden/overview-cover.png",
            alt: "sahibinden.com app cover: rose-gold phone with yellow S icon screen, App Store and Google Play ratings.",
            description:
              "Hero visual: 3 to 4 main screens of the app, iOS and Android side by side.",
            objectFit: "contain",
            unoptimized: true,
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
        id: "a-redesign-built-to-last",
        number: "02",
        name: "A redesign built to last",
        content: {
          kind: "result",
          heading: "A redesign built to last",
          body: "When I first designed the sahibinden.com iOS and Android apps, we stayed close to the website's visual language. The site had been online since 2000 and had seen few visual updates. It looked dated, but it was already Turkey's largest classifieds platform, so familiarity mattered to its users.\n\nIn 2016, I redesigned the visual design of both apps. I kept the brand's signature colours and reworked nearly everything else: the homepage, the inner screens, the typography and the visual hierarchy. The splash screen I designed still appears in the brand's TV commercials.\n\nToday, most of that design is still recognisable in both apps. Apart from new features and small refinements, the core experience has stayed largely the same.",
          storeLinks: {
            appStore:
              "https://apps.apple.com/tr/app/sahibinden-alsatkiralakesfet/id418535251",
            googlePlay:
              "https://play.google.com/store/apps/details?id=com.sahibinden&hl=tr",
          },
          imagesLayout: "side-by-side",
          images: [
            {
              id: "redesign-splash-tv",
              aspectRatio: "575/1024",
              src: "/media/projects/sahibinden/redesign-splash.png",
              alt: "sahibinden.com yellow splash screen — black icon mosaic forming the letter S.",
              description: "Splash screen in a TV commercial",
              objectFit: "contain",
              unoptimized: true,
              frameFill: "white",
              frameColor: "#fee800",
              roundedClassName: "rounded-[1.1rem]",
              widthClassName: "mx-auto w-[min(100%,15.5rem)]",
              mediaClassName:
                "scale-90 origin-center rounded-[1.1rem]",
              ambientShadow: true,
            },
            {
              id: "redesign-apple-watch",
              // Match splash white-card box; keep the watch itself smaller inside.
              aspectRatio: "575/1024",
              src: "/media/projects/sahibinden/redesign-apple-watch.png",
              alt: "sahibinden.com Apple Watch app — İlan Mesajları, GeT Mesajları and Bilgilendirmeler.",
              description: "Apple Watch app home with message and notification shortcuts.",
              objectFit: "contain",
              unoptimized: true,
              frameFill: "white",
              roundedClassName: "rounded-[1.1rem]",
              widthClassName: "mx-auto w-[min(100%,15.5rem)]",
              mediaClassName:
                "scale-[0.72] origin-center rounded-[1.1rem]",
              ambientShadow: true,
            },
            {
              id: "redesign-screens",
              aspectRatio: "1024/466",
              src: "/media/projects/sahibinden/redesign-screens.png",
              alt: "sahibinden.com redesign — search, home, listing detail and map screens on iOS and Android.",
              description:
                "Redesigned app screens on iOS and Android side by side.",
              objectFit: "cover",
              unoptimized: true,
              roundedClassName: "rounded-[1.1rem]",
              widthClassName: "w-full",
              fullWidth: true,
            },
            {
              id: "redesign-apple-watch-flow",
              aspectRatio: "1400/289",
              src: "/media/projects/sahibinden/redesign-apple-watch-flow.gif",
              alt: "sahibinden.com Apple Watch flow — splash, notifications, quick replies and voice message.",
              description:
                "Animated Apple Watch screens: splash, notifications, quick reply and voice.",
              objectFit: "cover",
              unoptimized: true,
              widthClassName: "w-full",
              fullWidth: true,
              // Card chrome on the wrapper; 24px pad above/below the GIF inside.
              framed: false,
              roundedClassName: "rounded-[1.1rem]",
              wrapperClassName:
                "overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-white py-[24px]",
            },
          ],
        },
      },
      {
        id: "voice-to-text",
        number: "03",
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
              aspectRatio: "500/1006",
              src: "/media/projects/sahibinden/voice-to-text.png",
              alt: "sahibinden.com ad posting form with microphone icons for voice-to-text on title and description fields.",
              description:
                "The microphone icon in the ad description field, as speech turns into text.",
              objectFit: "contain",
              unoptimized: true,
              frameFill: "white",
              roundedClassName: "rounded-[1.1rem]",
              // Cap near half of native 500px so Retina stays sharp.
              widthClassName: "mx-auto w-[min(100%,15.5rem)]",
              // Keep white card size; phone another 10% smaller (was scale-90).
              mediaClassName: "scale-[0.81] origin-center",
              ambientShadow: true,
            },
          ],
        },
      },
      {
        id: "post-button",
        number: "04",
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
              aspectRatio: "612/1024",
              src: "/media/projects/sahibinden/post-button.png",
              alt: 'sahibinden.com tab bar with the highlighted blue "İlan Ver" post button in the centre.',
              description:
                'The highlighted "post an ad" button in the centre of the tab bar (screenshot from the app).',
              objectFit: "contain",
              unoptimized: true,
              frameFill: "white",
              roundedClassName: "rounded-[1.1rem]",
              // Full-width white card; phone at 80% of CleanShot 1× (306×0.8).
              widthClassName: "mx-auto w-[min(100%,245px)]",
            },
          ],
        },
      },
      {
        id: "how-i-researched",
        number: "05",
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
      {
        id: "award-winning-app",
        number: "06",
        name: "Award-winning app",
        content: {
          kind: "result",
          heading: "Award-winning app",
          body: "sahibinden.com won a Gold Stevie Award at the International Business Awards two years in a row, each time for a mobile app. In 2015 it went to version 2.0 of the Android app. In 2016 it went to the iOS app, in the Best Mobile Development Solution of the Year category. I did the UI and UX design of both apps, and I'm proud to have been part of the team behind them.",
          imagesLayout: "side-by-side",
          images: [
            {
              id: "award-photo-1",
              aspectRatio: "1024/682",
              src: "/media/projects/sahibinden/award-photo-1.jpg",
              alt: "Özgür Ablak holding the Gold Stevie Award at the sahibinden.com office.",
              description: "Award photo 1",
              widthClassName: "w-full",
            },
            {
              id: "award-photo-2",
              aspectRatio: "1024/682",
              src: "/media/projects/sahibinden/award-photo-2.jpg",
              alt: "sahibinden.com team members holding the Stevie Award trophy in the office.",
              description: "Award photo 2",
              widthClassName: "w-full",
            },
            {
              id: "award-photo-3",
              aspectRatio: "1024/680",
              src: "/media/projects/sahibinden/award-photo-3.jpg",
              alt: "sahibinden.com team on stage with Gold Stevie Awards — nine awards graphic.",
              description: "Award photo 3",
              widthClassName: "w-full",
              fullWidth: true,
            },
          ],
        },
      },
    ],
  },
  faldium: {
    title: "Faldium",
    subtitle: "AI fortune telling app · Google Play",
    footerNote: "Designed, built and launched on my own.",
    menu: [
      { id: "overview", number: "01", label: "Overview" },
      {
        id: "how-a-reading-works",
        number: "02",
        label: "How a reading works",
      },
      {
        id: "asking-users-what-to-build",
        number: "03",
        label: "Asking users what to build",
      },
      {
        id: "readings-that-work-together",
        number: "04",
        label: "Readings that work together",
      },
      { id: "how-i-built-it", number: "05", label: "How I built it" },
      {
        id: "growing-and-improving",
        number: "06",
        label: "Growing and improving",
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
            "An AI fortune-telling app\nI designed, built and launched on my own.",
          meta: [
            {
              label: "Context",
              value:
                "Independent product · Turkish market · users in 20+ countries",
            },
            {
              label: "Role",
              value: "Product owner, designer and developer",
            },
          ],
          heroImagesLayout: "side-by-side",
          heroImages: [
            {
              id: "faldium-overview-1",
              aspectRatio: "390 / 844",
              src: "/media/projects/faldium/faldium-overview-1.jpg",
              alt: "Faldium home — today’s scores, coffee reading, dream and palm entry points.",
              description: "Home screen",
              caption: "Home screen",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
            },
            {
              id: "faldium-overview-2",
              aspectRatio: "390 / 844",
              src: "/media/projects/faldium/faldium-overview-2.jpg",
              alt: "Faldium coffee reading — upload a cup photo, three free readings a day.",
              description: "Coffee reading",
              caption: "Coffee reading",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
            },
            {
              id: "faldium-overview-3",
              aspectRatio: "390 / 844",
              src: "/media/projects/faldium/faldium-overview-3.jpg",
              alt: "Faldium dream interpretation — write or speak your dream for a reading.",
              description: "Dream interpretation",
              caption: "Dream interpretation",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
            },
          ],
          body: {
            text: "Faldium started as a Turkish coffee reading app and has grown into a small fortune-telling suite. It is live on Google Play, in Turkish, with nearly 5,000 downloads and a 4.6 rating (23 ratings).",
          },
          storeLinks: {
            googlePlay:
              "https://play.google.com/store/apps/details?id=com.faldium.app&pcampaignid=web_share",
          },
          chips: [],
        },
      },
      {
        id: "how-a-reading-works",
        number: "02",
        name: "How a reading works",
        content: {
          kind: "result",
          heading: "How a reading works",
          body: "You sign in with Google or a magic link, upload photos of your coffee cup and get an AI-generated reading with voice narration. An archive keeps your past readings.",
          imagesLayout: "side-by-side",
          images: [
            {
              id: "faldium-login",
              aspectRatio: "390/844",
              src: "/media/projects/faldium/faldium-login.png",
              alt: "Faldium login — magic link, Google or Apple sign-in.",
              description: "Login",
              caption: "Login",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
              widthClassName: "w-full",
            },
            {
              id: "faldium-reading-1",
              aspectRatio: "390/844",
              src: "/media/projects/faldium/faldium-reading-1.png",
              alt: "Faldium — take a photo of your coffee cup from above so the grounds are fully visible.",
              description: "Photo upload",
              caption: "Photo upload",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
              widthClassName: "w-full",
            },
            {
              id: "faldium-reading-2",
              aspectRatio: "390/844",
              src: "/media/projects/faldium/faldium-reading-2.png",
              alt: "Faldium reading detail — coffee cup photo with voice narration and fortune text.",
              description: "Reading with voice",
              caption: "Reading with voice",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
              widthClassName: "w-full",
            },
          ],
        },
      },
      {
        id: "asking-users-what-to-build",
        number: "03",
        name: "Asking users what to build",
        content: {
          kind: "result",
          heading: "Asking users what to build",
          body: "After launch, I asked users in short surveys which features they wanted next. They pointed to dream interpretation and palm reading. I added numerology myself, and a compatibility reading built on it. Feedback from the app also led to a weekly poll, which I'm testing now.",
          imagesLayout: "side-by-side",
          images: [
            {
              id: "faldium-palm",
              aspectRatio: "504/1024",
              src: "/media/projects/faldium/faldium-palm.jpg",
              alt: "Faldium palm reading — photograph both palms for a reading in about 10–15 seconds.",
              description: "Palm reading",
              caption: "Palm reading",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
              widthClassName: "w-full",
            },
            {
              id: "faldium-cosmic-match",
              aspectRatio: "504/1024",
              src: "/media/projects/faldium/faldium-cosmic-match.jpg",
              alt: "Faldium Cosmic Match — compatibility scores and summary between two people.",
              description: "Cosmic Match",
              caption: "Cosmic Match",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
              widthClassName: "w-full",
            },
            {
              id: "faldium-poll",
              aspectRatio: "504/1024",
              src: "/media/projects/faldium/faldium-poll.jpg",
              alt: "Faldium home — weekly poll alongside numerology and cosmic compatibility cards.",
              description: "Weekly poll",
              caption: "Weekly poll",
              objectFit: "cover",
              unoptimized: true,
              phoneFrame: "android",
              phoneFrameTone: "dark",
              widthClassName: "w-full",
            },
          ],
        },
      },
      {
        id: "readings-that-work-together",
        number: "04",
        name: "Readings that work together",
        content: {
          kind: "result",
          heading: "Readings that work together",
          body: "A coffee reading takes into account the dreams a user told that week, and any palm reading or numerology reading they have, to make the result more meaningful. Numerology asks for a birth date, which also helps personalise the readings.",
          images: [
            {
              id: "faldium-blend",
              aspectRatio: "1024/576",
              src: "/media/projects/faldium/faldium-blend.jpg",
              alt: "Diagram: coffee reading combined with dream, palm and numerology into one reading.",
              description: "Readings that work together",
              caption: "Readings that work together",
              objectFit: "contain",
              unoptimized: true,
              widthClassName: "w-full",
              fullWidth: true,
            },
          ],
        },
      },
      {
        id: "how-i-built-it",
        number: "05",
        name: "How I built it",
        content: {
          kind: "result",
          heading: "How I built it",
          body: "FlutterFlow for the app, Supabase for the backend (PostgreSQL, authentication and row-level security), AI prompt workflows for the readings, and Firebase and Google Analytics for measuring. I used Claude and ChatGPT to help with development and copywriting.",
          images: [
            {
              id: "faldium-stack",
              aspectRatio: "1024/576",
              src: "/media/projects/faldium/faldium-stack.jpg",
              alt: "How Faldium is built — App, Backend, Readings, Measuring and Growth tools.",
              description: "How Faldium is built",
              caption: "How Faldium is built",
              objectFit: "contain",
              unoptimized: true,
              widthClassName: "w-full",
              fullWidth: true,
            },
          ],
        },
      },
      {
        id: "growing-and-improving",
        number: "06",
        name: "Growing and improving",
        content: {
          kind: "result",
          heading: "Growing and improving",
          body: "I set up and run the Google Ads campaigns. I measure how people use the app with Firebase, Google Analytics and event tracking I wrote myself. It shows me errors and problem areas, and I use that to improve the UX. Next, I'm adding English, aiming for more countries, and exploring turning Faldium into a companion AI app.",
          images: [
            {
              id: "faldium-loop",
              aspectRatio: "1024/576",
              src: "/media/projects/faldium/faldium-loop.jpg",
              alt: "Measure, find, fix, release — the improvement loop after each Faldium release.",
              description: "Measure, find, fix, release",
              caption: "Measure, find, fix, release",
              objectFit: "contain",
              unoptimized: true,
              widthClassName: "w-full",
              fullWidth: true,
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
