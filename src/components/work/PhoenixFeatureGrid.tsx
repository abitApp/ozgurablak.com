import type { PhoenixFeatureIcon } from "@/content/phoenix-features";
import { phoenixFeatures } from "@/content/phoenix-features";

const iconClass = "h-5 w-5 shrink-0";

function FeatureIcon({ name }: { name: PhoenixFeatureIcon }) {
  switch (name) {
    case "widgets":
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "onboarding":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5.5 19c1.2-3.2 3.4-4.75 6.5-4.75S16.8 15.8 18 19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M8.5 4.5h7A1.5 1.5 0 0 1 17 6v12a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 18V6a1.5 1.5 0 0 1 1.5-1.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M10 17.25h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "links":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M9.5 13.5 8 15a3.2 3.2 0 0 0 4.5 4.5l2-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14.5 10.5 16 9a3.2 3.2 0 0 0-4.5-4.5l-2 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M10 14l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "wifi":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M4.5 10.5c3.8-3.6 11.2-3.6 15 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7.2 13.5c2.5-2.2 7.1-2.2 9.6 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M10 16.4c1.1-.9 2.9-.9 4 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="19" r="1.1" fill="currentColor" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M4.5 11.5 12 5l7.5 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 10.5V19h10v-8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 4.5v1.4M12 18.1v1.4M4.5 12h1.4M18.1 12h1.4M6.4 6.4l1 1M16.6 16.6l1 1M17.6 6.4l-1 1M7.4 16.6l-1 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "document":
    case "templates":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M8 4.5h6.5L18 8v11.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M14 4.5V8h3.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9.5 12h5M9.5 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "devices":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <rect x="3.5" y="6" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 18.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="16.5" y="9" width="4" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M12 4.5 18 7v5.2c0 3.4-2.3 5.9-6 7.3-3.7-1.4-6-3.9-6-7.3V7l6-2.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "health":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M5 16.5V14c0-1 .3-2.2 1.2-3.1C7.3 9.7 8.7 9 10.2 9c1.3 0 2.2.5 3.1 1.4.7.7 1.2 1.5 1.7 2.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M5 16.5h2.2l1.3-3.2 1.8 5.2 1.5-3.5H19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "diagnostics":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M4 13h3l2-5 3 10 2-6h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "warning":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={iconClass} aria-hidden>
          <path
            d="M12 5.5 19.5 18H4.5L12 5.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M12 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="16.2" r="0.9" fill="currentColor" />
        </svg>
      );
  }
}

type Accent = "default" | "red" | "gold";

/** Quiet rest state; accent glow only on this card’s hover. */
function cardClass(accent: Accent) {
  const base = [
    "border-white/12",
    "bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,rgba(20,14,12,0.75)_100%)]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
    "backdrop-blur-sm",
  ];

  if (accent === "gold") {
    return [
      ...base,
      "hover:border-[#f0a11a]/90",
      "hover:bg-[linear-gradient(135deg,rgba(240,161,26,0.28)_0%,rgba(40,28,8,0.72)_42%,rgba(12,10,6,0.88)_100%)]",
      "hover:shadow-[inset_0_1px_0_rgba(255,200,100,0.22),0_0_0_1px_rgba(240,161,26,0.15),0_0_28px_rgba(240,161,26,0.35)]",
    ].join(" ");
  }

  // default + red accents share the red hover language
  return [
    ...base,
    "hover:border-[#e60000]/90",
    "hover:bg-[linear-gradient(135deg,rgba(230,0,0,0.28)_0%,rgba(40,8,8,0.72)_42%,rgba(12,6,6,0.88)_100%)]",
    "hover:shadow-[inset_0_1px_0_rgba(255,80,80,0.25),0_0_0_1px_rgba(230,0,0,0.15),0_0_28px_rgba(230,0,0,0.35)]",
  ].join(" ");
}

function iconClassName() {
  return "text-white/90";
}

export function PhoenixFeatureGrid() {
  return (
    <section
      className="relative overflow-hidden p-0 text-white/90"
      aria-label="Phoenix App feature architecture"
    >
      <ul className="relative z-10 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
        {phoenixFeatures.map((feature) => (
          <li key={feature.id} className="min-w-0">
            <div
              className={`group flex h-full min-w-0 items-start gap-2.5 rounded-2xl border px-3 py-2.5 transition-[border-color,box-shadow,background] duration-300 ease-out ${cardClass(feature.accent)}`}
            >
              <span className={`mt-0.5 shrink-0 ${iconClassName()}`}>
                <FeatureIcon name={feature.icon} />
              </span>
                <span className="min-w-0 flex-1 overflow-hidden">
                <span className="block truncate text-[0.72rem] font-semibold tracking-tight text-white/90">
                  {feature.title}
                </span>
                <span className="mt-0.5 block truncate text-[0.58rem] leading-snug text-white/55">
                  {feature.lines.join(", ")}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
