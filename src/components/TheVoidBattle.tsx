import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type AttackKey = "debug" | "refactor" | "caffeine" | "gitPush";

type Props = {
  open: boolean;
  onClose?: () => void;
  erzaHp?: number;
  erzaMaxHp?: number;
  enemyHp?: number;
  enemyMaxHp?: number;
  onDebug?: () => void;
  onRefactor?: () => void;
  onCaffeine?: () => void;
  onGitPush?: () => void;
};

const FRAGMENTS = [
  "// TODO: fix this",
  "{ undefined }",
  "NaN",
  "catch (e) {}",
  "// FIXME",
  "</div>",
  "null.map()",
  "any;",
  "merge conflict",
  "// HACK",
  "[object Object]",
  "Promise<never>",
];

// 16x12 pixel monster grid. Characters: ' '=empty, 'g'=matrix green,
// 'm'=magenta, 'w'=white glitch, 'k'=dark.
const AMALGAM = [
  "  ggg      mmm  ",
  " gg gg    mm mm ",
  "gg   gg  mm   mm",
  "g  k  ggmm  k  m",
  "g kwk  gm  kwk m",
  "gg   gmmgg   mmg",
  " ggmmm    mmmgg ",
  "  gmkkkkkkkkmg  ",
  " mgk w  w wkgm  ",
  " mg kkkkkkkk gm ",
  "  mgg      ggm  ",
  "   m gg  gg m   ",
];

function HpBar({ label, hp, max, color }: { label: string; hp: number; max: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (hp / max) * 100));
  return (
    <div className="flex flex-col gap-1 min-w-[180px]">
      <div className="flex items-baseline justify-between font-pixel text-[10px] tracking-wider">
        <span className="text-white">{label}</span>
        <span className="text-white/80">
          {Math.max(0, hp)}/{max}
        </span>
      </div>
      <div
        className="relative h-3 w-full border-2 border-white bg-black"
        style={{ boxShadow: "inset 0 0 0 2px #000, 0 0 0 2px #000" }}
      >
        <motion.div
          className="h-full"
          style={{ background: color, imageRendering: "pixelated" }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 4px)",
          }}
        />
      </div>
    </div>
  );
}

function AttackButton({
  label,
  sub,
  onClick,
  accent,
}: {
  label: string;
  sub?: string;
  onClick?: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center justify-between gap-3 border-2 border-white bg-black/80 px-3 py-2 text-left font-pixel text-[10px] uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5 hover:translate-x-0.5 active:translate-y-0 active:translate-x-0"
      style={{ boxShadow: "4px 4px 0 0 #000, 4px 4px 0 2px " + accent }}
    >
      <span
        className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-30"
        style={{ background: accent }}
      />
      <span className="flex items-center gap-2">
        <span style={{ color: accent }}>▶</span>
        <span>{label}</span>
      </span>
      {sub && <span className="text-white/40">{sub}</span>}
    </button>
  );
}

