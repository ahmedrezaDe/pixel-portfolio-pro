import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { useGame } from "@/lib/game-state";

// --- LOVABLE LOGIC TYPES ---
type AttackId = "debug" | "refactor" | "caffeine" | "force";
type Phase = "player" | "enemy" | "win" | "lose";
type LogLine = { id: number; text: string; kind: "in" | "out" | "err" };
type FloatNum = { id: number; x: number; y: number; value: number | string; color: string };

const PLAYER_MAX = 100;
const ENEMY_MAX = 240;

export const VOID_ENCOUNTER_EVENT = "void:encounter";

// --- ORIGINAL UI CONSTANTS ---
const FRAGMENTS = [
  "// TODO: fix this", "{ undefined }", "NaN", "catch (e) {}", "// FIXME",
  "</div>", "null.map()", "any;", "merge conflict", "// HACK",
  "[object Object]", "Promise<never>",
];

const AMALGAM = [
  "  ggg      mmm  ",
  " gg gg    mm mm ",
  "gg  gg   mm  mm",
  "g k ggmm k m",
  "g kwk gm kwk m",
  "gg  gmmgg  mmg",
  " ggmmm    mmmgg ",
  "  gmkkkkkkkkmg  ",
  " mgk w w wkgm  ",
  " mg kkkkkkkk gm ",
  " mgg      ggm  ",
  "  m gg  gg m   ",
];

