import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Node = { id: string; label: string; x: number; y: number };
type Edge = { source: string; target: string };

type BlueprintProps = {
  projectId: string;
  color?: string; 
};

// Handcrafted layouts for each project match their actual stack architectural patterns
const BLUEPRINT_PRESETS: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  "tower-hunter": {
    nodes: [
      { id: "client", label: "HUD / REACT", x: 25, y: 30 },
      { id: "core", label: "RUST CORE", x: 50, y: 50 },
      { id: "db", label: "SQLITE", x: 75, y: 30 },
      { id: "engine", label: "QUEST ENGINE", x: 70, y: 75 },
      { id: "player", label: "PLAYER STATE", x: 25, y: 70 },
    ],
    edges: [
      { source: "client", target: "core" },
      { source: "core", target: "db" },
      { source: "core", target: "engine" },
      { source: "player", target: "client" },
      { source: "player", target: "core" },
    ],
  },
  "odyssey": {
    nodes: [
      { id: "n8n", label: "N8N WEBHOOKS", x: 20, y: 50 },
      { id: "api", label: "FASTAPI BACKEND", x: 60, y: 50 },
      { id: "llm", label: "GROQ LLM", x: 80, y: 30 },
      { id: "crawler", label: "PLAYWRIGHT DOM", x: 80, y: 70 },
    ],
    edges: [
      { source: "n8n", target: "api" },
      { source: "api", target: "llm" },
      { source: "api", target: "crawler" },
      { source: "crawler", target: "api" },
    ],
  },
  "orbit-commerce": {
    nodes: [
      { id: "gateway", label: "API GATEWAY", x: 20, y: 50 },
      { id: "core", label: "SPRING BOOT CORE", x: 50, y: 30 },
      { id: "cache", label: "REDIS LAYER", x: 50, y: 70 },
      { id: "db", label: "POSTGRESQL POOL", x: 80, y: 50 },
    ],
    edges: [
      { source: "gateway", target: "core" },
      { source: "core", target: "cache" },
      { source: "core", target: "db" },
      { source: "cache", target: "db" },
    ],
  },
  "unfinished": {
    nodes: [
      { id: "lab", label: "THE LAB", x: 20, y: 50 },
      { id: "p1", label: "PROTO 01", x: 50, y: 25 },
      { id: "p2", label: "PROTO 02", x: 50, y: 50 },
      { id: "p3", label: "PROTO ??", x: 50, y: 75 },
      { id: "ship", label: "SHIPPED", x: 80, y: 50 },
    ],
    edges: [
      { source: "lab", target: "p1" },
      { source: "lab", target: "p2" },
      { source: "lab", target: "p3" },
      { source: "p2", target: "ship" },
    ],
  },
};

export function AnimatedBlueprint({ projectId, color = "#4a9eff" }: BlueprintProps) {
  const [mounted, setMounted] = useState(false);

  // Fallback to tower-hunter preset if the ID doesn't exactly match
  const preset = BLUEPRINT_PRESETS[projectId] || BLUEPRINT_PRESETS["tower-hunter"];

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