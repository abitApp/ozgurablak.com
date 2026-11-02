"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ProjectCardPrototype } from "@/components/work/ProjectCardPrototype";
import { faldiumProject, projects, type Project } from "@/content/home";
import type {
  OtherWork,
  OtherWorksCategoryData,
} from "@/content/otherWorks";
import { readWorkLink } from "@/lib/caseStudyShare";

const CaseStudyPopup = dynamic(
  () =>
    import("@/components/work/CaseStudyPopup").then((mod) => mod.CaseStudyPopup),
  { ssr: false },
);

type OtherWorksSliderProps = {
  categories: OtherWorksCategoryData[];
};

type DragState = {
  pointerId: number | null;
  startX: number;
  startY: number;
  startScroll: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  pending: boolean;
  dragging: boolean;
  moved: boolean;
};

const DRAG_THRESHOLD = 8;
/** Match CaseStudyPopup close fade before opening a bridged study. */
const WORK_MODAL_FADE_MS = 300;

function workToProject(work: OtherWork): Project {
  return {
    ...faldiumProject,
    slug: work.id,
    title: work.title,
    hideTitle: true,
    accent: work.accent,
    role: "",
    summary: work.body,
    layers: [
      {
        id: "context",
        label: work.label,
        detail: work.body,
        more: work.body,
      },
    ],
  };
}

function workThumbnail(work: OtherWork) {
  if (!work.poster) return undefined;
  if (work.poster.kind === "placeholder") {
    return {
      placeholder: {
        id: work.poster.id,
        description: work.poster.description,
      },
    };
  }
  return {
    src: work.poster.src,
    alt: work.poster.alt,
    width: work.poster.width,
    height: work.poster.height,
    fit: work.poster.fit,
    framed: work.poster.framed,
  };
}

