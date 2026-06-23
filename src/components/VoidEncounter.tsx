import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { useGame } from "@/lib/game-state";

type AttackId = "debug" | "refactor" | "force";
type Phase = "player" | "enemy" | "win" | "lose";
type LogLine = { id: number; text: string; kind: "in" | "out" | "err" };
type FloatNum = { id: number; x: number; y: number; value: number; color: string };

const PLAYER_MAX = 100;
const ENEMY_MAX = 140;

const AMALGAM = [
  "  ░░▓▓▓▒▒░░▓▓▓░░  ",
  " ▓▓ TODO ▒▒ NULL ▓▓",
  "▓▒  >>  fix(me)  ▒▓",
  "▓▒░ undefined is ░▒▓",
  "▓▒░ not a function░▒",
  " ▓▒  catch(💀)  ▒▓ ",
  "  ▓▓▒▒░░░░▒▒▓▓▓  ",
];

const ATTACKS: Record<
  AttackId,
  { label: string; hint: string; color: string }
> = {
  debug: {
    label: "Debug.js",
    hint: "LOW DMG · HIGH ACC",
    color: "var(--accent-green)",
  },
  refactor: {
    label: "Refactor()",
    hint: "MED DMG · SELF-HEAL",
    color: "var(--accent-purple)",
  },
  force: {
    label: "Git Push --Force",
    hint: "MASSIVE DMG · RECOIL",
    color: "var(--accent-red)",
  },
};

export const VOID_ENCOUNTER_EVENT = "void:encounter";

