import Image from "next/image";

type AndroidPhoneFrameProps = {
  id: string;
  src: string;
  alt: string;
  /**
   * Inner screen ratio. Same value for every phone in a row keeps heights
   * equal; defaults to a tall handset when omitted.
   */
  aspectRatio?: string;
  unoptimized?: boolean;
  /** Outer figure classes. Default: centered with max-w-[14.5rem]. */
  className?: string;
};

/**
 * Minimal Android handset chrome: dark bezel, punch-hole camera, gesture bar.
 * Screen media fills the inner display (object-cover) at the given ratio.
 */
export function AndroidPhoneFrame({
  id,
  src,
  alt,
  aspectRatio = "9 / 19.5",
  unoptimized = false,
  className = "mx-auto w-full max-w-[14.5rem]",
}: AndroidPhoneFrameProps) {
  return (
    <figure id={id} className={className}>
      <div className="relative rounded-[1.85rem] border border-black/80 bg-[#0c0c0d] px-[0.55rem] pt-[0.7rem] pb-[0.55rem] shadow-[0_18px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
        {/* Punch-hole camera in the top bezel */}
        <div
          className="mx-auto mb-[0.45rem] h-[0.5rem] w-[0.5rem] rounded-full bg-[#050505] ring-1 ring-white/15"
          aria-hidden
        />

        <div
          className="relative w-full overflow-hidden rounded-[1.35rem] bg-[#1a1028]"
          style={{ aspectRatio }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized={unoptimized}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className="absolute inset-0 h-full w-full max-w-none select-none object-cover object-top [-webkit-user-drag:none]"
            sizes="(max-width: 768px) 45vw, 14.5rem"
          />
        </div>

        {/* Gesture home indicator */}
        <div
          className="mx-auto mt-[0.45rem] h-[0.22rem] w-[2.6rem] rounded-full bg-white/25"
          aria-hidden
        />
      </div>
    </figure>
  );
}
