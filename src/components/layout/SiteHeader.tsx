"use client";

import { useEffect, useId, useState } from "react";
import { navItems, WORKS_GO_START_EVENT } from "@/content/home";

function NavSeparator({ show }: { show?: boolean }) {
  if (!show) return null;

  return (
    <span
      className="select-none text-[0.95em] font-normal text-white/50"
      aria-hidden="true"
    >
      |
    </span>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const menuId = useId();
  const dialogId = useId();

  useEffect(() => {
    if (!menuOpen && !activePopup) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActivePopup(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, activePopup]);

  useEffect(() => {
    if (!activePopup) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [activePopup]);

  // 2px smaller than previous clamp(0.95rem … 1.125rem)
  const linkClass =
    "cursor-pointer text-[clamp(calc(0.95rem-2px),1.4vw,calc(1.125rem-2px))] font-normal tracking-[0.04em] text-white/90 uppercase transition-opacity hover:opacity-70";

  const openPopup = (label: string) => {
    setMenuOpen(false);
    setActivePopup(label);
  };

  return (
    <>
      {/* Mobile: solid scrim (no backdrop-filter). Desktop: light + blur. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-black/55 md:bg-black/10 md:backdrop-blur-[8px]">
        <div className="mx-auto flex min-h-16 max-w-[72rem] items-center justify-between gap-6 px-5 py-3 md:min-h-20 md:px-8 md:py-4">
          <a
            href="#top"
            className="flex min-w-0 shrink-0 cursor-pointer flex-col gap-1"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-[clamp(calc(0.95rem+4pt),calc(2vw+4pt),calc(1.5rem+4pt))] font-light leading-none tracking-tight text-[#ffffff]">
              Özgür Ablak
            </span>
            <span className="max-w-[16rem] text-[10px] font-normal leading-snug tracking-[0.1px] text-[#BFB7B0] sm:max-w-none">
              Senior Product Designer · UX, Design Systems & AI Products
            </span>
          </a>

          <nav
            className="hidden items-center gap-x-3 md:flex lg:gap-x-4"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-x-3 lg:gap-x-4"
              >
                <NavSeparator show={item.separator} />
                {item.href ? (
                  <a
                    href={item.href}
                    className={linkClass}
                    onClick={(event) => {
                      if (!item.href) return;
                      event.preventDefault();
                      if (item.href === "#work") {
                        window.dispatchEvent(new Event(WORKS_GO_START_EVENT));
                      }
                      const target = document.getElementById(
                        item.href.slice(1),
                      );
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", item.href);
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={linkClass}
                    onClick={() => openPopup(item.label)}
                  >
                    {item.label}
                  </button>
                )}
              </span>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/40 px-3 text-sm font-medium tracking-[0.04em] uppercase md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {menuOpen ? (
          <div
            id={menuId}
            className="border-t border-white/15 bg-black/95 px-5 py-6 text-white/90 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navItems.map((item) =>
                item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="inline-flex cursor-pointer items-center gap-3 py-2 text-left text-[calc(1.125rem-2px)] font-normal tracking-[0.04em] text-white/90 uppercase"
                    onClick={(event) => {
                      setMenuOpen(false);
                      if (!item.href) return;
                      event.preventDefault();
                      if (item.href === "#work") {
                        window.dispatchEvent(new Event(WORKS_GO_START_EVENT));
                      }
                      const target = document.getElementById(
                        item.href.slice(1),
                      );
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", item.href);
                      }
                    }}
                  >
                    <NavSeparator show={item.separator} />
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    className="inline-flex cursor-pointer items-center gap-3 py-2 text-left text-[calc(1.125rem-2px)] font-normal tracking-[0.04em] text-white/90 uppercase"
                    onClick={() => openPopup(item.label)}
                  >
                    <NavSeparator show={item.separator} />
                    {item.label}
                  </button>
                ),
              )}
            </nav>
          </div>
        ) : null}
      </header>

      {activePopup ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-5 md:bg-black/70 md:backdrop-blur-sm"
          role="presentation"
          onClick={() => setActivePopup(null)}
        >
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
            className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0c0907] p-8 text-white/90 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 inline-flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border border-white/25 px-3 text-sm tracking-[0.04em] uppercase transition-colors hover:border-white/50"
              onClick={() => setActivePopup(null)}
            >
              Close
            </button>
            <p className="text-[0.7rem] tracking-[0.18em] text-white/55 uppercase">
              {activePopup}
            </p>
            <h2
              id={`${dialogId}-title`}
              className="mt-3 text-2xl font-medium tracking-tight text-white/90 md:text-3xl"
            >
              Coming next
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
              This popup will hold the {activePopup.toLowerCase()} content.
              Design TBD.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
