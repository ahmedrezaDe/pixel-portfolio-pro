import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { sfx } from "./audio";

const XP_PER_LEVEL = 100;
const STORAGE_KEY = "erza.gamestate.v1";

type Persisted = {
  xp: number;
  level: number;
  muted: boolean;
  crtOn: boolean;
  secretTheme: boolean;
  visited: string[];
};

type Ctx = Persisted & {
  addXp: (amount: number, reason?: string) => void;
  toggleMute: () => void;
  toggleCRT: () => void;
  toggleSecretTheme: () => void;
  markVisited: (key: string) => void;
  sfx: typeof sfx;
};

const GameCtx = createContext<Ctx | null>(null);

const initial: Persisted = {
  xp: 0,
  level: 1,
  muted: false,
  crtOn: true,
  secretTheme: false,
  visited: [],
};

function loadPersisted(): Persisted {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) };
  } catch {
    return initial;
  }
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Persisted>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [leveledUp, setLeveledUp] = useState<number | null>(null);
  const lastLevel = useRef(1);

  // Hydrate after mount (avoid SSR mismatch)
  useEffect(() => {
    const p = loadPersisted();
    lastLevel.current = p.level;
    setState(p);
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  // Apply secret theme
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("secret-theme", state.secretTheme);
  }, [state.secretTheme]);

  const addXp = useCallback((amount: number) => {
    setState((s) => {
      const totalXp = s.xp + amount;
      const newLevel = 1 + Math.floor(totalXp / XP_PER_LEVEL);
      if (newLevel > lastLevel.current) {
        lastLevel.current = newLevel;
        setLeveledUp(newLevel);
        sfx.levelUp(s.muted);
      }
      return { ...s, xp: totalXp, level: newLevel };
    });
  }, []);

  const toggleMute = useCallback(
    () => setState((s) => ({ ...s, muted: !s.muted })),
    [],
  );
  const toggleCRT = useCallback(
    () => setState((s) => ({ ...s, crtOn: !s.crtOn })),
    [],
  );
  const toggleSecretTheme = useCallback(
    () => setState((s) => ({ ...s, secretTheme: !s.secretTheme })),
    [],
  );
  const markVisited = useCallback((key: string) => {
    setState((s) => {
      if (s.visited.includes(key)) return s;
      const next = { ...s, visited: [...s.visited, key], xp: s.xp + 5 };
      const newLevel = 1 + Math.floor(next.xp / XP_PER_LEVEL);
      if (newLevel > lastLevel.current) {
        lastLevel.current = newLevel;
        setLeveledUp(newLevel);
        sfx.levelUp(s.muted);
      }
      next.level = newLevel;
      return next;
    });
  }, []);

  // Auto-clear banner
  useEffect(() => {
    if (leveledUp == null) return;
    const t = setTimeout(() => setLeveledUp(null), 2400);
    return () => clearTimeout(t);
  }, [leveledUp]);

  return (
    <GameCtx.Provider
      value={{
        ...state,
        addXp,
        toggleMute,
        toggleCRT,
        toggleSecretTheme,
        markVisited,
        sfx,
      }}
    >
      {children}
      {leveledUp != null && <LevelUpBannerInline level={leveledUp} />}
    </GameCtx.Provider>
  );
}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error("useGame outside GameProvider");
  return c;
}

export const XP_THRESHOLD = XP_PER_LEVEL;

// Inlined here to avoid an extra file; lightweight.
function LevelUpBannerInline({ level }: { level: number }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center"
    >
      <div
        className="font-pixel text-2xl uppercase tracking-widest text-white sm:text-4xl"
        style={{
          padding: "1rem 2rem",
          background: "var(--accent-purple, #6d28d9)",
          border: "3px solid #000",
          boxShadow: "8px 8px 0 0 #000",
          animation: "lvlup-pop 2.4s ease-out forwards",
        }}
      >
        ◤ LEVEL UP! ◢
        <div className="mt-2 text-center font-pixel text-xs opacity-90">
          LV. {level}
        </div>
      </div>
      <style>{`
        @keyframes lvlup-pop {
          0% { transform: scale(0.4); opacity: 0; }
          15% { transform: scale(1.1); opacity: 1; }
          25% { transform: scale(1); }
          85% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
