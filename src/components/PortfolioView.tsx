import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArcadeCabinet } from "./ArcadeCabinet";
import { Blueprint } from "./Blueprint";
import { useGame } from "@/lib/game-state";
import { portfolioConfig, type Project } from "@/lib/portfolioConfig";

export function PortfolioView() {
  const [open, setOpen] = useState<Project | null>(null);
  const { addXp, sfx, muted } = useGame();
  const { arcade, projects } = portfolioConfig;

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-8 text-center">
          <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]">
            {arcade.eyebrow}
          </div>
          <h1
            className="mt-3 font-display tracking-tight"
            style={{
              fontSize: "clamp(3rem,9vw,7rem)",
              color: "var(--accent-blue)",
              textShadow: "5px 5px 0 var(--ink)",
              lineHeight: 0.9,
            }}
          >
            {arcade.title}
          </h1>
          <p className="mt-3 font-pixel text-[9px] uppercase tracking-widest text-[var(--muted-foreground)]">
            {arcade.subtitle}
          </p>
        </div>

        {/* Cabinet row — horizontal scroll snap (mobile-first) */}
        <div className="relative">
          <div
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 sm:mx-0 sm:gap-6 sm:px-2"
            style={{
              scrollPaddingLeft: "1rem",
              scrollPaddingRight: "1rem",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
            }}
          >
            {projects.map((p) => (
              <div
                key={p.id}
                className="shrink-0 snap-center"
                style={{ scrollSnapStop: "always" }}
              >
                <ArcadeCabinet
                  project={p}
                  muted={muted}
                  onHover={() => sfx.hover(muted)}
                  onOpen={() => {
                    sfx.open(muted);
                    addXp(20, "open-project");
                    setOpen(p);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 text-center font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]">
            {arcade.scrollHint}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && <ProjectOverlay project={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ProjectOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 backdrop-blur-md"
      style={{ background: "rgba(0,0,0,0.55)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-4xl overflow-hidden rounded-md border-2 border-[var(--ink)] bg-white pixel-box-lg"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b-2 border-[var(--ink)] px-4 py-3"
          style={{ background: project.bg }}
        >
          <div className="font-pixel text-[10px] uppercase tracking-widest text-white">
            ▶ POWER UP — {project.title}
          </div>
          <button
            onClick={onClose}
            className="rounded-sm border-2 border-[var(--ink)] bg-white px-3 py-1 font-pixel text-[9px] uppercase tracking-wider"
          >
            ✕ Close
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div>
            <div className="font-pixel text-[9px] uppercase tracking-widest text-[var(--accent-purple)]">
              {project.tag}
            </div>
            <h2 className="mt-2 font-display text-4xl leading-none">
              {project.title}
            </h2>
            <p className="mt-4 text-[var(--ink)]">{project.blurb}</p>

            {/* Tech matrix */}
            <div className="mt-6">
              <div className="font-pixel text-[9px] uppercase tracking-widest text-[var(--muted-foreground)]">
                ◤ Tech Matrix
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {project.stack.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between border-2 border-[var(--ink)] bg-[var(--muted)] px-3 py-2"
                  >
                    <span className="font-pixel text-[10px] uppercase">
                      {t.name}
                    </span>
                    <span className="font-pixel text-[8px] uppercase tracking-wider text-[var(--muted-foreground)]">
                      {t.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="font-pixel text-[9px] uppercase tracking-widest text-[var(--muted-foreground)]">
              ◤ Architecture Blueprint
            </div>
            <div className="mt-3">
              <Blueprint project={project} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