// --- MAIN COMPONENT ---
export default function VoidEncounter() {
  // LOVABLE'S BRAIN
  const { addXp, sfx, muted } = useGame();
  const [open, setOpen] = useState(false);
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX);
  const [enemyHp, setEnemyHp] = useState(ENEMY_MAX);
  const [phase, setPhase] = useState<Phase>("player");
  const [log, setLog] = useState<LogLine[]>([]);
  const [floats, setFloats] = useState<FloatNum[]>([]);
  const [flash, setFlash] = useState(false);
  const [artifact, setArtifact] = useState<string | null>(null);
  
  const idRef = useRef(0);
  const shake = useAnimationControls();

  // EVENT LISTENER TO START BATTLE
  useEffect(() => {
    const handler = () => {
      setPlayerHp(PLAYER_MAX);
      setEnemyHp(ENEMY_MAX);
      setPhase("player");
      setLog([
        { id: ++idRef.current, text: "> A wild THE TODO_AMALGAM coalesces from unfinished commits...", kind: "err" },
        { id: ++idRef.current, text: "> ERZA enters combat. Choose your action.", kind: "out" },
      ]);
      setArtifact(null);
      setOpen(true);
    };
    window.addEventListener(VOID_ENCOUNTER_EVENT, handler);
    return () => window.removeEventListener(VOID_ENCOUNTER_EVENT, handler);
  }, []);

  const pushLog = useCallback((text: string, kind: LogLine["kind"] = "out") => {
    setLog((l) => [...l.slice(-30), { id: ++idRef.current, text, kind }]);
  }, []);

  const spawnFloat = useCallback((value: number | string, color: string) => {
    const id = ++idRef.current;
    const x = 30 + Math.random() * 40; 
    const y = 30 + Math.random() * 20;
    setFloats((f) => [...f, { id, x, y, value, color }]);
    setTimeout(() => setFloats((f) => f.filter((n) => n.id !== id)), 1100);
  }, []);

  const triggerShake = useCallback((intensity = 10) => {
      void shake.start({
        x: [-intensity, intensity, -intensity * 0.6, intensity * 0.6, 0],
        transition: { duration: 0.35 },
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 180);
    }, [shake]
  );

  // ENEMY TURN AI
  useEffect(() => {
    if (!open || phase !== "enemy") return;
    const t = setTimeout(() => {
      const dmg = 8 + Math.floor(Math.random() * 14);
      pushLog(`> TODO_AMALGAM throws StackOverflowError → -${dmg} HP`, "err");
      triggerShake(8);
      sfx.error(muted);
      setPlayerHp((hp) => {
        const next = Math.max(0, hp - dmg);
        if (next <= 0) {
          setPhase("lose");
          pushLog("> SYSTEM CORRUPTED. KERNEL PANIC.", "err");
        } else {
          setPhase("player");
        }
        return next;
      });
    }, 800);
    return () => clearTimeout(t);
  }, [phase, open, pushLog, triggerShake, sfx, muted]);

  // PLAYER ATTACK LOGIC
  const attack = (id: AttackId) => {
    if (phase !== "player") return;
    sfx.click(muted);

    let dmg = 0; let recoil = 0; let heal = 0; let miss = false;
    let color = "#fff";

    if (id === "debug") {
      miss = Math.random() < 0.05;
      dmg = miss ? 0 : 15 + Math.floor(Math.random() * 10);
      color = "#39ff5f";
      if (!miss) pushLog(`> ERZA runs Debug.js → -${dmg} HP to AMALGAM`, "out");
    } else if (id === "refactor") {
      miss = Math.random() < 0.18;
      dmg = miss ? 0 : 25 + Math.floor(Math.random() * 15);
      heal = miss ? 0 : 10 + Math.floor(Math.random() * 8);
      color = "#ff2bd6";
      if (!miss) pushLog(`> ERZA Refactor()s spaghetti code → -${dmg} HP`, "out");
    } else if (id === "caffeine") {
      heal = 25 + Math.floor(Math.random() * 10);
      color = "#ffcf3a";
      pushLog(`> ERZA chugs Caffeine. INT increased!`, "out");
    } else {
      miss = Math.random() < 0.3;
      dmg = miss ? 0 : 60 + Math.floor(Math.random() * 20);
      recoil = miss ? 5 : 20 + Math.floor(Math.random() * 10);
      color = "#ff4d4d";
      if (!miss) pushLog(`> GIT PUSH --FORCE → MASSIVE DAMAGE: -${dmg} HP`, "out");
    }

    if (miss) {
      pushLog(`> Attack MISS. The void laughs.`, "err");
      spawnFloat("MISS", "#ffffff");
    } else {
      if (dmg > 0) {
        spawnFloat(`-${dmg}`, color);
        triggerShake(id === "force" ? 16 : 8);
      }
      if (id === "refactor" || id === "caffeine") sfx.levelUp(muted);
      else sfx.type(muted);
    }

    // Apply Enemy Damage
    if (dmg > 0) {
      setEnemyHp((hp) => {
        const next = Math.max(0, hp - dmg);
        if (next <= 0) {
          const drop = `ARTIFACT_0x${Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0").toUpperCase()}`;
          setArtifact(drop);
          setPhase("win");
          addXp(300, "void-encounter-win");
          sfx.levelUp(muted);
          pushLog(`> SYSTEM RESTORED. Acquired ${drop}.`, "out");
          return 0;
        }
        return next;
      });
    }

    // Apply Player Heal
    if (heal > 0) {
      spawnFloat(`+${heal}`, "#39ff5f");
      setPlayerHp((hp) => Math.min(PLAYER_MAX, hp + heal));
      pushLog(`> Recovered → +${heal} HP`, "out");
    }

    // Apply Player Recoil
    if (recoil > 0) {
      setPlayerHp((hp) => {
        const next = Math.max(0, hp - recoil);
        if (next <= 0) {
          setPhase("lose");
          pushLog("> RECOIL FATAL. KERNEL PANIC.", "err");
          return 0;
        }
        return next;
      });
      pushLog(`> Recoil shears your branch → -${recoil} HP`, "err");
    }

    // End Turn
    setTimeout(() => {
      setPhase((p) => (p === "player" ? "enemy" : p));
    }, 800);
  };

  const close = () => setOpen(false);

  // --- ORIGINAL UI BODY ---
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="void-battle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] overflow-hidden font-pixel text-white bg-[#05060a]"
        >
          {/* BACKGROUND: Parallax Void */}
          <ParallaxVoid />

          {/* FLASH OVERLAY (from Lovable) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-150 z-10"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(255,30,60,0.5), transparent 70%)",
              opacity: flash ? 1 : 0,
              mixBlendMode: "screen",
            }}
          />

          {/* HEADER: System Crash */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute left-1/2 top-4 -translate-x-1/2 border-2 border-white bg-black px-4 py-2 text-[10px] tracking-[0.3em] z-20"
            style={{ boxShadow: "4px 4px 0 #ff2bd6" }}
          >
            <span className="text-[#ff2bd6]">!! SYSTEM CRASH !!</span>{" "}
            <span className="text-[#39ff5f]">VOID ENCOUNTER</span>
          </motion.div>

          <button
            onClick={close}
            disabled={phase === "player" || phase === "enemy"}
            className="absolute right-4 top-4 border-2 border-white bg-black px-2 py-1 text-[10px] hover:bg-white hover:text-black z-20 disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-white"
            style={{ boxShadow: "3px 3px 0 #39ff5f" }}
          >
            ESC ✕
          </button>

          {/* BATTLEFIELD */}
          <div className="relative flex h-[calc(100%-260px)] w-full items-center justify-center z-20">
            
            {/* Enemy HP */}
            <div className="absolute left-1/2 top-16 -translate-x-1/2">
              <div className="border-2 border-white bg-black/80 p-3" style={{ boxShadow: "4px 4px 0 #ff2bd6" }}>
                <HpBar label="THE TODO_AMALGAM" hp={enemyHp} max={ENEMY_MAX} color="#ff2bd6" />
              </div>
            </div>

            {/* Monster Sprite */}
            <motion.div className="mt-10 relative" animate={shake}>
              <PixelMonster />
              <div
                className="mx-auto mt-2 h-2 w-40 rounded-full"
                style={{ background: "radial-gradient(ellipse, rgba(255,43,214,0.6), transparent 70%)" }}
              />

              {/* FLOATING DAMAGE NUMBERS */}
              <div className="pointer-events-none absolute inset-0">
                <AnimatePresence>
                  {floats.map((f) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 0, scale: 0.6 }}
                      animate={{ opacity: 1, y: -80, scale: 1.2 }}
                      exit={{ opacity: 0, y: -100 }}
                      transition={{ duration: 1 }}
                      className="absolute font-pixel text-xl md:text-3xl"
                      style={{
                        left: `${f.x}%`,
                        top: `${f.y}%`,
                        color: f.color,
                        textShadow: "3px 3px 0 #000",
                      }}
                    >
                      {f.value}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* WIN/LOSE BANNER */}
            {(phase === "win" || phase === "lose") && (
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute border-4 border-white bg-black px-8 py-6 text-center z-50 shadow-2xl"
                style={{ boxShadow: phase === "win" ? "8px 8px 0 0 #39ff5f" : "8px 8px 0 0 #ff4d4d" }}
              >
                <p className="font-pixel text-2xl uppercase tracking-widest" style={{ color: phase === "win" ? "#39ff5f" : "#ff4d4d" }}>
                  {phase === "win" ? "SYSTEM RESTORED" : "KERNEL PANIC"}
                </p>
                {artifact && (
                  <p className="mt-4 font-pixel text-xs uppercase tracking-widest text-white">
                    ✦ ACQUIRED: {artifact} ✦
                  </p>
                )}
              </motion.div>
            )}
          </div>

          {/* BOTTOM JRPG UI */}
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_1.5fr_1.2fr] z-20">
            {/* Hero HP */}
            <div className="border-4 border-white bg-black p-3" style={{ boxShadow: "6px 6px 0 #39ff5f" }}>
              <div className="flex items-center gap-3 h-full">
                <div
                  className="h-16 w-16 border-2 border-white shrink-0"
                  style={{
                    background: "linear-gradient(135deg,#39ff5f 0 50%, #0a0a0a 50% 100%)",
                    imageRendering: "pixelated",
                  }}
                />
                <div className="flex-1">
                  <HpBar label="ERZA" hp={playerHp} max={PLAYER_MAX} color="#39ff5f" />
                  <p className="mt-3 font-pixel text-[8px] uppercase tracking-widest text-white/50">
                    {phase === "player" ? "> YOUR TURN" : phase === "enemy" ? "> ENEMY ACTING…" : "> COMBAT CONCLUDED"}
                  </p>
                </div>
              </div>
            </div>

            {/* Battle Log */}
            <div className="border-4 border-white bg-black p-3 text-[10px] leading-relaxed text-[#9affb5] h-32 overflow-y-auto flex flex-col justify-end" style={{ boxShadow: "6px 6px 0 #ff2bd6" }}>
              <div className="mb-2 text-white border-b border-white/20 pb-1 sticky top-0 bg-black">&gt; BATTLE LOG</div>
              {log.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ color: l.kind === "err" ? "#ff4d4d" : l.kind === "in" ? "#fff" : "#39ff5f" }}
                >
                  {l.text}
                </motion.div>
              ))}
            </div>

            {/* Attack Menu */}
            <div className="grid grid-cols-2 gap-2 border-4 border-white bg-black p-3" style={{ boxShadow: "6px 6px 0 #39ff5f" }}>
              <AttackButton label="Debug.js" sub="15 DMG" accent="#39ff5f" disabled={phase !== "player"} onClick={() => attack("debug")} />
              <AttackButton label="Refactor()" sub="25 DMG / HEAL" accent="#ff2bd6" disabled={phase !== "player"} onClick={() => attack("refactor")} />
              <AttackButton label="Drink Caffeine" sub="HEAL ONLY" accent="#ffcf3a" disabled={phase !== "player"} onClick={() => attack("caffeine")} />
              <AttackButton label="Git Push --Force" sub="60 DMG / RECOIL" accent="#ff4d4d" disabled={phase !== "player"} onClick={() => attack("force")} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- SUB COMPONENTS (RESTORED ORIGINAL UI) ---

