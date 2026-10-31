export type OtherWorkCategoryId = "concepts" | "ui-animation" | "3d";

export type OtherWorkCategoryLabel =
  | "Concepts"
  | "UI Animation"
  | "3D";

export const OTHER_WORK_CATEGORY_LABEL: Record<
  OtherWorkCategoryId,
  OtherWorkCategoryLabel
> = {
  concepts: "Concepts",
  "ui-animation": "UI Animation",
  "3d": "3D",
};

export type OtherWorkMediaItem = {
  src: string;
  description: string;
};

export type OtherWorkMedia = {
  kind: "video" | "animation" | "image";
  provider?: "vimeo" | "youtube" | "gumlet";
  /** Empty until a real asset is ready — show ImagePlaceholder. */
  src: string;
  description: string;
  /** CSS aspect-ratio value, e.g. "16 / 9" or "500 / 727". */
  aspectRatio?: string;
  /** Side-by-side assets (e.g. multiple preloader GIFs). */
  items?: OtherWorkMediaItem[];
  /** Framed stills under the primary media (same border rhythm as the video). */
  below?: OtherWorkMediaItem[];
};

export type OtherWorkModal = {
  type?: string;
  context?: string;
  role?: string;
  tools?: string;
  status?: string;
  media?: OtherWorkMedia;
  caption?: string;
  /** First chip is highlighted; the rest are neutral. */
  chips?: string[];
};

export type OtherWorkCardPoster =
  | {
      kind: "placeholder";
      id: string;
      description: string;
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      fit?: "cover" | "contain";
      /** Thin white/5 border around the card thumb (e.g. dark line art). */
      framed?: boolean;
    };

export type OtherWorkLink = {
  label: string;
  /** External URL — when set alone, renders as an anchor. */
  href?: string;
  /**
   * Open a portfolio case-study modal at a section (e.g. METRO → Humour).
   * Takes precedence over href when both are present for the button action.
   */
  caseStudy?: {
    slug: string;
    sectionId: string;
  };
};

export type OtherWork = {
  id: string;
  category: OtherWorkCategoryId;
  title: string;
  /** Stack label on the card (e.g. "01 — OBJECT DETECTION"). */
  label: string;
  /** Stack body on the card. */
  body: string;
  accent: string;
  poster?: OtherWorkCardPoster;
  modal?: OtherWorkModal;
  /** Optional CTA under the caption (e.g. “Read the study →”). */
  link?: OtherWorkLink;
};

export type OtherWorksCategoryData = {
  id: OtherWorkCategoryId;
  label: OtherWorkCategoryLabel;
  works: OtherWork[];
};

const conceptsAccents = [
  "rgba(150, 90, 220, 0.34)",
  "rgba(190, 70, 200, 0.32)",
  "rgba(100, 80, 230, 0.32)",
  "rgba(170, 110, 255, 0.3)",
] as const;

const uiAnimationAccents = [
  "rgba(0, 160, 200, 0.3)",
  "rgba(40, 190, 170, 0.28)",
  "rgba(0, 130, 220, 0.3)",
  "rgba(80, 170, 255, 0.28)",
  "rgba(20, 200, 180, 0.28)",
] as const;

const threeDAccents = [
  "rgba(200, 145, 80, 0.32)",
  "rgba(220, 100, 60, 0.3)",
  "rgba(230, 170, 70, 0.3)",
  "rgba(180, 90, 50, 0.3)",
  "rgba(210, 130, 90, 0.3)",
  "rgba(240, 160, 50, 0.28)",
] as const;

const objectDetectionWork: OtherWork = {
  id: "concepts-object-detection",
  category: "concepts",
  title: "Object Detection",
  label: "01 — OBJECT DETECTION",
  body: "An AR concept that warns you when a TV, mirror or cabinet next to your router could interfere with the Wi-Fi signal.",
  accent: conceptsAccents[0],
  poster: {
    kind: "image",
    src: "/media/projects/concepts/object-detection-v3.webp",
    alt: "AR object detection concept — TV tagged next to Wi-Fi interference risk",
    width: 1024,
    height: 768,
    fit: "cover",
  },
  modal: {
    type: "AR concept · video",
    tools: "Unity · Blender · Adobe After Effects",
    status: "Concept, not a working feature",
    media: {
      kind: "video",
      provider: "vimeo",
      src: "https://player.vimeo.com/video/1081762823",
      description: "Object Detection video (Vimeo).",
    },
    caption:
      "An overlay shows how the router would look in your room, and the app would warn you when a nearby object, like a TV, mirror or cabinet, could interfere with the Wi-Fi signal.",
  },
};

