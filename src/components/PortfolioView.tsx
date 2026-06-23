import { useCallback, useState, useMemo } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Constellation } from "./Constellation";
import { ProjectBloom } from "./ProjectBloom";
import { UniverseEngine } from "./UniverseEngine";
import { GalaxyOrb, type GalaxyKind } from "./GalaxyOrb";
import { useGame } from "@/lib/game-state";
import { portfolioConfig, type Project } from "@/lib/portfolioConfig";

const SECTOR_KIND: Record<string, GalaxyKind> = {
  genesis: "spiral",
  elysium: "nebula",
  tartarus: "cluster",
};

const VIEW_ENTRY = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const };

export function PortfolioView() {
  const { sfx, muted } = useGame();
  const { arcade, projects, sectors } = portfolioConfig;

  // State Machine
  const [viewMode, setViewMode] = useState<'galaxy' | 'multiverse'>('galaxy');
  const [activeSectorId, setActiveSectorId] = useState<string>("genesis");
  const [warpState, setWarpState] = useState<'none' | 'in' | 'out'>('none');
  
  const [selection, setSelection] = useState<{ project: Project; origin: { x: number; y: number } } | null>(null);
  const [burstEvent, setBurstEvent] = useState<any>(null);

  // Filter projects by current active sector
  const activeProjects = useMemo(() => projects.filter(p => p.sectorId === activeSectorId), [activeSectorId, projects]);
  const activeSector = sectors.find(s => s.id === activeSectorId) || sectors[0];

  // --- TRANSITIONS ---
  const ascendToMultiverse = () => {
    sfx.open(muted);
    setWarpState('out'); // Trigger pull-back stars
    setTimeout(() => {
      setViewMode('multiverse');
      setTimeout(() => setWarpState('none'), 400); // Settle stars
    }, 600);
  };

  const diveIntoSector = (sectorId: string) => {
    sfx.levelUp(muted);
    setWarpState('in'); // Trigger forward warp
    setActiveSectorId(sectorId);
    setTimeout(() => {
      setViewMode('galaxy');
      setTimeout(() => setWarpState('none'), 400); // Settle stars
    }, 600);
  };

  // --- PROJECT SELECTION ---
  const handleSelect = useCallback((project: Project, e?: React.MouseEvent | React.KeyboardEvent) => {
      let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; 
      if (e && 'clientX' in e) origin = { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
      
      setBurstEvent({ x: origin.x, y: origin.y, color: project.artifact.glowColor, mass: project.artifact.mass, timestamp: Date.now() });
      sfx.open(muted);
      setSelection({ project, origin });
    }, [muted, sfx]
  );

  return (
    <LayoutGroup>
      {/* Background Engine controlled by warp state */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <UniverseEngine burst={burstEvent} warpDirection={warpState} />
      </div>

      <motion.div
        className="relative min-h-screen overflow-hidden z-10"
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={VIEW_ENTRY}
      >
        {/* Dynamic Titles */}
        <div className="pointer-events-none absolute inset-x-0 top-24 z-20 px-4 text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: selection ? 0 : 1, y: selection ? -8 : 0 }} transition={VIEW_ENTRY}>
            <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--accent-purple)]">
              {/* REMOVED the // slashes */}
              {viewMode === 'galaxy' ? `SECTOR: ${activeSector.title} ✦ EPOCH ${activeSector.year}` : "MULTIVERSE MAP ✦ THE MACROCOSM"}
            </div>
            <h1 className="mt-3 font-display tracking-tight text-white" style={{ fontSize: "clamp(2rem,7vw,5rem)", textShadow: "4px 4px 0 rgba(0,0,0,0.85)", lineHeight: 0.9 }}>
               {viewMode === 'galaxy' ? arcade.title : "THE ARCHIVE"}
            </h1>
            <p className="mt-3 font-pixel text-[9px] uppercase tracking-widest text-white/45">
              {viewMode === 'galaxy' ? arcade.subtitle : "SELECT A GALAXY NODE TO COMMENCE WARP"}
            </p>
          </motion.div>
        </div>

        {/* View Router */}
        <AnimatePresence mode="wait">
          {viewMode === 'galaxy' ? (
            <motion.div key="galaxy" className="absolute inset-0" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={VIEW_ENTRY}>
              <Constellation projects={activeProjects} selectedProject={selection?.project || null} onSelect={handleSelect} />
              
              {/* Ascend Trigger - Moved up to bottom-10 to prevent overlapping */}
              {!selection && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-6">
                  <p className="pointer-events-none font-pixel text-[8px] uppercase tracking-[0.35em] text-white/35">
                    move cursor · click an artifact to initiate rift
                  </p>
                  <button 
                    onClick={ascendToMultiverse}
                    className="px-4 py-2 font-pixel text-[8px] uppercase tracking-widest text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/30 bg-black/40 hover:bg-[var(--accent-yellow)]/10 transition-colors"
                  >
                    ▼ Ascend to Multiverse
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="multiverse" className="absolute inset-0 flex items-center justify-center gap-12" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 2, opacity: 0 }} transition={VIEW_ENTRY}>
              {sectors.map((sector) => (
                <SectorOrb
                  key={sector.id}
                  id={sector.id}
                  color={sector.color}
                  title={sector.title}
                  year={sector.year}
                  onSelect={() => diveIntoSector(sector.id)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Rifts */}
      <AnimatePresence>
        {selection && (
          <ProjectBloom key={selection.project.id} project={selection.project} origin={selection.origin} onClose={() => setSelection(null)} />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

function SectorOrb({
  id,
  color,
  title,
  year,
  onSelect,
}: {
  id: string;
  color: string;
  title: string;
  year: string | number;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const kind = SECTOR_KIND[id] ?? "spiral";
  return (
    <motion.button
      onClick={onSelect}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      className="group relative flex flex-col items-center gap-4"
    >
      <GalaxyOrb kind={kind} color={color} size={104} hovered={hovered} />
      <div className="text-center">
        <p className="font-pixel text-[10px] uppercase tracking-widest text-white">
          {title}
        </p>
        <p className="mt-1 font-pixel text-[8px] uppercase tracking-wider text-[var(--accent-purple)]">
          EPOCH {year}
        </p>
      </div>
    </motion.button>
  );
}