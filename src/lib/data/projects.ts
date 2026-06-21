export type BlueprintNode = {
  id: string;
  label: string;
  x: number; // 0-100 %
  y: number; // 0-100 %
};
export type BlueprintEdge = { from: string; to: string };

export type Project = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  stack: { name: string; role: string }[];
  bg: string;
  monitor: string; // CSS background for animated monitor
  blueprint: { nodes: BlueprintNode[]; edges: BlueprintEdge[] };
};

export const projects: Project[] = [
  {
    id: "tower-hunter",
    title: "TOWER HUNTER",
    tag: "RPG · DESKTOP",
    blurb:
      "A gamified life-OS built in Tauri + Rust. Holographic HUD, attribute bars, awakening protocol, and local SQLite save-state. Turning daily habits into a tower climb.",
    stack: [
      { name: "Rust", role: "Core engine" },
      { name: "Tauri", role: "Native shell" },
      { name: "React", role: "HUD / UI" },
      { name: "Zustand", role: "State" },
      { name: "SQLite", role: "Save state" },
    ],
    bg: "linear-gradient(135deg,#0a0f1f 0%,#0c2340 50%,#1a4a6e 100%)",
    monitor: "linear-gradient(180deg,#001023,#003a6b)",
    blueprint: {
      nodes: [
        { id: "user", label: "PLAYER", x: 8, y: 50 },
        { id: "hud", label: "HUD / React", x: 32, y: 25 },
        { id: "core", label: "Rust Core", x: 55, y: 50 },
        { id: "save", label: "SQLite", x: 80, y: 25 },
        { id: "quest", label: "Quest Engine", x: 80, y: 75 },
      ],
      edges: [
        { from: "user", to: "hud" },
        { from: "hud", to: "core" },
        { from: "core", to: "save" },
        { from: "core", to: "quest" },
        { from: "quest", to: "hud" },
      ],
    },
  },
  {
    id: "odyssey",
    title: "ODYSSEY",
    tag: "AI · JOB PLATFORM",
    blurb:
      "AI-orchestrated job pipeline with a voice interview agent, ATS scoring, and HMAC-signed webhook orchestration.",
    stack: [
      { name: "FastAPI", role: "Backend" },
      { name: "React", role: "Frontend" },
      { name: "ElevenLabs", role: "Voice" },
      { name: "OpenAI", role: "Reasoning" },
      { name: "Postgres", role: "DB" },
    ],
    bg: "linear-gradient(135deg,#2a0a2e 0%,#5e1a6e 50%,#c44569 100%)",
    monitor: "linear-gradient(180deg,#21052b,#7d1f63)",
    blueprint: {
      nodes: [
        { id: "user", label: "Candidate", x: 8, y: 50 },
        { id: "ui", label: "React UI", x: 30, y: 25 },
        { id: "api", label: "FastAPI", x: 52, y: 50 },
        { id: "voice", label: "ElevenLabs", x: 78, y: 20 },
        { id: "llm", label: "OpenAI", x: 78, y: 50 },
        { id: "db", label: "Postgres", x: 78, y: 80 },
      ],
      edges: [
        { from: "user", to: "ui" },
        { from: "ui", to: "api" },
        { from: "api", to: "voice" },
        { from: "api", to: "llm" },
        { from: "api", to: "db" },
      ],
    },
  },
  {
    id: "lex-mode",
    title: "LEXICON MODE",
    tag: "EXPERIMENT · UI",
    blurb:
      "A dual-mode interface engine. Switch any app between Operator (dense, terminal) and Resident (calm, ambient) without re-architecting state.",
    stack: [
      { name: "React", role: "View" },
      { name: "Context", role: "Mode switch" },
      { name: "TanStack", role: "Routing" },
      { name: "OKLCH", role: "Theme" },
    ],
    bg: "linear-gradient(135deg,#1a3c2a 0%,#2d5a3d 50%,#73ffb8 100%)",
    monitor: "linear-gradient(180deg,#0c2418,#1f6b46)",
    blueprint: {
      nodes: [
        { id: "app", label: "App Shell", x: 12, y: 50 },
        { id: "mode", label: "Mode Ctx", x: 40, y: 50 },
        { id: "op", label: "Operator", x: 75, y: 25 },
        { id: "res", label: "Resident", x: 75, y: 75 },
      ],
      edges: [
        { from: "app", to: "mode" },
        { from: "mode", to: "op" },
        { from: "mode", to: "res" },
      ],
    },
  },
  {
    id: "unfinished",
    title: "UNFINISHED.EXE",
    tag: "COLLECTION",
    blurb:
      "The parallel world itself — a growing archive of half-built engines, design jams, and 3 a.m. prototypes.",
    stack: [
      { name: "Various", role: "Engines" },
      { name: "TBD", role: "Future" },
    ],
    bg: "linear-gradient(135deg,#1a1a2e 0%,#4f46e5 100%)",
    monitor: "linear-gradient(180deg,#0e0e1f,#3b35c9)",
    blueprint: {
      nodes: [
        { id: "lab", label: "The Lab", x: 15, y: 50 },
        { id: "p1", label: "Proto 01", x: 55, y: 20 },
        { id: "p2", label: "Proto 02", x: 55, y: 50 },
        { id: "p3", label: "Proto ??", x: 55, y: 80 },
        { id: "ship", label: "→ Shipped", x: 85, y: 50 },
      ],
      edges: [
        { from: "lab", to: "p1" },
        { from: "lab", to: "p2" },
        { from: "lab", to: "p3" },
        { from: "p1", to: "ship" },
      ],
    },
  },
];
