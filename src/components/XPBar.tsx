import { useGame, XP_THRESHOLD } from "@/lib/game-state";

export function XPBar() {
  const { xp, level } = useGame();
  const into = xp % XP_THRESHOLD;
  const pct = (into / XP_THRESHOLD) * 100;

  return (
    <div className="fixed left-1/2 top-2 z-[55] w-[min(92vw,520px)] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-md border-2 border-[var(--ink)] bg-white/95 px-3 py-1.5 backdrop-blur pixel-box-sm shadow-[3px_3px_0_0_var(--ink)]">
        <span className="font-pixel text-[9px] uppercase tracking-wider">
          LV.{level}
        </span>
        <div className="relative h-3 flex-1 overflow-hidden border-2 border-[var(--ink)] bg-[var(--muted)]">
          <div
            className="h-full transition-[width] duration-500"
            style={{
              width: `${pct}%`,
              background:
                "repeating-linear-gradient(90deg, var(--accent-purple) 0 6px, oklch(0.45 0.24 295) 6px 12px)",
            }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.18) 0 1px, transparent 1px 3px)",
          }} />
        </div>
        <span className="font-pixel text-[8px] tabular-nums">
          {into}/{XP_THRESHOLD}
        </span>
      </div>
    </div>
  );
}