function CategoryCardSlider({
  category,
  onCardHoverChange,
}: {
  category: OtherWorksCategoryData;
  onCardHoverChange?: (hovered: boolean) => void;
}) {
  const { works } = category;
  const total = works.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const momentumRef = useRef<number | null>(null);
  const dragRef = useRef<DragState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    startScroll: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    pending: false,
    dragging: false,
    moved: false,
  });

  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(total > 1);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [caseStudyMounted, setCaseStudyMounted] = useState(false);
  const [modalWork, setModalWork] = useState<OtherWork | null>(null);
  const [bridgedStudy, setBridgedStudy] = useState<{
    slug: string;
    sectionId: string;
  } | null>(null);
  const bridgeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (caseStudyOpen) {
      setCaseStudyMounted(true);
      return;
    }
    if (!caseStudyMounted) return;
    const timer = window.setTimeout(
      () => setCaseStudyMounted(false),
      WORK_MODAL_FADE_MS + 20,
    );
    return () => window.clearTimeout(timer);
  }, [caseStudyOpen, caseStudyMounted]);

  const activeWork = works[index] ?? works[0];
  const openWork = modalWork ?? activeWork;
  const activeAccent = activeWork?.accent ?? "rgba(200, 145, 80, 0.3)";
  const bridgedProject = bridgedStudy
    ? projects.find((item) => item.slug === bridgedStudy.slug)
    : undefined;

  const clearBridgeTimer = useCallback(() => {
    if (bridgeTimerRef.current !== null) {
      window.clearTimeout(bridgeTimerRef.current);
      bridgeTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearBridgeTimer(), [clearBridgeTimer]);

  // Open this category's work when `?work=` matches.
  useEffect(() => {
    const apply = () => {
      const workId = readWorkLink();
      if (!workId) return;
      const matchIndex = works.findIndex((item) => item.id === workId);
      if (matchIndex < 0) return;
      const match = works[matchIndex];
      if (!match) return;
      clearBridgeTimer();
      setIndex(matchIndex);
      setModalWork(match);
      setCaseStudyOpen(true);
    };
    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, [works, clearBridgeTimer]);

  const stopMomentum = useCallback(() => {
    if (momentumRef.current !== null) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  }, []);

  const getCards = () =>
    Array.from(
      trackRef.current?.querySelectorAll<HTMLElement>("[data-other-slide]") ??
        [],
    );

  const updateState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < maxScroll - 8);

    const cards = getCards();
    if (!cards.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, cardIndex) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = cardIndex;
      }
    });

    setIndex(nearest);
  }, []);

  const snapToNearest = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = getCards();
    if (!cards.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    let nearestCard = cards[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestCard = card;
      }
    });

    const target =
      nearestCard.offsetLeft -
      (track.clientWidth - nearestCard.offsetWidth) / 2;

    track.scrollTo({
      left: Math.max(
        0,
        Math.min(track.scrollWidth - track.clientWidth, target),
      ),
      behavior: "smooth",
    });
  }, []);

  const startMomentum = useCallback(
    (initialVelocity: number) => {
      const track = trackRef.current;
      if (!track) return;

      stopMomentum();

      let velocity = initialVelocity;
      const friction = 0.94;
      const minVelocity = 0.12;

      const step = () => {
        if (Math.abs(velocity) < minVelocity) {
          momentumRef.current = null;
          snapToNearest();
          return;
        }

        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const next = track.scrollLeft - velocity;
        track.scrollLeft = Math.min(maxScroll, Math.max(0, next));

        if (track.scrollLeft <= 0 || track.scrollLeft >= maxScroll) {
          momentumRef.current = null;
          snapToNearest();
          return;
        }

        velocity *= friction;
        momentumRef.current = requestAnimationFrame(step);
      };

      momentumRef.current = requestAnimationFrame(step);
    },
    [snapToNearest, stopMomentum],
  );

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    stopMomentum();
    const card = track.querySelector<HTMLElement>("[data-other-slide]");
    const amount = card ? card.offsetWidth : track.clientWidth;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateState();
    track.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      track.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
      stopMomentum();
    };
  }, [stopMomentum, updateState]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || total <= 1) return;

    const resetDrag = () => {
      dragRef.current.pending = false;
      dragRef.current.dragging = false;
      dragRef.current.moved = false;
      dragRef.current.pointerId = null;
      track.classList.remove("is-dragging");
      setIsDragging(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      // Mouse/pen: no drag — it fights page scroll over the card. Touch swipes.
      if (event.pointerType !== "touch") return;

      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("a, input, textarea, select, label, [data-drag-ignore]")
      ) {
        return;
      }

      stopMomentum();

      const now = performance.now();
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startScroll: track.scrollLeft,
        lastX: event.clientX,
        lastTime: now,
        velocity: 0,
        pending: true,
        dragging: false,
        moved: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.pointerId !== event.pointerId) return;
      if (!drag.pending && !drag.dragging) return;

      const totalDx = event.clientX - drag.startX;
      const totalDy = event.clientY - drag.startY;

      if (drag.pending && !drag.dragging) {
        if (Math.hypot(totalDx, totalDy) < DRAG_THRESHOLD) return;

        if (Math.abs(totalDy) > Math.abs(totalDx)) {
          resetDrag();
          return;
        }

        drag.pending = false;
        drag.dragging = true;
        drag.moved = true;
        drag.startScroll = track.scrollLeft;
        drag.startX = event.clientX;
        drag.lastX = event.clientX;
        try {
          track.setPointerCapture(event.pointerId);
        } catch {
          // ignore
        }
        track.classList.add("is-dragging");
        setIsDragging(true);
      }

      if (!drag.dragging) return;

      const now = performance.now();
      const frameDelta = event.clientX - drag.lastX;
      const frameTime = Math.max(1, now - drag.lastTime);
      const scrollDx = event.clientX - drag.startX;

      event.preventDefault();
      track.scrollLeft = drag.startScroll - scrollDx;
      drag.velocity = (frameDelta / frameTime) * 16.67;
      drag.lastX = event.clientX;
      drag.lastTime = now;
    };

    const onPointerUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (drag.pointerId !== event.pointerId) return;

      const releaseVelocity = drag.velocity;
      const didMove = drag.moved;

      try {
        if (track.hasPointerCapture(event.pointerId)) {
          track.releasePointerCapture(event.pointerId);
        }
      } catch {
        // already released
      }

      resetDrag();

      if (didMove) {
        startMomentum(releaseVelocity);
      }
    };

    const onWheel = (event: WheelEvent) => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      if (maxScroll <= 0) return;

      const horizontal =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.shiftKey
            ? event.deltaY
            : 0;
      if (horizontal === 0) return;

      const next = Math.min(
        maxScroll,
        Math.max(0, track.scrollLeft + horizontal),
      );
      if (next === track.scrollLeft) return;

      event.preventDefault();
      stopMomentum();
      track.scrollLeft = next;
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove, { passive: false });
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("wheel", onWheel);
    };
  }, [startMomentum, stopMomentum, total]);

  if (!total || !activeWork) return null;

  return (
    <div className="flex h-full min-w-0 w-full flex-col gap-3">
      <p className="shrink-0 text-[0.7rem] tracking-[0.16em] text-ink-muted uppercase">
        {category.label}
      </p>

      <article
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.25rem] border border-line bg-surface shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
        onMouseEnter={() => onCardHoverChange?.(true)}
        onMouseLeave={() => onCardHoverChange?.(false)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-55"
          style={{
            background: `radial-gradient(ellipse 48% 36% at 78% 18%, ${activeAccent}, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 min-h-0 min-w-0 flex-1 overflow-hidden">
          <div
            ref={trackRef}
            className={`flex h-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isDragging
                ? "snap-none scroll-auto select-none"
                : "snap-x snap-mandatory scroll-smooth"
            }`}
            style={{ touchAction: "pan-x pan-y" }}
            aria-label={`${category.label} works`}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                scrollByCard(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                scrollByCard(1);
              }
            }}
            onClickCapture={(event) => {
              if (dragRef.current.moved) {
                event.preventDefault();
                event.stopPropagation();
                dragRef.current.moved = false;
              }
            }}
          >
            {works.map((work, slideIndex) => (
              <div
                key={work.id}
                data-other-slide
                className="flex h-full w-full shrink-0 snap-center flex-col"
                aria-hidden={slideIndex !== index}
              >
                <ProjectCardPrototype
                  project={workToProject(work)}
                  carouselActive={slideIndex === index}
                  hideMedia
                  stackInactiveExpanded
                  embedded
                  thumbnail={workThumbnail(work)}
                />
              </div>
            ))}
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                data-drag-ignore
                aria-label={`Previous ${category.label}`}
                disabled={!canPrev}
                onClick={() => scrollByCard(-1)}
                className="absolute top-1/2 left-2 z-20 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/45 text-white/90 transition-colors hover:border-white/50 hover:bg-black/65 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span aria-hidden="true" className="text-sm leading-none">
                  ←
                </span>
              </button>
              <button
                type="button"
                data-drag-ignore
                aria-label={`Next ${category.label}`}
                disabled={!canNext}
                onClick={() => scrollByCard(1)}
                className="absolute top-1/2 right-2 z-20 inline-flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/45 text-white/90 transition-colors hover:border-white/50 hover:bg-black/65 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <span aria-hidden="true" className="text-sm leading-none">
                  →
                </span>
              </button>
            </>
          ) : null}
        </div>

        <div className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-6 pb-6 pt-4 md:px-8 md:pb-8">
          <p className="shrink-0 text-sm tracking-wide text-ink-muted tabular-nums">
            {index + 1} / {total}
          </p>
          <button
            type="button"
            onClick={() => {
              clearBridgeTimer();
              setModalWork(activeWork);
              setCaseStudyOpen(true);
            }}
            className="ml-auto inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-ink/40 px-5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-accent hover:bg-accent hover:text-[#0c0907]"
          >
            View work
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>

      {caseStudyMounted && openWork ? (
        <CaseStudyPopup
          project={workToProject(openWork)}
          work={openWork}
          open={caseStudyOpen}
          onClose={() => setCaseStudyOpen(false)}
          hideNav
          onNavigateWork={setModalWork}
          onOpenCaseStudy={(target) => {
            clearBridgeTimer();
            setCaseStudyOpen(false);
            // Wait for work-modal fade-out, then fade the case study in.
            bridgeTimerRef.current = window.setTimeout(() => {
              bridgeTimerRef.current = null;
              setBridgedStudy(target);
            }, WORK_MODAL_FADE_MS);
          }}
        />
      ) : null}

      {bridgedProject && bridgedStudy ? (
        <CaseStudyPopup
          project={bridgedProject}
          open
          initialSectionId={bridgedStudy.sectionId}
          onClose={() => {
            clearBridgeTimer();
            setBridgedStudy(null);
          }}
        />
      ) : null}
    </div>
  );
}

export function OtherWorksSlider({ categories }: OtherWorksSliderProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!categories.length) return null;

  return (
    <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
      {categories.map((category) => {
        const dimOthers =
          hoveredId !== null && hoveredId !== category.id;
        return (
          <div
            key={category.id}
            className={`flex h-full min-w-0 flex-col transition-[opacity,filter] duration-300 ease-out ${
              dimOthers
                ? "md:opacity-70 md:blur-[2px]"
                : "md:opacity-100 md:blur-none"
            }`}
          >
            <CategoryCardSlider
              category={category}
              onCardHoverChange={(hovered) => {
                if (hovered) {
                  setHoveredId(category.id);
                  return;
                }
                setHoveredId((current) =>
                  current === category.id ? null : current,
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
