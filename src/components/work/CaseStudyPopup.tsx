"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  dummyCaseStudy,
  type CaseStudySectionId,
} from "@/content/case-study-dummy";
import {
  getCaseStudy,
  type CaseStudy,
  type CaseStudyImageSlot,
  type CaseStudyMenuItem,
  type CaseStudySection,
} from "@/content/caseStudies";
import type { Project } from "@/content/home";
import {
  getAdjacentOtherWorks,
  OTHER_WORK_CATEGORY_LABEL,
  type OtherWork,
  type OtherWorkMedia,
} from "@/content/otherWorks";
import Image from "next/image";
import { AndroidPhoneFrame } from "@/components/work/AndroidPhoneFrame";
import { ImagePlaceholder } from "@/components/work/ImagePlaceholder";
import {
  trackModalClose,
  trackModalView,
  type ModalAnalyticsPayload,
} from "@/lib/analytics";

type CaseStudyPopupProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
  /**
   * Other Works (Concepts / UI Animation / 3D): single-pane modal —
   * no left sidebar or mobile section switcher.
   */
  hideNav?: boolean;
  /** Work modal payload for Other Works cards. */
  work?: OtherWork;
  /** When opening a portfolio study, land on this section if it exists. */
  initialSectionId?: string;
  /** Work-modal link: open another case study (closes work modal first via parent). */
  onOpenCaseStudy?: (target: { slug: string; sectionId: string }) => void;
  /** Work-modal prev/next: swap to a sibling work in the same category. */
  onNavigateWork?: (work: OtherWork) => void;
};

const DUMMY_NAV_INDEX: Record<CaseStudySectionId, string> = {
  overview: "01",
  research: "02",
  insights: "03",
  design: "04",
  validation: "05",
  solution: "06",
  impact: "07",
};

const FADE_MS = 300;

const SECTION_CUE = "#C89150";

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