const setupWithArWork: OtherWork = {
  id: "concepts-setup-with-ar",
  category: "concepts",
  title: "Setup with AR",
  label: "02 — SETUP WITH AR",
  body: "An AR prototype built to fix a major drop-off point in cabling and service setup.",
  accent: conceptsAccents[1],
  poster: {
    kind: "image",
    src: "/media/projects/concepts/router-ports-v2.webp",
    alt: "Vodafone router rear ports — Designed by Vodafone",
    width: 884,
    height: 674,
    fit: "cover",
  },
  modal: {
    type: "AR prototype · video",
    tools: "Adobe After Effects",
    status: "Prototype, presented to management",
    media: {
      kind: "video",
      provider: "vimeo",
      src: "https://player.vimeo.com/video/815890677?h=7cf9abe9c9",
      description: "Setup with AR video (Vimeo).",
      aspectRatio: "9 / 16",
    },
    caption:
      "Research with the Tableau team showed big drop-offs during cabling and service setup. I built an AR prototype and presented it to management, which started discussions about investing in innovation and forming a dedicated innovation team.",
  },
};

const roomPlanLocationFinderWork: OtherWork = {
  id: "concepts-roomplan-location-finder",
  category: "concepts",
  title: "RoomPlan Location Finder",
  label: "03 — ROOMPLAN LOCATION FINDER",
  body: "A demo that uses Apple's RoomPlan API to improve the Location Finder for customers with poor Wi-Fi coverage.",
  accent: conceptsAccents[2],
  poster: {
    kind: "image",
    src: "/media/projects/concepts/roomplan-location-finder-v1.webp",
    alt: "Network Health — Improvement possible, RoomPlan Location Finder entry",
    width: 920,
    height: 720,
    fit: "cover",
  },
  modal: {
    type: "AR demo · video",
    tools: "Adobe After Effects",
    status: "Demo, not a working feature",
    media: {
      kind: "video",
      provider: "vimeo",
      src: "https://player.vimeo.com/video/1069988101?h=dfdf4d44f6",
      description: "RoomPlan Location Finder video (Vimeo).",
    },
    caption:
      "Apple announced the RoomPlan API in 2022. After watching the presentation, I saw an opportunity to improve one of the most critical features, Location Finder. This demo shows how it could help customers with poor Wi-Fi coverage navigate their space more easily.",
  },
};

const barcodeScanWork: OtherWork = {
  id: "concepts-barcode-scan",
  category: "concepts",
  title: "Barcode Scan",
  label: "04 — BARCODE SCAN",
  body: "A prototype showing developers how barcode scanning adds shelf items to a shopping list.",
  accent: conceptsAccents[3],
  poster: {
    kind: "image",
    src: "/media/projects/concepts/concept-4-v1.webp",
    alt: "AR grocery scan — nutrition facts overlay on phone",
    width: 1024,
    height: 800,
    fit: "cover",
  },
  modal: {
    type: "Prototype · video",
    context: "METRO app",
    tools: "Framer",
    status: "Implemented in the app",
    media: {
      kind: "video",
      provider: "youtube",
      src: "https://www.youtube.com/embed/O7c5Y-lfJxg",
      description: "Barcode Scan prototype video (YouTube).",
      aspectRatio: "500 / 727",
    },
    caption:
      "I built this prototype to show developers how the scanning feature should work. Customers can add any item from the store shelf to their shopping list and adjust the quantity easily. The feature is now implemented in the app, and we are gathering feedback to improve it.",
  },
};

