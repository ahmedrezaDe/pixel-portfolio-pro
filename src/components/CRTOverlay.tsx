import { useGame } from "@/lib/game-state";

export function CRTOverlay() {
  const { crtOn } = useGame();
  if (!crtOn) return null;
  return (
    <>
      {/* Scanlines + flicker */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] animate-flicker"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,0.06) 0, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Vignette + screen glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[59]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.18) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[59]"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 30%, rgba(120,180,255,0.06), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}
