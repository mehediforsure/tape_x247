// Deterministic graphic placeholders, not release artwork or documentary images.
export default function CoverArt({ seed, label, className = "" }: {
  seed: string;
  label?: string;
  className?: string;
}) {
  const hash = Array.from(seed).reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 0);
  return (
    <div className={`cover ${className}`} aria-hidden="true">
      <svg viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <rect width="640" height="480" fill="#262626" />
        {Array.from({ length: 22 }, (_, index) => {
          const height = 30 + ((hash + index * 7919) % 290);
          return <rect key={index} x={38 + index * 26} y={240 - height / 2} width="12" height={height} fill="#a8a8a8" opacity={0.2 + (index % 4) * 0.15} />;
        })}
        <path d="M24 24H616V456H24Z M24 400H616" fill="none" stroke="#737373" />
        <text x="40" y="436" fill="#dedede" fontSize="16" fontFamily="monospace">{label || "tape_x247"} / DEMO ART</text>
      </svg>
    </div>
  );
}
