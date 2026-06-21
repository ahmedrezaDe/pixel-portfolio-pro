import { motion } from "motion/react";
import type { Project } from "@/lib/data/projects";

export function ArcadeCabinet({
  project,
  onOpen,
  onHover,
  muted,
}: {
  project: Project;
  onOpen: () => void;
  onHover: () => void;
  muted: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={onHover}
      onClick={onOpen}
      className="group relative flex w-[200px] shrink-0 flex-col items-center sm:w-[240px]"
      aria-label={`Open ${project.title}`}
    >
      {/* Marquee */}
      <div
        className="w-full rounded-t-md border-2 border-[var(--ink)] px-3 py-2 text-center font-pixel text-[9px] uppercase tracking-widest text-white"
        style={{
          background:
            "repeating-linear-gradient(90deg,#7c3aed 0 8px,#5b21b6 8px 16px)",
          boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.4)",
        }}
      >
        {project.title}
      </div>

      {/* Cabinet body */}
      <div
        className="relative w-full border-x-2 border-[var(--ink)] bg-[var(--ink)] px-3 pb-3 pt-3"
        style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.04)" }}
      >
        {/* Monitor */}
        <div
          className="relative aspect-[4/5] w-full overflow-hidden border-2 border-[var(--ink)] pixelated"
          style={{ background: project.monitor }}
        >
          {/* Animated scanline ribbon */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-1/3"
            initial={{ y: "-50%" }}
            animate={{ y: "150%" }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
            }}
          />
          {/* Pixel grid */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
          {/* Mock terminal */}
          <div className="absolute inset-0 flex flex-col justify-end p-2 font-pixel text-[7px] leading-tight text-white/90">
            <TypingLines projectId={project.id} />
          </div>
          {/* CRT scanlines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom,rgba(0,0,0,0.18) 0 1px,transparent 1px 3px)",
            }}
          />
          {/* Glare */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 40% at 30% 20%, rgba(255,255,255,0.18), transparent 70%)",
            }}
          />
        </div>

        {/* Control panel */}
        <div className="mt-3 flex items-center justify-between rounded-sm border-2 border-[var(--ink)] bg-[#1a1a1a] px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[var(--accent-red)] border border-black" />
            <span className="h-3 w-3 rounded-full bg-[var(--accent-yellow)] border border-black" />
            <span className="h-3 w-3 rounded-full bg-[var(--accent-green)] border border-black" />
          </div>
          <span className="font-pixel text-[8px] uppercase tracking-widest text-white/80">
            Insert Coin
          </span>
        </div>
      </div>

      {/* Base */}
      <div
        className="h-3 w-full rounded-b-md border-2 border-t-0 border-[var(--ink)]"
        style={{ background: "#222" }}
      />

      {/* Tag */}
      <div className="mt-3 font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]">
        {project.tag}
      </div>
      {/* unused muted to satisfy ts when needed */}
      <span className="hidden">{muted ? "" : ""}</span>
    </motion.button>
  );
}

function TypingLines({ projectId }: { projectId: string }) {
  // Static mock loop — kept lightweight (CSS only).
  const lines = [
    "$ boot " + projectId,
    "loading modules ........ ok",
    "linking subsystems ..... ok",
    "ready ▮",
  ];
  return (
    <div className="flex flex-col gap-0.5">
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            animation: `cab-fade 6s ${i * 1.2}s infinite`,
            opacity: 0,
          }}
        >
          {l}
        </div>
      ))}
      <style>{`
        @keyframes cab-fade {
          0%,8% { opacity: 0; }
          12%,90% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
