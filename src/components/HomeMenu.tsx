import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { PixelFolder } from "./PixelFolder";
import { PixelAvatar } from "./PixelAvatar";
import type { View } from "@/lib/views";

export function HomeMenu({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [hovered, setHovered] = useState<0 | 1 | 2 | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const measure = () => {
      const els = containerRef.current?.querySelectorAll("[data-folder]");
      if (!els) return;
      const containerRect = containerRef.current!.getBoundingClientRect();
      const xs = Array.from(els).map((el) => {
        const r = (el as HTMLElement).getBoundingClientRect();
        return r.left + r.width / 2 - containerRect.left;
      });
      setPositions(xs);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const folders: { color: "blue" | "red" | "yellow"; label: string; view: View }[] = [
    { color: "blue", label: "About Me", view: "about" },
    { color: "red", label: "Portfolio", view: "portfolio" },
    { color: "yellow", label: "Contact Me", view: "contact" },
  ];

  const avatarX =
    hovered === null
      ? (positions[1] ?? 0)
      : (positions[hovered] ?? 0);
  const facing: "left" | "right" =
    hovered !== null && positions[hovered] < (positions[1] ?? 0) ? "left" : "right";

  return (
    <div className="scanlines relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 pt-28">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-pixel text-2xl uppercase leading-tight tracking-wider text-[var(--ink)] sm:text-4xl">
          Ahmed&nbsp;Reza
          <span className="block text-sm text-[var(--accent-purple)] sm:text-lg mt-3">
            ◤ a.k.a. ERZA ◢
          </span>
        </h1>
        <p className="mt-5 font-pixel text-[9px] uppercase tracking-widest text-[var(--muted-foreground)] sm:text-[10px]">
          Start by walking over desired game mode
          <span className="mx-2 text-[var(--ink)]">or</span>
          click
        </p>
      </div>

      {/* Folders */}
      <div
        ref={containerRef}
        className="relative flex w-full max-w-4xl items-end justify-around gap-6 px-4"
      >
        {folders.map((f, i) => (
          <div key={f.label} data-folder className="animate-float-folder" style={{ animationDelay: `${i * 0.2}s` }}>
            <PixelFolder
              color={f.color}
              label={f.label}
              hovered={hovered === i}
              onHover={() => setHovered(i as 0 | 1 | 2)}
              onLeave={() => setHovered(null)}
              onClick={() => onNavigate(f.view)}
            />
          </div>
        ))}

        {/* Avatar that walks under hovered folder */}
        <motion.div
          className="pointer-events-none absolute -bottom-16 left-0"
          animate={{ x: avatarX - 24 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <PixelAvatar size={48} walking={hovered !== null} facing={facing} />
        </motion.div>
      </div>

      {/* Ground line */}
      <div className="mt-24 h-[2px] w-full max-w-5xl bg-[var(--ink)]" />
      <div className="mt-4 font-pixel text-[8px] uppercase tracking-widest text-[var(--muted-foreground)]">
        ▼ World 01 — Parallel Realm of Unfinished Ideas ▼
      </div>
    </div>
  );
}
