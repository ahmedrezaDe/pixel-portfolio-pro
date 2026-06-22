import { useCallback, useMemo, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { BLOOM_SPRING } from "./ProjectBloom";
import { portfolioConfig, type Project } from "@/lib/portfolioConfig";
import { useOrganicDrift } from "@/hooks/useOrganicDrift";
import { UniverseEngine } from "./UniverseEngine";

type ConstellationProps = {
  projects: Project[]; // <-- Pass the active projects down
  selectedProject: Project | null;
  onSelect: (project: Project) => void;
};

type ArtifactProps = {
  project: Project;
  index: number;
  total: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isBloomed: boolean;
  onSelect: (project: Project, e?: React.MouseEvent | React.KeyboardEvent) => void;
};

function artifactGlow(glowColor: Project["artifact"]["glowColor"], mass: number): string {
  const inner = mass * 4;
  const mid = mass * 8;
  const outer = mass * 14;
  return [
    `0 0 ${inner}px ${glowColor}`,
    `0 0 ${mid}px ${glowColor}aa`,
    `0 0 ${outer}px ${glowColor}55`,
  ].join(", ");
}

function artifactSize(mass: number): number {
  return 28 + mass * 7;
}

function orbitPosition(index: number, total: number, orbitRadius: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: Math.cos(angle) * orbitRadius,
    y: Math.sin(angle) * orbitRadius,
  };
}

const DRIFT_LOOPS: { x: number[]; y: number[] }[] = [
  { x: [0, 10, -6, 8, 0], y: [0, -14, 8, -10, 0] },
  { x: [0, -8, 12, -4, 0], y: [0, 10, -12, 6, 0] },
  { x: [0, 6, -10, 5, 0], y: [0, -8, 14, -6, 0] },
  { x: [0, -12, 7, -9, 0], y: [0, 12, -8, 10, 0] },
];

function Artifact({
  project,
  index,
  total,
  mouseX,
  mouseY,
  isBloomed,
  onSelect,
}: ArtifactProps) {
  const offset = useOrganicDrift(); 
  
  const { mass, glowColor, orbitRadius } = project.artifact;
  const size = artifactSize(mass);
  const depth = mass / 10;
  
  const orbit = useMemo(
    () => orbitPosition(index, total, orbitRadius),
    [index, total, orbitRadius],
  );
  const drift = DRIFT_LOOPS[index % DRIFT_LOOPS.length];

  const x = useTransform(mouseX, (mx) => orbit.x + (mx - 0.5) * 104 * depth);
  const y = useTransform(mouseY, (my) => orbit.y + (my - 0.5) * 76 * depth);

  return (
    <motion.div
      className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ x, y, willChange: "transform" }}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: isBloomed ? 0 : 1, scale: isBloomed ? 0.85 : 1 }}
      transition={
        isBloomed
          ? BLOOM_SPRING
          : { delay: 0.12 + index * 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <motion.div
        animate={
          isBloomed 
            ? { x: 0, y: 0 } 
            : { 
                x: drift.x.map(val => val + offset.x), 
                y: drift.y.map(val => val + offset.y) 
              }
        }
        transition={
          isBloomed
            ? BLOOM_SPRING
            : { duration: 9 + index * 1.25, repeat: Infinity, ease: "easeInOut" }
        }
        className="flex flex-col items-center gap-3"
      >
        {!isBloomed && (
          <motion.div
            layoutId={project.id}
            onClick={(event) => onSelect(project, event)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(project, event);
              }
            }}
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-full border border-white/20 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle at 35% 30%, ${glowColor}, ${glowColor}44 55%, #050510 100%)`,
              boxShadow: artifactGlow(glowColor, mass),
            }}
            transition={BLOOM_SPRING}
            aria-label={`Open ${project.title}`}
          />
        )}
        {!isBloomed && (
          <div className="max-w-36 text-center">
            <p className="font-pixel text-[8px] uppercase tracking-widest text-white/90">
              {project.title}
            </p>
            <p className="mt-1 font-pixel text-[7px] uppercase tracking-wider text-white/45">
              {project.tag}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function Constellation({ projects, selectedProject, onSelect }: ConstellationProps) {
  
  const [burstEvent, setBurstEvent] = useState<any>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothMouseX = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 45, damping: 22 });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      mouseX.set((event.clientX - rect.left) / rect.width);
      mouseY.set((event.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  // Intercept the selection to fire the particle burst before morphing
  const handleArtifactSelect = useCallback((project: Project, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'clientX' in e) {
      setBurstEvent({
        x: e.clientX,
        y: e.clientY,
        color: project.artifact.glowColor,
        mass: project.artifact.mass,
        timestamp: Date.now(),
      });
    } else {
      // Fallback for keyboard navigation
      setBurstEvent({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        color: project.artifact.glowColor,
        mass: project.artifact.mass,
        timestamp: Date.now(),
      });
    }
    onSelect(project);
  }, [onSelect]);

  return (
    <motion.section
      className="relative h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 45%, #12122a 0%, #06060f 55%, #020208 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Project constellation"
    >
      {/* The Living Universe Background & Particle Engine */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <UniverseEngine burst={burstEvent} />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="rounded-full border border-white/5"
          style={{ width: 280, height: 280 }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: selectedProject ? 0 : 0.35, scale: 1 }}
          transition={BLOOM_SPRING}
        />
      </div>

      <div className="absolute inset-0 z-20">
        {projects.map((project, index) => (
          <Artifact
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            mouseX={smoothMouseX}
            mouseY={smoothMouseY}
            isBloomed={selectedProject?.id === project.id}
            onSelect={handleArtifactSelect}
          />
        ))}
      </div>
    </motion.section>
  );
}