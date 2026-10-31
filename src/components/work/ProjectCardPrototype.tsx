"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import type {
  Project,
  ProjectLayer,
  ProjectMedia,
  ProjectMediaImage,
} from "@/content/home";

const EMPTY_MEDIA: ProjectMedia[] = [];
import { AppRatingsChart } from "@/components/work/AppRatingsChart";
import { PhoenixFeatureGrid } from "@/components/work/PhoenixFeatureGrid";
import { RatingPromptDemo } from "@/components/work/RatingPromptDemo";
import { CaseStudyPopup } from "@/components/work/CaseStudyPopup";
import { ImagePlaceholder } from "@/components/work/ImagePlaceholder";
import { MetroWaitStickers } from "@/components/work/MetroWaitStickers";
import { DesignSystemSpecs } from "@/components/work/DesignSystemSpecs";
import { SahibindenImpactChart } from "@/components/work/SahibindenImpactChart";
import { SahibindenPhone } from "@/components/work/SahibindenPhone";
import { UeqNoveltyChart } from "@/components/work/UeqNoveltyChart";
import { UeqNoveltyStatic } from "@/components/work/UeqNoveltyStatic";

function StaticMediaImage({
  item,
  fitPanel,
  priority,
  onLoad,
}: {
  item: ProjectMediaImage;
  fitPanel: boolean;
  priority?: boolean;
  onLoad?: () => void;
}) {
  const scale = item.scale ?? 1;
  const fitTransparent = Boolean(item.transparent && fitPanel);
  // Layout-affecting scale (transform alone would still overflow / show a scrollbar).
  const sizedStyle =
    scale !== 1
      ? fitTransparent
        ? { width: `${scale * 100}%`, height: `${scale * 100}%` }
        : { width: `${scale * 100}%` }
      : undefined;

  return (
    <figure
      className={`group/static-media relative rounded-xl ${
        fitTransparent
          ? `mx-auto flex min-h-0 items-center justify-center overflow-hidden bg-transparent ${
              scale === 1 ? "h-full w-full" : ""
            }`
          : item.transparent
            ? "mx-auto w-full shrink-0 overflow-visible bg-transparent"
            : "mx-auto w-full shrink-0 overflow-visible bg-[#f4efe6] shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10"
      }`}
      style={sizedStyle}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="(max-width: 768px) 90vw, 45vw"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        className={`origin-center select-none transition-transform duration-300 ease-out [-webkit-user-drag:none] motion-safe:group-hover/static-media:scale-[1.025] ${
          fitTransparent
            ? "h-full max-h-full w-full object-contain object-center"
            : "h-auto w-full object-contain object-top"
        }`}
        onLoad={onLoad}
        priority={priority}
        unoptimized={item.src.endsWith(".gif")}
      />
    </figure>
  );
}

type LayerId = ProjectLayer["id"];

type ProjectCardPrototypeProps = {
  project: Project;
  /** True when this card is the centered / active carousel item. */
  carouselActive?: boolean;
  /** Stack / buttons only — hide the left media panel. */
  hideMedia?: boolean;
  /**
   * Keep stack boxes in the inactive (unclicked) look, but always show
   * the full body copy — used by the Faldium teaser card.
   */
  stackInactiveExpanded?: boolean;
  /** Replace “My role” with a static thumbnail or dashed placeholder. */
  thumbnail?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    /** Defaults to cover; use contain to show the full frame (zoom out). */
    fit?: "cover" | "contain";
    /** Thin border: white at 0.05 opacity. */
    framed?: boolean;
    placeholder?: {
      id: string;
      description: string;
    };
  };
  /** CTA label; defaults to “Open case study”. */
  ctaLabel?: string;
  /** Optional pager shown to the left of the CTA. */
  pager?: {
    current: number;
    total: number;
  };
  /**
   * Content-only slide for Other Works: thumbnail + stack, no card chrome,
   * ambient, CTA, or case-study popup (parent owns those).
   */
  embedded?: boolean;
};

type StackCardProps = {
  stackKey: string;
  label: string;
  body: string;
  isActive: boolean;
  /** Full body text even when visually inactive. */
  forceExpanded?: boolean;
  onActivate: () => void;
  role?: "tab";
  ariaSelected?: boolean;
  ariaExpanded?: boolean;
};