function HpBar({ label, hp, max, color }: { label: string; hp: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (hp / max) * 100));
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-baseline justify-between font-pixel text-[10px] tracking-wider">
        <span className="text-white" style={{ color }}>{label}</span>
        <span className="text-white/80">{Math.max(0, hp)} / {max}</span>
      </div>
      <div className="relative h-4 w-full border-2 border-white bg-black" style={{ boxShadow: "inset 0 0 0 2px #000, 0 0 0 2px #000" }}>
        <motion.div
          className="h-full"
          style={{ background: color, imageRendering: "pixelated" }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 4px)" }} />
      </div>
    </div>
  );
}

function AttackButton({ label, sub, onClick, accent, disabled }: { label: string; sub?: string; onClick?: () => void; accent: string; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative flex flex-col items-start justify-center gap-1 border-2 border-white bg-black/80 px-2 py-1 text-left font-pixel uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
      style={{ boxShadow: `3px 3px 0 0 #000, 3px 3px 0 1px ${accent}` }}
    >
      <span className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-30" style={{ background: accent }} />
      <span className="flex items-center gap-2 text-[9px]"><span style={{ color: accent }}>▶</span> {label}</span>
      {sub && <span className="text-white/50 text-[7px] ml-4">{sub}</span>}
    </button>
  );
}

