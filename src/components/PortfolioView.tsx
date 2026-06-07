import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Project = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  stack: string[];
  bg: string;
};

const projects: Project[] = [
  {
    id: "tower-hunter",
    title: "Tower Hunter",
    tag: "RPG · Desktop",
    blurb:
      "A gamified life-OS built in Tauri + Rust. Holographic HUD, attribute bars, awakening protocol, and a local SQLite save-state. Turning daily habits into a tower climb.",
    stack: ["Rust", "Tauri", "React", "Zustand", "SQLite"],
    bg: "linear-gradient(135deg, #0a0f1f 0%, #0c2340 50%, #1a4a6e 100%)",
  },
  {
    id: "odyssey",
    title: "Odyssey",
    tag: "AI · Job Platform",
    blurb:
      "AI-orchestrated job pipeline with voice interview agent, ATS scoring, and webhook orchestration. FastAPI + ElevenLabs + OpenAI, with HMAC-signed external triggers.",
    stack: ["FastAPI", "React", "ElevenLabs", "OpenAI", "Postgres"],
    bg: "linear-gradient(135deg, #2a0a2e 0%, #5e1a6e 50%, #c44569 100%)",
  },
  {
    id: "lex-mode",
    title: "Lexicon Mode",
    tag: "Experiment · UI",
    blurb:
      "A dual-mode interface engine — switch any app between Operator (dense, terminal) and Resident (calm, ambient) without re-architecting state.",
    stack: ["React Context", "TanStack", "OKLCH"],
    bg: "linear-gradient(135deg, #1a3c2a 0%, #2d5a3d 50%, #73ffb8 100%)",
  },
  {
    id: "unfinished",
    title: "Unfinished.exe",
    tag: "Collection",
    blurb:
      "The parallel world itself — a growing archive of half-built engines, design jams, and 3 a.m. prototypes. New artifacts appear when the lab is unsupervised.",
    stack: ["Various", "TBD"],
    bg: "linear-gradient(135deg, #1a1a2e 0%, #4f46e5 100%)",
  },
];

export function PortfolioView() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);

  const move = (dir: 1 | -1) =>
    setActive((a) => (a + dir + projects.length) % projects.length);

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="grid min-h-[calc(100vh-6rem)] grid-cols-1 lg:grid-cols-2">
        {/* LEFT — wavy mega type */}
        <div className="relative flex items-center justify-center overflow-hidden px-6 py-12 lg:px-12">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--ink) 0 1px, transparent 1px 24px)",
            }}
          />
          <WavyTitle />
        </div>

        {/* RIGHT — coverflow stack */}
        <div className="relative flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="relative h-[480px] w-full max-w-md">
            {projects.map((p, i) => {
              const offset = i - active;
              const abs = Math.abs(offset);
              const isActive = offset === 0;
              return (
                <motion.button
                  key={p.id}
                  onClick={() => (isActive ? setOpen(p) : setActive(i))}
                  animate={{
                    y: offset * 38,
                    scale: 1 - abs * 0.06,
                    opacity: abs > 2 ? 0 : 1 - abs * 0.25,
                    zIndex: 10 - abs,
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  className="absolute left-0 right-0 mx-auto block h-56 w-full overflow-hidden rounded-2xl border-2 border-[var(--ink)] text-left pixel-box-lg"
                  style={{ background: p.bg }}
                >
                  <div className="flex h-full flex-col justify-between p-6 text-white">
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[9px] uppercase tracking-wider opacity-80">
                        {p.tag}
                      </span>
                      <span className="font-pixel text-[9px] opacity-70">
                        0{i + 1}/0{projects.length}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-3xl leading-none">
                        {p.title}
                      </h3>
                      {isActive && (
                        <p className="mt-3 line-clamp-2 text-sm opacity-90">
                          {p.blurb}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button
              onClick={() => move(-1)}
              className="h-10 w-10 rounded-full bg-white font-pixel text-xs pixel-box"
              aria-label="Previous"
            >
              ▲
            </button>
            <button
              onClick={() => move(1)}
              className="h-10 w-10 rounded-full bg-white font-pixel text-xs pixel-box"
              aria-label="Next"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white pixel-box-lg"
            >
              <div className="h-56 w-full" style={{ background: open.bg }} />
              <div className="p-8">
                <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]">
                  {open.tag}
                </div>
                <h2 className="mt-2 font-display text-4xl">{open.title}</h2>
                <p className="mt-4 text-[var(--ink)]">{open.blurb}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {open.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border-2 border-[var(--ink)] bg-[var(--muted)] px-3 py-1 font-pixel text-[9px] uppercase tracking-wider"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setOpen(null)}
                  className="mt-8 rounded-full bg-[var(--ink)] px-5 py-2 font-pixel text-[10px] uppercase tracking-wider text-white pixel-box"
                >
                  ✕ Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WavyTitle() {
  const letters = "ERZA".split("");
  return (
    <div className="relative">
      <div
        className="font-display select-none leading-[0.82] tracking-tight"
        style={{
          fontSize: "clamp(7rem, 18vw, 18rem)",
          color: "var(--accent-blue)",
          textShadow:
            "6px 6px 0 var(--ink), -1px -1px 0 rgba(0,0,0,0.05)",
        }}
      >
        {letters.map((l, i) => (
          <motion.span
            key={i}
            className="inline-block"
            animate={{
              y: [0, -14, 0, 8, 0],
              rotate: [0, -3, 0, 2, 0],
              skewY: [0, -4, 0, 3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="mt-4 font-pixel text-[10px] uppercase tracking-widest text-[var(--ink)]">
        ◢ Selected works · 2021—2026 ◣
      </div>
    </div>
  );
}