/** Active: full long copy. Inactive: same copy, max 2 lines + ellipsis. */
function StackCard({
  stackKey,
  label,
  body,
  isActive,
  forceExpanded = false,
  onActivate,
  role,
  ariaSelected,
  ariaExpanded,
}: StackCardProps) {
  const showFullBody = isActive || forceExpanded;

  return (
    <button
      type="button"
      data-stack-key={stackKey}
      role={role}
      aria-selected={ariaSelected}
      aria-expanded={ariaExpanded}
      tabIndex={forceExpanded ? -1 : undefined}
      className={`relative w-full shrink-0 rounded-xl px-4 text-left transition-[background-color,border-color,color,padding] duration-300 ease-out ${
        forceExpanded ? "cursor-inherit touch-pan-y" : "cursor-pointer"
      } ${
        isActive
          ? "border border-transparent bg-accent py-3 text-[#0c0907]"
          : "border border-[#312824] bg-[#0c0907] py-2.5 text-ink"
      }`}
      onClick={(event) => {
        if (forceExpanded) return;
        event.stopPropagation();
        onActivate();
      }}
      onPointerDown={(event) => {
        // Interactive stacks keep the gesture; teaser stacks let parents drag.
        if (!forceExpanded) {
          event.stopPropagation();
        }
      }}
    >
      <span
        className={`block min-w-0 max-w-full break-words text-[0.65rem] tracking-[0.14em] uppercase transition-colors duration-300 ease-out ${
          isActive ? "text-[#0c0907]/70" : "text-accent/85"
        }`}
      >
        {label}
      </span>
      <span
        className={`mt-1 text-sm leading-snug transition-opacity duration-300 ease-out ${
          showFullBody
            ? `block ${isActive ? "text-[#0c0907]" : "text-ink/85"}`
            : "overflow-hidden text-ink/85 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
        }`}
      >
        {body}
      </span>
    </button>
  );
}

function readScrollThumb(el: HTMLElement) {
  const { scrollTop, scrollHeight, clientHeight } = el;
  const overflowing = scrollHeight > clientHeight + 1;
  if (!overflowing) {
    return { overflowing: false, top: 0, height: clientHeight };
  }
  const height = Math.max(48, (clientHeight / scrollHeight) * clientHeight);
  const maxTop = clientHeight - height;
  const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop;
  return { overflowing: true, top, height };
}

function ScrollRail({
  scrollRef,
  thumb,
  controlsId,
  className = "",
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
  thumb: { top: number; height: number };
  controlsId: string;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollFromThumbTop = (thumbTop: number) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const maxThumbTop = track.clientHeight - thumb.height;
    if (maxScroll <= 0 || maxThumbTop <= 0) return;
    el.scrollTop =
      (Math.min(maxThumbTop, Math.max(0, thumbTop)) / maxThumbTop) * maxScroll;
  };

  const onThumbPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const el = scrollRef.current;
    if (!el) return;

    const pointerId = event.pointerId;
    const startY = event.clientY;
    const startTop = thumb.top;
    const target = event.currentTarget;
    target.setPointerCapture(pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      scrollFromThumbTop(startTop + (moveEvent.clientY - startY));
    };
    const onUp = () => {
      if (target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId);
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onTrackPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    event.stopPropagation();
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    scrollFromThumbTop(event.clientY - rect.top - thumb.height / 2);
  };

  return (
    <div
      ref={trackRef}
      role="scrollbar"
      aria-orientation="vertical"
      aria-controls={controlsId}
      aria-valuenow={Math.round(thumb.top)}
      aria-valuemin={0}
      className={`relative w-[6px] shrink-0 cursor-pointer rounded-full bg-[#0c0907] ${className}`}
      onPointerDown={onTrackPointerDown}
    >
      <div
        className="absolute top-0 left-0 w-full cursor-grab rounded-full bg-[#36281e] active:cursor-grabbing"
        style={{
          transform: `translateY(${thumb.top}px)`,
          height: thumb.height,
        }}
        onPointerDown={onThumbPointerDown}
      />
    </div>
  );
}