function CaseStudyScrollRail({
  scrollRef,
  thumb,
  controlsId,
  overflowing,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
  thumb: { top: number; height: number };
  controlsId: string;
  /** Keep rail width reserved even when hidden — avoids content width thrash. */
  overflowing: boolean;
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
      aria-hidden={!overflowing}
      className={`relative w-[6px] shrink-0 rounded-full bg-[#171412] ${
        overflowing
          ? "cursor-pointer opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onPointerDown={overflowing ? onTrackPointerDown : undefined}
    >
      {overflowing ? (
        <div
          className="absolute top-0 left-0 w-full cursor-grab rounded-full bg-[#43362F] active:cursor-grabbing"
          style={{
            transform: `translateY(${thumb.top}px)`,
            height: thumb.height,
          }}
          onPointerDown={onThumbPointerDown}
        />
      ) : null}
    </div>
  );
}

function getFocusable(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
}

/** Pointer activation without leaving a sticky focus ring; keyboard still focuses. */
function suppressMouseFocus(event: ReactPointerEvent<HTMLButtonElement>) {
  if (event.pointerType === "mouse" || event.pointerType === "touch") {
    event.preventDefault();
  }
}

const NAV_PILL_CLASS =
  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-full px-3.5 py-[0.55rem] text-left text-[0.8rem] outline-none transition-[color,background-color,border-color,opacity] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus)]";

function PortfolioSidebarNav({
  menu,
  activeId,
  activeChildId,
  onSelectSection,
  onSelectChild,
  sectionButtonRefs,
}: {
  menu: CaseStudyMenuItem[];
  activeId: string;
  activeChildId: string | null;
  onSelectSection: (id: string) => void;
  onSelectChild: (sectionId: string, childId: string) => void;
  sectionButtonRefs?: MutableRefObject<
    Record<string, HTMLButtonElement | null>
  >;
}) {
  return (
    <nav
      className="mt-9 flex min-h-0 flex-1 flex-col gap-0.5"
      aria-label="Case study sections"
    >
      {menu.map((item) => {
        const isActive = item.id === activeId;
        const showChildren =
          Boolean(item.children?.length) &&
          (!item.childrenOnlyWhenActive || isActive);
        return (
          <div key={item.id} className="flex flex-col">
            <button
              type="button"
              ref={(el) => {
                if (sectionButtonRefs) {
                  sectionButtonRefs.current[item.id] = el;
                }
              }}
              onPointerDown={suppressMouseFocus}
              onClick={() => onSelectSection(item.id)}
              className={`${NAV_PILL_CLASS} ${
                isActive
                  ? "border border-[#C89150] bg-[#29221E] text-[#F3EEE8]"
                  : "border border-transparent text-[#BDB0A5] hover:text-[#F3EEE8]"
              }`}
              aria-current={isActive ? "true" : undefined}
            >
              <span className="min-w-0 truncate">
                <span className="tabular-nums opacity-70">{item.number}</span>{" "}
                {item.label}
              </span>
              <span
                aria-hidden="true"
                className={`shrink-0 text-[0.85rem] text-[#C89150] transition-opacity duration-300 ease-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                →
              </span>
            </button>
            {showChildren ? (
              <ul className="mt-0.5 mb-1 ml-5 flex flex-col gap-0.5 border-l border-[#43362F] pl-3">
                {item.children!.map((child) => {
                  const isChildActive =
                    isActive && activeChildId === child.id;
                  return (
                    <li key={child.id}>
                      <button
                        type="button"
                        onPointerDown={suppressMouseFocus}
                        onClick={() => onSelectChild(item.id, child.id)}
                        className={`w-full cursor-pointer rounded-md px-2 py-1 text-left text-[0.68rem] leading-snug outline-none transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] ${
                          isChildActive
                            ? "text-[#C89150]"
                            : "text-[#BDB0A5] hover:text-[#F3EEE8]"
                        }`}
                        aria-current={isChildActive ? "true" : undefined}
                      >
                        {child.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

function DummySidebarNav({
  sections,
  activeId,
  onSelectSection,
}: {
  sections: typeof dummyCaseStudy.sections;
  activeId: string;
  onSelectSection: (id: CaseStudySectionId) => void;
}) {
  return (
    <nav
      className="mt-9 flex min-h-0 flex-1 flex-col gap-0.5"
      aria-label="Case study sections"
    >
      {sections.map((item) => {
        const isActive = item.id === activeId;
        const num = DUMMY_NAV_INDEX[item.id];
        return (
          <button
            key={item.id}
            type="button"
            onPointerDown={suppressMouseFocus}
            onClick={() => onSelectSection(item.id)}
            className={`${NAV_PILL_CLASS} ${
              isActive
                ? "border border-[#C89150] bg-[#29221E] text-[#F3EEE8]"
                : "border border-transparent text-[#BDB0A5] hover:text-[#F3EEE8]"
            }`}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="min-w-0 truncate">
              <span className="tabular-nums opacity-70">{num}</span>{" "}
              {item.navLabel}
            </span>
            <span
              aria-hidden="true"
              className={`shrink-0 text-[0.85rem] text-[#C89150] transition-opacity duration-300 ease-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              →
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function OverviewBodyText({
  text,
  link,
  onOpenStudy,
}: {
  text: string;
  link?: { text: string; openStudyId?: string };
  onOpenStudy?: (studyId: string) => void;
}) {
  if (!link?.text || !text.includes(link.text)) {
    return <>{text}</>;
  }
  const start = text.indexOf(link.text);
  const before = text.slice(0, start);
  const after = text.slice(start + link.text.length);
  const canOpen = Boolean(link.openStudyId && onOpenStudy);

  return (
    <>
      {before}
      {canOpen ? (
        <button
          type="button"
          onClick={() => onOpenStudy?.(link.openStudyId!)}
          className="cursor-pointer text-[#C89150] outline-none focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
        >
          {link.text}
        </button>
      ) : (
        <span className="text-[#C89150]">{link.text}</span>
      )}
      {after}
    </>
  );
}

function PortfolioOverviewBody({
  content,
  onOpenStudy,
}: {
  content: Extract<CaseStudySection["content"], { kind: "overview" }>;
  onOpenStudy?: (studyId: string) => void;
}) {
  const metaCols =
    content.meta.length >= 3
      ? "sm:grid-cols-3"
      : content.meta.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-1";

  return (
    <div>
      <h3 className="max-w-[34rem] whitespace-pre-line text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold leading-[1.18] tracking-tight text-[#F3EEE8]">
        {content.heading}
      </h3>
      {content.subline ? (
        <p className="mt-3 max-w-[38rem] text-[0.95rem] leading-snug text-[#BDB0A5]">
          {content.subline}
        </p>
      ) : null}

      <dl className={`mt-7 grid grid-cols-1 gap-x-5 gap-y-5 ${metaCols}`}>
        {content.meta.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-[0.72rem] text-[#BDB0A5]">{item.label}</dt>
            <dd className="mt-1.5 text-[0.84rem] leading-snug text-[#F3EEE8]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {content.heroImages?.length ? (
        <div
          className={`mt-8 gap-x-[28px] gap-y-[24px] ${
            content.heroImagesLayout === "side-by-side"
              ? content.heroImages.length >= 3
                ? "grid grid-cols-1 sm:grid-cols-3"
                : "grid grid-cols-1 sm:grid-cols-2"
              : "flex flex-col"
          }`}
        >
          {content.heroImages.map((image) => (
            <div key={image.id} className="min-w-0">
              {image.caption ? (
                <p className="mb-2 text-[0.72rem] text-[#BDB0A5]">
                  {image.caption}
                </p>
              ) : null}
              {image.phoneFrame === "android" && image.src ? (
                <AndroidPhoneFrame
                  id={image.id}
                  src={image.src}
                  alt={image.alt ?? image.description}
                  aspectRatio={image.aspectRatio}
                  unoptimized={image.unoptimized}
                  tone={image.phoneFrameTone}
                />
              ) : (
                <ImagePlaceholder
                  id={image.id}
                  description={image.description}
                  aspectRatio={image.aspectRatio}
                  src={image.src}
                  alt={image.alt}
                  unoptimized={image.unoptimized}
                  objectFit={image.objectFit}
                  roundedClassName={
                    image.roundedClassName ?? "rounded-[1.1rem]"
                  }
                  framed={image.framed ?? false}
                  frameBorder={image.frameBorder}
                />
              )}
            </div>
          ))}
        </div>
      ) : content.hero ? (
        <div className="mt-8">
          <ImagePlaceholder
            id={content.hero.id}
            description={content.hero.description}
            aspectRatio={content.hero.aspectRatio}
            src={content.hero.src}
            alt={content.hero.alt}
            unoptimized={content.hero.unoptimized}
            objectFit={content.hero.objectFit}
            framed={content.hero.framed}
            roundedClassName={
              content.hero.roundedClassName ?? "rounded-[1.1rem]"
            }
          />
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {content.body ? (
          <p className="max-w-[38rem] text-[0.95rem] leading-[1.65] text-[#F3EEE8]">
            <OverviewBodyText
              text={content.body.text}
              link={content.body.link}
              onOpenStudy={onOpenStudy}
            />
          </p>
        ) : null}
        {content.caption ? (
          <p className="text-[0.88rem] text-[#F3EEE8]">{content.caption}</p>
        ) : null}
        {content.storeLinks?.appStore || content.storeLinks?.googlePlay ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {content.storeLinks.appStore ? (
              <StoreBadgeLink
                href={content.storeLinks.appStore}
                sublabel="Download on the"
                label="App Store"
                icon={
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.98 2.93 12.44 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                  </svg>
                }
              />
            ) : null}
            {content.storeLinks.googlePlay ? (
              <StoreBadgeLink
                href={content.storeLinks.googlePlay}
                sublabel="Get it on"
                label="Google Play"
                icon={
                  <svg
                    width="20"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3.18 23.04c-.4-.2-.68-.6-.72-1.06V2.02c.04-.46.32-.86.72-1.06l10.9 11.04L3.18 23.04zm1.64.7 11.2-6.36-2.72-2.76-8.48 9.12zm12.48-7.08 2.92-1.66c.66-.38.66-1.36 0-1.74l-2.92-1.66-3.02 3.06 3.02 3zm-1.28-5.48L4.82.26l8.48 9.12 2.72-2.76z" />
                  </svg>
                }
              />
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {content.chips.map((chip) => (
            <span
              key={chip.label}
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.72rem] tracking-wide ${
                chip.tone === "outline"
                  ? "border border-[#C89150] text-[#F3EEE8]"
                  : "bg-[#211B18] text-[#F3EEE8]"
              }`}
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StorySegments({
  segments,
  className = "mt-2.5",
}: {
  segments: Extract<
    CaseStudySection["content"],
    { kind: "story" }
  >["blocks"][number]["segments"];
  className?: string;
}) {
  return (
    <div
      className={`${className} space-y-3 text-[0.88rem] leading-[1.65] text-[#F3EEE8]/90`}
    >
      {segments.map((segment, index) => {
        if (segment.type === "bold") {
          return (
            <p key={`b-${index}`} className="text-[#F3EEE8]">
              <strong className="font-semibold">{segment.text}</strong>
            </p>
          );
        }
        if (segment.type === "bullets") {
          return (
            <ul
              key={`u-${index}`}
              className="list-disc space-y-1.5 pl-5 text-[#F3EEE8]/90"
            >
              {segment.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={`p-${index}`}>{segment.text.trim()}</p>;
      })}
    </div>
  );
}

function PortfolioStoryBody({
  content,
}: {
  content: Extract<CaseStudySection["content"], { kind: "story" }>;
}) {
  return (
    <div>
      <h3 className="max-w-[34rem] text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold leading-[1.18] tracking-tight text-[#F3EEE8]">
        {content.heading}
      </h3>

      <div className="mt-8 flex flex-col gap-4">
        {content.blocks.map((block) => {
          const afterBlockImages = (content.images ?? []).filter(
            (image) => image.afterBlockId === block.id,
          );

          return (
            <div key={block.id} className="flex flex-col gap-4">
              <article
                id={block.id}
                className={`rounded-[1.1rem] border px-4 py-4 sm:px-5 sm:py-5 ${
                  block.highlight
                    ? "border-[#C89150]/35 bg-[#C89150]/14"
                    : "border-[#43362F] bg-[#211B18]/60"
                }`}
              >
                <p className="text-[0.72rem] text-[#BDB0A5]">{block.label}</p>
                {block.stat ? (
                  <div className="mt-3 rounded-[1.1rem] border border-[#C89150]/35 bg-[#C89150]/14 px-5 py-5 sm:px-6">
                    <p className="text-[clamp(2.1rem,4vw,2.75rem)] font-semibold leading-none tracking-tight text-[#F3EEE8]">
                      {block.stat.value}
                    </p>
                    <p className="mt-2.5 max-w-[22rem] text-[0.82rem] leading-snug text-[#F3EEE8]/90">
                      {block.stat.label}
                    </p>
                  </div>
                ) : null}
                {block.image ? (
                  <div className="mt-2.5 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                    <div className="min-w-0 flex-1">
                      <StorySegments
                        segments={block.segments}
                        className="mt-0"
                      />
                    </div>
                    <div className="w-full shrink-0 sm:w-[16rem] md:w-[18rem]">
                      <CaseStudyMediaSlot slot={block.image} />
                    </div>
                  </div>
                ) : (
                  <StorySegments segments={block.segments} />
                )}
              </article>
              {afterBlockImages.length ? (
                <div
                  className={`gap-4 ${
                    content.imagesLayout === "side-by-side"
                      ? "grid grid-cols-1 sm:grid-cols-2"
                      : "flex flex-col"
                  }`}
                >
                  {afterBlockImages.map((image) => (
                    <div key={image.id} className="min-w-0">
                      <CaseStudyMediaSlot slot={image} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {(content.images ?? []).some((image) => !image.afterBlockId) ? (
        <div
          className={`mt-8 gap-4 ${
            content.imagesLayout === "side-by-side"
              ? "grid grid-cols-1 sm:grid-cols-2"
              : "flex flex-col"
          }`}
        >
          {(content.images ?? [])
            .filter((image) => !image.afterBlockId)
            .map((image, index) => (
              <div
                key={image.id}
                className={
                  // White framed media owns its own inner width — keep the outer full-bleed.
                  image.frameFill === "white"
                    ? "min-w-0"
                    : image.widthClassName
                      ? image.widthClassName
                      : content.imagesLayout === "side-by-side"
                        ? index === 0
                          ? "mr-auto w-[calc(90%+10px)] min-w-0"
                          : "ml-auto w-[calc(90%+10px)] min-w-0"
                        : "min-w-0"
                }
              >
                <CaseStudyMediaSlot slot={image} />
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
}

function PortfolioResearchBody({
  content,
  activeStudyId,
  onOpenStudy,
  onBack,
  backButtonRef,
  linkButtonRefs,
}: {
  content: Extract<CaseStudySection["content"], { kind: "research" }>;
  activeStudyId: string | null;
  onOpenStudy: (studyId: string, fromCardId: string) => void;
  onBack: () => void;
  backButtonRef: RefObject<HTMLButtonElement | null>;
  linkButtonRefs: MutableRefObject<Record<string, HTMLButtonElement | null>>;
}) {
  const study = activeStudyId
    ? content.studies?.find((item) => item.id === activeStudyId)
    : undefined;

  if (study) {
    return (
      <div>
        <button
          ref={backButtonRef}
          type="button"
          onClick={onBack}
          className="cursor-pointer text-[0.88rem] outline-none hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          style={{ color: "#C89150" }}
        >
          {content.backLabel}
        </button>

        <h3 className="mt-5 max-w-[34rem] text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold leading-[1.18] tracking-tight text-[#F3EEE8]">
          {study.title}
        </h3>

        <div className="mt-8 flex flex-col gap-4">
          {study.blocks.map((block) => {
            const afterBlockImages = [
              ...(study.inlineImages ?? [])
                .filter((item) => item.afterBlockId === block.id)
                .map((item) => item.slot),
              ...(study.imageSlot && study.imageAfterBlockId === block.id
                ? [study.imageSlot]
                : []),
            ];

            return (
              <div key={block.id} className="flex flex-col gap-4">
                <article
                  id={`${study.id}-${block.id}`}
                  className="rounded-[1.1rem] border border-[#43362F] bg-[#211B18]/60 px-4 py-4 sm:px-5 sm:py-5"
                >
                  <p className="text-[0.72rem] text-[#BDB0A5]">{block.label}</p>
                  <p className="mt-2.5 text-[0.88rem] leading-[1.65] text-[#F3EEE8]/90">
                    {block.body}
                  </p>
                </article>
                {afterBlockImages.length ? (
                  <div
                    className={
                      afterBlockImages.length > 1
                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                        : "flex flex-col gap-4"
                    }
                  >
                    {afterBlockImages.map((slot) => (
                      <div
                        key={slot.id}
                        className={slot.widthClassName ?? "min-w-0"}
                      >
                        <CaseStudyMediaSlot slot={slot} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {study.imageSlot && !study.imageAfterBlockId ? (
          <div className="mt-8">
            <div
              className={
                study.imageSlot.framed === false
                  ? "mx-auto w-[90%]"
                  : undefined
              }
            >
              <ImagePlaceholder
                id={study.imageSlot.id}
                description={study.imageSlot.description}
                aspectRatio={study.imageSlot.aspectRatio}
                src={study.imageSlot.src}
                alt={study.imageSlot.alt}
                objectFit={study.imageSlot.objectFit}
                unoptimized={study.imageSlot.unoptimized}
                framed={study.imageSlot.framed}
                roundedClassName={
                  study.imageSlot.framed === false
                    ? "rounded-[1.1rem]"
                    : undefined
                }
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <h3 className="max-w-[34rem] text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold leading-[1.18] tracking-tight text-[#F3EEE8]">
        {content.heading}
      </h3>
      {content.subline ? (
        <p className="mt-3 max-w-[38rem] text-[0.95rem] leading-snug text-[#BDB0A5]">
          {content.subline}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-4">
        {content.cards.map((card) => {
          const showImagesAfterCard =
            Boolean(content.images?.length) &&
            content.imagesAfterCardId === card.id;

          return (
            <div key={card.id} className="flex flex-col gap-4">
              <article
                id={card.id}
                className="rounded-[1.1rem] border border-[#43362F] bg-[#211B18]/60 px-4 py-4 sm:px-5 sm:py-5"
              >
                <h4 className="text-[0.95rem] font-semibold leading-snug text-[#F3EEE8]">
                  {card.title}
                </h4>
                <p className="mt-2.5 text-[0.88rem] leading-[1.65] text-[#F3EEE8]/90">
                  {card.body}
                </p>
                {card.link?.studyId ? (
                  <button
                    type="button"
                    ref={(el) => {
                      linkButtonRefs.current[card.id] = el;
                    }}
                    onClick={() => {
                      const link = card.link;
                      if (!link?.studyId) return;
                      onOpenStudy(link.studyId, card.id);
                    }}
                    className="mt-3 inline-block cursor-pointer text-[0.88rem] outline-none hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                    style={{ color: "#C89150" }}
                  >
                    {card.link.label}
                  </button>
                ) : null}
              </article>
              {showImagesAfterCard ? (
                <div
                  className={`gap-4 ${
                    content.imagesLayout === "side-by-side"
                      ? "grid grid-cols-1 sm:grid-cols-2"
                      : "flex flex-col"
                  }`}
                >
                  {content.images!.map((image) => (
                    <ImagePlaceholder
                      key={image.id}
                      id={image.id}
                      description={image.description}
                      aspectRatio={image.aspectRatio}
                      src={image.src}
                      alt={image.alt}
                      objectFit={image.objectFit}
                      unoptimized={image.unoptimized}
                      framed={image.framed}
                      roundedClassName={
                        image.framed === false ? "rounded-[1.1rem]" : undefined
                      }
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {content.images?.length && !content.imagesAfterCardId ? (
        <div
          className={`mt-8 gap-4 ${
            content.imagesLayout === "side-by-side"
              ? "grid grid-cols-1 sm:grid-cols-2"
              : "flex flex-col"
          }`}
        >
          {content.images.map((image) => (
            <ImagePlaceholder
              key={image.id}
              id={image.id}
              description={image.description}
              aspectRatio={image.aspectRatio}
              src={image.src}
              alt={image.alt}
              objectFit={image.objectFit}
              unoptimized={image.unoptimized}
              framed={image.framed}
              roundedClassName={
                image.framed === false ? "rounded-[1.1rem]" : undefined
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PortfolioProblemBody({
  content,
}: {
  content: Extract<
    CaseStudySection["content"],
    { kind: "problem-hypothesis" }
  >;
}) {
  return (
    <div>
      <h3 className="max-w-[34rem] text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold leading-[1.18] tracking-tight text-[#F3EEE8]">
        {content.heading}
      </h3>

      <p className="mt-7 max-w-[38rem] text-[0.95rem] leading-[1.65] text-[#F3EEE8]">
        {content.bodyBeforeBold}
        <strong className="font-semibold">{content.bodyBold}</strong>
      </p>

      <div className="mt-7 rounded-[1.1rem] border border-[#C89150]/35 bg-[#C89150]/14 px-5 py-5 sm:px-6">
        <p className="text-[clamp(2.1rem,4vw,2.75rem)] font-semibold leading-none tracking-tight text-[#F3EEE8]">
          {content.stat.value}
        </p>
        <p className="mt-2.5 max-w-[22rem] text-[0.82rem] leading-snug text-[#F3EEE8]/90">
          {content.stat.label}
        </p>
      </div>

      {content.images.length ? (
        <div
          className={`mt-8 gap-4 ${
            content.imagesLayout === "side-by-side"
              ? "grid grid-cols-1 sm:grid-cols-2"
              : "flex flex-col"
          }`}
        >
          {content.images.map((image) => (
            <div key={image.id} className="min-w-0">
              {image.caption ? (
                <p className="mb-2 text-[0.72rem] text-[#BDB0A5]">
                  {image.caption}
                </p>
              ) : null}
              <ImagePlaceholder
                id={image.id}
                description={image.description}
                aspectRatio={image.aspectRatio}
                src={image.src}
                alt={image.alt}
                objectFit={image.objectFit}
                unoptimized={image.unoptimized}
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-8 max-w-[38rem]">
        <p className="text-[0.72rem] text-[#BDB0A5]">{content.hypothesis.label}</p>
        <p className="mt-2 text-[0.95rem] leading-[1.65] text-[#F3EEE8]">
          {content.hypothesis.text}
        </p>
      </div>
    </div>
  );
}

/**
 * Muted looping Vimeo for case-study demos.
 * `background` (default) cover-fills the player — good for flat clips.
 * Non-background keeps the full frame (phone curves stay visible).
 */
function vimeoDemoEmbedSrc(
  src: string,
  mode: "background" | "contain" | "standard" = "background",
) {
  let url = src.trim();
  if (!url.includes("player.vimeo.com")) {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    url = match?.[1]
      ? `https://player.vimeo.com/video/${match[1]}`
      : `https://player.vimeo.com/video/${url}`;
  }
  const base = url.split("?")[0] ?? url;
  if (mode === "contain") {
    // Keep controls as fallback when the browser blocks muted autoplay.
    return `${base}?autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0&controls=1&background=0&dnt=1`;
  }
  // Standard player (no background=1) — more reliable on free Vimeo accounts.
  if (mode === "standard") {
    return `${base}?badge=0&autopause=0&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0&dnt=1`;
  }
  return `${base}?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0&dnt=1`;
}

function parseAspectRatio(value: string | number, fallback = 16 / 9) {
  if (typeof value === "number" && value > 0) return value;
  const parts = String(value)
    .split("/")
    .map((part) => Number(part.trim()));
  if (parts.length === 2 && parts[0]! > 0 && parts[1]! > 0) {
    return parts[0]! / parts[1]!;
  }
  const asNumber = Number(value);
  return asNumber > 0 ? asNumber : fallback;
}

/** object-fit: cover scale for a known video inside a frame of a different aspect. */
function coverScaleForAspects(frameAspect: number, videoAspect: number) {
  if (frameAspect <= 0 || videoAspect <= 0) return 1;
  return Math.max(frameAspect / videoAspect, videoAspect / frameAspect);
}

function CaseStudyMediaSlot({
  slot,
}: {
  slot: CaseStudyImageSlot;
}) {
  if (slot.phoneFrame === "android" && slot.src) {
    return (
      <AndroidPhoneFrame
        id={slot.id}
        src={slot.src}
        alt={slot.alt ?? slot.description}
        aspectRatio={slot.aspectRatio}
        unoptimized={slot.unoptimized}
        tone={slot.phoneFrameTone}
      />
    );
  }

  if (slot.vimeoSrc) {
    const frameAspect = parseAspectRatio(slot.aspectRatio);
    // Intrinsic Vimeo size when known (1010171567 = 1544×1160); else assume frame match.
    const videoAspect = slot.vimeoAspectRatio
      ? parseAspectRatio(slot.vimeoAspectRatio, frameAspect)
      : frameAspect;
    const fit = slot.objectFit ?? "cover";
    const framed = slot.framed !== false;
    const whiteFrame = framed && slot.frameFill === "white";
    // White-frame demos use the standard player — free Vimeo often blanks with background=1.
    const embedMode =
      fit === "contain" ? "contain" : whiteFrame ? "standard" : "background";
    // Cover: grow to fill the figure. Unframed phone demos need a stronger
    // bump so Vimeo letterboxing does not leave empty edges.
    const coverScale =
      fit === "contain" || whiteFrame
        ? 1
        : coverScaleForAspects(frameAspect, videoAspect) *
          (framed ? 1.02 : 1.12);

    const iframe = (
      <iframe
        title={slot.alt ?? slot.description}
        src={vimeoDemoEmbedSrc(slot.vimeoSrc, embedMode)}
        className={`absolute inset-0 h-full w-full border-0 ${
          fit === "contain" || whiteFrame ? "" : "pointer-events-none"
        }`}
        style={
          fit === "contain" || whiteFrame
            ? undefined
            : {
                transform: `scale(${coverScale})`,
                transformOrigin: "center center",
              }
        }
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );

    // Full-width white card (same as mp4 paperless/humour demos).
    if (whiteFrame) {
      return (
        <figure
          id={slot.id}
          className="w-full overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-white [transform:translateZ(0)]"
        >
          <div
            className={`relative ${slot.widthClassName ?? "w-full"}`}
            style={{ aspectRatio: slot.aspectRatio }}
          >
            {iframe}
          </div>
        </figure>
      );
    }

    return (
      <figure
        id={slot.id}
        className={`relative w-full overflow-hidden [transform:translateZ(0)] ${
          framed
            ? "rounded-[1.1rem] border border-[#43362F] bg-[#211B18]/80"
            : "rounded-[1.1rem] border-0 bg-[#211B18]"
        }`}
        style={{ aspectRatio: slot.aspectRatio }}
      >
        {iframe}
      </figure>
    );
  }

  if (slot.src && /\.(mp4|webm)($|\?)/i.test(slot.src)) {
    const framed = slot.framed !== false;
    const fit = slot.objectFit ?? "cover";
    const video = (
      <video
        src={slot.src}
        className={`absolute inset-0 h-full w-full ${
          fit === "contain" ? "object-contain" : "object-cover"
        }`}
        muted
        loop
        playsInline
        autoPlay
        aria-label={slot.alt ?? slot.description}
      />
    );

    // Full-width white card (same width/radius as story boxes); media can be narrower inside.
    if (framed && slot.frameFill === "white") {
      return (
        <figure
          id={slot.id}
          className="w-full overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-white"
        >
          <div
            className={`relative ${slot.widthClassName ?? "w-full"}`}
            style={{ aspectRatio: slot.aspectRatio }}
          >
            {video}
          </div>
        </figure>
      );
    }

    return (
      <figure
        id={slot.id}
        className={`relative w-full overflow-hidden ${
          framed
            ? "rounded-[1.1rem] border border-[#43362F] bg-[#211B18]/80"
            : "rounded-[1.1rem] border-0 bg-transparent"
        }`}
        style={{ aspectRatio: slot.aspectRatio }}
      >
        {video}
      </figure>
    );
  }

  const framed = slot.framed !== false;

  // White card shell (same pattern as white-frame video demos).
  if (framed && slot.frameFill === "white" && slot.src) {
    const fit = slot.objectFit ?? "contain";
    const rounded = slot.roundedClassName ?? "rounded-[1.1rem]";
    const skipOptimize =
      Boolean(slot.unoptimized) || /\.gif($|\?)/i.test(slot.src);
    const frameBg = slot.frameColor ?? "#ffffff";

    return (
      <figure
        id={slot.id}
        className={`w-full overflow-hidden border border-[#43362F] ${rounded}`}
        style={{ backgroundColor: frameBg }}
      >
        <div
          className={`relative ${slot.widthClassName ?? "w-full"}`}
          style={{ aspectRatio: slot.aspectRatio }}
        >
          {slot.ambientShadow ? (
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[4%] left-1/2 z-0 h-[1.1rem] w-[72%] -translate-x-1/2 rounded-[100%] bg-black/30 blur-[14px]"
            />
          ) : null}
          <div
            className={`absolute inset-0 z-[1] overflow-hidden${
              slot.mediaClassName ? ` ${slot.mediaClassName}` : ""
            }`}
          >
            <Image
              src={slot.src}
              alt={slot.alt ?? slot.description}
              fill
              unoptimized={skipOptimize}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              className={`absolute inset-0 h-full w-full max-w-none select-none [-webkit-user-drag:none] ${
                fit === "contain"
                  ? "object-contain"
                  : fit === "fill"
                    ? "object-fill"
                    : "object-cover"
              }`}
              sizes="(max-width: 768px) 92vw, min(25rem, 40vw)"
            />
          </div>
        </div>
      </figure>
    );
  }

  return (
    <ImagePlaceholder
      id={slot.id}
      description={slot.description}
      aspectRatio={slot.aspectRatio}
      src={slot.src}
      alt={slot.alt}
      unoptimized={slot.unoptimized}
      objectFit={slot.objectFit}
      framed={slot.framed}
      frameBorder={slot.frameBorder}
      roundedClassName={
        slot.roundedClassName ??
        (slot.framed === false ? "rounded-[1.1rem]" : undefined)
      }
    />
  );
}

function PortfolioWhatIDidBody({
  content,
}: {
  content: Extract<CaseStudySection["content"], { kind: "what-i-did" }>;
}) {
  return (
    <div>
      <h3 className="max-w-[34rem] text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold leading-[1.18] tracking-tight text-[#F3EEE8]">
        {content.heading}
      </h3>

      <p className="mt-7 max-w-[38rem] text-[0.95rem] leading-[1.65] text-[#F3EEE8]">
        {content.intro}
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {content.blocks.map((block, index) => (
          <div key={block.id} className="flex flex-col gap-4">
            <article
              id={block.id}
              data-decision-block=""
              data-highlighted={block.highlighted ? "true" : undefined}
              className={`scroll-mt-6 rounded-[1.1rem] border px-4 py-4 sm:px-5 sm:py-5 ${
                block.highlighted
                  ? "border-[#C89150]/35 bg-[#C89150]/14"
                  : "border-[#43362F] bg-[#211B18]/60"
              }`}
            >
              <h4 className="text-[0.95rem] font-semibold leading-snug text-[#F3EEE8]">
                <span className="tabular-nums text-[#C89150]/90">
                  {index + 1}.
                </span>{" "}
                {block.title}
              </h4>
              <p className="mt-2.5 text-[0.88rem] leading-[1.65] text-[#F3EEE8]/90">
                {block.body}
              </p>
            </article>

            {block.image ? <CaseStudyMediaSlot slot={block.image} /> : null}

            {block.id === content.imageAfterBlockId ? (
              <CaseStudyMediaSlot slot={content.image} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function StoreBadgeLink({
  href,
  label,
  sublabel,
  icon,
}: {
  href: string;
  label: string;
  sublabel: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2.5 rounded-[10px] border border-[#43362F] bg-[#14110F] px-3.5 py-2 outline-none transition-colors hover:border-[#C89150]/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
    >
      <span className="shrink-0 text-[#F3EEE8]/90" aria-hidden>
        {icon}
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="text-[0.62rem] tracking-wide text-[#BDB0A5]">
          {sublabel}
        </span>
        <span className="mt-1 text-[0.92rem] font-semibold text-[#F3EEE8]/90">
          {label}
        </span>
      </span>
    </a>
  );
}

function PortfolioResultBody({
  content,
}: {
  content: Extract<CaseStudySection["content"], { kind: "result" }>;
}) {
  const appStoreHref = content.storeLinks?.appStore;
  const googlePlayHref = content.storeLinks?.googlePlay;

  return (
    <div>
      <h3 className="max-w-[34rem] text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold leading-[1.18] tracking-tight text-[#F3EEE8]">
        {content.heading}
      </h3>
      {content.subline ? (
        <p className="mt-3 max-w-[38rem] text-[0.95rem] leading-snug text-[#BDB0A5]">
          {content.subline}
        </p>
      ) : null}

      <div className="mt-7 max-w-[38rem] space-y-4 text-[0.95rem] leading-[1.65] text-[#F3EEE8]">
        {content.body.split(/\n\n+/).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {appStoreHref || googlePlayHref ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {appStoreHref ? (
            <StoreBadgeLink
              href={appStoreHref}
              sublabel="Download on the"
              label="App Store"
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.98 2.93 12.44 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
              }
            />
          ) : null}
          {googlePlayHref ? (
            <StoreBadgeLink
              href={googlePlayHref}
              sublabel="Get it on"
              label="Google Play"
              icon={
                <svg width="20" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.04c-.4-.2-.68-.6-.72-1.06V2.02c.04-.46.32-.86.72-1.06l10.9 11.04L3.18 23.04zm1.64.7 11.2-6.36-2.72-2.76-8.48 9.12zm12.48-7.08 2.92-1.66c.66-.38.66-1.36 0-1.74l-2.92-1.66-3.02 3.06 3.02 3zm-1.28-5.48L4.82.26l8.48 9.12 2.72-2.76z" />
                </svg>
              }
            />
          ) : null}
        </div>
      ) : null}

      {content.images.length ? (
        <div
          className={`mt-8 gap-x-[28px] gap-y-[24px] ${
            content.imagesLayout === "side-by-side"
              ? content.images.length === 3 &&
                !content.images.some((image) => image.fullWidth)
                ? "grid grid-cols-1 sm:grid-cols-3"
                : "grid grid-cols-1 sm:grid-cols-2"
              : "flex flex-col"
          }`}
        >
          {content.images.map((image, index) => {
            const threeEqualPhones =
              content.imagesLayout === "side-by-side" &&
              content.images.length === 3 &&
              !content.images.some((slot) => slot.fullWidth);
            const isFullWidth =
              Boolean(image.fullWidth) ||
              (content.imagesLayout === "side-by-side" &&
                !threeEqualPhones &&
                content.images.length % 2 === 1 &&
                index === content.images.length - 1 &&
                !image.phoneFrame);
            const whiteFrame = image.frameFill === "white";
            const colSpan = isFullWidth ? "min-w-0 sm:col-span-2" : "min-w-0";

            return (
              <div
                key={image.id}
                className={`${colSpan}${
                  image.wrapperClassName ? ` ${image.wrapperClassName}` : ""
                }`}
              >
                {image.caption ? (
                  <p className="mb-2 text-[0.72rem] text-[#BDB0A5]">
                    {image.caption}
                  </p>
                ) : null}
                <div
                  className={
                    whiteFrame
                      ? "min-w-0"
                      : (image.widthClassName ??
                        (isFullWidth ? "w-full" : "mx-auto w-[90%]"))
                  }
                >
                  <CaseStudyMediaSlot slot={image} />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function PortfolioSectionBody({
  study,
  sectionId,
  onOpenStudy,
  activeResearchStudyId,
  onOpenResearchStudy,
  onBackResearchStudy,
  researchBackButtonRef,
  researchLinkButtonRefs,
}: {
  study: CaseStudy;
  sectionId: string;
  onOpenStudy?: (studyId: string) => void;
  activeResearchStudyId: string | null;
  onOpenResearchStudy: (studyId: string, fromCardId: string) => void;
  onBackResearchStudy: () => void;
  researchBackButtonRef: RefObject<HTMLButtonElement | null>;
  researchLinkButtonRefs: MutableRefObject<
    Record<string, HTMLButtonElement | null>
  >;
}) {
  const section =
    study.sections.find((item) => item.id === sectionId) ?? study.sections[0];

  if (section.content.kind === "overview") {
    return (
      <PortfolioOverviewBody
        content={section.content}
        onOpenStudy={onOpenStudy}
      />
    );
  }

  if (section.content.kind === "problem-hypothesis") {
    return <PortfolioProblemBody content={section.content} />;
  }

  if (section.content.kind === "what-i-did") {
    return <PortfolioWhatIDidBody content={section.content} />;
  }

  if (section.content.kind === "result") {
    return <PortfolioResultBody content={section.content} />;
  }

  if (section.content.kind === "story") {
    return <PortfolioStoryBody content={section.content} />;
  }

  if (section.content.kind === "research") {
    return (
      <PortfolioResearchBody
        content={section.content}
        activeStudyId={activeResearchStudyId}
        onOpenStudy={onOpenResearchStudy}
        onBack={onBackResearchStudy}
        backButtonRef={researchBackButtonRef}
        linkButtonRefs={researchLinkButtonRefs}
      />
    );
  }

  return <div />;
}

function vimeoEmbedSrc(src: string) {
  if (!src) return "";

  let url = src;
  if (!url.includes("player.vimeo.com")) {
    if (url.includes("vimeo.com")) {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (match?.[1]) {
        url = `https://player.vimeo.com/video/${match[1]}`;
      }
    } else {
      url = `https://player.vimeo.com/video/${url}`;
    }
  }

  const join = url.includes("?") ? "&" : "?";
  if (!url.includes("dnt=")) url = `${url}${join}dnt=1`;
  if (!url.includes("api=")) {
    url = `${url}${url.includes("?") ? "&" : "?"}api=1`;
  }
  return url;
}

/** Portrait media → compact work-modal shell (Concepts 02 / 04 today). */
function isPortraitAspectRatio(aspectRatio?: string): boolean {
  if (!aspectRatio) return false;
  const parts = aspectRatio.split("/").map((part) => Number(part.trim()));
  return parts.length === 2 && parts[0] < parts[1];
}

function isCompactWorkModal(work?: OtherWork): boolean {
  return isPortraitAspectRatio(work?.modal?.media?.aspectRatio);
}

function mediaFrameClass(aspectRatio?: string) {
  return aspectRatio
    ? "relative w-full max-w-full min-w-0 overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-[#211B18]"
    : "relative aspect-video w-full max-w-full min-w-0 overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-[#211B18]";
}

function VimeoWorkPlayer({
  src,
  title,
  aspectRatio,
}: {
  src: string;
  title: string;
  aspectRatio?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let cancelled = false;
    let player: { destroy: () => Promise<unknown> } | null = null;

    void import("@vimeo/player").then(({ default: Player }) => {
      if (cancelled || !iframeRef.current) return;

      const instance = new Player(iframeRef.current);
      player = instance;

      if (cancelled) {
        void instance.destroy();
        player = null;
        return;
      }

      instance.on("ended", () => {
        void instance.setCurrentTime(0).then(() => instance.pause());
      });
    });

    return () => {
      cancelled = true;
      void player?.destroy();
      player = null;
    };
  }, [src]);

  return (
    <div
      className={mediaFrameClass(aspectRatio)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <iframe
        ref={iframeRef}
        title={title}
        src={vimeoEmbedSrc(src)}
        className="absolute inset-0 h-full w-full max-w-full border-0"
        allow="picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

type YTPlayerInstance = {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  pauseVideo: () => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement | string,
    options?: {
      events?: {
        onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
      };
    },
  ) => YTPlayerInstance;
  PlayerState: { ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeIframeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API requires window"));
  }
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
}

function youtubeEmbedSrc(src: string) {
  if (!src) return "";

  let id = src;
  const watch = src.match(/[?&]v=([^&]+)/);
  const short = src.match(/youtu\.be\/([^?&]+)/);
  const embed = src.match(/youtube\.com\/embed\/([^?&]+)/);
  if (watch?.[1]) id = watch[1];
  else if (short?.[1]) id = short[1];
  else if (embed?.[1]) id = embed[1];

  return `https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&playsinline=1`;
}

function YouTubeWorkPlayer({
  src,
  title,
  aspectRatio,
}: {
  src: string;
  title: string;
  aspectRatio?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let cancelled = false;
    let player: YTPlayerInstance | null = null;

    void loadYouTubeIframeApi().then((YT) => {
      if (cancelled || !iframeRef.current) return;

      player = new YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              event.target.seekTo(0, true);
              event.target.pauseVideo();
            }
          },
        },
      });

      if (cancelled) {
        player.destroy();
        player = null;
      }
    });

    return () => {
      cancelled = true;
      player?.destroy();
      player = null;
    };
  }, [src]);

  return (
    <div
      className={mediaFrameClass(aspectRatio)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <iframe
        ref={iframeRef}
        title={title}
        src={youtubeEmbedSrc(src)}
        className="absolute inset-0 h-full w-full max-w-full border-0"
        allow="picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

function gumletEmbedSrc(src: string) {
  if (!src) return "";

  let url = src.trim();
  if (!url.includes("play.gumlet.io")) {
    const idMatch = url.match(/([a-f0-9]{24})/i);
    if (idMatch?.[1]) {
      url = `https://play.gumlet.io/embed/${idMatch[1]}`;
    } else if (!url.startsWith("http")) {
      url = `https://play.gumlet.io/embed/${url}`;
    }
  }

  const join = url.includes("?") ? "&" : "?";
  if (!/[?&]autoplay=/.test(url)) {
    url = `${url}${join}autoplay=false`;
  }
  return url;
}

function GumletWorkPlayer({
  src,
  title,
  aspectRatio,
}: {
  src: string;
  title: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className={mediaFrameClass(aspectRatio)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <iframe
        title={title}
        src={gumletEmbedSrc(src)}
        className="absolute inset-0 h-full w-full max-w-full border-0"
        allow="picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

function WorkMediaBlock({
  media,
  title,
  workId,
  active,
}: {
  media: OtherWorkMedia;
  title: string;
  workId: string;
  active: boolean;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const ratio = media.aspectRatio ?? "16 / 9";
  const gallery = media.items?.filter((item) => item.src) ?? [];

  if (gallery.length > 1) {
    // 6 phone frames → 3×2; 4×16/9 scenes → 2×2 (stack on narrow); else square tiles.
    const isPhoneGrid = gallery.length === 6;
    const isLandscapePairGrid =
      gallery.length === 4 && (media.aspectRatio ?? "") === "16 / 9";
    return (
      <ul
        className={
          isPhoneGrid
            ? "mx-auto grid max-w-[41rem] grid-cols-3 gap-6"
            : isLandscapePairGrid
              ? "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6"
              : "grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        }
        aria-label={media.description}
      >
        {gallery.map((item) => {
          const isVideo = /\.(mp4|webm)($|\?)/i.test(item.src ?? "");
          const mediaClass = isPhoneGrid
            ? "h-auto w-full object-contain"
            : isLandscapePairGrid
              ? "aspect-video h-auto w-full object-cover"
              : "aspect-square h-auto w-full object-contain";

          return (
            <li
              key={item.src}
              className="overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-[#211B18]"
            >
              {isVideo ? (
                <video
                  src={item.src}
                  className={mediaClass}
                  muted
                  loop
                  playsInline
                  autoPlay={!reducedMotion}
                  controls={reducedMotion}
                  aria-label={item.description}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- animated GIF / still gallery
                <img
                  src={item.src}
                  alt={item.description}
                  className={mediaClass}
                />
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  if (!media.src) {
    return (
      <ImagePlaceholder
        id={`${workId}-media-placeholder`}
        description={media.description}
        aspectRatio={ratio}
      />
    );
  }

  if (media.kind === "video" && media.provider === "vimeo") {
    if (!active) return null;
    return (
      <VimeoWorkPlayer
        src={media.src}
        title={title}
        aspectRatio={media.aspectRatio}
      />
    );
  }

  if (media.kind === "video" && media.provider === "youtube") {
    if (!active) return null;
    return (
      <YouTubeWorkPlayer
        src={media.src}
        title={title}
        aspectRatio={media.aspectRatio}
      />
    );
  }

  if (media.kind === "video" && media.provider === "gumlet") {
    if (!active) return null;
    return (
      <GumletWorkPlayer
        src={media.src}
        title={title}
        aspectRatio={media.aspectRatio}
      />
    );
  }

  if (media.kind === "animation") {
    const isGif = /\.gif($|\?)/i.test(media.src);
    if (isGif) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- external work asset
        <img
          src={media.src}
          alt={media.description}
          className="w-full rounded-[1.1rem] border border-[#43362F]"
        />
      );
    }
    return (
      <video
        key={active ? "playing" : "idle"}
        src={media.src}
        className="w-full rounded-[1.1rem] border border-[#43362F]"
        muted
        loop
        playsInline
        autoPlay={active && !reducedMotion}
        controls={reducedMotion}
        aria-label={media.description}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external work asset
    <img
      src={media.src}
      alt={media.description}
      className="h-auto w-full rounded-[1.1rem] border border-[#43362F]"
    />
  );
}

function WorkModalAdjacentNav({
  work,
  onNavigateWork,
}: {
  work: OtherWork;
  onNavigateWork?: (work: OtherWork) => void;
}) {
  const { prev, next, categorySize } = getAdjacentOtherWorks(work.id);
  if (categorySize < 2) return null;

  const linkClass =
    "inline-flex max-w-full cursor-pointer items-start gap-2 text-[0.88rem] leading-snug text-[#BDB0A5] outline-none transition-colors hover:text-[#F3EEE8]/90 focus-visible:rounded-sm focus-visible:text-[#F3EEE8]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]";

  return (
    <nav
      className="mt-10 flex items-start justify-between gap-6"
      aria-label="More works in this category"
    >
      <div className="min-w-0 flex-1">
        {prev ? (
          <button
            type="button"
            onClick={() => onNavigateWork?.(prev)}
            className={`${linkClass} text-left`}
          >
            <span aria-hidden="true" className="shrink-0">
              ←
            </span>
            <span className="min-w-0 break-words">{prev.title}</span>
          </button>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 justify-end">
        {next ? (
          <button
            type="button"
            onClick={() => onNavigateWork?.(next)}
            className={`${linkClass} text-right`}
          >
            <span className="min-w-0 break-words">{next.title}</span>
            <span aria-hidden="true" className="shrink-0">
              →
            </span>
          </button>
        ) : null}
      </div>
    </nav>
  );
}

function WorkModalBody({
  work,
  headingId,
  mediaActive,
  compact,
  onOpenCaseStudy,
  onNavigateWork,
}: {
  work: OtherWork;
  headingId: string;
  mediaActive: boolean;
  compact: boolean;
  onOpenCaseStudy?: (target: { slug: string; sectionId: string }) => void;
  onNavigateWork?: (work: OtherWork) => void;
}) {
  const modal = work.modal;
  // Type / Context / Tools / Status always show — "—" when empty. Role only when set.
  const metaValue = (value?: string) => (value?.trim() ? value : "—");
  const meta = [
    { label: "Type", value: metaValue(modal?.type) },
    { label: "Context", value: metaValue(modal?.context) },
    modal?.role?.trim() ? { label: "Role", value: modal.role } : null,
    { label: "Tools", value: metaValue(modal?.tools) },
    { label: "Status", value: metaValue(modal?.status) },
  ].filter((item): item is { label: string; value: string } => item !== null);

  const metaCols = compact
    ? "grid-cols-1"
    : meta.length >= 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : meta.length === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : meta.length === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1";

  return (
    <div>
      <h3
        id={headingId}
        tabIndex={-1}
        className={`font-semibold leading-[1.18] tracking-tight text-[#F3EEE8] outline-none ${
          compact
            ? "max-w-none text-[clamp(1.4rem,4vw,1.85rem)]"
            : "max-w-[34rem] text-[clamp(1.55rem,2.8vw,2.35rem)]"
        }`}
      >
        {work.title}
      </h3>

      {modal?.chips && modal.chips.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {modal.chips.map((chip, index) => (
            <span
              key={chip}
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.72rem] tracking-wide ${
                index === 0
                  ? "border border-[#C89150] text-[#F3EEE8]"
                  : "bg-[#211B18] text-[#F3EEE8]"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}

      {meta.length > 0 ? (
        <dl
          className={`mt-7 grid gap-x-5 ${metaCols} ${
            compact ? "gap-y-4" : "gap-y-5"
          }`}
        >
          {meta.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="text-[0.72rem] text-[#BDB0A5]">{item.label}</dt>
              <dd className="mt-1.5 text-[0.84rem] leading-snug text-[#F3EEE8]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {modal?.media ? (
        <div className="mt-8 flex flex-col gap-4">
          <WorkMediaBlock
            media={modal.media}
            title={work.title}
            workId={work.id}
            active={mediaActive}
          />
          {modal.media.below
            ?.filter((item) => item.src)
            .map((item) => (
              <div
                key={item.src}
                className="overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-[#211B18]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- work still under video */}
                <img
                  src={item.src}
                  alt={item.description}
                  className="h-auto w-full"
                />
              </div>
            ))}
        </div>
      ) : null}

      {modal?.caption ? (
        <p
          className={`mt-10 text-[0.95rem] leading-[1.65] text-[#F3EEE8] ${
            compact ? "max-w-none" : "max-w-[38rem]"
          }`}
        >
          {modal.caption}
        </p>
      ) : null}

      {work.link?.caseStudy ? (
        <button
          type="button"
          onClick={() => {
            if (!work.link?.caseStudy) return;
            onOpenCaseStudy?.(work.link.caseStudy);
          }}
          className="mt-3 inline-block cursor-pointer text-[0.88rem] outline-none hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          style={{ color: "#C89150" }}
        >
          {work.link.label}
        </button>
      ) : work.link?.href ? (
        <a
          href={work.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block cursor-pointer text-[0.88rem] outline-none hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          style={{ color: "#C89150" }}
        >
          {work.link.label}
        </a>
      ) : null}

      <WorkModalAdjacentNav work={work} onNavigateWork={onNavigateWork} />
    </div>
  );
}

function DummySectionBody({
  section,
  headingId,
}: {
  section: (typeof dummyCaseStudy.sections)[number];
  headingId?: string;
}) {
  return (
    <div>
      <h3
        id={headingId}
        className="max-w-[34rem] text-[clamp(1.55rem,2.8vw,2.35rem)] font-semibold leading-[1.18] tracking-tight text-[#F3EEE8]"
      >
        {section.heading}
      </h3>

      <dl className="mt-7 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4">
        {section.meta.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-[0.72rem] text-[#BDB0A5]">{item.label}</dt>
            <dd className="mt-1.5 text-[0.84rem] leading-snug text-[#F3EEE8]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <figure className="mt-8 overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-[#29221E]">
        <div className="bg-[#ece8e1] px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
          <div className="mx-auto grid max-w-[34rem] grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="aspect-[9/17] overflow-hidden rounded-[1.1rem] bg-[#211B18] shadow-[0_10px_28px_rgba(0,0,0,0.28)] ring-1 ring-[#43362F]"
                aria-hidden="true"
              >
                <div className="flex h-full flex-col bg-gradient-to-b from-[#29221E] to-[#171412] p-2.5 sm:p-3">
                  <div className="mx-auto h-1 w-10 rounded-full bg-[#F3EEE8]/15" />
                  <div className="mt-3 h-2 w-[72%] rounded-full bg-[#F3EEE8]/18" />
                  <div className="mt-1.5 h-2 w-[48%] rounded-full bg-[#F3EEE8]/10" />
                  <div className="mt-4 flex-1 rounded-lg bg-[#F3EEE8]/[0.06]" />
                  <div className="mt-2 h-7 rounded-full bg-[#C89150]/45" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <figcaption className="space-y-3 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-[0.88rem] text-[#F3EEE8]">{section.galleryCaption}</p>
          <div className="flex flex-wrap gap-2">
            {section.badges.map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.72rem] tracking-wide ${
                  badge.tone === "outline"
                    ? "border border-[#C89150] text-[#F3EEE8]"
                    : "bg-[#211B18] text-[#F3EEE8]"
                }`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </figcaption>
      </figure>

      <p className="mt-7 max-w-[38rem] text-[0.95rem] leading-[1.65] text-[#F3EEE8]">
        {section.body}
      </p>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {section.cards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.1rem] border border-[#43362F] bg-[#29221E] px-4 py-4 sm:px-5"
          >
            <h4 className="text-[0.82rem] font-medium text-[#F3EEE8]">
              {card.title}
            </h4>
            <p className="mt-2 text-[0.78rem] leading-relaxed text-[#BDB0A5]">
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CaseStudyPopup({
  project,
  open,
  onClose,
  hideNav = false,
  work,
  initialSectionId,
  onOpenCaseStudy,
  onNavigateWork,
}: CaseStudyPopupProps) {
  const isWorkModal = hideNav && Boolean(work);
  const workCompact = isWorkModal && isCompactWorkModal(work);
  const dialogId = useId();
  const scrollRegionId = useId();
  const workNavIdRef = useRef<string | null>(null);
  const [studySlug, setStudySlug] = useState(project.slug);
  const portfolio = getCaseStudy(studySlug);
  const isPortfolio = Boolean(portfolio);
  const firstSectionId = portfolio?.sections[0]?.id ?? "overview";

  const [activeId, setActiveId] = useState(firstSectionId);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [displayedId, setDisplayedId] = useState(firstSectionId);
  const [contentVisible, setContentVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  /** Tracks open/project so we can sync slug during render (avoids setState-in-effect). */
  const [slugGate, setSlugGate] = useState({ open: false, slug: project.slug });
  /** Tracks which studySlug was last reset while open. */
  const [navResetKey, setNavResetKey] = useState("");
  const [overflowing, setOverflowing] = useState(false);
  const [thumb, setThumb] = useState({ top: 0, height: 48 });
  const sectionBusyRef = useRef(false);
  const sectionTimerRef = useRef<number | null>(null);
  const pendingAnchorRef = useRef<string | null>(null);
  const blinkScrollTimerRef = useRef<number | null>(null);
  const blinkClearTimerRef = useRef<number | null>(null);
  const blinkGenRef = useRef(0);
  /** Ignore scrollspy while a menu click is programmatically scrolling. */
  const spyPausedRef = useRef(false);
  const spyResumeTimerRef = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const researchBackButtonRef = useRef<HTMLButtonElement>(null);
  const researchLinkButtonRefs = useRef<
    Record<string, HTMLButtonElement | null>
  >({});
  const sectionButtonRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {},
  );
  /** Where to restore focus after leaving a research study view. */
  const researchFocusReturnRef = useRef<"card" | "menu" | null>(null);
  const researchOpenedCardIdRef = useRef<string | null>(null);

  const nudgeCloseIcon = useCallback(() => {
    const el = closeBtnRef.current;
    if (!el) return;
    el.classList.remove("case-study-close-nudge");
    // Force reflow so the animation can restart on every outside click.
    void el.offsetWidth;
    el.classList.add("case-study-close-nudge");
    const onEnd = () => {
      el.classList.remove("case-study-close-nudge");
      el.removeEventListener("animationend", onEnd);
    };
    el.addEventListener("animationend", onEnd);
  }, []);

  const clearBlockBlink = useCallback(() => {
    blinkGenRef.current += 1;
    if (blinkScrollTimerRef.current !== null) {
      window.clearTimeout(blinkScrollTimerRef.current);
      blinkScrollTimerRef.current = null;
    }
    if (blinkClearTimerRef.current !== null) {
      window.clearTimeout(blinkClearTimerRef.current);
      blinkClearTimerRef.current = null;
    }
    const root = scrollRef.current;
    if (!root) return;
    root.querySelectorAll("[data-decision-block]").forEach((node) => {
      const el = node as HTMLElement;
      el.getAnimations().forEach((animation) => animation.cancel());
      el.classList.remove("case-study-block-blink");
    });
  }, []);

  const blinkDecisionBlock = useCallback((target: Element, gen: number) => {
    if (gen !== blinkGenRef.current) return;
    const el = target as HTMLElement;

    el.getAnimations().forEach((animation) => animation.cancel());
    el.classList.remove("case-study-block-blink");
    void el.offsetWidth;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      el.classList.add("case-study-block-blink");
      blinkClearTimerRef.current = window.setTimeout(() => {
        if (gen !== blinkGenRef.current) return;
        el.classList.remove("case-study-block-blink");
        blinkClearTimerRef.current = null;
      }, 1000);
      return;
    }

    const fromColor = getComputedStyle(el).borderColor;
    // Accent amber, ~20% lighter than lab(79.9% 14.2 38.2 / 0.35).
    const blinkColor = "lab(95.9% 14.2 38.2 / 0.35)";

    // Strictly border-color only (e.g. #documented-and-reviewed article).
    el.animate(
      [
        { offset: 0, borderColor: blinkColor },
        { offset: 0.45, borderColor: blinkColor },
        { offset: 1, borderColor: fromColor },
      ],
      {
        duration: 450,
        iterations: 3,
        easing: "ease-in-out",
      },
    );
  }, []);

  const pauseScrollSpy = useCallback((ms = 1000) => {
    spyPausedRef.current = true;
    if (spyResumeTimerRef.current !== null) {
      window.clearTimeout(spyResumeTimerRef.current);
    }
    spyResumeTimerRef.current = window.setTimeout(() => {
      spyPausedRef.current = false;
      spyResumeTimerRef.current = null;
    }, ms);
  }, []);

  const syncActiveChildFromScroll = useCallback(() => {
    if (spyPausedRef.current) return;
    const root = scrollRef.current;
    if (!root) return;

    const blocks = Array.from(
      root.querySelectorAll<HTMLElement>("[data-decision-block][id]"),
    );
    if (blocks.length === 0) return;

    // Last block often never reaches its click landing — pin it at end.
    const atBottom =
      root.scrollTop + root.clientHeight >= root.scrollHeight - 2;
    if (atBottom) {
      const lastId = blocks[blocks.length - 1]!.id;
      setActiveChildId((prev) => (prev === lastId ? prev : lastId));
      return;
    }

    // Activate when scrollTop reaches the same place menu click would land
    // (scrollIntoView block:"start" + the block's scroll-margin).
    const rootTop = root.getBoundingClientRect().top;
    const scrollTop = root.scrollTop;
    const EPS = 1;

    let currentId: string | null = null;
    for (const block of blocks) {
      const margin =
        Number.parseFloat(getComputedStyle(block).scrollMarginTop) || 0;
      const clickLandingTop =
        scrollTop + (block.getBoundingClientRect().top - rootTop) - margin;
      if (scrollTop + EPS >= clickLandingTop) {
        currentId = block.id;
      } else {
        break;
      }
    }

    setActiveChildId((prev) => (prev === currentId ? prev : currentId));
  }, []);

  const scrollToDecisionAndBlink = useCallback(
    (anchorId: string) => {
      const root = scrollRef.current;
      if (!root) return;
      const target = root.querySelector(`#${CSS.escape(anchorId)}`);
      if (!target) return;

      clearBlockBlink();
      pauseScrollSpy(1100);
      const gen = blinkGenRef.current;
      const scrollBefore = root.scrollTop;

      let finished = false;
      const finish = () => {
        if (finished || gen !== blinkGenRef.current) return;
        finished = true;
        root.removeEventListener("scrollend", finish);
        if (blinkScrollTimerRef.current !== null) {
          window.clearTimeout(blinkScrollTimerRef.current);
          blinkScrollTimerRef.current = null;
        }
        blinkDecisionBlock(target, gen);
      };

      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // After smooth scroll has a chance to start: blink now if no movement,
      // otherwise wait until scroll settles.
      blinkScrollTimerRef.current = window.setTimeout(() => {
        blinkScrollTimerRef.current = null;
        if (gen !== blinkGenRef.current) return;

        if (Math.abs(root.scrollTop - scrollBefore) <= 1) {
          finish();
          return;
        }

        root.addEventListener("scrollend", finish);
        blinkScrollTimerRef.current = window.setTimeout(finish, 900);
      }, 50);
    },
    [blinkDecisionBlock, clearBlockBlink, pauseScrollSpy],
  );

  const syncThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const next = readScrollThumb(el);
    setOverflowing(next.overflowing);
    setThumb({ top: next.top, height: next.height });
  }, []);

  // Adjust state when the modal opens or the project slug changes — during render,
  // matching React's "adjusting state when props change" pattern.
  if (open !== slugGate.open || (open && project.slug !== slugGate.slug)) {
    setSlugGate({ open, slug: project.slug });
    if (open) {
      setStudySlug(project.slug);
    }
  }

  const openResetKey = `${studySlug}::${initialSectionId ?? ""}`;
  if (open && navResetKey !== openResetKey) {
    setNavResetKey(openResetKey);
    const study = getCaseStudy(studySlug);
    const preferred =
      initialSectionId &&
      study?.sections.some((section) => section.id === initialSectionId)
        ? initialSectionId
        : (study?.sections[0]?.id ?? "overview");
    setActiveId(preferred);
    setActiveChildId(null);
    setDisplayedId(preferred);
    setContentVisible(true);
  } else if (!open && navResetKey !== "") {
    setNavResetKey("");
  }

  const openStudy = useCallback(
    (slug: string) => {
      if (!getCaseStudy(slug) || slug === studySlug) return;
      clearBlockBlink();
      setStudySlug(slug);
    },
    [clearBlockBlink, studySlug],
  );

  const isResearchSection = useCallback(
    (sectionId: string) => {
      const section = portfolio?.sections.find((item) => item.id === sectionId);
      return section?.content.kind === "research";
    },
    [portfolio],
  );

  const focusResearchBackSoon = useCallback(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        researchBackButtonRef.current?.focus();
      });
    });
  }, []);

  const focusResearchReturnSoon = useCallback(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const returnTo = researchFocusReturnRef.current;
        if (returnTo === "card" && researchOpenedCardIdRef.current) {
          researchLinkButtonRefs.current[
            researchOpenedCardIdRef.current
          ]?.focus();
        } else if (returnTo === "menu") {
          sectionButtonRefs.current[activeId]?.focus();
        }
        researchFocusReturnRef.current = null;
        researchOpenedCardIdRef.current = null;
      });
    });
  }, [activeId]);

  const openResearchStudy = useCallback(
    (studyId: string, from: "card" | "menu", fromCardId?: string) => {
      clearBlockBlink();
      pendingAnchorRef.current = null;
      researchFocusReturnRef.current = from;
      researchOpenedCardIdRef.current =
        from === "card" ? (fromCardId ?? null) : null;
      setActiveChildId(studyId);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      syncThumb();
      focusResearchBackSoon();
    },
    [clearBlockBlink, focusResearchBackSoon, syncThumb],
  );

  const backResearchStudy = useCallback(() => {
    clearBlockBlink();
    pendingAnchorRef.current = null;
    setActiveChildId(null);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    syncThumb();
    focusResearchReturnSoon();
  }, [clearBlockBlink, focusResearchReturnSoon, syncThumb]);

  const selectSection = useCallback(
    (id: string, childId?: string) => {
      const research = isResearchSection(id);

      if (research) {
        clearBlockBlink();
        pendingAnchorRef.current = null;

        if (id === activeId) {
          if (childId) {
            openResearchStudy(childId, "menu");
          } else {
            // Parent "06" click: return to overview.
            researchFocusReturnRef.current = null;
            researchOpenedCardIdRef.current = null;
            setActiveChildId(null);
            if (scrollRef.current) scrollRef.current.scrollTop = 0;
            syncThumb();
          }
          return;
        }

        if (sectionBusyRef.current) return;

        setActiveId(id);
        setActiveChildId(childId ?? null);
        if (childId) {
          researchFocusReturnRef.current = "menu";
          researchOpenedCardIdRef.current = null;
        } else {
          researchFocusReturnRef.current = null;
          researchOpenedCardIdRef.current = null;
        }
        setContentVisible(false);
        sectionBusyRef.current = true;

        if (sectionTimerRef.current !== null) {
          window.clearTimeout(sectionTimerRef.current);
        }

        sectionTimerRef.current = window.setTimeout(() => {
          setDisplayedId(id);
          if (scrollRef.current) scrollRef.current.scrollTop = 0;
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              setContentVisible(true);
              sectionBusyRef.current = false;
              sectionTimerRef.current = null;
              syncThumb();
              if (childId) focusResearchBackSoon();
            });
          });
        }, FADE_MS);
        return;
      }

      if (childId) {
        pendingAnchorRef.current = childId;
        setActiveChildId(childId);
      } else {
        pendingAnchorRef.current = null;
        setActiveChildId(null);
        clearBlockBlink();
      }

      // Already on this section: blink/scroll now, or keep pending if mid-fade.
      if (id === activeId) {
        if (childId && !sectionBusyRef.current) {
          scrollToDecisionAndBlink(childId);
        }
        return;
      }

      if (sectionBusyRef.current) return;

      setActiveId(id);
      setContentVisible(false);
      sectionBusyRef.current = true;

      if (sectionTimerRef.current !== null) {
        window.clearTimeout(sectionTimerRef.current);
      }

      sectionTimerRef.current = window.setTimeout(() => {
        setDisplayedId(id);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            setContentVisible(true);
            sectionBusyRef.current = false;
            sectionTimerRef.current = null;
            syncThumb();

            const anchor = pendingAnchorRef.current;
            if (anchor) {
              scrollToDecisionAndBlink(anchor);
              pendingAnchorRef.current = null;
            }
          });
        });
      }, FADE_MS);
    },
    [
      activeId,
      clearBlockBlink,
      focusResearchBackSoon,
      isResearchSection,
      openResearchStudy,
      scrollToDecisionAndBlink,
      syncThumb,
    ],
  );

  // DOM/ref reset when opening / switching study (setState already synced above).
  useEffect(() => {
    if (!open) return;
    if (sectionTimerRef.current !== null) {
      window.clearTimeout(sectionTimerRef.current);
      sectionTimerRef.current = null;
    }
    clearBlockBlink();
    sectionBusyRef.current = false;
    pendingAnchorRef.current = null;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [open, studySlug, clearBlockBlink]);

  // GA: modal open / content switch / close (case studies + Other Works).
  const modalAnalyticsRef = useRef<ModalAnalyticsPayload | null>(null);
  useEffect(() => {
    const payload: ModalAnalyticsPayload = isWorkModal
      ? {
          modal_type: "work",
          modal_id: work?.id ?? project.slug,
          modal_title: work?.title ?? project.title,
        }
      : {
          modal_type: "case_study",
          modal_id: studySlug,
          modal_title: portfolio?.title ?? project.title,
        };

    if (open) {
      modalAnalyticsRef.current = payload;
      trackModalView(payload);
      return;
    }

    if (modalAnalyticsRef.current) {
      trackModalClose(modalAnalyticsRef.current);
      modalAnalyticsRef.current = null;
    }
  }, [
    open,
    isWorkModal,
    work?.id,
    work?.title,
    studySlug,
    portfolio?.title,
    project.slug,
    project.title,
  ]);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      const mountId = window.setTimeout(() => {
        setMounted(true);
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => setVisible(true));
        });
      }, 0);
      return () => window.clearTimeout(mountId);
    }

    const hideId = window.setTimeout(() => {
      setVisible(false);
    }, 0);
    const timer = window.setTimeout(() => {
      setMounted(false);
      const opener = openerRef.current;
      if (opener && typeof opener.focus === "function") {
        opener.focus();
      }
      openerRef.current = null;
    }, FADE_MS);
    return () => {
      window.clearTimeout(hideId);
      window.clearTimeout(timer);
    };
  }, [open]);

  // Case-study: refocus close when the study slug changes.
  useEffect(() => {
    if (!mounted || !visible || isWorkModal) return;
    closeBtnRef.current?.focus();
  }, [mounted, visible, studySlug, isWorkModal]);

  // Work modal: focus close once when the dialog becomes visible.
  useEffect(() => {
    if (!mounted || !visible || !isWorkModal) return;
    closeBtnRef.current?.focus();
  }, [mounted, visible, isWorkModal]);

  // Soft fade out → swap work → fade in (same FADE_MS as section switches).
  const requestWorkNavigate = useCallback(
    (nextWork: OtherWork) => {
      if (!onNavigateWork || sectionBusyRef.current) return;
      if (nextWork.id === work?.id) return;
      sectionBusyRef.current = true;
      setContentVisible(false);
      if (sectionTimerRef.current !== null) {
        window.clearTimeout(sectionTimerRef.current);
      }
      sectionTimerRef.current = window.setTimeout(() => {
        onNavigateWork(nextWork);
        sectionTimerRef.current = null;
      }, FADE_MS);
    },
    [onNavigateWork, work?.id],
  );

  // After parent swaps work: scroll top, fade in, focus title.
  useEffect(() => {
    if (!open || !isWorkModal || !work) {
      workNavIdRef.current = null;
      return;
    }
    const previousId = workNavIdRef.current;
    workNavIdRef.current = work.id;
    if (!previousId || previousId === work.id) return;

    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setContentVisible(true);
        sectionBusyRef.current = false;
        document.getElementById(`${dialogId}-title`)?.focus();
      });
    });
  }, [work, work?.id, open, isWorkModal, dialogId]);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = getFocusable(dialogRef.current);
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey) {
          if (active === first || !dialogRef.current.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !dialogRef.current.contains(active)) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      const el = scrollRef.current;
      if (!el) return;

      const page = Math.max(120, el.clientHeight * 0.85);
      let handled = true;
      switch (event.key) {
        case "ArrowDown":
          el.scrollTop += 48;
          break;
        case "ArrowUp":
          el.scrollTop -= 48;
          break;
        case "PageDown":
          el.scrollTop += page;
          break;
        case "PageUp":
          el.scrollTop -= page;
          break;
        case "Home":
          el.scrollTop = 0;
          break;
        case "End":
          el.scrollTop = el.scrollHeight;
          break;
        case " ":
          el.scrollTop += event.shiftKey ? -page : page;
          break;
        default:
          handled = false;
      }
      if (handled) {
        event.preventDefault();
        syncThumb();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [mounted, onClose, syncThumb]);

  useLayoutEffect(() => {
    if (!mounted || !contentVisible) return;
    syncThumb();
  }, [mounted, contentVisible, displayedId, activeChildId, syncThumb]);

  useEffect(() => {
    if (!mounted) return;
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      syncThumb();
      syncActiveChildFromScroll();
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(() => syncThumb());
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    // Sync once after section content paints (decision blocks may just have mounted).
    window.requestAnimationFrame(() => syncActiveChildFromScroll());

    return () => {
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [mounted, displayedId, contentVisible, syncThumb, syncActiveChildFromScroll]);

  useEffect(() => {
    return () => {
      if (sectionTimerRef.current !== null) {
        window.clearTimeout(sectionTimerRef.current);
      }
      if (blinkScrollTimerRef.current !== null) {
        window.clearTimeout(blinkScrollTimerRef.current);
      }
      if (blinkClearTimerRef.current !== null) {
        window.clearTimeout(blinkClearTimerRef.current);
      }
      if (spyResumeTimerRef.current !== null) {
        window.clearTimeout(spyResumeTimerRef.current);
      }
    };
  }, []);

  if (!mounted) return null;

  const sidebarTitle = portfolio?.title ?? dummyCaseStudy.name;
  const sidebarSubtitle = portfolio?.subtitle ?? dummyCaseStudy.blurb;
  const sidebarFooter = portfolio?.footerNote ?? dummyCaseStudy.footer;

  let eyebrowNumber = "01";
  let eyebrowLabel = "Overview";

  if (portfolio) {
    const section =
      portfolio.sections.find((item) => item.id === displayedId) ??
      portfolio.sections[0];
    eyebrowNumber = section.number;
    eyebrowLabel = section.name;
  } else {
    const section =
      dummyCaseStudy.sections.find((item) => item.id === displayedId) ??
      dummyCaseStudy.sections[0];
    eyebrowNumber = DUMMY_NAV_INDEX[section.id];
    eyebrowLabel = section.navLabel;
  }

  return (
    <div
      className={`fixed inset-0 z-[70] flex cursor-default items-center justify-center bg-black/75 p-3 transition-opacity duration-300 ease-out sm:p-5 md:bg-black/60 md:p-7 md:backdrop-blur-[2px] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          nudgeCloseIcon();
        }
      }}
    >
      <div
        ref={dialogRef}
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-title`}
        className={`relative flex h-[min(90vh,54rem)] w-full cursor-default overflow-hidden rounded-[1.35rem] text-[#F3EEE8] transition-[opacity,transform] duration-300 ease-out ${
          workCompact ? "max-w-[28rem]" : "max-w-[68rem]"
        } ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-1.5 opacity-0"
        }`}
        style={{
          background: "#171412",
          border: "2px solid rgba(243, 238, 232, 0.14)",
          boxShadow:
            "0 24px 70px rgba(0, 0, 0, 0.55), 0 0 40px rgba(0, 0, 0, 0.45), 0 0 80px rgba(0, 0, 0, 0.35), 0 0 120px rgba(0, 0, 0, 0.25)",
        }}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {/* Sidebar — hidden for Other Works (Concepts / UI Animation / 3D) */}
        {!hideNav ? (
          <aside
            className="hidden w-[15.75rem] shrink-0 flex-col border-r border-[#43362F] bg-[#211B18] px-5 py-6 lg:flex lg:w-[16.5rem] lg:px-6"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 90% 70% at 78% 18%, rgba(200, 145, 80, 0.12) 0%, rgba(200, 145, 80, 0.06) 28%, rgba(200, 145, 80, 0.024) 52%, transparent 78%)",
            }}
          >
            <div className="shrink-0 pr-2">
              <h2
                id={`${dialogId}-title`}
                className="text-[1.55rem] font-semibold tracking-tight text-[#F3EEE8]"
              >
                {sidebarTitle}
              </h2>
              <p className="mt-2 text-[0.78rem] leading-snug text-[#BDB0A5]">
                {sidebarSubtitle}
              </p>
            </div>

            {portfolio ? (
              <PortfolioSidebarNav
                menu={portfolio.menu}
                activeId={activeId}
                activeChildId={activeChildId}
                onSelectSection={selectSection}
                onSelectChild={(sectionId, childId) =>
                  selectSection(sectionId, childId)
                }
                sectionButtonRefs={sectionButtonRefs}
              />
            ) : (
              <DummySidebarNav
                sections={dummyCaseStudy.sections}
                activeId={activeId}
                onSelectSection={(id) => selectSection(id)}
              />
            )}

            <p className="mt-6 max-w-[12.5rem] shrink-0 text-[0.68rem] leading-relaxed text-[#BDB0A5]">
              {sidebarFooter}
            </p>
          </aside>
        ) : null}

        {/* Main */}
        <div
          className="relative flex min-w-0 flex-1 flex-col bg-[#171412]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 90% 70% at 78% 18%, rgba(200, 145, 80, 0.12) 0%, rgba(200, 145, 80, 0.06) 28%, rgba(200, 145, 80, 0.024) 52%, transparent 78%)",
          }}
        >
          <header className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-6">
            <p
              className={`pt-1.5 text-[0.82rem] font-medium tracking-wide transition-opacity duration-300 ease-out ${
                contentVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ color: SECTION_CUE }}
            >
              {isWorkModal && work ? (
                OTHER_WORK_CATEGORY_LABEL[work.category]
              ) : (
                <>
                  <span className="tabular-nums">{eyebrowNumber}</span>
                  <span className="opacity-70"> / </span>
                  {eyebrowLabel}
                </>
              )}
            </p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="case-study-close-btn inline-flex h-9 w-9 origin-center cursor-pointer items-center justify-center rounded-full border border-solid text-[1.15rem] leading-none text-[#F3EEE8] transition-[border-color] duration-150 ease-out"
              aria-label={isWorkModal ? "Close work" : "Close case study"}
            >
              <span aria-hidden="true" className="block leading-none">
                ×
              </span>
            </button>
          </header>

          {/* Mobile section switcher — skipped when nav is hidden */}
          {!hideNav ? (
            <div className="mt-3 flex shrink-0 gap-1.5 overflow-x-auto px-5 pb-1 lg:hidden">
              {portfolio
                ? portfolio.menu.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onPointerDown={suppressMouseFocus}
                        onClick={() => selectSection(item.id)}
                        className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[0.68rem] tracking-wide whitespace-nowrap outline-none transition-[color,background-color,border-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus)] ${
                          isActive
                            ? "border border-[#C89150] text-[#F3EEE8]"
                            : "border border-transparent text-[#BDB0A5]"
                        }`}
                      >
                        {item.number} {item.label}
                      </button>
                    );
                  })
                : dummyCaseStudy.sections.map((item) => {
                    const isActive = item.id === activeId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onPointerDown={suppressMouseFocus}
                        onClick={() => selectSection(item.id)}
                        className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[0.68rem] tracking-wide whitespace-nowrap outline-none transition-[color,background-color,border-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus)] ${
                          isActive
                            ? "border border-[#C89150] text-[#F3EEE8]"
                            : "border border-transparent text-[#BDB0A5]"
                        }`}
                      >
                        {DUMMY_NAV_INDEX[item.id]} {item.navLabel}
                      </button>
                    );
                  })}
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 gap-3 pr-3 sm:pr-4">
            <div
              id={scrollRegionId}
              ref={scrollRef}
              tabIndex={0}
              className={`case-study-popup-scroll min-h-0 min-w-0 flex-1 overflow-y-auto px-5 pt-5 pb-7 outline-none transition-opacity duration-300 ease-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-7 sm:pt-5 sm:pb-8 ${
                contentVisible ? "opacity-100" : "opacity-0"
              }`}
              onScroll={syncThumb}
            >
              {isWorkModal && work ? (
                <WorkModalBody
                  key={work.id}
                  work={work}
                  headingId={`${dialogId}-title`}
                  mediaActive={visible && contentVisible}
                  compact={workCompact}
                  onOpenCaseStudy={onOpenCaseStudy}
                  onNavigateWork={requestWorkNavigate}
                />
              ) : isPortfolio && portfolio ? (
                <PortfolioSectionBody
                  study={portfolio}
                  sectionId={displayedId}
                  onOpenStudy={openStudy}
                  activeResearchStudyId={
                    isResearchSection(displayedId) ? activeChildId : null
                  }
                  onOpenResearchStudy={(studyId, fromCardId) =>
                    openResearchStudy(studyId, "card", fromCardId)
                  }
                  onBackResearchStudy={backResearchStudy}
                  researchBackButtonRef={researchBackButtonRef}
                  researchLinkButtonRefs={researchLinkButtonRefs}
                />
              ) : (
                <DummySectionBody
                  section={
                    dummyCaseStudy.sections.find(
                      (item) => item.id === displayedId,
                    ) ?? dummyCaseStudy.sections[0]
                  }
                />
              )}
            </div>

            <CaseStudyScrollRail
              scrollRef={scrollRef}
              thumb={thumb}
              controlsId={scrollRegionId}
              overflowing={overflowing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
