import { motion } from "motion/react";
import { portfolioConfig } from "@/lib/portfolioConfig";

export function AboutView() {
  const { about } = portfolioConfig;

  return (
    <div className="min-h-screen bg-white px-6 pb-24 pt-32 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4 font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]">
            {about.pretitle}
          </div>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-[var(--ink)] sm:text-7xl">
            {about.headlineLead}{" "}
            <span className="text-[var(--accent-purple)]">
              {about.headlineHighlight}
            </span>
            .
          </h1>
          <p className="mt-6 font-pixel text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
            {about.aliasLine}
          </p>

          <div className="mt-12 grid gap-8 text-lg leading-relaxed text-[var(--ink)] sm:text-xl">
            {about.bio.map((para, i) => (
              <p key={i}>{renderEmphasis(para)}</p>
            ))}
          </div>

          {/* Stats card */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {about.stats.map((s) => (
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

// Tiny markdown-ish helper: *text* → <em>
function renderEmphasis(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((p, i) =>
    p.startsWith("*") && p.endsWith("*") ? (
      <em key={i}>{p.slice(1, -1)}</em>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