const customPreloadersWork: OtherWork = {
  id: "ui-animation-custom-preloaders",
  category: "ui-animation",
  title: "Custom Preloaders",
  label: "02 — CUSTOM PRELOADERS",
  body: "Four custom preloaders for iOS and Android apps, with animations designed in Adobe After Effects.",
  accent: uiAnimationAccents[1],
  poster: {
    kind: "image",
    src: "/media/projects/ui-animation/custom-preloaders/card-thumb-v2.jpg",
    alt: "Four custom METRO preloaders — pan, cutting board, mortar, Christmas tree",
    width: 1024,
    height: 799,
    fit: "cover",
  },
  modal: {
    type: "UI animation · GIF",
    context: "METRO app",
    tools: "Adobe After Effects · Adobe Illustrator · Lottie",
    status: "Live in the app",
    media: {
      kind: "animation",
      src: "/media/projects/ui-animation/custom-preloaders/preloader-02-cutting-board.gif",
      description: "Animated GIF: the four custom preloaders",
      aspectRatio: "1 / 1",
      items: [
        {
          src: "/media/projects/ui-animation/custom-preloaders/preloader-02-cutting-board.gif",
          description: "Custom preloader — cutting board",
        },
        {
          src: "/media/projects/ui-animation/custom-preloaders/preloader-01-tree.gif",
          description: "Custom preloader — Christmas tree",
        },
        {
          src: "/media/projects/ui-animation/custom-preloaders/preloader-04-pan.gif",
          description: "Custom preloader — frying pan",
        },
        {
          src: "/media/projects/ui-animation/custom-preloaders/preloader-03-mortar.gif",
          description: "Custom preloader — mortar and pestle",
        },
      ],
    },
    caption:
      "In METRO's UEQ study, participants rated the app low on Novelty (−0.13): it felt like a classic, monotonous enterprise app. My answer was humour in the moments of waiting. I created four custom preloaders for iOS and Android, animated in Adobe After Effects. In the next UEQ round, which included the animations, Novelty rose to 1.17, and customers said it was the change they liked most.",
  },
  link: {
    label: "Read the study →",
    caseStudy: {
      slug: "metro",
      sectionId: "humour",
    },
  },
};

const emptyStateAnimationsWork: OtherWork = {
  id: "ui-animation-empty-state-animations",
  category: "ui-animation",
  title: "Empty State Animations",
  label: "01 — EMPTY STATE ANIMATIONS",
  body: "A series of playful animations for the app's empty states, designed in Adobe After Effects.",
  accent: uiAnimationAccents[0],
  poster: {
    kind: "image",
    src: "/media/projects/ui-animation/empty-state-animations/card-thumb-v1.jpg",
    alt: "Empty State Animations — METRO Promotions empty state on iPhone",
    width: 1024,
    height: 800,
    fit: "cover",
  },
  modal: {
    type: "UI animation · GIF",
    context: "METRO app",
    tools: "Adobe After Effects · Adobe Illustrator · Lottie",
    status: "Live in the app",
    media: {
      kind: "animation",
      src: "/media/projects/ui-animation/empty-state-animations/empty-01-favorites.gif?v=3",
      description: "Empty-state screens — six METRO humour states",
      items: [
        {
          src: "/media/projects/ui-animation/empty-state-animations/empty-01-favorites.gif?v=3",
          description: "Empty state — Favorites",
        },
        {
          src: "/media/projects/ui-animation/empty-state-animations/empty-02-promotions.gif?v=3",
          description: "Empty state — Promotions",
        },
        {
          src: "/media/projects/ui-animation/empty-state-animations/empty-03-search-result.gif?v=3",
          description: "Empty state — Search result",
        },
        {
          src: "/media/projects/ui-animation/empty-state-animations/empty-04-invoices.gif?v=3",
          description: "Empty state — Invoices",
        },
        {
          src: "/media/projects/ui-animation/empty-state-animations/empty-05-no-internet.gif?v=3",
          description: "Empty state — No internet",
        },
        {
          src: "/media/projects/ui-animation/empty-state-animations/empty-06-shopping-basket.gif?v=3",
          description: "Empty state — Shopping basket",
        },
      ],
    },
    caption:
      "In METRO's UEQ study, participants rated the app low on Novelty (−0.13). To address this, I created a series of playful animations for the app's empty states, such as no search results or no promotions, in Adobe After Effects. They went live in the app, and in the next UEQ round, which included the animations, Novelty rose to 1.17.",
  },
  link: {
    label: "Read the study →",
    caseStudy: {
      slug: "metro",
      sectionId: "humour",
    },
  },
};