export function VoidEncounter() {
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

  // Listen for the global trigger fired from the terminal
  useEffect(() => {
    const handler = () => {
      setPlayerHp(PLAYER_MAX);
      setEnemyHp(ENEMY_MAX);
      setPhase("player");
      setLog([
        {
          id: ++idRef.current,
          text: "> A wild TODO_AMALGAM materialises from the void.",
          kind: "err",
        },
        {
          id: ++idRef.current,
          text: "> ERZA enters combat. Choose your action.",
          kind: "out",
        },
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

  const spawnFloat = useCallback((value: number, color: string) => {
    const id = ++idRef.current;
    const x = 40 + Math.random() * 20; // % of enemy panel
    const y = 30 + Math.random() * 20;
    setFloats((f) => [...f, { id, x, y, value, color }]);
    setTimeout(() => setFloats((f) => f.filter((n) => n.id !== id)), 1100);
  }, []);

  const triggerShake = useCallback(
    (intensity = 10) => {
      void shake.start({
        x: [-intensity, intensity, -intensity * 0.6, intensity * 0.6, 0],
        transition: { duration: 0.35 },
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 180);
    },
    [shake],
  );

  // Enemy turn
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

  const attack = (id: AttackId) => {
    if (phase !== "player") return;
    sfx.click(muted);

    let dmg = 0;
    let recoil = 0;
    let heal = 0;
    let miss = false;
    const a = ATTACKS[id];

    if (id === "debug") {
      miss = Math.random() < 0.05;
      dmg = miss ? 0 : 10 + Math.floor(Math.random() * 6);
    } else if (id === "refactor") {
      miss = Math.random() < 0.18;
      dmg = miss ? 0 : 18 + Math.floor(Math.random() * 8);
      heal = miss ? 0 : 6 + Math.floor(Math.random() * 4);
    } else {
      miss = Math.random() < 0.3;
      dmg = miss ? 0 : 38 + Math.floor(Math.random() * 14);
      recoil = miss ? 4 : 12 + Math.floor(Math.random() * 8);
    }

    if (miss) {
      pushLog(`> ${a.label} → MISS. The void laughs.`, "err");
    } else {
      pushLog(`> ${a.label} connects → -${dmg} HP to TODO_AMALGAM`, "out");
      spawnFloat(dmg, a.color);
      triggerShake(id === "force" ? 14 : 9);
      if (id === "refactor") sfx.levelUp(muted);
      else sfx.type(muted);
    }

    setEnemyHp((hp) => {
      const next = Math.max(0, hp - dmg);
      if (next <= 0) {
        const drop = `ARTIFACT_0x${Math.floor(Math.random() * 0xffff)
          .toString(16)
          .padStart(4, "0")
          .toUpperCase()}`;
        setArtifact(drop);
        setPhase("win");
        addXp(300, "void-encounter-win");
        sfx.levelUp(muted);
        pushLog(`> SYSTEM RESTORED. Acquired ${drop}.`, "out");
        return 0;
      }
      return next;
    });

    if (heal > 0) {
      setPlayerHp((hp) => Math.min(PLAYER_MAX, hp + heal));
      pushLog(`> Refactor stabilises stack → +${heal} HP`, "out");
    }
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

    setTimeout(() => {
      setPhase((p) => (p === "player" ? "enemy" : p));
    }, 650);
  };

  const close = () => {
    setOpen(false);
  };

  const playerPct = useMemo(
    () => Math.max(0, (playerHp / PLAYER_MAX) * 100),
    [playerHp],
  );
  const enemyPct = useMemo(
    () => Math.max(0, (enemyHp / ENEMY_MAX) * 100),
    [enemyHp],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="void-encounter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex flex-col bg-[#05050a]/95"
          style={{ backdropFilter: "blur(2px)" }}
        >
          {/* Red flash overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-150"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(255,30,60,0.35), transparent 60%)",
              opacity: flash ? 1 : 0,
              mixBlendMode: "screen",
            }}
          />

          {/* Glitch scanlines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,255,140,0.18) 2px 3px)",
            }}
          />

          <motion.div
            animate={shake}
            className="relative z-10 flex h-full flex-col px-4 py-6 sm:px-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-red)]">
                ◤ VOID ENCOUNTER · TURN-BASED ◢
              </p>
              <button
                onClick={close}
                disabled={phase === "player" || phase === "enemy"}
                className="font-pixel text-[9px] uppercase tracking-widest text-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  phase === "player" || phase === "enemy"
                    ? "Finish the battle first"
                    : "Exit"
                }
              >
                ✕ exit
              </button>
            </div>

            {/* Battle stage */}
            <div className="relative mx-auto mt-6 flex w-full max-w-3xl flex-1 flex-col items-center justify-center">
              {/* Enemy */}
              <div className="relative flex flex-col items-center">
                <div className="mb-3 w-full max-w-xs">
                  <HpBar
                    label="TODO_AMALGAM"
                    pct={enemyPct}
                    color="var(--accent-red)"
                    value={`${enemyHp}/${ENEMY_MAX}`}
                  />
                </div>
                <motion.pre
                  animate={
                    phase === "enemy"
                      ? { x: [-2, 2, -2, 0], filter: ["hue-rotate(0deg)", "hue-rotate(40deg)", "hue-rotate(0deg)"] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.4, repeat: phase === "enemy" ? Infinity : 0 }}
                  className="select-none font-pixel text-[10px] leading-tight text-[var(--accent-red)] sm:text-[13px]"
                  style={{
                    textShadow:
                      "2px 0 0 rgba(255,43,214,0.6), -2px 0 0 rgba(57,255,95,0.55)",
                  }}
                >
                  {AMALGAM.join("\n")}
                </motion.pre>

                {/* Floating damage */}
                <div className="pointer-events-none absolute inset-0">
                  <AnimatePresence>
                    {floats.map((f) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: 0, scale: 0.6 }}
                        animate={{ opacity: 1, y: -60, scale: 1.1 }}
                        exit={{ opacity: 0, y: -90 }}
                        transition={{ duration: 1 }}
                        className="absolute font-pixel text-base sm:text-xl"
                        style={{
                          left: `${f.x}%`,
                          top: `${f.y}%`,
                          color: f.color,
                          textShadow: "2px 2px 0 #000",
                        }}
                      >
                        -{f.value}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Win / lose banner */}
              {(phase === "win" || phase === "lose") && (
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-8 border-2 border-[var(--ink)] bg-black/70 px-6 py-4 text-center"
                  style={{
                    boxShadow:
                      phase === "win"
                        ? "6px 6px 0 0 var(--accent-green)"
                        : "6px 6px 0 0 var(--accent-red)",
                  }}
                >
                  <p
                    className="font-pixel text-sm uppercase tracking-widest sm:text-lg"
                    style={{
                      color:
                        phase === "win"
                          ? "var(--accent-green)"
                          : "var(--accent-red)",
                    }}
                  >
                    {phase === "win" ? "◤ SYSTEM RESTORED ◢" : "◤ KERNEL PANIC ◢"}
                  </p>
                  {artifact && (
                    <p className="mt-2 font-pixel text-[10px] uppercase tracking-widest text-white">
                      ✦ acquired: {artifact} ✦
                    </p>
                  )}
                  <button
                    onClick={close}
                    className="mt-4 border border-white/40 px-3 py-1 font-pixel text-[9px] uppercase tracking-widest text-white hover:bg-white/10"
                  >
                    [ close ]
                  </button>
                </motion.div>
              )}
            </div>

            {/* Bottom UI */}
            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.2fr_1fr]">
              {/* Player HP */}
              <div className="border-2 border-[var(--ink)] bg-black/60 p-3">
                <HpBar
                  label="ERZA"
                  pct={playerPct}
                  color="var(--accent-green)"
                  value={`${playerHp}/${PLAYER_MAX}`}
                />
                <p className="mt-2 font-pixel text-[8px] uppercase tracking-widest text-white/50">
                  {phase === "player"
                    ? "> YOUR TURN"
                    : phase === "enemy"
                      ? "> ENEMY ACTING…"
                      : phase === "win"
                        ? "> VICTORY"
                        : "> DEFEAT"}
                </p>
              </div>

              {/* Battle log */}
              <div className="h-32 overflow-y-auto border-2 border-[var(--ink)] bg-black/60 p-2 font-pixel text-[9px] leading-relaxed sm:h-36">
                {log.map((l) => (
                  <p
                    key={l.id}
                    style={{
                      color:
                        l.kind === "err"
                          ? "var(--accent-red)"
                          : l.kind === "in"
                            ? "#fff"
                            : "var(--accent-green)",
                    }}
                  >
                    {l.text}
                  </p>
                ))}
              </div>

              {/* Attacks */}
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(ATTACKS) as AttackId[]).map((id) => {
                  const a = ATTACKS[id];
                  return (
                    <button
                      key={id}
                      onClick={() => attack(id)}
                      disabled={phase !== "player"}
                      className="group border-2 border-[var(--ink)] bg-black/60 px-3 py-2 text-left transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                      style={{ boxShadow: `3px 3px 0 0 ${a.color}` }}
                    >
                      <p
                        className="font-pixel text-[10px] uppercase tracking-widest"
                        style={{ color: a.color }}
                      >
                        ▶ {a.label}
                      </p>
                      <p className="font-pixel text-[8px] uppercase tracking-widest text-white/45">
                        {a.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HpBar({
  label,
  pct,
  color,
  value,
}: {
  label: string;
  pct: number;
  color: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between font-pixel text-[9px] uppercase tracking-widest">
        <span style={{ color }}>{label}</span>
        <span className="text-white/60">{value}</span>
      </div>
      <div className="mt-1 h-3 border border-[var(--ink)] bg-black/60">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="h-full"
          style={{ background: color, boxShadow: `inset 0 0 6px ${color}` }}
        />
      </div>
    </div>
  );
}

export default VoidEncounter;
