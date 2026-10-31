"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects, WORKS_GO_START_EVENT } from "@/content/home";
import { ProjectCardPrototype } from "@/components/work/ProjectCardPrototype";

type DragState = {
  pointerId: number | null;
  startX: number;
  startScroll: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  dragging: boolean;
  moved: boolean;
};

const DRAG_THRESHOLD = 6;

export function WorkCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const momentumRef = useRef<number | null>(null);
  const dragRef = useRef<DragState>({
    pointerId: null,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    dragging: false,
    moved: false,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const stopMomentum = useCallback(() => {
    if (momentumRef.current !== null) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = null;
    }
  }, []);

  const getCards = () =>
    Array.from(
      trackRef.current?.querySelectorAll<HTMLElement>("[data-card]") ?? [],
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

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    setActiveIndex(nearest);
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
      left: Math.max(0, Math.min(track.scrollWidth - track.clientWidth, target)),
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

  /**
   * LOCKED: first card natural height − 30px.
   * Do not change the offset unless Özgür explicitly sets a new value.
   */
  const CARD_HEIGHT_OFFSET_PX = 30;

  const syncCardHeights = useCallback(() => {
    const cards = getCards();
    if (!cards.length) return;

    cards.forEach((card) => {
      card.style.height = "auto";
    });

    const measured = Math.round(cards[0].getBoundingClientRect().height);
    const standard = Math.max(1, measured - CARD_HEIGHT_OFFSET_PX);
    if (measured < 1) return;

    cards.forEach((card) => {
      card.style.height = `${standard}px`;
    });
  }, []);

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
    const goStart = () => {
      stopMomentum();
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({ left: 0, behavior: "smooth" });
      setActiveIndex(0);
    };
    window.addEventListener(WORKS_GO_START_EVENT, goStart);
    return () => window.removeEventListener(WORKS_GO_START_EVENT, goStart);
  }, [stopMomentum]);

  useEffect(() => {
    const sync = () => {
      requestAnimationFrame(() => syncCardHeights());
    };

    sync();
    window.addEventListener("resize", sync);

    // Remeasure after fonts/images settle
    const t1 = window.setTimeout(sync, 120);
    const t2 = window.setTimeout(sync, 500);

    return () => {
      window.removeEventListener("resize", sync);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [syncCardHeights]);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    stopMomentum();
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 32 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      // Let buttons/links inside cards receive normal clicks — don't capture.
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(
          "button, a, input, textarea, select, label, [role='tab'], [data-stack-key]",
        )
      ) {
        return;
      }

      stopMomentum();

      const now = performance.now();
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startScroll: track.scrollLeft,
        lastX: event.clientX,
        lastTime: now,
        velocity: 0,
        dragging: true,
        moved: false,
      };

      track.setPointerCapture(event.pointerId);
      setIsDragging(true);
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag.dragging || drag.pointerId !== event.pointerId) return;

      const now = performance.now();
      const totalDelta = event.clientX - drag.startX;
      const frameDelta = event.clientX - drag.lastX;
      const frameTime = Math.max(1, now - drag.lastTime);

      if (!drag.moved && Math.abs(totalDelta) >= DRAG_THRESHOLD) {
        drag.moved = true;
        track.classList.add("is-dragging");
      }

      if (!drag.moved) return;

      event.preventDefault();
      track.scrollLeft = drag.startScroll - totalDelta;
      drag.velocity = (frameDelta / frameTime) * 16.67;
      drag.lastX = event.clientX;
      drag.lastTime = now;
    };

    const onPointerUp = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag.dragging || drag.pointerId !== event.pointerId) return;

      const releaseVelocity = drag.velocity;
      const didMove = drag.moved;

      try {
        track.releasePointerCapture(event.pointerId);
      } catch {
        // already released
      }

      drag.dragging = false;
      drag.pointerId = null;
      track.classList.remove("is-dragging");
      setIsDragging(false);

      if (didMove) {
        startMomentum(releaseVelocity);
      } else {
        snapToNearest();
      }
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove, { passive: false });
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);

    return () => {
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
    };
  }, [snapToNearest, startMomentum, stopMomentum]);

  return (
    <div className="mx-auto w-full max-w-[72rem]">
      <p className="mb-5 text-sm text-ink-muted md:mb-6">
        {activeIndex + 1} / {projects.length}
      </p>

      <div className="relative">
        <div className="min-w-0 overflow-hidden">
          <div
            ref={trackRef}
            className={`work-carousel-track flex gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              isDragging
                ? "cursor-grabbing snap-none scroll-auto select-none"
                : "cursor-grab snap-x snap-mandatory scroll-smooth"
            }`}
            style={{ touchAction: "pan-y" }}
            aria-label="Selected portfolio projects"
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
            {projects.map((project, index) => (
              <div
                key={project.slug}
                data-card
                id={project.slug}
                className="flex w-[92%] shrink-0 snap-center sm:w-[88%] md:w-[84%] lg:w-[80%]"
              >
                <div className="flex min-h-0 w-full flex-1 flex-col">
                  <ProjectCardPrototype
                    project={project}
                    carouselActive={index === activeIndex}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous project"
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
          className="absolute top-1/2 left-0 z-20 inline-flex h-11 w-11 -translate-x-[calc(100%+0.75rem)] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-elevated text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35 md:-translate-x-[calc(100%+1.25rem)]"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ←
          </span>
        </button>

        <button
          type="button"
          aria-label="Next project"
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
          className="absolute top-1/2 right-0 z-20 inline-flex h-11 w-11 translate-x-[calc(100%+0.75rem)] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface-elevated text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-35 md:translate-x-[calc(100%+1.25rem)]"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
