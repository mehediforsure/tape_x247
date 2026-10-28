/** Fixed decorative texture; no scroll listeners or animation. */
export default function Background() {
  return (
    <div className="background-layer" aria-hidden="true">
      <div className="background-tile" />
    </div>
  );
}
