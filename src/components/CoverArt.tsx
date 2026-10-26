

export default function CoverArt({ seed, label, className = "", imageSrc }: {
  seed: string;
  label?: string;
  className?: string;
  imageSrc?: string;
}) {
  const image = imageSrc;

  return (
    <div className={`cover ${className}`} aria-hidden="true">
      {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-xs uppercase text-muted">{label ?? "Artwork unavailable"}</span>}
    </div>
  );
}