const networkQualityAnimationWork: OtherWork = {
  id: "ui-animation-network-quality-animation",
  category: "ui-animation",
  title: "Network Quality Animation",
  label: "03 — NETWORK QUALITY ANIMATION",
  body: 'An animation with supportive text, shown when a user taps "Improve my network quality" in the Vodafone app.',
  accent: uiAnimationAccents[2],
  poster: {
    kind: "image",
    src: "/media/projects/ui-animation/network-quality-animation/card-thumb-v1.webp",
    alt: "Network Quality Animation — Vodafone extender line illustration",
    width: 1024,
    height: 800,
    fit: "cover",
    framed: true,
  },
  modal: {
    type: "UI animation · video",
    context: "Vodafone app",
    tools: "Adobe After Effects · Adobe Illustrator · Lottie",
    status: "Implemented in the app",
    media: {
      kind: "video",
      provider: "vimeo",
      src: "https://player.vimeo.com/video/785564369?h=1b8058a033",
      description: "Network Quality Animation video (Vimeo).",
      // Native Vimeo frame is 322×240 (not 16:9) — keep player/vp-center flush with video.
      aspectRatio: "322 / 240",
    },
    caption:
      'When the Vodafone app detects that extender coverage can be improved, it shows an "Improve my network quality" button. When the user taps it, an animation and supportive text appear on the screen.',
  },
};

const ufoWork: OtherWork = {
  id: "ui-animation-ufo",
  category: "ui-animation",
  title: "UFO",
  label: "04 — UFO",
  body: "I love the humor in design. I think we can put a smile on our customer's face, even if it's during a not-so-good moment.",
  accent: uiAnimationAccents[3],
  poster: {
    kind: "image",
    src: "/media/projects/ui-animation/ufo/card-thumb-v2.webp",
    alt: "UFO — service error screen with router abduction illustration",
    width: 1024,
    height: 800,
    fit: "cover",
  },
  modal: {
    type: "UI animation · video",
    context: "METRO app",
    tools: "Adobe After Effects · Adobe Illustrator · Lottie",
    status: "Not implemented in the app",
    media: {
      kind: "video",
      provider: "vimeo",
      src: "https://player.vimeo.com/video/585060573",
      description: "UFO humour animation (Vimeo).",
      aspectRatio: "1440 / 1080",
    },
    caption:
      "I love the humor in design. I think we can put a smile on our customer's face, even if it's during a not-so-good moment.",
  },
};

const onboardingAnimationsWork: OtherWork = {
  id: "ui-animation-onboarding-animations",
  category: "ui-animation",
  title: "Onboarding Animations",
  label: "05 — ONBOARDING ANIMATIONS",
  body: "Animated onboardings for six markets, showing the app's key features from the first launch.",
  accent: uiAnimationAccents[4],
  poster: {
    kind: "image",
    src: "/media/projects/ui-animation/onboarding-animations/card-thumb-v2.webp",
    alt: "Onboarding Animations — Super WiFi onboarding screen",
    width: 1024,
    height: 801,
    fit: "cover",
  },
  modal: {
    type: "UI animation · video",
    context: "Vodafone app",
    tools: "Adobe After Effects · Adobe Illustrator · Lottie",
    status: "Implemented in the app",
    media: {
      kind: "video",
      provider: "vimeo",
      src: "https://player.vimeo.com/video/699084302?h=78df039489",
      description: "Onboarding Animations video (Vimeo).",
      aspectRatio: "4 / 3",
    },
    caption:
      "Six markets, six different onboardings. When someone opens the Vodafone app for the first time, the onboarding animations show the most important features right away. This video is the example from one of the markets.",
  },
};

const vodafoneUltraHub7Work: OtherWork = {
  id: "3d-vodafone-ultra-hub-7",
  category: "3d",
  title: "Vodafone Ultra Hub 7",
  label: "01 — VODAFONE ULTRA HUB 7",
  body: "A concept: Vodafone's new Ultra Hub 7 Cable router with Wi-Fi 7, redesigned in 3D.",
  accent: threeDAccents[0],
  poster: {
    kind: "image",
    src: "/media/projects/3d/vodafone-ultra-hub-7/card-thumb-v1.webp",
    alt: "Vodafone Ultra Hub 7 — 3D concept render on red podium",
    width: 871,
    height: 682,
    fit: "cover",
  },
  modal: {
    type: "3D concept · video",
    context: "Vodafone Marketing",
    tools: "Blender",
    status: "Concept",
    media: {
      kind: "video",
      provider: "gumlet",
      src: "https://play.gumlet.io/embed/680d5da039646871b93dc952",
      description: "Vodafone Ultra Hub 7 concept video (Gumlet).",
      aspectRatio: "16 / 9",
      below: [
        {
          src: "/media/projects/3d/vodafone-ultra-hub-7/perspectives-v1.webp",
          description:
            "Ultra Hub 7 — front, side, back, top and bottom product views",
        },
      ],
    },
    caption:
      "A concept project. I redesigned Vodafone's new router, the Vodafone Ultra Hub 7 Cable with Wi-Fi 7, in 3D, using the product on Vodafone's German website as my reference.",
  },
};

