import { motion } from "motion/react";

export function AboutView() {
  return (
    <div className="min-h-screen bg-white px-6 pb-24 pt-32 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4 font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]">
            ◤ Player Bio
          </div>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-7xl">
            Hi, my name is{" "}
            <span className="text-[var(--accent-purple)]">Ahmed Reza</span>.
          </h1>
          <p className="mt-6 font-pixel text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
            But you can call me Erza.
          </p>

          <div className="mt-12 grid gap-8 text-lg leading-relaxed text-[var(--ink)] sm:text-xl">
            <p>
              I make cool sh*t in the parallel world of <em>unfinished ideas</em> —
              prototypes, half-built engines, and weekend experiments that escape
              the lab when nobody is watching.
            </p>
            <p>
              I'm a creative technologist. I build things at the intersection of
              software, design, and play — gamified RPG dashboards, AI-driven job
              platforms, voice-controlled tools, and the occasional retro UI.
            </p>
            <p>
              When I'm not shipping, I'm thinking about how interfaces could feel
              more like <span className="font-pixel text-sm">video&nbsp;games</span> and
              less like spreadsheets.
            </p>
          </div>

          {/* Stats card */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: "STR", v: 78 },
              { k: "AGI", v: 91 },
              { k: "INT", v: 88 },
              { k: "VIT", v: 73 },
            ].map((s) => (
              <div key={s.k} className="pixel-box bg-white p-4">
                <div className="font-pixel text-[10px] uppercase text-[var(--muted-foreground)]">
                  {s.k}
                </div>
                <div className="mt-1 font-display text-3xl">{s.v}</div>
                <div className="mt-2 flex h-2 gap-[2px]">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{
                        background:
                          i < Math.round(s.v / 10)
                            ? "var(--accent-green)"
                            : "var(--muted)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
