import { useEffect, useState } from "react";
import { PixelAvatar } from "./PixelAvatar";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 2200;
    const tick = (t: number) => {
      const pct = Math.min(100, Math.round(((t - start) / dur) * 100));
      setP(pct);
      if (pct < 100) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const cells = 20;
  const filled = Math.round((p / 100) * cells);

  return (
    <div className="scanlines flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="font-pixel text-xs uppercase tracking-widest text-[var(--ink)]">
          Loading
        </div>
        <div className="font-pixel text-[10px] text-[var(--muted-foreground)]">
          {String(p).padStart(3, "0")}%
        </div>
        <div className="flex gap-[3px] border-2 border-[var(--ink)] bg-white p-1 pixel-box">
          {Array.from({ length: cells }).map((_, i) => (
            <div
              key={i}
              className="h-5 w-3"
              style={{
                background: i < filled ? "var(--accent-green)" : "transparent",
                borderRight: "1px solid rgba(0,0,0,0.08)",
              }}
            />
          ))}
        </div>
        <div className="mt-2">
          <PixelAvatar size={80} walking />
        </div>
        <div className="font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]">
          Press any key
        </div>
      </div>
    </div>
  );
}
