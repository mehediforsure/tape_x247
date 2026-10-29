import Image from "next/image";

export default function CoverArt({ seed, label, className = "", imageSrc, eager = false, sizes = "(max-width: 979px) calc(100vw - 40px), 940px" }: {
  seed: string;
  label?: string;
  className?: string;
  imageSrc?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const image = imageSrc;

  return (
    <div className={`cover ${className}`} aria-hidden="true">
      {image ? <Image src={image} alt="" fill priority={eager} loading={eager ? "eager" : "lazy"} quality={90} sizes={sizes} className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-xs uppercase text-muted">{label ?? "Artwork unavailable"}</span>}
    </div>
  );
}
