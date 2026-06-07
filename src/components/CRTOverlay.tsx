export function CRTOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] animate-flicker"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, rgba(0,0,0,0.045) 0, rgba(0,0,0,0.045) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "multiply",
      }}
    />
  );
}