const tobiWork: OtherWork = {
  id: "3d-tobi",
  category: "3d",
  title: "TOBi in 3D",
  label: "02 — TOBI IN 3D",
  body: "A concept that gives Vodafone's chatbot TOBi a 3D body, redesigned from a 2D head.",
  accent: threeDAccents[1],
  poster: {
    kind: "image",
    src: "/media/projects/3d/tobi/card-thumb-v1.webp",
    alt: "TOBi — 3D chatbot concept on blue background",
    width: 920,
    height: 720,
    fit: "cover",
  },
  modal: {
    type: "3D concept · image",
    tools: "Blender",
    status: "Concept, not in use",
    media: {
      kind: "image",
      src: "/media/projects/3d/tobi/render-v1.webp",
      description: "TOBi 3D render",
      aspectRatio: "23 / 18",
    },
    caption:
      "A concept project, never used anywhere. TOBi is Vodafone's AI-supported chatbot, a 2D drawing of just a head that appears on all platforms. I redesigned it in 3D, in my own way.",
  },
};

const scarecrowWork: OtherWork = {
  id: "3d-scarecrow",
  category: "3d",
  title: "Scarecrow",
  label: "03 — SCARECROW",
  body: "A warplane lost in an old war reappears today and attacks other warplanes.",
  accent: threeDAccents[2],
  poster: {
    kind: "image",
    src: "/media/projects/3d/scarecrow/card-thumb-v1.webp",
    alt: "Scarecrow — warplane over mountain valley",
    width: 1024,
    height: 800,
    fit: "cover",
  },
  modal: {
    type: "3D concept · video",
    context: "Personal project",
    tools: "Blender",
    status: "Concept",
    media: {
      kind: "video",
      provider: "vimeo",
      src: "https://player.vimeo.com/video/815725480?h=ac9390ba0d",
      description: "Scarecrow concept video (Vimeo).",
      aspectRatio: "16 / 9",
      below: [
        {
          src: "/media/projects/3d/scarecrow/plane-v1.webp",
          description: "Scarecrow — weathered warplane hero render",
        },
      ],
    },
    caption:
      "A concept project built around a fictional script I wrote. A warplane vanished in an old war, and its pilot suddenly reappears in the present day and attacks other warplanes. Scarecrow is the plane at the centre of that story. I modelled and animated it in 3D as a prototype.",
  },
};

const hornedWarriorWork: OtherWork = {
  id: "3d-horned-warrior",
  category: "3d",
  title: "Horned Warrior",
  label: "04 — HORNED WARRIOR",
  body: "A spear-wielding warrior in 3D, inspired by Red Sonja from the Conan comics.",
  accent: threeDAccents[3],
  poster: {
    kind: "image",
    src: "/media/projects/3d/horned-warrior/card-thumb-v1.webp",
    alt: "Horned Warrior — spear-wielding character on blue background",
    width: 1024,
    height: 800,
    fit: "cover",
  },
  modal: {
    type: "3D character · image",
    context: "Personal project",
    tools: "Blender",
    status: "Concept",
    media: {
      kind: "image",
      src: "/media/projects/3d/horned-warrior/render-v1.webp",
      description: "Warrior character 3D render",
      aspectRatio: "23 / 18",
    },
    caption:
      "A character concept inspired by Red Sonja, the sword-and-sorcery heroine of the Conan comics. I imagined her as a warrior of an ancient, mythic age: light and fast rather than heavily armoured, with a horned steel helmet, fingerless gloves, thigh-high boots and a spear as her weapon. I created the character in 3D.",
  },
};

