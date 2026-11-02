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
  /** Handset chrome colour. Default dark. */
  tone?: "dark" | "white";
};

/**
 * Minimal Android handset chrome: bezel, punch-hole camera, gesture bar.
 * Screen media fills the inner display (object-cover) at the given ratio.
 */
export function AndroidPhoneFrame({
  id,
  src,
  alt,
  aspectRatio = "9 / 19.5",
  unoptimized = false,
  className = "mx-auto w-full max-w-[14.5rem]",
  tone = "dark",
}: AndroidPhoneFrameProps) {
  const white = tone === "white";

  return (
    <figure id={id} className={className}>
      <div
        className={
          white
            ? "relative rounded-[1.85rem] border border-[#D4CCC4] bg-[#F7F4F0] px-[0.55rem] pt-[0.7rem] pb-[0.55rem] shadow-[0_18px_40px_rgba(0,0,0,0.28)] ring-1 ring-black/5"
            : "relative rounded-[1.85rem] border border-white/10 bg-[#0c0c0d] px-[0.55rem] pt-[0.7rem] pb-[0.55rem] shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
        }
      >
        {/* Punch-hole camera in the top bezel */}
        <div
          className={
            white
              ? "mx-auto mb-[0.45rem] h-[0.5rem] w-[0.5rem] rounded-full bg-[#1A1512] ring-1 ring-black/20"
              : "mx-auto mb-[0.45rem] h-[0.5rem] w-[0.5rem] rounded-full bg-[#050505] ring-1 ring-white/15"
          }
          aria-hidden
        />

        <div
          className={
            white
              ? "relative w-full overflow-hidden rounded-[1.35rem] bg-[#EDE7E0]"
              : "relative w-full overflow-hidden rounded-[1.35rem] bg-[#1a1028]"
          }
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
          className={
            white
              ? "mx-auto mt-[0.45rem] h-[0.22rem] w-[2.6rem] rounded-full bg-[#1A1512]/35"
              : "mx-auto mt-[0.45rem] h-[0.22rem] w-[2.6rem] rounded-full bg-white/25"
          }
          aria-hidden
        />
      </div>
    </figure>
  );
}
