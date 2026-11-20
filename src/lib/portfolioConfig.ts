// ============================================================
// PORTFOLIO CONFIG — single source of truth.
// Edit this file to update content. UI components map over it.
// ============================================================

export type BlueprintNode = { id: string; label: string; x: number; y: number };
export type BlueprintEdge = { from: string; to: string };

export type ArtifactMass = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type HexColor = `#${string}`;

export type ProjectArtifact = {
  mass: ArtifactMass;
  glowColor: HexColor;
  orbitRadius: number;
};

// ADDED: Sector type
export type Sector = {
  id: string;
  title: string;
  year: string;
  color: string;
};

export type Project = {
  id: string;
  sectorId: string; // ADDED THIS
  title: string;
  tag: string;
  blurb: string;
  stack: { name: string; role: string }[];
  bg: string;
  monitor: string;
  blueprint: { nodes: BlueprintNode[]; edges: BlueprintEdge[] };
  artifact: ProjectArtifact;
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
  };

  sectors: Sector[]; // FIXED THIS TO BE AN ARRAY

  projects: Project[];
  terminal: {
    boot: string;
    prompt: string;
    help: string[];
    whoami: string[];
    skillsAscii: string;
    runProjectLog: string[];
    runScraperLog: string[];   
    systemCheckLog: string[];
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
      "I'm an Engineering Science student at TU Hamburg, after four semesters of Computer Science and Engineering in Bangladesh.",
      "I build things where engineering meets data and AI: a thermal simulation with anomaly detection, a telemetry pipeline with LLM-written incident summaries, and a career workspace that uses an LLM for CV feedback and interview practice. I design and specify them myself and build them with AI coding assistants.",
      "Right now I'm strengthening my hands-on Python and data skills, learning German, and looking for a HiWi or Werkstudent role in AI, data or automation in Hamburg.",
    ],
    stats: [
      { k: "STR", v: 83 },
      { k: "AGI", v: 91 },
      { k: "INT", v: 87 },
      { k: "VIT", v: 79 },
    ],
  },

  contact: {
    pretitle: "◤ Final Boss: Say Hi ◢",
    headlineLead: "Let's",
    headlineHighlight: "co-op",
    blurb:
      "HiWi or Werkstudent roles, student projects, or questions about anything here: my inbox is open.",
    pressStart: "▶ Press start to send a DM",
    socials: [
      {
        key: "linkedin",
        name: "LinkedIn",
        handle: "/in/ahmedrezade",
        href: "https://www.linkedin.com/in/ahmedrezade",
        bg: "#0a66c2",
      },
      {
        key: "github",
        name: "GitHub",
        handle: "@ahmedrezaDe",
        href: "https://github.com/ahmedrezaDe",
        bg: "#171515",
      },
      {
        key: "instagram",
        name: "Instagram",
        handle: "@erzaestetics",
        href: "https://instagram.com/erzaestetics",
        bg: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
      },
    ],
  },

  arcade: {
    eyebrow: "THE GENESIS NEBULA + EPOCH 2026",
    title: "PARALLEL REALM",
    subtitle: "DRIFT THROUGH THE GALAXY. INITIATE A RIFT TO EXPLORE.",
  },

  sectors: [
    { id: "genesis", title: "Genesis", year: "2026", color: "#4a9eff" },
    { id: "elysium", title: "Elysium", year: "2027", color: "#a855f7" },
    { id: "tartarus", title: "Tartarus", year: "2028", color: "#ef4444" },
  ],

  projects: [
    {
      id: "thermal-ai-lab",
      sectorId: "genesis",
      title: "THERMAL-AI LAB",
      tag: "SIMULATION · ML",
      blurb:
        "A physics-based thermal model of a server rack (C·dT/dt = P − k(T − T_amb)) generates a week of data plus two injected faults. An Isolation Forest trained only on normal data catches the sudden compute spike but struggles with slow cooling degradation, which is the interesting result.",
      stack: [
        { name: "Python", role: "Simulation" },
        { name: "NumPy", role: "Euler integration" },
        { name: "pandas", role: "Time series" },
        { name: "scikit-learn", role: "Isolation Forest" },
      ],
      bg: "linear-gradient(135deg,#0a0f1f 0%,#0c2340 50%,#1a4a6e 100%)",
      monitor: "linear-gradient(180deg,#001023,#003a6b)",
      blueprint: {
        nodes: [
          { id: "load", label: "Power Load", x: 10, y: 50 },
          { id: "sim", label: "Thermal Model", x: 35, y: 50 },
          { id: "fault", label: "Fault Injection", x: 60, y: 25 },
          { id: "iso", label: "Isolation Forest", x: 60, y: 75 },
          { id: "eval", label: "Evaluation", x: 88, y: 50 },
        ],
        edges: [
          { from: "load", to: "sim" },
          { from: "sim", to: "fault" },
          { from: "sim", to: "iso" },
          { from: "fault", to: "iso" },
          { from: "iso", to: "eval" },
        ],
      },
      artifact: {
        mass: 8,
        glowColor: "#4a9eff",
        orbitRadius: 120,
      },
    },
    {
      id: "nexus-metric-core",
      sectorId: "genesis",
      title: "NEXUS METRIC CORE",
      tag: "TELEMETRY · AI",
      blurb:
        "A synthetic industrial telemetry pipeline: a background worker generates sensor data, stores it in PostgreSQL, flags outliers with an Isolation Forest and asks an LLM (local Mistral or Groq) to write a short incident summary.",
      stack: [
        { name: "FastAPI", role: "Backend + WebSocket" },
        { name: "PostgreSQL", role: "Storage" },
        { name: "scikit-learn", role: "Anomaly detection" },
        { name: "Mistral / Groq", role: "Incident summaries" },
        { name: "Next.js", role: "Dashboard" },
      ],
      bg: "linear-gradient(135deg,#1a3c2a 0%,#2d5a3d 50%,#73ffb8 100%)",
      monitor: "linear-gradient(180deg,#0c2418,#1f6b46)",
      blueprint: {
        nodes: [
          { id: "gen", label: "Telemetry Worker", x: 12, y: 50 },
          { id: "db", label: "PostgreSQL", x: 38, y: 25 },
          { id: "ml", label: "Isolation Forest", x: 38, y: 75 },
          { id: "llm", label: "LLM Summary", x: 65, y: 75 },
          { id: "ui", label: "Dashboard", x: 88, y: 50 },
        ],
        edges: [
          { from: "gen", to: "db" },
          { from: "db", to: "ml" },
          { from: "ml", to: "llm" },
          { from: "llm", to: "ui" },
          { from: "db", to: "ui" },
        ],
      },
      artifact: {
        mass: 9,
        glowColor: "#73ffb8",
        orbitRadius: 140,
      },
    },
    {
      id: "odyssey",
      sectorId: "genesis",
      title: "ODYSSEY",
      tag: "AI · CAREER",
      blurb:
        "A career workspace prototype I built for my own job search: CV critique, interview questions with answer feedback and outreach email drafts from an LLM, plus job-lead tracking in Supabase.",
      stack: [
        { name: "React", role: "Frontend" },
        { name: "FastAPI", role: "Backend API" },
        { name: "Groq", role: "LLM features" },
        { name: "Supabase", role: "Database + Auth" },
      ],
      bg: "linear-gradient(135deg,#2a0a2e 0%,#5e1a6e 50%,#c44569 100%)",
      monitor: "linear-gradient(180deg,#21052b,#7d1f63)",
      blueprint: {
        nodes: [
          { id: "ui", label: "React UI", x: 10, y: 50 },
          { id: "api", label: "FastAPI", x: 38, y: 50 },
          { id: "groq", label: "Groq LLM", x: 70, y: 25 },
          { id: "db", label: "Supabase", x: 70, y: 75 },
        ],
        edges: [
          { from: "ui", to: "api" },
          { from: "api", to: "groq" },
          { from: "api", to: "db" },
        ],
      },
      artifact: {
        mass: 6,
        glowColor: "#c44569",
        orbitRadius: 100,
      },
    },
    {
      id: "unfinished",
      sectorId: "genesis",
      title: "UNFINISHED.EXE",
      tag: "IN PROGRESS",
      blurb:
        "Work in progress: Tower Hunter (a Tauri desktop app that turns focus sessions into RPG progress), Lingua OS (a local-first German-learning app) and FactoryLens (a manufacturing KPI dashboard on synthetic data).",
      stack: [
        { name: "Tauri + React", role: "Tower Hunter" },
        { name: "TypeScript", role: "Lingua OS" },
        { name: "Python + Streamlit", role: "FactoryLens" },
      ],
      bg: "linear-gradient(135deg,#1a1a2e 0%,#4f46e5 100%)",
      monitor: "linear-gradient(180deg,#0e0e1f,#3b35c9)",
      blueprint: {
        nodes: [
          { id: "lab", label: "The Lab", x: 15, y: 50 },
          { id: "p1", label: "Tower Hunter", x: 55, y: 20 },
          { id: "p2", label: "Lingua OS", x: 55, y: 50 },
          { id: "p3", label: "FactoryLens", x: 55, y: 80 },
          { id: "ship", label: "→ Shipped", x: 85, y: 50 },
        ],
        edges: [
          { from: "lab", to: "p1" },
          { from: "lab", to: "p2" },
          { from: "lab", to: "p3" },
          { from: "p3", to: "ship" },
        ],
      },
      artifact: {
        mass: 4,
        glowColor: "#818cf8",
        orbitRadius: 80,
      },
    },
  ],

  terminal: {
    boot: "Parallel-OS v1.1 — type `help` to begin",
    prompt: "erza@parallel-realm:~$",
    help: [
      "available commands:",
      "  help           — list commands",
      "  clear          — wipe history",
      "  skills         — what I work with (and what I'm learning)",
      "  run project    — simulate a live build run",
      "  run-thermal    — replay the thermal-ai-lab experiment",
      "  run-telemetry  — replay a nexus-metric-core anomaly",
      "  secret         — ???",
      "  whoami         — about Erza",
      "  reset          — hard factory reset",
    ],
    whoami: [
      "Ahmed Reza (a.k.a. Erza)",
      "Engineering Science @ TU Hamburg · engineering × data × AI",
    ],
    skillsAscii: `
  SKILL TREE  ::  ERZA  ::  STUDENT BUILD
  ────────────────────────────────────────
  [USED IN MY PROJECTS]
     Python · FastAPI · pandas · scikit-learn
     React · TypeScript · PostgreSQL · SQLite
     Git · LLM APIs (Groq, llama.cpp)
  [LEARNING NOW]
     Python fundamentals (CS50P)
     data analysis with pandas
     German  A1 → A2
  [HOW I BUILD]
     I design + specify, AI assistants help write,
     I review, run and test
  ────────────────────────────────────────
  > equipped: curiosity, caffeine, chaos
`,
    runProjectLog: [
      "$ ./run-project --env=parallel-realm",
      "[boot] loading kernel modules ........... ok",
      "[boot] mounting /unfinished ............. ok",
      "[boot] verifying save-state checksum .... ok",
      "[ai]   warming up reasoning engine ...... ready",
      "[db]   connecting to postgres ........... ok",
      "[task] dispatching agent#0xA1 ........... queued",
      "[task] streaming tokens ................. ░▒▓",
      "[done] artifact written → /out/build.zip",
      "[xp]   +25 EXP gained from successful run",
      "$ _",
    ],
    runScraperLog: [
      "$ python src/simulation.py",
      "[sim]   7 days · 1-min steps · Euler method",
      "[sim]   rack temperature 26.7°C → 33.3°C ..... normal",
      "$ python src/faults.py",
      "[fault] cooling degradation  max 38.0°C",
      "[fault] compute spike        max 43.6°C",
      "$ python src/anomaly_detection.py",
      "[iso]   compute spike recall 1.00 ........... caught",
      "[iso]   cooling loss recall 0.04 ............ missed",
      "[note]  unusual ≠ slowly degrading. lesson learned.",
    ],
    systemCheckLog: [
      "$ nexus --replay anomaly",
      "[worker] hydraulic_pressure reading ........ out of range",
      "[ml]     isolation forest score ............ anomalous",
      "[db]     anomaly record written ............ ok",
      "[llm]    writing incident summary .......... done",
      "[ws]     broadcast to dashboard ............ sent",
    ],
    notFound: (cmd: string) => `command not found: ${cmd}`,
  },
};

// Backwards-compat re-exports so existing imports keep working.
export const projects = portfolioConfig.projects;
export const skillsAscii = portfolioConfig.terminal.skillsAscii;
export const runProjectLog = portfolioConfig.terminal.runProjectLog;