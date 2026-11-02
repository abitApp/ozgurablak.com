import Image from "next/image";

type ImagePlaceholderProps = {
  id: string;
  description: string;
  aspectRatio: string | number;
  src?: string;
  alt?: string;
  /** Skip Next optimizer — use for text-heavy specs so type stays sharp. */
  unoptimized?: boolean;
  /** Default cover; contain for documents; fill stretches to the frame. */
  objectFit?: "cover" | "contain" | "fill";
  /** Next/Image quality 1–100. Default 92 for case-study detail. */
  quality?: number;
  /**
   * Frame corner radius. Use `rounded-none` when the asset already has its
   * own curves so the shell does not clip them.
   */
  roundedClassName?: string;
  /** Omit the frame border (e.g. phone assets with their own edge). */
  framed?: boolean;
  /** Frame outline colour when framed. Default site ink. */
  frameBorder?: "default" | "white";
  /** Figure background. Default warm brown for placeholders / letterboxing. */
  backgroundClassName?: string;
};

/**
 * Case-study image slot. Without `src`, shows a dashed placeholder labelled
 * with the intended image description. With `src`, renders the real image.
 */
export function ImagePlaceholder({
  id,
  description,
  aspectRatio,
  src,
  alt,
  unoptimized = false,
  objectFit = "cover",
  quality = 92,
  roundedClassName = "rounded-[1.1rem]",
  framed = true,
  frameBorder = "default",
  backgroundClassName = "bg-[#211B18]/80",
}: ImagePlaceholderProps) {
  const ratio =
    typeof aspectRatio === "number" ? String(aspectRatio) : aspectRatio;
  const frameBorderClass = !framed
    ? "border-0"
    : frameBorder === "white"
      ? "border border-white/10"
      : "border border-[#43362F]";

  if (src) {
    const isAnimatedGif = /\.gif($|\?)/i.test(src);
    const skipOptimize = unoptimized || isAnimatedGif;
    const fitClass =
      objectFit === "contain"
        ? "object-contain"
        : objectFit === "fill"
          ? "object-fill"
          : "object-cover";
    // Radius only on the figure — doubling it on the <img> makes corners look broken.
    const mediaClass = `absolute inset-0 h-full w-full max-w-none select-none [-webkit-user-drag:none] ${fitClass}`;

    return (
      <figure
        id={id}
        className={`relative w-full overflow-hidden [transform:translateZ(0)] ${backgroundClassName} ${frameBorderClass} ${roundedClassName}`}
        style={{ aspectRatio: ratio }}
      >
        {/* Native <img> keeps animated GIFs playing; next/image can freeze them. */}
        {isAnimatedGif ? (
          <img
            src={src}
            alt={alt ?? description}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className={mediaClass}
          />
        ) : (
          <Image
            src={src}
            alt={alt ?? description}
            fill
            quality={skipOptimize ? undefined : quality}
            unoptimized={skipOptimize}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className={mediaClass}
            sizes="(max-width: 768px) 92vw, min(68rem, 100vw)"
          />
        )}
      </figure>
    );
  }

  return (
    <figure
      id={id}
      className={`flex w-full flex-col items-center justify-center gap-1.5 border border-dashed border-[#43362F] px-4 py-8 text-center ${backgroundClassName} ${roundedClassName}`}
      style={{ aspectRatio: ratio }}
      aria-label={`Image placeholder: ${description}`}
    >
      <p className="text-[0.68rem] font-medium tracking-[0.14em] text-[#BDB0A5] uppercase">
        IMAGE PLACEHOLDER
      </p>
      <p className="max-w-[36rem] text-[0.78rem] leading-snug text-[#BDB0A5]/90">
        {description}
      </p>
    </figure>
  );
}
