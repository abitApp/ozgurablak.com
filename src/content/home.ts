export const site = {
  name: "Özgür Ablak",
  role: "Senior / Principal Product Designer",
  tagline: "Product Design · 15+ years",
  email: "ozgurablak@hotmail.com",
};

export const contact = {
  email: site.email,
  linkedinUrl: "https://www.linkedin.com/in/ozgurablak/",
  /** WhatsApp username (opens app / WhatsApp Web). */
  whatsappUsername: "o.ablak",
  whatsappUrl: "https://wa.me/o.ablak",
  /** Drop a PDF at this path when ready. */
  cvUrl: "/media/ozgur-ablak-cv.pdf",
};

export const navItems: Array<{
  label: string;
  /** Opens a popup instead of navigating (design TBD). */
  popup?: boolean;
  /** In-page anchor (e.g. About me section). Takes precedence over popup. */
  href?: string;
  /** Decorative separator shown before this item (desktop + mobile). */
  separator?: boolean;
}> = [
  { label: "WORKS", href: "#work" },
  { label: "ABOUT", href: "#about", separator: true },
  { label: "CONNECT", href: "#contact", separator: true },
];

/** Header WORKS link: scroll to Selected Project and reset the carousel to the first card. */
export const WORKS_GO_START_EVENT = "works:go-start";

export const hero = {
  headline: "The Man Who Changed the Design World.",
  supporting: "Or at least tried to.",
  image: {
    /** First frame of hero-loop.mp4 — shown until the video can play (and on mobile). */
    src: "/media/hero-poster.jpg",
    alt: "Özgür Ablak seated at a desk in a dark suit with a rabbit holding a lollipop on his lap, a Product Design nameplate in the foreground.",
    width: 1920,
    height: 1081,
  },
  video: {
    src: "/media/hero-loop.mp4?v=4k",
  },
};

export type ProjectMediaImage = {
  kind?: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Skip the cream matte — show PNG transparency. */
  transparent?: boolean;
  /** Visual scale relative to the media panel (e.g. 0.9 = 10% smaller). */
  scale?: number;
};

export type ProjectMediaChart = {
  kind: "chart";
  chartId: "phoenix-ios" | "phoenix-android";
};

export type ProjectMediaPhoenixGrid = {
  kind: "phoenix-grid";
};

export type ProjectMediaRatingPrompts = {
  kind: "rating-prompts";
};

export type ProjectMediaUeqNovelty = {
  kind: "ueq-novelty";
};

export type ProjectMediaMetroWait = {
  kind: "metro-wait";
};

export type ProjectMediaUeqStatic = {
  kind: "ueq-static";
};

export type ProjectMediaSahibindenPhone = {
  kind: "sahibinden-phone";
  /** Defaults to challenge (home + FAB). Approach uses the post-ad form phone. */
  variant?: "challenge" | "approach";
};

export type ProjectMediaDesignSystemSpecs = {
  kind: "design-system-specs";
};

export type ProjectMediaSahibindenImpact = {
  kind: "sahibinden-impact";
};

export type ProjectMedia =
  | ProjectMediaImage
  | ProjectMediaChart
  | ProjectMediaPhoenixGrid
  | ProjectMediaRatingPrompts
  | ProjectMediaUeqNovelty
  | ProjectMediaMetroWait
  | ProjectMediaUeqStatic
  | ProjectMediaSahibindenPhone
  | ProjectMediaDesignSystemSpecs
  | ProjectMediaSahibindenImpact;

export type ProjectLayer = {
  id: "context" | "move" | "outcome";
  label: string;
  detail: string;
  /** Longer copy for the expanded stack card / empty media fallback. */
  more: string;
  /** Left-panel visuals shown while this layer is selected. */
  media?: ProjectMedia[];
};

export type Project = {
  slug: string;
  title: string;
  /** Optional lines shown under the title in the left panel. */
  subtitle?: string;
  role: string;
  summary: string;
  accent: string;
  logo?: {
    src: string;
    alt: string;
  };
  /** When true, logo stands alone — title text is not rendered beside it. */
  hideTitle?: boolean;
  layers: ProjectLayer[];
};

