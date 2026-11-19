import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { portfolioConfig } from "@/lib/portfolioConfig";

type Node = { id: string; label: string; x: number; y: number };
type Edge = { source: string; target: string };

type BlueprintProps = {
  projectId: string;
  color?: string; 
};

// Blueprints come from portfolioConfig, so each diagram matches the project's real stack
const BLUEPRINT_PRESETS: Record<string, { nodes: Node[]; edges: Edge[] }> = Object.fromEntries(
  portfolioConfig.projects.map((p) => [
    p.id,
    {
      nodes: p.blueprint.nodes.map((n) => ({ ...n, label: n.label.toUpperCase() })),
      edges: p.blueprint.edges.map((e) => ({ source: e.from, target: e.to })),
    },
  ]),
);

export function AnimatedBlueprint({ projectId, color = "#4a9eff" }: BlueprintProps) {
  const [mounted, setMounted] = useState(false);

  // Fall back to the first project if the ID doesn't match
  const preset = BLUEPRINT_PRESETS[projectId] || Object.values(BLUEPRINT_PRESETS)[0];

  useEffect(() => {
    // Small delay ensures the animation kicks off cleanly after the bloom finishes morphing
    const t = setTimeout(() => setMounted(true), 350);
    return () => clearTimeout(t);
  }, [projectId]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border border-white/10 bg-[#04040c] font-pixel">
      {/* Schematic Grid Background */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${color}33 1px, transparent 1px),
            linear-gradient(to bottom, ${color}33 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      <svg className="absolute inset-0 h-full w-full">
        {mounted && preset.edges.map((edge, i) => {
          const source = preset.nodes.find((n) => n.id === edge.source);
          const target = preset.nodes.find((n) => n.id === edge.target);
          
          if (!source || !target) return null;
          
          return (
            <motion.line
              key={`${edge.source}-${edge.target}-${projectId}`}
              x1={`${source.x}%`}
              y1={`${source.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: "easeInOut" }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {mounted && preset.nodes.map((node, i) => (
        <motion.div
          key={`${node.id}-${projectId}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 border bg-[#04040c] px-2.5 py-1 text-[8px] tracking-widest text-white/90"
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`,
            borderColor: `${color}88`,
            boxShadow: `3px 3px 0px 0px ${color}22` 
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 150 }}
        >
          {node.label}
        </motion.div>
      ))}
    </div>
  );
}