export function ProjectCardPrototype({
  project,
  carouselActive = false,
  hideMedia = false,
  stackInactiveExpanded = false,
  thumbnail,
  ctaLabel = "Open case study",
  pager,
  embedded = false,
}: ProjectCardPrototypeProps) {
  const defaultLayerId = project.layers[0]?.id ?? "context";
  const [active, setActive] = useState<LayerId>(defaultLayerId);
  const [overflowing, setOverflowing] = useState(false);
  const [thumb, setThumb] = useState({ top: 0, height: 48 });
  const [mediaOverflowing, setMediaOverflowing] = useState(false);
  const [mediaThumb, setMediaThumb] = useState({ top: 0, height: 48 });
  const [mediaVisible, setMediaVisible] = useState(true);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [displayedLayerId, setDisplayedLayerId] =
    useState<LayerId>(defaultLayerId);

  const measureRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaScrollRef = useRef<HTMLDivElement>(null);
  const mediaInnerRef = useRef<HTMLDivElement>(null);

  const stackScrollId = useId();
  const mediaScrollId = useId();

  const displayedLayer =
    project.layers.find((layer) => layer.id === displayedLayerId) ??
    project.layers[0];
  const activeMedia = displayedLayer?.media ?? EMPTY_MEDIA;
  const mediaFitsPanel =
    activeMedia.length > 0 &&
    activeMedia.every(
      (item) =>
        item.kind === "metro-wait" ||
        item.kind === "ueq-novelty" ||
        item.kind === "ueq-static" ||
        item.kind === "rating-prompts" ||
        item.kind === "sahibinden-phone" ||
        item.kind === "design-system-specs" ||
        item.kind === "sahibinden-impact" ||
        ((item.kind === undefined || item.kind === "image") &&
          "transparent" in item &&
          item.transparent),
    );

  // Soft fade when left media swaps with the selected layer (300ms).
  useEffect(() => {
    if (active === displayedLayerId) return;

    let swap = 0;
    const start = window.setTimeout(() => {
      setMediaVisible(false);
      swap = window.setTimeout(() => {
        setDisplayedLayerId(active);
        requestAnimationFrame(() => setMediaVisible(true));
      }, 300);
    }, 0);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(swap);
    };
  }, [active, displayedLayerId]);

  const syncThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const next = readScrollThumb(el);
    setOverflowing(next.overflowing);
    setThumb({ top: next.top, height: next.height });
  }, []);

  const syncMediaThumb = useCallback(() => {
    const el = mediaScrollRef.current;
    if (!el) return;
    const next = readScrollThumb(el);
    setMediaOverflowing(next.overflowing);
    setMediaThumb({ top: next.top, height: next.height });
  }, []);

  /** Pin the opened stack item to the top of the scroll viewport. */
  const scrollOpenedIntoView = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const button = scrollEl.querySelector(`[data-stack-key="${active}"]`);
    if (!(button instanceof HTMLElement)) {
      syncThumb();
      return;
    }

    scrollEl.scrollTop +=
      button.getBoundingClientRect().top - scrollEl.getBoundingClientRect().top;
    syncThumb();
  }, [active, syncThumb]);

  /** Exclusive selection — never toggles closed; switching collapses the previous card. */
  const selectLayer = (id: LayerId) => {
    setActive(id);
  };

  // Global rule: stack fills remaining card height (flex-1 min-h-0).
  // When opened layer content exceeds that height, show custom scroll (all cards).
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      scrollOpenedIntoView();
    });
    return () => cancelAnimationFrame(id);
  }, [active, scrollOpenedIntoView]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      syncThumb();
    });
    observer.observe(el);
    if (measureRef.current) observer.observe(measureRef.current);
    return () => observer.disconnect();
  }, [syncThumb]);

  useLayoutEffect(() => {
    const el = mediaScrollRef.current;
    if (el) el.scrollTop = 0;
    const id = requestAnimationFrame(() => syncMediaThumb());
    return () => cancelAnimationFrame(id);
  }, [displayedLayerId, activeMedia, syncMediaThumb]);

  useLayoutEffect(() => {
    const el = mediaScrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      syncMediaThumb();
    });
    observer.observe(el);
    if (mediaInnerRef.current) observer.observe(mediaInnerRef.current);
    return () => observer.disconnect();
  }, [syncMediaThumb]);

  const stackItems = project.layers.map((layer) => {
    const isActive = stackInactiveExpanded ? false : layer.id === active;
    return {
      key: layer.id,
      label: layer.label,
      body: layer.more,
      isActive,
      forceExpanded: stackInactiveExpanded,
      role: "tab" as const,
      ariaSelected: isActive,
      onActivate: () => {
        if (stackInactiveExpanded) return;
        selectLayer(layer.id);
      },
    };
  });

  const stackBlock = (
    <div
      className={`flex min-h-0 flex-1 ${overflowing ? "gap-[14px]" : "gap-0"}`}
    >
      <div
        id={stackScrollId}
        ref={scrollRef}
        className="outcome-stack-scroll min-h-0 min-w-0 flex-1 overscroll-contain"
        role="tablist"
        aria-label={`${project.title} story layers`}
        onScroll={syncThumb}
      >
        <div ref={measureRef} className="flex flex-col gap-4">
          {stackItems.map((item) => (
            <StackCard
              key={item.key}
              stackKey={item.key}
              label={item.label}
              body={item.body}
              isActive={item.isActive}
              forceExpanded={item.forceExpanded}
              role={item.role}
              ariaSelected={item.ariaSelected}
              onActivate={item.onActivate}
            />
          ))}
        </div>
      </div>

      {overflowing ? (
        <ScrollRail
          scrollRef={scrollRef}
          thumb={thumb}
          controlsId={stackScrollId}
          className="self-stretch"
        />
      ) : null}
    </div>
  );

  const thumbnailBlock = thumbnail?.placeholder ? (
    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl">
      <ImagePlaceholder
        id={thumbnail.placeholder.id}
        description={thumbnail.placeholder.description}
        aspectRatio="4 / 3"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black/20"
        aria-hidden
      />
    </div>
  ) : thumbnail?.src ? (
    <div
      className={`relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-[#0c0907] ${
        thumbnail.framed ? "border border-white/5" : ""
      }`}
    >
      <Image
        src={thumbnail.src}
        alt={thumbnail.alt ?? ""}
        width={thumbnail.width ?? 1024}
        height={thumbnail.height ?? 768}
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        className={`h-full w-full select-none [-webkit-user-drag:none] ${
          thumbnail.fit === "contain"
            ? "object-contain object-center"
            : "object-cover object-top"
        }`}
        sizes="(max-width: 768px) 90vw, 25vw"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black/20"
        aria-hidden
      />
    </div>
  ) : (
    <div className="shrink-0">
      <p className="text-[0.7rem] tracking-[0.16em] text-ink-muted uppercase">
        My role
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
        {project.role}
      </p>
    </div>
  );

  if (embedded) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col gap-5 px-6 pb-2 pt-6 md:px-8 md:pt-8">
        {thumbnailBlock}
        {stackBlock}
      </div>
    );
  }

  return (
    <article
      className={`group relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.25rem] border border-line shadow-[0_28px_70px_rgba(0,0,0,0.35)] ${
        hideMedia ? "bg-surface" : "bg-surface-elevated"
      }`}
    >
      {/* Equal carousel height from leftmost card; left fills and scrolls. */}
      <div
        className={`grid h-full min-h-0 ${
          hideMedia ? "grid-cols-1" : "md:grid-cols-[1.15fr_0.85fr]"
        }`}
      >
        {hideMedia ? null : (
        <div className="relative min-h-[18rem] bg-[#1a1612] text-white/90 md:min-h-0">
          <div className="flex h-[18rem] flex-col overflow-hidden p-6 md:absolute md:inset-0 md:h-auto md:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background: `radial-gradient(circle at 70% 30%, ${project.accent}, transparent 45%), linear-gradient(145deg, #2a221b, #0f0c0a 70%)`,
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 shrink-0">
              <div className="flex h-7 items-center gap-2 md:h-8 md:gap-3">
                {project.logo ? (
                  <Image
                    src={project.logo.src}
                    alt={project.logo.alt}
                    width={project.hideTitle ? 157 : 31}
                    height={project.hideTitle ? 34 : 31}
                    unoptimized={project.logo.src.endsWith(".svg")}
                    draggable={false}
                    onDragStart={(event) => event.preventDefault()}
                    className={
                      project.hideTitle
                        ? "h-7 w-auto max-w-[8.4rem] select-none object-contain [-webkit-user-drag:none] md:h-8 md:max-w-[9.8rem]"
                        : "h-7 w-auto shrink-0 select-none object-contain [-webkit-user-drag:none] md:h-8"
                    }
                  />
                ) : null}
                {project.hideTitle ? (
                  <h3 className="sr-only">{project.title}</h3>
                ) : (
                  <h3 className="text-[1.408rem] font-medium leading-none tracking-tight text-white/90 md:text-[1.933rem]">
                    {project.title}
                  </h3>
                )}
              </div>
              {project.subtitle ? (
                <p className="mt-4 max-w-md whitespace-pre-line text-xs leading-relaxed text-white/65 md:text-[0.8rem]">
                  {project.subtitle}
                </p>
              ) : null}
            </div>

            <div
              className={`relative z-10 flex min-h-0 flex-1 gap-[14px] ${
                project.subtitle ? "mt-4 md:mt-5" : "mt-6"
              }`}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onWheel={(event) => {
                event.stopPropagation();
              }}
            >
              <div
                id={mediaScrollId}
                ref={mediaScrollRef}
                className="project-media-scroll min-h-0 min-w-0 flex-1"
                aria-label={`${project.title} visuals`}
                onScroll={syncMediaThumb}
              >
                <div
                  ref={mediaInnerRef}
                  className={`flex flex-col transition-opacity duration-300 ease-out ${
                    mediaFitsPanel
                      ? "h-full min-h-0 items-center justify-center"
                      : "gap-4 pb-1"
                  } ${mediaVisible ? "opacity-100" : "opacity-0"}`}
                >
                  {activeMedia.length ? (
                    <>
                      {activeMedia.map((item, index) => {
                        if (item.kind === "phoenix-grid") {
                          return <PhoenixFeatureGrid key="phoenix-grid" />;
                        }
                        if (item.kind === "rating-prompts") {
                          return <RatingPromptDemo key="rating-prompts" />;
                        }
                        if (item.kind === "chart") {
                          return (
                            <AppRatingsChart
                              key={item.chartId}
                              chartId={item.chartId}
                            />
                          );
                        }
                        if (item.kind === "ueq-novelty") {
                          return (
                            <UeqNoveltyChart
                              key="ueq-novelty"
                              active={carouselActive}
                            />
                          );
                        }
                        if (item.kind === "metro-wait") {
                          return <MetroWaitStickers key="metro-wait" />;
                        }
                        if (item.kind === "ueq-static") {
                          return (
                            <UeqNoveltyStatic
                              key="ueq-static"
                              active={carouselActive}
                            />
                          );
                        }
                        if (item.kind === "sahibinden-phone") {
                          return (
                            <SahibindenPhone
                              key={`sahibinden-phone-${item.variant ?? "challenge"}`}
                              variant={item.variant ?? "challenge"}
                            />
                          );
                        }
                        if (item.kind === "design-system-specs") {
                          return (
                            <DesignSystemSpecs key="design-system-specs" />
                          );
                        }
                        if (item.kind === "sahibinden-impact") {
                          return (
                            <SahibindenImpactChart key="sahibinden-impact" />
                          );
                        }
                        return (
                          <StaticMediaImage
                            key={item.src}
                            item={item}
                            fitPanel={mediaFitsPanel}
                            onLoad={syncMediaThumb}
                            priority={index === 0}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <div className="flex min-h-[12rem] flex-col justify-end rounded-xl border border-white/10 bg-white/[0.04] p-5">
                      <p className="text-sm leading-relaxed text-white/70 md:text-base">
                        {displayedLayer.detail}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative w-[6px] shrink-0 self-stretch">
                {mediaOverflowing ? (
                  <ScrollRail
                    scrollRef={mediaScrollRef}
                    thumb={mediaThumb}
                    controlsId={mediaScrollId}
                    className="absolute inset-0 h-full"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
        )}

        <div
          className={`relative z-10 flex h-full min-h-0 flex-col gap-5 p-6 md:p-8 ${
            hideMedia ? "overflow-hidden bg-surface" : "bg-[#16110e]"
          }`}
        >
          {hideMedia ? (
            <div
              className="pointer-events-none absolute inset-0 opacity-55"
              style={{
                background: `radial-gradient(ellipse 48% 36% at 78% 18%, ${project.accent}, transparent 70%)`,
              }}
              aria-hidden="true"
            />
          ) : null}

          <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-5">
            {thumbnailBlock}
            {stackBlock}

            <div className="mt-auto flex shrink-0 items-center justify-between gap-3">
              {pager ? (
                <p className="shrink-0 text-sm tracking-wide text-ink-muted tabular-nums">
                  {pager.current} / {pager.total}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => setCaseStudyOpen(true)}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-ink/40 px-5 text-sm font-medium tracking-wide text-ink transition-colors hover:border-accent hover:bg-accent hover:text-[#0c0907] ${
                  pager ? "ml-auto" : "w-full justify-between"
                }`}
              >
                {ctaLabel.replace(/\s*→\s*$/, "")}
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CaseStudyPopup
        project={project}
        open={caseStudyOpen}
        onClose={() => setCaseStudyOpen(false)}
      />
    </article>
  );
}
