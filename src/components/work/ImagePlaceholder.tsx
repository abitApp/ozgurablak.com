import Image from "next/image";

type ImagePlaceholderProps = {
  id: string;
  description: string;
  aspectRatio: string | number;
  src?: string;
  alt?: string;
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
}: ImagePlaceholderProps) {
  const ratio =
    typeof aspectRatio === "number" ? String(aspectRatio) : aspectRatio;

  if (src) {
    const isAnimatedGif = /\.gif($|\?)/i.test(src);

    return (
      <figure
        id={id}
        className="relative w-full overflow-hidden rounded-[1.1rem] border border-[#43362F] bg-[#211B18]/80"
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={src}
          alt={alt ?? description}
          fill
          unoptimized={isAnimatedGif}
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
          className="select-none object-cover [-webkit-user-drag:none]"
          sizes="(max-width: 768px) 90vw, 40vw"
        />
      </figure>
    );
  }

  return (
    <figure
      id={id}
      className="flex w-full flex-col items-center justify-center gap-1.5 rounded-[1.1rem] border border-dashed border-[#43362F] bg-[#211B18]/80 px-4 py-8 text-center"
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
