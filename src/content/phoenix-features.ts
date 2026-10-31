export type PhoenixFeatureAccent = "default" | "red" | "gold";

export type PhoenixFeature = {
  id: string;
  title: string;
  /** One or more subtitle lines under the title */
  lines: string[];
  accent: PhoenixFeatureAccent;
  icon: PhoenixFeatureIcon;
};

export type PhoenixFeatureIcon =
  | "widgets"
  | "onboarding"
  | "phone"
  | "links"
  | "wifi"
  | "home"
  | "settings"
  | "dashboard"
  | "document"
  | "devices"
  | "shield"
  | "health"
  | "diagnostics"
  | "warning"
  | "templates";

export const phoenixFeatureIntro = {
  title: "Phoenix App",
  summary:
    "A complex mobile ecosystem spanning multiple markets, device types, and interconnected features.",
};

export const phoenixFeatures: PhoenixFeature[] = [
  {
    id: "widgets",
    title: "Widgets",
    lines: ["Designs & markets"],
    accent: "default",
    icon: "widgets",
  },
  {
    id: "onboarding",
    title: "Onboarding",
    lines: ["Intro & discovery"],
    accent: "red",
    icon: "onboarding",
  },
  {
    id: "it-phone",
    title: "IT - Phone",
    lines: ["Flow & design"],
    accent: "default",
    icon: "phone",
  },
  {
    id: "flow-links",
    title: "Flow Links",
    lines: ["All markets"],
    accent: "default",
    icon: "links",
  },
  {
    id: "wifi",
    title: "Wi-Fi",
    lines: ["Main & guest"],
    accent: "default",
    icon: "wifi",
  },
  {
    id: "super-wifi",
    title: "Super WiFi",
    lines: ["Onboarding"],
    accent: "default",
    icon: "home",
  },
  {
    id: "settings",
    title: "Settings",
    lines: ["Prefs & config"],
    accent: "default",
    icon: "settings",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    lines: ["Network overview"],
    accent: "gold",
    icon: "dashboard",
  },
  {
    id: "minor-features",
    title: "Minor Features",
    lines: ["FAQ & support"],
    accent: "default",
    icon: "document",
  },
  {
    id: "connected-devices",
    title: "Devices",
    lines: ["List & map"],
    accent: "default",
    icon: "devices",
  },
  {
    id: "permissions",
    title: "Permissions",
    lines: ["Camera & location"],
    accent: "default",
    icon: "shield",
  },
  {
    id: "network-health",
    title: "Network",
    lines: ["Diagnostics"],
    accent: "default",
    icon: "health",
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    lines: ["Flow & design"],
    accent: "default",
    icon: "diagnostics",
  },
  {
    id: "error-cases",
    title: "Error Cases",
    lines: ["Recovery paths"],
    accent: "default",
    icon: "warning",
  },
  {
    id: "templates",
    title: "Templates",
    lines: ["Reusable screens"],
    accent: "red",
    icon: "templates",
  },
];
