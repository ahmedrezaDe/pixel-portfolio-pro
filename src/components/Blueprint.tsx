import type { Project } from "@/lib/data/projects";

export function Blueprint({ project }: { project: Project }) {
  const { nodes, edges } = project.blueprint;
  const find = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden border-2 border-[var(--ink)] bg-[#0b1020]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {edges.map((e, i) => {
          const a = find(e.from);
          const b = find(e.to);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#7dd3fc"
              strokeWidth="0.4"
              strokeDasharray="1.2 0.8"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-8"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </line>
          );
        })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border-2 border-white/80 bg-[#1e293b] px-2 py-1 font-pixel text-[9px] uppercase tracking-wider text-white"
          style={{ left: `${n.x}%`, top: `${n.y}%`, boxShadow: "3px 3px 0 0 #000" }}
        >
          {n.label}
        </div>
      ))}
    </div>
  );
}