const medievalIslandWork: OtherWork = {
  id: "3d-medieval-island",
  category: "3d",
  title: "Medieval Island",
  label: "05 — MEDIEVAL ISLAND",
  body: "A medieval age I would love to live in: three half-timbered houses on a rocky island at dusk.",
  accent: threeDAccents[4],
  poster: {
    kind: "image",
    src: "/media/projects/3d/medieval-island/card-thumb-v1.webp",
    alt: "Medieval Island — dusk village on rocky island with water reflection",
    width: 640,
    height: 360,
    fit: "cover",
  },
  modal: {
    type: "3D scene · image",
    context: "Personal project",
    tools: "Blender",
    status: "Concept",
    media: {
      kind: "image",
      src: "/media/projects/3d/medieval-island/render-v1.webp",
      description: "Medieval island 3D render",
      aspectRatio: "16 / 9",
    },
    caption:
      "A 3D scene set in a medieval age I would love to live in. Three half-timbered houses sit on a small rocky island at dusk, their windows glowing against the still water. Autumn leaves cover the ground, and an empty bench faces the lake, waiting for someone to sit down and watch the evening. I created this scene in 3D.",
  },
};

const lowPolyWorldsWork: OtherWork = {
  id: "3d-low-poly-worlds",
  category: "3d",
  title: "Low Poly Worlds",
  label: "06 — LOW POLY WORLDS",
  body: "Imaginary worlds in low poly 3D: a castle, a floating island and a lighthouse.",
  accent: threeDAccents[5],
  poster: {
    kind: "image",
    src: "/media/projects/3d/low-poly-worlds/card-thumb-v2.webp",
    alt: "Low Poly Worlds — floating island cottage",
    width: 560,
    height: 315,
    fit: "cover",
  },
  modal: {
    type: "3D scenes · images",
    context: "Personal project",
    tools: "Blender",
    status: "Concept",
    media: {
      kind: "image",
      src: "/media/projects/3d/low-poly-worlds/castle-v1.webp",
      description: "Low poly worlds — castle, floating island, dungeon, lighthouse",
      aspectRatio: "16 / 9",
      items: [
        {
          src: "/media/projects/3d/low-poly-worlds/castle-v1.webp",
          description: "Low poly castle",
        },
        {
          src: "/media/projects/3d/low-poly-worlds/lighthouse-v1.webp",
          description: "Low poly lighthouse",
        },
        {
          src: "/media/projects/3d/low-poly-worlds/dungeon-v1.webp",
          description: "Low poly dungeon",
        },
        {
          src: "/media/projects/3d/low-poly-worlds/floating-island-v1.webp",
          description: "Low poly floating island",
        },
      ],
    },
    caption:
      "My imaginary worlds, built in 3D in a low poly style. A castle on green hills at sunset, a cottage on a floating island with smoke rising from its chimney, a torch-lit dungeon with barrels and crates, and a lighthouse watching over a small village on a moonlit night. Each one is a small world of its own.",
  },
};

export const otherWorksCategories: OtherWorksCategoryData[] = [
  {
    id: "concepts",
    label: "Concepts",
    works: [
      objectDetectionWork,
      setupWithArWork,
      roomPlanLocationFinderWork,
      barcodeScanWork,
    ],
  },
  {
    id: "ui-animation",
    label: "UI Animation",
    works: [
      emptyStateAnimationsWork,
      customPreloadersWork,
      networkQualityAnimationWork,
      ufoWork,
      onboardingAnimationsWork,
    ],
  },
  {
    id: "3d",
    label: "3D",
    works: [
      vodafoneUltraHub7Work,
      tobiWork,
      scarecrowWork,
      hornedWarriorWork,
      medievalIslandWork,
      lowPolyWorldsWork,
    ],
  },
];

/** Prev/next within the same Other Works category, from data order. */
export function getAdjacentOtherWorks(workId: string): {
  prev: OtherWork | null;
  next: OtherWork | null;
  categorySize: number;
} {
  for (const category of otherWorksCategories) {
    const index = category.works.findIndex((item) => item.id === workId);
    if (index === -1) continue;
    return {
      prev: index > 0 ? (category.works[index - 1] ?? null) : null,
      next:
        index < category.works.length - 1
          ? (category.works[index + 1] ?? null)
          : null,
      categorySize: category.works.length,
    };
  }
  return { prev: null, next: null, categorySize: 0 };
}