export const projects: Project[] = [
  {
    slug: "vodafone-design-system",
    title: "Design System",
    subtitle:
      "App taken over from an agency, system built in ~7 months\n100+ components · ~1,000 screens · 13 flow categories",
    role: "Senior Product Designer",
    summary:
      "Unifying design and engineering for a native app across six markets.",
    accent: "rgba(0, 160, 80, 0.28)",
    logo: {
      src: "/brands/vodafone.svg",
      alt: "Vodafone logo",
    },
    layers: [
      {
        id: "context",
        label: "01 — Challenge",
        detail:
          "A native app in six markets where design and code had become two different apps.",
        more: "About 80% of ~40 key screens didn’t match the live app: three tools, no component library, and iOS-only designs adapted for Android.",
        media: [{ kind: "design-system-specs" }],
      },
      {
        id: "move",
        label: "02 — Approach",
        detail:
          "One Figma system, built from the smallest parts up, with Android patterns of its own.",
        more: "Led the build of an atomic Figma system with native Android patterns, branching flows and designer sign-off in UAT.",
        media: [
          {
            src: "/media/projects/design-system/atomic-design-v5.png",
            alt: "Atomic design hierarchy from atoms to molecules to organism for the Vodafone design system.",
            width: 1024,
            height: 671,
            transparent: true,
            scale: 0.88,
          },
        ],
      },
      {
        id: "outcome",
        label: "03 — Impact",
        detail:
          "Three tools became one, and design finally matched what shipped.",
        more: "No visible flaws left. Developers ask very few questions and start building right away. Three tools became one: Figma.",
        media: [
          {
            src: "/media/projects/design-system/tools-orbit-v7.png",
            alt: "Figma logo with a glowing orbital ring — three tools becoming one system.",
            width: 1024,
            height: 960,
            transparent: true,
          },
        ],
      },
    ],
  },
  {
    slug: "vodafone-app",
    title: "Vodafone App",
    subtitle:
      "Home Wi-Fi and extender management, in six markets\niOS & Android · 10+ devices · 60 illustrations",
    role: "Senior Product Designer",
    summary: "Redesigning high-stakes mobile journeys for millions of customers.",
    accent: "rgba(230, 0, 0, 0.28)",
    logo: {
      src: "/brands/vodafone.svg",
      alt: "Vodafone logo",
    },
    layers: [
      {
        id: "context",
        label: "01 — Challenge",
        detail:
          "Ireland was the lowest-rated market, and the top feature was hard to find; about 45% dropped off at cable setup.",
        more: "Ireland was the lowest-rated market, and the top feature was hard to find; about 45% dropped off at cable setup.",
        media: [{ kind: "phoenix-grid" }],
      },
      {
        id: "move",
        label: "02 — Approach",
        detail:
          "A rating prompt after a successful setup, a QR widget, one generic illustration set, and an AR concept.",
        more: "A rating prompt after a successful setup, a QR widget, one generic illustration set, and an AR concept.",
        media: [{ kind: "rating-prompts" }],
      },
      {
        id: "outcome",
        label: "03 — Impact",
        detail:
          "Ireland’s Android rating rose from ~1.4 to ~3.8 in about three months; iOS from ~2.65 to ~4.1. Our widget was named a first across Vodafone’s mobile apps.",
        more: "Ireland’s Android rating rose from ~1.4 to ~3.8 in about three months; iOS from ~2.65 to ~4.1. Our widget was named a first across Vodafone’s mobile apps.",
        media: [
          { kind: "chart", chartId: "phoenix-android" },
          { kind: "chart", chartId: "phoenix-ios" },
        ],
      },
    ],
  },
  {
    slug: "metro",
    title: "METRO Markets",
    subtitle:
      "Shopping app for METRO’s wholesale customers / iOS & Android · built from scratch, first version live in 6 months",
    role: "Senior UX/UI Designer",
    summary:
      "Shaping B2B marketplace experiences for procurement teams across Europe.",
    accent: "rgba(0, 90, 160, 0.28)",
    logo: {
      src: "/brands/metro.png",
      alt: "METRO logo",
    },
    hideTitle: true,
    layers: [
      {
        id: "context",
        label: "01 — Challenge",
        detail:
          'Test participants saw the app as monotone (UEQ Novelty −0.13, "Bad"). After COVID, METRO asked for cost cuts, and our idea was fewer printed leaflets.',
        more: 'Test participants saw the app as monotone (UEQ Novelty −0.13, "Bad"). After COVID, METRO asked for cost cuts, and our idea was fewer printed leaflets.',
        media: [{ kind: "ueq-static" }],
      },
      {
        id: "move",
        label: "02 — Approach",
        detail:
          "Research in every session, then two targeted changes: humour where the app waits, and a tree that asks customers to go paperless.",
        more: "Research in every session, then two targeted changes: humour where the app waits, and a tree that asks customers to go paperless.",
        media: [{ kind: "metro-wait" }],
      },
      {
        id: "outcome",
        label: "03 — Impact",
        detail:
          "In the next UEQ round, which included the animations, Novelty rose from −0.13 to 1.17. In tests, far more people switched to paperless with the tree than with the plain toggle.",
        more: "In the next UEQ round, which included the animations, Novelty rose from −0.13 to 1.17. In tests, far more people switched to paperless with the tree than with the plain toggle.",
        media: [{ kind: "ueq-novelty" }],
      },
    ],
  },
  {
    slug: "sahibinden",
    title: "sahibinden.com",
    subtitle: "iOS & Android · 50M+ downloads on Google Play",
    role: "Product Designer",
    summary:
      "Improving high-traffic classifieds journeys across browse, list, and convert moments.",
    accent: "rgba(255, 210, 0, 0.22)",
    logo: {
      src: "/brands/sahibinden.png",
      alt: "sahibinden.com logo",
    },
    layers: [
      {
        id: "context",
        label: "01 — Challenge",
        detail:
          "Posting ads is how sahibinden.com earns money, but in the app it went unnoticed, and real estate agents found posting from mobile hard.",
        more: "Posting ads is how sahibinden.com earns money, but in the app it went unnoticed, and real estate agents found posting from mobile hard.",
        media: [{ kind: "sahibinden-phone" }],
      },
      {
        id: "move",
        label: "02 — Approach",
        detail:
          'Real estate agents said long descriptions made posting from mobile hard, so we added voice-to-text. I also put a highlighted "post an ad" button in the centre of the tab bar.',
        more: 'Real estate agents said long descriptions made posting from mobile hard, so we added voice-to-text. I also put a highlighted "post an ad" button in the centre of the tab bar.',
        media: [{ kind: "sahibinden-phone", variant: "approach" }],
      },
      {
        id: "outcome",
        label: "03 — Impact",
        detail:
          "All mobile ad postings rose 40% after voice-to-text, per our analytics team, and within two years mobile passed web. The post button is still there today.",
        more: "All mobile ad postings rose 40% after voice-to-text, per our analytics team, and within two years mobile passed web. The post button is still there today.",
        media: [{ kind: "sahibinden-impact" }],
      },
    ],
  },
];