function PixelMonster() {
  return (
    <motion.div
      animate={{ filter: ["hue-rotate(0deg)", "hue-rotate(40deg)", "hue-rotate(-30deg)", "hue-rotate(0deg)"] }}
      transition={{ filter: { duration: 2.4, repeat: Infinity, ease: "linear" } }}
      className="relative scale-125 md:scale-150"
      style={{ imageRendering: "pixelated" }}
    >
      <div className="grid" style={{ gridTemplateColumns: `repeat(${AMALGAM[0].length}, 14px)`, gridTemplateRows: `repeat(${AMALGAM.length}, 14px)` }}>
        {AMALGAM.flatMap((row, y) =>
          row.split("").map((c, x) => {
            const map: Record<string, string> = { g: "#39ff5f", m: "#ff2bd6", w: "#ffffff", k: "#0a0a0a" };
            const bg = map[c] ?? "transparent";
            return (
              <div
                key={`${x}-${y}`}
                style={{
                  width: 14, height: 14, background: bg,
                  boxShadow: bg === "transparent" ? undefined : `0 0 6px ${bg === "#0a0a0a" ? "transparent" : bg}`,
                }}
              />
            );
          })
        )}
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0, 0.5, 0], x: [0, 3, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ background: "repeating-linear-gradient(0deg, rgba(255,43,214,0.18) 0 2px, transparent 2px 6px)", mixBlendMode: "screen" }}
      />
    </motion.div>
  );
}

function ParallaxVoid() {
  const layers = useRef(
    [0, 1, 2].map((layer) =>
      Array.from({ length: 14 }).map((_, i) => ({
        text: FRAGMENTS[(i + layer * 3) % FRAGMENTS.length],
        top: ((i * 53 + layer * 17) % 100),
        left: ((i * 71 + layer * 29) % 100),
        size: 8 + layer * 3,
        speed: 18 + layer * 12,
        color: layer === 0 ? "#39ff5f" : layer === 1 ? "#ff2bd6" : "#9affb5",
        opacity: 0.15 + layer * 0.18,
      }))
    )
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(57,255,95,0.18), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(255,43,214,0.22), transparent 55%), #05060a" }} />
      <motion.div className="absolute inset-0 opacity-30" animate={{ backgroundPositionY: ["0px", "40px"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ backgroundImage: "linear-gradient(#39ff5f22 1px, transparent 1px), linear-gradient(90deg, #ff2bd622 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      {layers.map((layer, li) => (
        <div key={li} className="absolute inset-0">
          {layer.map((f, i) => (
            <motion.div
              key={`${li}-${i}`}
              className="absolute font-pixel whitespace-nowrap"
              style={{ top: `${f.top}%`, left: `${f.left}%`, fontSize: f.size, color: f.color, opacity: f.opacity, textShadow: `0 0 6px ${f.color}` }}
              animate={{ y: [-20, 20, -20], x: [0, li % 2 ? 10 : -10, 0] }}
              transition={{ duration: f.speed, repeat: Infinity, ease: "easeInOut", delay: (i % 5) * 0.4 }}
            >
              {f.text}
            </motion.div>
          ))}
        </div>
      ))}
      <div className="absolute inset-0 mix-blend-overlay opacity-40" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.45) 0 2px, transparent 2px 4px)" }} />
    </div>
  );
}