function PixelMonster({ shake }: { shake: number }) {
  return (
    <motion.div
      animate={{
        x: shake ? [0, -6, 6, -4, 4, 0] : 0,
        filter: [
          "hue-rotate(0deg)",
          "hue-rotate(40deg)",
          "hue-rotate(-30deg)",
          "hue-rotate(0deg)",
        ],
      }}
      transition={{
        x: { duration: 0.4 },
        filter: { duration: 2.4, repeat: Infinity, ease: "linear" },
      }}
      className="relative"
      style={{ imageRendering: "pixelated" }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${AMALGAM[0].length}, 14px)`,
          gridTemplateRows: `repeat(${AMALGAM.length}, 14px)`,
        }}
      >
        {AMALGAM.flatMap((row, y) =>
          row.split("").map((c, x) => {
            const map: Record<string, string> = {
              g: "#39ff5f",
              m: "#ff2bd6",
              w: "#ffffff",
              k: "#0a0a0a",
            };
            const bg = map[c] ?? "transparent";
            return (
              <div
                key={`${x}-${y}`}
                style={{
                  width: 14,
                  height: 14,
                  background: bg,
                  boxShadow:
                    bg === "transparent"
                      ? undefined
                      : `0 0 6px ${bg === "#0a0a0a" ? "transparent" : bg}`,
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
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,43,214,0.18) 0 2px, transparent 2px 6px)",
          mixBlendMode: "screen",
        }}
      />
    </motion.div>
  );
}

function ParallaxVoid() {
  // Pre-seed deterministic-ish positions so SSR is stable enough.
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
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(57,255,95,0.18), transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(255,43,214,0.22), transparent 55%), #05060a",
        }}
      />
      {/* grid */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ backgroundPositionY: ["0px", "40px"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(#39ff5f22 1px, transparent 1px), linear-gradient(90deg, #ff2bd622 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* parallax fragments */}
      {layers.map((layer, li) => (
        <div key={li} className="absolute inset-0">
          {layer.map((f, i) => (
            <motion.div
              key={`${li}-${i}`}
              className="absolute font-pixel whitespace-nowrap"
              style={{
                top: `${f.top}%`,
                left: `${f.left}%`,
                fontSize: f.size,
                color: f.color,
                opacity: f.opacity,
                textShadow: `0 0 6px ${f.color}`,
              }}
              animate={{ y: [-20, 20, -20], x: [0, li % 2 ? 10 : -10, 0] }}
              transition={{
                duration: f.speed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 5) * 0.4,
              }}
            >
              {f.text}
            </motion.div>
          ))}
        </div>
      ))}
      {/* scanlines */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.45) 0 2px, transparent 2px 4px)",
        }}
      />
    </div>
  );
}

export default function TheVoidBattle({
  open,
  onClose,
  erzaHp = 78,
  erzaMaxHp = 100,
  enemyHp = 240,
  enemyMaxHp = 300,
  onDebug,
  onRefactor,
  onCaffeine,
  onGitPush,
}: Props) {
  const [shakeKey, setShakeKey] = useState(0);
  const [log, setLog] = useState<string>(
    "A wild THE TODO_AMALGAM coalesces from unfinished commits..."
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const fire = (key: AttackKey, msg: string, cb?: () => void) => {
    setLog(msg);
    setShakeKey((k) => k + 1);
    cb?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="void-battle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] overflow-hidden font-pixel text-white"
          role="dialog"
          aria-label="The Void Battle"
        >
          <ParallaxVoid />

          {/* CRASH banner */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute left-1/2 top-4 -translate-x-1/2 border-2 border-white bg-black px-4 py-2 text-[10px] tracking-[0.3em]"
            style={{ boxShadow: "4px 4px 0 #ff2bd6" }}
          >
            <span className="text-[#ff2bd6]">!! SYSTEM CRASH !!</span>{" "}
            <span className="text-[#39ff5f]">VOID ENCOUNTER</span>
          </motion.div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 border-2 border-white bg-black px-2 py-1 text-[10px] hover:bg-white hover:text-black"
            style={{ boxShadow: "3px 3px 0 #39ff5f" }}
            aria-label="Close battle"
          >
            ESC ✕
          </button>

          {/* Battlefield */}
          <div className="relative flex h-[calc(100%-260px)] w-full items-center justify-center">
            {/* Enemy HP top */}
            <div className="absolute left-1/2 top-16 -translate-x-1/2">
              <div className="border-2 border-white bg-black/80 p-3" style={{ boxShadow: "4px 4px 0 #ff2bd6" }}>
                <HpBar
                  label="THE TODO_AMALGAM"
                  hp={enemyHp}
                  max={enemyMaxHp}
                  color="#ff2bd6"
                />
              </div>
            </div>

            <motion.div
              key={shakeKey}
              className="mt-10"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <PixelMonster shake={shakeKey} />
              <div
                className="mx-auto mt-2 h-2 w-40 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse, rgba(255,43,214,0.6), transparent 70%)",
                }}
              />
            </motion.div>
          </div>

          {/* Bottom JRPG UI */}
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_1fr_1fr]">
            {/* Hero HP */}
            <div
              className="border-4 border-white bg-black p-3"
              style={{ boxShadow: "6px 6px 0 #39ff5f" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 border-2 border-white"
                  style={{
                    background:
                      "linear-gradient(135deg,#39ff5f 0 50%, #0a0a0a 50% 100%)",
                    imageRendering: "pixelated",
                  }}
                />
                <HpBar label="ERZA" hp={erzaHp} max={erzaMaxHp} color="#39ff5f" />
              </div>
            </div>

            {/* Log */}
            <div
              className="border-4 border-white bg-black p-3 text-[10px] leading-relaxed text-[#9affb5]"
              style={{ boxShadow: "6px 6px 0 #ff2bd6" }}
            >
              <div className="mb-1 text-white">&gt; BATTLE LOG</div>
              <motion.div
                key={log}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {log}
              </motion.div>
            </div>

            {/* Attack menu */}
            <div
              className="grid grid-cols-2 gap-2 border-4 border-white bg-black p-3"
              style={{ boxShadow: "6px 6px 0 #39ff5f" }}
            >
              <AttackButton
                label="Debug.js"
                sub="20"
                accent="#39ff5f"
                onClick={() =>
                  fire(
                    "debug",
                    "ERZA runs Debug.js — breakpoints pierce THE TODO_AMALGAM!",
                    onDebug
                  )
                }
              />
              <AttackButton
                label="Refactor()"
                sub="35"
                accent="#ff2bd6"
                onClick={() =>
                  fire(
                    "refactor",
                    "ERZA Refactor()s — the amalgam loses 200 lines of spaghetti.",
                    onRefactor
                  )
                }
              />
              <AttackButton
                label="Drink Caffeine"
                sub="+HP"
                accent="#ffcf3a"
                onClick={() =>
                  fire(
                    "caffeine",
                    "ERZA chugs caffeine. INT +5, sleep -8h.",
                    onCaffeine
                  )
                }
              />
              <AttackButton
                label="Git Push --Force"
                sub="???"
                accent="#ff4d4d"
                onClick={() =>
                  fire(
                    "gitPush",
                    "ERZA used GIT PUSH --FORCE. It's super effective. Probably.",
                    onGitPush
                  )
                }
              />
            </div>
          </div>

          {/* vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: "inset 0 0 200px 40px rgba(0,0,0,0.9)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