/** Standalone Faldium card under the Selected Project carousel (not in the track). */
export const faldiumProject: Project = {
  slug: "faldium",
  title: "Faldium",
  hideTitle: true,
  role: "Founder & Product Designer",
  summary:
    "An AI-powered self-discovery app for exploring dreams, relationships, personal insights, and community opinions.",
  accent: "rgba(150, 90, 220, 0.32)",
  layers: [
    {
      id: "context",
      label: "01 — Challenge",
      detail:
        "People want guidance on dreams, relationships, and the future — but most apps feel either gimmicky or cold.",
      more: "People want guidance on dreams, relationships, and the future — but most apps feel either gimmicky or cold.",
    },
    {
      id: "move",
      label: "02 — Approach",
      detail:
        "A dark, mystical home built around Kahve Falı, dream reading, palmistry, numerology, and cosmic match — with AI narration.",
      more: "A dark, mystical home built around Kahve Falı, dream reading, palmistry, numerology, and cosmic match — with AI narration.",
    },
    {
      id: "outcome",
      label: "03 — Impact",
      detail:
        "My own product: an AI-powered self-discovery app spanning dreams, relationships, personal insights, and community opinions.",
      more: "My own product: an AI-powered self-discovery app spanning dreams, relationships, personal insights, and community opinions.",
    },
  ],
};

/** @deprecated Prefer `projects` — kept for interim imports */
export const sampleProject = projects[0];
