import { useGame } from "@/lib/game-state";

export function SettingsToggles() {
  const { crtOn, muted, toggleCRT, toggleMute, sfx } = useGame();

  const btn =
    "h-9 px-3 font-pixel text-[9px] uppercase tracking-wider border-2 border-[var(--ink)] shadow-[3px_3px_0_0_var(--ink)] bg-white hover:-translate-y-0.5 transition-transform";

  return (
    <div className="fixed right-3 top-3 z-[58] flex gap-2 sm:right-5 sm:top-5">
      <button
        className={btn}
        onClick={() => {
          sfx.click(muted);
          toggleCRT();
        }}
        aria-pressed={crtOn}
        title="Toggle CRT effect"
      >
        CRT: {crtOn ? "ON" : "OFF"}
      </button>
      <button
        className={btn}
        onClick={() => {
          sfx.click(false); // play to confirm before toggling
          toggleMute();
        }}
        aria-pressed={!muted}
        title="Toggle sound"
      >
        {muted ? "🔇 MUTE" : "🔊 SND"}
      </button>
    </div>
  );
}
