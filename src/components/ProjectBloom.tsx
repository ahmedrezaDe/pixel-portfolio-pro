import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { Project } from "@/lib/portfolioConfig";
import { AnimatedBlueprint } from "./AnimatedBlueprint";

export const BLOOM_SPRING = {
  type: "spring" as const,
  damping: 30,
  stiffness: 200,
};

type ProjectBloomProps = {
  project: Project;
  origin: { x: number; y: number };
  onClose: () => void;
};

// --- NEW: The Kernel Boot Glitch Effect ---
const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*/<>[]{}";

function BootLogText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let iteration = 0;
    let animationFrame: number;
    // Slight delay so the clipPath portal has time to open before the text starts compiling
    const startDelay = setTimeout(() => {
      const animate = () => {
        setDisplayText(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              if (letter === " ") return " ";
              return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            })
            .join("")
        );
        
        // Speed of decryption (reveals faster for longer blurbs)
        iteration += text.length / 40; 
        
        if (iteration < text.length) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setDisplayText(text); // Lock final text
        }
      };
      animationFrame = requestAnimationFrame(animate);
    }, 400); 

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(animationFrame);
    };
  }, [text]);

  return <span>{displayText || "INITIALIZING_MEMORY_BLOCK..."}</span>;
}

// --- MAIN COMPONENT ---
export function ProjectBloom({ project, origin, onClose }: ProjectBloomProps) { // FIX: origin added here
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Background Blur Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "rgba(2, 2, 12, 0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={BLOOM_SPRING}
        onClick={onClose}
        aria-hidden
      />

      {/* The Portal Rift */}
      <motion.div
        className="absolute inset-0 overflow-y-auto"
        style={{
          background: project.monitor,
          willChange: "clip-path, opacity",
        }}
        // The mathematical circle rip
        initial={{ 
          clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
          opacity: 0.8 
        }}
        animate={{ 
          clipPath: `circle(150vw at ${origin.x}px ${origin.y}px)`,
          opacity: 1 
        }}
        exit={{ 
          clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
          opacity: 0 
        }}
        transition={{ 
          duration: 0.85, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        role="dialog"
        aria-modal
        aria-label={project.title}
      >
        <motion.div
          className="relative min-h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          {/* CRT Monitor Glare */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.18) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto flex min-h-full max-w-4xl flex-col px-5 pb-12 pt-24 sm:px-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] uppercase tracking-widest text-white/70">
                  {project.tag}
                </p>
                <h2 className="mt-2 font-display text-4xl leading-none text-white sm:text-5xl">
                  {project.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-sm border-2 border-white/30 bg-black/20 px-3 py-1.5 font-pixel text-[9px] uppercase tracking-wider text-white transition-colors hover:bg-black/40"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid flex-1 gap-8 lg:grid-cols-2">
              <div>
                {/* The Glitch Text in action */}
                <p className="text-base leading-relaxed text-white/90 min-h-[4rem]">
                  <BootLogText text={project.blurb} />
                </p>

                <div className="mt-8">
                  <p className="font-pixel text-[9px] uppercase tracking-widest text-white/55">
                    ◤ Tech Matrix
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {project.stack.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-center justify-between border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm"
                      >
                        <span className="font-pixel text-[10px] uppercase text-white">
                          {tech.name}
                        </span>
                        <span className="font-pixel text-[8px] uppercase tracking-wider text-white/50">
                          {tech.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col h-72 lg:mt-0 lg:h-auto lg:min-h-[350px]">
                <div className="mb-4 flex items-center gap-2 font-pixel text-[9px] uppercase tracking-widest text-white/55">
                  ◤ ARCHITECTURE BLUEPRINT
                </div>
                
                <div className="flex-1 w-full relative">
                  <AnimatedBlueprint projectId={project.id} color={project.artifact.glowColor} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}