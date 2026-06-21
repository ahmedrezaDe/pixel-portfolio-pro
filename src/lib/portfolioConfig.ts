// ============================================================
// PORTFOLIO CONFIG — single source of truth.
// Edit this file to update content. UI components map over it.
// ============================================================

export type BlueprintNode = { id: string; label: string; x: number; y: number };
export type BlueprintEdge = { from: string; to: string };

export type Project = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  stack: { name: string; role: string }[];
  bg: string;
  monitor: string;
  blueprint: { nodes: BlueprintNode[]; edges: BlueprintEdge[] };
};

export type StatLine = { k: string; v: number };

export type SocialKey = "instagram" | "linkedin" | "spotify" | "tiktok" | "github";
export type Social = {
  key: SocialKey;
  name: string;
  handle: string;
  href: string;
  bg: string;
};

export type PortfolioConfig = {
  identity: {
    name: string;
    alias: string;
    handle: string;
    tagline: string;
  };
  about: {
    pretitle: string;
    headlineLead: string;
    headlineHighlight: string;
    aliasLine: string;
    bio: string[];
    stats: StatLine[];
  };
  contact: {
    pretitle: string;
    headlineLead: string;
    headlineHighlight: string;
    blurb: string;
    pressStart: string;
    socials: Social[];
  };
  arcade: {
    eyebrow: string;
    title: string;
    subtitle: string;
    scrollHint: string;
  };
  projects: Project[];
  terminal: {
    boot: string;
    prompt: string;
    help: string[];
    whoami: string[];
    skillsAscii: string;
    runProjectLog: string[];
    secretOn: string;
    secretOff: string;
    notFound: (cmd: string) => string;
  };
};

export const portfolioConfig: PortfolioConfig = {
  identity: {
    name: "Ahmed Reza",
    alias: "Erza",
    handle: "@erza",
    tagline: "the parallel world of unfinished ideas",
  },

  about: {
    pretitle: "◤ Player Bio",
    headlineLead: "Hi, my name is",
    headlineHighlight: "Ahmed Reza",
    aliasLine: "But you can call me Erza.",
    bio: [
      "I make cool sh*t in the parallel world of *unfinished ideas* — prototypes, half-built engines, and weekend experiments that escape the lab when nobody is watching.",
      "I'm a creative technologist. I build things at the intersection of software, design, and play — gamified RPG dashboards, AI-driven job platforms, voice-controlled tools, and the occasional retro UI.",
      "When I'm not shipping, I'm thinking about how interfaces could feel more like video games and less like spreadsheets.",
    ],
    stats: [
      { k: "STR", v: 78 },
      { k: "AGI", v: 91 },
      { k: "INT", v: 88 },
      { k: "VIT", v: 73 },
    ],
  },

  contact: {
    pretitle: "◤ Final Boss: Say Hi ◢",
    headlineLead: "Let's",
    headlineHighlight: "co-op",
    blurb:
      "Collabs, weird ideas, prototypes, or just to say the bio made you laugh — my inbox is open across the realms.",
    pressStart: "▶ Press start to send a DM",
    socials: [
      {
        key: "instagram",
        name: "Instagram",
        handle: "@erza",
        href: "https://instagram.com",
        bg: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
      },
      {
        key: "linkedin",
        name: "LinkedIn",
        handle: "/in/erza",
        href: "https://linkedin.com",
        bg: "#0a66c2",
      },
      {
        key: "spotify",
        name: "Spotify",
        handle: "erza",
        href: "https://spotify.com",
        bg: "#1db954",
      },
      {
        key: "tiktok",
        name: "TikTok",
        handle: "@erza",
        href: "https://tiktok.com",
        bg: "#000",
      },
      {
        key: "github",
        name: "GitHub",
        handle: "@erza",
        href: "https://github.com",
        bg: "#171515",
      },
    ],
  },

  arcade: {
    eyebrow: "◤ Live Arcade Row ◢",
    title: "ERZA · ARCADE",
    subtitle: "Walk up. Drop coin. Read the blueprint.",
    scrollHint: "◀ scroll · drag · pick a cabinet ▶",
  },

  projects: [
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
  ],

  terminal: {
    boot: "ERZA-OS v1.0  ::  type `help` to begin",
    prompt: "erza@parallel-realm:~$",
    help: [
      "available commands:",
      "  help        — list commands",
      "  clear       — wipe history",
      "  skills      — print ASCII skill graph",
      "  run project — simulate a live build run",
      "  secret      — ???",
      "  whoami      — about Erza",
    ],
    whoami: [
      "Ahmed Reza (a.k.a. Erza)",
      "creative technologist · parallel realm of unfinished ideas",
    ],
    skillsAscii: `
  SKILL TREE  ::  ERZA  ::  LV.??
  ────────────────────────────────────
  [FRONTEND]   React ▰▰▰▰▰▰▰▰▰░  90
               TS    ▰▰▰▰▰▰▰▰░░  85
               CSS   ▰▰▰▰▰▰▰▰▰▰  95
  [BACKEND]    Rust  ▰▰▰▰▰▰░░░░  60
               Py    ▰▰▰▰▰▰▰▰░░  82
               Node  ▰▰▰▰▰▰▰░░░  72
  [AI/ML]      LLMs  ▰▰▰▰▰▰▰▰░░  84
               Voice ▰▰▰▰▰▰▰░░░  75
  [DESIGN]     UI/UX ▰▰▰▰▰▰▰▰▰░  90
               Pixel ▰▰▰▰▰▰▰▰▰▰  95
  ────────────────────────────────────
  > equipped: curiosity, caffeine, chaos
`,
    runProjectLog: [
      "$ ./run-project --env=parallel-realm",
      "[boot] loading kernel modules ........... ok",
      "[boot] mounting /unfinished ............. ok",
      "[boot] verifying save-state checksum .... ok",
      "[net]  reaching out to api.erza.dev ..... 200",
      "[ai]   warming up reasoning engine ...... ready",
      "[db]   connecting to postgres ........... pool=8",
      "[ws]   opening websocket /live .......... open",
      "[hmac] verifying webhook signature ...... valid",
      "[task] dispatching agent#0xA1 ........... queued",
      "[task] agent#0xA1 picked up job ......... working",
      "[task] streaming tokens ................. ░▒▓",
      "[task] tokens=1284  cost=$0.0142  t=2.41s",
      "[done] artifact written → /out/build.zip",
      "[xp]   +25 EXP gained from successful run",
      "$ _",
    ],
    secretOn: "▓▓ SECRET UNLOCKED ▓▓  +75 XP  ·  hidden theme engaged",
    secretOff: "secret theme: OFF · normal world restored",
    notFound: (cmd: string) => `command not found: ${cmd}`,
  },
};

// Backwards-compat re-exports so existing imports keep working.
export const projects = portfolioConfig.projects;
export const skillsAscii = portfolioConfig.terminal.skillsAscii;
export const runProjectLog = portfolioConfig.terminal.runProjectLog;
