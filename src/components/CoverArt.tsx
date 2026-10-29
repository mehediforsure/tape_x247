import Image from "next/image";

export default function CoverArt({ seed, label, className = "", imageSrc, eager = false }: {
  seed: string;
  label?: string;
  className?: string;
  imageSrc?: string;
  eager?: boolean;
}) {
  const image = imageSrc;

  return (
    <div className={`cover ${className}`} aria-hidden="true">
      {image ? <Image src={image} alt="" fill priority={eager} loading={eager ? "eager" : "lazy"} quality={90} sizes="(max-width: 1024px) 100vw, 980px" className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-xs uppercase text-muted">{label ?? "Artwork unavailable"}</span>}
    </div>
  );
}
