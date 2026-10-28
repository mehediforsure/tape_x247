export default function CoverArt({
  seed,
  label,
  className = "",
  imageSrc,
  compact = false,
  eager = false,
}: {
  seed: string;
  label?: string;
  className?: string;
  imageSrc?: string;
  /** Small thumbnails: show a quiet dot instead of fallback text that would clip. */
  compact?: boolean;
  /** Above-the-fold images load immediately; everything else is lazy. */
  eager?: boolean;
}) {
  return (
    <div className={`cover ${className}`} aria-hidden="true" data-seed={seed}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : compact ? (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted">●</span>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center font-mono text-xs uppercase text-muted">
          {label ?? "Artwork unavailable"}
        </span>
      )}
    </div>
  );
}
